// hooks/useRealtimePrice.ts

import { useEffect, useState } from "react";
import { Symbol } from "@/types/chart";

export const useRealtimePrice = (symbol: Symbol) => {
  const [realtimePrice, setRealtimePrice] = useState<number>(0);
  const [realtimeData, setRealtimeData] = useState<[number, number][]>([]);

  useEffect(() => {
    const socket = new WebSocket(
      `wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@kline_1m`
    );

    // Reset realtimeData when symbol changes
    setRealtimeData([]);

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const price = parseFloat(data.k.c);
      setRealtimePrice(price);
      setRealtimeData((prev) => [...prev, [data.k.T, price]]);
    };

    return () => socket.close();
  }, [symbol]);

  return { realtimePrice, realtimeData };
};