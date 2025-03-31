import * as React from "react";

export const Card = ({ className, children }: { className?: string; children: React.ReactNode }) => {
  return <div className={`bg-white shadow-md rounded-lg overflow-hidden ${className}`}>{children}</div>;
};

export const CardHeader = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return <div className={`p-6 border-b ${className}`}>{children}</div>;
};

export const CardTitle = ({ children }: { children: React.ReactNode }) => {
  return <h2 className="text-xl font-bold">{children}</h2>;
};

export const CardContent = ({ children }: { children: React.ReactNode }) => {
  return <div className="p-6">{children}</div>;
};

export const CardFooter = ({ children }: { children: React.ReactNode }) => {
  return <div className="p-6 border-t">{children}</div>;
};
