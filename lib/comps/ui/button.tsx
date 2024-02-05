import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/utils"

const buttonVariants = cva(
  "c-inline-flex c-items-center c-justify-center c-whitespace-nowrap c-rounded-md c-text-sm c-font-medium c-ring-offset-background c-transition-colors focus-visible:c-outline-none focus-visible:c-ring-2 focus-visible:c-ring-ring focus-visible:c-ring-offset-2 disabled:c-pointer-events-none disabled:c-opacity-50",
  {
    variants: {
      variant: {
        default: "c-bg-primary c-text-primary-foreground hover:c-bg-primary/90",
        destructive:
          "c-bg-destructive c-text-destructive-foreground hover:c-bg-destructive/90",
        outline:
          "c-border c-border-input c-bg-background hover:c-bg-accent hover:c-text-accent-foreground",
        secondary:
          "c-bg-secondary c-text-secondary-foreground hover:c-bg-secondary/80",
        ghost: "hover:c-bg-accent hover:c-text-accent-foreground",
        link: "c-text-primary c-underline-offset-4 hover:c-underline",
      },
      size: {
        default: "c-h-10 c-px-4 c-py-2",
        sm: "c-h-9 c-rounded-md c-px-3",
        lg: "c-h-11 c-rounded-md c-px-8",
        icon: "c-h-10 c-w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
