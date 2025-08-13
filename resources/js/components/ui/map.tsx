import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Estilos personalizados para los popups
const customPopupStyles = `
    .custom-popup .leaflet-popup-content-wrapper {
        background: white;
        border-radius: 12px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
        border: none;
        padding: 0;
        overflow: hidden;
    }
    
    .custom-popup .leaflet-popup-content {
        margin: 0;
        width: 256px !important;
        min-width: 256px !important;
    }
    
    .custom-popup .leaflet-popup-tip {
        background: white;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
    }
    
    .custom-popup .leaflet-popup-close-button {
        color: #6b7280;
        font-size: 18px;
        font-weight: bold;
        padding: 8px;
        right: 8px;
        top: 8px;
        background: rgba(255, 255, 255, 0.9);
        border-radius: 50%;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s ease;
    }
    
    .custom-popup .leaflet-popup-close-button:hover {
        background: white;
        color: #374151;
        transform: scale(1.1);
    }
    
    .line-clamp-2 {
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }
    
    .custom-tooltip .leaflet-tooltip-content {
        background: rgba(0, 0, 0, 0.8);
        color: white;
        border-radius: 8px;
        padding: 8px 12px;
        font-size: 12px;
        border: none;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    }
    
    .custom-tooltip .leaflet-tooltip-top:before {
        border-top-color: rgba(0, 0, 0, 0.8);
    }
`;

// Insertar estilos en el head del documento
if (typeof document !== 'undefined') {
    const styleElement = document.createElement('style');
    styleElement.textContent = customPopupStyles;
    document.head.appendChild(styleElement);
}

// Fix para los iconos de Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export interface MapLocation {
    id?: string | number;
    lat: number;
    lng: number;
    title?: string;
    address?: string;
    price?: string;
    modality?: string;
    currency?: string;
    cover_image?: string;
    user?: {
        name: string;
    };
}

interface MapProps {
    locations?: MapLocation[];
    center?: [number, number];
    zoom?: number;
    height?: string;
    className?: string;
    onLocationSelect?: (location: MapLocation) => void;
    interactive?: boolean;
}

// Componente para centrar el mapa cuando cambien las ubicaciones
function MapCenter({ center }: { center: [number, number] }) {
    const map = useMap();
    
    useEffect(() => {
        if (center) {
            map.setView(center);
        }
    }, [center, map]);
    
    return null;
}

// Componente para manejar eventos del mapa
function MapEvents({ onMapClick }: { onMapClick?: (lat: number, lng: number) => void }) {
    const map = useMap();
    
    useEffect(() => {
        if (!onMapClick) return;
        
        const handleClick = (e: L.LeafletMouseEvent) => {
            onMapClick(e.latlng.lat, e.latlng.lng);
        };
        
        map.on('click', handleClick);
        
        return () => {
            map.off('click', handleClick);
        };
    }, [map, onMapClick]);
    
    return null;
}

export function Map({ 
    locations = [], 
    center = [-26.8241, -65.2226], // San Miguel de Tucumán por defecto
    zoom = 13,
    height = "400px",
    className = "",
    onLocationSelect,
    interactive = true
}: MapProps) {
    const mapRef = useRef<L.Map>(null);

    const handleMarkerClick = (location: MapLocation) => {
        if (onLocationSelect) {
            onLocationSelect(location);
        }
    };

    const renderMarkers = () => {
        return locations.map((location, index) => (
            <Marker
                key={location.id || index}
                position={[location.lat, location.lng]}
                eventHandlers={{
                    click: () => handleMarkerClick(location)
                }}
            >
                {/* Tooltip que se muestra al hacer hover */}
                <Tooltip
                    direction="top"
                    offset={[0, -10]}
                    className="custom-tooltip"
                    permanent={false}
                    sticky={true}
                >
                    <div className="text-center">
                        <div className="font-semibold text-sm text-gray-900 mb-1">
                            {location.title || 'Propiedad'}
                        </div>
                        {location.price && (
                            <div className="text-sm font-bold text-blue-600">
                                {location.currency === 'dollar' ? 'USD' : 'ARS'} {location.price}
                                {location.modality === 'rent' ? '/mes' : ''}
                            </div>
                        )}
                        <div className={`inline-block px-2 py-1 text-xs font-medium rounded-full mt-1 ${
                            location.modality === 'rent' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-blue-100 text-blue-800'
                        }`}>
                            {location.modality === 'rent' ? 'Alquiler' : 'Venta'}
                        </div>
                    </div>
                </Tooltip>
                
                <Popup className="custom-popup">
                    <div className="w-64 p-0 overflow-hidden">
                        {/* Imagen de portada */}
                        {location.cover_image && (
                            <div className="w-full h-32 overflow-hidden">
                                <img
                                    src={`/storage/${location.cover_image}`}
                                    alt={location.title || 'Propiedad'}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        )}
                        
                        {/* Contenido del popup */}
                        <div className="p-4">
                            {/* Título y modalidad */}
                            {location.title && (
                                <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2">
                                    {location.title}
                                </h3>
                            )}
                            
                            {/* Dirección */}
                            {location.address && (
                                <p className="text-sm text-gray-600 mb-3 flex items-center">
                                    <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    {location.address}
                                </p>
                            )}
                            
                            {/* Precio y modalidad */}
                            {location.price && (
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-lg font-bold text-blue-600">
                                        {location.currency === 'dollar' ? 'USD' : 'ARS'} {location.price}
                                        {location.modality === 'rent' ? '/mes' : ''}
                                    </span>
                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                        location.modality === 'rent' 
                                            ? 'bg-green-100 text-green-800' 
                                            : 'bg-blue-100 text-blue-800'
                                    }`}>
                                        {location.modality === 'rent' ? 'Alquiler' : 'Venta'}
                                    </span>
                                </div>
                            )}
                            
                            {/* Propietario */}
                            {location.user?.name && (
                                <p className="text-xs text-gray-500 mb-4 flex items-center">
                                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    {location.user.name}
                                </p>
                            )}
                            
                            {/* Botón para ver detalles */}
                            {location.id && (
                                <button
                                    onClick={() => {
                                        if (location.id) {
                                            window.location.href = `/public/properties/${location.id}`;
                                        }
                                    }}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
                                >
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                    Ver Detalles
                                </button>
                            )}
                        </div>
                    </div>
                </Popup>
            </Marker>
        ));
    };

    return (
        <div className={`relative ${className}`} style={{ height }}>
            <MapContainer
                ref={mapRef}
                center={center}
                zoom={zoom}
                style={{ height: '100%', width: '100%' }}
                zoomControl={interactive}
                scrollWheelZoom={interactive}
                dragging={interactive}
                touchZoom={interactive}
                doubleClickZoom={interactive}
                boxZoom={interactive}
                keyboard={interactive}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <MapCenter center={center} />
                <MapEvents onMapClick={(lat, lng) => {
                    if (onLocationSelect) {
                        onLocationSelect({
                            id: undefined,
                            lat,
                            lng,
                            title: '',
                            address: '',
                            price: '',
                            modality: '',
                            currency: ''
                        });
                    }
                }} />
                {renderMarkers()}
            </MapContainer>
        </div>
    );
}