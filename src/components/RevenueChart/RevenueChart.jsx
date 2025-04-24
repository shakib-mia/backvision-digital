import React, { useState } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import CustomTooltip from "../CustomTooltip/CustomTooltip";

const RevenueChart = ({ result2, result, monthlyViews }) => {
  const [chartMode, setChartMode] = useState("revenue");
  console.log(result2);

  return (
    <div className="p-4">
      {/* Toggler */}
      <div className="flex relative">
        <button className="w-1/2 py-2" onClick={() => setChartMode("revenue")}>
          Revenue
        </button>
        <button className="w-1/2 py-2" onClick={() => setChartMode("views")}>
          Views
        </button>

        <div
          className="absolute h-[2px] w-1/2 bg-interactive-light bottom-0 transition-[left] duration-500"
          style={{ left: chartMode === "revenue" ? 0 : "50%" }}
        ></div>
      </div>

      {/* Chart Content */}
      {chartMode === "revenue" && (
        <>
          <ResponsiveContainer height={400} className="my-4">
            <LineChart
              data={result}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="platformName" />
              <YAxis dataKey={"totalRevenue"} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line
                type="monotone"
                dataKey="totalRevenue"
                name="Platform wise Revenue"
                fill="#2B52DD"
              />
              {/* <Line type="monotone" dataKey="final revenue" stroke="#22683E" /> */}
            </LineChart>
          </ResponsiveContainer>

          <ResponsiveContainer height={400}>
            <LineChart
              data={result2}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis dataKey={"totalRevenue"} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line
                type="monotone"
                dataKey="totalRevenue"
                name="Lifetime Revenue"
                stroke="#22683E"
                strokeWidth={2}
              />

              {/* <Line type="monotone" dataKey="final revenue" stroke="#22683E" /> */}
            </LineChart>
          </ResponsiveContainer>
        </>
      )}
      {chartMode === "views" && (
        <>
          <ResponsiveContainer height={400} className="my-4">
            <LineChart
              data={result}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="platformName" />
              <YAxis dataKey={"total"} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line
                type="monotone"
                dataKey="total"
                name="Platform wise Views"
                fill="#2B52DD"
              />
              {/* <Line type="monotone" dataKey="final revenue" stroke="#22683E" /> */}
            </LineChart>
          </ResponsiveContainer>

          <ResponsiveContainer height={400}>
            <LineChart
              data={monthlyViews}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis dataKey={"totalViews"} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line
                type="monotone"
                dataKey="totalViews"
                name="Lifetime Views"
                stroke="#22683E"
                strokeWidth={2}
              />

              {/* <Line type="monotone" dataKey="final revenue" stroke="#22683E" /> */}
            </LineChart>
          </ResponsiveContainer>
        </>
      )}
    </div>
  );
};

export default RevenueChart;
