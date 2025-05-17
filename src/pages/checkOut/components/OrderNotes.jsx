export default function OrderNotes({ notes, onChange }) {
  return (
    <div className="p-3 border-b border-slate-300">
      <h2 className="text-stone-950 text-lg font-semibold font-poppins mb-2">
        Catatan:
      </h2>
      <textarea
        value={notes}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-16 rounded border border-slate-500 p-2 font-poppins text-sm"
        placeholder="Catatan untuk pesanan Anda"
      ></textarea>
    </div>
  );
}
