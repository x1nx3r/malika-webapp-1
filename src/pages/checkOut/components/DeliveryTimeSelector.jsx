import { useState, useEffect } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { id } from "date-fns/locale";
import TextField from "@mui/material/TextField";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

export default function DeliveryTimeSelector({
  selectedDate,
  setSelectedDate,
  selectedTime,
  setSelectedTime,
}) {
  // Create a single Date object from the separate date and time values
  const [dateTimeValue, setDateTimeValue] = useState(() => {
    if (!selectedDate) return null;

    const dateObj = new Date(selectedDate);
    dateObj.setHours(parseInt(selectedTime.hours || "0", 10));
    dateObj.setMinutes(parseInt(selectedTime.minutes || "0", 10));
    return dateObj;
  });

  // Update the parent component's state when the date/time changes
  const handleDateTimeChange = (newDateTime) => {
    setDateTimeValue(newDateTime);

    if (newDateTime) {
      setSelectedDate(newDateTime);

      const hours = newDateTime.getHours().toString().padStart(2, "0");
      const minutes = newDateTime.getMinutes().toString().padStart(2, "0");
      setSelectedTime({ hours, minutes });
    }
  };

  // Update local state if the parent state changes
  useEffect(() => {
    if (selectedDate) {
      const dateObj = new Date(selectedDate);
      dateObj.setHours(parseInt(selectedTime.hours || "0", 10));
      dateObj.setMinutes(parseInt(selectedTime.minutes || "0", 10));
      setDateTimeValue(dateObj);
    }
  }, [selectedDate, selectedTime]);

  return (
    <div className="border-b border-gray-200 px-6 py-4">
      <div className="flex items-center mb-2">
        <h2 className="text-gray-800 text-xl font-poppins font-semibold">
          Waktu Pengiriman:
        </h2>
      </div>

      <div className="relative">
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={id}>
          <DateTimePicker
            value={dateTimeValue}
            onChange={handleDateTimeChange}
            renderInput={(params) => (
              <TextField
                {...params}
                fullWidth
                InputProps={{
                  ...params.InputProps,
                  startAdornment: (
                    <>
                      <AccessTimeIcon color="action" sx={{ mr: 1 }} />
                      {params.InputProps.startAdornment}
                    </>
                  ),
                }}
              />
            )}
            minDateTime={new Date()}
            minutesStep={15}
            ampm={false}
            views={["year", "month", "day", "hours", "minutes"]}
            inputFormat="EEEE, d MMMM yyyy HH:mm"
            className="w-full"
          />
        </LocalizationProvider>

        <p className="font-poppins text-xs text-gray-600 mt-2 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-1" viewBox="0 0 24 24">
            <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
              <path stroke-dasharray="64" stroke-dashoffset="64" d="M12 3c4.97 0 9 4.03 9 9c0 4.97 -4.03 9 -9 9c-4.97 0 -9 -4.03 -9 -9c0 -4.97 4.03 -9 9 -9Z">
                <animate fill="freeze" attributeName="stroke-dashoffset" dur="0.6s" values="64;0" />
              </path>
              <path stroke-dasharray="8" stroke-dashoffset="8" d="M12 7v6">
                <animate fill="freeze" attributeName="stroke-dashoffset" begin="0.6s" dur="0.2s" values="8;0" />
                <animate attributeName="stroke-width" begin="1.8s" dur="3s" keyTimes="0;0.1;0.2;0.3;1" repeatCount="indefinite" values="2;3;3;2;2" />
              </path>
              <path stroke-dasharray="2" stroke-dashoffset="2" d="M12 17v0.01">
                <animate fill="freeze" attributeName="stroke-dashoffset" begin="0.8s" dur="0.2s" values="2;0" />
                <animate attributeName="stroke-width" begin="2.1s" dur="3s" keyTimes="0;0.1;0.2;0.3;1" repeatCount="indefinite" values="2;3;3;2;2" />
              </path>
            </g>
          </svg>
          Waktu pengiriman dalam format 24 jam
        </p>
      </div>
    </div>
  );
}
