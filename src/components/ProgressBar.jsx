import React from "react";

export default function ProgressBar({ value }) {
  return (
    <div className="w-full bg-gray-200 rounded-full h-3">
      <div className="bg-brand-600 h-3 rounded-full transition-all" style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
    </div>
  );
}
