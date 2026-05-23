import { StatusBar } from "expo-status-bar";
import { useMemo, useRef } from "react";
import { Alert, Linking, Platform, SafeAreaView, StyleSheet } from "react-native";
import { WebView } from "react-native-webview";
import type { WebViewMessageEvent, WebViewNavigation } from "react-native-webview";

import { registerForPushNotificationsAsync } from "./src/lib/notifications";
import { webAppHtml } from "./src/webAppHtml";

type NativeMessage =
  | { type: "external"; url?: string }
  | { type: "notify" }
  | { type: "ready" };

const nativeBridge = `
  (function () {
    window.__PPCCC_NATIVE_APP__ = true;

    function send(message) {
      try {
        window.ReactNativeWebView.postMessage(JSON.stringify(message));
      } catch (error) {}
    }

    var originalOpen = window.open;
    window.open = function (url) {
      send({ type: "external", url: String(url || "") });
      return null;
    };

    document.addEventListener("click", function (event) {
      var target = event.target && event.target.closest ? event.target.closest("a[href]") : null;
      if (!target) return;
      var href = target.getAttribute("href") || "";
      if (/^(mailto:|tel:|sms:|maps:|geo:|https:\\/\\/maps\\.apple\\.com|https:\\/\\/www\\.google\\.com\\/maps)/i.test(href)) {
        event.preventDefault();
        send({ type: "external", url: href });
      }
    }, true);

    document.addEventListener("click", function (event) {
      var target = event.target && event.target.closest ? event.target.closest("#notifyButton") : null;
      if (!target) return;
      event.preventDefault();
      send({ type: "notify" });
    }, true);

    send({ type: "ready" });
  })();
  true;
`;

function isExternalUrl(url: string) {
  return /^(mailto:|tel:|sms:|maps:|geo:|https:\/\/maps\.apple\.com|https:\/\/www\.google\.com\/maps)/i.test(url);
}

export default function App() {
  const webRef = useRef<WebView>(null);
  const html = useMemo(() => webAppHtml, []);

  async function enablePush() {
    const result = await registerForPushNotificationsAsync();
    Alert.alert(result.ok ? "Notifications Ready" : "Notifications", result.message);
  }

  async function openExternal(url?: string) {
    if (!url) return;

    try {
      await Linking.openURL(url);
    } catch {
      Alert.alert("Unable to open", "This device could not open that link.");
    }
  }

  function handleMessage(event: WebViewMessageEvent) {
    let message: NativeMessage | null = null;

    try {
      message = JSON.parse(event.nativeEvent.data) as NativeMessage;
    } catch {
      return;
    }

    if (message.type === "external") {
      openExternal(message.url);
    }

    if (message.type === "notify") {
      enablePush();
    }
  }

  function handleNavigation(request: WebViewNavigation) {
    if (request.url === "about:blank" || request.url.startsWith("data:text/html")) {
      return true;
    }

    if (isExternalUrl(request.url)) {
      openExternal(request.url);
      return false;
    }

    return true;
  }

  return (
    <SafeAreaView style={styles.shell}>
      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
      <WebView
        ref={webRef}
        source={{ html }}
        originWhitelist={["*"]}
        javaScriptEnabled
        domStorageEnabled
        allowsInlineMediaPlayback
        mediaPlaybackRequiresUserAction={false}
        setSupportMultipleWindows={false}
        injectedJavaScript={nativeBridge}
        onMessage={handleMessage}
        onShouldStartLoadWithRequest={handleNavigation}
        style={styles.webview}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  shell: {
    flex: 1,
    backgroundColor: "#17120d",
  },
  webview: {
    flex: 1,
    backgroundColor: "#17120d",
  },
});
