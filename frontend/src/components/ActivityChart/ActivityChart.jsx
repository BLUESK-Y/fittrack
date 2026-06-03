import React, { useEffect, useState, useMemo } from "react";
import Chart from "react-apexcharts";
import api from "../../services/api";
import "./ActivityChart.css";

const ActivityChart = () => {
  const [view, setView] = useState("week");
  const [chartData, setChartData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, [view]);

  const fetchLogs = async () => {
    setLoading(true);
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return;

    try {
      const res = await api.get(`/logs?userId=${user.id || user._id}`);
      const logs = Array.isArray(res.data) ? res.data : [];

      const days = view === "week" ? 7 : 30;

      // Build complete date range: last N days ending today
      const dateRange = [];
      for (let i = days - 1; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        dateRange.push(d);
      }

      // Group logs by YYYY-MM-DD key and sum steps
      const grouped = {};
      logs.forEach((log) => {
        grouped[log.date] = (grouped[log.date] || 0) + (log.steps || 0);
      });

      // Map every day in range — 0 if no log exists that day
      setCategories(
        dateRange.map((d) =>
          d.toLocaleDateString("en-US", { month: "short", day: "numeric" })
        )
      );
      setChartData(
        dateRange.map((d) => grouped[d.toISOString().split("T")[0]] || 0)
      );
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const options = useMemo(() => ({
    chart: {
      type: "area",
      toolbar: { show: false },
      background: "transparent",
      animations: { enabled: true, speed: 600 },
      sparkline: { enabled: false },
    },
    dataLabels: { enabled: false },
    stroke: { curve: "smooth", width: 2.5 },
    colors: ["#3B82F6"],
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.25,
        opacityTo: 0.01,
        stops: [0, 95, 100],
      },
    },
    markers: {
      size: 0,
      hover: { size: 5, sizeOffset: 2 },
      strokeColors: "#3B82F6",
      strokeWidth: 2,
      fillColor: "#1e293b",
    },
    grid: {
      borderColor: "rgba(255,255,255,0.05)",
      strokeDashArray: 3,
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: true } },
      padding: { left: 8, right: 8 },
    },
    xaxis: {
      categories,
      tickAmount: view === "week" ? 6 : 8,
      labels: {
        style: { colors: "#6b7280", fontSize: "11px" },
        rotate: 0,
        hideOverlappingLabels: true,
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: {
        style: { colors: "#6b7280", fontSize: "11px" },
        formatter: (val) =>
          val >= 1000 ? `${(val / 1000).toFixed(0)}k` : `${val}`,
      },
      min: 0,
    },
    tooltip: {
      theme: "dark",
      x: { show: true },
      y: { formatter: (val) => `${val.toLocaleString()} steps` },
      marker: { show: true },
    },
    noData: {
      text: "No activity recorded",
      style: { color: "#4b5563", fontSize: "14px" },
    },
  }), [categories, view]);

  const series = [{ name: "Steps", data: chartData }];

  return (
    <div className="activity-card">
      <div className="activity-header">
        <h4 className="activity-title">Activity Trend</h4>
        <div className="activity-filters">
          {["week", "month"].map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`filter-btn ${view === v ? "active" : "inactive"}`}
            >
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="activity-loading">Loading...</div>
      ) : (
        <Chart key={view} options={options} series={series} type="area" height={320} />
      )}
    </div>
  );
};

export default ActivityChart;
