import { Link } from '@inertiajs/react';
import { Building2, Plus, Settings, User, Home, Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useBottomNavigation } from '@/hooks/use-bottom-navigation';

const iconMap = {
    Home,
    Building2,
    Plus,
    Menu,
    User,
    Settings,
};

export function BottomNavigation() {
    const { navigationItems, isActive } = useBottomNavigation();

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-t border-gray-200 dark:bg-gray-900/95 dark:border-gray-700 md:hidden shadow-lg">
            <div className="flex items-center justify-around px-2 py-2">
                {navigationItems.map((item) => {
                    const IconComponent = iconMap[item.icon as keyof typeof iconMap];
                    const active = isActive(item.href);
                    
                    return (
                        <Link
                            key={item.title}
                            href={item.href}
                            prefetch
                            className={cn(
                                "flex flex-col items-center justify-center w-full py-2 px-1 rounded-lg transition-all duration-200 relative group",
                                active
                                    ? "text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-900/20"
                                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-800"
                            )}
                        >
                            <div className="relative">
                                <IconComponent className={cn(
                                    "w-5 h-5 transition-transform duration-200",
                                    active ? "scale-110" : "group-hover:scale-105"
                                )} />
                                {item.badge && (
                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center animate-pulse">
                                        {item.badge}
                                    </span>
                                )}
                            </div>
                            <span className={cn(
                                "text-xs mt-1 font-medium transition-all duration-200",
                                active ? "text-blue-600 dark:text-blue-400" : ""
                            )}>
                                {item.title}
                            </span>
                            {active && (
                                <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-600 dark:bg-blue-400 rounded-full" />
                            )}
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
