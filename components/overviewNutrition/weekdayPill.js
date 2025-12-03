export default function WeekdayPill({ weekday, date, isActive, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        w-10 h-16 flex flex-col items-center justify-center
        rounded-full p-2 text-sm
        cursor-pointer transition-colors
        ${isActive ? "bg-brand-purple2" : "bg-brand-purple1"}
      `}
    >
      <p className="mb-auto">{weekday}</p>
      <p>{date}</p>
    </button>
  );
}
