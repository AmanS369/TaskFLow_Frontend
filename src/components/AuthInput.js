import React from "react";

export const AuthInput = React.forwardRef((props, ref) => {
  return (
    <input
      {...props}
      ref={ref}
      className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
    />
  );
});
AuthInput.displayName = "AuthInput";
