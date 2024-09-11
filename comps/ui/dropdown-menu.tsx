import * as React from "react"
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu"
import { Check, ChevronRight, Circle } from "lucide-react"

import { cn } from "lib/utils"

const DropdownMenu = DropdownMenuPrimitive.Root

const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger

const DropdownMenuGroup = DropdownMenuPrimitive.Group

const DropdownMenuPortal = DropdownMenuPrimitive.Portal

const DropdownMenuSub = DropdownMenuPrimitive.Sub

const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup

const DropdownMenuSubTrigger = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubTrigger> & {
    inset?: boolean
  }
>(({ className, inset, children, ...props }, ref) => (
  <DropdownMenuPrimitive.SubTrigger
    ref={ref}
    className={cn(
      "c-flex c-cursor-default c-select-none c-items-center c-rounded-sm c-px-2 c-py-1.5 c-text-sm c-outline-none focus:c-bg-accent data-[state=open]:c-bg-accent",
      inset && "c-pl-8",
      className
    )}
    {...props}
  >
    {children}
    <ChevronRight className="c-ml-auto c-h-4 c-w-4" />
  </DropdownMenuPrimitive.SubTrigger>
))
DropdownMenuSubTrigger.displayName =
  DropdownMenuPrimitive.SubTrigger.displayName

const DropdownMenuSubContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubContent>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.SubContent
    ref={ref}
    className={cn(
      "c-z-50 c-min-w-[8rem] c-overflow-hidden c-rounded-md c-border c-bg-popover c-p-1 c-text-popover-foreground c-shadow-lg data-[state=open]:c-animate-in data-[state=closed]:c-animate-out data-[state=closed]:c-fade-out-0 data-[state=open]:c-fade-in-0 data-[state=closed]:c-zoom-out-95 data-[state=open]:c-zoom-in-95 data-[side=bottom]:c-slide-in-from-top-2 data-[side=left]:c-slide-in-from-right-2 data-[side=right]:c-slide-in-from-left-2 data-[side=top]:c-slide-in-from-bottom-2",
      className
    )}
    {...props}
  />
))
DropdownMenuSubContent.displayName =
  DropdownMenuPrimitive.SubContent.displayName

const DropdownMenuContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        "c-z-50 c-min-w-[8rem] c-overflow-hidden c-rounded-md c-border c-bg-popover c-p-1 c-text-popover-foreground c-shadow-md data-[state=open]:c-animate-in data-[state=closed]:c-animate-out data-[state=closed]:c-fade-out-0 data-[state=open]:c-fade-in-0 data-[state=closed]:c-zoom-out-95 data-[state=open]:c-zoom-in-95 data-[side=bottom]:c-slide-in-from-top-2 data-[side=left]:c-slide-in-from-right-2 data-[side=right]:c-slide-in-from-left-2 data-[side=top]:c-slide-in-from-bottom-2",
        className
      )}
      {...props}
    />
  </DropdownMenuPrimitive.Portal>
))
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName

const DropdownMenuItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> & {
    inset?: boolean
  }
>(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Item
    ref={ref}
    className={cn(
      "c-relative c-flex c-cursor-default c-select-none c-items-center c-rounded-sm c-px-2 c-py-1.5 c-text-sm c-outline-none c-transition-colors focus:c-bg-accent focus:c-text-accent-foreground data-[disabled]:c-pointer-events-none data-[disabled]:c-opacity-50",
      inset && "c-pl-8",
      className
    )}
    {...props}
  />
))
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName

const DropdownMenuCheckboxItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
  <DropdownMenuPrimitive.CheckboxItem
    ref={ref}
    className={cn(
      "c-relative c-flex c-cursor-default c-select-none c-items-center c-rounded-sm c-py-1.5 c-pl-8 c-pr-2 c-text-sm c-outline-none c-transition-colors focus:c-bg-accent focus:c-text-accent-foreground data-[disabled]:c-pointer-events-none data-[disabled]:c-opacity-50",
      className
    )}
    checked={checked}
    {...props}
  >
    <span className="c-absolute c-left-2 c-flex c-h-3.5 c-w-3.5 c-items-center c-justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <Check className="c-h-4 c-w-4" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.CheckboxItem>
))
DropdownMenuCheckboxItem.displayName =
  DropdownMenuPrimitive.CheckboxItem.displayName

const DropdownMenuRadioItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.RadioItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
  <DropdownMenuPrimitive.RadioItem
    ref={ref}
    className={cn(
      "c-relative c-flex c-cursor-default c-select-none c-items-center c-rounded-sm c-py-1.5 c-pl-8 c-pr-2 c-text-sm c-outline-none c-transition-colors focus:c-bg-accent focus:c-text-accent-foreground data-[disabled]:c-pointer-events-none data-[disabled]:c-opacity-50",
      className
    )}
    {...props}
  >
    <span className="c-absolute c-left-2 c-flex c-h-3.5 c-w-3.5 c-items-center c-justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <Circle className="c-h-2 c-w-2 c-fill-current" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.RadioItem>
))
DropdownMenuRadioItem.displayName = DropdownMenuPrimitive.RadioItem.displayName

const DropdownMenuLabel = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label> & {
    inset?: boolean
  }
>(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Label
    ref={ref}
    className={cn(
      "c-px-2 c-py-1.5 c-text-sm c-font-semibold",
      inset && "c-pl-8",
      className
    )}
    {...props}
  />
))
DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName

const DropdownMenuSeparator = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Separator
    ref={ref}
    className={cn("c--mx-1 c-my-1 c-h-px c-bg-muted", className)}
    {...props}
  />
))
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName

const DropdownMenuShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn("c-ml-auto c-text-xs c-tracking-widest c-opacity-60", className)}
      {...props}
    />
  )
}
DropdownMenuShortcut.displayName = "DropdownMenuShortcut"

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
}
