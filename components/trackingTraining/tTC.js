import SetCard from "@/components/trackingTraining/setCard.js";
import { Trash2 } from "lucide-react";

export default function tTC({title, muscle}) {
    
    return (

        <div className="w-full h-48 bg-brand-grey2 p-2 rounded-2xl flex flex-col">
            <div className="flex">
                <img src="\Muscles\Upper Body\Chest.png" alt="Biceps" className="w-20 h-20 mr-4" />
                <div className="w-full h-auto flex flex-col justify-center">
                    <h1 className="text-xl mb-2">{title}</h1>
                    <h2 className="text-brand-grey4 text-lg">{muscle}</h2>
                </div>
                <div className="w-10 h-10 bg-brand-purple1 rounded-full p-2 flex items-center justify-center">
                    <Trash2 />
                </div>
            </div>
            <SetCard />
        </div>

    )

}