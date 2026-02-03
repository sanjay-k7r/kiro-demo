import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-black/50 dark:placeholder:text-white/50 selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black bg-white dark:bg-black border-black dark:border-white h-12 w-full min-w-0 border-3 px-4 py-3 text-base outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-bold disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 font-mono focus-visible:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:focus-visible:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] transition-shadow",
        className
      )}
      {...props}
    />
  )
}

export { Input }
