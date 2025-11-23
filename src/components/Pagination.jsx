import React from "react";
import Button from "./Button";

export default function Pagination({ page, total, pageSize, onPage }) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const prev = () => onPage(Math.max(1, page - 1));
  const next = () => onPage(Math.min(totalPages, page + 1));
  return (
    <div className="flex items-center justify-between mt-3">
      <div className="text-sm text-gray-600">Page {page} of {totalPages}</div>
      <div className="flex gap-2">
        <Button variant="outline" onClick={prev} disabled={page <= 1}>Prev</Button>
        <Button variant="outline" onClick={next} disabled={page >= totalPages}>Next</Button>
      </div>
    </div>
  );
}
