import { cn } from "lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("c-animate-pulse c-rounded-md c-bg-slate-100 c-bg-opacity-70", className)}
      {...props}
    />
  )
}

export { Skeleton }
