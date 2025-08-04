import React from "react";

interface Props {
  value: string;
  onChange: (value: string) => void;
  suggestions: string[];
}

const LocalLocationAutocomplete: React.FC<Props> = ({ value, onChange, suggestions }) => {

  return (
    <>
      <input
        type="text"
        placeholder="Search by city, neighborhood or address"
        className="pl-14 py-3 text-sm w-full bg-gray-100 border border-gray-200 rounded-xl focus:ring-0 focus:border-[#c9a46c]"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        list="location-suggestions"
        autoComplete="off"
        spellCheck={false}
      />

      <datalist id="location-suggestions">
        {suggestions.map((loc, index) => (
          <option key={index} value={loc} />
        ))}
      </datalist>
    </>
  );
};

export default LocalLocationAutocomplete;
