import * as React from "react"
import * as SwitchPrimitives from "@radix-ui/react-switch"

import { cn } from "lib/utils"

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      "c-peer c-inline-flex c-h-6 c-w-11 c-shrink-0 c-cursor-pointer c-items-center c-rounded-full c-border-2 c-border-transparent c-transition-colors focus-visible:c-outline-none focus-visible:c-ring-2 focus-visible:c-ring-ring focus-visible:c-ring-offset-2 focus-visible:c-ring-offset-background disabled:c-cursor-not-allowed disabled:c-opacity-50 data-[state=checked]:c-bg-primary data-[state=unchecked]:c-bg-input",
      className
    )}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb
      className={cn(
        "c-pointer-events-none c-block c-h-5 c-w-5 c-rounded-full c-bg-background c-shadow-lg c-ring-0 c-transition-transform data-[state=checked]:c-translate-x-5 data-[state=unchecked]:c-translate-x-0"
      )}
    />
  </SwitchPrimitives.Root>
))
Switch.displayName = SwitchPrimitives.Root.displayName

export { Switch }
