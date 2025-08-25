import { usePage } from '@inertiajs/react';
import { type SharedData } from '@/types';
import { useMemo } from 'react';

interface NavigationItem {
    title: string;
    href: string;
    icon: string;
    badge?: number;
    showForRoles?: string[];
    priority?: number;
}

export function useBottomNavigation() {
    const page = usePage<SharedData>();
    const user = page.props.auth?.user;
    const currentUrl = page.url;

    const navigationItems = useMemo((): NavigationItem[] => {
        const items: NavigationItem[] = [
            {
                title: 'Inicio',
                href: '/dashboard',
                icon: 'Home',
                priority: 1,
            },
            {
                title: 'Propiedades',
                href: '/properties',
                icon: 'Building2',
                priority: 2,
            },
            {
                title: 'Nueva',
                href: '/admin/properties/create',
                icon: 'Plus',
                showForRoles: ['admin', 'superadmin'],
                priority: 3,
            },
            {
                title: 'Super Admin',
                href: '/super/properties',
                icon: 'Menu',
                showForRoles: ['superadmin'],
                priority: 4,
            },
            {
                title: 'Perfil',
                href: '/settings/profile',
                icon: 'User',
                priority: 5,
            },
            {
                title: 'Config',
                href: '/settings/appearance',
                icon: 'Settings',
                priority: 6,
            },
        ];

        // Si estamos en una página de propiedades específica, ajustar la navegación
        if (currentUrl.includes('/properties/')) {
            items.push({
                title: 'Volver',
                href: '/properties',
                icon: 'Building2',
                priority: 0,
            });
        }

        // Filtrar por roles y ordenar por prioridad
        return items
            .filter(item => {
                if (!item.showForRoles) return true;
                return item.showForRoles.includes(user?.role || '');
            })
            .sort((a, b) => (a.priority || 999) - (b.priority || 999))
            .slice(0, 5); // Limitar a 5 elementos
    }, [user?.role]);

    const isActive = (href: string) => {
        return currentUrl.startsWith(href);
    };

    const getActiveItem = () => {
        return navigationItems.find(item => isActive(item.href));
    };

    return {
        navigationItems,
        isActive,
        getActiveItem,
        currentUrl,
        user,
    };
}
