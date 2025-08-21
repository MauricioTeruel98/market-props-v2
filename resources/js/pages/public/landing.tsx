import { Head, Link } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@/components/icon";
import { Map, MapLocation } from "@/components/ui/map";
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
}

interface LandingProps {
    featuredProperties?: Property[];
    mapProperties?: MapLocation[];
}

export default function Landing({ featuredProperties = [], mapProperties = [] }: LandingProps) {
    const getModalityLabel = (modality: string) => {
        return modality === 'rent' ? 'Alquiler' : 'Venta';
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
        <PublicLayout currentPage="home">
            <Head title="Urbani - Encuentra tu propiedad ideal" />
            
            {/* Hero Section */}
            <section className="bg-gradient-to-r from-sky-400 to-blue-500 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-6xl font-bold mb-6">
                            Encuentra tu casa o depto ideal
                        </h1>
                        <p className="text-xl md:text-2xl mb-8 text-sky-100">
                            Miles de propiedades en alquiler y venta en toda la ciudad
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="/public/properties">
                                <Button size="lg" className="bg-white text-sky-600 hover:bg-sky-50 transition-colors">
                                    <Icon name="search" className="mr-2 h-5 w-5" />
                                    Buscar Propiedades
                                </Button>
                            </Link>
                            <Link href="/register">
                                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-sky-600 transition-colors">
                                    <Icon name="user-plus" className="mr-2 h-5 w-5" />
                                    Registrarse
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            {/* <section className="py-20 bg-gray-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-white mb-4">
                            ¿Por qué elegir Urbani?
                        </h2>
                        <p className="text-xl text-gray-300">
                            Te ofrecemos la mejor experiencia para encontrar tu hogar ideal
                        </p>
                    </div>
                    
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="bg-sky-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                                <Icon name="search" className="h-8 w-8 text-sky-600" />
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-2">Búsqueda Inteligente</h3>
                            <p className="text-gray-300">Filtros avanzados para encontrar exactamente lo que buscas</p>
                        </div>
                        
                        <div className="text-center">
                            <div className="bg-sky-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                                <Icon name="shield" className="h-8 w-8 text-sky-600" />
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-2">Propiedades Verificadas</h3>
                            <p className="text-gray-300">Todas nuestras propiedades están validadas y verificadas</p>
                        </div>
                        
                        <div className="text-center">
                            <div className="bg-sky-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                                <Icon name="phone" className="h-8 w-8 text-sky-600" />
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-2">Atención Personalizada</h3>
                            <p className="text-gray-300">Contacto directo con propietarios y asesores</p>
                        </div>
                    </div>
                </div>
            </section> */}

            {/* Mapa de Propiedades */}
            {mapProperties.length > 0 && (
                <section className="py-20 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">
                                Explora por el Mapa
                            </h2>
                            <p className="text-xl text-gray-600">
                                Visualiza todas las propiedades disponibles en su ubicación exacta
                            </p>
                        </div>
                        
                        <div className="bg-gray-50 rounded-xl p-6">
                            <Map
                                locations={mapProperties}
                                center={[-26.8241, -65.2226]} // San Miguel de Tucumán
                                zoom={12}
                                height="500px"
                                interactive={true}
                                onLocationSelect={(location) => {
                                    // Redirigir a la página de la propiedad
                                    if (location.id) {
                                        window.location.href = `/public/properties/${location.id}`;
                                    }
                                }}
                            />
                        </div>
                        
                        <div className="text-center mt-8">
                            <p className="text-gray-600 mb-4">
                                Haz clic en cualquier marcador para ver los detalles de la propiedad
                            </p>
                            <Link href="/public/properties">
                                <Button size="lg" variant="outline" className="border-sky-400 text-sky-400 hover:bg-sky-400 hover:text-sky-50 transition-colors">
                                    Ver Todas las Propiedades
                                </Button>
                            </Link>
                        </div>
                    </div>
                </section>
            )}

            {/* Featured Properties */}
            {featuredProperties.length > 0 && (
                <section className="py-20 bg-black">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-bold text-white mb-4">
                                Propiedades Destacadas
                            </h2>
                            <p className="text-xl text-gray-300">
                                Descubre algunas de nuestras mejores ofertas
                            </p>
                        </div>
                        
                        <div className="grid md:grid-cols-3 gap-8">
                            {featuredProperties.map((property) => (
                                <Card key={property.id} className="overflow-hidden hover:shadow-lg transition-shadow bg-gray-900 border-gray-800 pt-0">
                                    <div className="aspect-video overflow-hidden">
                                        <img
                                            src={`/storage/${property.cover_image}`}
                                            alt={property.title}
                                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                        />
                                    </div>
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between mb-2">
                                            <Badge variant={property.modality === 'rent' ? 'default' : 'secondary'}>
                                                {getModalityLabel(property.modality)}
                                            </Badge>
                                            <span className="text-2xl font-bold text-sky-400">
                                                {formatPrice(property.price, property.currency)}
                                            </span>
                                        </div>
                                        <h3 className="text-xl font-semibold text-white mb-2">
                                            {property.title}
                                        </h3>
                                        <p className="text-gray-300 mb-4">
                                            {property.address}
                                        </p>
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {property.amenities.slice(0, 3).map((amenity, index) => (
                                                <Badge key={index} variant="outline" className="text-xs border-gray-600 text-gray-300">
                                                    {amenity}
                                                </Badge>
                                            ))}
                                        </div>
                                        <Link href={`/public/properties/${property.id}`}>
                                            <Button className="w-full bg-sky-400 hover:bg-sky-500 text-sky-900 font-semibold transition-colors">
                                                Ver Detalles
                                            </Button>
                                        </Link>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                        
                        <div className="text-center mt-12">
                            <Link href="/public/properties">
                                <Button size="lg" variant="outline" className="border-sky-400 text-sky-400 hover:bg-sky-400 hover:text-sky-900 transition-colors">
                                    Ver Todas las Propiedades
                                </Button>
                            </Link>
                        </div>
                    </div>
                </section>
            )}

            {/* CTA Section */}
            <section className="py-20 bg-gray-900 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold mb-4">
                        ¿Tienes una propiedad para alquilar o vender?
                    </h2>
                    <p className="text-xl text-gray-300 mb-8">
                        Únete a nuestra plataforma y llega a miles de potenciales inquilinos y compradores
                    </p>
                    <Link href="/register">
                        <Button size="lg" className="bg-sky-400 hover:bg-sky-500 text-sky-900 font-semibold transition-colors">
                            <Icon name="plus" className="mr-2 h-5 w-5" />
                            Publicar Propiedad
                        </Button>
                    </Link>
                </div>
            </section>
        </PublicLayout>
    );
}
