import React from "react";

export default function SimpleWeekChart({ data }) {
  const max = Math.max(1, ...data.map(d => d.count));
  return (
    <div className="flex items-end gap-2 h-24">
      {data.map((d) => (
        <div key={d.date} className="flex-1 flex flex-col items-center">
          <div className="w-full bg-brand-500 rounded-t" style={{ height: `${(d.count / max) * 96}px` }} />
          <div className="text-[10px] text-gray-500 mt-1">{d.date.slice(5)}</div>
        </div>
      ))}
    </div>
  );
}
