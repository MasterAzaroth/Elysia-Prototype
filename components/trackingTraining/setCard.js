import { Play, Trash2 } from "lucide-react";

export default function setCard() {

    return (

        <div className="w-full h-auto p-2 flex bg-brand-grey3 rounded-full items-center justify-between">
            <div className="w-8 h-8 rounded-full p-1 bg-brand-purple1 flex justify-center items-center">
                <p>1</p>
            </div>
            <div className="bg-brand-grey4 p-1 flex items-center gap-2 rounded-full">
                <p>Warm-Up Set</p>
                <Play className="transform rotate-90 fill-current" size={16} />
            </div>

            
            <div className="flex">
                <p>test</p>
                <div className="w-2 h-full bg-brand-grey1" />
                <p>test</p>
            </div>
            <div className="w-8 h-8 rounded-full p-1 bg-brand-purple1 flex justify-center items-center">
                <Trash2 />
            </div>
        </div>

    )

}