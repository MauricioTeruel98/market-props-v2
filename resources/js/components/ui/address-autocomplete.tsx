import React, { useState, useEffect, useRef } from 'react';
import { Input } from './input';
import { Label } from './label';
import { Button } from './button';
import { Icon } from '../icon';

interface AddressSuggestion {
    display_name: string;
    lat: string;
    lon: string;
    type: string;
}

interface AddressAutocompleteProps {
    label?: string;
    placeholder?: string;
    value: string;
    onChange: (value: string) => void;
    onLocationSelect: (lat: number, lng: number) => void;
    className?: string;
}

export function AddressAutocomplete({
    label = "Buscar ubicación",
    placeholder = "Escribe una dirección, lugar o punto de interés...",
    value,
    onChange,
    onLocationSelect,
    className = ""
}: AddressAutocompleteProps) {
    const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const inputRef = useRef<HTMLInputElement>(null);
    const suggestionsRef = useRef<HTMLDivElement>(null);

    // Función para buscar sugerencias
    const searchAddress = async (query: string) => {
        if (query.length < 3) {
            setSuggestions([]);
            setShowSuggestions(false);
            return;
        }

        setIsLoading(true);
        try {
            let allSuggestions: AddressSuggestion[] = [];
            
            // Detectar si es una búsqueda específica de dirección
            const isSpecificAddress = /\d/.test(query) && query.length > 5;
            
            if (isSpecificAddress) {
                // Búsqueda específica para direcciones con número
                const specificQueries = [
                    `${query}, Tucumán, Argentina`,
                    `${query}, San Miguel de Tucumán, Argentina`,
                    query
                ];
                
                for (const specificQuery of specificQueries) {
                    try {
                        const response = await fetch(
                            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(specificQuery)}&limit=2&countrycodes=ar&addressdetails=1`
                        );
                        
                        if (response.ok) {
                            const data = await response.json();
                            allSuggestions.push(...data);
                        }
                    } catch (error) {
                        console.error('Error en búsqueda específica:', error);
                    }
                }
            }
            
            // Búsqueda específica en Tucumán
            const tucumanQuery = `${query}, Tucumán, Argentina`;
            const tucumanResponse = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(tucumanQuery)}&limit=3&countrycodes=ar&addressdetails=1&viewbox=-65.5,-27.0,-64.8,-26.6&bounded=1`
            );
            
            // Búsqueda general en Argentina
            const generalResponse = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=3&countrycodes=ar&addressdetails=1`
            );
            
            if (tucumanResponse.ok) {
                const tucumanData = await tucumanResponse.json();
                allSuggestions.push(...tucumanData);
            }
            
            if (generalResponse.ok) {
                const generalData = await generalResponse.json();
                // Filtrar duplicados
                const existingIds = new Set(allSuggestions.map((s: AddressSuggestion) => `${s.lat}-${s.lon}`));
                const uniqueGeneralData = generalData.filter((s: AddressSuggestion) => !existingIds.has(`${s.lat}-${s.lon}`));
                allSuggestions.push(...uniqueGeneralData);
            }
            
            // Ordenar por importancia y relevancia
            allSuggestions.sort((a, b) => {
                // Priorizar resultados de Tucumán
                const aIsTucuman = a.display_name.toLowerCase().includes('tucumán') || 
                                  a.display_name.toLowerCase().includes('san miguel');
                const bIsTucuman = b.display_name.toLowerCase().includes('tucumán') || 
                                  b.display_name.toLowerCase().includes('san miguel');
                
                if (aIsTucuman && !bIsTucuman) return -1;
                if (!aIsTucuman && bIsTucuman) return 1;
                
                // Priorizar direcciones exactas
                const aExactMatch = a.display_name.toLowerCase().includes(query.toLowerCase());
                const bExactMatch = b.display_name.toLowerCase().includes(query.toLowerCase());
                
                if (aExactMatch && !bExactMatch) return -1;
                if (!aExactMatch && bExactMatch) return 1;
                
                return 0;
            });
            
            // Limitar a 5 resultados
            allSuggestions = allSuggestions.slice(0, 5);
            
            setSuggestions(allSuggestions);
            setShowSuggestions(allSuggestions.length > 0);
            setSelectedIndex(-1);
        } catch (error) {
            console.error('Error buscando direcciones:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Debounce para la búsqueda
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (value) {
                searchAddress(value);
                // Si la búsqueda no da resultados, intentar sin número de casa
                if (value.length > 5 && /\d/.test(value)) {
                    setTimeout(() => {
                        const queryWithoutNumber = value.replace(/\d+/g, '').trim();
                        if (queryWithoutNumber.length >= 3) {
                            searchAddress(queryWithoutNumber);
                        }
                    }, 500);
                }
            } else {
                setSuggestions([]);
                setShowSuggestions(false);
            }
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [value]);

    // Manejar selección de sugerencia
    const handleSuggestionSelect = (suggestion: AddressSuggestion) => {
        const lat = parseFloat(suggestion.lat);
        const lng = parseFloat(suggestion.lon);
        
        if (!isNaN(lat) && !isNaN(lng)) {
            onChange(suggestion.display_name);
            onLocationSelect(lat, lng);
            setShowSuggestions(false);
            setSuggestions([]);
        }
    };

    // Manejar navegación con teclado
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (!showSuggestions) return;

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setSelectedIndex(prev => 
                    prev < suggestions.length - 1 ? prev + 1 : prev
                );
                break;
            case 'ArrowUp':
                e.preventDefault();
                setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
                break;
            case 'Enter':
                e.preventDefault();
                if (selectedIndex >= 0 && suggestions[selectedIndex]) {
                    handleSuggestionSelect(suggestions[selectedIndex]);
                }
                break;
            case 'Escape':
                setShowSuggestions(false);
                setSuggestions([]);
                break;
        }
    };

    // Cerrar sugerencias al hacer clic fuera
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                inputRef.current && 
                !inputRef.current.contains(event.target as Node) &&
                suggestionsRef.current && 
                !suggestionsRef.current.contains(event.target as Node)
            ) {
                setShowSuggestions(false);
                setSuggestions([]);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Limpiar ubicación
    const handleClearLocation = () => {
        onChange('');
        onLocationSelect(0, 0);
        setSuggestions([]);
        setShowSuggestions(false);
    };

    return (
        <div className={`relative ${className}`}>
            {label && <Label htmlFor="address-search">{label}</Label>}
            
            <div className="relative">
                <Input
                    ref={inputRef}
                    id="address-search"
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    className="pr-20"
                />
                
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-1">
                    {isLoading && (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    )}
                    
                    {value && (
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={handleClearLocation}
                            className="h-6 w-6 p-0"
                        >
                            <Icon name="x" className="h-4 w-4" />
                        </Button>
                    )}
                </div>
            </div>

            {/* Sugerencias */}
            {showSuggestions && suggestions.length > 0 && (
                <div
                    ref={suggestionsRef}
                    className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-60 overflow-y-auto"
                >
                    {suggestions.map((suggestion, index) => {
                        const isTucuman = suggestion.display_name.toLowerCase().includes('tucumán') || 
                                        suggestion.display_name.toLowerCase().includes('san miguel');
                        const isExactMatch = suggestion.display_name.toLowerCase().includes(value.toLowerCase());
                        
                        return (
                            <div
                                key={`${suggestion.lat}-${suggestion.lon}`}
                                className={`px-4 py-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                                    index === selectedIndex ? 'bg-blue-50 dark:bg-blue-900' : ''
                                }`}
                                onClick={() => handleSuggestionSelect(suggestion)}
                            >
                                <div className="flex items-start gap-3">
                                    <Icon 
                                        name="map-pin" 
                                        className={`h-4 w-4 mt-0.5 flex-shrink-0 ${
                                            isTucuman ? 'text-blue-500' : 'text-gray-400'
                                        }`}
                                    />
                                    <div className="flex-1 min-w-0">
                                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                                            {suggestion.display_name.split(',')[0]}
                                            {isExactMatch && (
                                                <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                                                    Coincidencia exacta
                                                </span>
                                            )}
                                        </div>
                                        <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                            {suggestion.display_name.split(',').slice(1).join(',').trim()}
                                        </div>
                                        {isTucuman && (
                                            <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                                                📍 Tucumán
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Información de ayuda */}
            <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                <div className="space-y-1">
                    <div>💡 <strong>Consejos para búsquedas más precisas:</strong></div>
                    <div>• Escribe al menos 3 caracteres para buscar</div>
                    <div>• Para direcciones específicas: "Corrientes 2035, Tucumán"</div>
                    <div>• Para calles sin número: "Corrientes, San Miguel de Tucumán"</div>
                    <div>• Para barrios: "Centro, Tucumán" o "Yerba Buena, Tucumán"</div>
                    <div>• Usa las flechas del teclado para navegar y Enter para seleccionar</div>
                </div>
            </div>
        </div>
    );
}
