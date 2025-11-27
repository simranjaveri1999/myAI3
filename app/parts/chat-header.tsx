import { cn } from "@/lib/utils";

export function ChatHeaderBlock({ children, className }: { children?: React.ReactNode, className?: string }) {
    return (
        <div className={cn("gap-2 flex flex-1", className)}>
            {children}
        </div>
    )
}

export function ChatHeader({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full bg-white shadow-sm border-b border-neutral-200 py-4 px-6 flex items-center gap-3">
      
      {/* GOV-STYLE LOGO (replace with your file if you have one) */}
      <div className="h-10 w-10 rounded-full bg-[#0A3D62] flex items-center justify-center text-white font-bold text-sm">
        MS
      </div>

      {/* Title + subtitle */}
      <div className="flex flex-col">
        <h1 className="text-lg font-semibold text-[#0A3D62]">
          MSME Scheme Guide
        </h1>
        <p className="text-xs text-neutral-600">
          Government schemes, subsidies and benefits for entrepreneurs
        </p>
      </div>

      {/* Anything else passed from parent */}
      <div className="ml-auto">{children}</div>
    </div>
  );
}
