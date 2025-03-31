import * as React from "react";

export const Dialog = ({ children, open, onOpenChange }: { children: React.ReactNode; open: boolean; onOpenChange: (state: boolean) => void }) => {
  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 ${open ? "block" : "hidden"}`}>
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6">{children}</div>
    </div>
  );
};

export const DialogTrigger = ({ children, onClick }: { children: React.ReactNode; onClick: () => void }) => {
  return <button onClick={onClick}>{children}</button>;
};

export const DialogContent = ({ children }: { children: React.ReactNode }) => {
  return <div className="p-4">{children}</div>;
};

export const DialogHeader = ({ children }: { children: React.ReactNode }) => {
  return <div className="border-b pb-2">{children}</div>;
};

export const DialogTitle = ({ children }: { children: React.ReactNode }) => {
  return <h3 className="text-lg font-semibold">{children}</h3>;
};

export const DialogDescription = ({ children }: { children: React.ReactNode }) => {
  return <p className="text-sm text-gray-600">{children}</p>;
};

export const DialogFooter = ({ children }: { children: React.ReactNode }) => {
  return <div className="border-t pt-2 flex justify-end">{children}</div>;
};
