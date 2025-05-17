export default function OrderNotes({ notes, onChange }) {
  return (
    <div className="p-6 border-b border-slate-950/30">
      <h2 className="text-stone-950 text-2xl font-semibold font-poppins mb-4">
        Catatan:
      </h2>
      <textarea
        value={notes}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-28 rounded-[10px] border border-slate-950 p-4 font-poppins text-sm"
        placeholder="Buat catatan untuk pesanan Anda"
      ></textarea>
    </div>
  );
}
