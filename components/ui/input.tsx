// components/ui/input.tsx
import type { InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  unit?: string;
  helperText?: string;
};

export function Input({ unit, helperText, className = "", ...props }: InputProps) {
  return (
    <div className="w-full flex flex-col gap-1.5">
      <div className="relative flex items-center">
        <input
          className={`w-full px-4 py-3.5 bg-white border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors ${
            unit ? "pr-12" : ""
          } ${className}`}
          {...props}
        />
        {unit && (
          <span className="absolute right-4 text-gray-400 text-sm font-medium pointer-events-none">
            {unit}
          </span>
        )}
      </div>
      {helperText && (
        <span className="text-xs text-gray-400 ml-1">{helperText}</span>
      )}
    </div>
  );
}