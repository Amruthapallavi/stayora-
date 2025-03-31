export const Badge = ({ className, children }: { className?: string; children: React.ReactNode }) => {
    return <span className={`inline-block px-3 py-1 text-xs font-semibold text-white bg-blue-500 rounded-full ${className}`}>{children}</span>;
  };
  