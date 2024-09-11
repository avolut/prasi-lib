import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "lib/utils";

const buttonVariants = cva(
  "button c-inline-flex c-items-center c-justify-center c-whitespace-nowrap c-rounded-md c-text-sm c-font-medium c-ring-offset-background c-transition-colors focus-visible:c-outline-none focus-visible:c-ring-2 focus-visible:c-ring-ring focus-visible:c-ring-offset-2 disabled:c-pointer-events-none disabled:c-opacity-50",
  {
    variants: {
      variant: {
        default:
          "button-primary c-bg-primary c-text-primary-foreground hover:c-bg-primary/90",
        // default: "#FDB813",
        destructive:
          "button-destructive  c-bg-destructive c-text-destructive-foreground hover:c-bg-destructive/90",
        outline:
          "button-outline c-border c-border-input c-bg-background hover:c-bg-accent hover:c-text-accent-foreground",
        secondary:
          "button-secondary c-bg-secondary c-text-secondary-foreground hover:c-bg-secondary/80",
        ghost: "button-ghost hover:c-bg-accent hover:c-text-accent-foreground",
        link: "button-link c-text-primary c-underline-offset-4 hover:c-underline",
        "no-style": "",
      },
      size: {
        default: "c-h-10 c-px-4 c-py-2",
        xs: "c-h-7 c-rounded-sm c-px-2",
        sm: "c-h-9 c-rounded-md c-px-3",
        lg: "c-h-11 c-rounded-md c-px-8",
        icon: "c-h-10 c-w-10",
        nozise: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLDivElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<
  HTMLDivElement | HTMLButtonElement,
  ButtonProps
>(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button";

  return (
    <div
      className={cn(
        buttonVariants({ variant, size, className }),
        `btn-${variant || "default"} btn c-transition-all c-duration-300`,
        css`
          > div {
            border-radius: calc(var(--radius) - 2px);
          }
        `
      )}
      ref={ref as any}
      {...props}
    />
  );
});
Button.displayName = "Button";

const FloatButton = React.forwardRef<HTMLDivElement, ButtonProps>(
  ({ variant, className, ...props }, ref) => {
    return (
      <div
        className={cn(
          buttonVariants({ variant, className }),
          `btn-${
            variant || "default"
          } btn c-transition-all c-duration-300 c-rounded-full c-z-50 c-absolute c-bottom-7 c-right-6 c-shadow-sm`
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

export { Button, buttonVariants, FloatButton };
