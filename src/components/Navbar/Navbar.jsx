import React, { useContext, useState, useEffect, useRef } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { ProfileContext } from "../../contexts/ProfileContext";
import { navItem } from "../../constants";
import { MdLogout, MdMenu, MdClose } from "react-icons/md";
import { FaCaretDown } from "react-icons/fa";
import profile from "./../../assets/images/profile.png";
import logo from "./../../assets/images/logo2.webp";
import ReactGA from "react-ga4";
import NotificationDropdown from "../NotificationDropdown/NotificationDropdown";
import { RiTokenSwapLine } from "react-icons/ri";

const Navbar = () => {
  const {
    setProfileData,
    userData,
    setUserData,
    loginTime,
    setLogoutTime,
    dollarRate,
  } = useContext(ProfileContext);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [rightDropdownOpen, setRightDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [nestedDropdownOpen, setNestedDropdownOpen] = useState(false);
  const dropdownMenuRef = useRef(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState([]); // For notification list

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Ensure that the click is outside the main dropdown and any nested dropdowns
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) && // Outside the main dropdown
        dropdownMenuRef.current &&
        !dropdownMenuRef.current.contains(event.target) // Outside the nested dropdown
      ) {
        setDropdownOpen(false); // Close the main dropdown
        setNestedDropdownOpen(false); // Close any nested dropdowns
      }
    };

    // Add event listener to detect mouse clicks
    document.addEventListener("mouseup", handleClickOutside);

    return () => {
      // Cleanup event listener when the component is unmounted
      document.removeEventListener("mouseup", handleClickOutside);
    };
  }, []); // Empty dependency array to run once on mount and unmount

  // Close mobile menu when navigating
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const logicalNavItems = userData.yearlyPlanEndDate
    ? navItem.filter(
        ({ text }) => text !== "Plans" && text !== "Yearly Plan Request"
      )
    : navItem.filter(({ text }) => text !== "Song Upload");

  const activePage =
    navItem.find((item) => item.path === pathname) ||
    navItem
      .flatMap((item) => item.dropdownItem || [])
      .find((dropdown) => dropdown.dropdownPath === pathname) ||
    {};

  const sendTimeSpentToAnalytics = (duration) => {
    ReactGA.event({
      category: "User",
      action: "Time Spent After Login",
      value: Math.round(duration),
    });
  };

  const handleLogout = () => {
    setProfileData({});
    setUserData({});
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    navigate("/login");

    setLogoutTime(Date.now());
    sendTimeSpentToAnalytics((Date.now() - loginTime) / 1000);
  };

  // Simulate a fetch for notifications (you can replace it with an actual API call)
  useEffect(() => {
    setNotifications([
      { id: 1, message: "New message received" },
      { id: 2, message: "Your plan has been updated" },
      { id: 3, message: "Payment processed successfully" },
    ]);
  }, []);

  // console.log(
  //   userData?.lifetimeRevenue?.toFixed(2),
  //   userData?.lifetimeDisbursed?.toFixed(2),
  //   userData?.tokenized || 0
  // );

  return (
    <div
      className="fixed top-0 w-full bg-[#000] z-[99999]"
      id="topbar"
      onMouseLeave={() => setRightDropdownOpen(false)}
    >
      <nav className="flex flex-wrap lg:flex-nowrap px-0 items-center justify-between shadow-lg container">
        <div className="flex justify-between items-center w-full lg:w-auto px-2">
          <Link
            className="inline-block py-1 text-white text-heading-6"
            to={"/"}
          >
            Logo
          </Link>

          {/* Mobile menu button */}
          <div className="flex items-center gap-4 lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-white text-heading-4"
            >
              {mobileMenuOpen ? <MdClose /> : <MdMenu />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown for profile */}
        {rightDropdownOpen && (
          <div className="absolute right-4 top-4 w-[200px] bg-gray-800 text-white shadow-lg rounded-lg z-50 lg:hidden">
            <div className="px-4 py-2">
              <p className="text-sm">
                {userData?.first_name + " " + userData?.last_name}
              </p>
              <p className="text-xs text-gray-400">
                {userData?.user_email || userData?.emailId}
              </p>
            </div>
            <div className="border-t border-gray-700">
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-red-500 hover:bg-gray-700"
              >
                Logout <MdLogout className="inline-block" />
              </button>
            </div>
          </div>
        )}

        {/* Navigation menu - responsive */}
        <div
          className={`${
            mobileMenuOpen ? "flex" : "hidden"
          } lg:flex flex-col lg:flex-row w-full lg:w items-start lg:items-center justify-between lg:w-[65%]`}
        >
          {/* Nav Items */}
          <div className="flex flex-col lg:flex-row w-full lg:w-auto items-start lg:items-center h-[75vh] lg:h-auto overflow-y-auto lg:overflow-y-visible">
            {logicalNavItems.map((item) => (
              <div key={item.path} className="relative w-full lg:w-auto">
                {item.text === "Forms" ? (
                  <button
                    className="flex items-center p-2 lg:py-2 gap-1 text-white w-full lg:w-auto group"
                    onClick={() => setDropdownOpen(!dropdownOpen)} // Toggle the dropdown
                    ref={dropdownRef} // Attach the ref here
                  >
                    <span className="flex items-center gap-1">
                      <span>{item.icon}</span>
                      <span className="lg:w-0 overflow-hidden group-hover:w-full transition-all whitespace-nowrap relative">
                        {item.text}
                      </span>
                      <FaCaretDown />
                    </span>
                  </button>
                ) : (
                  <NavLink
                    to={item.path}
                    className={`text-white px-2 py-2 lg:py-2 flex items-center group w-full lg:w-auto gap-0 hover:gap-2 transition-all`}
                    onClick={() => setDropdownOpen(false)}
                  >
                    <span>{item.icon}</span>
                    <span className="lg:w-0 overflow-hidden group-hover:w-full transition-all whitespace-nowrap relative">
                      {item.text}
                    </span>
                  </NavLink>
                )}
                {dropdownOpen && (
                  <ul
                    className="bg-gray-800 text-white shadow-lg rounded-lg lg:absolute lg:left-0 lg:mt-2 lg:w-[15rem] w-full"
                    ref={dropdownMenuRef}
                  >
                    {item.dropdownItem?.map((subItem) => (
                      <li
                        key={subItem.dropdownPath}
                        className="hover:bg-gray-700 transition"
                      >
                        <NavLink
                          to={subItem.dropdownPath}
                          className="px-2 py-1 block w-full"
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent the dropdown from closing when clicking on a link
                          }}
                        >
                          {subItem.text}
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>

          {/* Profile Section */}
          <div className="hidden lg:flex items-center gap-1 relative text-white">
            <NotificationDropdown />
            <div className="flex gap-1 items-center">
              <Link
                to={"/accounts"}
                className="hover:bg-interactive-light hover:shadow-[0_0_20px] transition hover:shadow-interactive-light px-1 py-[4px] rounded text-subtitle-1"
              >
                <span className="italic">
                  {userData.billing_country === "India" ? "₹" : "$"}
                  {userData.billing_country === "India"
                    ? (
                        parseFloat(userData?.lifetimeRevenue?.toFixed(2) || 0) -
                        (parseFloat(
                          userData?.lifetimeDisbursed?.toFixed(2) || 0
                        ) +
                          (userData?.tokenized || 0))
                      ).toFixed(2) || 0
                    : (
                        (parseFloat(
                          userData?.lifetimeRevenue?.toFixed(2) || 0
                        ) -
                          (parseFloat(
                            userData?.lifetimeDisbursed?.toFixed(2) || 0
                          ) +
                            (userData?.tokenized || 0))) *
                        dollarRate
                      ).toFixed(2) || 0}
                </span>
              </Link>
              <span className="flex gap-[4px] items-center">
                <RiTokenSwapLine /> {userData?.tokenized?.toFixed(2)}
              </span>
            </div>
            <div
              ref={dropdownMenuRef}
              onMouseEnter={() => setRightDropdownOpen(true)}
            >
              <img
                src={userData?.display_image || profile}
                className="rounded-full w-[40px] aspect-square object-cover cursor-pointer"
                alt="profile"
              />
              {rightDropdownOpen && (
                <div className="absolute right-0 mt-0 w-[250px] bg-gray-800 text-white shadow-lg rounded-lg overflow-hidden">
                  <div
                    onClick={() => navigate("/profile")}
                    className="px-2 py-2 cursor-pointer relative"
                  >
                    <div className="w-1 h-1 bg-gray-800 absolute -top-[4px] rotate-45 right-1"></div>
                    <p className="text-sm">
                      {userData?.first_name + " " + userData?.last_name}
                    </p>
                    <p className="text-xs text-gray-400">
                      {userData?.user_email || userData?.emailId}
                    </p>
                  </div>
                  <div className="border-t border-gray-700">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-2 py-2 text-red-500 hover:bg-gray-700"
                    >
                      Logout <MdLogout className="inline-block" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
