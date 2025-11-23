import React, { useEffect, useState } from "react";
import Card from "./Card";
import Button from "./Button";

export default function QuizQuestion({ q, onAnswer, feedback }) {
  const [selected, setSelected] = useState(null);
  useEffect(() => { setSelected(null); }, [q?.id]);
  return (
    <Card>
      <div className="text-sm text-gray-500 mb-1 uppercase tracking-wide">{q.difficulty}</div>
      <div className="font-semibold text-lg mb-3">{q.question}</div>
      {q.type === "mcq" ? (
        <div className="grid gap-2">
          {q.options.map((opt, idx) => (
            <button key={idx} className={`w-full border rounded-xl p-3 text-left ${selected === idx ? "border-brand-600 bg-brand-50" : "border-gray-300 hover:bg-gray-50"}`} onClick={() => setSelected(idx)}>
              {String.fromCharCode(65 + idx)}. {opt}
            </button>
          ))}
        </div>
      ) : (
        <div className="flex gap-3">
          <Button variant={selected === true ? "primary" : "outline"} onClick={() => setSelected(true)}>True</Button>
          <Button variant={selected === false ? "primary" : "outline"} onClick={() => setSelected(false)}>False</Button>
        </div>
      )}
      <div className="mt-4 flex items-center gap-2">
        <Button onClick={() => selected !== null && onAnswer(selected)}>Submit Answer</Button>
        {feedback ? (
          <div className={`text-sm ${feedback.correct ? "text-green-700" : "text-red-700"}`}>
            {feedback.correct ? "Correct!" : "Incorrect."} {q.explanation}
          </div>
        ) : null}
      </div>
    </Card>
  );
}
