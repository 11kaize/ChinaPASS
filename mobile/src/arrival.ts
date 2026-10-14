import { content, ArrivalPort, Language } from "./content";
const normalize = (value: string) => value.toLowerCase().replace(/[’'\s]/g, "");
export const arrivalText = (key: string, language: Language) => content.arrivalLabels[language]?.[key] || content.arrivalLabels.en[key] || key;
export function cityForPort(port: ArrivalPort) {
  return content.cities.find((city) => normalize(city.name) === normalize(port.city || ""));
}
export function portCityLabel(port: ArrivalPort, language: Language) {
  const city = content.cityLabels.find((c) => normalize(c.city) === normalize(port.city || ""));
  if (city) return language === "en" ? city.city : city[language];
  if (port.cityZh === "香港") return { en: "Hong Kong", zh: "香港", ja: "香港", ko: "홍콩" }[language];
  return port.city || port.cityZh || port.zh;
}
export function portSelection(port: ArrivalPort) {
  return { arrivalPort: port.id, city: cityForPort(port)?.id || null };
}
export function portKindLabel(port: ArrivalPort, language: Language) {
  return arrivalText({ air: "portAir", rail: "portRail", sea: "portSea", land: "portLand" }[port.kind], language);
}
