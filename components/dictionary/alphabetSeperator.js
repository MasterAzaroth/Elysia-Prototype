export default function Alphabet({letter}) {

    return(

        <div className="flex gap-2 items-center mb-4">

            <div className="w-6 h-6 bg-brand-purple1 rounded-full flex items-center justify-center">
                <p className="text-xs">{letter}</p>
            </div>

            <div className="w-full h-[1px] bg-brand-purple1" />
        
        </div>

    )

}