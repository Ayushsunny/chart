export const fetchHistoricalData = async (symbol: string, interval: string) => {
  const response = await fetch(
    `https://data-api.binance.vision/api/v3/klines?symbol=${symbol}&interval=${interval}`
  );
  const data = await response.json();
  return data.map((d: any[]) => [d[0], parseFloat(d[4])]) as [number, number][];
};
