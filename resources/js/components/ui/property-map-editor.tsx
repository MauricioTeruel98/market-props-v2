import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Button } from './button';
import { Input } from './input';
import { Label } from './label';
import { Icon } from '../icon';

// Fix para los iconos de Leaflet
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Estilos CSS para el marcador personalizado
const markerStyles = `
    .custom-marker {
        background: transparent !important;
        border: none !important;
    }
    .custom-marker div {
        background-color: #3b82f6 !important;
        width: 24px !important;
        height: 24px !important;
        border-radius: 50% !important;
        border: 3px solid white !important;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3) !important;
        position: relative !important;
    }
    .custom-marker div::after {
        content: '' !important;
        position: absolute !important;
        bottom: -8px !important;
        left: 50% !important;
        transform: translateX(-50%) !important;
        width: 0 !important;
        height: 0 !important;
        border-left: 6px solid transparent !important;
        border-right: 6px solid transparent !important;
        border-top: 8px solid #3b82f6 !important;
    }
`;

interface PropertyMapEditorProps {
    initialLatitude?: number | null;
    initialLongitude?: number | null;
    onLocationChange: (latitude: number | null, longitude: number | null) => void;
    height?: string;
    className?: string;
}

// Componente para manejar eventos del mapa
function MapClickHandler({ onLocationChange }: { onLocationChange: (lat: number, lng: number) => void }) {
    useMapEvents({
        click: (e) => {
            const { lat, lng } = e.latlng;
            onLocationChange(lat, lng);
        },
    });
    return null;
}

// Componente para centrar el mapa
function MapCenter({ center }: { center: [number, number] }) {
    const mapInstance = useMap();
    
    useEffect(() => {
        if (center) {
            mapInstance.setView(center);
        }
    }, [center, mapInstance]);
    
    return null;
}

export function PropertyMapEditor({ 
    initialLatitude, 
    initialLongitude, 
    onLocationChange, 
    height = "400px",
    className = ""
}: PropertyMapEditorProps) {
    // Función para validar y convertir coordenadas
    const parseCoordinate = (coord: number | null | undefined): number | null => {
        if (coord === null || coord === undefined) return null;
        const parsed = parseFloat(coord.toString());
        if (isNaN(parsed)) return null;
        // Redondear a 6 decimales para mantener consistencia
        return Math.round(parsed * 1000000) / 1000000;
    };

    const initialLat = parseCoordinate(initialLatitude);
    const initialLng = parseCoordinate(initialLongitude);
    
    const [latitude, setLatitude] = useState<string>(initialLat?.toString() || '');
    const [longitude, setLongitude] = useState<string>(initialLng?.toString() || '');
    const [currentMarker, setCurrentMarker] = useState<[number, number] | null>(
        initialLat && initialLng ? [initialLat, initialLng] : null
    );
    
    const mapRef = useRef<L.Map>(null);
    const defaultCenter: [number, number] = [-26.8241, -65.2226]; // San Miguel de Tucumán por defecto

    // Actualizar marcador cuando cambien las coordenadas iniciales
    useEffect(() => {
        if (initialLat && initialLng) {
            setCurrentMarker([initialLat, initialLng]);
            setLatitude(initialLat.toString());
            setLongitude(initialLng.toString());
        }
    }, [initialLat, initialLng]);

    const handleMapClick = (lat: number, lng: number) => {
        // Redondear a 6 decimales para mantener consistencia
        const roundedLat = Math.round(lat * 1000000) / 1000000;
        const roundedLng = Math.round(lng * 1000000) / 1000000;
        
        setCurrentMarker([roundedLat, roundedLng]);
        setLatitude(roundedLat.toString());
        setLongitude(roundedLng.toString());
        onLocationChange(roundedLat, roundedLng);
    };

    const handleCoordinateChange = (type: 'lat' | 'lng', value: string) => {
        const numValue = parseFloat(value);
        if (type === 'lat') {
            setLatitude(value);
            if (!isNaN(numValue) && numValue >= -90 && numValue <= 90) {
                // Redondear a 6 decimales inmediatamente
                const roundedValue = Math.round(numValue * 1000000) / 1000000;
                setLatitude(roundedValue.toString()); // Actualizar con el valor redondeado
                const newMarker: [number, number] = currentMarker 
                    ? [roundedValue, currentMarker[1]] 
                    : [roundedValue, parseFloat(longitude) || -65.2226];
                setCurrentMarker(newMarker);
                onLocationChange(roundedValue, newMarker[1]);
            }
        } else {
            setLongitude(value);
            if (!isNaN(numValue) && numValue >= -180 && numValue <= 180) {
                // Redondear a 6 decimales inmediatamente
                const roundedValue = Math.round(numValue * 1000000) / 1000000;
                setLongitude(roundedValue.toString()); // Actualizar con el valor redondeado
                const newMarker: [number, number] = currentMarker 
                    ? [currentMarker[0], roundedValue] 
                    : [parseFloat(latitude) || -26.8241, roundedValue];
                setCurrentMarker(newMarker);
                onLocationChange(newMarker[0], roundedValue);
            }
        }
    };

    const handleUseCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    // Redondear a 6 decimales para mantener consistencia
                    const roundedLat = Math.round(latitude * 1000000) / 1000000;
                    const roundedLng = Math.round(longitude * 1000000) / 1000000;
                    
                    setCurrentMarker([roundedLat, roundedLng]);
                    setLatitude(roundedLat.toString());
                    setLongitude(roundedLng.toString());
                    onLocationChange(roundedLat, roundedLng);
                },
                (error) => {
                    console.error('Error obteniendo ubicación:', error);
                    alert('No se pudo obtener tu ubicación actual. Por favor, selecciona la ubicación manualmente en el mapa.');
                }
            );
        } else {
            alert('Tu navegador no soporta geolocalización. Por favor, selecciona la ubicación manualmente en el mapa.');
        }
    };

    const handleClearLocation = () => {
        setCurrentMarker(null);
        setLatitude('');
        setLongitude('');
        onLocationChange(null, null);
    };

    const center = currentMarker || defaultCenter;

    return (
        <div className={`space-y-4 ${className}`}>
            {/* Estilos CSS para el marcador */}
            <style>{markerStyles}</style>
            
            {/* Controles de coordenadas */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="latitude">Latitud</Label>
                    <Input
                        id="latitude"
                        type="number"
                        step="0.000001"
                        value={latitude}
                        onChange={(e) => handleCoordinateChange('lat', e.target.value)}
                        placeholder="-26.8241"
                        min="-90"
                        max="90"
                        onBlur={(e) => {
                            // Redondear al perder el foco para evitar errores de validación
                            const value = parseFloat(e.target.value);
                            if (!isNaN(value)) {
                                const rounded = Math.round(value * 1000000) / 1000000;
                                setLatitude(rounded.toString());
                                if (currentMarker) {
                                    const newMarker: [number, number] = [rounded, currentMarker[1]];
                                    setCurrentMarker(newMarker);
                                    onLocationChange(rounded, currentMarker[1]);
                                }
                            }
                        }}
                    />
                </div>
                <div>
                    <Label htmlFor="longitude">Longitud</Label>
                    <Input
                        id="longitude"
                        type="number"
                        step="0.000001"
                        value={longitude}
                        onChange={(e) => handleCoordinateChange('lng', e.target.value)}
                        placeholder="-65.2226"
                        min="-180"
                        max="180"
                        onBlur={(e) => {
                            // Redondear al perder el foco para evitar errores de validación
                            const value = parseFloat(e.target.value);
                            if (!isNaN(value)) {
                                const rounded = Math.round(value * 1000000) / 1000000;
                                setLongitude(rounded.toString());
                                if (currentMarker) {
                                    const newMarker: [number, number] = [currentMarker[0], rounded];
                                    setCurrentMarker(newMarker);
                                    onLocationChange(currentMarker[0], rounded);
                                }
                            }
                        }}
                    />
                </div>
            </div>

            {/* Botones de acción */}
            <div className="flex gap-2">
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleUseCurrentLocation}
                >
                    <Icon name="map-pin" className="mr-2 h-4 w-4" />
                    Usar Mi Ubicación
                </Button>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleClearLocation}
                >
                    <Icon name="x" className="mr-2 h-4 w-4" />
                    Limpiar Ubicación
                </Button>
            </div>

            {/* Instrucciones */}
            <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-lg">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                    <strong>Instrucciones:</strong> Haz clic en el mapa para seleccionar la ubicación de la propiedad, 
                    o ingresa las coordenadas manualmente en los campos de arriba.
                </p>
            </div>

            {/* Mapa */}
            <div className="relative" style={{ height }}>
                <MapContainer
                    ref={mapRef}
                    center={center}
                    zoom={13}
                    style={{ height: '100%', width: '100%' }}
                    zoomControl={true}
                    scrollWheelZoom={true}
                    dragging={true}
                    touchZoom={true}
                    doubleClickZoom={true}
                    boxZoom={true}
                    keyboard={true}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    
                    <MapCenter center={center} />
                    <MapClickHandler onLocationChange={handleMapClick} />
                    
                    {/* Marcador de la ubicación seleccionada */}
                    {currentMarker && (
                        <Marker
                            position={currentMarker}
                            icon={L.divIcon({
                                className: 'custom-marker',
                                html: '<div></div>',
                                iconSize: [24, 32],
                                iconAnchor: [12, 32]
                            })}
                        />
                    )}
                </MapContainer>
            </div>

            {/* Información adicional */}
            {currentMarker && (
                <div className="bg-green-50 dark:bg-green-950 p-3 rounded-lg">
                    <p className="text-sm text-green-700 dark:text-green-300">
                        <strong>Ubicación seleccionada:</strong> Lat: {currentMarker[0].toFixed(6)}, Lng: {currentMarker[1].toFixed(6)}
                    </p>
                </div>
            )}
        </div>
    );
}
