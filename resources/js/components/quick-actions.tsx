import { Link, usePage } from '@inertiajs/react';
import { Plus, Settings, User, Building2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { type SharedData } from '@/types';
import { useState } from 'react';

interface QuickAction {
    title: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
    color?: string;
}

export function QuickActions() {
    const page = usePage<SharedData>();
    const user = page.props.auth?.user;
    const [isOpen, setIsOpen] = useState(false);

    const quickActions: QuickAction[] = [
        {
            title: 'Nueva Propiedad',
            href: '/properties/create',
            icon: Plus,
            color: 'bg-green-500 hover:bg-green-600',
        },
        {
            title: 'Ver Propiedades',
            href: '/properties',
            icon: Building2,
            color: 'bg-blue-500 hover:bg-blue-600',
        },
        {
            title: 'Mi Perfil',
            href: '/settings/profile',
            icon: User,
            color: 'bg-purple-500 hover:bg-purple-600',
        },
        {
            title: 'Configuración',
            href: '/settings/appearance',
            icon: Settings,
            color: 'bg-gray-500 hover:bg-gray-600',
        },
    ].filter(action => {
        // Filtrar según el rol del usuario
        if (action.href.includes('/properties/create') && !['admin', 'superadmin'].includes(user?.role || '')) {
            return false;
        }
        return true;
    });

    if (quickActions.length === 0) return null;

    return (
        <div className="fixed bottom-20 right-4 z-40 md:hidden">
            {/* Botón principal */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg transition-all duration-300 flex items-center justify-center",
                    isOpen && "rotate-45"
                )}
            >
                <Plus className="w-6 h-6" />
            </button>

            {/* Acciones rápidas */}
            <div className={cn(
                "absolute bottom-16 right-0 transition-all duration-300",
                isOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
            )}>
                {quickActions.map((action, index) => (
                    <Link
                        key={action.title}
                        href={action.href}
                        prefetch
                        className={cn(
                            "block w-12 h-12 mb-3 rounded-full shadow-lg transition-all duration-300 flex items-center justify-center text-white",
                            action.color,
                            "hover:scale-110 transform"
                        )}
                        style={{
                            transitionDelay: `${index * 100}ms`,
                        }}
                        onClick={() => setIsOpen(false)}
                    >
                        <action.icon className="w-5 h-5" />
                    </Link>
                ))}
            </div>

            {/* Overlay para cerrar */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-30"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </div>
    );
}
