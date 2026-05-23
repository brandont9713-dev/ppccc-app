import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

import { invokeSupabaseFunction, supabaseReady } from "./supabase";

const easProjectId = "f1abd24a-4471-4766-aa0f-8f3188411106";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function registerForPushNotificationsAsync() {
  if (!Device.isDevice) {
    return { ok: false, message: "Push notifications need a real iPhone or Android device." };
  }

  const existing = await Notifications.getPermissionsAsync();
  let status = existing.status;

  if (status !== "granted") {
    const requested = await Notifications.requestPermissionsAsync();
    status = requested.status;
  }

  if (status !== "granted") {
    return { ok: false, message: "Notification permission was not granted." };
  }

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "Default",
      importance: Notifications.AndroidImportance.MAX,
    });
  }

  const token = await Notifications.getExpoPushTokenAsync({ projectId: easProjectId });

  let savedToBackend = false;

  if (supabaseReady) {
    try {
      await invokeSupabaseFunction("register-push-token", {
        body: {
          expoPushToken: token.data,
          platform: Platform.OS === "ios" ? "ios" : "android",
          deviceName: Device.deviceName,
        },
      });
      savedToBackend = true;
    } catch {
      savedToBackend = false;
    }
  }

  return {
    ok: true,
    message: savedToBackend
      ? "Push notifications are connected for this device."
      : supabaseReady
        ? "Push token ready. Sign in is needed before it can be attached to a church account."
      : "Push token ready. Add Supabase keys to save it for this user/device.",
    token: token.data,
  };
}
