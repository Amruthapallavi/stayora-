import * as React from "react";
import { cn } from "../../utils/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, ...props }, ref) => (
  <button
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-white shadow-md hover:bg-blue-700 transition",
      className
    )}
    {...props}
  />
));
Button.displayName = "Button";

export { Button };
