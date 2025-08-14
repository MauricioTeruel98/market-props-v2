import { ReactNode } from 'react';
import { Icon } from '@/components/icon';

interface StatsCardProps {
    title: string;
    value: string | number;
    icon: ReactNode;
    description?: string;
    trend?: {
        value: string;
        isPositive: boolean;
    };
    className?: string;
}

export function StatsCard({ title, value, icon, description, trend, className = '' }: StatsCardProps) {
    return (
        <div className={`rounded-xl border border-sidebar-border/70 bg-card p-6 dark:border-sidebar-border ${className}`}>
            <div className="flex items-center justify-between">
                <div className="flex-1">
                    <p className="text-sm font-medium text-muted-foreground">{title}</p>
                    <p className="mt-2 text-3xl font-bold">{value}</p>
                    {description && (
                        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
                    )}
                    {trend && (
                        <div className="mt-2 flex items-center">
                            <Icon
                                name={trend.isPositive ? 'trending-up' : 'trending-down'}
                                className={`mr-1 h-4 w-4 ${
                                    trend.isPositive ? 'text-green-500' : 'text-red-500'
                                }`}
                            />
                            <span
                                className={`text-sm font-medium ${
                                    trend.isPositive ? 'text-green-600' : 'text-red-600'
                                }`}
                            >
                                {trend.value}
                            </span>
                        </div>
                    )}
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    {icon}
                </div>
            </div>
        </div>
    );
}
