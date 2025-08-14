import { Link } from '@inertiajs/react';
import { Icon } from '@/components/icon';
import { Badge } from '@/components/ui/badge';

interface Property {
    id: number;
    title: string;
    address: string;
    modality: string;
    currency: string;
    price: number;
    status: string;
    cover_image?: string;
    user?: {
        name: string;
    };
    images?: Array<{
        id: number;
        image_path: string;
        order: number;
    }>;
}

interface RecentPropertiesProps {
    properties: Property[];
    title: string;
    showUser?: boolean;
}

export function RecentProperties({ properties, title, showUser = false }: RecentPropertiesProps) {
    if (properties.length === 0) {
        return (
            <div className="rounded-xl border border-sidebar-border/70 bg-card p-6 dark:border-sidebar-border">
                <h3 className="mb-4 text-lg font-semibold">{title}</h3>
                <div className="text-center py-8">
                    <Icon name="home" className="mx-auto h-12 w-12 text-muted-foreground/50" />
                    <p className="mt-2 text-sm text-muted-foreground">No hay propiedades para mostrar</p>
                </div>
            </div>
        );
    }

    return (
        <div className="rounded-xl border border-sidebar-border/70 bg-card p-6 dark:border-sidebar-border">
            <h3 className="mb-4 text-lg font-semibold">{title}</h3>
            <div className="space-y-4">
                {properties.map((property) => (
                    <div key={property.id} className="flex items-center space-x-4 rounded-lg border border-sidebar-border/50 p-3 hover:bg-muted/50">
                        <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg">
                            {property.cover_image ? (
                                <img
                                    src={property.cover_image}
                                    alt={property.title}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center bg-muted">
                                    <Icon name="home" className="h-6 w-6 text-muted-foreground" />
                                </div>
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                                <h4 className="text-sm font-medium truncate">{property.title}</h4>
                                <Badge variant={property.status === 'available' ? 'default' : 'secondary'}>
                                    {property.status === 'available' ? 'Disponible' : 'No Disponible'}
                                </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground truncate">{property.address}</p>
                            <div className="mt-1 flex items-center space-x-2">
                                <Badge variant="outline" className="text-xs">
                                    {property.modality === 'rent' ? 'Alquiler' : 'Venta'}
                                </Badge>
                                <span className="text-sm font-medium">
                                    {property.currency === 'ars' 
                                        ? `$${property.price.toLocaleString('es-AR')}` 
                                        : `$${property.price.toFixed(2)}`
                                    }
                                </span>
                            </div>
                            {showUser && property.user && (
                                <p className="text-xs text-muted-foreground mt-1">
                                    Propietario: {property.user.name}
                                </p>
                            )}
                        </div>
                        <Link
                            href={`/admin/properties/${property.id}/edit`}
                            className="flex-shrink-0 p-2 text-muted-foreground hover:text-foreground"
                        >
                            <Icon name="edit" className="h-4 w-4" />
                        </Link>
                    </div>
                ))}
            </div>
            <div className="mt-4 pt-4 border-t border-sidebar-border/50">
                <Link
                    href="/admin/properties"
                    className="text-sm text-primary hover:underline flex items-center"
                >
                    Ver todas las propiedades
                    <Icon name="arrow-right" className="ml-1 h-4 w-4" />
                </Link>
            </div>
        </div>
    );
}
