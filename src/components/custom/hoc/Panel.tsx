import { twMerge } from "tailwind-merge"

export function Panel({
  children,
  className,
}: {
  children?: React.ReactNode
  className?: string
}) {
  return (
    <div className={twMerge("rounded border px-4 py-2", className)}>
      {children}
    </div>
  )
}
