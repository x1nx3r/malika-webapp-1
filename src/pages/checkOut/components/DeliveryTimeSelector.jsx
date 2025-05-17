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
    // Ensure valid hours (0-23)
    value = Math.min(23, Math.max(0, parseInt(value) || 0))
      .toString()
      .padStart(2, "0");
    setSelectedTime((prev) => ({ ...prev, hours: value }));
  };

  const handleMinutesChange = (e) => {
    let value = e.target.value;
    // Ensure valid minutes (0-59)
    value = Math.min(59, Math.max(0, parseInt(value) || 0))
      .toString()
      .padStart(2, "0");
    setSelectedTime((prev) => ({ ...prev, minutes: value }));
  };

  return (
    <div className="p-6 border-b border-slate-950/30">
      <h2 className="text-stone-950 text-2xl font-semibold font-poppins mb-4">
        Pilih Waktu Tiba
      </h2>
      <div className="mb-4">
        <div
          className="w-full h-10 rounded-[10px] border border-slate-950 flex items-center justify-between px-4 cursor-pointer"
          onClick={() => document.getElementById("datePicker").click()}
        >
          <span className="text-stone-500 text-sm font-poppins">
            {selectedDate
              ? selectedDate.toLocaleDateString("id-ID")
              : "Tekan untuk memilih tanggal"}
          </span>
          <div className="w-4 h-4 bg-stone-950"></div>
          <DatePicker
            id="datePicker"
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            minDate={new Date()}
            className="hidden"
          />
        </div>
      </div>
      <div className="w-36 h-12 rounded-[10px] border border-slate-950 flex items-center justify-center">
        <input
          type="text"
          value={selectedTime.hours}
          onChange={handleHoursChange}
          className="w-12 text-center bg-transparent text-stone-950 text-2xl font-poppins"
          maxLength="2"
        />
        <span className="text-black text-2xl mx-2 font-poppins">:</span>
        <input
          type="text"
          value={selectedTime.minutes}
          onChange={handleMinutesChange}
          className="w-12 text-center bg-transparent text-stone-950 text-2xl font-poppins"
          maxLength="2"
        />
      </div>
    </div>
  );
}
