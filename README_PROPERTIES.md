# Sistema de Gestión de Propiedades

Este sistema permite gestionar propiedades inmobiliarias con funcionalidades completas de CRUD (Crear, Leer, Actualizar, Eliminar).

## Características

- **Gestión completa de propiedades**: Crear, editar, eliminar y listar propiedades
- **Campos de propiedad**:
  - Título
  - Dirección
  - Modalidad (Alquiler/Venta)
  - Moneda (ARS/USD)
  - Precio
  - Amenities (con checkboxes)
  - Imagen de portada
  - Imágenes adicionales (hasta 20)
  - Timestamps y user_id
- **Interfaz moderna**: Diseño responsive con componentes UI modernos
- **Previsualización de imágenes**: Vista previa en tiempo real al subir imágenes
- **Validación**: Validación completa de formularios en el backend
- **Almacenamiento**: Sistema de archivos organizado para imágenes

## Instalación

### 1. Ejecutar migraciones

```bash
php artisan migrate
```

### 2. Crear enlace simbólico para almacenamiento

```bash
php artisan storage:link
```

### 3. Ejecutar seeders (opcional)

```bash
php artisan db:seed
```

## Estructura de Archivos

### Backend

- **Modelos**: `app/Models/Property.php`, `app/Models/PropertyImage.php`
- **Controlador**: `app/Http/Controllers/admin/PropertiesController.php`
- **Migraciones**: 
  - `database/migrations/2024_01_01_000000_create_properties_table.php`
  - `database/migrations/2024_01_01_000001_create_property_images_table.php`
- **Seeder**: `database/seeders/PropertySeeder.php`

### Frontend

- **Vista principal**: `resources/js/pages/admin/properties/index.tsx`
- **Vista de creación**: `resources/js/pages/admin/properties/create.tsx`
- **Vista de edición**: `resources/js/pages/admin/properties/edit.tsx`
- **Componentes UI**: `resources/js/components/ui/table.tsx`

### Rutas

- **Listar**: `GET /admin/properties`
- **Crear**: `GET /admin/properties/create`
- **Guardar**: `POST /admin/properties`
- **Editar**: `GET /admin/properties/{id}/edit`
- **Actualizar**: `PUT /admin/properties/{id}`
- **Eliminar**: `DELETE /admin/properties/{id}`

## Uso

### 1. Acceder al sistema

Navega a `/admin/properties` para ver la lista de propiedades.

### 2. Crear nueva propiedad

1. Haz clic en "Nueva Propiedad"
2. Completa el formulario con:
   - Información básica (título, dirección, modalidad, moneda, precio)
   - Selecciona amenities del listado de checkboxes
   - Sube una imagen de portada
   - Opcionalmente, agrega hasta 20 imágenes adicionales
3. Haz clic en "Crear Propiedad"

### 3. Editar propiedad existente

1. En la lista de propiedades, haz clic en el menú de acciones
2. Selecciona "Editar"
3. Modifica los campos necesarios
4. Haz clic en "Actualizar Propiedad"

### 4. Eliminar propiedad

1. En la lista de propiedades, haz clic en el menú de acciones
2. Selecciona "Eliminar"
3. Confirma la acción

## Amenities Disponibles

- Aire acondicionado
- Calefacción
- WiFi
- Estacionamiento
- Balcón
- Terraza
- Piscina
- Gimnasio
- Seguridad 24/7
- Ascensor
- Jardín
- Cocina equipada
- Lavadora
- Secadora
- Mascotas permitidas

## Almacenamiento de Imágenes

- **Imagen de portada**: Se almacena en `storage/app/public/properties/covers/`
- **Imágenes adicionales**: Se almacenan en `storage/app/public/properties/additional/`
- Las imágenes se organizan automáticamente y se eliminan al eliminar la propiedad

## Personalización

### Agregar nuevos amenities

Edita el array `amenitiesList` en los archivos `create.tsx` y `edit.tsx`.

### Modificar campos de propiedad

1. Actualiza la migración de propiedades
2. Modifica el modelo `Property`
3. Actualiza el controlador
4. Modifica las vistas frontend

### Cambiar límite de imágenes

Modifica la validación en el controlador y las vistas frontend.

## Notas Técnicas

- El sistema utiliza Inertia.js para la comunicación entre frontend y backend
- Las imágenes se validan por tipo (jpeg, png, jpg) y tamaño máximo (5MB)
- Se implementa soft delete para mantener integridad referencial
- El sistema es completamente responsive y funciona en dispositivos móviles

## Solución de Problemas

### Error de almacenamiento

Si las imágenes no se muestran, verifica que el enlace simbólico esté creado:
```bash
php artisan storage:link
```

### Error de permisos

Asegúrate de que el directorio `storage/app/public` tenga permisos de escritura.

### Error de migración

Si hay problemas con las migraciones, puedes revertirlas:
```bash
php artisan migrate:rollback
```

## Contribución

Para contribuir al sistema:

1. Crea una rama para tu feature
2. Implementa los cambios
3. Ejecuta las pruebas
4. Envía un pull request

## Licencia

Este proyecto está bajo la licencia MIT.
