import React from "react";

export default function Modal({ open, onClose, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-[#18181b] rounded-lg shadow-lg p-6 min-w-[320px] max-w-full relative">
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-white"
          onClick={onClose}
        >
          <span className="text-2xl">&times;</span>
        </button>
        {children}
      </div>
    </div>
  );
}
