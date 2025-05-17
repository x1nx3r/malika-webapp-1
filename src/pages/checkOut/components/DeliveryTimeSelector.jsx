import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function DeliveryTimeSelector({
  selectedDate,
  setSelectedDate,
  selectedTime,
  setSelectedTime,
}) {
  // Time change handlers
  const handleHoursChange = (e) => {
    let value = e.target.value;
    value = Math.min(23, Math.max(0, parseInt(value) || 0))
      .toString()
      .padStart(2, "0");
    setSelectedTime((prev) => ({ ...prev, hours: value }));
  };

  const handleMinutesChange = (e) => {
    let value = e.target.value;
    value = Math.min(59, Math.max(0, parseInt(value) || 0))
      .toString()
      .padStart(2, "0");
    setSelectedTime((prev) => ({ ...prev, minutes: value }));
  };

  return (
    <div className="p-3 border-b border-slate-300">
      <h2 className="text-stone-950 text-lg font-semibold font-poppins mb-2">
        Pilih Waktu Tiba
      </h2>
      <div className="mb-2 flex items-center gap-2">
        <div
          className="h-8 rounded border border-slate-500 flex items-center justify-between px-2 cursor-pointer flex-grow"
          onClick={() => document.getElementById("datePicker").click()}
        >
          <span className="text-stone-500 text-sm font-poppins">
            {selectedDate
              ? selectedDate.toLocaleDateString("id-ID")
              : "Pilih tanggal"}
          </span>
          <div className="w-3 h-3 bg-stone-800"></div>
          <DatePicker
            id="datePicker"
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            minDate={new Date()}
            className="hidden"
          />
        </div>
        <div className="h-8 rounded border border-slate-500 flex items-center justify-center px-2">
          <input
            type="text"
            value={selectedTime.hours}
            onChange={handleHoursChange}
            className="w-8 text-center bg-transparent text-stone-950 text-base font-poppins"
            maxLength="2"
          />
          <span className="text-black mx-1 font-poppins">:</span>
          <input
            type="text"
            value={selectedTime.minutes}
            onChange={handleMinutesChange}
            className="w-8 text-center bg-transparent text-stone-950 text-base font-poppins"
            maxLength="2"
          />
        </div>
      </div>
    </div>
  );
}
