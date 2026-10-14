import "react-native-svg";
// Phosphor's source entry supports an optional CSS interop className. Native SVG
// ignores it; declaring that optional prop allows checking the upstream source
// while importing only the icons we use instead of bundling its whole catalogue.
declare module "react-native-svg" {
  interface SvgProps {
    className?: string;
  }
}
