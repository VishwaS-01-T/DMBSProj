import { cn } from "../../lib/utils";

export default function Badge({ className, tone = "default", ...props }) {
  const toneStyles = {
    default: "bg-base-surface2 text-text-secondary border-base-border",
    green: "bg-[#D1FAE5] text-[#065F46] border-[#A7F3D0]",
    amber: "bg-[#FEF3C7] text-[#92400E] border-[#FDE68A]",
    blue: "bg-[#DBEAFE] text-[#1E40AF] border-[#93C5FD]",
    red: "bg-[#FEE2E2] text-[#991B1B] border-[#FCA5A5]",
    grey: "bg-[#F3F4F6] text-[#6B7280] border-[#E5E7EB]",
    external: "bg-[#EEF2FF] text-[#3730A3] border-[#C7D2FE]",
    merit: "bg-[#FEF3C7] text-[#92400E] border-[#FDE68A]",
    athletics: "bg-[#D1FAE5] text-[#065F46] border-[#A7F3D0]",
    mcm: "bg-[#EDE9FE] text-[#5B21B6] border-[#DDD6FE]"
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em]",
        toneStyles[tone],
        className
      )}
      {...props}
    />
  );
}
