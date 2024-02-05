import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"

import { cn } from "@/utils"

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      "c-relative c-flex c-w-full c-touch-none c-select-none c-items-center",
      className
    )}
    {...props}
  >
    <SliderPrimitive.Track className="c-relative c-h-2 c-w-full c-grow c-overflow-hidden c-rounded-full c-bg-secondary">
      <SliderPrimitive.Range className="c-absolute c-h-full c-bg-primary" />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb className="c-block c-h-5 c-w-5 c-rounded-full c-border-2 c-border-primary c-bg-background c-ring-offset-background c-transition-colors focus-visible:c-outline-none focus-visible:c-ring-2 focus-visible:c-ring-ring focus-visible:c-ring-offset-2 disabled:c-pointer-events-none disabled:c-opacity-50" />
  </SliderPrimitive.Root>
))
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }
