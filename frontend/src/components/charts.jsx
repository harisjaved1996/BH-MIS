import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
} from "chart.js";
import { Bar, Line } from "react-chartjs-2";

import { useTheme } from "../theme/ThemeContext";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Filler,
  Tooltip
);

function useChartTheme() {
  const { colors: C } = useTheme();
  return {
    ink: C.textSecondary,
    inkMuted: C.inkMuted,
    grid: C.chartGrid,
    blue: C.chartBlue,
    bg: C.bg,
    tooltip: {
      backgroundColor: C.surfaceRaised,
      borderColor: C.border,
      borderWidth: 1,
      titleColor: C.text,
      bodyColor: C.textSecondary,
      padding: 10,
      cornerRadius: 8,
    },
  };
}

const baseOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
};

export function GradeDistributionChart({ data }) {
  const t = useChartTheme();
  return (
    <div style={{ height: 280 }}>
      <Bar
        data={{
          labels: data.map((d) => d.label),
          datasets: [
            {
              data: data.map((d) => d.count),
              backgroundColor: t.blue,
              borderRadius: { topLeft: 4, topRight: 4 },
              maxBarThickness: 36,
            },
          ],
        }}
        options={{
          ...baseOptions,
          scales: {
            x: { grid: { display: false }, ticks: { color: t.ink } },
            y: {
              grid: { color: t.grid },
              border: { display: false },
              ticks: { color: t.inkMuted, precision: 0 },
            },
          },
          plugins: {
            ...baseOptions.plugins,
            tooltip: {
              ...t.tooltip,
              callbacks: { label: (ctx) => `${ctx.parsed.y} students` },
            },
          },
        }}
      />
    </div>
  );
}

export function ComparisonChart({ data, metric = "avg" }) {
  const t = useChartTheme();
  const isAvg = metric === "avg";
  return (
    <div style={{ height: Math.max(280, data.length * 26) }}>
      <Bar
        data={{
          labels: data.map((d) => d.label),
          datasets: [
            {
              data: data.map((d) => (isAvg ? d.avg : d.count)),
              backgroundColor: t.blue,
              borderRadius: { topRight: 4, bottomRight: 4 },
              maxBarThickness: 16,
            },
          ],
        }}
        options={{
          ...baseOptions,
          indexAxis: "y",
          scales: {
            x: {
              grid: { color: t.grid },
              border: { display: false },
              ticks: { color: t.inkMuted },
              max: isAvg ? 100 : undefined,
            },
            y: { grid: { display: false }, ticks: { color: t.ink, autoSkip: false } },
          },
          plugins: {
            ...baseOptions.plugins,
            tooltip: {
              ...t.tooltip,
              callbacks: {
                label: (ctx) =>
                  isAvg
                    ? `Average ${ctx.parsed.x}%  (${data[ctx.dataIndex].count} students)`
                    : `${ctx.parsed.x} students`,
              },
            },
          },
        }}
      />
    </div>
  );
}

export function SessionTrendChart({ data }) {
  const t = useChartTheme();
  return (
    <div style={{ height: 260 }}>
      <Line
        data={{
          labels: data.map((d) => d.label),
          datasets: [
            {
              data: data.map((d) => d.avg),
              borderColor: t.blue,
              borderWidth: 2,
              pointRadius: 4,
              pointBackgroundColor: t.blue,
              pointBorderColor: t.bg,
              pointBorderWidth: 2,
              fill: true,
              backgroundColor: (context) => {
                const { ctx, chartArea } = context.chart;
                if (!chartArea) return "rgba(76,111,255,0.1)";
                const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
                gradient.addColorStop(0, "rgba(76,111,255,0.28)");
                gradient.addColorStop(1, "rgba(76,111,255,0)");
                return gradient;
              },
              tension: 0.35,
            },
          ],
        }}
        options={{
          ...baseOptions,
          scales: {
            x: { grid: { display: false }, ticks: { color: t.ink } },
            y: {
              grid: { color: t.grid },
              border: { display: false },
              ticks: { color: t.inkMuted, callback: (v) => `${v}%` },
              suggestedMax: 100,
            },
          },
          plugins: {
            ...baseOptions.plugins,
            tooltip: {
              ...t.tooltip,
              callbacks: {
                label: (ctx) =>
                  `Average ${ctx.parsed.y}%  (${data[ctx.dataIndex].count} students)`,
              },
            },
          },
        }}
      />
    </div>
  );
}
