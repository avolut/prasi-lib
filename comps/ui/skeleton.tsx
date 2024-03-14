import { cn } from "@/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("c-animate-pulse c-rounded-md c-bg-slate-100", className)}
      {...props}
    />
  )
}

export { Skeleton }
