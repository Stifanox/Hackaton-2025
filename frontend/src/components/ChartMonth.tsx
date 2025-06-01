// src/components/MonthChart.tsx

import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  type ChartOptions,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export interface MonthlyData {
  month: number; // 1..12
  ed: number; // dzienna produkcja
  em: number; // miesięczna produkcja
  hid: number; // dzienne napromieniowanie
  sdm: number; // odchylenie standardowe
}

interface MonthChartProps {
  data: MonthlyData[];
}

const MonthChart: React.FC<MonthChartProps> = ({ data }) => {
  // 1. Etykiety miesięcy
  const monthLabels = [
    "Styczeń",
    "Luty",
    "Marzec",
    "Kwiecień",
    "Maj",
    "Czerwiec",
    "Lipiec",
    "Sierpień",
    "Wrzesień",
    "Październik",
    "Listopad",
    "Grudzień",
  ];

  // 2. Posortujmy dane rosnąco po `month`
  const sorted = [...data].sort((a, b) => a.month - b.month);

  // 3. Przygotuj oddzielne tablice wartości
  const edValues = sorted.map((m) => m.ed);
  const emValues = sorted.map((m) => m.em);
  const hidValues = sorted.map((m) => m.hid);
  const sdmValues = sorted.map((m) => m.sdm);

  // --------------------------------------------------
  // 4. Konfiguracja poziomego wykresu dla `em` (miesięczna produkcja)
  // --------------------------------------------------
  const horizontalData = {
    labels: monthLabels,
    datasets: [
      {
        label: "Miesięczna produkcja (em)",
        data: emValues,
        backgroundColor: "rgba(255, 99, 132, 0.7)",
      },
    ],
  };

  const horizontalOptions: ChartOptions<"bar"> = {
    indexAxis: "y", // <-- klucz: rysuj poziomo
    responsive: true,
    plugins: {
      legend: {
        display: false, // ukrywamy legendę, bo jest tylko jedna seria
      },
      title: {
        display: true,
        text: "Miesięczna produkcja wg miesiąca",
        font: {
          size: 16,
        },
      },
      tooltip: {
        callbacks: {
          label: (ctx) => {
            return `${ctx.dataset.label}: ${ctx.parsed.x}`;
          },
        },
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Wartość",
        },
      },
      y: {
        title: {
          display: false,
        },
      },
    },
  };

  // --------------------------------------------------
  // 5. Konfiguracja pionowego wykresu dla pozostałych serii (ed, hid, sdm)
  // --------------------------------------------------
  const verticalData = {
    labels: monthLabels,
    datasets: [
      {
        label: "Dzienna produkcja (ed)",
        data: edValues,
        backgroundColor: "rgba(75, 192, 192, 0.7)",
      },
      {
        label: "Dzienne napromieniowanie (hid)",
        data: hidValues,
        backgroundColor: "rgba(53, 162, 235, 0.7)",
      },
      {
        label: "Odchylenie standardowe (sdm)",
        data: sdmValues,
        backgroundColor: "rgba(255, 206, 86, 0.7)",
      },
    ],
  };

  const verticalOptions: ChartOptions<"bar"> = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
      },
      title: {
        display: true,
        text: "Pozostałe wskaźniki miesięczne",
        font: {
          size: 16,
        },
      },
      tooltip: {
        callbacks: {
          label: (ctx) => {
            return `${ctx.dataset.label}: ${ctx.parsed.y}`;
          },
        },
      },
    },
    scales: {
      x: {
        stacked: false,
        title: {
          display: true,
          text: "Miesiąc",
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Wartość",
        },
      },
    },
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow space-y-8">
      {/* Poziomy wykres miesięcznej produkcji */}
      <div>
        <Bar options={horizontalOptions} data={horizontalData} />
      </div>

      {/* Pionowy wykres pozostałych serii */}
      <div>
        <Bar options={verticalOptions} data={verticalData} />
      </div>
    </div>
  );
};

export default MonthChart;
