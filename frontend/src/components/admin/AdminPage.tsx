import { ArrowLeft, ArrowRight } from "lucide-react";
interface IProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}


const Pagination = ({ currentPage, totalPages, onPageChange }:IProps) => {
  return (
    <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 px-4 py-6 sm:px-6 bg-gradient-to-r from-white via-gray-50 to-white dark:from-gray-900 dark:to-gray-800 shadow-inner rounded-b-xl">
      <button
        onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
        disabled={currentPage === 1}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-md font-medium text-sm 
        bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200
        hover:bg-gray-100 dark:hover:bg-gray-700 transition 
        disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ArrowLeft size={16} />
        Previous
      </button>

      {/* Page Info */}
      <span className="text-gray-700 dark:text-gray-300 text-sm sm:text-base font-medium">
        Page <span className="font-bold">{currentPage}</span> of <span className="font-bold">{totalPages || 1}</span>
      </span>

      {/* Next Button */}
      <button
        onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
        disabled={currentPage === totalPages || totalPages === 0}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-md font-medium text-sm 
        bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200
        hover:bg-gray-100 dark:hover:bg-gray-700 transition 
        disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next
        <ArrowRight size={16} />
      </button>
    </div>
  );
};

export default Pagination;
