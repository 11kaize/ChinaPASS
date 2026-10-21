// Crystal blue palette, with native accessibility fallbacks in material.tsx.
export const light = {
  bg: "#EFF5FC", surface: "#FFFFFF", raised: "#E6EEF9", ink: "#102442",
  secondary: "#526680", line: "#D8E4F1", accent: "#246BEB", accentSoft: "#E0EDFF",
  onAccent: "#FFFFFF", danger: "#C3404B", dangerSoft: "#FFF0F1", placeholder: "#6F8097",
};
export const dark = {
  bg: "#0B1425", surface: "#142139", raised: "#202F48", ink: "#F1F6FF",
  secondary: "#A6B8D2", line: "#31415C", accent: "#94BDFF", accentSoft: "#203C65",
  onAccent: "#0B2145", danger: "#FFA9B2", dangerSoft: "#462A38", placeholder: "#A3B4CB",
};
export type Palette = typeof light;
