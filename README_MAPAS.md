# Funcionalidad de Mapas - Market Props

## Descripción

Se ha implementado una funcionalidad completa de mapas para el proyecto Market Props, que incluye:

1. **Autocompletado de direcciones** con mapa interactivo para administradores
2. **Mapa público** con todas las propiedades en la landing page
3. **Integración con OpenStreetMap** usando la API gratuita de Nominatim

## Características Implementadas

### Para Administradores

- **Campo de dirección inteligente**: Autocompletado con sugerencias de direcciones
- **Mapa interactivo**: Permite seleccionar ubicación exacta haciendo clic en el mapa
- **Geocoding inverso**: Convierte coordenadas en direcciones legibles
- **Validación de coordenadas**: Almacena latitud y longitud en la base de datos

### Para Público General

- **Mapa de propiedades**: Visualización de todas las propiedades disponibles
- **Marcadores interactivos**: Clic en marcadores para ver detalles y redirigir a la propiedad
- **Centrado automático**: El mapa se centra en San Miguel de Tucumán por defecto

## Tecnologías Utilizadas

- **React Leaflet**: Biblioteca de mapas para React
- **OpenStreetMap**: Mapas gratuitos y de código abierto
- **Nominatim API**: Servicio gratuito de geocoding
- **TypeScript**: Tipado estático para mejor desarrollo

## Instalación y Configuración

### Dependencias

Las siguientes dependencias ya están instaladas:
```bash
npm install leaflet @types/leaflet react-leaflet
```

### Migración de Base de Datos

Se ha creado una migración para agregar campos de coordenadas:
```bash
php artisan migrate
```

Los nuevos campos son:
- `latitude` (decimal 10,8) - nullable
- `longitude` (decimal 11,8) - nullable

## Uso

### Componente de Autocompletado de Direcciones

```tsx
import { AddressAutocomplete } from "@/components/ui/address-autocomplete";

<AddressAutocomplete
    value={address}
    onChange={setAddress}
    onLocationSelect={(location) => {
        // location.lat, location.lng, location.address
    }}
    label="Dirección"
    placeholder="Ingresa la dirección..."
    showMap={true}
    mapHeight="300px"
/>
```

### Componente de Mapa

```tsx
import { Map } from "@/components/ui/map";

<Map
    locations={properties}
    center={[-26.8241, -65.2226]} // San Miguel de Tucumán
    zoom={10}
    height="500px"
    interactive={true}
    onLocationSelect={(location) => {
        // Manejar selección de ubicación
    }}
/>
```

## Estructura de Datos

### MapLocation Interface

```typescript
interface MapLocation {
    id?: string | number;
    lat: number;
    lng: number;
    title?: string;
    address?: string;
    price?: string;
    modality?: string;
    currency?: string;
}
```

### Propiedades en Base de Datos

Las propiedades ahora incluyen:
- `latitude`: Coordenada de latitud
- `longitude`: Coordenada de longitud

## API de Geocoding

### Búsqueda de Direcciones
```
GET https://nominatim.openstreetmap.org/search?format=json&q={query}&countrycodes=ar&limit=5
```

### Geocoding Inverso
```
GET https://nominatim.openstreetmap.org/reverse?format=json&lat={lat}&lon={lng}
```

## Estilos CSS

Se han agregado estilos personalizados para:
- Popups de Leaflet
- Modo oscuro
- Clusters de marcadores (preparado para futuras implementaciones)

## Limitaciones y Consideraciones

1. **Rate Limiting**: Nominatim tiene límites de uso (1 petición por segundo)
2. **Precisión**: Las coordenadas se almacenan con 8 decimales de precisión
3. **País**: Las búsquedas están limitadas a Argentina (`countrycodes=ar`)

## Futuras Mejoras

- [ ] Implementar clustering de marcadores para mejor rendimiento
- [ ] Agregar filtros por zona en el mapa público
- [ ] Implementar búsqueda por proximidad
- [ ] Agregar diferentes tipos de marcadores por modalidad
- [ ] Implementar cache local de geocoding

## Solución de Problemas

### Error de Build
Si hay errores de build relacionados con Leaflet:
```bash
npm install leaflet @types/leaflet
```

### Mapa No Se Renderiza
Verificar que los estilos de Leaflet estén importados:
```tsx
import 'leaflet/dist/leaflet.css';
```

### Iconos No Se Muestran
Los iconos de Leaflet se cargan desde CDN para evitar problemas de bundling.

## Contribución

Para contribuir a esta funcionalidad:
1. Mantener compatibilidad con TypeScript
2. Seguir las convenciones de React Leaflet
3. Probar en diferentes navegadores
4. Documentar cambios en este README
