import * as React from "react";
import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu";
import { cva } from "class-variance-authority";
import { ChevronDown } from "lucide-react";

import { cn } from "@/utils";

const NavigationMenu = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Root>
>(({ className, children, ...props }, ref) => (
  <NavigationMenuPrimitive.Root
    ref={ref}
    className={cn(
      "c-relative c-z-10 c-flex c-max-w-max c-flex-1 c-items-center c-justify-center",
      className
    )}
    {...props}
  >
    {children}
    {/* <NavigationMenuViewport /> */}
  </NavigationMenuPrimitive.Root>
));
NavigationMenu.displayName = NavigationMenuPrimitive.Root.displayName;

const NavigationMenuList = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.List>
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.List
    ref={ref}
    className={cn(
      "c-group c-flex c-flex-1 c-list-none c-items-center c-justify-center",
      className
    )}
    {...props}
  />
));
NavigationMenuList.displayName = NavigationMenuPrimitive.List.displayName;

const NavigationMenuItem = NavigationMenuPrimitive.Item;

const navigationMenuTriggerStyle = cva(
  "c-group c-inline-flex c-h-10 c-w-max c-items-center c-justify-center  c-bg-background c-px-4 c-py-2 c-transition-colors hover:c-bg-accent hover:c-text-accent-foreground focus:c-bg-accent focus:c-text-accent-foreground focus:c-outline-none disabled:c-pointer-events-none disabled:c-opacity-50 data-[active]:c-bg-accent/50 data-[state=open]:c-bg-accent/50"
);

const NavigationMenuTrigger = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <NavigationMenuPrimitive.Trigger
    ref={ref}
    className={cn(navigationMenuTriggerStyle(), "c-group", className)}
    {...props}
  >
    {children}
    <ChevronDown
      className="c-relative c-top-[1px] c-ml-1 c-h-3 c-w-3 c-transition c-duration-200 group-data-[state=open]:c-rotate-180"
      aria-hidden="true"
    />
  </NavigationMenuPrimitive.Trigger>
));
NavigationMenuTrigger.displayName = NavigationMenuPrimitive.Trigger.displayName;

const NavigationMenuContent = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Content>
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.Content
    ref={ref}
    className={cn(
      // "c-left-0 c-top-0 c-w-full",

      "c-absolute c-top-full c-w-fit c-bg-popover",
      "c-origin-top-center c-relative c-h-[var(--radix-navigation-menu-viewport-height)] c-w-full c-overflow-hidden c-rounded-md c-border c-bg-popover c-text-popover-foreground c-shadow-lg md:c-w-[var(--radix-navigation-menu-viewport-width)]",
      "data-[motion^=from-]:c-animate-in data-[motion^=to-]:c-animate-out data-[motion^=from-]:c-fade-in data-[motion^=to-]:c-fade-out data-[motion=from-end]:c-slide-in-from-right-52 data-[motion=from-start]:c-slide-in-from-left-52 data-[motion=to-end]:c-slide-out-to-right-52 data-[motion=to-start]:c-slide-out-to-left-52 md:c-absolute md:c-w-auto c-",

      className
    )}
    {...props}
  />
));
NavigationMenuContent.displayName = NavigationMenuPrimitive.Content.displayName;

const NavigationMenuLink = NavigationMenuPrimitive.Link;

const NavigationMenuViewport = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Viewport>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Viewport>
>(({ className, ...props }, ref) => (
  <div className={cn("c-absolute c-left-0 c-top-full c-flex c-justify-center")}>
    <NavigationMenuPrimitive.Viewport
      className={cn(
        "c-origin-top-center c-relative c-h-[var(--radix-navigation-menu-viewport-height)] c-w-full c-overflow-hidden c-rounded-md c-border c-bg-popover c-text-popover-foreground c-shadow-lg md:c-w-[var(--radix-navigation-menu-viewport-width)]",
        className
      )}
      ref={ref}
      {...props}
    />
  </div>
));
NavigationMenuViewport.displayName =
  NavigationMenuPrimitive.Viewport.displayName;

const NavigationMenuIndicator = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Indicator>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Indicator>
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.Indicator
    ref={ref}
    className={cn(
      "c-top-full c-z-[1] c-flex c-h-1.5 c-items-end c-justify-center c-overflow-hidden data-[state=visible]:c-animate-in data-[state=hidden]:c-animate-out data-[state=hidden]:c-fade-out data-[state=visible]:c-fade-in",
      className
    )}
    {...props}
  >
    <div className="c-relative c-top-[60%] c-h-2 c-w-2 c-rotate-45 c-rounded-tl-sm c-bg-border c-shadow-md" />
  </NavigationMenuPrimitive.Indicator>
));
NavigationMenuIndicator.displayName =
  NavigationMenuPrimitive.Indicator.displayName;

export {
  navigationMenuTriggerStyle,
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuLink,
  NavigationMenuIndicator,
  NavigationMenuViewport,
};
