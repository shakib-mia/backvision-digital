import React, { useContext, useEffect, useState } from "react";
import cover from "./../../assets/images/artist-cover.webp";
import downArrowWhite from "./../../assets/icons/down-arrow-white.webp";
// import VerticalCarousel from "../../components/VerticalCarousel/VerticalCarousel";
import { ProfileContext } from "../../contexts/ProfileContext";
import { useLocation } from "react-router-dom";
import profileEdit from "./../../assets/icons/profile-edit.webp";
import LoadingPulse from "../../components/LoadingPulse/LoadingPulse";
import EditProfile from "../../components/EditProfile/EditProfile";
import ProfilePicture from "../../components/ProfilePicture/ProfilePicture";
import Songs from "../../components/Songs/Songs";
import axios from "axios";
import { backendUrl } from "../../constants";
import {
  FaSquareFacebook,
  FaSquareInstagram,
  FaSquareXTwitter,
} from "react-icons/fa6";
import CopyToClipboard from "react-copy-to-clipboard";
import { FaLink } from "react-icons/fa";
import { Tooltip } from "react-tooltip";
import { MdModeEdit } from "react-icons/md";

const Profile = () => {
  const { userData } = useContext(ProfileContext);
  const location = useLocation();
  const [profileData, setProfileData] = useState(
    location.pathname === "/profile" ? userData : {}
  );
  const [copied, setCopied] = useState(false);
  // console.log(profileData);

  useEffect(() => {
    if (copied) {
      setTimeout(() => setCopied(false), 5000);
    }
  }, [copied]);

  useEffect(() => {
    // Extract the userId from the URL
    const userId = location.pathname.split("/")[2];

    if (userId) {
      // Fetch the profile data using the userId
      axios
        .get(`${backendUrl}profile/${userId}`)
        .then(({ data }) => {
          setProfileData(data);
        })
        .catch((error) => {
          console.error("Error fetching profile data:", error);
        });
    } else if (location.pathname === "/profile") {
      // If no userId in the URL and pathname is "/profile", use userData
      console.log(userData);
      setProfileData(userData);
    }
  }, [location.pathname, userData]); // Add dependencies

  // console.log(profileData);

  const route = location.pathname.split("/");
  const [edit, setEdit] = useState(false);

  // const handleFollow = () => {
  //   ("follow");
  // };

  const [details, setDetails] = useState(false);
  const text = profileData.bio;
  console.log(profileData);

  return (
    <div
      className={`mx-auto rounded-[20px] rounded-t-none overflow-y-auto`}
      id="profile-container"
      style={{
        marginTop: document.getElementById("topbar")?.clientHeight + "px",
      }}
    >
      <div className="relative">
        <div className="w-full h-[12rem] lg:h-full">
          {location.pathname === "/profile" && (
            <div className="bg-gradient-to-bl from-black-secondary to-[30%] to-transparent absolute top-0 left-0 w-full h-full">
              <div className="absolute bottom-1 right-1 lg:bottom-2 lg:right-2">
                <img
                  src={profileEdit}
                  className="cursor-pointer"
                  alt=""
                  title="Edit your cover photo"
                  onClick={() => setEdit(true)}
                />
              </div>
            </div>
          )}
          <img
            src={profileData.cover_photo || cover}
            className="object-cover w-full h-[12rem] lg:h-[18rem]"
            alt=""
          />
        </div>
      </div>

      <div className="bg-black">
        <div className="flex flex-col lg:flex-row lg:gap-[60px] relative container">
          <div className="w-full left-0 px-4 lg:px-0 relative -top-7 lg:top-[-100px]">
            <div className="flex flex-col lg:flex-row gap-[11px]">
              <div className="pt-4">
                <ProfilePicture
                  imageUrl={profileData.display_image}
                  profileData={profileData}
                  // setProfileData={setProfileData}
                />
              </div>
              <aside className="text-white lg:mt-[8rem] lg:w-11/12">
                <div className="flex flex-col lg:flex-row items-center gap-1 lg:gap-5">
                  <div className="flex items-center flex-col lg:flex-row gap-2">
                    {profileData.first_name ? (
                      <h5 className="text-heading-5 underline">
                        {profileData.first_name} {profileData.last_name}
                      </h5>
                    ) : (
                      <LoadingPulse className="w-[200px] h-[30px]" />
                    )}

                    {route[route.length - 1] === "profile" &&
                    profileData.first_name ? (
                      <div className="flex items-center space-x-2">
                        {/* <img
                        src={profileEdit}
                        onClick={() => setEdit(true)}
                        className="w-[21px] h-[21px] cursor-pointer"
                        alt="edit"
                      /> */}
                        <MdModeEdit
                          onClick={() => setEdit(true)}
                          data-tooltip-id="edit"
                          data-tooltip-content="Edit Profile"
                          className="cursor-pointer text-heading-6 focus:outline-none"
                        />
                        <Tooltip id="edit" />
                        <CopyToClipboard
                          text={
                            window.location.href + "/" + profileData["user-id"]
                          }
                          data-tooltip-id={"copy"}
                          onCopy={() => setCopied(true)}
                          data-tooltip-content={
                            copied ? "Copied" : "Copy Link To Clipboard"
                          }
                          className="cursor-pointer text-heading-6 focus:outline-none"
                        >
                          <FaLink />
                        </CopyToClipboard>
                        <Tooltip id={"copy"} />
                      </div>
                    ) : profileData.first_name ? (
                      <div className="flex items-center space-x-2">
                        {/* Hidden as it is not functional */}
                        {/* <img
                        src={userplus}
                        onClick={handleFollow}
                        className="w-3 h-3 cursor-pointer"
                        alt="follow"
                      /> */}
                        <CopyToClipboard
                          text={
                            window.location.href + "/" + profileData["user-id"]
                          }
                          data-tooltip-id={"copy"}
                          onCopy={() => setCopied(true)}
                          data-tooltip-content={
                            copied ? "Copied" : "Copy Link To Clipboard"
                          }
                          className="cursor-pointer text-heading-6 focus:outline-none"
                        >
                          <FaLink />
                        </CopyToClipboard>
                        <Tooltip id={"copy"} />
                      </div>
                    ) : (
                      <LoadingPulse width={"30px"} height={"30px"} />
                    )}
                  </div>

                  <div
                    className={`${
                      profileData.first_name
                        ? "flex gap-[10px]"
                        : "grid grid-cols-3 gap-[10px]"
                    }`}
                  >
                    {profileData.facebook_profile_link && (
                      <a
                        href={profileData.facebook_profile_link}
                        className="text-heading-6"
                        target="_blank"
                        rel="noreferrer"
                      >
                        <FaSquareFacebook />
                      </a>
                    )}
                    {profileData.instagram_profile_link && (
                      <a
                        href={profileData.instagram_profile_link}
                        className="text-heading-6"
                        target="_blank"
                        rel="noreferrer"
                      >
                        <FaSquareInstagram />
                      </a>
                    )}
                    {profileData.twitter_profile_link && (
                      <a
                        href={profileData.twitter_profile_link}
                        className="text-heading-6"
                        target="_blank"
                        rel="noreferrer"
                      >
                        <FaSquareXTwitter />
                      </a>
                    )}
                  </div>
                </div>

                {/* <p className="text-[12px] mt-[6px]">99 Followers</p> */}
                <p className="text-[12px] w-5/6 mt-2 mb-0 font-bold text-center 2xl:text-left tracking-[1.25px] uppercase">
                  {profileData["short-bio"]}
                </p>

                <p className="text-[12px] w-5/6 mt-1 text-center lg:text-left">
                  {text?.slice(0, details ? text?.length - 1 : 200)}
                  {!details && text?.length > 200 && "..."}
                  <br />
                  {text?.length > 200 && (
                    <button
                      className="items-center gap-[6px] mt-1 justify-center lg:justify-start inline-flex w-full"
                      onClick={() => setDetails(!details)}
                    >
                      {details ? (
                        <>
                          SHOW LESS{" "}
                          <img
                            src={downArrowWhite}
                            className="rotate-180"
                            alt=""
                          />
                        </>
                      ) : (
                        <>
                          SHOW MORE <img src={downArrowWhite} alt="" />
                        </>
                      )}
                    </button>
                  )}
                </p>
              </aside>
            </div>
          </div>
        </div>
        <div className="container">
          <Songs />
        </div>

        {edit && <EditProfile handleClose={() => setEdit(false)} />}
      </div>
    </div>
  );
};

export default Profile;
