import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { ChangeEvent } from "react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchBar({
  value,
  onChange,
  placeholder = "Tìm kiếm...",
  className = "",
}: SearchBarProps) {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };

  return (
    <div className={`mb-10 ${className}`}>
      <div className="relative mx-auto max-w-2xl">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
        <Input
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          className="pl-10 h-11 bg-white/80 backdrop-blur-sm"
        />
      </div>
    </div>
  );
}
