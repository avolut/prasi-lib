import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"

import { cn } from "@/utils"

const Tabs = TabsPrimitive.Root

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "c-inline-flex c-h-10 c-items-center c-justify-center c-rounded-md c-bg-muted c-p-1 c-text-muted-foreground",
      className
    )}
    {...props}
  />
))
TabsList.displayName = TabsPrimitive.List.displayName

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "c-inline-flex c-items-center c-justify-center c-whitespace-nowrap c-rounded-sm c-px-3 c-py-1.5 c-text-sm c-font-medium c-ring-offset-background c-transition-all focus-visible:c-outline-none focus-visible:c-ring-2 focus-visible:c-ring-ring focus-visible:c-ring-offset-2 disabled:c-pointer-events-none disabled:c-opacity-50 data-[state=active]:c-bg-background data-[state=active]:c-text-foreground data-[state=active]:c-shadow-sm",
      className
    )}
    {...props}
  />
))
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "c-mt-2 c-ring-offset-background focus-visible:c-outline-none focus-visible:c-ring-2 focus-visible:c-ring-ring focus-visible:c-ring-offset-2",
      className
    )}
    {...props}
  />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsList, TabsTrigger, TabsContent }
