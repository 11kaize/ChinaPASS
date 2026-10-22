import type { SavedPlace } from "./places";
import type { Language, Phrase } from "./content";
export type Preferences = {
  language: Language;
  appearance: "system" | "light" | "dark";
  city: string | null;
  arrivalPort: string | null;
  arrivalTask: string | null;
  stage: "before" | "arrived" | "settled";
  prep: string[];
  steps: Record<string, number[]>;
  favorites: string[];
  customCards: Phrase[];
  address: { name: string; address: string; phone: string };
  places: SavedPlace[];
  defaultPlaceId: string | null;
  onboarded: boolean;
  shareContext: boolean;
};
export const freshPreferences = (): Preferences => ({
  language: "en",
  appearance: "system",
  city: null,
  arrivalPort: null,
  arrivalTask: null,
  stage: "before",
  prep: [],
  steps: {},
  favorites: [],
  customCards: [],
  address: { name: "", address: "", phone: "" },
  places: [],
  defaultPlaceId: null,
  onboarded: false,
  shareContext: true,
});
// Whitelist projection: even an accidentally merged API config cannot be persisted.
export function persistable(p: Preferences): Preferences {
  return {
    language: p.language,
    appearance: p.appearance,
    city: p.city,
    arrivalPort: p.arrivalPort,
    arrivalTask: p.arrivalTask,
    stage: p.stage,
    prep: p.prep,
    steps: p.steps,
    favorites: p.favorites,
    customCards: p.customCards,
    address: p.address,
    places: Array.isArray(p.places)
      ? p.places
          .slice(0, 30)
          .filter(
            (place) =>
              place &&
              typeof place.id === "string" &&
              typeof place.address === "string" &&
              typeof place.name === "string",
          )
          .map((place) => ({
            id: place.id,
            category: ["hotel", "transport", "school", "other"].includes(
              place.category,
            )
              ? place.category
              : "other",
            name: place.name.slice(0, 150),
            address: place.address.slice(0, 500),
            phone:
              typeof place.phone === "string" ? place.phone.slice(0, 25) : "",
          }))
      : [],
    defaultPlaceId:
      typeof p.defaultPlaceId === "string" ? p.defaultPlaceId : null,
    onboarded: p.onboarded,
    shareContext: p.shareContext,
  };
}
