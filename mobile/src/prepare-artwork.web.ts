import { artwork } from "./artwork";

let preparation: Promise<void> | undefined;
// Keep decoded artwork warm across route and appearance changes.
const decoded: HTMLImageElement[] = [];
export function prepareArtwork(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (!preparation) {
    preparation = Promise.allSettled(
      Object.values(artwork).map((source) => {
        const image = new window.Image();
        decoded.push(image);
        image.decoding = "async";
        if (typeof image.decode === "function") {
          image.src = source.uri;
          return image.decode();
        }
        return new Promise<void>((resolve, reject) => {
          image.onload = () => resolve();
          image.onerror = () => reject(new Error("Artwork could not decode"));
          image.src = source.uri;
        });
      }),
    ).then(() => {});
  }
  return preparation;
}
