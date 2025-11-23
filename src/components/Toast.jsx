import React from "react";
import Card from "./Card";

export default function Toast({ toasts, remove }) {
  return (
    <div className="fixed top-4 right-4 space-y-2 z-50">
      {toasts.map((t) => (
        <div key={t.id} className={`card border-l-4 ${t.type === "error" ? "border-red-500" : "border-green-500"}`}>
          <div className="font-semibold">{t.title}</div>
          {t.message ? <div className="text-sm text-gray-600">{t.message}</div> : null}
          <button className="text-xs mt-2 underline" onClick={() => remove(t.id)}>Dismiss</button>
        </div>
      ))}
    </div>
  );
}
