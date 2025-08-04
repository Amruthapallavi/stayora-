// import { useEffect, useRef, useState } from "react";

// interface GooglePlacesInputProps {
//   onPlaceSelect: (place: string) => void;
//   defaultValue?: string;
//   placeholder?: string;
// }

// const GooglePlacesInput = ({
//   onPlaceSelect,
//   defaultValue = "",
//   placeholder = "Search location",
// }: GooglePlacesInputProps) => {
//   const inputRef = useRef<HTMLInputElement>(null);
//   const [inputValue, setInputValue] = useState(defaultValue);

//   useEffect(() => {
//     setInputValue(defaultValue);
//   }, [defaultValue]);

//   useEffect(() => {
//     if (!window.google || !inputRef.current) return;

//     const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
//       types: ["(cities)"],
//       componentRestrictions: { country: "in" },
//     });

//     autocomplete.addListener("place_changed", () => {
//       const place = autocomplete.getPlace();
//       if (place?.name) {
//         setInputValue(place.name);        // Update internal state
//         onPlaceSelect(place.name);        // Notify parent
//       }
//     });

//     return () => {
//       window.google.maps.event.clearInstanceListeners(autocomplete);
//     };
//   }, [onPlaceSelect]);

//   return (
//     <input
//       type="text"
//       ref={inputRef}
//       placeholder={placeholder}
//       value={inputValue}
//       onChange={(e) => setInputValue(e.target.value)}
//       className="pl-14 py-3 text-sm bg-gray-100 border border-gray-200 rounded-xl focus:ring-0 focus:border-[#c9a46c] w-full"
//       spellCheck={false}
//       autoComplete="off"
//     />
//   );
// };

// export default GooglePlacesInput;
