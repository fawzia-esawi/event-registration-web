import type { LucideIcon } from "lucide-react";
import { useCountUp } from "../../hooks/useCountUp.ts";

interface StatCardProps {
    label: string;
    value: number;
    hint: string;
    icon: LucideIcon;
    gradient: string;
}

function StatCard({ label, value, hint, icon: Icon, gradient }: StatCardProps) {
    const animatedValue = useCountUp(value);

    return (
        <div className="dash-float">
            <div className="dash-glass dash-glass-hover dash-sheen rounded-3xl p-6">
                <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                        <p className="text-sm font-medium text-violet-100/80">{label}</p>
                        <p className="mt-3 text-5xl font-semibold tracking-tight text-white tabular-nums">
                            {animatedValue.toLocaleString("en-US")}
                        </p>
                    </div>
                    <div
                        className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-lg shadow-violet-950/40 ring-1 ring-white/20 ${gradient}`}
                    >
                        <Icon size={26} />
                    </div>
                </div>
                <p className="mt-5 border-t border-white/10 pt-4 text-xs text-violet-100/60">{hint}</p>
            </div>
        </div>
    );
}

export default StatCard;