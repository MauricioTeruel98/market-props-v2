import React from 'react';
import { Alert, AlertDescription } from './alert';
import { Icon } from '../icon';

interface ImageValidationResult {
    isValid: boolean;
    errors: string[];
    warnings: string[];
}

interface ImageValidatorProps {
    files: File[];
    maxSizeKB?: number;
    maxFiles?: number;
    allowedTypes?: string[];
    onValidationChange?: (result: ImageValidationResult) => void;
    showInfo?: boolean;
}

export function ImageValidator({ 
    files, 
    maxSizeKB = 2048, 
    maxFiles = 20,
    allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'],
    onValidationChange,
    showInfo = true
}: ImageValidatorProps) {
    
    const validateImages = (): ImageValidationResult => {
        const errors: string[] = [];
        const warnings: string[] = [];
        
        if (files.length === 0) {
            return { isValid: true, errors, warnings };
        }
        
        // Validar número máximo de archivos
        if (files.length > maxFiles) {
            errors.push(`Máximo ${maxFiles} imágenes permitidas. Has seleccionado ${files.length}.`);
        }
        
        // Validar cada archivo individualmente
        files.forEach((file, index) => {
            // Validar tipo de archivo
            if (!allowedTypes.includes(file.type)) {
                errors.push(`${file.name}: Tipo de archivo no permitido. Solo se aceptan: ${allowedTypes.map(t => t.split('/')[1]).join(', ')}`);
            }
            
            // Validar tamaño
            const fileSizeKB = file.size / 1024;
            if (fileSizeKB > maxSizeKB) {
                errors.push(`${file.name}: El archivo es demasiado grande (${fileSizeKB.toFixed(1)} KB). Tamaño máximo: ${maxSizeKB} KB`);
            }
            
            // Advertencias para archivos grandes
            if (fileSizeKB > maxSizeKB * 0.8) {
                warnings.push(`${file.name}: El archivo está cerca del límite de tamaño (${fileSizeKB.toFixed(1)} KB)`);
            }
        });
        
        const result = { 
            isValid: errors.length === 0, 
            errors, 
            warnings 
        };
        
        // Notificar al componente padre sobre el resultado de la validación
        if (onValidationChange) {
            onValidationChange(result);
        }
        
        return result;
    };
    
    // Ejecutar validación cuando cambien los archivos
    React.useEffect(() => {
        validateImages();
    }, [files]);
    
    const validationResult = validateImages();
    
    if (validationResult.errors.length === 0 && validationResult.warnings.length === 0) {
        return null;
    }
    
    return (
        <div className="space-y-3">
            {/* Errores */}
            {validationResult.errors.length > 0 && (
                <Alert variant="destructive">
                    <Icon name="alert-circle" className="h-4 w-4" />
                    <AlertDescription>
                        <div className="space-y-1">
                            <p className="font-medium">Imágenes con problemas:</p>
                            <ul className="list-disc list-inside space-y-1 text-sm">
                                {validationResult.errors.map((error, index) => (
                                    <li key={index}>{error}</li>
                                ))}
                            </ul>
                        </div>
                    </AlertDescription>
                </Alert>
            )}
            
            {/* Advertencias */}
            {validationResult.warnings.length > 0 && (
                <Alert variant="default" className="border-yellow-200 bg-yellow-50 dark:bg-yellow-950 dark:border-yellow-800">
                    <Icon name="alert-triangle" className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                    <AlertDescription>
                        <div className="space-y-1">
                            <p className="font-medium text-yellow-800 dark:text-yellow-200">Advertencias:</p>
                            <ul className="list-disc list-inside space-y-1 text-sm text-yellow-700 dark:text-yellow-300">
                                {validationResult.warnings.map((warning, index) => (
                                    <li key={index}>{warning}</li>
                                ))}
                            </ul>
                        </div>
                    </AlertDescription>
                </Alert>
            )}
            
            {/* Información sobre límites */}
            {showInfo && (
                <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
                    <div className="flex items-start space-x-2">
                        <Icon name="info" className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                        <div className="text-sm text-blue-700 dark:text-blue-300">
                            <p className="font-medium">Límites de imágenes:</p>
                            <ul className="mt-1 space-y-1">
                                <li>• Tamaño máximo: {maxSizeKB} KB por imagen</li>
                                <li>• Tipos permitidos: {allowedTypes.map(t => t.split('/')[1]).join(', ')}</li>
                                <li>• Máximo de archivos: {maxFiles}</li>
                            </ul>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// Hook personalizado para validar imágenes
export function useImageValidation(maxSizeKB: number = 2048) {
    const [validationResult, setValidationResult] = React.useState<ImageValidationResult>({
        isValid: true,
        errors: [],
        warnings: []
    });
    
    const validateFiles = (files: File[]): ImageValidationResult => {
        const errors: string[] = [];
        const warnings: string[] = [];
        
        files.forEach(file => {
            // Validar tipo
            if (!file.type.startsWith('image/')) {
                errors.push(`${file.name}: No es una imagen válida`);
                return;
            }
            
            // Validar tamaño
            const fileSizeKB = file.size / 1024;
            if (fileSizeKB > maxSizeKB) {
                errors.push(`${file.name}: ${fileSizeKB.toFixed(1)} KB (máximo: ${maxSizeKB} KB)`);
            } else if (fileSizeKB > maxSizeKB * 0.8) {
                warnings.push(`${file.name}: ${fileSizeKB.toFixed(1)} KB (cerca del límite)`);
            }
        });
        
        const result = { 
            isValid: errors.length === 0, 
            errors, 
            warnings 
        };
        
        setValidationResult(result);
        return result;
    };
    
    return {
        validationResult,
        validateFiles,
        isValid: validationResult.isValid
    };
}
