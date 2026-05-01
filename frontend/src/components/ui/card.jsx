import { cn } from "../../lib/utils";

export default function Card({ className, ...props }) {
  return <div className={cn("glass rounded-lg p-6 shadow-card", className)} {...props} />;
}
