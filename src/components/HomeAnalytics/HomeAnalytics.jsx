import React, { useContext, useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { ProfileContext } from "../../contexts/ProfileContext";
import axios from "axios";
import { backendUrl } from "../../constants";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const HomeAnalytics = () => {
  const [data, setData] = useState([]);

  const { token, setToken } = useContext(ProfileContext);
  const navigate = useNavigate();
  // console.log(userData);
  useEffect(() => {
    const config = {
      headers: {
        token,
      },
    };
    axios
      .get(backendUrl + "user-revenue/monthly", config)
      .then(({ data }) => setData(data.lifetimeRevenue))
      .catch((error) => {
        // console.log(error);
        if (error.response.status === 401) {
          sessionStorage.removeItem("token");
          navigate("/login");
          setToken("");
          toast.error("Token has expired", {
            position: "bottom-center",
          });
        }
      });
  }, []);

  return (
    <div className="card-shadow p-2">
      <h4 className="text-heading-4-bold capitalize text-white mb-2 pl-3">
        Month wise revenue
      </h4>
      <LineChart
        width={730}
        height={250}
        data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        {/* <CartesianGrid strokeDasharray="3 3" /> */}
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="revenue"
          name="Revenue"
          stroke="#2B52DD"
          strokeWidth={3}
        />
      </LineChart>
    </div>
  );
};

export default HomeAnalytics;
