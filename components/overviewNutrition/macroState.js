export default function MacroState({ Icon, macro, tracked, total }) {
  return (
    <div className="w-1/4 h-auto flex flex-col mt-4">

      <div className="w-full h-8 flex items-center text-xs justify-start">

        {Icon && <Icon className="mr-2 w-4" />}

        {macro && <p className="mr-2 font-semibold">{macro}</p>}

        <p>{tracked}</p>
        <p className="mx-1">/</p>
        <p>{total}</p>
      </div>

      <div className="w-full h-[2px] bg-brand-purple3" />
    </div>
  );
}
