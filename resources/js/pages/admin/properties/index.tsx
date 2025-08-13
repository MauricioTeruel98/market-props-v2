import AppLayout from "@/layouts/app-layout";
import { type BreadcrumbItem } from "@/types";
import { Head, Link, router } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@/components/icon";
import { 
    Table, 
    TableBody, 
    TableCell, 
    TableHead, 
    TableHeader, 
    TableRow 
} from "@/components/ui/table";
import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Propiedades',
        href: '/admin/properties',
    },
];

interface Property {
    id: number;
    title: string;
    address: string;
    modality: 'rent' | 'sale';
    currency: 'ars' | 'dollar';
    price: string | number;
    status: 'available' | 'unavailable';
    amenities: string[];
    cover_image: string;
    user: {
        name: string;
    };
    images: Array<{
        id: number;
        image_path: string;
    }>;
    created_at: string;
}

interface PropertiesProps {
    properties: {
        data: Property[];
        links: Array<{
            url: string | null;
            label: string;
            active: boolean;
        }>;
    };
}

export default function Properties({ properties }: PropertiesProps) {
    const handleDelete = (id: number) => {
        if (confirm('¿Estás seguro de que quieres eliminar esta propiedad?')) {
            router.delete(`/admin/properties/${id}`);
        }
    };

    const getModalityLabel = (modality: string) => {
        return modality === 'rent' ? 'Alquiler' : 'Venta';
    };

    const getCurrencyLabel = (currency: string) => {
        return currency === 'ars' ? 'ARS' : 'USD';
    };

    const getStatusLabel = (status: string) => {
        return status === 'available' ? 'Disponible' : 'No Disponible';
    };

    const getStatusVariant = (status: string) => {
        return status === 'available' ? 'default' : 'secondary';
    };

    const formatPrice = (price: string | number, currency: string) => {
        const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
        
        if (isNaN(numericPrice)) {
            return '$0';
        }
        
        if (currency === 'ars') {
            return `$${numericPrice.toLocaleString('es-AR')}`;
        }
        return `$${numericPrice.toFixed(2)}`;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Propiedades" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Propiedades</h1>
                        <p className="text-muted-foreground">
                            Gestiona todas las propiedades del sistema
                        </p>
                    </div>
                    <Link href="/admin/properties/create">
                        <Button>
                            <Icon name="plus" className="mr-2 h-4 w-4" />
                            Nueva Propiedad
                        </Button>
                    </Link>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Lista de Propiedades</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Imagen</TableHead>
                                        <TableHead>Título</TableHead>
                                        <TableHead>Dirección</TableHead>
                                        <TableHead>Modalidad</TableHead>
                                        <TableHead>Precio</TableHead>
                                        <TableHead>Estado</TableHead>
                                        <TableHead>Amenities</TableHead>
                                        <TableHead>Fecha</TableHead>
                                        <TableHead>Acciones</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {properties.data.map((property) => (
                                        <TableRow key={property.id}>
                                            <TableCell>
                                                <div className="w-16 h-16 rounded-lg overflow-hidden">
                                                    <img
                                                        src={`/storage/${property.cover_image}`}
                                                        alt={property.title}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="font-medium">{property.title}</div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="text-sm text-muted-foreground max-w-xs truncate">
                                                    {property.address}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={property.modality === 'rent' ? 'default' : 'secondary'}>
                                                    {getModalityLabel(property.modality)}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="font-medium">
                                                    {formatPrice(property.price, property.currency)}
                                                </div>
                                                <div className="text-xs text-muted-foreground">
                                                    {getCurrencyLabel(property.currency)}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={getStatusVariant(property.status)}>
                                                    {getStatusLabel(property.status)}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-wrap gap-1 max-w-xs">
                                                    {property.amenities.slice(0, 3).map((amenity, index) => (
                                                        <Badge key={index} variant="outline" className="text-xs">
                                                            {amenity}
                                                        </Badge>
                                                    ))}
                                                    {property.amenities.length > 3 && (
                                                        <Badge variant="outline" className="text-xs">
                                                            +{property.amenities.length - 3}
                                                        </Badge>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="text-sm text-muted-foreground">
                                                    {new Date(property.created_at).toLocaleDateString('es-ES')}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="sm">
                                                            <Icon name="more-horizontal" className="mr-2 h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem asChild>
                                                            <Link href={`/admin/properties/${property.id}/edit`}>
                                                                <Icon name="edit" className="mr-2 h-4 w-4" />
                                                                Editar
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={() => handleDelete(property.id)}
                                                            className="text-destructive"
                                                        >
                                                            <Icon name="trash" className="mr-2 h-4 w-4" />
                                                            Eliminar
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}