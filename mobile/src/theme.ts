// iOS-inspired native UI. No web glass approximation or WebView is used.
// Radius system: grouped surfaces 24, small controls 14, chips circular.
export const light = {
  bg: "#F3F5F4",
  surface: "#FCFDFC",
  raised: "#E9EDEA",
  ink: "#19251F",
  secondary: "#53665A",
  line: "#DDE4DF",
  accent: "#216348",
  accentSoft: "#E0EDE4",
  onAccent: "#F7FAF8",
  danger: "#B83732",
  dangerSoft: "#FCECEB",
  placeholder: "#677A6C",
};
export const dark = {
  bg: "#101813",
  surface: "#1C2720",
  raised: "#28372D",
  ink: "#F2F6F3",
  secondary: "#B2C4B7",
  line: "#35483B",
  accent: "#A3D7B5",
  accentSoft: "#2B4434",
  onAccent: "#12301F",
  danger: "#FFAAA5",
  dangerSoft: "#422625",
  placeholder: "#A3B7A8",
};
export type Palette = typeof light;
