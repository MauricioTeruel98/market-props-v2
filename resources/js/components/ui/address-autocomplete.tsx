import React, { useState, useEffect, useRef } from 'react';
import { Input } from './input';
import { Label } from './label';
import { Button } from './button';
import { Icon } from '../icon';
import { Map } from './map';

interface AddressSuggestion {
    display_name: string;
    lat: string;
    lon: string;
    type: string;
    importance: number;
}

interface AddressAutocompleteProps {
    value: string;
    onChange: (address: string) => void;
    onLocationSelect?: (location: { lat: number; lng: number; address: string }) => void;
    label?: string;
    placeholder?: string;
    error?: string;
    className?: string;
    showMap?: boolean;
    mapHeight?: string;
}

export function AddressAutocomplete({
    value,
    onChange,
    onLocationSelect,
    label = "Dirección",
    placeholder = "Ingresa la dirección...",
    error,
    className = "",
    showMap = true,
    mapHeight = "300px"
}: AddressAutocompleteProps) {
    const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [mapCenter, setMapCenter] = useState<[number, number]>([-26.8241, -65.2226]); // San Miguel de Tucumán por defecto
    const wrapperRef = useRef<HTMLDivElement>(null);

    // Cerrar sugerencias al hacer clic fuera
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Buscar sugerencias cuando cambie el valor
    useEffect(() => {
        const searchAddress = async () => {
            if (value.length < 3) {
                setSuggestions([]);
                setShowSuggestions(false);
                return;
            }

            setIsLoading(true);
            try {
                const response = await fetch(
                    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(value)}&countrycodes=ar&limit=5&addressdetails=1`
                );
                const data = await response.json();
                setSuggestions(data);
                setShowSuggestions(data.length > 0);
            } catch (error) {
                console.error('Error buscando direcciones:', error);
                setSuggestions([]);
            } finally {
                setIsLoading(false);
            }
        };

        const timeoutId = setTimeout(searchAddress, 500);
        return () => clearTimeout(timeoutId);
    }, [value]);

    const handleSuggestionClick = (suggestion: AddressSuggestion) => {
        const lat = parseFloat(suggestion.lat);
        const lng = parseFloat(suggestion.lon);
        
        onChange(suggestion.display_name);
        setSelectedLocation({ lat, lng });
        setMapCenter([lat, lng]);
        setShowSuggestions(false);
        
        if (onLocationSelect) {
            onLocationSelect({
                lat,
                lng,
                address: suggestion.display_name
            });
        }
    };



    const clearLocation = () => {
        setSelectedLocation(null);
        setMapCenter([-26.8241, -65.2226]);
        onChange('');
    };

    return (
        <div className={`space-y-4 ${className}`}>
            <div>
                <Label htmlFor="address">{label}</Label>
                <div className="relative" ref={wrapperRef}>
                    <Input
                        id="address"
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder={placeholder}
                        className={error ? 'border-red-500' : ''}
                        onFocus={() => value.length >= 3 && setShowSuggestions(true)}
                    />
                    
                    {isLoading && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                        </div>
                    )}

                    {showSuggestions && suggestions.length > 0 && (
                        <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg max-h-60 overflow-auto">
                            {suggestions.map((suggestion, index) => (
                                <div
                                    key={index}
                                    className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-sm"
                                    onClick={() => handleSuggestionClick(suggestion)}
                                >
                                    <div className="font-medium">{suggestion.display_name.split(',')[0]}</div>
                                    <div className="text-gray-500 dark:text-gray-400 text-xs">
                                        {suggestion.display_name.split(',').slice(1).join(',').trim()}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                
                {error && (
                    <p className="text-sm text-red-500 mt-1">{error}</p>
                )}
            </div>

            {showMap && (
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label>Ubicación en el mapa</Label>
                        {selectedLocation && (
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={clearLocation}
                            >
                                <Icon name="x" className="h-4 w-4 mr-1" />
                                Limpiar
                            </Button>
                        )}
                    </div>
                    
                    <div className="border rounded-lg overflow-hidden">
                                            <Map
                        center={mapCenter}
                        zoom={selectedLocation ? 16 : 10}
                        height={mapHeight}
                        interactive={true}
                        onLocationSelect={(location) => {
                            setSelectedLocation({ lat: location.lat, lng: location.lng });
                            setMapCenter([location.lat, location.lng]);
                            
                            // Hacer geocoding inverso para obtener la dirección
                            fetch(
                                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${location.lat}&lon=${location.lng}&addressdetails=1`
                            )
                                .then(response => response.json())
                                .then(data => {
                                    const address = data.display_name;
                                    onChange(address);
                                    if (onLocationSelect) {
                                        onLocationSelect({ lat: location.lat, lng: location.lng, address });
                                    }
                                })
                                .catch(error => {
                                    console.error('Error obteniendo dirección:', error);
                                    // Si falla el geocoding inverso, usar coordenadas
                                    const address = `${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}`;
                                    onChange(address);
                                    if (onLocationSelect) {
                                        onLocationSelect({ lat: location.lat, lng: location.lng, address });
                                    }
                                });
                        }}
                    />
                    </div>
                    
                    {selectedLocation && (
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                            <strong>Coordenadas seleccionadas:</strong> {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
