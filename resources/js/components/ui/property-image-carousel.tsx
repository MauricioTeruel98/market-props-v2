import { useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/icon";
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";

interface PropertyImageCarouselProps {
    images: string[];
    propertyTitle: string;
}

export function PropertyImageCarousel({ images, propertyTitle }: PropertyImageCarouselProps) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);
    const [fullscreenIndex, setFullscreenIndex] = useState(0);

    const handleImageClick = (index: number) => {
        setFullscreenIndex(index);
        setIsFullscreenOpen(true);
    };

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    const nextFullscreenImage = () => {
        setFullscreenIndex((prev) => (prev + 1) % images.length);
    };

    const prevFullscreenImage = () => {
        setFullscreenIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    if (images.length === 0) {
        return (
            <div className="aspect-video bg-gray-800 rounded-lg flex items-center justify-center">
                <div className="text-center">
                    <Icon name="image" className="w-12 h-12 text-gray-500 mx-auto mb-2" />
                    <p className="text-gray-400">No hay imágenes disponibles</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Main Image Display */}
            <div className="relative group">
                <div 
                    className="rounded-lg overflow-hidden bg-gray-800 relative"
                    style={{ 
                        width: '100%', 
                        height: '400px',
                        minHeight: '400px'
                    }}
                >
                    <img
                        src={`/storage/${images[currentImageIndex]}`}
                        alt={`${propertyTitle} - Imagen ${currentImageIndex + 1}`}
                        className="w-full h-full object-cover"
                        style={{ 
                            width: '100%', 
                            height: '100%', 
                            objectFit: 'cover',
                            display: 'block'
                        }}
                    />
                    <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex lg:items-center lg:justify-center pl-4 lg:pl-0 pt-4 lg:pt-0">
                        <Button
                            variant="secondary"
                            size="sm"
                            className="lg:opacity-0 opacity-100 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 hover:bg-white text-gray-900"
                            onClick={() => handleImageClick(currentImageIndex)}
                        >
                            <ZoomIn className="w-4 h-4 mr-2" />
                            Ampliar
                        </Button>
                    </div>
                </div>

                {/* Navigation Buttons */}
                {images.length > 1 && (
                    <>
                        <button
                            onClick={prevImage}
                            className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 w-10 h-10 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                            onClick={nextImage}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 w-10 h-10 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </>
                )}

                {/* Image Counter */}
                {images.length > 1 && (
                    <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                        {currentImageIndex + 1} de {images.length}
                    </div>
                )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
                <div className="grid grid-cols-5 gap-2 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10">
                    {images.map((image, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentImageIndex(index)}
                            className={`aspect-square rounded-lg overflow-hidden cursor-pointer transition-all duration-200 ${
                                currentImageIndex === index
                                    ? "ring-2 ring-sky-400 scale-105"
                                    : "hover:opacity-80"
                            }`}
                        >
                            <img
                                src={`/storage/${image}`}
                                alt={`${propertyTitle} - Thumbnail ${index + 1}`}
                                className="w-full h-full object-cover"
                            />
                        </button>
                    ))}
                </div>
            )}

            {/* Fullscreen Modal */}
            <Dialog open={isFullscreenOpen} onOpenChange={setIsFullscreenOpen}>
                <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 bg-black/95 border-0">
                    <DialogTitle className="sr-only">
                        {propertyTitle} - Imagen {fullscreenIndex + 1} de {images.length}
                    </DialogTitle>
                    <DialogDescription className="sr-only">
                        Visualización en pantalla completa de las imágenes de la propiedad {propertyTitle}. Use las flechas para navegar entre imágenes o haga clic en las miniaturas para ir a una imagen específica.
                    </DialogDescription>
                    <div className="relative w-full h-full min-h-[400px]">
                        {/* Close Button */}
                        <Button
                            variant="ghost"
                            size="sm"
                            className="absolute top-4 right-4 z-20 bg-black/50 hover:bg-black/70 text-white rounded-full w-10 h-10"
                            onClick={() => setIsFullscreenOpen(false)}
                        >
                            <X className="w-5 h-5" />
                        </Button>

                        {/* Navigation Buttons */}
                        {images.length > 1 && (
                            <>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-black/50 hover:bg-black/70 text-white rounded-full w-12 h-12"
                                    onClick={prevFullscreenImage}
                                >
                                    <ChevronLeft className="w-6 h-6" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-black/50 hover:bg-black/70 text-white rounded-full w-12 h-12"
                                    onClick={nextFullscreenImage}
                                >
                                    <ChevronRight className="w-6 h-6" />
                                </Button>
                            </>
                        )}

                        {/* Image Counter */}
                        {images.length > 1 && (
                            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 bg-black/50 text-white px-4 py-2 rounded-full text-sm">
                                {fullscreenIndex + 1} de {images.length}
                            </div>
                        )}

                        {/* Main Image */}
                        <div className="w-full h-full flex items-center justify-center p-4">
                            <img
                                src={`/storage/${images[fullscreenIndex]}`}
                                alt={`${propertyTitle} - Imagen ${fullscreenIndex + 1}`}
                                className="max-w-full max-h-full object-contain"
                            />
                        </div>

                        {/* Thumbnails in Fullscreen */}
                        {images.length > 1 && (
                            <div className="absolute -bottom-16 md:bottom-16 left-1/2 transform -translate-x-1/2 z-20">
                                <div className="flex space-x-2 bg-black/50 p-2 rounded-lg max-w-[90vw] overflow-x-auto">
                                    {images.map((image, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setFullscreenIndex(index)}
                                            className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                                                fullscreenIndex === index
                                                    ? "border-sky-400 scale-110"
                                                    : "border-gray-600 hover:border-gray-400"
                                            }`}
                                        >
                                            <img
                                                src={`/storage/${image}`}
                                                alt={`${propertyTitle} - Thumbnail ${index + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
