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

export const COLLECTION_ITEMS = [
  {
    name: "The Sovereign",
    category: "ENGAGEMENT RING",
    description: "Oval solitaire on a knife-edge band, designed to capture light from every angle.",
    specs: "18K Yellow Gold · 2.0ct Oval · VS1 Clarity",
    price: "From $8,400",
  },
  {
    name: "Lumière",
    category: "PENDANT NECKLACE",
    description: "Floating diamond pendant on a delicate chain — effortless brilliance.",
    specs: "Platinum · 0.75ct Round · VVS2 Clarity",
    price: "From $3,200",
  },
  {
    name: "Eclipse",
    category: "WEDDING BAND",
    description: "Channel-set diamond eternity band with seamless, unbroken sparkle.",
    specs: "18K White Gold · 2.4ctw · VS1 Clarity",
    price: "From $5,800",
  },
  {
    name: "Heirloom",
    category: "TENNIS BRACELET",
    description: "Classic four-prong tennis bracelet — timeless elegance for generations.",
    specs: "Platinum · 8.0ctw Round · VS1 Clarity",
    price: "From $12,500",
  },
  {
    name: "The Montaire Solitaire",
    category: "ENGAGEMENT RING",
    description: "Cathedral setting with hidden halo — tradition reimagined with modern precision.",
    specs: "18K Rose Gold · 1.5ct Cushion · VS2 Clarity",
    price: "From $6,900",
  },
  {
    name: "Aurelia",
    category: "STATEMENT RING",
    description: "Bold cocktail ring with pavé surround — for those who command attention.",
    specs: "18K Yellow Gold · 3.0ct Emerald Cut · VS1 Clarity",
    price: "From $15,200",
  },
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
