import * as React from "react";

export const Avatar = ({ className, children }: { className?: string; children?: React.ReactNode }) => {
  return <div className={`relative flex items-center justify-center rounded-full ${className}`}>{children}</div>;
};

export const AvatarImage = ({ src, alt }: { src: string; alt: string }) => {
  return <img className="rounded-full object-cover w-full h-full" src={src} alt={alt} />;
};

export const AvatarFallback = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return <div className={`rounded-full bg-gray-300 flex items-center justify-center text-xl font-bold ${className}`}>{children}</div>;
};
