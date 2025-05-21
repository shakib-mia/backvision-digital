import React, { useState } from "react";
import InputField from "../../components/InputField/InputField";
import Button from "../../components/Button/Button";
import axios from "axios";
import { backendUrl } from "../../constants";
import bg from "../../assets/images/login-bg.jpg";
import ReactOwlCarousel from "react-owl-carousel";
import { useNavigate } from "react-router-dom";

// import { Link } from "react-router-dom";

const ForgetPassword = () => {
  // const disabled =
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);

  const navigate = useNavigate();

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
        console.log(data);
        setSending(false);
        navigate("/verify-otp/reset?token=" + data);
        // data;
        // if (data.modifiedCount) {
        //   setSending(false);
        //   setSent(true);
        //   toast.success(
        //     "Password Set is Successful. Check your Email for Your Password",
        //     {
        //       position: "bottom-center",
        //     }
        //   );
        // }
      })
      .catch((err) => {
        console.log(err);
        // toast.error(err.response.data.message);
        setSending(false);
      });
  };
  return (
    <div
      className="flex justify-center items-center min-h-screen text-white min-w-[100vw] absolute left-0 bg-center bg-cover bg-no-repeat"
      id="login-page"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 max-w-4xl mx-auto rounded-lg overflow-hidden shadow-[0_10px_12px] shadow-[#000]">
        <aside className="p-1">
          <ReactOwlCarousel
            items={1}
            className="h-full hidden lg:block"
            autoplay
            autoplayTimeout={3000}
            loop
            animateIn="fadeIn"
            animateOut="fadeOut"
            dots={true}
            mouseDrag={false} // disables mouse swiping
            touchDrag={false} // disables touch swiping
            pullDrag={false} // disables pull drag behavior
          >
            <img
              src={bg}
              alt="background"
              className="!w-full !h-full object-cover object-[7%] rounded-md aspect-square"
            />

            <img
              src={
                "https://t4.ftcdn.net/jpg/07/62/21/69/360_F_762216992_HjUZb565ohcpBh6R2rtal3JlOEf94XSX.jpg"
              }
              alt="background"
              className="!w-full !h-full object-cover object-center rounded-md aspect-square"
            />

            <img
              src={
                "https://as1.ftcdn.net/v2/jpg/10/97/26/64/1000_F_1097266431_IG7QdOTzN4kgYRCCqEqTv3A5ZXDdxllx.jpg"
              }
              alt="background"
              className="!w-full !h-full object-cover object-right rounded-md aspect-square"
            />
          </ReactOwlCarousel>
        </aside>
        <div className="p-4 flex flex-col justify-center">
          <div className="flex justify-between items-center">
            <h4 className="text-heading-4-bold font-bold text-center text-blue-400">
              Forgot Your Password
            </h4>
          </div>
          <form className="mt-3" onSubmit={resetPassword}>
            <InputField
              type="email"
              label="Email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              name="forgot-email"
              required={true}
            />

            <Button disabled={sending} type={"submit"}>
              Submit{sending ? "ting" : ""}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;
