import { Link } from '@inertiajs/react';
import { ChevronRight, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BreadcrumbItem {
    label: string;
    href?: string;
    current?: boolean;
}

interface AuthBreadcrumbsProps {
    items: BreadcrumbItem[];
    className?: string;
}

export default function AuthBreadcrumbs({ items, className = '' }: AuthBreadcrumbsProps) {
    return (
        <nav className={`flex items-center space-x-1 text-sm text-muted-foreground ${className}`} aria-label="Breadcrumb">
            <Link href={route('home')}>
                <Button variant="ghost" size="sm" className="h-6 px-2">
                    <Home className="h-3 w-3" />
                    <span className="sr-only">Inicio</span>
                </Button>
            </Link>
            
            {items.map((item, index) => (
                <div key={index} className="flex items-center space-x-1">
                    <ChevronRight className="h-3 w-3" />
                    {item.current ? (
                        <span className="font-medium text-foreground">{item.label}</span>
                    ) : item.href ? (
                        <Link href={item.href}>
                            <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                                {item.label}
                            </Button>
                        </Link>
                    ) : (
                        <span className="text-xs">{item.label}</span>
                    )}
                </div>
            ))}
        </nav>
    );
}
