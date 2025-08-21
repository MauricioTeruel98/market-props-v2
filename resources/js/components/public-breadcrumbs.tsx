import { Link } from '@inertiajs/react';
import { ChevronRight, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BreadcrumbItem {
    label: string;
    href?: string;
    current?: boolean;
}

interface PublicBreadcrumbsProps {
    items: BreadcrumbItem[];
    className?: string;
}

export default function PublicBreadcrumbs({ items, className = '' }: PublicBreadcrumbsProps) {
    return (
        <nav className={`flex items-center space-x-1 text-sm text-gray-400 ${className}`} aria-label="Breadcrumb">
            <Link href={route('home')}>
                <Button variant="ghost" size="sm" className="h-6 px-2 text-gray-400 hover:text-white hover:bg-gray-800">
                    <Home className="h-3 w-3" />
                    <span className="sr-only">Inicio</span>
                </Button>
            </Link>
            
            {items.map((item, index) => (
                <div key={index} className="flex items-center space-x-1">
                    <ChevronRight className="h-3 w-3 text-gray-600" />
                    {item.current ? (
                        <span className="font-medium text-white">{item.label}</span>
                    ) : item.href ? (
                        <Link href={item.href}>
                            <Button variant="ghost" size="sm" className="h-6 px-2 text-xs text-gray-400 hover:text-white hover:bg-gray-800">
                                {item.label}
                            </Button>
                        </Link>
                    ) : (
                        <span className="text-xs text-gray-400">{item.label}</span>
                    )}
                </div>
            ))}
        </nav>
    );
}
