import { Link, usePage } from '@inertiajs/react';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';
import { type SharedData } from '@/types';

interface BreadcrumbItem {
    title: string;
    href?: string;
    icon?: React.ComponentType<{ className?: string }>;
}

export function EnhancedBreadcrumbs() {
    const page = usePage<SharedData>();
    const currentUrl = page.url;

    const generateBreadcrumbs = (): BreadcrumbItem[] => {
        const segments = currentUrl.split('/').filter(Boolean);
        const breadcrumbs: BreadcrumbItem[] = [
            {
                title: 'Inicio',
                href: '/dashboard',
                icon: Home,
            },
        ];

        if (segments.length === 0) return breadcrumbs;

        let currentPath = '';
        segments.forEach((segment, index) => {
            // Filtrar segmentos que no queremos mostrar en breadcrumbs
            if (segment === 'admin') {
                currentPath += `/${segment}`;
                return;
            }
            
            currentPath += `/${segment}`;
            
            // Mapear segmentos a títulos más legibles
            let title = segment.charAt(0).toUpperCase() + segment.slice(1);
            
            // Mapeos específicos
            const titleMap: Record<string, string> = {
                'properties': 'Propiedades',
                'create': 'Crear',
                'edit': 'Editar',
                'settings': 'Configuración',
                'profile': 'Perfil',
                'appearance': 'Apariencia',
                'password': 'Contraseña',
                'super': 'Super Admin',
                'artisan-commands': 'Comandos Artisan',
            };

            title = titleMap[segment] || title;

            // No hacer el último elemento clickeable
            const isLast = index === segments.length - 1;
            
            breadcrumbs.push({
                title,
                href: isLast ? undefined : currentPath,
            });
        });

        return breadcrumbs;
    };

    const breadcrumbs = generateBreadcrumbs();

    if (breadcrumbs.length <= 1) return null;

    return (
        <nav className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400 mb-4 px-4 py-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            {breadcrumbs.map((item, index) => {
                const isLast = index === breadcrumbs.length - 1;
                const Icon = item.icon;

                return (
                    <div key={index} className="flex items-center">
                        {index > 0 && (
                            <ChevronRight className="w-4 h-4 mx-2 text-gray-400" />
                        )}
                        
                        {isLast ? (
                            <span className="font-medium text-gray-900 dark:text-gray-100">
                                {Icon && <Icon className="w-4 h-4 inline mr-1" />}
                                {item.title}
                            </span>
                        ) : (
                            <Link
                                href={item.href!}
                                className={cn(
                                    "hover:text-gray-700 dark:hover:text-gray-200 transition-colors duration-200",
                                    "flex items-center"
                                )}
                            >
                                {Icon && <Icon className="w-4 h-4 mr-1" />}
                                {item.title}
                            </Link>
                        )}
                    </div>
                );
            })}
        </nav>
    );
}
