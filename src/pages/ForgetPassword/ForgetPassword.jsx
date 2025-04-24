import React, { useState } from "react";
import AuthBody from "../../components/AuthBody/AuthBody";
import InputField from "../../components/InputField/InputField";
import Button from "../../components/Button/Button";
import axios from "axios";
import { toast } from "react-toastify";
import { backendUrl } from "../../constants";
import { Link } from "react-router-dom";
// import { Link } from "react-router-dom";

const ForgetPassword = () => {
  // const disabled =
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const resetPassword = (e) => {
    // codes fore reset password will go here
    setSending(true);
    e.preventDefault();

    const formData = new FormData();
    formData.append("emailId", e.target["forgot-email"].value);

    axios
      .post(backendUrl + "reset-password", {
        user_email: e.target["forgot-email"].value.toLowerCase(),
      })
      .then(({ data }) => {
        // data;
        if (data.modifiedCount) {
          setSending(false);
          setSent(true);
          toast.success(
            "Password Set is Successful. Check your Email for Your Password",
            {
              position: "bottom-center",
            }
          );
        }
      })
      .catch((err) => {
        toast.error(err.response.data.message);
        setSending(false);
      });
  };
  return (
    <div className="flex justify-center items-center min-h-screen text-white">
      <div className="bg-gray-800 p-4 rounded-lg shadow-lg max-w-sm lg:max-w-md w-full">
        <div className="flex justify-between items-center">
          <h5 className="text-heading-5-bold font-bold text-center text-blue-400">
            Reset Password
          </h5>

          {/* <aside>
            Don't have an account?{" "}
            <Link to={"/signup"} className="text-interactive-light-disabled">
              Create a New One
            </Link>
          </aside> */}
        </div>
        <form onSubmit={resetPassword}>
          <InputField
            label="Email"
            placeholder="Enter your existing Email Address"
            containerClassName="mt-3"
            name="forgot-email"
            required={true}
            hideRequired={true}
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />

          <div className="mt-3 mb-2 text-center">
            <Button disabled={!email.length || sending || sent}>
              {sending ? "Sending..." : sent ? "Sent" : "Reset"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgetPassword;
