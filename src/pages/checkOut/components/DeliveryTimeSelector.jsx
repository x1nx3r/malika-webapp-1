import { useState, useEffect } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { id } from "date-fns/locale";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

// Create a custom theme to match your amber color scheme
const theme = createTheme({
  palette: {
    primary: {
      main: "#f59e0b", // amber-500
    },
    background: {
      paper: "#ffffff",
    },
  },
  typography: {
    fontFamily: "'Poppins', sans-serif",
  },
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#f59e0b",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#f59e0b",
            borderWidth: 2,
          },
        },
      },
    },
  },
});

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
    <ThemeProvider theme={theme}>
      <Paper
        elevation={0}
        sx={{ p: 2, border: "1px solid #e5e7eb", borderRadius: 2 }}
      >
        <Box sx={{ mb: 2, display: "flex", alignItems: "center" }}>
          <CalendarTodayIcon sx={{ color: "#f59e0b", mr: 1, fontSize: 20 }} />
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: 500, color: "#374151" }}
          >
            Waktu Pengiriman
          </Typography>
        </Box>

        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={id}>
          <DateTimePicker
            label="Tanggal dan Waktu"
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
          />
        </LocalizationProvider>

        <Box sx={{ mt: 1.5, display: "flex", alignItems: "center" }}>
          <Typography
            variant="caption"
            sx={{ color: "#6b7280", display: "flex", alignItems: "center" }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ marginRight: 4 }}
            >
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            Waktu pengiriman dalam format 24 jam
          </Typography>
        </Box>
      </Paper>
    </ThemeProvider>
  );
}
