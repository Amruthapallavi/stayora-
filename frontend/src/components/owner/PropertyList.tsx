// UIComponents.tsx
// UIComponents.tsx

interface InputProps {
  label: string;
  type?: string;
  placeholder?: string;
  className?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const Input: React.FC<InputProps> = ({ label, ...props }) => {
  return (
    <div className="flex flex-col">
      <label className="text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        {...props}
        className={`border p-2 rounded w-full ${props.className}`}
      />
    </div>
  );
};


  
  interface ButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    className?: string;
    size?: "small" | "medium" | "large" | "icon"; // Added "icon"
  }
  
  export const Button: React.FC<ButtonProps> = ({ children, size = "medium", ...props }) => {
    const sizeClasses = {
      small: "py-1 px-3 text-sm",
      medium: "py-2 px-4 text-base",
      large: "py-3 px-6 text-lg",
      icon: "p-2 text-lg w-10 h-10 flex items-center justify-center", // Example for icon button
    };
  
    return (
      <button {...props} className={`bg-blue-500 text-white rounded ${sizeClasses[size]} ${props.className}`}>
        {children}
      </button>
    );
  };
  
  

  interface SelectProps {
    label?: string;
    options: string[];
    className?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  }
  
  export const Select: React.FC<SelectProps> = ({ label, options, className, value, onChange }) => {
    return (
      <div>
        {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
        <select className={`border p-2 rounded w-full ${className}`} value={value} onChange={onChange}>
          {options.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
    );
  };
  




export const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => {
  return <div className={`bg-white shadow-lg rounded-lg p-6 border-2 ${className}`}>{children}</div>;
};
