"use client";
import React, { useEffect, useState, useRef } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import "highcharts/modules/exporting";
import "highcharts/modules/export-data";
import Draggable from "react-draggable";
import Logout from "@/components/Logout/logout";

interface ChartProps {
  session: {
    user: {
      name?: string;
    };
  };
}

const fetchHistoricalData = async (symbol: string, interval: string) => {
  const response = await fetch(
    `https://data-api.binance.vision/api/v3/klines?symbol=${symbol}&interval=${interval}`
  );
  const data = await response.json();
  return data.map((d: any[]) => [d[0], parseFloat(d[4])]) as [number, number][];
};

const Chart: React.FC<ChartProps> = ({ session }) => {
  const [historicalData, setHistoricalData] = useState<[number, number][]>([]);
  const [symbol, setSymbol] = useState<string>("BTCUSDT");
  const [interval, setInterval] = useState<string>("1h");
  const [realtimePrice, setRealtimePrice] = useState<number>(0);
  const [isBuy, setIsBuy] = useState<boolean>(true);
  const [quantity, setQuantity] = useState<string>("");
  const [paperBalance, setPaperBalance] = useState<number>(5000000);
  const [holdings, setHoldings] = useState<{ [key: string]: number }>({});
  const [watchlist, setWatchlist] = useState<string[]>(["BTCUSDT", "ETHUSDT"]);
  const [showWatchlist, setShowWatchlist] = useState<boolean>(false);
  const [showTradeCard, setShowTradeCard] = useState<boolean>(false);
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchHistoricalData(symbol, interval);
      setHistoricalData(data);
    };

    fetchData();
  }, [symbol, interval]);

  useEffect(() => {
    const socket = new WebSocket(
      `wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@kline_1m`
    );

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setRealtimePrice(parseFloat(data.k.c));
      setHistoricalData((prev) => [...prev, [data.k.T, parseFloat(data.k.c)] as [number, number]]);
    };

    return () => socket.close();
  }, [symbol]);

  const handleSymbolChange = (e: React.ChangeEvent<HTMLSelectElement>) => setSymbol(e.target.value);
  const handleIntervalChange = (e: React.ChangeEvent<HTMLSelectElement>) => setInterval(e.target.value);

  const handleTrade = () => {
    const cost = realtimePrice * Number(quantity);
    if (isBuy) {
      if (cost <= paperBalance) {
        setPaperBalance(paperBalance - cost);
        setHoldings({
          ...holdings,
          [symbol]: (holdings[symbol] || 0) + Number(quantity),
        });
      } else {
        alert("Insufficient balance for this transaction.");
      }
    } else {
      if ((holdings[symbol] || 0) >= Number(quantity)) {
        setPaperBalance(paperBalance + cost);
        setHoldings({
          ...holdings,
          [symbol]: holdings[symbol] - Number(quantity),
        });
      } else {
        alert("Insufficient holdings for this transaction.");
      }
    }
    setQuantity("");
  };

  const handleAddToWatchlist = () => {
    if (!watchlist.includes(symbol)) {
      setWatchlist([...watchlist, symbol]);
    }
  };

  const handleRemoveFromWatchlist = (item: string) => {
    setWatchlist(watchlist.filter((sym) => sym !== item));
  };

  const options: Highcharts.Options = {
    chart: {
      zoomType: "x",
      backgroundColor: "black",
      height: 800,
    },
    title: {
      text: `${symbol} Live Price`,
      align: "left",
      style: { color: "#D0D3D4" },
    },
    subtitle: {
      text: "Click and drag in the plot area to zoom in",
      align: "left",
      style: { color: "#D0D3D4" },
    },
    xAxis: {
      type: "datetime",
      labels: { style: { color: "#D0D3D4" } },
      title: { style: { color: "#D0D3D4" } },
    },
    yAxis: {
      gridLineWidth: 0,
      labels: { style: { color: "#D0D3D4" } },
      title: { text: "", style: { color: "#D0D3D4" } },
      opposite: true,
      plotLines: [
        {
          value: realtimePrice,
          color: "#2ECC71",
          dashStyle: "Solid",
          width: 1,
          label: {
            text: `$ ${realtimePrice}`,
            align: "left",
            style: { color: "#2ECC71", fontSize: "16px", fontWeight: "bold" },
          },
        },
      ],
    },
    legend: { enabled: false },
    plotOptions: {
      area: {
        fillColor: {
          linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
          stops: [
            [0, Highcharts.color("#FFA500").setOpacity(0.2).get("rgba")],
            [1, "#000000"],
          ],
        },
        threshold: null,
        marker: { radius: 2 },
        lineWidth: 1,
        states: { hover: { lineWidth: 2 } },
      },
    },
    series: [
      {
        type: "area",
        name: `${symbol} Price`,
        data: historicalData,
        color: "#FFA500",
      },
    ],
    credits: { enabled: false },
    exporting: {
      enabled: true,
      buttons: {
        contextButton: {
          menuItems: [
            "viewFullscreen",
            "printChart",
            "separator",
            "downloadPNG",
            "downloadJPEG",
            "downloadSVG",
            "downloadPDF",
          ],
        },
      },
    },
  };

  return (
    <div className="w-full pt-6 px-8 bg-black min-h-screen relative">
      <div className="flex items-center mb-4 p-4 bg-gray-800 rounded-lg shadow-lg">
        <select
          value={symbol}
          onChange={handleSymbolChange}
          className="mx-4 border rounded p-2 bg-gray-700 text-white shadow-md hover:bg-gray-600 focus:bg-gray-800"
        >
          <option value="ETHUSDT">ETH/USDT</option>
          <option value="BTCUSDT">BTC/USDT</option>
          <option value="BNBUSDT">BNB/USDT</option>
        </select>
        <select
          value={interval}
          onChange={handleIntervalChange}
          className="border rounded p-2 bg-gray-700 text-white shadow-md hover:bg-gray-600 focus:bg-gray-800"
        >
          <option value="1m">1 Minute</option>
          <option value="5m">5 Minutes</option>
          <option value="15m">15 Minutes</option>
          <option value="1h">1 Hour</option>
          <option value="1d">1 Day</option>
        </select>
        <button
          onClick={handleAddToWatchlist}
          className="ml-4 px-4 py-2 bg-blue-500 text-white rounded shadow-md hover:bg-blue-400 focus:bg-blue-400"
        >
          Add to Watchlist
        </button>
        <button
          onClick={() => setShowWatchlist(!showWatchlist)}
          className="ml-4 px-4 py-2 bg-green-500 text-white rounded shadow-md hover:bg-green-400 focus:bg-green-400"
        >
          {showWatchlist ? "Hide" : "Show"} Watchlist
        </button>
        <button
          onClick={() => setShowTradeCard(!showTradeCard)}
          className="ml-4 px-4 py-2 bg-purple-500 text-white rounded shadow-md hover:bg-purple-400 focus:bg-purple-400"
        >
          {showTradeCard ? "Hide" : "Show"} Trade Card
        </button>
        <div className="ml-auto flex items-center">
          <div className="text-2xl text-white">
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
        <div className="mb-4 p-4 bg-gray-800 rounded-lg shadow-lg">
          <h2 className="text-white text-lg mb-2">Watchlist</h2>
          <ul className="flex space-x-4">
            {watchlist.map((item) => (
              <li key={item} className="bg-gray-700 p-2 rounded text-white">
                <button onClick={() => setSymbol(item)}>{item}</button>
                <button
                  onClick={() => handleRemoveFromWatchlist(item)}
                  className="ml-2 text-red-500 hover:text-red-700"
                >
                  ❌
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="relative" ref={chartRef}>
        {showTradeCard && (
          <Draggable bounds="parent">
            <div className="absolute top-10 left-10 z-10 bg-gray-800 p-4 rounded-lg shadow-lg w-1/4 cursor-grabbing">
              <h2 className="text-white text-lg mb-2">Trade {symbol}</h2>
              <input
                type="number"
                placeholder="Quantity"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full p-2 mb-2 bg-gray-700 text-white rounded shadow-md hover:bg-gray-600 focus:bg-gray-600"
              />
              <button
                onClick={handleTrade}
                className={`w-full p-2 mb-2 text-white rounded shadow-md ${
                  isBuy ? "bg-green-500 hover:bg-green-400" : "bg-red-500 hover:bg-red-400"
                }`}
              >
                {isBuy ? "Buy" : "Sell"} {symbol}
              </button>
              <button
                onClick={() => setIsBuy(!isBuy)}
                className="w-full p-2 bg-gray-500 text-white rounded shadow-md hover:bg-gray-400 focus:bg-gray-400"
              >
                Switch to {isBuy ? "Sell" : "Buy"}
              </button>
              <div className="mt-2 text-white">
                <p>Balance: ${paperBalance.toFixed(2)}</p>
                <p>
                  Holdings:{" "}
                  {Object.entries(holdings).map(([key, value]) => (
                    <span key={key}>
                      {key}: {value}{" "}
                    </span>
                  ))}
                </p>
              </div>
            </div>
          </Draggable>
        )}
        <HighchartsReact highcharts={Highcharts} options={options} />
      </div>
    </div>
  );
};

export default Chart;