import AppLayout from "@/layouts/app-layout";
import { type BreadcrumbItem } from "@/types";
import { Head, Link, useForm } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Icon } from "@/components/icon";
import { PropertyMapEditor } from "@/components/ui/property-map-editor";
import { ImageValidator, useImageValidation } from "@/components/ui/image-validator";
import { useState, useEffect, useRef } from "react";
import { Textarea } from "@/components/ui/textarea";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Propiedades',
        href: '/admin/properties',
    },
    {
        title: 'Editar',
        href: '#',
    },
];

const amenitiesList = [
    'Aire acondicionado',
    'Calefacción',
    'WiFi',
    'Estacionamiento',
    'Balcón',
    'Terraza',
    'Piscina',
    'Gimnasio',
    'Seguridad 24/7',
    'Ascensor',
    'Jardín',
    'Cocina equipada',
    'Lavadora',
    'Secadora',
    'Mascotas permitidas',
];

interface Property {
    id: number;
    title: string;
    address: string;
    latitude?: number | null;
    longitude?: number | null;
    modality: 'rent' | 'sale';
    currency: 'ars' | 'dollar';
    price: number;
    status: 'available' | 'unavailable';
    amenities: string[];
    cover_image: string;
    images: Array<{
        id: number;
        image_path: string;
    }>;
    whatsapp?: string;
    facebook_messenger?: string;
    contact_email?: string;
    whatsapp_message?: string;
}

interface EditPropertyProps {
    property: Property;
    user: {
        whatsapp?: string;
        facebook?: string;
        facebook_messenger?: string;
        email?: string;
    };
}

export default function EditProperty({ property, user }: EditPropertyProps) {
    const [coverPreview, setCoverPreview] = useState<string | null>(null);
    const [additionalPreviews, setAdditionalPreviews] = useState<string[]>([]);
    const [existingImages, setExistingImages] = useState(property.images);
    const [isLoadingPreviews, setIsLoadingPreviews] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Hook para validación de imágenes
    const { validateFiles: validateCoverImage } = useImageValidation(5120);
    const { validateFiles: validateAdditionalImages } = useImageValidation(5120);

    const { data, setData, post, processing, errors } = useForm({
        title: property.title,
        address: property.address,
        latitude: property.latitude?.toString() || '',
        longitude: property.longitude?.toString() || '',
        modality: property.modality,
        currency: property.currency,
        price: property.price.toString(),
        status: property.status,
        amenities: property.amenities,
        cover_image: null as File | null,
        additional_images: [] as File[],
        whatsapp: property.whatsapp || '',
        facebook_messenger: property.facebook_messenger || '',
        contact_email: property.contact_email || '',
        whatsapp_message: property.whatsapp_message || '',
        _method: 'PUT',
    });

    useEffect(() => {
        setExistingImages(property.images);
    }, [property.images]);

    const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validar la imagen antes de procesarla
            const validation = validateCoverImage([file]);
            if (!validation.isValid) {
                // Si hay errores de validación, no procesar la imagen
                e.target.value = '';
                return;
            }

            setData('cover_image', file);
            const reader = new FileReader();
            reader.onload = (e) => setCoverPreview(e.target?.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleAdditionalImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        const totalImages = existingImages.length + data.additional_images.length + files.length;

        if (totalImages > 20) {
            alert(`Máximo 20 imágenes adicionales permitidas en total. Ya tienes ${existingImages.length + data.additional_images.length} y estás intentando agregar ${files.length}.`);
            return;
        }

        // Validar las nuevas imágenes antes de procesarlas
        const validation = validateAdditionalImages(files);
        if (!validation.isValid) {
            // Si hay errores de validación, no procesar las imágenes
            e.target.value = '';
            return;
        }

        // Filtrar solo las imágenes válidas
        const validFiles = files.filter(file => {
            const fileSizeKB = file.size / 1024;
            return file.type.startsWith('image/') && fileSizeKB <= 5120;
        });

        if (validFiles.length !== files.length) {
            const invalidCount = files.length - validFiles.length;
            alert(`${invalidCount} imagen(es) no cumplen con los requisitos y no serán procesadas.`);
        }

        // Agregar solo las imágenes válidas
        const newFiles = [...data.additional_images, ...validFiles];
        setData('additional_images', newFiles);

        // Mostrar indicador de carga
        setIsLoadingPreviews(true);

        // Generar previews solo para las nuevas imágenes
        const newPreviews = files.map(file => {
            return new Promise<string>((resolve, reject) => {
                // Validar que sea una imagen
                if (!file.type.startsWith('image/')) {
                    reject(new Error('El archivo no es una imagen válida'));
                    return;
                }

                const reader = new FileReader();

                reader.onload = (e) => {
                    if (e.target?.result && typeof e.target.result === 'string') {
                        resolve(e.target.result);
                    } else {
                        reject(new Error('No se pudo generar la previsualización'));
                    }
                };

                reader.onerror = () => {
                    reject(new Error(`Error al leer el archivo: ${file.name}`));
                };

                reader.onabort = () => {
                    reject(new Error('Lectura del archivo cancelada'));
                };

                try {
                    reader.readAsDataURL(file);
                } catch {
                    reject(new Error(`Error al procesar el archivo: ${file.name}`));
                }
            });
        });

        Promise.all(newPreviews)
            .then(newPreviewUrls => {
                setAdditionalPreviews(prev => [...prev, ...newPreviewUrls]);
                setIsLoadingPreviews(false);
            })
            .catch(error => {
                console.error('Error al generar previews:', error);
                alert(`Error al generar las previsualizaciones: ${error.message}`);
                setIsLoadingPreviews(false);
            });

        // Limpiar el input para permitir seleccionar el mismo archivo nuevamente
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleAmenityChange = (amenity: string, checked: boolean) => {
        if (checked) {
            setData('amenities', [...data.amenities, amenity]);
        } else {
            setData('amenities', data.amenities.filter(a => a !== amenity));
        }
    };

    const handleLocationChange = (latitude: number | null, longitude: number | null) => {
        setData('latitude', latitude?.toString() || '');
        setData('longitude', longitude?.toString() || '');
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Limpiar coordenadas vacías antes de enviar
        const formData = { ...data };
        if (formData.latitude === '') {
            formData.latitude = '';
        }
        if (formData.longitude === '') {
            formData.longitude = '';
        }

        // Actualizar el formulario con los datos limpios
        setData('latitude', formData.latitude);
        setData('longitude', formData.longitude);

        // Enviar el formulario
        post(`/admin/properties/${property.id}`);
    };

    const removeAdditionalImage = (index: number) => {
        const newFiles = data.additional_images.filter((_, i) => i !== index);
        const newPreviews = additionalPreviews.filter((_, i) => i !== index);
        setData('additional_images', newFiles);
        setAdditionalPreviews(newPreviews);
    };

    const removeExistingImage = async (imageId: number) => {
        try {
            // Hacer llamada AJAX para eliminar la imagen del servidor
            const response = await fetch(`/admin/properties/${property.id}/images/${imageId}`, {
                method: 'DELETE',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                    'Accept': 'application/json',
                },
            });

            if (response.ok) {
                // Actualizar estado local
                setExistingImages(existingImages.filter(img => img.id !== imageId));
            } else {
                console.error('Error al eliminar imagen');
                alert('Error al eliminar la imagen');
            }
        } catch (error) {
            console.error('Error al eliminar imagen:', error);
            alert('Error al eliminar la imagen');
        }
    };

    const openFileSelector = () => {
        fileInputRef.current?.click();
    };

    const getRemainingImages = () => {
        return Math.max(0, 20 - (existingImages.length + data.additional_images.length));
    };

    // Función para convertir URL de Facebook a Messenger
    const convertFacebookToMessenger = (facebookUrl: string): string => {
        if (!facebookUrl) return '';
        
        // Extraer el nombre de usuario de la URL de Facebook
        const match = facebookUrl.match(/facebook\.com\/([^/?]+)/);
        if (match) {
            const username = match[1].split('?')[0]; // Remover parámetros adicionales
            return `https://m.me/${username}`;
        }
        
        return facebookUrl; // Si no se puede convertir, devolver la URL original
    };

    // Función para regenerar URL de Messenger
    const regenerateMessengerUrl = () => {
        if (user.facebook) {
            const messengerUrl = convertFacebookToMessenger(user.facebook);
            setData('facebook_messenger', messengerUrl);
        }
    };

    // Función para restaurar mensaje genérico de WhatsApp
    const restoreDefaultWhatsAppMessage = () => {
        const defaultMessage = "Hola! Me interesa esta propiedad. ¿Podrías darme más información sobre disponibilidad, horarios de visita y cualquier detalle adicional que consideres importante?";
        setData('whatsapp_message', defaultMessage);
    };

    // Mensaje genérico por defecto
    const defaultWhatsAppMessage = "Hola! Me interesa esta propiedad. ¿Podrías darme más información sobre disponibilidad, horarios de visita y cualquier detalle adicional que consideres importante?";

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Editar Propiedad" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Editar Propiedad</h1>
                        <p className="text-muted-foreground">
                            Modifica la información de la propiedad
                        </p>
                    </div>
                    <Link href="/admin/properties">
                        <Button variant="outline">
                            <Icon name="arrow-left" className="mr-2 h-4 w-4" />
                            Volver
                        </Button>
                    </Link>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">
                        {/* Información básica */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Información Básica</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label htmlFor="title">Título *</Label>
                                    <Input
                                        id="title"
                                        value={data.title}
                                        onChange={(e) => setData('title', e.target.value)}
                                        placeholder="Ej: Hermoso departamento en Palermo"
                                        className={errors.title ? 'border-red-500' : ''}
                                    />
                                    {errors.title && (
                                        <p className="text-sm text-red-500 mt-1">{errors.title}</p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="address">Dirección *</Label>
                                    <Input
                                        id="address"
                                        value={data.address}
                                        onChange={(e) => setData('address', e.target.value)}
                                        placeholder="Dirección completa de la propiedad"
                                        className={errors.address ? 'border-red-500' : ''}
                                    />
                                    {errors.address && (
                                        <p className="text-sm text-red-500 mt-1">{errors.address}</p>
                                    )}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="modality">Modalidad *</Label>
                                        <Select value={data.modality} onValueChange={(value: 'rent' | 'sale') => setData('modality', value)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Seleccionar" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="rent">Alquiler</SelectItem>
                                                <SelectItem value="sale">Venta</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {errors.modality && (
                                            <p className="text-sm text-red-500 mt-1">{errors.modality}</p>
                                        )}
                                    </div>

                                    <div>
                                        <Label htmlFor="currency">Moneda *</Label>
                                        <Select value={data.currency} onValueChange={(value: 'ars' | 'dollar') => setData('currency', value)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Seleccionar" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="ars">ARS</SelectItem>
                                                <SelectItem value="dollar">USD</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {errors.currency && (
                                            <p className="text-sm text-red-500 mt-1">{errors.currency}</p>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="price">Precio *</Label>
                                    <Input
                                        id="price"
                                        type="number"
                                        step="0.01"
                                        value={data.price}
                                        onChange={(e) => setData('price', e.target.value)}
                                        placeholder="0.00"
                                        className={errors.price ? 'border-red-500' : ''}
                                    />
                                    {errors.price && (
                                        <p className="text-sm text-red-500 mt-1">{errors.price}</p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="status">Estado *</Label>
                                    <Select value={data.status} onValueChange={(value: 'available' | 'unavailable') => setData('status', value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Seleccionar estado" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="available">Disponible</SelectItem>
                                            <SelectItem value="unavailable">No Disponible</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.status && (
                                        <p className="text-sm text-red-500 mt-1">{errors.status}</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Imagen de portada */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Imagen de Portada</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* ALERTA DE ADVERTENCIA */}
                                <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-3 rounded mb-2 text-sm">
                                    <strong>Advertencia:</strong> La imagen debe ser inferior a 5MB.
                                </div>
                                <div>
                                    <Label htmlFor="cover_image">Cambiar imagen (opcional)</Label>
                                    <Input
                                        id="cover_image"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleCoverImageChange}
                                        className={errors.cover_image ? 'border-red-500' : ''}
                                    />
                                    {errors.cover_image && (
                                        <p className="text-sm text-red-500 mt-1">{errors.cover_image}</p>
                                    )}
                                </div>

                                {/* Imagen actual */}
                                <div className="relative">
                                    <img
                                        src={`/storage/${property.cover_image}`}
                                        alt="Imagen actual"
                                        className="w-full h-auto max-h-48 object-contain rounded-lg"
                                    />
                                </div>

                                {/* Validación de nueva imagen de portada */}
                                {data.cover_image && (
                                    <ImageValidator
                                        files={[data.cover_image]}
                                        maxSizeKB={5120}
                                        maxFiles={1}
                                    />
                                )}

                                {/* Vista previa de nueva imagen */}
                                {coverPreview && (
                                    <div className="relative">
                                        <img
                                            src={coverPreview}
                                            alt="Nueva imagen"
                                            className="w-full h-auto max-h-48 object-contain rounded-lg"
                                        />
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="sm"
                                            className="absolute top-2 right-2"
                                            onClick={() => {
                                                setCoverPreview(null);
                                                setData('cover_image', null);
                                            }}
                                        >
                                            <Icon name="x" className="h-4 w-4" />
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Editor de ubicación en el mapa */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Ubicación en el Mapa</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <PropertyMapEditor
                                initialLatitude={property.latitude}
                                initialLongitude={property.longitude}
                                onLocationChange={handleLocationChange}
                                height="400px"
                                showAddressAutocomplete={true}
                            />
                        </CardContent>
                    </Card>

                    {/* Amenities */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Amenities</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {amenitiesList.map((amenity) => (
                                    <div key={amenity} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={amenity}
                                            checked={data.amenities.includes(amenity)}
                                            onCheckedChange={(checked) =>
                                                handleAmenityChange(amenity, checked as boolean)
                                            }
                                        />
                                        <Label htmlFor={amenity} className="text-sm">
                                            {amenity}
                                        </Label>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Campos de Contacto */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Información de Contacto</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                    <Label htmlFor="whatsapp">WhatsApp</Label>
                                    <Input
                                        id="whatsapp"
                                        value={data.whatsapp}
                                        onChange={(e) => setData('whatsapp', e.target.value)}
                                        placeholder="Ej: +54 9 11 1234-5678"
                                        className={errors.whatsapp ? 'border-red-500' : ''}
                                    />
                                    {errors.whatsapp && (
                                        <p className="text-sm text-red-500 mt-1">{errors.whatsapp}</p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="facebook_messenger">Facebook Messenger</Label>
                                    <div className="flex items-center gap-2">
                                        <Input
                                            id="facebook_messenger"
                                            value={data.facebook_messenger}
                                            onChange={(e) => setData('facebook_messenger', e.target.value)}
                                            placeholder="Ej: https://m.me/tu.usuario"
                                            className={errors.facebook_messenger ? 'border-red-500' : ''}
                                        />
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={regenerateMessengerUrl}
                                            disabled={!user.facebook}
                                        >
                                            <Icon name="refresh" className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        {user.facebook 
                                            ? `Se generó automáticamente desde tu Facebook: ${user.facebook}`
                                            : 'Configura tu Facebook en tu perfil para generar automáticamente la URL de Messenger'
                                        }
                                    </p>
                                    {errors.facebook_messenger && (
                                        <p className="text-sm text-red-500 mt-1">{errors.facebook_messenger}</p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="contact_email">Email de Contacto</Label>
                                <Input
                                    id="contact_email"
                                    type="email"
                                    value={data.contact_email}
                                    onChange={(e) => setData('contact_email', e.target.value)}
                                    placeholder="Ej: contacto@ejemplo.com"
                                    className={errors.contact_email ? 'border-red-500' : ''}
                                />
                                {errors.contact_email && (
                                    <p className="text-sm text-red-500 mt-1">{errors.contact_email}</p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="whatsapp_message">Mensaje Predeterminado de WhatsApp</Label>
                                <div className="flex items-center gap-2">
                                    <Textarea
                                        id="whatsapp_message"
                                        value={data.whatsapp_message || defaultWhatsAppMessage}
                                        onChange={(e) => setData('whatsapp_message', e.target.value)}
                                        placeholder="Ej: Hola! Me interesa esta propiedad. ¿Podrías darme más información?"
                                        className={errors.whatsapp_message ? 'border-red-500' : ''}
                                        rows={3}
                                    />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={restoreDefaultWhatsAppMessage}
                                        title="Restaurar mensaje por defecto"
                                    >
                                        <Icon name="refresh" className="h-4 w-4" />
                                    </Button>
                                </div>
                                <p className="text-sm text-muted-foreground mt-1">
                                    Este mensaje se usará como plantilla cuando los usuarios contacten por WhatsApp. 
                                    Si no escribes nada, se usará un mensaje genérico por defecto.
                                </p>
                                {errors.whatsapp_message && (
                                    <p className="text-sm text-red-500 mt-1">{errors.whatsapp_message}</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Imágenes existentes */}
                    {existingImages.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Imágenes Actuales</CardTitle>
                                <div className="text-sm text-muted-foreground">
                                    {existingImages.length} imágenes existentes
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {existingImages.map((image) => (
                                        <div key={image.id} className="relative group">
                                            <img
                                                src={`/storage/${image.image_path}`}
                                                alt="Imagen existente"
                                                className="w-full h-32 object-contain rounded-lg bg-gray-100 dark:bg-gray-800"
                                            />
                                            <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded-lg flex items-center justify-center">
                                                <Button
                                                    type="button"
                                                    variant="destructive"
                                                    size="sm"
                                                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                                    onClick={() => removeExistingImage(image.id)}
                                                >
                                                    <Icon name="x" className="h-4 w-4" />
                                                </Button>
                                            </div>
                                            <div className="absolute top-2 left-2 bg-blue-600 bg-opacity-90 text-white text-xs px-2 py-1 rounded">
                                                Existente
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Imágenes adicionales */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Agregar Nuevas Imágenes</CardTitle>
                            <div className="text-sm text-muted-foreground">
                                {existingImages.length + data.additional_images.length}/20 imágenes en total
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* ALERTA DE ADVERTENCIA */}
                            <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-3 rounded mb-2 text-sm">
                                <strong>Advertencia:</strong> Cada imagen debe ser inferior a 5MB.
                            </div>
                            <div className="flex items-center gap-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={openFileSelector}
                                    disabled={getRemainingImages() === 0}
                                >
                                    <Icon name="plus" className="mr-2 h-4 w-4" />
                                    Agregar Imágenes
                                </Button>
                                <span className="text-sm text-muted-foreground">
                                    {getRemainingImages() > 0
                                        ? `Puedes agregar hasta ${getRemainingImages()} imágenes más`
                                        : 'Límite de imágenes alcanzado'
                                    }
                                </span>
                            </div>

                            {/* Input oculto para selección de archivos */}
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleAdditionalImagesChange}
                                className="hidden"
                            />

                            {/* Información sobre la selección múltiple */}
                            <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-lg">
                                <p className="text-sm text-blue-700 dark:text-blue-300">
                                    <strong>Tip:</strong> También puedes usar Ctrl+Click para seleccionar múltiples imágenes de una vez,
                                    o arrastrar y soltar varias imágenes sobre el botón "Agregar Imágenes".
                                </p>
                            </div>

                            {isLoadingPreviews && (
                                <div className="flex items-center justify-center p-4">
                                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                                    <span className="ml-2 text-sm text-muted-foreground">Generando previsualizaciones...</span>
                                </div>
                            )}

                            {/* Validación de nuevas imágenes adicionales */}
                            {data.additional_images.length > 0 && (
                                <ImageValidator
                                    files={data.additional_images}
                                    maxSizeKB={5120}
                                    maxFiles={20}
                                />
                            )}

                            {errors.additional_images && (
                                <p className="text-sm text-red-500 mt-1">{errors.additional_images}</p>
                            )}

                            {additionalPreviews.length > 0 && (
                                <div>
                                    <h4 className="font-medium mb-3">Nuevas Imágenes Seleccionadas:</h4>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {additionalPreviews.map((preview, index) => (
                                            <div key={index} className="relative group">
                                                <img
                                                    src={preview}
                                                    alt={`Nueva imagen ${index + 1}`}
                                                    className="w-full h-32 object-contain rounded-lg bg-gray-100 dark:bg-gray-800"
                                                />
                                                <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded-lg flex items-center justify-center">
                                                    <Button
                                                        type="button"
                                                        variant="destructive"
                                                        size="sm"
                                                        className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                                        onClick={() => removeAdditionalImage(index)}
                                                    >
                                                        <Icon name="x" className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                                <div className="absolute top-2 left-2 bg-green-600 bg-opacity-90 text-white text-xs px-2 py-1 rounded">
                                                    Nueva
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Botones de acción */}
                    <div className="flex justify-end space-x-4">
                        <Link href="/admin/properties">
                            <Button type="button" variant="outline">
                                Cancelar
                            </Button>
                        </Link>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Actualizando...' : 'Actualizar Propiedad'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
