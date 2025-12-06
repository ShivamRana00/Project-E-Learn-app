import React from "react";
import Card from "./Card";

export default function Toast({ toasts, remove }) {
  return (
    <div className="fixed top-4 right-4 space-y-2 z-50">
  {toasts.map((t) => (
    <div
      key={t.id}
     className={`card px-2 py-6 w-56 rounded-md border-l-4 ${

        t.type === "error"
          ? "bg-red-100 border-red-600 text-red-800"
          : "bg-green-100 border-green-600 text-green-800"
      }`}
    >
      <div className="font-semibold">{t.title}</div>
      {t.message ? <div className="text-sm opacity-90 mt-1">{t.message}</div> : null}
      <button className="text-xs mt-3 underline" onClick={() => remove(t.id)}>Dismiss</button>
    </div>
  ))}
</div>
  );
}
