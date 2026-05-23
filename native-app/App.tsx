import { StatusBar } from "expo-status-bar";
import * as Calendar from "expo-calendar";
import { useMemo, useRef } from "react";
import { Alert, Linking, Platform, SafeAreaView, StyleSheet } from "react-native";
import { WebView } from "react-native-webview";
import type { WebViewMessageEvent, WebViewNavigation } from "react-native-webview";

import { registerForPushNotificationsAsync } from "./src/lib/notifications";
import { webAppHtml } from "./src/webAppHtml";

type NativeMessage =
  | { type: "external"; url?: string }
  | { type: "notify" }
  | { type: "calendar"; event?: CalendarEventPayload }
  | { type: "ready" };

type CalendarEventPayload = {
  id?: string;
  title?: string;
  date?: string;
  time?: string;
  location?: string;
  description?: string;
  category?: string;
};

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

  function calendarDates(event: CalendarEventPayload) {
    const date = event.date && /^\d{4}-\d{2}-\d{2}$/.test(event.date) ? event.date : new Date().toISOString().slice(0, 10);
    const time = event.time || "All day";

    if (!time || time === "All day") {
      const startDate = new Date(`${date}T00:00:00`);
      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 1);
      return { startDate, endDate, allDay: true };
    }

    const match = time.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
    const startDate = new Date(`${date}T09:00:00`);
    if (match) {
      let hour = Number(match[1]);
      const minute = Number(match[2]);
      const meridiem = match[3].toUpperCase();
      if (meridiem === "PM" && hour !== 12) hour += 12;
      if (meridiem === "AM" && hour === 12) hour = 0;
      startDate.setHours(hour, minute, 0, 0);
    }

    const endDate = new Date(startDate);
    endDate.setMinutes(startDate.getMinutes() + 90);
    return { startDate, endDate, allDay: false };
  }

  async function writableCalendarId() {
    if (Platform.OS === "ios") {
      const defaultCalendar = await Calendar.getDefaultCalendarAsync();
      if (defaultCalendar?.allowsModifications) return defaultCalendar.id;
    }

    const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
    const writable = calendars.find((calendar) => calendar.allowsModifications);
    if (writable) return writable.id;

    if (Platform.OS === "android") {
      const source =
        calendars.find((calendar) => calendar.source)?.source ??
        ({ isLocalAccount: true, name: "PPCCC" } as Calendar.Source);
      return Calendar.createCalendarAsync({
        title: "PPCCC",
        color: "#b77a31",
        entityType: Calendar.EntityTypes.EVENT,
        source,
        name: "PPCCC",
        ownerAccount: "PPCCC",
        accessLevel: Calendar.CalendarAccessLevel.OWNER,
      });
    }

    throw new Error("No writable calendar was found.");
  }

  async function addCalendarEvent(event?: CalendarEventPayload) {
    if (!event) return;

    const permission = await Calendar.requestCalendarPermissionsAsync();
    if (permission.status !== "granted") {
      Alert.alert("Calendar Permission", "Allow calendar access to add church events to this device.");
      return;
    }

    try {
      const calendarId = await writableCalendarId();
      const { startDate, endDate, allDay } = calendarDates(event);
      await Calendar.createEventAsync(calendarId, {
        title: event.title || "Palo Pinto Cowboy Church Event",
        startDate,
        endDate,
        allDay,
        location: event.location || "Palo Pinto Cowboy Church",
        notes: event.description || event.category || "Palo Pinto Cowboy Church event",
      });
      Alert.alert("Added to Calendar", `${event.title || "Event"} was added to this device.`);
    } catch {
      Alert.alert("Calendar", "This device could not add the event to Calendar.");
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

    if (message.type === "calendar") {
      addCalendarEvent(message.event);
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
        source={{ html, baseUrl: "https://app.ppccc.local/" }}
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
