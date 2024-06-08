import { useEffect, useState } from "react";
import { Symbol } from "@/types/chart";

export const useRealtimePrice = (symbol: Symbol) => {
  const [realtimePrice, setRealtimePrice] = useState<number>(0);
  const [historicalData, setHistoricalData] = useState<[number, number][]>([]);

  useEffect(() => {
    const socket = new WebSocket(
      `wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@kline_1m`
    );

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const price = parseFloat(data.k.c);
      setRealtimePrice(price);
      setHistoricalData((prev) => [...prev, [data.k.T, price]]);
    };

    return () => socket.close();
  }, [symbol]);

  return { realtimePrice, historicalData };
};