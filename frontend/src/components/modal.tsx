import { motion } from "framer-motion";
import { X } from "lucide-react";

interface ModalProps {
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ onClose, children }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 relative"
      >
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
          onClick={onClose}
        >
          <X size={24} />
        </button>
        {children}
      </motion.div>
    </div>
  );
};

export default Modal;
