import { Link, usePage } from '@inertiajs/react';
import { ArrowLeft, Edit, Eye, Plus, Save } from 'lucide-react';
import { cn } from '@/lib/utils';
import { type SharedData } from '@/types';

interface ContextualAction {
    title: string;
    href?: string;
    icon: React.ComponentType<{ className?: string }>;
    action?: () => void;
    variant?: 'primary' | 'secondary' | 'danger';
    disabled?: boolean;
}

export function ContextualNavigation() {
    const page = usePage<SharedData>();
    const currentUrl = page.url;

    const getContextualActions = (): ContextualAction[] => {
        // Acciones para la página de propiedades
        if (currentUrl === '/properties') {
            return [
                {
                    title: 'Nueva Propiedad',
                    href: '/properties/create',
                    icon: Plus,
                    variant: 'primary',
                },
            ];
        }

        // Acciones para crear propiedad
        if (currentUrl === '/properties/create') {
            return [
                {
                    title: 'Volver',
                    href: '/properties',
                    icon: ArrowLeft,
                    variant: 'secondary',
                },
                {
                    title: 'Guardar',
                    icon: Save,
                    variant: 'primary',
                    action: () => {
                        // Aquí se podría disparar el guardado del formulario
                        const form = document.querySelector('form');
                        if (form) {
                            form.dispatchEvent(new Event('submit', { bubbles: true }));
                        }
                    },
                },
            ];
        }

        // Acciones para editar propiedad
        if (currentUrl.includes('/properties/') && currentUrl.includes('/edit')) {
            return [
                {
                    title: 'Volver',
                    href: '/properties',
                    icon: ArrowLeft,
                    variant: 'secondary',
                },
                {
                    title: 'Ver',
                    href: currentUrl.replace('/edit', ''),
                    icon: Eye,
                    variant: 'secondary',
                },
                {
                    title: 'Guardar',
                    icon: Save,
                    variant: 'primary',
                    action: () => {
                        const form = document.querySelector('form');
                        if (form) {
                            form.dispatchEvent(new Event('submit', { bubbles: true }));
                        }
                    },
                },
            ];
        }

        // Acciones para ver propiedad
        if (currentUrl.includes('/properties/') && !currentUrl.includes('/edit') && !currentUrl.includes('/create')) {
            const propertyId = currentUrl.split('/').pop();
            return [
                {
                    title: 'Volver',
                    href: '/properties',
                    icon: ArrowLeft,
                    variant: 'secondary',
                },
                {
                    title: 'Editar',
                    href: `/properties/${propertyId}/edit`,
                    icon: Edit,
                    variant: 'primary',
                },
            ];
        }

        // Acciones para configuración
        if (currentUrl.includes('/settings/')) {
            return [
                {
                    title: 'Volver',
                    href: '/dashboard',
                    icon: ArrowLeft,
                    variant: 'secondary',
                },
            ];
        }

        return [];
    };

    const actions = getContextualActions();

    if (actions.length === 0) return null;

    const getVariantClasses = (variant: string) => {
        switch (variant) {
            case 'primary':
                return 'bg-blue-600 hover:bg-blue-700 text-white';
            case 'secondary':
                return 'bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200';
            case 'danger':
                return 'bg-red-600 hover:bg-red-700 text-white';
            default:
                return 'bg-gray-200 hover:bg-gray-300 text-gray-800';
        }
    };

    return (
        <div className="fixed top-4 right-4 z-50 md:hidden">
            <div className="flex flex-col space-y-2">
                {actions.map((action, index) => {
                    return action.href ? (
                        <Link
                            key={action.title}
                            href={action.href}
                            prefetch
                            className={cn(
                                "flex items-center space-x-2 px-3 py-2 rounded-lg shadow-lg transition-all duration-200 text-sm font-medium",
                                getVariantClasses(action.variant || 'secondary'),
                                action.disabled && "opacity-50 cursor-not-allowed",
                                "hover:scale-105 transform"
                            )}
                            style={{
                                animationDelay: `${index * 100}ms`,
                            }}
                        >
                            <action.icon className="w-4 h-4" />
                            <span>{action.title}</span>
                        </Link>
                    ) : (
                        <button
                            key={action.title}
                            onClick={action.action}
                            disabled={action.disabled}
                            className={cn(
                                "flex items-center space-x-2 px-3 py-2 rounded-lg shadow-lg transition-all duration-200 text-sm font-medium",
                                getVariantClasses(action.variant || 'secondary'),
                                action.disabled && "opacity-50 cursor-not-allowed",
                                "hover:scale-105 transform"
                            )}
                            style={{
                                animationDelay: `${index * 100}ms`,
                            }}
                        >
                            <action.icon className="w-4 h-4" />
                            <span>{action.title}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
