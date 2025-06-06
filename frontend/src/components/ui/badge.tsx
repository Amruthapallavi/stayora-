import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../../lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-[#3498db] text-white hover:bg-[#2980b9]",
        outline: "text-foreground",
        secondary: "border-transparent bg-gray-500 text-white hover:bg-gray-600",

        confirmed: "border-transparent bg-green-500 text-white hover:bg-green-600",
        pending: "border-transparent bg-yellow-400 text-black hover:bg-yellow-500",
        cancelled: "border-transparent bg-red-500 text-white hover:bg-red-600",
        returned: "border-transparent bg-purple-500 text-white hover:bg-purple-600",
        shipped: "border-transparent bg-blue-500 text-white hover:bg-blue-600",
        delivered: "border-transparent bg-emerald-500 text-white hover:bg-emerald-600",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)


export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
