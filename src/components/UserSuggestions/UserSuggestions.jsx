import React from "react";
import SuggestedUser from "../SuggestedUser/SuggestedUser";
import ReactOwlCarousel from "react-owl-carousel";

const UserSuggestions = () => {
  return (
    <>
      <h5 className=" text-heading-5-bold">People You May Know</h5>
      <ReactOwlCarousel items={1} className="mt-2" autoplay>
        <SuggestedUser />
        <SuggestedUser />
        <SuggestedUser />
        <SuggestedUser />
        <SuggestedUser />
      </ReactOwlCarousel>
    </>
  );
};

export default UserSuggestions;
