import React from "react";

export default function SearchInput({ value, onChange, placeholder = "Search..." }) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-gray-700">Search</label>
      <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} type="text" className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-brand-500 focus:border-brand-500" />
    </div>
  );
}
