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
    <div className="pt-6 pb-2 border-b border-gray-200 px-6">
      <div className="flex items-center mb-1">
        <h2 className="text-gray-800 text-xl font-poppins font-semibold">
          Catatan Pesanan:
        </h2>
      </div>

      <div className="relative">
        <textarea
          value={notes || ""}
          onChange={handleChange}
          className="w-full min-h-[6rem] rounded-lg px-3 py-2 font-poppins border border-gray-300 text-sm text-gray-800 resize-y focus:outline-none focus:border-gray-400 transition-all duration-150 ease-in"
          placeholder="Tambahkan catatan khusus untuk pesanan Anda (opsional)"
          maxLength={maxLength}
          aria-label="Catatan pesanan"
        ></textarea>

        <div className="flex justify-end mr-1 font-poppins text-[11px] text-gray-500">
          <div className={charCount > maxLength * 0.8 ? "text-amber-500" : ""}>
            {charCount}/{maxLength}
          </div>
        </div>
      </div>
    </div>
  );
}
