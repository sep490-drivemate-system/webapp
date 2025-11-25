import { type ChangeEvent } from "react";
import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";

interface TransactionSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export function TransactionSearch({ value, onChange }: TransactionSearchProps) {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
      <Input
        value={value}
        onChange={handleChange}
        placeholder="Tìm kiếm theo tên giao dịch, mã tham chiếu..."
        className="pl-10"
      />
    </div>
  );
}
