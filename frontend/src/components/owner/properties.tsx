import { motion } from "framer-motion";
import { FaEdit, FaTrash } from "react-icons/fa";

// UI Components
interface CardProps {
  children: React.ReactNode;
  className?: string;
}

function Card({ children, className = "" }: CardProps) {
  return <div className={`rounded-lg shadow-md bg-white ${className}`}>{children}</div>;
}

function CardContent({ children, className = "" }: CardProps) {
  return <div className={`p-4 ${className}`}>{children}</div>;
}

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
}

function Badge({ children, className = "" }: BadgeProps) {
  return (
    <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${className}`}>
      {children}
    </span>
  );
}

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit" | "reset";
}

function Button({ children, onClick, className = "", type = "button" }: ButtonProps) {
  return (
    <button
      type={type}
      className={`px-4 py-2 rounded-md transition-all hover:opacity-80 ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}