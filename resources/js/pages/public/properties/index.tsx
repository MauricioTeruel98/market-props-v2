import { Head, Link, router } from "@inertiajs/react";
import { useState, useCallback, memo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Icon } from "@/components/icon";
import { 
    Sheet, 
    SheetContent, 
    SheetHeader, 
    SheetTitle, 
    SheetTrigger 
} from "@/components/ui/sheet";
import PublicLayout from "@/layouts/public-layout";

interface Property {
    id: number;
    title: string;
    address: string;
    modality: 'rent' | 'sale';
    currency: 'ars' | 'dollar';
    price: string | number;
    amenities: string[];
    cover_image: string;
    user: {
        name: string;
    };
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
    filters?: {
        search?: string;
        modality?: string;
        currency?: string;
        minPrice?: string;
        maxPrice?: string;
        amenities?: string[];
    };
}

// Componente memoizado para evitar re-renders innecesarios
const FilterSidebar = memo(({ 
    filters, 
    selectedAmenities, 
    onSearchChange, 
    onModalityChange, 
    onCurrencyChange, 
    onMinPriceChange, 
    onMaxPriceChange, 
    onAmenityToggle, 
    onApplyFilters, 
    onClearFilters 
}: {
    filters: {
        search: string;
        modality: string;
        currency: string;
        minPrice: string;
        maxPrice: string;
        amenities: string[];
    };
    selectedAmenities: string[];
    onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onModalityChange: (value: string) => void;
    onCurrencyChange: (value: string) => void;
    onMinPriceChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onMaxPriceChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onAmenityToggle: (amenity: string) => void;
    onApplyFilters: () => void;
    onClearFilters: () => void;
}) => {
    const allAmenities = [
        'Piscina', 'Gimnasio', 'Estacionamiento', 'Seguridad 24/7', 'Ascensor',
        'Balcón', 'Jardín', 'Terraza', 'Aire acondicionado', 'Calefacción',
        'Internet', 'Cable', 'Lavandería', 'Cocina equipada', 'Muebles'
    ];

    return (
        <div className="space-y-3 sm:space-y-4 md:space-y-6">
            {/* Búsqueda */}
            <div>
                <h3 className="text-sm sm:text-base md:text-lg font-semibold mb-2 sm:mb-3 text-white">Búsqueda</h3>
                <Input
                    placeholder="Buscar por título o dirección..."
                    value={filters.search}
                    onChange={onSearchChange}
                    onKeyPress={(e) => e.key === 'Enter' && onApplyFilters()}
                    className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 text-sm sm:text-base h-9 sm:h-10"
                />
            </div>

            {/* Modalidad */}
            <div>
                <h3 className="text-sm sm:text-base md:text-lg font-semibold mb-2 sm:mb-3 text-white">Modalidad</h3>
                <Select value={filters.modality} onValueChange={onModalityChange}>
                    <SelectTrigger className="bg-gray-800 border-gray-700 text-white h-9 sm:h-10 text-sm sm:text-base">
                        <SelectValue placeholder="Todas las modalidades" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                        <SelectItem value="all" className="text-white hover:bg-gray-700 text-sm sm:text-base">Todas las modalidades</SelectItem>
                        <SelectItem value="rent" className="text-white hover:bg-gray-700 text-sm sm:text-base">Alquiler</SelectItem>
                        <SelectItem value="sale" className="text-white hover:bg-gray-700 text-sm sm:text-base">Venta</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Moneda */}
            <div>
                <h3 className="text-sm sm:text-base md:text-lg font-semibold mb-2 sm:mb-3 text-white">Moneda</h3>
                <Select value={filters.currency} onValueChange={onCurrencyChange}>
                    <SelectTrigger className="bg-gray-800 border-gray-700 text-white h-9 sm:h-10 text-sm sm:text-base">
                        <SelectValue placeholder="Todas las monedas" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                        <SelectItem value="all" className="text-white hover:bg-gray-700 text-sm sm:text-base">Todas las monedas</SelectItem>
                        <SelectItem value="ars" className="text-white hover:bg-gray-700 text-sm sm:text-base">ARS</SelectItem>
                        <SelectItem value="dollar" className="text-white hover:bg-gray-700 text-sm sm:text-base">USD</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Rango de Precio */}
            <div>
                <h3 className="text-sm sm:text-base md:text-lg font-semibold mb-2 sm:mb-3 text-white">Rango de Precio</h3>
                <div className="space-y-2">
                    <Input
                        placeholder="Precio mínimo"
                        value={filters.minPrice}
                        onChange={onMinPriceChange}
                        type="number"
                        className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 text-sm sm:text-base h-9 sm:h-10"
                    />
                    <Input
                        placeholder="Precio máximo"
                        value={filters.maxPrice}
                        onChange={onMaxPriceChange}
                        type="number"
                        className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 text-sm sm:text-base h-9 sm:h-10"
                    />
                </div>
            </div>

            {/* Amenities */}
            <div>
                <h3 className="text-sm sm:text-base md:text-lg font-semibold mb-2 sm:mb-3 text-white">Amenities</h3>
                <div className="space-y-1.5 sm:space-y-2 sm:max-h-32 md:max-h-48 overflow-y-auto pr-2">
                    {allAmenities.map((amenity) => (
                        <div key={amenity} className="flex items-center space-x-2">
                            <Checkbox
                                id={amenity}
                                checked={selectedAmenities.includes(amenity)}
                                onCheckedChange={() => onAmenityToggle(amenity)}
                                className="border-gray-600 data-[state=checked]:bg-sky-400 data-[state=checked]:border-sky-400"
                            />
                            <label htmlFor={amenity} className="text-xs sm:text-sm text-gray-300 cursor-pointer select-none">{amenity}</label>
                        </div>
                    ))}
                </div>
            </div>

            {/* Botones */}
            <div className="space-y-2 pt-2">
                <Button 
                    onClick={onApplyFilters} 
                    className="w-full bg-sky-400 hover:bg-sky-500 text-sky-900 font-semibold transition-colors h-9 sm:h-10 text-sm sm:text-base"
                >
                    <Icon name="search" className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                    Aplicar Filtros
                </Button>
                <Button 
                    onClick={onClearFilters} 
                    variant="outline" 
                    className="w-full border-sky-400 text-sky-400 hover:bg-sky-400 hover:text-sky-900 transition-colors h-9 sm:h-10 text-sm sm:text-base"
                >
                    <Icon name="x" className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                    Limpiar Filtros
                </Button>
            </div>
        </div>
    );
});

FilterSidebar.displayName = 'FilterSidebar';

export default function PropertiesIndex({ properties, filters: initialFilters = {} }: PropertiesProps) {
    const [filters, setFilters] = useState({
        search: initialFilters.search || '',
        modality: initialFilters.modality || 'all',
        currency: initialFilters.currency || 'all',
        minPrice: initialFilters.minPrice || '',
        maxPrice: initialFilters.maxPrice || '',
        amenities: initialFilters.amenities || [],
    });

    const [selectedAmenities, setSelectedAmenities] = useState<string[]>(initialFilters.amenities || []);
    const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

    // Memoizar las funciones para evitar re-renders innecesarios
    const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setFilters(prev => ({ ...prev, search: e.target.value }));
    }, []);

    const handleModalityChange = useCallback((value: string) => {
        setFilters(prev => ({ ...prev, modality: value }));
    }, []);

    const handleCurrencyChange = useCallback((value: string) => {
        setFilters(prev => ({ ...prev, currency: value }));
    }, []);

    const handleMinPriceChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setFilters(prev => ({ ...prev, minPrice: e.target.value }));
    }, []);

    const handleMaxPriceChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setFilters(prev => ({ ...prev, maxPrice: e.target.value }));
    }, []);

    const handleAmenityToggle = useCallback((amenity: string) => {
        setSelectedAmenities(prev => 
            prev.includes(amenity) 
                ? prev.filter(a => a !== amenity)
                : [...prev, amenity]
        );
    }, []);

    const getModalityLabel = (modality: string) => {
        return modality === 'rent' ? 'Alquiler' : 'Venta';
    };

    const formatPrice = (price: string | number, currency: string) => {
        const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
        
        if (isNaN(numericPrice)) {
            return '$0';
        }
        
        if (currency === 'ars') {
            return `$${numericPrice.toLocaleString('es-AR')} ARS`;
        }
        return `$${numericPrice.toFixed(2)} USD`;
    };

    const applyFilters = () => {
        const queryParams = new URLSearchParams();
        
        if (filters.search) queryParams.set('search', filters.search);
        if (filters.modality && filters.modality !== 'all') queryParams.set('modality', filters.modality);
        if (filters.currency && filters.currency !== 'all') queryParams.set('currency', filters.currency);
        if (filters.minPrice) queryParams.set('minPrice', filters.minPrice);
        if (filters.maxPrice) queryParams.set('maxPrice', filters.maxPrice);
        if (selectedAmenities.length > 0) {
            selectedAmenities.forEach(amenity => {
                queryParams.append('amenities[]', amenity);
            });
        }

        const queryString = queryParams.toString();
        
        if (queryString) {
            const params = { 
                search: filters.search || undefined,
                modality: filters.modality !== 'all' ? filters.modality : undefined,
                currency: filters.currency !== 'all' ? filters.currency : undefined,
                minPrice: filters.minPrice || undefined,
                maxPrice: filters.maxPrice || undefined,
                amenities: selectedAmenities.length > 0 ? selectedAmenities : undefined,
            };
            router.get('/public/properties', params);
        } else {
            router.get('/public/properties');
        }
    };

    const clearFilters = () => {
        setFilters({
            search: '',
            modality: 'all',
            currency: 'all',
            minPrice: '',
            maxPrice: '',
            amenities: [],
        });
        setSelectedAmenities([]);
        router.get('/public/properties');
    };

    return (
        <PublicLayout>
            <Head title="Propiedades - Urbani" />
            
            <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4 md:py-6 lg:py-8">
                {/* Page Header */}
                <div className="mb-4 sm:mb-6 md:mb-8">
                    <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2">Propiedades</h1>
                    <p className="text-xs sm:text-sm md:text-base text-gray-300">Encuentra tu propiedad ideal con nuestros filtros avanzados</p>
                </div>

                <div className="flex flex-col lg:flex-row gap-3 sm:gap-4 md:gap-6 lg:gap-8">
                    {/* Mobile Filters Button - Solo visible en mobile y tablet */}
                    <div className="lg:hidden order-1">
                        <Sheet open={isMobileFiltersOpen} onOpenChange={setIsMobileFiltersOpen}>
                            <SheetTrigger asChild>
                                <Button variant="outline" className="w-full border-sky-400 text-sky-400 hover:bg-sky-400 hover:text-sky-900 transition-colors text-sm sm:text-base">
                                    <Icon name="filter" className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                                    Filtros de Búsqueda
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="w-full sm:w-80 bg-gray-900 border-gray-800 overflow-y-auto">
                                <SheetHeader className="sticky top-0 bg-gray-900 z-10 pb-4 border-b border-gray-800">
                                    <div className="flex items-center justify-between">
                                        <SheetTitle className="text-white text-base sm:text-lg">Filtros de Búsqueda</SheetTitle>
                                        <Button 
                                            variant="ghost" 
                                            size="sm" 
                                            onClick={() => setIsMobileFiltersOpen(false)}
                                            className="text-gray-400 hover:text-white hover:bg-gray-800 p-2"
                                        >
                                            <Icon name="x" className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </SheetHeader>
                                <div className="mt-4 sm:mt-6 p-6">
                                    <FilterSidebar 
                                        filters={filters}
                                        selectedAmenities={selectedAmenities}
                                        onSearchChange={handleSearchChange}
                                        onModalityChange={handleModalityChange}
                                        onCurrencyChange={handleCurrencyChange}
                                        onMinPriceChange={handleMinPriceChange}
                                        onMaxPriceChange={handleMaxPriceChange}
                                        onAmenityToggle={handleAmenityToggle}
                                        onApplyFilters={() => {
                                            applyFilters();
                                            setIsMobileFiltersOpen(false);
                                        }}
                                        onClearFilters={clearFilters}
                                    />
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>

                    {/* Desktop Filters - Solo visible en desktop y laptop */}
                    <div className="hidden lg:block w-72 xl:w-80 flex-shrink-0 order-2">
                        <div className="bg-gray-900 p-4 xl:p-6 rounded-lg border border-gray-800 shadow-sm sticky top-8">
                            <FilterSidebar 
                                filters={filters}
                                selectedAmenities={selectedAmenities}
                                onSearchChange={handleSearchChange}
                                onModalityChange={handleModalityChange}
                                onCurrencyChange={handleCurrencyChange}
                                onMinPriceChange={handleMinPriceChange}
                                onMaxPriceChange={handleMaxPriceChange}
                                onAmenityToggle={handleAmenityToggle}
                                onApplyFilters={applyFilters}
                                onClearFilters={clearFilters}
                            />
                        </div>
                    </div>

                    {/* Properties Grid */}
                    <div className="flex-1 min-w-0 order-3">
                        {properties.data.length > 0 ? (
                            <>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
                                    {properties.data.map((property) => (
                                        <Card key={property.id} className="overflow-hidden hover:shadow-lg transition-shadow bg-gray-900 border-gray-800 pt-0">
                                            <div className="aspect-video overflow-hidden">
                                                <img
                                                    src={`/storage/${property.cover_image}`}
                                                    alt={property.title}
                                                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                                />
                                            </div>
                                            <CardContent className="p-3 sm:p-4 md:p-5 lg:p-6">
                                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                                                    <Badge variant={property.modality === 'rent' ? 'default' : 'secondary'} className="self-start text-xs">
                                                        {getModalityLabel(property.modality)}
                                                    </Badge>
                                                    <div className="text-left sm:text-right">
                                                        <span className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-sky-400">
                                                            {formatPrice(property.price, property.currency)}
                                                        </span>
                                                        <div className="text-xs text-gray-400">
                                                            {property.currency === 'ars' ? 'Pesos Argentinos' : 'Dólares'}
                                                        </div>
                                                    </div>
                                                </div>
                                                <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-semibold text-white mb-2 line-clamp-2">
                                                    {property.title}
                                                </h3>
                                                <p className="text-gray-300 mb-3 sm:mb-4 text-xs sm:text-sm">
                                                    {property.address}
                                                </p>
                                                <div className="flex flex-wrap gap-1 sm:gap-2 mb-3 sm:mb-4">
                                                    {property.amenities.slice(0, 3).map((amenity, index) => (
                                                        <Badge key={index} variant="outline" className="text-xs border-gray-600 text-gray-300">
                                                            {amenity}
                                                        </Badge>
                                                    ))}
                                                    {property.amenities.length > 3 && (
                                                        <Badge variant="outline" className="text-xs border-gray-600 text-gray-300">
                                                            +{property.amenities.length - 3}
                                                        </Badge>
                                                    )}
                                                </div>
                                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs sm:text-sm text-gray-400 mb-3 sm:mb-4">
                                                    <span className="truncate">Publicado por {property.user.name}</span>
                                                    <span>{new Date(property.created_at).toLocaleDateString('es-ES')}</span>
                                                </div>
                                                <Link href={`/public/properties/${property.id}`}>
                                                    <Button className="w-full bg-sky-400 hover:bg-sky-500 text-sky-900 font-semibold transition-colors text-xs sm:text-sm md:text-base">
                                                        Ver Detalles
                                                    </Button>
                                                </Link>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>

                                {/* Pagination */}
                                {properties.links.length > 3 && (
                                    <div className="mt-6 sm:mt-8 flex justify-center">
                                        <nav className="flex flex-wrap justify-center gap-1 sm:gap-2">
                                            {properties.links.map((link, index) => {
                                                // Determinar si es un enlace de navegación (anterior/siguiente)
                                                const isNavigationLink = link.label === 'pagination.previous' || link.label === 'pagination.next';
                                                
                                                // Renderizar icono para enlaces de navegación
                                                if (isNavigationLink) {
                                                    const iconName = link.label === 'pagination.previous' ? 'arrow-left' : 'arrow-right';
                                                    return (
                                                        <Link
                                                            key={index}
                                                            href={link.url || '#'}
                                                            className={`px-2 sm:px-3 py-1 sm:py-2 rounded-md text-xs sm:text-sm font-medium transition-colors flex items-center justify-center ${
                                                                link.url
                                                                    ? 'bg-gray-900 text-gray-300 hover:bg-gray-800 border border-gray-700'
                                                                    : 'bg-gray-800 text-gray-500 border border-gray-700 cursor-not-allowed'
                                                            }`}
                                                            aria-label={link.label === 'pagination.previous' ? 'Página anterior' : 'Página siguiente'}
                                                        >
                                                            <Icon name={iconName} className="h-4 w-4" />
                                                        </Link>
                                                    );
                                                }
                                                
                                                // Renderizar números de página normalmente
                                                return (
                                                    <Link
                                                        key={index}
                                                        href={link.url || '#'}
                                                        className={`px-2 sm:px-3 py-1 sm:py-2 rounded-md text-xs sm:text-sm font-medium transition-colors ${
                                                            link.active
                                                                ? 'bg-sky-400 text-sky-900'
                                                                : 'bg-gray-900 text-gray-300 hover:bg-gray-800 border border-gray-700'
                                                        }`}
                                                    >
                                                        {link.label}
                                                    </Link>
                                                );
                                            })}
                                        </nav>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="text-center py-8 sm:py-12">
                                <Icon name="search" className="mx-auto h-8 w-8 sm:h-12 sm:w-12 text-gray-500 mb-4" />
                                <h3 className="text-base sm:text-lg font-medium text-white mb-2">No se encontraron propiedades</h3>
                                <p className="text-sm sm:text-base text-gray-300 mb-4 sm:mb-6 px-4">
                                    Intenta ajustar los filtros de búsqueda o contacta con nosotros para más información.
                                </p>
                                <Button onClick={clearFilters} variant="outline" className="border-sky-400 text-sky-400 hover:bg-sky-400 hover:text-sky-900 transition-colors">
                                    Limpiar Filtros
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}