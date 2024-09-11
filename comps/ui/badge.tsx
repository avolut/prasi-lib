import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "lib/utils"

const badgeVariants = cva(
  "c-inline-flex c-items-center c-rounded-full c-border c-px-2.5 c-py-0.5 c-font-semibold c-transition-colors focus:c-outline-none focus:c-ring-2 focus:c-ring-ring focus:c-ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "c-border-transparent c-bg-primary c-text-primary-foreground hover:c-bg-primary/80",
        secondary:
          "c-border-transparent c-bg-secondary c-text-secondary-foreground hover:c-bg-secondary/80",
        destructive:
          "c-border-transparent c-bg-destructive c-text-destructive-foreground hover:c-bg-destructive/80",
        outline: "c-text-foreground",
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
