import React from "react";

export default function Button({ children, className = "", variant = "primary", ...props }) {
  const v = variant === "outline" ? "btn-outline" : "btn-primary";
  return (
    <button className={`btn ${v} ${className}`} {...props}>{children}</button>
  );
}
