# Sistema de Gestión de Propiedades

Un sistema completo de CRUD para propiedades inmobiliarias con gestión de imágenes y seguridad por usuario.

## 🚀 Características

- **CRUD Completo**: Crear, leer, actualizar y eliminar propiedades
- **Gestión de Imágenes**: Imagen de portada + hasta 20 imágenes adicionales
- **Seguridad por Usuario**: Cada usuario solo accede a sus propias propiedades
- **Estructura de Carpetas Segura**: Imágenes organizadas por usuario
- **Validaciones Robustas**: Límites de archivos y tipos de imagen
- **Interfaz Moderna**: React + Inertia.js con componentes UI personalizados

## 📁 Estructura de Carpetas de Imágenes

### 🔒 **Organización por Usuario y Propiedad**
```
storage/app/public/
├── users/
│   ├── 1/                          # Usuario ID 1
│   │   └── properties/
│   │       ├── 1_hermoso-departamento-palermo/  # Propiedad ID 1
│   │       │   ├── covers/         # Imagen de portada
│   │       │   └── additional/     # Imágenes adicionales
│   │       ├── 2_casa-quinta-norte/             # Propiedad ID 2
│   │       │   ├── covers/
│   │       │   └── additional/
│   │       └── ...
│   ├── 2/                          # Usuario ID 2
│   │   └── properties/
│   │       ├── 3_duplex-centro/    # Propiedad ID 3
│   │       │   ├── covers/
│   │       │   └── additional/
│   │       └── ...
│   └── ...
```

### 🛡️ **Ventajas de Seguridad y Organización**
- **Aislamiento Total**: Cada usuario tiene su propia carpeta
- **Organización por Propiedad**: Cada propiedad tiene su carpeta con ID y slug
- **Privacidad Garantizada**: Un usuario no puede acceder a imágenes de otro
- **Fácil Identificación**: Carpetas con formato `{ID}_{slug-titulo}`
- **Limpieza Inteligente**: Eliminación automática de carpetas vacías
- **Backup Selectivo**: Backup granular por usuario o propiedad específica

## 🛠️ Instalación

### 1. **Clonar y Configurar**
```bash
git clone <repository>
cd market-props
composer install
npm install
```

### 2. **Configuración del Entorno**
```bash
cp .env.example .env
php artisan key:generate
```

### 3. **Base de Datos**
```bash
php artisan migrate
php artisan db:seed
```

### 4. **Storage y Enlaces**
```bash
php artisan storage:link
```

### 5. **Compilar Assets**
```bash
npm run dev
```

## 🔧 Uso

### **Comandos Disponibles**

#### Limpiar Carpetas Huérfanas
```bash
php artisan storage:cleanup-orphaned-folders
```
- Elimina carpetas de usuarios que ya no existen
- **NUEVO**: Elimina carpetas de propiedades que ya no existen
- Libera espacio en disco
- Muestra estadísticas detalladas de limpieza
- **Ejemplo de salida:**
  ```
  Eliminando carpeta del usuario 3 (no existe en BD): users/3
  ✓ Carpeta eliminada. Tamaño liberado: 15.2 MB
  
    Eliminando carpeta de propiedad 5 (no existe en BD): users/1/properties/5_casa-vendida
    ✓ Carpeta de propiedad eliminada. Tamaño liberado: 2.1 MB
  ```

### **Gestión de Propiedades**

#### Crear Propiedad
1. Navegar a `/admin/properties/create`
2. Completar formulario con información básica
3. Seleccionar imagen de portada
4. Agregar imágenes adicionales (máximo 20)
5. Seleccionar amenities
6. Guardar

#### Editar Propiedad
1. Navegar a `/admin/properties/{id}/edit`
2. Modificar campos necesarios
3. Cambiar imagen de portada (opcional)
4. Agregar nuevas imágenes adicionales
5. Eliminar imágenes existentes individualmente
6. Actualizar

#### Eliminar Propiedad
- Botón de eliminación en la lista
- Elimina todas las imágenes asociadas
- Limpia carpetas vacías automáticamente

## 🗄️ Base de Datos

### **Tablas Principales**

#### `properties`
- `id`, `title`, `address`, `modality`, `currency`
- `price`, `amenities` (JSON), `cover_image`
- `user_id`, `timestamps`

#### `property_images`
- `id`, `property_id`, `image_path`, `order`
- `timestamps`

### **Relaciones**
- `Property` → `User` (belongsTo)
- `Property` → `PropertyImage` (hasMany)

## 🔐 Seguridad

### **Autorización por Usuario**
- ✅ Usuario solo ve sus propiedades
- ✅ Usuario solo edita sus propiedades
- ✅ Usuario solo elimina sus propiedades
- ✅ Usuario solo accede a sus imágenes

### **Validaciones**
- Límite de 20 imágenes por propiedad
- Tipos de archivo permitidos: jpeg, png, jpg
- Tamaño máximo: 5MB por imagen
- Campos requeridos validados

## 📱 Frontend

### **Componentes React**
- `index.tsx`: Lista de propiedades con tabla
- `create.tsx`: Formulario de creación
- `edit.tsx`: Formulario de edición
- `icon.tsx`: Sistema de iconos Lucide
- `table.tsx`: Componentes de tabla reutilizables

### **Características UI**
- Previsualización de imágenes en tiempo real
- Drag & drop para múltiples imágenes
- Contador de imágenes restantes
- Indicadores de carga
- Mensajes de error claros
- Diseño responsive

## 🧹 Mantenimiento

### **Limpieza Automática**
- Carpetas vacías se eliminan automáticamente
- Comando para limpiar carpetas huérfanas
- Gestión de espacio en disco

### **Backup Recomendado**
```bash
# Backup de imágenes por usuario específico
tar -czf user_1_images_backup.tar.gz storage/app/public/users/1/

# Backup de imágenes por propiedad específica
tar -czf property_1_images_backup.tar.gz storage/app/public/users/1/properties/1_hermoso-departamento-palermo/

# Backup de todas las imágenes de usuarios
tar -czf all_users_images_backup.tar.gz storage/app/public/users/

# Backup de base de datos
php artisan db:backup
```

## 🚨 Solución de Problemas

### **Imágenes No Se Muestran**
1. Verificar enlace simbólico: `php artisan storage:link`
2. Verificar permisos de carpeta storage
3. Verificar configuración de filesystem

### **Error de Permisos**
1. Verificar que el usuario esté autenticado
2. Verificar que la propiedad pertenezca al usuario
3. Revisar logs de Laravel

### **Límite de Imágenes Excedido**
- Máximo 20 imágenes por propiedad
- Eliminar imágenes existentes antes de agregar nuevas
- Verificar contador en la interfaz

## 📈 Personalización

### **Agregar Nuevos Campos**
1. Crear migración para nuevos campos
2. Actualizar modelo `Property`
3. Modificar formularios React
4. Actualizar validaciones del controlador

### **Cambiar Límite de Imágenes**
1. Modificar validación en controlador
2. Actualizar lógica de frontend
3. Ajustar mensajes de error

### **Nuevos Tipos de Archivo**
1. Modificar validación `mimes` en controlador
2. Actualizar atributo `accept` en inputs
3. Verificar compatibilidad del navegador

## 🤝 Contribución

1. Fork del proyecto
2. Crear rama para feature
3. Commit de cambios
4. Push a la rama
5. Crear Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

---

**Desarrollado con ❤️ usando Laravel, React, Inertia.js y Tailwind CSS**
