import React from "react";
import { Symbol, Watchlist } from "@/types/chart";

interface WatchlistCardProps {
  watchlist: Watchlist;
  onRemove: (sym: Symbol) => void;
  onSelect: (sym: Symbol) => void;
}

export const WatchlistCard: React.FC<WatchlistCardProps> = ({ watchlist, onRemove, onSelect }) => (
  <div className="mb-4 p-3 bg-gray-800 rounded-lg shadow-lg text-xs">
    <h2 className="text-white text-lg mb-2">Watchlist</h2>
    <ul className="flex space-x-2">
      {watchlist.map((item) => (
        <li key={item} className="bg-gray-700 p-2 rounded text-white">
          <button onClick={() => onSelect(item)}>{item}</button>
          <button
            onClick={() => onRemove(item)}
            className="ml-2 text-red-500 hover:text-red-700"
          >
            ❌
          </button>
        </li>
      ))}
    </ul>
  </div>
);