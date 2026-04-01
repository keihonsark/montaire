export const NAV_ITEMS = [
  { label: "Home", href: "#home" },
  { label: "Collection", href: "#collection" },
  { label: "Build Your Own", href: "#custom" },
  { label: "Diamonds", href: "#diamonds" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
] as const;

export const SCENE_IDS = [
  "home",
  "philosophy",
  "collection",
  "custom",
  "diamonds",
  "about",
  "contact",
] as const;

export const COLORS = {
  black: "#0A0A0A",
  dark: "#111111",
  card: "#1A1A1A",
  gold: "#C9A84C",
  goldLight: "#D4B96A",
  goldDim: "rgba(201, 168, 76, 0.15)",
  white: "#F5F5F0",
  whiteDim: "rgba(245, 245, 240, 0.5)",
  gray: "rgba(255, 255, 255, 0.35)",
  border: "rgba(255, 255, 255, 0.06)",
} as const;
