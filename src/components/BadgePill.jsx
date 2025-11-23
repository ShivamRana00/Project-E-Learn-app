import React from "react";

export default function BadgePill({ color = "blue", children }) {
  const cc = color === "green" ? "badge-green" : color === "amber" ? "badge-amber" : color === "purple" ? "badge-purple" : "badge-blue";
  return <span className={`badge ${cc} mr-2 mb-2`}>{children}</span>;
}
