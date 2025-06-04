import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { IOwner } from "../../types/owner";
import { IUser } from "../../types/user";

interface OwnerDetailsModalProps {
  owner: IOwner | IUser | null;
  isOpen: boolean;
  onClose: () => void;
}

const OwnerDetailsModal = ({ owner, isOpen, onClose }: OwnerDetailsModalProps) => {
  if (!owner) return null;

  const detailItems = [
    { label: "Name", value: owner.name },
    { label: "Email", value: owner.email },
    { label: "Phone", value: owner.phone },
    { label: "Status", value: "status" in owner ? owner.status : "N/A" }, 
  ];

  if ('address' in owner) {
    detailItems.push({ 
      label: "Address", 
      value: `${owner.address?.street}, ${owner.address?.city}, ${owner.address?.district}, ${owner.address?.pincode}`
    });
  }

  if ('govtIdStatus' in owner) {
    detailItems.push({ label: "ID Verification", value : owner.govtIdStatus?owner.govtIdStatus:"" });
  }

  if ('createdAt' in owner) {
    detailItems.push({ 
      label: "Joined", 
      value: new Date(owner.createdAt).toLocaleDateString() 
    });
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none p-4"
          >
            <div className="w-full max-w-xl max-h-[100vh] overflow-y-auto bg-white dark:bg-gray-800 rounded-xl shadow-2xl pointer-events-auto">
              {/* Header with gradient */}
              <div 
                className="relative py-6 px-8 text-white"
                style={{ 
                  background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
                  boxShadow: "0 4px 15px -3px rgba(99, 102, 241, 0.3)"
                }}
              >
                <button
                  onClick={onClose}
                  className="absolute right-4 top-4 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                >
                  <X size={18} />
                </button>
                <h2 className="text-xl font-bold">Details</h2>
                <p className="text-white/70 text-sm mt-1">Complete information</p>
              </div>

              <div className="p-6 space-y-6">
                {/* Profile section */}
                <div className="flex flex-col md:flex-row gap-6 items-center pb-6 border-b border-gray-200 dark:border-gray-700">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-r from-violet-400 to-fuchsia-400 flex items-center justify-center text-white text-3xl font-bold">
                      {owner.name.charAt(0).toUpperCase()}
                    </div>
                    <span className={`absolute bottom-1 right-1 w-5 h-5 border-2 border-white rounded-full ${
                      'status' in owner && owner.status === "Active" ? "bg-green-500" :
                      'status' in owner && owner.status === "Blocked" ? "bg-red-500" : "bg-yellow-500"
                    }`} />
                  </div>
                  <div className="text-center md:text-left">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white">{owner.name}</h3>
                    <p className="text-gray-500 dark:text-gray-400">{owner.email}</p>
                    <span className={`inline-flex items-center mt-2 px-3 py-1 rounded-full text-xs font-semibold ${
                      'status' in owner && owner.status === "Active" 
                        ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" 
                        : 'status' in owner && owner.status === "Pending"
                        ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                        : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                    }`}>
                      {owner.status}
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {detailItems.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50"
                    >
                      <span className="text-sm text-gray-500 dark:text-gray-400 block mb-1">{item.label}</span>
                      <span className="font-medium text-gray-800 dark:text-white">{item.value}</span>
                    </motion.div>
                  ))}
                </div>

                {'govtId' in owner && owner.govtId && (
                  <div className="mt-6">
                    <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-3">ID Document</h4>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="relative rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700"
                    >
                      <img
                        src={owner.govtId}
                        alt="ID Document"
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          owner.govtIdStatus === "approved" 
                            ? "bg-green-100 text-green-800" 
                            : owner.govtIdStatus === "rejected"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}>
                          {owner.govtIdStatus === "approved" ? "Verified ID" : 
                           owner.govtIdStatus === "rejected" ? "Rejected ID" : "Pending Verification"}
                        </span>
                      </div>
                    </motion.div>
                  </div>
                )}
              </div>

              <div className="bg-gray-50 dark:bg-gray-800/80 px-6 py-4 flex justify-end">
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white rounded-lg transition-colors text-sm font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default OwnerDetailsModal;
