"use client";

import * as React from "react";
import * as SheetPrimitive from "@radix-ui/react-dialog";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/utils";

const Sheet = SheetPrimitive.Root;

const SheetTrigger = SheetPrimitive.Trigger;

const SheetClose = SheetPrimitive.Close;

const SheetPortal = SheetPrimitive.Portal;

const SheetOverlay = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Overlay
    className={cn(
      "c-fixed c-inset-0 c-z-50 c-bg-black/80  data-[state=open]:c-animate-in data-[state=closed]:c-animate-out data-[state=closed]:c-fade-out-0 data-[state=open]:c-fade-in-0",
      className
    )}
    {...props}
    ref={ref}
  />
));
SheetOverlay.displayName = SheetPrimitive.Overlay.displayName;

const sheetVariants = cva(
  "c-fixed c-z-50 c-gap-4 c-bg-background c-shadow-lg c-transition c-ease-in-out data-[state=closed]:c-duration-300 data-[state=open]:c-duration-500 data-[state=open]:c-animate-in data-[state=closed]:c-animate-out",
  {
    variants: {
      side: {
        top: "c-inset-x-0 c-top-0 c-border-b data-[state=closed]:c-slide-out-to-top data-[state=open]:c-slide-in-from-top",
        bottom:
          "c-inset-x-0 c-bottom-0 c-border-t data-[state=closed]:c-slide-out-to-bottom data-[state=open]:c-slide-in-from-bottom",
        left: "c-inset-y-0 c-left-0 c-h-full c-w-3/4 c-border-r data-[state=closed]:c-slide-out-to-left data-[state=open]:c-slide-in-from-left sm:c-max-w-sm",
        right:
          "c-inset-y-0 c-right-0 c-h-full c-w-3/4 c-border-l data-[disabled]:c-bg-red-300 data-[state=closed]:c-slide-out-to-right data-[state=open]:c-slide-in-from-right sm:c-max-w-sm",
      },
    },
    defaultVariants: {
      side: "right",
    },
  }
);

interface SheetContentProps
  extends React.ComponentPropsWithoutRef<typeof SheetPrimitive.Content>,
    VariantProps<typeof sheetVariants> {}

const SheetContent = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Content>,
  SheetContentProps
>(({ side = "right", className, children, ...props }, ref) => (
  <SheetPortal>
    <SheetPrimitive.Content
      ref={ref}
      className={cn(sheetVariants({ side }), className)}
      {...props}
    >
      {children}
    </SheetPrimitive.Content>
  </SheetPortal>
));
SheetContent.displayName = SheetPrimitive.Content.displayName;

const SheetHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "c-flex c-flex-col c-space-y-2 c-text-center sm:c-text-left",
      className
    )}
    {...props}
  />
);
SheetHeader.displayName = "SheetHeader";

const SheetFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "c-flex c-flex-col-reverse sm:c-flex-row sm:c-justify-end sm:c-space-x-2",
      className
    )}
    {...props}
  />
);
SheetFooter.displayName = "SheetFooter";

const SheetTitle = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Title>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Title
    ref={ref}
    className={cn("c-text-lg c-font-semibold c-text-foreground", className)}
    {...props}
  />
));
SheetTitle.displayName = SheetPrimitive.Title.displayName;

const SheetDescription = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Description>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Description
    ref={ref}
    className={cn("c-text-sm c-text-muted-foreground", className)}
    {...props}
  />
));
SheetDescription.displayName = SheetPrimitive.Description.displayName;

export {
  Sheet,
  SheetPortal,
  SheetOverlay,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
};
