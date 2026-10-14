import type { Language, Phrase } from "./content";
export type Preferences = {
  language: Language;
  appearance: "system" | "light" | "dark";
  city: string | null;
  stage: "before" | "arrived" | "settled";
  prep: string[];
  steps: Record<string, number[]>;
  favorites: string[];
  customCards: Phrase[];
  address: { name: string; address: string; phone: string };
  onboarded: boolean;
  shareContext: boolean;
};
export const freshPreferences = (): Preferences => ({
  language: "en",
  appearance: "system",
  city: null,
  stage: "before",
  prep: [],
  steps: {},
  favorites: [],
  customCards: [],
  address: { name: "", address: "", phone: "" },
  onboarded: false,
  shareContext: true,
});
// Whitelist projection: even an accidentally merged API config cannot be persisted.
export function persistable(p: Preferences): Preferences {
  return {
    language: p.language,
    appearance: p.appearance,
    city: p.city,
    stage: p.stage,
    prep: p.prep,
    steps: p.steps,
    favorites: p.favorites,
    customCards: p.customCards,
    address: p.address,
    onboarded: p.onboarded,
    shareContext: p.shareContext,
  };
}
