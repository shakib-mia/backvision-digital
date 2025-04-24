import { AiFillDislike, AiFillLike } from "react-icons/ai";
import React, { useContext, useState } from "react";
import { FaApple, FaChevronDown, FaMusic } from "react-icons/fa";
import { ProfileContext } from "../../contexts/ProfileContext";
import { useLocation, useNavigate } from "react-router-dom";
import EditSong from "../EditSong/EditSong";
import { RiEditBoxFill } from "react-icons/ri";
import { FaShareNodes } from "react-icons/fa6";
import axios from "axios";
import { backendUrl } from "../../constants";

const SongItem = ({ song, isFirst, openSongId, setOpenSongId }) => {
  const [editId, setEditId] = useState("");
  const navigate = useNavigate();
  const { userData, setRefetch } = useContext(ProfileContext);
  const location = useLocation();
  const [expandedSocial, setExpandedSocial] = useState(false);

  const {
    Song,
    songName,
    jiosaavn,
    "wynk-music": wynk,
    gaana,
    spotify,
    "apple-music": apple,
    "amazon-music": amazon,
    _id,
  } = song;

  // Special styling for first item
  const firstItemStyles = isFirst
    ? {
        zIndex: 10,
        position: "relative",
      }
    : {};

  const isAccordionOpen = isFirst
    ? openSongId === "" || openSongId === _id
    : openSongId === _id;

  function hasLinkWithoutUrlOrArtWork(song) {
    // Iterate through the song object keys
    for (const key of Object.keys(song)) {
      const value = song[key]; // Get the value for each key

      // Check if the value includes a link and 'songUrl' or 'artWork' is missing
      if (
        typeof value === "string" &&
        value.includes("http") &&
        (!song.songUrl || !song.artWork)
      ) {
        return true; // Found a link without 'songUrl' or 'artWork'
      }
    }
    return false; // No invalid fields found
  }

  // useEffect(() => {
  //   hasLinkWithoutUrlOrArtWork(song);
  // }, []);
  const userId = userData["user-id"];

  // Handle Like Action
  const handleLike = (e) => {
    e.stopPropagation();

    if (!song.likes) {
      song.likes = [];
    }
    if (!song.dislikes) {
      song.dislikes = [];
    }

    // If user is not already in likes, add them and remove from dislikes
    if (!song.likes.includes(userId)) {
      song.likes.push(userId);
      song.dislikes = song.dislikes.filter((id) => id !== userId); // Remove user from dislikes if they are there
    } else {
      // If user is already in likes, remove them
      song.likes = song.likes.filter((id) => id !== userId);
    }

    // Update backend with the changes
    axios
      .put(backendUrl + "songs/update-like-dislike", song)
      .then(({ data }) => {
        console.log(data);
        setRefetch((ref) => !ref);
      })
      .catch((err) => console.log(err.response?.data || err.message));
  };

  // Handle Dislike Action
  const handleDislike = (e) => {
    e.stopPropagation();

    if (!song.likes) {
      song.likes = [];
    }
    if (!song.dislikes) {
      song.dislikes = [];
    }

    // If user is not already in dislikes, add them and remove from likes
    if (!song.dislikes.includes(userId)) {
      song.dislikes.push(userId);
      song.likes = song.likes.filter((id) => id !== userId); // Remove user from likes if they are there
    } else {
      // If user is already in dislikes, remove them
      song.dislikes = song.dislikes.filter((id) => id !== userId);
    }
    console.log(song);

    // Update backend with the changes
    axios
      .put(backendUrl + "songs/update-like-dislike", song)
      .then(({ data }) => {
        console.log(data);
        setRefetch((ref) => !ref);
      })
      .catch((err) => console.log(err.response?.data || err.message));
  };

  return (
    <div
      className="lg:px-2 py-1 card-shadow hover:shadow-[0_8px_8px_#111] cursor-pointer mb-1"
      // className="border-b border-white lg:px-2 py-1"
      onMouseEnter={() => {
        setExpandedSocial(true);
      }}
      onMouseLeave={() => setExpandedSocial(false)}
    >
      {/* <audio src={jiosaavn} controls></audio> */}
      <div
        className="flex items-center justify-between py-[4px] lg:py-[11px]"
        style={firstItemStyles}
      >
        <div className="flex items-center gap-[4px] lg:gap-[12px]">
          <FaMusic className="text-white hidden lg:block" />
          <h6 className="text-white lg:text-heading-6">{Song || songName}</h6>
        </div>

        <div className="flex gap-2">
          {/* Platform icons */}
          <div
            className={`flex ${expandedSocial ? "gap-2" : "gap-0"} transition`}
          >
            {/* <button onClick={() => setexpandedSocial(_id)} className="transition">
              <FaChevronCircleLeft
                className={`text-heading-5 text-white ${
                  expandedSocial === _id ? "rotate-180" : "rotate-0"
                }`}
              />
            </button> */}
            <div
              className="flex gap-2 items-center transition-all overflow-hidden ml-auto"
              style={{ width: expandedSocial ? "100%" : 0 }}
            >
              {jiosaavn && (
                <a
                  href={jiosaavn}
                  target="_blank"
                  rel="noreferrer"
                  className="cursor-pointer hover:opacity-80 transition-opacity z-20"
                  style={{ display: "block" }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <img
                    src="http://localhost:5000/uploads/platforms/jiosaavn.png"
                    alt="JioSaavn"
                    className="w-2 lg:w-3"
                  />
                </a>
              )}

              {wynk && (
                <a
                  href={wynk}
                  target="_blank"
                  rel="noreferrer"
                  className="cursor-pointer hover:opacity-80 transition-opacity z-20"
                  style={{ display: "block" }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <img
                    src="http://localhost:5000/uploads/platforms/wynk-music.png"
                    alt="Wynk"
                    className="w-2 lg:w-3"
                  />
                </a>
              )}

              {gaana && (
                <a
                  href={gaana}
                  target="_blank"
                  rel="noreferrer"
                  className="cursor-pointer hover:opacity-80 transition-opacity z-20"
                  style={{ display: "block" }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <img
                    src="http://localhost:5000/uploads/platforms/gaana.png"
                    alt="Gaana"
                    className="w-2 lg:w-3"
                  />
                </a>
              )}

              {spotify && (
                <a
                  href={spotify}
                  target="_blank"
                  rel="noreferrer"
                  className="cursor-pointer hover:opacity-80 transition-opacity z-20"
                  style={{ display: "block" }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <img
                    src="http://localhost:5000/uploads/platforms/spotify.png"
                    alt="Spotify"
                    className="w-2 lg:w-3"
                  />
                </a>
              )}

              {apple && (
                <a
                  href={apple}
                  target="_blank"
                  rel="noreferrer"
                  className="cursor-pointer hover:opacity-80 transition-opacity z-20"
                  style={{ display: "block" }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <FaApple className="text-white text-[20px] lg:text-heading-5" />
                </a>
              )}

              {amazon && (
                <a
                  href={amazon}
                  target="_blank"
                  rel="noreferrer"
                  className="cursor-pointer hover:opacity-80 transition-opacity z-20"
                  style={{ display: "block" }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <img
                    src="http://localhost:5000/uploads/platforms/amazon-music.png"
                    alt="Amazon Music"
                    className="w-2 lg:w-3"
                  />
                </a>
              )}

              {song["YouTube-Music"] && (
                <a
                  href={song["YouTube-Music"]}
                  target="_blank"
                  rel="noreferrer"
                  className="cursor-pointer hover:opacity-80 transition-opacity z-20"
                  style={{ display: "block" }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <img
                    src="http://localhost:5000/uploads/platforms/youtube-music.png"
                    alt="Amazon Music"
                    className="w-2 lg:w-3"
                  />
                </a>
              )}
            </div>
          </div>

          {/* Accordion Toggle Button (visible only on mobile) */}
          <button className="lg:hidden z-20">
            <FaChevronDown
              className={`transition-transform text-white ${
                (isFirst || isAccordionOpen) && openSongId === song._id
                  ? "rotate-180"
                  : "rotate-0"
              }`}
            />
          </button>

          {/* Action buttons for larger screens */}
          <div className="hidden lg:flex items-center gap-2 text-white">
            <button
              className="flex gap-1 cursor-pointer hover:opacity-80 transition-opacity z-20 disabled:opacity-60 disabled:cursor-not-allowed"
              onClick={handleLike}
              disabled={!userData["user-id"]}
            >
              <AiFillLike
                className={`text-heading-6 ${
                  song.likes?.includes(userId)
                    ? "text-interactive-light"
                    : "text-white"
                }`}
              />

              {song.likes?.length || 0}
            </button>
            <button
              className="cursor-pointer hover:opacity-80 transition-opacity z-20 flex gap-1 disabled:opacity-60 disabled:cursor-not-allowed"
              onClick={handleDislike}
              disabled={!userData["user-id"]}
            >
              <AiFillDislike
                className={`text-heading-6 ${
                  song.dislikes?.includes(userId)
                    ? "text-interactive-light-destructive"
                    : "text-white"
                }`}
              />
              {song.dislikes?.length || 0}
            </button>

            {location.pathname === "/profile" && (
              <button
                className="cursor-pointer hover:opacity-80 transition-opacity z-20"
                onClick={(e) => {
                  e.stopPropagation();
                  setEditId(_id);
                }}
              >
                <RiEditBoxFill className="text-heading-6 text-white" />
              </button>
            )}
            <button
              disabled={!hasLinkWithoutUrlOrArtWork(song)}
              className="cursor-pointer hover:opacity-80 transition-opacity z-20 disabled:opacity-25 disabled:cursor-not-allowed"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/share/${userData._id}/${_id}`);
              }}
            >
              <FaShareNodes className="text-heading-6 text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Accordion for mobile view */}
      {/* {(isFirst || isAccordionOpen) && openSongId === song._id && ( */}
      <div
        className={`lg:hidden flex justify-end gap-2 ${
          (isFirst || isAccordionOpen) && openSongId === song._id ? "mt-2" : ""
        } overflow-hidden transition-[height_margin-top]`}
        style={{
          height:
            (isFirst || isAccordionOpen) && openSongId === song._id
              ? "21.31px"
              : "0",
        }}
      >
        <button
          className="cursor-pointer hover:opacity-80 transition-opacity z-20"
          onClick={handleLike}
        >
          <AiFillLike className="text-heading-6 text-white" />
        </button>
        <button
          className="cursor-pointer hover:opacity-80 transition-opacity z-20"
          onClick={handleDislike}
        >
          <AiFillDislike className="text-heading-6 text-white" />
        </button>
        <button
          className="cursor-pointer hover:opacity-80 transition-opacity z-20"
          onClick={(e) => {
            e.stopPropagation();
            setEditId(_id);
          }}
        >
          <RiEditBoxFill className="text-heading-6 text-white" />
        </button>
        <button
          disabled={!hasLinkWithoutUrlOrArtWork(song)}
          className="cursor-pointer hover:opacity-80 transition-opacity z-20 disabled:opacity-25 disabled:cursor-not-allowed"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/share/${userData._id}/${_id}`);
          }}
        >
          <FaShareNodes className="text-heading-6 text-white" />
        </button>
      </div>
      {/* )} */}

      {editId && <EditSong setEditId={setEditId} songData={song} />}
    </div>
  );
};

export default SongItem;
