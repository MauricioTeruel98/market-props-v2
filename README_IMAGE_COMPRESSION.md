# Compresión de Imágenes - Market Props

## Descripción

Se ha implementado un sistema de compresión automática de imágenes en el frontend para optimizar el tamaño de las imágenes antes de subirlas al servidor. Esto mejora significativamente la velocidad de carga y reduce el uso de almacenamiento.

## Características

### ✅ Funcionalidades Implementadas

- **Compresión automática**: Las imágenes se comprimen automáticamente al seleccionarlas
- **Optimización inteligente**: 
  - Tamaño máximo: 1MB por imagen
  - Resolución máxima: 1920px (ancho o alto)
  - Calidad: 80% (mantiene buena calidad visual)
- **Progreso en tiempo real**: Muestra el progreso de compresión
- **Estadísticas detalladas**: Información sobre el ahorro de espacio
- **Manejo de errores**: Fallback a imagen original si falla la compresión
- **Soporte múltiple**: Funciona tanto para imagen de portada como para imágenes adicionales
- **Edición inteligente**: En la edición, solo comprime las nuevas imágenes, mantiene las existentes

### 🛠️ Tecnologías Utilizadas

- **browser-image-compression**: Librería principal para compresión
- **React Hooks**: Hook personalizado `useImageCompression`
- **TypeScript**: Tipado completo para mejor desarrollo
- **Tailwind CSS**: Estilos modernos y responsivos

## Archivos Creados/Modificados

### Nuevos Archivos

1. **`resources/js/hooks/use-image-compression.tsx`**
   - Hook personalizado para manejar la compresión
   - Funciones para comprimir una o múltiples imágenes
   - Manejo de progreso y errores

2. **`resources/js/components/ui/compression-stats.tsx`**
   - Componente para mostrar estadísticas de compresión
   - Información detallada sobre ahorro de espacio
   - Visualización de ratios de compresión

3. **`resources/js/components/ui/compression-progress.tsx`**
   - Componente para mostrar progreso de compresión
   - Barra de progreso animada
   - Información del archivo actual

### Archivos Modificados

1. **`resources/js/pages/admin/properties/create.tsx`**
   - Integración de compresión en imagen de portada
   - Integración de compresión en imágenes adicionales
   - Visualización de estadísticas y progreso

2. **`resources/js/pages/admin/properties/edit.tsx`**
   - Integración de compresión en imagen de portada (al cambiar)
   - Integración de compresión en nuevas imágenes adicionales
   - Visualización de estadísticas y progreso
   - Mantiene las imágenes existentes sin modificar

3. **`package.json`**
   - Agregada dependencia `browser-image-compression`

## Configuración de Compresión

### Opciones por Defecto

```typescript
const defaultOptions = {
    maxSizeMB: 1,           // Tamaño máximo en MB
    maxWidthOrHeight: 1920, // Resolución máxima
    useWebWorker: true,     // Usar Web Worker para mejor rendimiento
    fileType: 'image/jpeg', // Formato de salida
    quality: 0.8,           // Calidad (0.1 - 1.0)
};
```

### Personalización

Puedes modificar las opciones de compresión en el hook:

```typescript
const compressionResult = await compressImage(file, {
    maxSizeMB: 0.5,        // Más compresión
    maxWidthOrHeight: 1280, // Resolución menor
    quality: 0.7,          // Calidad menor
});
```

## Uso

### Comportamiento en Creación vs Edición

#### 🆕 **Creación de Propiedades**
- **Imagen de portada**: Se comprime automáticamente al seleccionarla
- **Imágenes adicionales**: Todas las imágenes seleccionadas se comprimen
- **Estadísticas**: Se muestran para todas las imágenes procesadas

#### ✏️ **Edición de Propiedades**
- **Imagen de portada**: Solo se comprime si se selecciona una nueva imagen
- **Imágenes existentes**: Se mantienen sin modificar (no se re-comprimen)
- **Nuevas imágenes**: Solo las imágenes adicionales se comprimen
- **Estadísticas**: Se muestran solo para las nuevas imágenes procesadas

### Compresión de Imagen Única

```typescript
import { useImageCompression } from '@/hooks/use-image-compression';

const { compressImage } = useImageCompression();

const handleImageUpload = async (file: File) => {
    const result = await compressImage(file);
    // result.compressedFile contiene la imagen comprimida
};
```

### Compresión Múltiple

```typescript
const { compressMultipleImages } = useImageCompression();

const handleMultipleImages = async (files: File[]) => {
    const results = await compressMultipleImages(files);
    // results contiene array de resultados de compresión
};
```

## Estadísticas de Compresión

El sistema proporciona estadísticas detalladas:

- **Tamaño original vs comprimido**
- **Porcentaje de ahorro**
- **Espacio total ahorrado**
- **Ratio de compresión promedio**

### Ejemplo de Estadísticas

```
📊 Estadísticas de Compresión

Imágenes: 5
Tamaño Original: 12.5 MB
Tamaño Final: 2.1 MB
Espacio Ahorrado: 10.4 MB

🎯 83.2% de compresión promedio
```

## Beneficios

### 🚀 Rendimiento
- **Carga más rápida**: Imágenes más pequeñas se cargan más rápido
- **Menos ancho de banda**: Reduce el uso de datos
- **Mejor UX**: Menor tiempo de espera para los usuarios

### 💾 Almacenamiento
- **Ahorro significativo**: Hasta 80% de reducción en tamaño
- **Menor costo**: Reduce costos de almacenamiento en el servidor
- **Escalabilidad**: Permite manejar más imágenes sin problemas

### 📱 Compatibilidad
- **Móviles**: Mejor rendimiento en dispositivos móviles
- **Conexiones lentas**: Funciona bien con conexiones limitadas
- **Navegadores**: Compatible con todos los navegadores modernos

## Manejo de Errores

El sistema incluye manejo robusto de errores:

1. **Validación de archivos**: Verifica que sean imágenes válidas
2. **Fallback automático**: Usa imagen original si falla la compresión
3. **Mensajes informativos**: Notifica al usuario sobre problemas
4. **Logging**: Registra errores para debugging

## Consideraciones Técnicas

### Web Workers
- La compresión se ejecuta en Web Workers para no bloquear la UI
- Mejor experiencia de usuario durante el procesamiento

### Memoria
- Las imágenes se procesan una por una para evitar problemas de memoria
- Limpieza automática de recursos después de la compresión

### Formatos Soportados
- JPEG, PNG, WebP
- Conversión automática a JPEG para mejor compresión

## Próximas Mejoras

### 🎯 Funcionalidades Futuras

1. **Compresión selectiva**: Permitir al usuario elegir qué imágenes comprimir
2. **Configuración personalizable**: Interfaz para ajustar opciones de compresión
3. **Previsualización antes/después**: Comparación visual de la compresión
4. **Compresión por lotes**: Procesamiento en segundo plano
5. **Métricas avanzadas**: Historial de compresiones y estadísticas

### 🔧 Optimizaciones

1. **Compresión progresiva**: Compresión en múltiples pasos
2. **Algoritmos avanzados**: Implementar diferentes algoritmos de compresión
3. **Cache inteligente**: Cachear resultados de compresión
4. **Compresión adaptativa**: Ajustar calidad según el tipo de imagen

## Instalación y Configuración

### 1. Instalar Dependencia

```bash
npm install browser-image-compression
```

### 2. Verificar Instalación

```bash
npm list browser-image-compression
```

### 3. Build del Proyecto

```bash
npm run build
```

## Soporte

Si encuentras problemas con la compresión de imágenes:

1. **Verificar consola**: Revisar errores en la consola del navegador
2. **Tamaño de archivo**: Asegurar que las imágenes no excedan 5MB
3. **Formato**: Verificar que sean formatos de imagen válidos
4. **Navegador**: Probar en diferentes navegadores

## Contribución

Para contribuir a la mejora del sistema de compresión:

1. Crear un issue describiendo la mejora
2. Implementar la funcionalidad
3. Agregar tests si es necesario
4. Documentar los cambios
5. Crear un pull request

---

**Desarrollado para Market Props** 🏠
*Optimizando la experiencia de carga de imágenes desde 2024*
