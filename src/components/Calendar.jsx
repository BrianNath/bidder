import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function Calendar({ date, setDate, styleClass }) {
  return (
    <DatePicker
      className={styleClass}
      selected={date}
      onChange={(date) => setDate(date)}
      timeInputLabel="Time:"
      dateFormat="MM/dd/yyyy h:mm aa"
      showTimeInput
      showIcon
    />
  );
}
