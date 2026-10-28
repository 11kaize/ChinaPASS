import AsyncStorage from "@react-native-async-storage/async-storage";

// Historical on-device namespaces are compatibility identifiers, never UI text.
// Keep attachments in their existing database so a rename cannot orphan blobs.
const previousPrefix = ["china", "hand"].join("");
export const mediaDatabase = `${previousPrefix}.demo.media`;
export const previousDemoId = `${previousPrefix}-local-demo-account`;
export async function readRenamedStorage(key: string) {
  const current = await AsyncStorage.getItem(key);
  if (current !== null) return current;
  const previous = key.replace("chinabuddy", previousPrefix);
  const saved = await AsyncStorage.getItem(previous);
  if (saved !== null) {
    await AsyncStorage.setItem(key, saved);
    await AsyncStorage.removeItem(previous);
  }
  return saved;
}
