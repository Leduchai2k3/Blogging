import React from "react";

const BgDashBoard = ({ classname, children }) => {
  return (
    <div
      className={`min-h-screen px-16 py-8 mx-10 mt-5 xs:mx-2 border xs:px-2 xs:py-2 border-b-transparent ${classname}`}
    >
      {children}
      <div className="mt-14"></div>
    </div>
  );
};

export default BgDashBoard;
