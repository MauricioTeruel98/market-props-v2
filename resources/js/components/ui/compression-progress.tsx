import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Icon } from '../icon';

interface CompressionProgressProps {
    isCompressing: boolean;
    progress: number;
    currentFile?: string;
    totalFiles?: number;
    currentFileIndex?: number;
}

export function CompressionProgress({ 
    isCompressing, 
    progress, 
    currentFile,
    totalFiles,
    currentFileIndex
}: CompressionProgressProps) {
    if (!isCompressing) return null;

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                    Comprimiendo Imágenes...
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Barra de progreso general */}
                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span>Progreso general</span>
                        <span>{Math.round(progress)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                </div>

                {/* Información del archivo actual */}
                {currentFile && (
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span>Archivo actual:</span>
                            {totalFiles && currentFileIndex !== undefined && (
                                <span>{currentFileIndex + 1} de {totalFiles}</span>
                            )}
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                            <div className="flex items-center gap-2">
                                <Icon name="image" className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm font-medium truncate">
                                    {currentFile.length > 30 
                                        ? currentFile.substring(0, 30) + '...'
                                        : currentFile
                                    }
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Mensaje informativo */}
                <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                    <div className="flex items-center gap-2">
                        <Icon name="info" className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        <div className="text-sm text-blue-700 dark:text-blue-300">
                            <p className="font-medium">Procesando imágenes...</p>
                            <p>Las imágenes se están comprimiendo para optimizar el tamaño y mejorar la velocidad de carga.</p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
