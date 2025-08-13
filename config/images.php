<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Configuración de Imágenes
    |--------------------------------------------------------------------------
    |
    | Aquí puedes configurar los límites y configuraciones para el manejo
    | de imágenes en la aplicación.
    |
    */

    // Tamaño máximo de archivo en KB (2MB = 2048 KB)
    'max_file_size_kb' => env('IMAGE_MAX_SIZE_KB', 2048),
    
    // Tamaño máximo de archivo en MB
    'max_file_size_mb' => env('IMAGE_MAX_SIZE_MB', 2),
    
    // Tipos de archivo permitidos
    'allowed_types' => [
        'image/jpeg',
        'image/jpg', 
        'image/png',
        'image/webp', // Opcional: agregar soporte para WebP
    ],
    
    // Extensiones permitidas
    'allowed_extensions' => [
        'jpg',
        'jpeg',
        'png',
        'webp', // Opcional: agregar soporte para WebP
    ],
    
    // Número máximo de imágenes por propiedad
    'max_images_per_property' => env('MAX_IMAGES_PER_PROPERTY', 20),
    
    // Calidad de compresión para imágenes JPEG (0-100)
    'jpeg_quality' => env('IMAGE_JPEG_QUALITY', 85),
    
    // Calidad de compresión para imágenes PNG (0-9, donde 9 es la máxima compresión)
    'png_compression' => env('IMAGE_PNG_COMPRESSION', 6),
    
    // Dimensiones máximas de imagen (ancho x alto en píxeles)
    'max_dimensions' => [
        'width' => env('IMAGE_MAX_WIDTH', 4096),
        'height' => env('IMAGE_MAX_HEIGHT', 4096),
    ],
    
    // Dimensiones mínimas de imagen (ancho x alto en píxeles)
    'min_dimensions' => [
        'width' => env('IMAGE_MIN_WIDTH', 100),
        'height' => env('IMAGE_MIN_HEIGHT', 100),
    ],
    
    // Configuración de thumbnails
    'thumbnails' => [
        'small' => [
            'width' => 150,
            'height' => 150,
            'quality' => 80,
        ],
        'medium' => [
            'width' => 300,
            'height' => 300,
            'quality' => 85,
        ],
        'large' => [
            'width' => 800,
            'height' => 800,
            'quality' => 90,
        ],
    ],
    
    // Configuración de almacenamiento
    'storage' => [
        'disk' => env('IMAGE_STORAGE_DISK', 'public'),
        'folder_structure' => [
            'covers' => 'covers',
            'additional' => 'additional',
            'thumbnails' => 'thumbnails',
        ],
    ],
    
    // Configuración de validación
    'validation' => [
        'show_warnings_at_percentage' => 80, // Mostrar advertencias cuando el archivo esté al 80% del límite
        'strict_mode' => env('IMAGE_STRICT_MODE', false), // Si es true, rechaza archivos que no cumplan exactamente los requisitos
    ],
];
