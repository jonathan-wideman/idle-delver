import { twMerge } from "tailwind-merge"

export function PanelTitle({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  // TODO: allow overriding base h2 component
  return <h2 className={twMerge("text-lg", className)}>{children}</h2>
}
