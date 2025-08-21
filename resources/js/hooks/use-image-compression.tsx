import { useState, useCallback } from 'react';
import imageCompression from 'browser-image-compression';

export interface CompressionOptions {
    maxSizeMB: number;
    maxWidthOrHeight: number;
    useWebWorker: boolean;
    fileType: string;
    quality: number;
}

export interface CompressionResult {
    originalFile: File;
    compressedFile: File;
    originalSize: number;
    compressedSize: number;
    compressionRatio: number;
    error?: string;
}

export function useImageCompression() {
    const [isCompressing, setIsCompressing] = useState(false);
    const [compressionProgress, setCompressionProgress] = useState(0);

    const defaultOptions: CompressionOptions = {
        maxSizeMB: 1, // 1MB máximo
        maxWidthOrHeight: 1920, // Máxima resolución
        useWebWorker: true,
        fileType: 'image/jpeg',
        quality: 0.8, // 80% de calidad
    };

    const compressImage = useCallback(async (
        file: File, 
        options: Partial<CompressionOptions> = {}
    ): Promise<CompressionResult> => {
        const finalOptions = { ...defaultOptions, ...options };
        
        setIsCompressing(true);
        setCompressionProgress(0);

        try {
            // Validar que sea una imagen
            if (!file.type.startsWith('image/')) {
                throw new Error('El archivo no es una imagen válida');
            }

            const originalSize = file.size;
            
            // Comprimir la imagen
            const compressedFile = await imageCompression(file, {
                ...finalOptions,
                onProgress: (progress) => {
                    setCompressionProgress(progress);
                }
            });

            const compressedSize = compressedFile.size;
            const compressionRatio = ((originalSize - compressedSize) / originalSize) * 100;

            const result: CompressionResult = {
                originalFile: file,
                compressedFile,
                originalSize,
                compressedSize,
                compressionRatio,
            };

            return result;

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido durante la compresión';
            return {
                originalFile: file,
                compressedFile: file, // Devolver el archivo original en caso de error
                originalSize: file.size,
                compressedSize: file.size,
                compressionRatio: 0,
                error: errorMessage,
            };
        } finally {
            setIsCompressing(false);
            setCompressionProgress(0);
        }
    }, []);

    const compressMultipleImages = useCallback(async (
        files: File[],
        options: Partial<CompressionOptions> = {}
    ): Promise<CompressionResult[]> => {
        setIsCompressing(true);
        setCompressionProgress(0);

        try {
            const results: CompressionResult[] = [];
            
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const result = await compressImage(file, options);
                results.push(result);
                
                // Actualizar progreso general
                const progress = ((i + 1) / files.length) * 100;
                setCompressionProgress(progress);
            }

            return results;

        } finally {
            setIsCompressing(false);
            setCompressionProgress(0);
        }
    }, [compressImage]);

    const getCompressionStats = useCallback((result: CompressionResult) => {
        const originalSizeMB = (result.originalSize / (1024 * 1024)).toFixed(2);
        const compressedSizeMB = (result.compressedSize / (1024 * 1024)).toFixed(2);
        const savedMB = ((result.originalSize - result.compressedSize) / (1024 * 1024)).toFixed(2);
        
        return {
            originalSizeMB,
            compressedSizeMB,
            savedMB,
            compressionRatio: result.compressionRatio.toFixed(1),
        };
    }, []);

    return {
        compressImage,
        compressMultipleImages,
        getCompressionStats,
        isCompressing,
        compressionProgress,
    };
}
