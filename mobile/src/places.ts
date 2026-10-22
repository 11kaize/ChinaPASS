import { content } from "./content";
import type { Preferences } from "./preferences";
export type SavedPlace = {
  id: string;
  category: "hotel" | "transport" | "school" | "other";
  name: string;
  address: string;
  phone: string;
};
export function savedPlaces(prefs: Preferences): SavedPlace[] {
  const places = prefs.places || [];
  if (
    !prefs.address.address.trim() ||
    places.some(
      (place) =>
        place.address === prefs.address.address &&
        place.name === prefs.address.name,
    )
  )
    return places;
  return [
    { id: "legacy-address", category: "hotel", ...prefs.address },
    ...places,
  ];
}
export function defaultPlaceId(prefs: Preferences) {
  const places = savedPlaces(prefs);
  return places.some((place) => place.id === prefs.defaultPlaceId)
    ? prefs.defaultPlaceId
    : places[0]?.id || null;
}
export function walletPatch(
  prefs: Preferences,
  places: SavedPlace[],
  selected = defaultPlaceId(prefs),
): Pick<Preferences, "places" | "defaultPlaceId" | "address"> {
  const active = places.find((place) => place.id === selected) || places[0];
  return {
    places,
    defaultPlaceId: active?.id || null,
    address: active
      ? { name: active.name, address: active.address, phone: active.phone }
      : { name: "", address: "", phone: "" },
  };
}
export const placeCatalog = [
  ...content.ports.map((port) => ({
    id: `port-${port.id}`,
    name: port.zh,
    city: port.city || port.cityZh || "",
    address: port.zh,
    phone: "",
    category: "transport" as const,
  })),
  ...content.cities.flatMap((city) =>
    [...city.airport, ...city.stations].map((address, i) => ({
      id: `city-${city.id}-${i}`,
      name: address,
      city: city.name,
      address,
      phone: "",
      category: "transport" as const,
    })),
  ),
].filter((place, index, all) => {
  const key = (text: string) => text.replace(/[（(][A-Z]{3}[）)]/g, "").trim();
  return (
    all.findIndex((item) => key(item.address) === key(place.address)) === index
  );
});

export function placeLines(place: { name: string; address: string }) {
  return [
    ...new Set([place.name.trim(), place.address.trim()].filter(Boolean)),
  ].join("\n");
}
