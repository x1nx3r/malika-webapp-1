const currentDate = new Date();
const options = {
  year: "numeric",
  month: "long",
  day: "numeric",
};
const currentDayString = currentDate.toLocaleDateString("en-US", {
  weekday: "long",
});
const dateString = currentDate.toLocaleDateString("en-US", options);

export default function Header() {
  return (
    <div className="top-0 w-auto h-fit flex flex-row items-center justify-center text-macchiato-text">
      <div className="border-r-4 text-5xl p-5 align-middle">Anjay Header</div>
      <div className="flex flex-col w-fit h-fit text-lg p-5 align-middle">
        <div>Today Is: </div>
        <div>{currentDayString}</div>
        <div>{dateString}</div>
      </div>
    </div>
  );
}
