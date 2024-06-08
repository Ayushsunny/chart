import { useEffect, useState } from "react";
import { fetchHistoricalData } from "@/services/api";
import { Symbol, Interval } from "@/types/chart";

export const useHistoricalData = (symbol: Symbol, interval: Interval) => {
  const [historicalData, setHistoricalData] = useState<[number, number][]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchHistoricalData(symbol, interval);
      setHistoricalData(data);
    };

    fetchData();
  }, [symbol, interval]);

  return historicalData;
};