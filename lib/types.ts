export type Market = { market: string; division: string; min: number; max: number };
export type Product = {
  id: number; slug: string; nameBn: string; category: string; categoryNameBn: string; categoryIcon: string;
  unit: string; image: string; today: number | string; yesterday: number | string; lastWeek: number; lastMonth: number;
  change: { dir: "up" | "down" | "flat"; pct: number }; markets: Market[];
};
export type Category = { id: string; slug: string; nameBn: string; icon: string };
