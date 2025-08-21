import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Badge } from './badge';
import { Icon } from '../icon';
import { CompressionResult } from '@/hooks/use-image-compression';

interface CompressionStatsProps {
    results: CompressionResult[];
    showDetails?: boolean;
}

export function CompressionStats({ results, showDetails = true }: CompressionStatsProps) {
    if (results.length === 0) return null;

    const totalOriginalSize = results.reduce((sum, result) => sum + result.originalSize, 0);
    const totalCompressedSize = results.reduce((sum, result) => sum + result.compressedSize, 0);
    const totalSaved = totalOriginalSize - totalCompressedSize;
    const averageCompressionRatio = results.reduce((sum, result) => sum + result.compressionRatio, 0) / results.length;

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const getCompressionColor = (ratio: number) => {
        if (ratio >= 70) return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
        if (ratio >= 50) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    };

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Icon name="bar-chart-3" className="h-5 w-5" />
                    Estadísticas de Compresión
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Resumen general */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                            {results.length}
                        </div>
                        <div className="text-sm text-muted-foreground">Imágenes</div>
                    </div>
                    
                    <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                            {formatFileSize(totalOriginalSize)}
                        </div>
                        <div className="text-sm text-muted-foreground">Tamaño Original</div>
                    </div>
                    
                    <div className="text-center">
                        <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                            {formatFileSize(totalCompressedSize)}
                        </div>
                        <div className="text-sm text-muted-foreground">Tamaño Final</div>
                    </div>
                    
                    <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                            {formatFileSize(totalSaved)}
                        </div>
                        <div className="text-sm text-muted-foreground">Espacio Ahorrado</div>
                    </div>
                </div>

                {/* Ratio de compresión promedio */}
                <div className="flex items-center justify-center">
                    <Badge className={`text-lg px-4 py-2 ${getCompressionColor(averageCompressionRatio)}`}>
                        <Icon name="trending-down" className="mr-2 h-4 w-4" />
                        {averageCompressionRatio.toFixed(1)}% de compresión promedio
                    </Badge>
                </div>

                {/* Detalles por imagen */}
                {showDetails && results.length > 0 && (
                    <div className="space-y-2">
                        <h4 className="font-medium text-sm text-muted-foreground">Detalles por imagen:</h4>
                        <div className="space-y-2 max-h-40 overflow-y-auto">
                            {results.map((result, index) => {
                                const stats = {
                                    originalSizeMB: (result.originalSize / (1024 * 1024)).toFixed(2),
                                    compressedSizeMB: (result.compressedSize / (1024 * 1024)).toFixed(2),
                                    savedMB: ((result.originalSize - result.compressedSize) / (1024 * 1024)).toFixed(2),
                                    compressionRatio: result.compressionRatio.toFixed(1),
                                };

                                return (
                                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded-lg text-sm">
                                        <div className="flex items-center gap-2">
                                            <Icon name="image" className="h-4 w-4 text-muted-foreground" />
                                            <span className="font-medium">
                                                {result.originalFile.name.length > 20 
                                                    ? result.originalFile.name.substring(0, 20) + '...'
                                                    : result.originalFile.name
                                                }
                                            </span>
                                        </div>
                                        
                                        <div className="flex items-center gap-2">
                                            <span className="text-muted-foreground">
                                                {stats.originalSizeMB}MB → {stats.compressedSizeMB}MB
                                            </span>
                                            <Badge className={`text-xs ${getCompressionColor(result.compressionRatio)}`}>
                                                -{stats.compressionRatio}%
                                            </Badge>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Mensaje de éxito */}
                {totalSaved > 0 && (
                    <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg p-3">
                        <div className="flex items-center gap-2">
                            <Icon name="check-circle" className="h-5 w-5 text-green-600 dark:text-green-400" />
                            <div>
                                <p className="font-medium text-green-800 dark:text-green-200">
                                    ¡Compresión exitosa!
                                </p>
                                <p className="text-sm text-green-700 dark:text-green-300">
                                    Se ahorraron {formatFileSize(totalSaved)} de espacio ({averageCompressionRatio.toFixed(1)}% de reducción)
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Errores de compresión */}
                {results.some(result => result.error) && (
                    <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg p-3">
                        <div className="flex items-center gap-2">
                            <Icon name="alert-circle" className="h-5 w-5 text-red-600 dark:text-red-400" />
                            <div>
                                <p className="font-medium text-red-800 dark:text-red-200">
                                    Errores de compresión:
                                </p>
                                <ul className="text-sm text-red-700 dark:text-red-300 mt-1 space-y-1">
                                    {results
                                        .filter(result => result.error)
                                        .map((result, index) => (
                                            <li key={index}>
                                                • {result.originalFile.name}: {result.error}
                                            </li>
                                        ))
                                    }
                                </ul>
                            </div>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
