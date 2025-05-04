// import React from "react";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
// import { CheckCircle, XCircle, MinusCircle, FileCheck, FileX, FileMinus, Check, X } from "lucide-react";
// import { cn } from "../lib/utils";
// import { motion } from "framer-motion";
// import {
//   Tooltip,
//   TooltipContent,
//   TooltipProvider,
//   TooltipTrigger,
// } from "../../components/ui/tooltip";
// import {
//   HoverCard,
//   HoverCardContent,
//   HoverCardTrigger,
// } from "../../components/ui/hover-card";

// interface StatusTableProps {
//   data: any[];
//   columns: string[];
//   type: "property" | "booking" | "owner";
// }

// export const StatusTable: React.FC<StatusTableProps> = ({ data, columns, type }) => {
//   // Count different statuses
//   const statusCounts = data.reduce((acc, item) => {
//     const status = item.status;
//     acc[status] = (acc[status] || 0) + 1;
//     return acc;
//   }, {});

//   // Function to render status with appropriate icon and color
//   const renderStatus = (status: string) => {
//     switch (status) {
//       case "active":
//         return (
//           <div className="flex items-center space-x-1">
//             <CheckCircle className="h-4 w-4 text-green-500" />
//             <span className="capitalize text-green-600 dark:text-green-400">Active</span>
//           </div>
//         );
//       case "rejected":
//         return (
//           <div className="flex items-center space-x-1">
//             <XCircle className="h-4 w-4 text-red-500" />
//             <span className="capitalize text-red-600 dark:text-red-400">Rejected</span>
//           </div>
//         );
//       case "pending":
//         return (
//           <div className="flex items-center space-x-1">
//             <MinusCircle className="h-4 w-4 text-amber-500" />
//             <span className="capitalize text-amber-600 dark:text-amber-400">Pending</span>
//           </div>
//         );
//       case "completed":
//         return (
//           <div className="flex items-center space-x-1">
//             <Check className="h-4 w-4 text-purple-500" />
//             <span className="capitalize text-purple-600 dark:text-purple-400">Completed</span>
//           </div>
//         );
//       case "unverified":
//         return (
//           <div className="flex items-center space-x-1">
//             <XCircle className="h-4 w-4 text-yellow-500" />
//             <span className="capitalize text-yellow-600 dark:text-yellow-400">Unverified</span>
//           </div>
//         );
//       default:
//         return <span className="capitalize">{status}</span>;
//     }
//   };

//   // Function to get the icon for the row based on type and status
//   const getRowIcon = (item: any) => {
//     if (type === "property") {
//       switch (item.status) {
//         case "active":
//           return <FileCheck className="h-4 w-4 text-green-500 mr-2" />;
//         case "rejected":
//           return <FileX className="h-4 w-4 text-red-500 mr-2" />;
//         case "pending":
//           return <FileMinus className="h-4 w-4 text-amber-500 mr-2" />;
//         default:
//           return null;
//       }
//     }
//     return null;
//   };

//   // Function to render cell content based on column name and type
//   const renderCell = (item: any, column: string) => {
//     const key = column.toLowerCase().replace(/ /g, "");
    
//     // Handle specific columns based on type
//     if (key === "status") {
//       return renderStatus(item.status);
//     }
    
//     // Handle common fields
//     switch (key) {
//       case "id":
//         return (
//           <div className="flex items-center">
//             {getRowIcon(item)}
//             <span className="font-mono text-xs">{item.id}</span>
//           </div>
//         );
//       case "lastupdated":
//         return item.updatedAt;
//       case "joined":
//         return item.joinedAt;
//       case "checkin":
//         return item.checkIn;
//       case "checkout":
//         return item.checkOut;
//       default:
//         return item[key] || item[column.toLowerCase()];
//     }
//   };

//   return (
//     <div className="rounded-md border">
//       <Table>
//         <TableHeader>
//           <TableRow>
//             {columns.map((column, i) => (
//               <TableHead key={i}>{column}</TableHead>
//             ))}
//           </TableRow>
//         </TableHeader>
//         <TableBody>
//           {data.map((item, i) => (
//             <motion.tr
//               key={item.id}
//               initial={{ opacity: 0, y: 10 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.2, delay: i * 0.05 }}
//               className={cn(
//                 "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
//                 item.status === "active" ? "bg-green-50/30 dark:bg-green-900/10" : "",
//                 item.status === "rejected" ? "bg-red-50/30 dark:bg-red-900/10" : "",
//                 item.status === "unverified" ? "bg-yellow-50/30 dark:bg-yellow-900/10" : "",
//                 item.status === "completed" ? "bg-purple-50/30 dark:bg-purple-900/10" : "",
//                 item.status === "pending" ? "bg-amber-50/30 dark:bg-amber-900/10" : ""
//               )}
//             >
//               {columns.map((column, j) => (
//                 <TableCell key={j}>{renderCell(item, column)}</TableCell>
//               ))}
//             </motion.tr>
//           ))}
//         </TableBody>
//       </Table>
//     </div>
//   );
// };
