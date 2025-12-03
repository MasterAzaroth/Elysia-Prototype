import { Play } from "lucide-react";

export default function daySwitch() {

    return (

        <div className="flex justify-center">
            
            <Play className="transform rotate-180 fill-current"/>
            <p className="mx-4">Today</p>
            <Play className="fill-current"/>
        
        </div>

    )

}