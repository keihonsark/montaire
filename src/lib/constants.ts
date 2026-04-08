export const NAV_ITEMS = [
  { label: "Home", href: "#home" },
  { label: "Collection", href: "#collection" },
  { label: "Process", href: "#process" },
  { label: "Build Your Own", href: "#custom" },
  { label: "Diamonds", href: "#diamonds" },
  { label: "Contact", href: "#contact" },
] as const;

export const SCENE_IDS = [
  "home",
  "philosophy",
  "collection",
  "process",
  "custom",
  "diamonds",
  "contact",
] as const;

export const COLLECTION_ITEMS = [
  {
    name: "The Sovereign",
    category: "ENGAGEMENT RING",
    description: "Round brilliant solitaire on a classic yellow gold band — timeless elegance, bold presence.",
    specs: "18K Yellow Gold · 2.0ct Round Brilliant · VS1 Clarity",
    price: "From $8,400",
    image: "/images/gallery/solitaire2.png",
  },
  {
    name: "Lumière",
    category: "PENDANT NECKLACE",
    description: "Floating diamond pendant on a delicate chain — effortless brilliance for every occasion.",
    specs: "18K White Gold · 0.75ct Round · VVS2 Clarity",
    price: "From $3,200",
    image: "/images/gallery/ring2.png",
  },
  {
    name: "Eclipse",
    category: "WEDDING BAND",
    description: "Diamond eternity band — an unbroken circle of light.",
    specs: "Platinum · 2.4ctw Round Brilliant · VS1 Clarity",
    price: "From $5,800",
    image: "/images/gallery/eternity1.png",
  },
  {
    name: "Heirloom",
    category: "DIAMOND BRACELET",
    description: "Curved diamond bracelet — fluid luxury that follows every movement.",
    specs: "18K White Gold · 4.0ctw Round · VS1 Clarity",
    price: "From $9,500",
    image: "/images/gallery/bracelet3.png",
  },
  {
    name: "The Montaire Solitaire",
    category: "ENGAGEMENT RING",
    description: "Cushion-cut diamond in a cathedral halo setting — tradition reimagined with modern precision.",
    specs: "18K Yellow Gold · 1.5ct Cushion · VS2 Clarity",
    price: "From $6,900",
    image: "/images/gallery/cushion1.png",
  },
  {
    name: "Aurelia",
    category: "STATEMENT RING",
    description: "Emerald-cut diamond surrounded by a double pavé halo — commanding, unmistakable, unforgettable.",
    specs: "18K Yellow Gold · 3.0ct Emerald Cut · VS1 Clarity",
    price: "From $15,200",
    image: "/images/gallery/emerald1.png",
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
