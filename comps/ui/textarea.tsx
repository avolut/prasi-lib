import * as React from "react"

import { cn } from "@/utils"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "c-flex c-min-h-[80px] c-w-full c-rounded-md c-border c-border-input c-bg-background c-px-3 c-py-2 c-text-sm c-ring-offset-background placeholder:c-text-muted-foreground focus-visible:c-outline-none focus-visible:c-ring-2 focus-visible:c-ring-ring focus-visible:c-ring-offset-2 disabled:c-cursor-not-allowed disabled:c-opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
