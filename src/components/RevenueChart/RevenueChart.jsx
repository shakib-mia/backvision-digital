import React, { useContext, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { ProfileContext } from "../../contexts/ProfileContext";

const RevenueChart = ({ result, result2, monthlyViews, pdfMode = false }) => {
  const [chartType, setChartType] = useState("revenue"); // "revenue" or "views"
  const { userData, dollarRate, token } = useContext(ProfileContext);

  // Format data for the platform breakdown chart
  const platformData = result.map((item) => ({
    name: item.platformName,
    revenue:
      item["final revenue"].toFixed(2) *
      (userData.billing_country === "India" ? 1 : dollarRate),
    views: item.total,
  }));

  // Chart styles and dimensions based on mode
  const chartHeight = pdfMode ? 300 : 400;
  const containerClass = pdfMode
    ? "mb-6"
    : "mt-12 mb-6 bg-gray-800 p-4 rounded-lg";
  const buttonClass = pdfMode
    ? "hidden"
    : "px-4 py-2 rounded-md text-sm transition mr-2";
  const textColor = pdfMode ? "text-black" : "text-white";

  return (
    <div className={containerClass}>
      {/* Chart Title and Toggle Buttons (hidden in PDF mode) */}
      <div className={`flex justify-between items-center mb-4 ${textColor}`}>
        <h4 className="text-heading-4-bold">
          {chartType === "revenue" ? "Revenue Analytics" : "Views Analytics"}
        </h4>
        <div>
          <button
            onClick={() => setChartType("revenue")}
            className={`${buttonClass} ${
              chartType === "revenue"
                ? "bg-blue-600 text-white"
                : "bg-gray-700 text-gray-300"
            }`}
          >
            Revenue
          </button>
          <button
            onClick={() => setChartType("views")}
            className={`${buttonClass} ${
              chartType === "views"
                ? "bg-blue-600 text-white"
                : "bg-gray-700 text-gray-300"
            }`}
          >
            Views
          </button>
        </div>
      </div>

      {/* Revenue/Views by Platform (Bar Chart) */}
      <div className="mb-8">
        <h5 className={`text-heading-5-bold mb-2 ${textColor}`}>
          {chartType === "revenue"
            ? "Revenue by Platform"
            : "Views by Platform"}
        </h5>
        <div style={{ width: "100%", height: chartHeight }}>
          {pdfMode ? (
            // Static size for PDF
            <BarChart
              width={700}
              height={chartHeight}
              data={platformData}
              margin={{ top: 5, right: 30, left: 20, bottom: 70 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                angle={-45}
                textAnchor="end"
                height={70}
                tick={{ fill: pdfMode ? "#000" : "#fff" }}
              />
              <YAxis tick={{ fill: pdfMode ? "#000" : "#fff" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: pdfMode ? "#fff" : "#1f2937",
                  borderColor: pdfMode ? "#aaa" : "#374151",
                  color: pdfMode ? "#000" : "#fff",
                }}
              />
              <Legend />
              {chartType === "revenue" ? (
                <Bar
                  dataKey="revenue"
                  name="Revenue"
                  fill="#3b82f6"
                  animationDuration={500}
                />
              ) : (
                <Bar
                  dataKey="views"
                  name="Views"
                  fill="#10b981"
                  animationDuration={500}
                />
              )}
            </BarChart>
          ) : (
            // Responsive container for UI
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={platformData}
                margin={{ top: 5, right: 30, left: 20, bottom: 70 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="name"
                  angle={-45}
                  textAnchor="end"
                  height={70}
                  tick={{ fill: "#fff" }}
                />
                <YAxis tick={{ fill: "#fff" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    borderColor: "#374151",
                    color: "#fff",
                  }}
                />
                <Legend />
                {chartType === "revenue" ? (
                  <Bar
                    dataKey="revenue"
                    name="Revenue"
                    fill="#5C7BEE"
                    animationDuration={500}
                  />
                ) : (
                  <Bar
                    dataKey="views"
                    name="Views"
                    fill="#10b981"
                    animationDuration={500}
                  />
                )}
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Monthly Trend Chart (Line Chart) */}
      <div>
        <h5 className={`text-heading-5-bold mb-2 ${textColor}`}>
          Monthly {chartType === "revenue" ? "Revenue" : "Views"} (Cumulative)
        </h5>
        {!pdfMode && (
          <div style={{ width: "100%", height: chartHeight }}>
            {/* // Responsive container for UI */}
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartType === "revenue" ? result2 : monthlyViews}
                margin={{ top: 5, right: 30, left: 20, bottom: 50 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="month"
                  angle={-45}
                  textAnchor="end"
                  height={70}
                  tick={{ fill: "#fff" }}
                />
                <YAxis tick={{ fill: "#fff" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    borderColor: "#374151",
                    boxShadow: "0 0 10px rgba(0, 0, 0, 0.5)",
                    color: "#fff",
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey={
                    chartType === "revenue" ? "totalRevenue" : "totalViews"
                  }
                  name={
                    chartType === "revenue" ? "Total Revenue" : "Total Views"
                  }
                  stroke={chartType === "revenue" ? "#5C7BEE" : "#10b981"}
                  activeDot={{ r: 8 }}
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {pdfMode && <div className="page-break"></div>}
    </div>
  );
};

export default RevenueChart;
