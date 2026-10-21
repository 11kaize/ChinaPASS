import { Directory, File, Paths } from "expo-file-system";
import type { ImagePickerAsset } from "expo-image-picker";
import type { Media } from "./domain/community";
export async function persistMedia(
  asset: ImagePickerAsset,
  id: string,
): Promise<Media> {
  const type = asset.type === "video" ? "video" : "image",
    mime = asset.mimeType || (type === "video" ? "video/mp4" : "image/jpeg");
  if (asset.fileSize && asset.fileSize > 30 * 1024 * 1024)
    throw new Error("Choose a file under 30 MB for this demo.");
  const directory = new Directory(Paths.document, "community-media");
  directory.create({ idempotent: true, intermediates: true });
  const extension =
    (asset.fileName || asset.uri)
      .split(".")
      .pop()
      ?.split("?")[0]
      ?.replace(/[^a-z0-9]/gi, "") || (type === "video" ? "mp4" : "jpg");
  const destination = new File(directory, `${id}.${extension}`);
  await new File(asset.uri).copy(destination);
  return {
    id,
    uri: destination.uri,
    type,
    mime,
    name: asset.fileName || `${type}.${extension}`,
  };
}
export async function resolveMedia(uri: string) {
  return uri;
}
export async function deleteMedia(media: Media) {
  const file = new File(media.uri);
  if (file.exists) file.delete();
}
export async function clearAllMedia() {
  const directory = new Directory(Paths.document, "community-media");
  if (directory.exists) directory.delete();
}
