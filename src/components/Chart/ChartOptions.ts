import Highcharts from "highcharts";
import { Symbol } from "@/types/chart";

export const getChartOptions = (
  symbol: Symbol,
  realtimePrice: number,
  historicalData: [number, number][]
): Highcharts.Options => ({
  chart: {
    type: "area",
    backgroundColor: "black",
    height: 650,
    zooming: { type: "x" },
  },
  title: {
    text: `${symbol} Live Price`,
    align: "left",
    style: { color: "#D0D3D4", fontSize: "16px" },
  },
  subtitle: {
    text: "Click and drag in the plot area to zoom in",
    align: "left",
    style: { color: "#D0D3D4", fontSize: "10px" },
  },
  xAxis: {
    type: "datetime",
    labels: { style: { color: "#D0D3D4", fontSize: "10px" } },
  },
  yAxis: {
    gridLineWidth: 0,
    labels: { style: { color: "#D0D3D4", fontSize: "10px" } },
    title: { text: "", style: { color: "#D0D3D4", fontSize: "10px" } },
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
          style: { color: "#2ECC71", fontSize: "12px", fontWeight: "bold" },
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
          [0, "rgba(255, 165, 0, 0.2)"],
          [1, "rgba(0, 0, 0, 1)"],
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
});