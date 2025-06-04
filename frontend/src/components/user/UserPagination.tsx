import { Button } from "../../components/ui/button";
import { cn } from "../lib/utils";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  className,
}: PaginationProps) => {
  const validCurrentPage = Math.max(1, Math.min(currentPage, totalPages));
  
  const getPageNumbers = () => {
    const pageNumbers: (number | string)[] = [];
    
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      pageNumbers.push(1);
      
      if (validCurrentPage > 3) {
        pageNumbers.push("...");
      }
      
      const middleStart = Math.max(2, validCurrentPage - 1);
      const middleEnd = Math.min(totalPages - 1, validCurrentPage + 1);
      
      for (let i = middleStart; i <= middleEnd; i++) {
        pageNumbers.push(i);
      }
      
      if (validCurrentPage < totalPages - 2) {
        pageNumbers.push("...");
      }
      
      pageNumbers.push(totalPages);
    }
    
    return pageNumbers;
  };

  const goToFirstPage = () => onPageChange(1);
  const goToLastPage = () => onPageChange(totalPages);
  const goToPreviousPage = () => onPageChange(Math.max(1, validCurrentPage - 1));
  const goToNextPage = () => onPageChange(Math.min(totalPages, validCurrentPage + 1));
  
  return (
    <div className={cn("flex items-center justify-center gap-1 py-4", className)}>
      <Button
        variant="outline"
        size="icon"
        onClick={goToFirstPage}
        disabled={validCurrentPage === 1}
        className="w-8 h-8 transition-all duration-200 hover:bg-[#b68451]/10 hover:border-[#b68451] text-[#b68451]"
        aria-label="Go to first page"
      >
        <ChevronsLeft className="h-4 w-4" />
      </Button>
      
      <Button
        variant="outline"
        size="icon"
        onClick={goToPreviousPage}
        disabled={validCurrentPage === 1}
        className="w-8 h-8 transition-all duration-200 hover:bg-[#b68451]/10 hover:border-[#b68451] text-[#b68451]"
        aria-label="Go to previous page"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      
      <div className="flex gap-1">
        {getPageNumbers().map((pageNumber, index) => 
          typeof pageNumber === "string" ? (
            <div key={`ellipsis-${index}`} className="flex items-center justify-center w-8 h-8">
              <span className="text-gray-500">...</span>
            </div>
          ) : (
            <Button
              key={`page-${pageNumber}`}
              variant={pageNumber === validCurrentPage ? "default" : "outline"}
              onClick={() => onPageChange(pageNumber as number)}
              className={cn(
                "w-8 h-8 transition-all duration-300 transform hover:scale-105", 
                pageNumber === validCurrentPage 
                  ? "bg-[#b68451] text-white hover:bg-[#c7955e]" 
                  : "text-[#b68451] hover:bg-[#b68451]/10 hover:border-[#b68451]"
              )}
              aria-label={`Go to page ${pageNumber}`}
              aria-current={pageNumber === validCurrentPage ? "page" : undefined}
            >
              {pageNumber}
            </Button>
          )
        )}
      </div>
      
      <Button
        variant="outline"
        size="icon"
        onClick={goToNextPage}
        disabled={validCurrentPage === totalPages}
        className="w-8 h-8 transition-all duration-200 hover:bg-[#b68451]/10 hover:border-[#b68451] text-[#b68451]"
        aria-label="Go to next page"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
      
      <Button
        variant="outline"
        size="icon"
        onClick={goToLastPage}
        disabled={validCurrentPage === totalPages}
        className="w-8 h-8 transition-all duration-200 hover:bg-[#b68451]/10 hover:border-[#b68451] text-[#b68451]"
        aria-label="Go to last page"
      >
        <ChevronsRight className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default Pagination;

//  <Pagination 
//             currentPage={currentPage}
//             totalPages={totalPages}
//             onPageChange={setCurrentPage}
//           />