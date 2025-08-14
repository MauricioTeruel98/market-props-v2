import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { WelcomeSection } from '@/components/ui/welcome-section';
import { StatsCard } from '@/components/ui/stats-card';
import { StatsChart } from '@/components/ui/stats-chart';
import { RecentProperties } from '@/components/ui/recent-properties';
import { Icon } from '@/components/icon';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

interface DashboardProps {
    userPropertyStats: {
        total: number;
        available: number;
        rent: number;
        sale: number;
    };
    userProperties: Array<{
        id: number;
        title: string;
        address: string;
        modality: string;
        currency: string;
        price: number;
        status: string;
        cover_image?: string;
        images?: Array<{
            id: number;
            image_path: string;
            order: number;
        }>;
    }>;
    currencyStats: {
        ars: number;
        usd: number;
    };
    statusStats: {
        available: number;
        unavailable: number;
    };
    userRole: string;
    auth: {
        user: {
            name: string;
        };
    };
}

export default function Dashboard({
    userPropertyStats,
    userProperties,
    currencyStats,
    statusStats,
    userRole,
    auth
}: DashboardProps) {
    const modalityData = [
        { label: 'Alquiler', value: userPropertyStats.rent, color: '#3b82f6' },
        { label: 'Venta', value: userPropertyStats.sale, color: '#10b981' }
    ];

    const currencyData = [
        { label: 'Pesos (ARS)', value: currencyStats.ars, color: '#f59e0b' },
        { label: 'Dólares (USD)', value: currencyStats.usd, color: '#8b5cf6' }
    ];

    const statusData = [
        { label: 'Disponibles', value: statusStats.available, color: '#10b981' },
        { label: 'No Disponibles', value: statusStats.unavailable, color: '#ef4444' }
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6 overflow-x-auto">
                {/* Sección de bienvenida */}
                <WelcomeSection 
                    userName={auth.user.name}
                    userRole={userRole}
                />

                {/* Estadísticas del usuario */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <StatsCard
                        title="Mis Propiedades"
                        value={userPropertyStats.total}
                        icon={<Icon name="home" className="h-6 w-6 text-primary" />}
                        description="Total de mis propiedades"
                    />
                    <StatsCard
                        title="Mis Disponibles"
                        value={userPropertyStats.available}
                        icon={<Icon name="check-circle" className="h-6 w-6 text-green-600" />}
                        description="Mis propiedades disponibles"
                    />
                    <StatsCard
                        title="Mis Alquileres"
                        value={userPropertyStats.rent}
                        icon={<Icon name="key" className="h-6 w-6 text-blue-600" />}
                        description="Mis propiedades en alquiler"
                    />
                    <StatsCard
                        title="Mis Ventas"
                        value={userPropertyStats.sale}
                        icon={<Icon name="dollar-sign" className="h-6 w-6 text-green-600" />}
                        description="Mis propiedades en venta"
                    />
                </div>

                {/* Gráficos y estadísticas */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <StatsChart
                        title="Distribución por Modalidad"
                        data={modalityData}
                        total={userPropertyStats.total}
                    />
                    <StatsChart
                        title="Distribución por Moneda"
                        data={currencyData}
                        total={userPropertyStats.total}
                    />
                    <StatsChart
                        title="Estado de Mis Propiedades"
                        data={statusData}
                        total={userPropertyStats.total}
                    />
                </div>

                {/* Propiedades recientes del usuario */}
                <div className="grid gap-6 md:grid-cols-2">
                    <RecentProperties
                        properties={userProperties}
                        title="Mis Propiedades Recientes"
                    />
                    
                    {/* Panel de acciones rápidas */}
                    <div className="rounded-xl border border-sidebar-border/70 bg-card p-6 dark:border-sidebar-border">
                        <h3 className="mb-4 text-lg font-semibold">Acciones Rápidas</h3>
                        <div className="space-y-3">
                            <div className="flex items-center space-x-3 p-3 rounded-lg border border-sidebar-border/50 hover:bg-muted/50">
                                <Icon name="plus" className="h-5 w-5 text-primary" />
                                <span className="text-sm">Crear nueva propiedad</span>
                            </div>
                            <div className="flex items-center space-x-3 p-3 rounded-lg border border-sidebar-border/50 hover:bg-muted/50">
                                <Icon name="search" className="h-5 w-5 text-blue-600" />
                                <span className="text-sm">Buscar mis propiedades</span>
                            </div>
                            <div className="flex items-center space-x-3 p-3 rounded-lg border border-sidebar-border/50 hover:bg-muted/50">
                                <Icon name="settings" className="h-5 w-5 text-gray-600" />
                                <span className="text-sm">Configuración</span>
                            </div>
                            <div className="flex items-center space-x-3 p-3 rounded-lg border border-sidebar-border/50 hover:bg-muted/50">
                                <Icon name="help-circle" className="h-5 w-5 text-orange-600" />
                                <span className="text-sm">Ayuda y soporte</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
