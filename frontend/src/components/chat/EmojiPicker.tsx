// import { useRef, useState, useEffect } from "react";
// import EmojiPicker from "emoji-picker-react";
// import { Smile } from "lucide-react"; // or any icon lib

// export default function EmojiButton({ onEmojiSelect }: { onEmojiSelect: (emoji: string) => void }) {
//   const emojiButtonRef = useRef<HTMLButtonElement>(null);
//   const [showEmojiPicker, setShowEmojiPicker] = useState(false);
//   const [emojiPickerPosition, setEmojiPickerPosition] = useState({ top: 0, left: 0 });

//   const handleEmojiButtonClick = () => {
//     if (emojiButtonRef.current) {
//       const rect = emojiButtonRef.current.getBoundingClientRect();
//       setEmojiPickerPosition({ top: rect.bottom + window.scrollY + 5, left: rect.left + window.scrollX });
//       setShowEmojiPicker((prev) => !prev);
//     }
//   };

//   const handleEmojiClick = (emojiData: any) => {
//     onEmojiSelect(emojiData.emoji);
//     setShowEmojiPicker(false); // close after selection like WhatsApp
//   };

//   // Close emoji picker if clicked outside
//   useEffect(() => {
//     const handleClickOutside = (e: MouseEvent) => {
//       if (!emojiButtonRef.current?.contains(e.target as Node)) {
//         setShowEmojiPicker(false);
//       }
//     };
//     if (showEmojiPicker) {
//       window.addEventListener("click", handleClickOutside);
//     }
//     return () => window.removeEventListener("click", handleClickOutside);
//   }, [showEmojiPicker]);

//   return (
//     <>
//       {/* Emoji Button */}
//       <button
//         ref={emojiButtonRef}
//         type="button"
//         onClick={handleEmojiButtonClick}
//         className="flex items-center justify-center w-10 h-10 rounded-full border border-[#b68451]/30 text-[#b68451] hover:bg-[#b68451]/10 transition duration-200"
//         aria-label="Add emoji"
//       >
//         <Smile className="w-5 h-5" />
//       </button>

//       {/* Emoji Picker */}
//       {showEmojiPicker && (
//         <div
//           className="fixed z-50 shadow-2xl rounded-lg overflow-hidden border border-gray-200 bg-white"
//           style={{
//             top: `${emojiPickerPosition.top}px`,
//             left: `${emojiPickerPosition.left}px`,
//           }}
//         >
//           <EmojiPicker
//             onEmojiClick={handleEmojiClick}
//             width={300}
//             height={350}
//             searchDisabled={false}
//             skinTonesDisabled={false}
//             lazyLoadEmojis={true}
//             previewConfig={{ showPreview: false }}
//           />
//         </div>
//       )}
//     </>
//   );
// }
