import { useRef } from 'react';
import React from "react";
import Draggable from "react-draggable";
import { Symbol, Holdings } from "@/types/chart";

interface TradeCardProps {
  symbol: Symbol;
  isBuy: boolean;
  quantity: string;
  setQuantity: (q: string) => void;
  onTrade: () => void;
  onToggleBuySell: () => void;
  paperBalance: number;
  holdings: Holdings;
}

export const TradeCard: React.FC<TradeCardProps> = ({
  symbol,
  isBuy,
  quantity,
  setQuantity,
  onTrade,
  onToggleBuySell,
  paperBalance,
  holdings,
}) => {
  const ref = useRef(null);

  return (
    <Draggable ref={ref} bounds="parent">
      <div className="absolute top-10 left-10 z-10 bg-gray-800 p-3 rounded-lg shadow-lg w-1/4 cursor-grabbing text-xs">
        <h2 className="text-white text-sm mb-2">Trade {symbol}</h2>
        <input
          type="number"
          placeholder="Quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          className="w-full p-2 mb-2 bg-gray-700 text-white rounded shadow-md hover:bg-gray-600 focus:bg-gray-600"
        />
        <button
          onClick={onTrade}
          className={`w-full p-2 mb-2 text-white rounded shadow-md ${
            isBuy? "bg-green-500 hover:bg-green-400" : "bg-red-500 hover:bg-red-400"
          }`}
        >
          {isBuy? "Buy" : "Sell"} {symbol}
        </button>
        <button
          onClick={onToggleBuySell}
          className="w-full p-2 bg-gray-500 text-white rounded shadow-md hover:bg-gray-400 focus:bg-gray-400"
        >
          Switch to {isBuy? "Sell" : "Buy"}
        </button>
        <div className="my-2 text-white">
          <p className="">Balance: ${paperBalance.toFixed(2)}</p>
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
  );
};