export const NAV_ITEMS = [
  { label: "Home", href: "#home" },
  { label: "Collection", href: "#collection" },
  { label: "Build Your Own", href: "#custom" },
  { label: "Diamonds", href: "#diamonds" },
  { label: "Contact", href: "#contact" },
] as const;

export const SCENE_IDS = [
  "home",
  "philosophy",
  "collection",
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
    image: "/images/gallery/ring1.png",
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
    description: "Channel-set diamond eternity band — an unbroken circle of light.",
    specs: "Platinum · 2.4ctw Round Brilliant · VS1 Clarity",
    price: "From $5,800",
    image: "/images/gallery/ring3.png",
  },
  {
    name: "Heirloom",
    category: "TENNIS BRACELET",
    description: "Classic four-prong diamond tennis bracelet — every link a masterpiece.",
    specs: "18K White Gold · 8.0ctw Round · VS1 Clarity",
    price: "From $12,500",
    image: "/images/gallery/bracelet2.png",
  },
  {
    name: "The Montaire Solitaire",
    category: "ENGAGEMENT RING",
    description: "Cathedral setting with a single round brilliant — pure, refined, iconic.",
    specs: "Platinum · 1.5ct Round · VVS1 Clarity",
    price: "From $6,900",
    image: "/images/gallery/solitaire1.png",
  },
  {
    name: "Aurelia",
    category: "STATEMENT RING",
    description: "Bold multi-stone cocktail ring with emerald, ruby, sapphire, and diamond — for those who refuse to blend in.",
    specs: "18K Yellow Gold · 5.0ctw Mixed Gemstones",
    price: "From $15,200",
    image: "/images/gallery/cocktail1.png",
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
