import React, { useContext, useState } from "react";
import InputField from "../InputField/InputField";
import Button from "../Button/Button";
import { ProfileContext } from "../../contexts/ProfileContext";
import Swal from "sweetalert2";
import axios from "axios";
import { backendUrl } from "../../constants";

const Tokenize = ({ showTokenize, isINR, accountBalance }) => {
  const [amount, setAmount] = useState(0);
  const { dollarRate, token, setRefetch } = useContext(ProfileContext);

  const handleAmountChange = (e) => {
    setAmount(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const inputAmount = parseFloat(amount); // user input
    if (!inputAmount || inputAmount <= 0) {
      return Swal.fire(
        "Invalid Amount",
        "Please enter a valid amount.",
        "warning"
      );
    }

    // Internally convert to INR if needed
    const tokenizedINR = isINR ? inputAmount : inputAmount / dollarRate;

    // Show confirmation dialog to user using their selected currency
    const result = await Swal.fire({
      title: "Confirm Tokenization",
      html: `Are you sure you want to tokenize <strong>${
        isINR ? "₹" : "$"
      }${inputAmount}</strong>?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, tokenize",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      // You can now process tokenization using `tokenizedINR`
      //   console.log(`Tokenized Amount in INR: ₹${tokenizedINR.toFixed(2)}`);
      axios
        .post(
          backendUrl + "tokenize",
          { tokenizedINR },
          {
            headers: {
              token,
            },
          }
        )
        .then((res) => {
          setRefetch((ref) => !ref);
          Swal.fire({
            icon: "success",
            title: "Tokenization Complete",
            text: `₹${tokenizedINR.toFixed(
              2
            )} has been deducted from your account balance.`,
            confirmButtonColor: "#3085d6",
          });
        });

      // Show success message

      showTokenize(false); // Close modal
    }
  };

  return (
    <div
      className="fixed top-0 left-0 z-[99999] backdrop-blur-lg h-screen w-screen flex justify-center items-center"
      onClick={() => showTokenize(false)}
    >
      <div
        className="bg-black p-3 max-w-md w-full h-fit shadow-xl text-white rounded-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <h5 className="text-heading-5-bold text-center">Tokenize</h5>

        <form onSubmit={handleSubmit} className="mt-1">
          <InputField
            min={0}
            max={parseFloat(accountBalance)}
            type="number"
            onChange={handleAmountChange}
            value={parseFloat(amount)}
            required={true}
            label="Enter Amount"
          />

          <Button type="submit">Convert</Button>
        </form>
      </div>
    </div>
  );
};

export default Tokenize;
