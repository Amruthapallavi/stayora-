import { useState } from "react";
import { BadgePercent, Star, CreditCard } from "lucide-react";
import { Button } from "../../components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

type SubscriptionBarProps = {
  compact?: boolean;
};

const SubscriptionBar = ({ compact = false }: SubscriptionBarProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (compact) {
    return (
      <div className="w-full mt-auto mb-4 p-2 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg shadow-lg">
        <Link to="/subscribe" className="flex items-center justify-center gap-2 text-white">
          <BadgePercent className="h-4 w-4" />
          <span className="text-sm font-medium">Upgrade to Pro</span>
        </Link>
      </div>
    );
  }

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full mt-auto mb-4 overflow-hidden rounded-xl shadow-xl"
      >
        <div 
          className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 p-4 cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-white/20 p-2 rounded-full">
                <Star className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-white font-semibold">Unlock Premium Features</h3>
            </div>
            <Button 
              variant="secondary" 
              size="sm" 
              className="bg-white text-indigo-700 hover:bg-white/90"
              onClick={(e) => {
                e.stopPropagation();
                window.location.href = "/subscribe";
              }}
            >
              Subscribe Now
            </Button>
          </div>
        </div>

        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-white p-4 border-t border-indigo-100"
          >
            <h4 className="font-medium mb-2">Premium Benefits:</h4>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <BadgePercent className="h-4 w-4 text-indigo-600" />
                <span className="text-sm">Lower commission fees</span>
              </li>
              <li className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-indigo-600" />
                <span className="text-sm">Priority payments</span>
              </li>
              <li className="flex items-center gap-2">
                <Star className="h-4 w-4 text-indigo-600" />
                <span className="text-sm">Featured listings</span>
              </li>
            </ul>
            <div className="mt-4">
              <Link to="/subscribe">
                <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                  View Plans
                </Button>
              </Link>
            </div>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default SubscriptionBar;
