import React from "react";
import AccountBalance from "../../components/AccountBalance/AccountBalance";
import AccountHistory from "../../components/AccountHistory/AccountHistory";

const Accounts = () => {
  return (
    <div className="mt-6">
      {/* <div className="w-1/5 text-white"> */}
      <AccountBalance />
      {/* </div> */}
      <AccountHistory />
    </div>
  );
};

export default Accounts;
