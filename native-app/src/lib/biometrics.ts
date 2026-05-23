import * as LocalAuthentication from "expo-local-authentication";

export async function checkBiometricSupport() {
  const hasHardware = await LocalAuthentication.hasHardwareAsync();
  if (!hasHardware) {
    return "This device does not support biometric unlock.";
  }

  const enrolled = await LocalAuthentication.isEnrolledAsync();
  if (!enrolled) {
    return "Biometrics are available, but no Face ID, Touch ID, or fingerprint is enrolled.";
  }

  const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
  const labels = types.map((type) => {
    if (type === LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION) return "Face ID";
    if (type === LocalAuthentication.AuthenticationType.FINGERPRINT) return "Fingerprint";
    return "Device passcode";
  });

  return `Ready: ${labels.join(", ")}`;
}
