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
import { useState, useRef } from "react";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Propiedades',
        href: '/admin/properties',
    },
    {
        title: 'Crear',
        href: '/admin/properties/create',
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

export default function CreateProperty() {
    const [coverPreview, setCoverPreview] = useState<string | null>(null);
    const [additionalPreviews, setAdditionalPreviews] = useState<string[]>([]);
    const [isLoadingPreviews, setIsLoadingPreviews] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { data, setData, post, processing, errors } = useForm({
        title: '',
        address: '',
        modality: '',
        currency: '',
        price: '',
        amenities: [] as string[],
        cover_image: null as File | null,
        additional_images: [] as File[],
    });

    const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('cover_image', file);
            const reader = new FileReader();
            reader.onload = (e) => setCoverPreview(e.target?.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleAdditionalImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        const totalImages = data.additional_images.length + files.length;
        
        if (totalImages > 20) {
            alert(`Máximo 20 imágenes adicionales permitidas. Ya tienes ${data.additional_images.length} y estás intentando agregar ${files.length}.`);
            return;
        }
        
        // Agregar nuevas imágenes a las existentes
        const newFiles = [...data.additional_images, ...files];
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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/properties');
    };

    const removeAdditionalImage = (index: number) => {
        const newFiles = data.additional_images.filter((_, i) => i !== index);
        const newPreviews = additionalPreviews.filter((_, i) => i !== index);
        setData('additional_images', newFiles);
        setAdditionalPreviews(newPreviews);
    };

    const openFileSelector = () => {
        fileInputRef.current?.click();
    };

    const getRemainingImages = () => {
        return Math.max(0, 20 - data.additional_images.length);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Crear Propiedad" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Crear Nueva Propiedad</h1>
                        <p className="text-muted-foreground">
                            Completa el formulario para crear una nueva propiedad
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
                                        <Select value={data.modality} onValueChange={(value) => setData('modality', value)}>
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
                                        <Select value={data.currency} onValueChange={(value) => setData('currency', value)}>
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
                            </CardContent>
                        </Card>

                        {/* Imagen de portada */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Imagen de Portada *</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label htmlFor="cover_image">Seleccionar imagen</Label>
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

                                {coverPreview && (
                                    <div className="relative">
                                        <img
                                            src={coverPreview}
                                            alt="Vista previa"
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

                    {/* Imágenes adicionales */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Imágenes Adicionales</CardTitle>
                            <div className="text-sm text-muted-foreground">
                                {data.additional_images.length}/20 imágenes seleccionadas
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
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

                            {errors.additional_images && (
                                <p className="text-sm text-red-500 mt-1">{errors.additional_images}</p>
                            )}

                            {additionalPreviews.length > 0 && (
                                <div>
                                    <h4 className="font-medium mb-3">Imágenes Seleccionadas:</h4>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {additionalPreviews.map((preview, index) => {
                                            return (
                                                <div key={index} className="relative group">
                                                    <img
                                                        src={preview}
                                                        alt={`Imagen ${index + 1}`}
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
                                                    <div className="absolute top-2 left-2 bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                                                        {index + 1}
                                                    </div>
                                                </div>
                                            );
                                        })}
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
                            {processing ? 'Creando...' : 'Crear Propiedad'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
