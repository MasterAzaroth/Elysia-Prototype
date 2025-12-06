export default function SummaryCard({ title, muscles = [], date, totalSets }) {
  const muscleListRaw = Array.isArray(muscles)
    ? muscles
    : muscles
    ? [muscles]
    : [];

  const muscleList = muscleListRaw.slice(0, 3);

  return (
    <div
      className="
        group
        w-full h-auto p-4 rounded-3xl flex gap-2 bg-brand-grey2 justify-between
        border-solid border-brand-purple1 border-1
        active:bg-brand-purple1
      "
    >
      <div className="flex flex-col gap-2">
        <p className="text-lg group-active:text-white">{title}</p>

        <div className="flex items-center flex-wrap gap-2 text-sm text-brand-grey4 group-active:text-white/80">
          {muscleList.length === 0 && <p>No muscles logged</p>}

          {muscleList.map((m, index) => (
            <div key={`${m}-${index}`} className="flex items-center gap-2">
              <p>{m}</p>

              {index < muscleList.length - 1 && (
                <div className="w-2 h-2 rounded-full bg-brand-purple1 group-active:bg-white" />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col justify-between text-right">
        <p className="text-sm group-active:text-white/80">{date}</p>
        <p className="text-sm group-active:text-white">{totalSets}</p>
      </div>
    </div>
  );
}
