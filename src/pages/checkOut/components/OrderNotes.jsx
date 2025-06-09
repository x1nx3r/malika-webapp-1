import { useState, useEffect } from "react";

export default function OrderNotes({ notes, onChange }) {
  const [charCount, setCharCount] = useState(0);
  const maxLength = 200; // Maximum character limit

  useEffect(() => {
    setCharCount(notes?.length || 0);
  }, [notes]);

  const handleChange = (e) => {
    const value = e.target.value;
    if (value.length <= maxLength) {
      onChange(value);
    }
  };

  return (
    <div className="p-4 rounded-lg bg-white shadow-sm border border-gray-200">
      <div className="flex items-center mb-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-amber-500 mr-2"
        >
          <path d="M14 3v4a1 1 0 0 0 1 1h4"></path>
          <path d="M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2z"></path>
          <line x1="9" y1="9" x2="10" y2="9"></line>
          <line x1="9" y1="13" x2="15" y2="13"></line>
          <line x1="9" y1="17" x2="15" y2="17"></line>
        </svg>
        <h2 className="text-gray-800 text-lg font-semibold font-poppins">
          Catatan Pesanan
        </h2>
      </div>

      <div className="relative">
        <textarea
          value={notes || ""}
          onChange={handleChange}
          className="w-full min-h-[5rem] rounded-lg border border-gray-300 p-3 font-poppins text-sm text-gray-700 resize-y transition-colors focus:border-amber-500 focus:ring-2 focus:ring-amber-500 focus:ring-opacity-50 focus:outline-none"
          placeholder="Tambahkan catatan khusus untuk pesanan Anda (opsional)"
          maxLength={maxLength}
          aria-label="Catatan pesanan"
        ></textarea>

        <div className="flex justify-between mt-1.5 text-xs text-gray-500">
          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-1"
            >
              <path d="M12 20h9"></path>
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
            </svg>
            Contoh: "Tolong tambahkan sendok plastik" atau "Jangan pedas"
          </div>
          <div className={charCount > maxLength * 0.8 ? "text-amber-500" : ""}>
            {charCount}/{maxLength}
          </div>
        </div>
      </div>
    </div>
  );
}
