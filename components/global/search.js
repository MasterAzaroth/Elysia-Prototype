import { Search as SearchIcon } from "lucide-react";

export default function Search({ value, onChange, placeholder = "Search" }) {
  return (
    <div className="w-full h-full p-4 mb-6 bg-brand-grey3 rounded-full flex items-center">
      <SearchIcon className="text-brand-grey4 mr-2 w-5 h-5" />
      <input
        type="text"
        className="bg-transparent outline-none text-white placeholder-brand-grey4 w-full"
        placeholder={placeholder}
        value={value} 
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}