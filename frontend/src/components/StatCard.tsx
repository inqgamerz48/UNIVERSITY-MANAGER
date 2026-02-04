import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";

interface StatCardProps {
    title: string;
    value: string | number;
    change?: string;
    trend?: "up" | "down";
    icon: LucideIcon;
    variant?: "gold" | "sage" | "copper" | "blue";
}

export default function StatCard({
    title,
    value,
    change,
    trend,
    icon: Icon,
    variant = "gold",
}: StatCardProps) {
    return (
        <div className="stat-card cursor-pointer">
            <div className={`stat-icon ${variant}`}>
                <Icon size={24} strokeWidth={1.5} />
            </div>
            <div>
                <div className="stat-value">{value}</div>
                <div className="stat-label">{title}</div>
                {change && (
                    <div className={`stat-change ${trend === "up" ? "positive" : "negative"}`}>
                        <span className="inline-flex items-center gap-1">
                            {trend === "up" ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                            {change}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}
