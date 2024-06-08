"use client";
import React, { useState, useRef, useCallback } from "react";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import "highcharts/modules/exporting";
import "highcharts/modules/export-data";
import {
  DEFAULT_SYMBOL,
  DEFAULT_INTERVAL,
  AVAILABLE_SYMBOLS,
  AVAILABLE_INTERVALS,
  INITIAL_BALANCE,
  INITIAL_WATCHLIST,
} from "@/constants/chartConstants";
import { Symbol, Interval, Holdings, ChartProps, Watchlist } from "@/types/chart";
import { useHistoricalData } from "@/hooks/useHistoricalData";
import { useRealtimePrice } from "@/hooks/useRealtimePrice";
import { WatchlistCard } from "./WatchlistCard";
import { TradeCard } from "./TradeCard";
import { getChartOptions } from "./ChartOptions";
import Logout from "@/components/Logout/logout";


const Chart: React.FC<ChartProps> = ({ session }) => {
  const [symbol, setSymbol] = useState<Symbol>(DEFAULT_SYMBOL);
  const [interval, setInterval] = useState<Interval>(DEFAULT_INTERVAL);
  const [isBuy, setIsBuy] = useState<boolean>(true);
  const [quantity, setQuantity] = useState<string>("");
  const [paperBalance, setPaperBalance] = useState<number>(INITIAL_BALANCE);
  const [holdings, setHoldings] = useState<Holdings>({} as Holdings);
  const [watchlist, setWatchlist] = useState<Watchlist>([...INITIAL_WATCHLIST]);
  const [showWatchlist, setShowWatchlist] = useState<boolean>(false);
  const [showTradeCard, setShowTradeCard] = useState<boolean>(false);
  const chartRef = useRef<HTMLDivElement>(null);


  const historicalData = useHistoricalData(symbol, interval);
  const { realtimePrice, historicalData: realtimeData } = useRealtimePrice(symbol);


  const handleSymbolChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setSymbol(e.target.value as Symbol);
  }, []);

  const formatSymbol = (symbol: string) => {
    return symbol.replace(/([A-Z]+)(USDT)/, '$1/$2');
  };

  const handleIntervalChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setInterval(e.target.value as Interval);
  }, []);

  const formatInterval = (interval: string) => {
    switch (interval) {
      case '1m':
        return '1 Minute';
      case '5m':
        return '5 Minutes';
      case '15m':
        return '15 Minutes';
      case '1h':
        return '1 Hour';
      case '1d':
        return '1 Day';
      default:
        return interval;
    }
  };

  const handleTrade = useCallback(() => {
    const tradeQuantity = Number(quantity);
    const cost = realtimePrice * tradeQuantity;

    if (isBuy && cost <= paperBalance) {
      setPaperBalance((prev) => prev - cost);
      setHoldings((prev) => ({
        ...prev,
        [symbol]: (prev[symbol] || 0) + tradeQuantity,
      }));
    } else if (!isBuy && (holdings[symbol] || 0) >= tradeQuantity) {
      setPaperBalance((prev) => prev + cost);
      setHoldings((prev) => ({
        ...prev,
        [symbol]: prev[symbol] - tradeQuantity,
      }));
    } else {
      alert(
        isBuy
          ? "Insufficient balance for this transaction."
          : "Insufficient holdings for this transaction."
      );
    }
    setQuantity("");
  }, [isBuy, quantity, realtimePrice, symbol, paperBalance, holdings]);

  const handleAddToWatchlist = useCallback(() => {
    if (!watchlist.includes(symbol)) {
      setWatchlist((prev) => [...prev, symbol]);
    }
  }, [symbol, watchlist]);

  const handleRemoveFromWatchlist = useCallback((item: Symbol) => {
    setWatchlist((prev) => prev.filter((sym) => sym !== item));
  }, []);

  const toggleWatchlist = useCallback(() => {
    setShowWatchlist((prev) => !prev);
  }, []);

  const toggleTradeCard = useCallback(() => {
    setShowTradeCard((prev) => !prev);
  }, []);

  const chartOptions = getChartOptions(symbol, realtimePrice, [...historicalData, ...realtimeData]);

  return (
    <div className="w-full pt-4 px-6 bg-black min-h-screen relative">
      <div className="flex items-center mb-4 p-3 bg-gray-800 rounded-lg shadow-lg text-sm">
        <select
          value={symbol}
          onChange={handleSymbolChange}
          className="mx-3 border rounded p-1.5 bg-gray-700 text-white shadow-md hover:bg-gray-600 focus:bg-gray-800"
        >
          {AVAILABLE_SYMBOLS.map((sym) => (
            <option key={sym} value={sym}>
              {formatSymbol(sym)}
            </option>
          ))}
        </select>
        <select
          value={interval}
          onChange={handleIntervalChange}
          className="border rounded p-1.5 bg-gray-700 text-white shadow-md hover:bg-gray-600 focus:bg-gray-800"
        >
          {AVAILABLE_INTERVALS.map((int) => (
            <option key={int} value={int}>
              {formatInterval(int)}
            </option>
          ))}
        </select>
        <button
          onClick={handleAddToWatchlist}
          className="mx-3 px-3 py-1.5 bg-blue-500 text-white rounded shadow-md hover:bg-blue-400 focus:bg-blue-400"
        >
          Add to Watchlist
        </button>
        <button
          onClick={toggleWatchlist}
          className="px-3 py-1.5 bg-green-500 text-white rounded shadow-md hover:bg-green-400 focus:bg-green-400"
        >
          {showWatchlist ? "Hide" : "Show"} Watchlist
        </button>
        <button
          onClick={toggleTradeCard}
          className="ml-3 px-3 py-1.5 bg-purple-500 text-white rounded shadow-md hover:bg-purple-400 focus:bg-purple-400"
        >
          {showTradeCard ? " " : " "} Paper Trading
        </button>
        <div className="ml-auto flex items-center">
          <div className="text-xl text-white">
            👋..{" "}
            <p className="inline ml-1 text-white">
              {session.user.name?.split(" ")[0] || ""}
            </p>
          </div>
          <div className="mx-4 flex items-center rounded-sm bg-green-500 px-2 py-1 text-sm text-white hover:bg-white">
            <Logout />
          </div>
        </div>
      </div>

      {showWatchlist && (
        <WatchlistCard
          watchlist={watchlist}
          onRemove={handleRemoveFromWatchlist}
          onSelect={setSymbol}
        />
      )}

      <div className="relative" ref={chartRef}>
        {showTradeCard && (
          <TradeCard
            symbol={symbol}
            isBuy={isBuy}
            quantity={quantity}
            setQuantity={setQuantity}
            onTrade={handleTrade}
            onToggleBuySell={() => setIsBuy((prev) => !prev)}
            paperBalance={paperBalance}
            holdings={holdings}
          />
        )}
        <HighchartsReact highcharts={Highcharts} options={chartOptions} />
      </div>
    </div>
  );
};

export default Chart;