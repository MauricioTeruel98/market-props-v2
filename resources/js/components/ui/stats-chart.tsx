interface ChartData {
    label: string;
    value: number;
    color: string;
}

interface StatsChartProps {
    title: string;
    data: ChartData[];
    total: number;
    className?: string;
}

export function StatsChart({ title, data, total, className = '' }: StatsChartProps) {
    return (
        <div className={`rounded-xl border border-sidebar-border/70 bg-card p-6 dark:border-sidebar-border ${className}`}>
            <h3 className="mb-4 text-lg font-semibold">{title}</h3>
            <div className="space-y-3">
                {data.map((item, index) => {
                    const percentage = total > 0 ? (item.value / total) * 100 : 0;
                    return (
                        <div key={index} className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                                <span className="font-medium">{item.label}</span>
                                <span className="text-muted-foreground">
                                    {item.value} ({percentage.toFixed(1)}%)
                                </span>
                            </div>
                            <div className="h-2 w-full rounded-full bg-muted">
                                <div
                                    className="h-2 rounded-full transition-all duration-300"
                                    style={{
                                        width: `${percentage}%`,
                                        backgroundColor: item.color
                                    }}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
            <div className="mt-4 pt-4 border-t border-sidebar-border/50">
                <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Total</span>
                    <span className="text-lg font-bold">{total}</span>
                </div>
            </div>
        </div>
    );
}
