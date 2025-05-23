import React, { useContext, useState } from "react";
import { ProfileContext } from "../../contexts/ProfileContext";
import Button from "../Button/Button";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { backendUrl } from "../../constants";
import { toast } from "react-toastify";
import { RiTokenSwapFill } from "react-icons/ri";
import Tokenize from "../Tokenize/Tokenize";
import { FaRupeeSign } from "react-icons/fa";

const WithdrawalSection = () => {
  const { setProfileData, userData, dollarRate, token, setRefetch } =
    useContext(ProfileContext);
  const { lifetimeRevenue, lifetimeDisbursed } = userData;
  const [tokenize, showTokenize] = useState(false);
  const accountBalance =
    lifetimeRevenue?.toFixed(2) ||
    0 -
      (parseFloat(lifetimeDisbursed || 0) + (userData.tokenized || 0))?.toFixed(
        2
      );
  const navigate = useNavigate();

  // State to toggle between INR and USD
  const [isINR, setIsINR] = useState(userData.billing_country === "India");

  // Convert amount to INR if applicable
  const convertToUSD = (amount) => amount * dollarRate;

  // Handle the withdrawal process
  const handleWithdrawClick = () => {
    navigate("/revenue-form");
    if (userData.kycFilled) {
      const config = {
        headers: { token },
      };

      axios.get(backendUrl + "withdrawal-request", config).then(({ data }) => {
        if (data.insertedId) {
          setRefetch((ref) => !ref);
          toast.success("Withdrawal Request Submitted Successfully");
        }
      });
    } else {
      navigate("/revenue-form");
    }
  };

  const currencySymbol = isINR ? "₹" : "$";
  const displayRevenue = !isINR
    ? convertToUSD(lifetimeRevenue || 0).toFixed(2)
    : lifetimeRevenue?.toFixed(2) || 0;
  const numericBalance = Number(accountBalance) || 0;

  const displayWithdrawableAmount = !isINR
    ? convertToUSD(numericBalance).toFixed(2)
    : numericBalance.toFixed(2);

  return (
    <div className="max-w-xl mx-auto shadow">
      {/* {tokenize && ( */}
      <Tokenize
        showTokenize={showTokenize}
        isINR={isINR}
        tokenize={tokenize}
        accountBalance={displayWithdrawableAmount}
      />
      {/* )} */}
      <div className="text-white rounded-lg shadow-[6px_6px_20px_rgb(10,10,10)] bg-gradient-to-br to-neutral-800 from-neutral-900 p-3 h-full">
        <h4 className="text-2xl text-heading-4-bold font-semibold mb-1">
          Withdrawal Section
        </h4>

        {/* Display Lifetime Revenue and Withdrawable Amount */}
        <div className="mb-4">
          <p className="text-lg">
            Lifetime Revenue: {currencySymbol}
            {displayRevenue}
          </p>
          <div className="flex gap-1">
            <p className="text-lg">
              Withdrawable Amount: {currencySymbol}
              {displayWithdrawableAmount}
            </p>
          </div>
          <Button
            onClick={() => showTokenize(true)}
            disabled={parseFloat(displayWithdrawableAmount) === 0}
          >
            <RiTokenSwapFill /> Tokenize
          </Button>
        </div>

        {/* Currency Toggle Button */}
        <div className="mb-4">
          <button
            className="text-sm text-blue-500 hover:text-blue-700"
            onClick={() => setIsINR(!isINR)}
          >
            Switch to {isINR ? "USD" : "INR"}
          </button>
        </div>

        {/* Withdraw Button - Disabled if withdrawable amount is less than $1000 */}
        <Button onClick={handleWithdrawClick} disabled={accountBalance < 1000}>
          {accountBalance >= 1000 ? (
            "Request Withdraw"
          ) : (
            <>
              Minimum Withdrawable Amount:{" "}
              <div className="flex items-center">
                {userData.billing_country === "India" ? "₹" : "$"}
                {userData.billing_country === "India"
                  ? 1000
                  : (dollarRate * 1000).toFixed(2)}
              </div>
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default WithdrawalSection;
