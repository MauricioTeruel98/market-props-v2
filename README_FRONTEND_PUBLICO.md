# Frontend Público de Market Props

Este documento describe el frontend público creado para mostrar las propiedades de Market Props sin necesidad de autenticación.

## 🏗️ Estructura del Frontend

### Páginas Creadas

1. **Landing Page** (`/`)
   - Página principal con hero section
   - Características destacadas
   - Propiedades destacadas (últimas 6)
   - Call-to-action para registro

2. **Listado de Propiedades** (`/public/properties`)
   - Grid de propiedades con paginación
   - Filtros avanzados (búsqueda, modalidad, precio, amenities)
   - Diseño responsive con sidebar de filtros
   - Filtros móviles en sheet lateral

3. **Detalle de Propiedad** (`/public/properties/{id}`)
   - Galería de imágenes con modal
   - Información completa de la propiedad
   - Amenities y detalles
   - Propiedades relacionadas
   - Información de contacto

### Componentes y Layouts

- **PublicLayout**: Layout reutilizable con header y footer
- **Filtros**: Sistema de filtros avanzados con persistencia en URL
- **Galería**: Galería de imágenes con navegación por thumbnails
- **Cards**: Cards de propiedades con hover effects

## 🚀 Características Implementadas

### Filtros de Búsqueda
- **Búsqueda por texto**: Título y dirección
- **Modalidad**: Alquiler o Venta
- **Rango de precios**: Mínimo y máximo
- **Amenities**: Filtro por características (Piscina, Gimnasio, etc.)

### Diseño Responsive
- **Desktop**: Sidebar de filtros fijo
- **Mobile**: Filtros en sheet lateral
- **Grid adaptativo**: 1 columna en mobile, 2 en tablet, 3 en desktop

### Funcionalidades
- **Paginación**: Navegación entre páginas de resultados
- **Imágenes**: Galería con modal y navegación
- **Propiedades relacionadas**: Sugerencias basadas en modalidad
- **Breadcrumbs**: Navegación jerárquica

## 📁 Archivos Creados

```
resources/js/
├── pages/public/
│   ├── landing.tsx                 # Página principal
│   └── properties/
│       ├── index.tsx               # Listado con filtros
│       └── show.tsx                # Detalle de propiedad
├── layouts/
│   └── public-layout.tsx           # Layout público reutilizable

app/Http/Controllers/Public/
└── PropertiesController.php         # Controlador público

database/seeders/
└── PublicPropertiesSeeder.php       # Datos de ejemplo
```

## 🛠️ Instalación y Configuración

### 1. Ejecutar Migraciones
```bash
php artisan migrate
```

### 2. Ejecutar Seeders
```bash
php artisan db:seed
```

### 3. Compilar Assets
```bash
npm run build
```

### 4. Configurar Storage
```bash
php artisan storage:link
```

## 🎨 Personalización

### Colores y Tema
Los colores principales están definidos en las clases de Tailwind:
- **Primario**: `blue-600` (botones principales)
- **Secundario**: `purple-600` (gradientes)
- **Acentos**: `gray-900`, `gray-600`, `gray-300`

### Tipografía
- **Títulos**: `font-bold` con tamaños `text-2xl` a `text-6xl`
- **Subtítulos**: `font-semibold` con `text-lg` a `text-xl`
- **Texto**: `font-medium` y `font-normal`

### Espaciado
- **Secciones**: `py-20` (padding vertical)
- **Contenido**: `px-4 sm:px-6 lg:px-8` (padding horizontal responsive)
- **Gaps**: `gap-4`, `gap-6`, `gap-8` para espaciado entre elementos

## 🔧 Funcionalidades Técnicas

### Estado de Filtros
- Los filtros se mantienen en la URL como query parameters
- Persistencia entre navegaciones
- Sincronización con el backend

### Optimización de Imágenes
- Lazy loading implícito
- Thumbnails para navegación
- Modal para vista ampliada

### SEO
- Títulos dinámicos por página
- Meta tags con Inertia Head
- URLs amigables para SEO

## 📱 Responsive Design

### Breakpoints
- **Mobile**: `< 768px` - Filtros en sheet, 1 columna
- **Tablet**: `768px - 1024px` - 2 columnas, filtros inline
- **Desktop**: `> 1024px` - 3 columnas, sidebar fijo

### Componentes Adaptativos
- **Header**: Navegación colapsable en mobile
- **Filtros**: Sheet lateral en mobile, sidebar en desktop
- **Grid**: Columnas adaptativas según viewport

## 🚀 Próximas Mejoras

### Funcionalidades Planificadas
- [ ] Búsqueda por ubicación con mapas
- [ ] Filtros por fecha de publicación
- [ ] Sistema de favoritos
- [ ] Comparador de propiedades
- [ ] Notificaciones de nuevas propiedades

### Optimizaciones Técnicas
- [ ] Lazy loading de imágenes
- [ ] Virtualización de listas largas
- [ ] Cache de filtros
- [ ] PWA capabilities

## 🐛 Solución de Problemas

### Problemas Comunes

1. **Imágenes no se muestran**
   - Verificar que `storage:link` esté ejecutado
   - Comprobar permisos de carpeta storage

2. **Filtros no funcionan**
   - Verificar que el controlador esté registrado
   - Comprobar rutas en `web.php`

3. **Layout no se aplica**
   - Verificar import del PublicLayout
   - Comprobar que el componente esté envuelto

### Debug
- Usar `php artisan route:list` para verificar rutas
- Revisar logs en `storage/logs/laravel.log`
- Verificar consola del navegador para errores JS

## 📞 Soporte

Para soporte técnico o consultas sobre el frontend público:
- Crear un issue en el repositorio
- Contactar al equipo de desarrollo
- Revisar la documentación de Laravel e Inertia.js
