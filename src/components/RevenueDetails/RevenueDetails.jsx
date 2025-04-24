import React, { useRef, useState } from "react";
import { FaFileExcel, FaFilePdf } from "react-icons/fa";
import generatePDF from "react-to-pdf";
import { jsonToExcel } from "../../utils/jsonToExcel";
import RevenueChart from "../RevenueChart/RevenueChart";

const RevenueDetails = ({ setDetails, songs, details }) => {
  const detailsRef = useRef(null);
  const [preview, showPreview] = useState(false);

  const items = songs
    .filter((song) => song.isrc === details)
    .sort((a, b) => a.platformName.localeCompare(b.platformName));

  const groupedData = items.reduce((acc, cur) => {
    if (!acc[cur.platformName]) {
      acc[cur.platformName] = {
        ...cur,
        "final revenue": 0,
        total: 0,
        months: [],
      };
    }
    acc[cur.platformName]["final revenue"] += cur["final revenue"];
    acc[cur.platformName].total += cur.total;

    acc[cur.platformName].months.push({
      month: cur.date,
      total: cur.total,
      revenue: cur["final revenue"],
    });

    return acc;
  }, {});

  const result = Object.values(groupedData);
  result.map((i) => (i.totalRevenue = i["final revenue"]));

  // Step 1: Group by month
  const monthlyRevenue = {};

  items.forEach((item) => {
    const month = item.date.slice(0, 7); // "YYYY-MM"

    if (!monthlyRevenue[month]) {
      monthlyRevenue[month] = 0;
    }

    monthlyRevenue[month] += item["final revenue"];
  });

  // Step 2: Sort months in chronological order
  const sortedMonths = Object.keys(monthlyRevenue).sort(
    (a, b) => new Date(a) - new Date(b)
  );

  // Step 3: Calculate cumulative revenue for each month
  let cumulativeRevenue = 0;
  const result2 = sortedMonths.map((month) => {
    cumulativeRevenue += monthlyRevenue[month];
    return {
      month,
      totalRevenue: cumulativeRevenue,
    };
  });

  // console.log(result2);

  const [expandedPlatform, setExpandedPlatform] = useState(null);

  const toggleExpand = (platformName) => {
    setExpandedPlatform((prev) =>
      prev === platformName ? null : platformName
    );
  };

  const createPdf = async () => {
    await generatePDF(detailsRef, {
      filename: `Revenue_Details_of_${result[0]?.song_name}.pdf`,
      page: {
        format: "A4",
        orientation: "portrait",
        margin: { top: 20, left: 20, bottom: 20, right: 20 },
        unit: "mm",
      },
    });
    showPreview(false);
    setDetails("");
  };

  const convertToExcel = () => {
    const newItems = items.map((item) => {
      return {
        "Song Name": item.song_name,
        ISRC: item.isrc,
        Album: item.album,
        Artist: item.track_artist,
        Label: item.label,
        "Platform Name": item.platformName,
        Month: item.month,
        Views: item.total,
        Revenue: item["after tds revenue"],
        "Revenue After BackVision Deduction": item["final revenue"],
      };
    });

    jsonToExcel(newItems, `Revenue_Details_of_${result[0]?.song_name}.xlsx`);
  };

  // Monthly Views (Cumulative)
  const monthlyViews = {};

  items.forEach((item) => {
    const month = item.date.slice(0, 7); // "YYYY-MM"
    if (!monthlyViews[month]) {
      monthlyViews[month] = 0;
    }
    monthlyViews[month] += item.total;
  });

  const sortedMonths2 = Object.keys(monthlyViews).sort(
    (a, b) => new Date(a) - new Date(b)
  );

  let runningTotal = 0;
  const monthlyViewsArray = sortedMonths2.map((month) => {
    runningTotal += monthlyViews[month];
    return {
      month,
      totalViews: runningTotal,
    };
  });

  // const monthWiseData = result.flatMap((platformData) => {
  //   return platformData.months.map((monthData) => ({
  //     month: monthData.month,
  //     platform: platformData.platformName,
  //     revenue: monthData.revenue,
  //     total: monthData.total,
  //   }));
  // });

  // Aggregating the revenue per month
  // const summedRevenueByMonth = monthWiseData.reduce((acc, cur) => {
  //   // If the month already exists in the accumulator, add to it
  //   if (!acc[cur.month]) {
  //     acc[cur.month] = 0;
  //   }

  //   // Sum the revenue for the current month
  //   acc[cur.month] += cur.revenue;

  //   return acc;
  // }, {});

  // Convert the summed data to an array for easier use
  // const totalRevenuePerMonth = Object.keys(summedRevenueByMonth).map(
  //   (month) => ({
  //     month,
  //     totalRevenue: summedRevenueByMonth[month],
  //   })
  // );

  console.log(
    result.map((item) => ({
      platformName: item.platformName,
      totalRevenue: item.totalRevenue,
    }))
  );

  return (
    <div
      className={`fixed top-0 left-0 w-full h-full z-[9999999] flex items-center justify-center backdrop-blur-sm transition-opacity duration-300 ${
        preview ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      onClick={() => setDetails("")}
    >
      <div
        className="bg-gray-900 text-white w-11/12 xl:w-3/5 h-[80vh] rounded-2xl p-5 overflow-y-auto relative shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => setDetails("")}
          className="absolute top-4 right-4 text-white text-xl opacity-60 hover:opacity-100 transition"
        >
          ✖
        </button>

        {/* Song Info */}
        <div className="mb-6">
          <h3 className="text-heading-3-bold font-semibold">
            {result[0]?.song_name}
          </h3>
          <h6 className="text-heading-6-bold text-gray-300">
            {result[0]?.isrc}
          </h6>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 mb-4">
          <button
            onClick={createPdf}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md text-white text-sm transition"
          >
            <FaFilePdf /> Download PDF
          </button>
          <button
            onClick={convertToExcel}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-md text-white text-sm transition"
          >
            <FaFileExcel /> Download Excel
          </button>
        </div>

        {/* PDF HIDDEN VERSION - FULLY EXPANDED */}
        <div className="h-[80vh] fixed z-[-9999] w-1/2 top-0 overflow-hidden text-black">
          <div className="p-3" ref={detailsRef}>
            <h5 className="text-heading-5-bold font-bold mb-2 mt-4">
              {result[0]?.song_name}
            </h5>
            <p className="text-sm mb-4">ISRC: {result[0]?.isrc}</p>
            <table className="w-full border border-gray-400 text-sm">
              <thead className="bg-gray-200 sticky top-0">
                <tr>
                  <th className="px-3 py-2 border">Platform</th>
                  <th className="px-3 py-2 border">Views</th>
                  <th className="px-3 py-2 border">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {result.map((item, index) => (
                  <React.Fragment key={index}>
                    <tr>
                      <td className="px-3 py-2 border font-bold">
                        {item.platformName}
                      </td>
                      <td className="px-3 py-2 border">{item.total}</td>
                      <td className="px-3 py-2 border">
                        {item["final revenue"].toFixed(2)}
                      </td>
                    </tr>
                    {item.months.map((month, i) => (
                      <tr key={i}>
                        <td className="px-4 py-1 border pl-6">
                          ↳ {month.month}
                        </td>
                        <td className="px-4 py-1 border">{month.total}</td>
                        <td className="px-4 py-1 border">
                          {month.revenue.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Visible Table with Toggle */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-800 text-sm uppercase text-gray-400">
              <tr>
                <th className="px-4 py-2">Platform</th>
                <th className="px-4 py-2">Views</th>
                <th className="px-4 py-2">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {result.map((item, index) => (
                <React.Fragment key={index}>
                  <tr
                    className="hover:bg-gray-800 transition border-t border-gray-700 cursor-pointer"
                    onClick={() => toggleExpand(item.platformName)}
                  >
                    <td className="px-4 py-2 flex items-center justify-between">
                      <span>{item.platformName}</span>
                    </td>
                    <td className="px-4 py-2">{item.total}</td>
                    <td className="px-4 py-2">
                      {item["final revenue"].toFixed(2)}
                    </td>
                  </tr>

                  {/* Only expanded shows months */}
                  {expandedPlatform === item.platformName && (
                    <tr className="bg-gray-800 text-sm text-gray-200">
                      <td colSpan="4" className="px-4 py-3">
                        <div className="overflow-x-auto">
                          <table className="w-full border border-gray-700 rounded">
                            <thead className="bg-gray-700">
                              <tr>
                                <th className="px-3 py-2">Month</th>
                                <th className="px-3 py-2">Views</th>
                                <th className="px-3 py-2">Revenue</th>
                              </tr>
                            </thead>
                            <tbody>
                              {item.months.map((monthData, i) => (
                                <tr
                                  key={i}
                                  className="border-t border-gray-600 hover:bg-gray-600"
                                >
                                  <td className="px-3 py-2">
                                    {monthData.month}
                                  </td>
                                  <td className="px-3 py-2">
                                    {monthData.total}
                                  </td>
                                  <td className="px-3 py-2">
                                    {monthData.revenue.toFixed(2)}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>

        <RevenueChart
          result={result}
          result2={result2}
          monthlyViews={monthlyViewsArray}
        />
      </div>
    </div>
  );
};

export default RevenueDetails;
