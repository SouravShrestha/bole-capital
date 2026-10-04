"use client";

import { SearchIcon } from "@/icons/SearchIcon";
import { useRef, useState } from "react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const SearchBar = ({
  value,
  onChange,
  placeholder = "Search...",
  className = "",
}: SearchBarProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  const handleIconClick = () => {
    inputRef.current?.focus();
  };

  return (
    <label className={`relative block ${className}`}>
      <span className="sr-only">{placeholder}</span>
      <button
        type="button"
        onClick={handleIconClick}
        className="absolute left-4 top-1/2 -translate-y-1/2 cursor-pointer"
        aria-label="Focus search input"
      >
        <SearchIcon
          className="w-4 h-4 transition-opacity"
          color="var(--fg)"
          style={{ opacity: isFocused ? 1 : 0.5 }}
        />
      </button>
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        className="w-full h-12 md:h-14 rounded-xl pl-12 pr-5 text-base md:text-base outline-none border transition-colors font-inter"
        style={{
          backgroundColor: "var(--input)",
          color: "var(--fg)",
          borderColor: isFocused ? "rgba(var(--fg-rgb), 0.6)" : "var(--card-border)",
        }}
      />
    </label>
  );
};
