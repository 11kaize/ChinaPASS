import type { ImagePickerAsset } from "expo-image-picker";
import type { Media } from "./domain/community";
function database(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("chinahand.demo.media", 1);
    request.onupgradeneeded = () => {
      request.result.createObjectStore("blobs");
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(new Error("Media storage is unavailable."));
  });
}
export async function persistMedia(
  asset: ImagePickerAsset,
  id: string,
): Promise<Media> {
  const blob = asset.file || (await (await fetch(asset.uri)).blob());
  if (blob.size > 30 * 1024 * 1024)
    throw new Error("Choose a file under 30 MB for this demo.");
  const db = await database();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction("blobs", "readwrite");
    tx.objectStore("blobs").put(blob, id);
    tx.oncomplete = () => {
      db.close();
      resolve();
    };
    tx.onerror = () => {
      db.close();
      reject(new Error("Media storage is full. Choose a smaller file."));
    };
  });
  const type = asset.type === "video" ? "video" : "image";
  return {
    id,
    uri: `media://${id}`,
    type,
    mime: asset.mimeType || blob.type,
    name: asset.fileName || `${type} attachment`,
  };
}
export async function resolveMedia(uri: string): Promise<string> {
  if (!uri.startsWith("media://")) return uri;
  const db = await database();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("blobs");
    const req = tx.objectStore("blobs").get(uri.slice(8));
    req.onsuccess = () => {
      if (req.result instanceof Blob) resolve(URL.createObjectURL(req.result));
      else
        reject(new Error("Attachment is no longer available on this device."));
    };
    req.onerror = () => reject(new Error("Could not read attachment."));
    tx.oncomplete = () => db.close();
  });
}
export async function deleteMedia(media: Media) {
  const db = await database();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction("blobs", "readwrite");
    tx.objectStore("blobs").delete(media.id);
    tx.oncomplete = () => {
      db.close();
      resolve();
    };
    tx.onerror = () => {
      db.close();
      reject(new Error("Could not delete attachment."));
    };
  });
}
export async function clearAllMedia() {
  const db = await database();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction("blobs", "readwrite");
    tx.objectStore("blobs").clear();
    tx.oncomplete = () => {
      db.close();
      resolve();
    };
    tx.onerror = () => {
      db.close();
      reject(new Error("Could not clear local media."));
    };
  });
}
