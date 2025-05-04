import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "../lib/utils";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../../components/ui/hover-card";
import { DialogTitle, DialogDescription } from "../../components/ui/dialog"; // make sure these are imported

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "../../components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "../../components/ui/dialog";
import { Link } from "react-router-dom";

interface StatsCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  link?:string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  index: number;
  gradientFrom: string;
  gradientTo: string;
  details?: Array<{
    label: string;
    value: string | number;
    color?: string;
  }>;
}

export function StatsCard({
    label,
    value,
    icon: Icon,
    trend,
    index,
    gradientFrom,
    gradientTo,
    link,
    details,
  }: StatsCardProps) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: index * 0.1 }}
        whileHover={{
          y: -5,
          transition: { duration: 0.2 }
        }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
      >
        <Dialog>
          <DialogTrigger asChild>
            <div className="p-5 cursor-pointer relative overflow-hidden group">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {label}
                </h3>
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-br",
                    `from-${gradientFrom} to-${gradientTo}`
                  )}
                >
                  <Icon size={20} className="text-white" />
                </div>
              </div>
              <div className="mt-2">
                <p className="text-2xl font-semibold">{value}</p>
                {trend && (
                  <div className="flex items-center mt-1">
                    <span
                      className={`text-xs font-medium ${
                        trend.isPositive ? "text-green-500" : "text-red-500"
                      }`}
                    >
                      {trend.isPositive ? "+" : "-"}
                      {trend.value}%
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                      from last month
                    </span>
                  </div>
                )}
              </div>
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-transparent to-transparent group-hover:from-blue-400 group-hover:to-purple-500 transition-all duration-300"></div>
            </div>
          </DialogTrigger>
  
          <DialogContent className="p-0 border-none bg-gradient-to-br from-blue-500/90 to-purple-600/90 text-white backdrop-blur-lg">
            <div className="p-4">
              <DialogTitle className="text-lg font-bold mb-3 text-white">
                {label} Breakdown
              </DialogTitle>
  
              <DialogDescription className="text-sm text-white/70 mb-4">
                Detailed breakdown of {label.toLowerCase()} statistics.
              </DialogDescription>
  
              <div className="space-y-3">
                {details?.map((detail, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-2 bg-white/10 rounded-md backdrop-blur-sm"
                  >
                    <div className="flex items-center space-x-2">
                      <div
                        className={`h-3 w-3 rounded-full bg-${detail.color || "gray"}-400`}
                      ></div>
                      <span className="text-sm font-medium">{detail.label}</span>
                    </div>
                    <span className="text-sm font-bold">{detail.value}</span>
                  </div>
                ))}
              </div>
  
              <div className="mt-3 pt-3 border-t border-white/20">
                <div className="flex items-center justify-between">
                <Link to={link || "/admin/dashboard"}>
  <motion.div
    className="text-xs font-medium bg-white/20 px-2 py-1 rounded-full cursor-pointer"
    whileHover={{ scale: 1.05 }}
  >
    View more
  </motion.div>
</Link>

                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </motion.div>
    );
  }
  