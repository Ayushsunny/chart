import { AVAILABLE_SYMBOLS, AVAILABLE_INTERVALS } from "@/constants/chartConstants";

export type Symbol = typeof AVAILABLE_SYMBOLS[number];
export type Interval = typeof AVAILABLE_INTERVALS[number];
export type Holdings = Record<Symbol, number>;

export interface ChartProps {
  session: {
    user: {
      name?: string;
    };
  };
}

export type Watchlist = Symbol[];