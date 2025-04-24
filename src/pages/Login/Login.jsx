import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { useSignInWithGoogle } from "react-firebase-hooks/auth";
import { toast } from "react-toastify";
import auth from "../../firebase.init";
import { ProfileContext } from "../../contexts/ProfileContext";
import axios from "axios";
import { backendUrl } from "../../constants";
import InputField from "../../components/InputField/InputField";
import Button from "../../components/Button/Button";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [signInWithGoogle, user, googleLoading, googleError] =
    useSignInWithGoogle(auth);
  const { setToken, setUserData, setLoginTime } = useContext(ProfileContext);

  useEffect(() => {
    if (user) {
      const email = user.user.email;
      axios
        .get(`${backendUrl}handle-firebase-login/${email}`)
        .then(({ data }) => {
          if (data?.token) {
            sessionStorage.setItem("token", data.token);
            setLoginTime(Date.now());
            setUserData(data.details || { user_email: email });
            navigate("/");
          }
        })
        .catch((err) => toast.error(err.response?.data?.message));
    }
  }, [user]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post(`${backendUrl}user-login`, {
        email,
        password,
      });
      if (data?.token) {
        sessionStorage.setItem("token", data.token);
        setToken(data.token);
        setLoginTime(Date.now());
        setUserData(data.details || { user_email: email });
        navigate("/");
      }
    } catch (err) {
      toast.error(err.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen text-white">
      <div className="bg-gray-800 p-4 rounded-lg shadow-lg max-w-sm lg:max-w-md w-full">
        <div className="flex justify-between items-center">
          <h4 className="text-heading-4-bold font-bold text-center text-blue-400">
            Login
          </h4>

          {/* <aside className="hidden lg:block">
            Don't have an account?{" "}
            <Link to={"/signup"} className="text-blue-400">
              Create a New One
            </Link>
          </aside> */}
        </div>
        <form onSubmit={handleLogin} className="mt-3">
          {/* <input
            type="email"
            placeholder="Email Address"
            className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          /> */}

          <InputField
            type="email"
            label="Email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            required={true}
          />

          <InputField
            type="password"
            label="Password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            required={true}
          />
          {/* <input
            type="password"
            placeholder="Password"
            className="w-full mt-3 px-4 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          /> */}
          <Button disabled={loading || !email.length || !password.length}>
            {loading ? "Logging in..." : "Login"}
          </Button>
          {/* <button
            type="submit"
            className="w-full mt-2 bg-interactive-light disabled:bg-interactive-light-disabled py-2 rounded-lg hover:bg-interactive-light-hover shadow-[0_8px_16px] hover:shadow-none shadow-interactive-light-focus transition"
            disabled={loading || !email.length || !password.length}
          >
            {loading ? "Logging in..." : "Login"}
          </button> */}
        </form>

        {/* <div className="flex items-center my-4">
          <div className="flex-grow border-t border-gray-500"></div>
          <span className="mx-4 text-gray-400">OR</span>
          <div className="flex-grow border-t border-gray-500"></div>
        </div>

        <button
          className="w-full flex items-center justify-center gap-2 bg-interactive-light-confirmation py-2 rounded-lg hover:bg-interactive-light-confirmation-hover transition"
          onClick={() => signInWithGoogle()}
        >
          <FcGoogle size={20} /> Continue with Google
        </button> */}

        <aside className="text-center mt-3">
          Don't have an account?{" "}
          <Link to={"/signup"} className="text-blue-400">
            Create a New One
          </Link>
        </aside>
        <div className="text-center">
          <Link to="/forgot-password" className="text-blue-400 hover:underline">
            Forgot your password?
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
