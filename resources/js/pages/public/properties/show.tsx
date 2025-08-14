import { Head, Link } from "@inertiajs/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@/components/icon";
import { 
    Dialog, 
    DialogContent, 
    DialogTrigger 
} from "@/components/ui/dialog";
import PublicLayout from "@/layouts/public-layout";
import { Phone } from "lucide-react";

interface PropertyImage {
    id: number;
    image_path: string;
    order: number;
}

interface RelatedProperty {
    id: number;
    title: string;
    address: string;
    modality: 'rent' | 'sale';
    currency: 'ars' | 'dollar';
    price: string | number;
    amenities: string[];
    cover_image: string;
}

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
        email?: string;
    };
    images: PropertyImage[];
    created_at: string;
    whatsapp?: string;
    facebook_messenger?: string;
    contact_email?: string;
    whatsapp_message?: string;
}

interface PropertyShowProps {
    property: Property;
    relatedProperties: RelatedProperty[];
}

export default function PropertyShow({ property, relatedProperties }: PropertyShowProps) {
    const [selectedImage, setSelectedImage] = useState(property.cover_image);
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);

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

    const scrollToContact = () => {
        const contactSection = document.querySelector('[data-contact-section]');
        if (contactSection) {
            contactSection.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
        }
    };

    const allImages = [property.cover_image, ...property.images.map(img => img.image_path)];

    return (
        <PublicLayout>
            <Head title={`${property.title} - Urbani`} />
            
            {/* Botón flotante para móvil */}
            <div className="lg:hidden fixed bottom-20 right-6 z-50">
                <Button
                    onClick={scrollToContact}
                    className="bg-green-500 hover:bg-green-600 text-white rounded-full w-16 h-16 shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center"
                    aria-label="Ir a información de contacto"
                >
                    <Phone className="!w-6 !h-6" />
                </Button>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Breadcrumbs */}
                <nav className="flex mb-8" aria-label="Breadcrumb">
                    <ol className="inline-flex items-center space-x-1 md:space-x-3">
                        <li className="inline-flex items-center">
                            <Link href="/" className="inline-flex items-center text-sm font-medium text-gray-300 hover:text-sky-400 transition-colors">
                                <Icon name="home" className="w-4 h-4 mr-2" />
                                Inicio
                            </Link>
                        </li>
                        <li>
                            <div className="flex items-center">
                                <Icon name="chevron-right" className="w-4 h-4 text-gray-500 mx-2" />
                                <Link href="/public/properties" className="text-sm font-medium text-gray-300 hover:text-sky-400 transition-colors">
                                    Propiedades
                                </Link>
                            </div>
                        </li>
                        <li aria-current="page">
                            <div className="flex items-center">
                                <Icon name="chevron-right" className="w-4 h-4 text-gray-500 mx-2" />
                                <span className="text-sm font-medium text-gray-400">{property.title}</span>
                            </div>
                        </li>
                    </ol>
                </nav>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        {/* Property Header */}
                        <div className="mb-8">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h1 className="text-3xl font-bold text-white mb-2">{property.title}</h1>
                                    <p className="text-lg text-gray-300 mb-4">{property.address}</p>
                                </div>
                                <div className="text-right">
                                    <div className="text-3xl font-bold text-sky-400 mb-2">
                                        {formatPrice(property.price, property.currency)}
                                    </div>
                                    <Badge variant={property.modality === 'rent' ? 'default' : 'secondary'} className="text-lg px-4 py-2">
                                        {getModalityLabel(property.modality)}
                                    </Badge>
                                </div>
                            </div>
                            
                            <div className="flex items-center text-sm text-gray-400">
                                <Icon name="user" className="w-4 h-4 mr-2" />
                                <span>Publicado por {property.user.name}</span>
                                <span className="mx-2">•</span>
                                <span>{new Date(property.created_at).toLocaleDateString('es-ES')}</span>
                            </div>
                        </div>

                        {/* Image Gallery */}
                        <div className="mb-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Main Image */}
                                <div className="md:col-span-2">
                                    <Dialog open={isImageModalOpen} onOpenChange={setIsImageModalOpen}>
                                        <DialogTrigger asChild>
                                            <div className="aspect-video rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity">
                                                <img
                                                    src={`/storage/${selectedImage}`}
                                                    alt={property.title}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        </DialogTrigger>
                                        <DialogContent className="max-w-4xl bg-gray-900 border-gray-800">
                                            <img
                                                src={`/storage/${selectedImage}`}
                                                alt={property.title}
                                                className="w-full h-auto"
                                            />
                                        </DialogContent>
                                    </Dialog>
                                </div>
                                
                                {/* Thumbnail Images */}
                                {allImages.slice(1, 5).map((image, index) => (
                                    <div key={index} className="aspect-video rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity">
                                        <img
                                            src={`/storage/${image}`}
                                            alt={`${property.title} - Imagen ${index + 2}`}
                                            className="w-full h-full object-cover"
                                            onClick={() => setSelectedImage(image)}
                                        />
                                    </div>
                                ))}
                            </div>
                            
                            {/* Image Navigation */}
                            {allImages.length > 1 && (
                                <div className="flex space-x-2 mt-4 overflow-x-auto">
                                    {allImages.map((image, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setSelectedImage(image)}
                                            className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                                                selectedImage === image ? 'border-sky-400' : 'border-gray-600'
                                            }`}
                                        >
                                            <img
                                                src={`/storage/${image}`}
                                                alt={`${property.title} - Thumbnail ${index + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Property Details */}
                        <Card className="mb-8 bg-gray-900 border-gray-800">
                            <CardContent className="p-6">
                                <h2 className="text-2xl font-bold text-white mb-6">Detalles de la Propiedad</h2>
                                
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <h3 className="text-lg font-semibold text-white mb-3">Información General</h3>
                                        <div className="space-y-2 text-gray-300">
                                            <div className="flex justify-between">
                                                <span>Modalidad:</span>
                                                <span className="font-medium">{getModalityLabel(property.modality)}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Precio:</span>
                                                <span className="font-medium">{formatPrice(property.price, property.currency)}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Moneda:</span>
                                                <span className="font-medium">{property.currency === 'ars' ? 'Pesos Argentinos' : 'Dólares'}</span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <h3 className="text-lg font-semibold text-white mb-3">Ubicación</h3>
                                        <div className="space-y-2 text-gray-300">
                                            <div className="flex items-start">
                                                <Icon name="map-pin" className="w-4 h-4 mr-2 mt-0.5 text-gray-400" />
                                                <span>{property.address}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Amenities */}
                        <Card className="mb-8 bg-gray-900 border-gray-800">
                            <CardContent className="p-6">
                                <h2 className="text-2xl font-bold text-white mb-6">Amenities</h2>
                                <div className="flex flex-wrap gap-3">
                                    {property.amenities.map((amenity, index) => (
                                        <Badge key={index} variant="outline" className="text-sm px-3 py-1 border-gray-600 text-gray-300">
                                            {amenity}
                                        </Badge>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Contact Information */}
                        <Card className="bg-gray-900 border-gray-800" data-contact-section>
                            <CardContent className="p-6">
                                <h2 className="text-2xl font-bold text-white mb-6">Información de Contacto</h2>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <h3 className="text-lg font-semibold text-white mb-3">Propietario</h3>
                                        <div className="space-y-2 text-gray-300">
                                            <div className="flex items-center">
                                                <Icon name="user" className="w-4 h-4 mr-2 text-gray-400" />
                                                <span>{property.user.name}</span>
                                            </div>
                                            {property.contact_email && (
                                                <div className="flex items-center">
                                                    <Icon name="mail" className="w-4 h-4 mr-2 text-gray-400" />
                                                    <span>{property.contact_email}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <h3 className="text-lg font-semibold text-white mb-3">Métodos de Contacto</h3>
                                        <div className="space-y-3">
                                            {property.whatsapp && (
                                                <Button 
                                                    className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold transition-colors"
                                                    onClick={() => {
                                                        const message = property.whatsapp_message || "Hola! Me interesa esta propiedad. ¿Podrías darme más información?";
                                                        const whatsappUrl = `https://wa.me/${(property.whatsapp ?? '').replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
                                                        window.open(whatsappUrl, '_blank');
                                                    }}
                                                >
                                                    <Icon name="message-circle" className="mr-2 h-4 w-4" />
                                                    WhatsApp
                                                </Button>
                                            )}
                                            
                                            {property.facebook_messenger && (
                                                <Button 
                                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors"
                                                    onClick={() => window.open(property.facebook_messenger, '_blank')}
                                                >
                                                    <Icon name="message-square" className="mr-2 h-4 w-4" />
                                                    Facebook Messenger
                                                </Button>
                                            )}
                                            
                                            {property.contact_email && (
                                                <Button 
                                                    variant="outline" 
                                                    className="w-full border-sky-400 text-sky-400 hover:bg-sky-400 hover:text-sky-900 transition-colors"
                                                    onClick={() => {
                                                        const subject = `Consulta sobre: ${property.title}`;
                                                        const body = property.whatsapp_message || "Hola! Me interesa esta propiedad. ¿Podrías darme más información sobre disponibilidad, horarios de visita y cualquier detalle adicional que consideres importante?";
                                                        const mailtoUrl = `mailto:${property.contact_email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                                                        window.open(mailtoUrl);
                                                    }}
                                                >
                                                    <Icon name="mail" className="mr-2 h-4 w-4" />
                                                    Enviar Email
                                                </Button>
                                            )}
                                            
                                            {!property.whatsapp && !property.facebook_messenger && !property.contact_email && (
                                                <div className="text-center py-4">
                                                    <Icon name="alert-circle" className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                                                    <p className="text-gray-400 text-sm">
                                                        No hay métodos de contacto disponibles para esta propiedad.
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        {/* Quick Contact */}
                        <Card className="hidden lg:block mb-8 sticky top-8 bg-gray-900 border-gray-800">
                            <CardContent className="p-6">
                                <h3 className="text-xl font-bold text-white mb-4">¿Te interesa esta propiedad?</h3>
                                
                                {/* Métodos de Contacto Disponibles */}
                                <div className="space-y-3 mb-6">
                                    {property.whatsapp && (
                                        <Button 
                                            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold transition-colors"
                                            onClick={() => {
                                                const message = property.whatsapp_message || "Hola! Me interesa esta propiedad. ¿Podrías darme más información?";
                                                const whatsappUrl = `https://wa.me/${(property.whatsapp ?? '').replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
                                                window.open(whatsappUrl, '_blank');
                                            }}
                                        >
                                            <Icon name="message-circle" className="mr-2 h-4 w-4" />
                                            Contactar por WhatsApp
                                        </Button>
                                    )}
                                    
                                    {property.facebook_messenger && (
                                        <Button 
                                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors"
                                            onClick={() => window.open(property.facebook_messenger, '_blank')}
                                        >
                                            <Icon name="message-square" className="mr-2 h-4 w-4" />
                                            Contactar por Messenger
                                        </Button>
                                    )}
                                    
                                    {property.contact_email && (
                                        <Button 
                                            variant="outline" 
                                            className="w-full border-sky-400 text-sky-400 hover:bg-sky-400 hover:text-sky-900 transition-colors"
                                            onClick={() => {
                                                const subject = `Consulta sobre: ${property.title}`;
                                                const body = property.whatsapp_message || "Hola! Me interesa esta propiedad. ¿Podrías darme más información sobre disponibilidad, horarios de visita y cualquier detalle adicional que consideres importante?";
                                                const mailtoUrl = `mailto:${property.contact_email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                                                window.open(mailtoUrl);
                                            }}
                                        >
                                            <Icon name="mail" className="mr-2 h-4 w-4" />
                                            Enviar Email
                                        </Button>
                                    )}
                                    
                                    {!property.whatsapp && !property.facebook_messenger && !property.contact_email && (
                                        <div className="text-center py-4">
                                            <Icon name="alert-circle" className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                                            <p className="text-gray-400 text-sm">
                                                No hay métodos de contacto disponibles para esta propiedad.
                                            </p>
                                        </div>
                                    )}
                                </div>
                                
                                {/* Información del Precio */}
                                <div className="pt-6 border-t border-gray-700">
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-sky-400 mb-2">
                                            {formatPrice(property.price, property.currency)}
                                        </div>
                                        <div className="text-sm text-gray-400">
                                            {property.modality === 'rent' ? 'por mes' : 'precio de venta'}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Related Properties */}
                        {relatedProperties.length > 0 && (
                            <Card className="bg-gray-900 border-gray-800">
                                <CardContent className="p-6">
                                    <h3 className="text-xl font-bold text-white mb-4">Propiedades Similares</h3>
                                    <div className="space-y-4">
                                        {relatedProperties.map((relatedProperty) => (
                                            <Link 
                                                key={relatedProperty.id} 
                                                href={`/public/properties/${relatedProperty.id}`}
                                                className="block hover:bg-gray-800 rounded-lg p-3 transition-colors"
                                            >
                                                <div className="flex space-x-3">
                                                    <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                                                        <img
                                                            src={`/storage/${relatedProperty.cover_image}`}
                                                            alt={relatedProperty.title}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="font-semibold text-white text-sm line-clamp-2 mb-1">
                                                            {relatedProperty.title}
                                                        </h4>
                                                        <p className="text-gray-400 text-xs mb-2">
                                                            {relatedProperty.title}
                                                        </p>
                                                        <div className="flex items-center justify-between">
                                                            <Badge variant={relatedProperty.modality === 'rent' ? 'default' : 'secondary'} className="text-xs">
                                                                {getModalityLabel(relatedProperty.modality)}
                                                            </Badge>
                                                            <span className="font-semibold text-sky-400 text-sm">
                                                                {formatPrice(relatedProperty.price, relatedProperty.currency)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
