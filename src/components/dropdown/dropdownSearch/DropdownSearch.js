import React from "react";
import { DropdownProvider } from "../../../context/dropdown-context";

const DropdownSearch = ({ children, ...props }) => {
  return (
    <DropdownProvider {...props}>
      <div className="relative inline-block w-full transition-all cursor-pointer">
        {children}
      </div>
    </DropdownProvider>
  );
};

export default DropdownSearch;
