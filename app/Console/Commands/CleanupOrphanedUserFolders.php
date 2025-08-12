<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;

class CleanupOrphanedUserFolders extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'storage:cleanup-orphaned-folders';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Limpiar carpetas de usuarios que ya no existen en la base de datos';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Iniciando limpieza de carpetas huérfanas...');

        $disk = Storage::disk('public');
        $usersPath = 'users';

        // Verificar si existe la carpeta users
        if (!$disk->exists($usersPath)) {
            $this->info('No existe la carpeta users. Nada que limpiar.');
            return 0;
        }

        // Obtener todas las carpetas de usuarios en storage
        $userFolders = $disk->directories($usersPath);
        $this->info("Encontradas " . count($userFolders) . " carpetas de usuarios en storage.");

        // Obtener todos los IDs de usuarios en la base de datos
        $existingUserIds = User::pluck('id')->toArray();
        $this->info("Encontrados " . count($existingUserIds) . " usuarios en la base de datos.");

        $deletedFolders = 0;
        $deletedSize = 0;

        foreach ($userFolders as $userFolder) {
            // Extraer el ID del usuario de la ruta (users/123/properties)
            $parts = explode('/', $userFolder);
            if (count($parts) >= 2 && is_numeric($parts[1])) {
                $userId = (int) $parts[1];

                // Si el usuario no existe en la base de datos, eliminar su carpeta
                if (!in_array($userId, $existingUserIds)) {
                    $this->warn("Eliminando carpeta del usuario {$userId} (no existe en BD): {$userFolder}");
                    
                    // Calcular tamaño antes de eliminar
                    $folderSize = $this->calculateFolderSize($disk, $userFolder);
                    
                    // Eliminar toda la carpeta del usuario
                    $disk->deleteDirectory($userFolder);
                    
                    $deletedFolders++;
                    $deletedSize += $folderSize;
                    
                    $this->info("✓ Carpeta eliminada. Tamaño liberado: " . $this->formatBytes($folderSize));
                } else {
                    // Si el usuario existe, verificar carpetas de propiedades huérfanas
                    $this->cleanupOrphanedPropertyFolders($disk, $userId);
                }
            }
        }

        if ($deletedFolders > 0) {
            $this->info("\n✅ Limpieza completada:");
            $this->info("   - Carpetas eliminadas: {$deletedFolders}");
            $this->info("   - Espacio liberado: " . $this->formatBytes($deletedSize));
        } else {
            $this->info("\n✅ No se encontraron carpetas huérfanas para eliminar.");
        }

        return 0;
    }

    /**
     * Limpiar carpetas de propiedades huérfanas de un usuario específico
     */
    private function cleanupOrphanedPropertyFolders($disk, int $userId): void
    {
        $propertiesPath = "users/{$userId}/properties";
        
        if (!$disk->exists($propertiesPath)) {
            return;
        }

        // Obtener todas las carpetas de propiedades del usuario
        $propertyFolders = $disk->directories($propertiesPath);
        
        if (empty($propertyFolders)) {
            return;
        }

        // Obtener todas las propiedades del usuario desde la base de datos
        $existingProperties = \App\Models\Property::where('user_id', $userId)
            ->get(['id', 'title'])
            ->keyBy('id');

        foreach ($propertyFolders as $propertyFolder) {
            // Extraer el ID de la propiedad de la ruta (users/123/properties/456_nombre-propiedad)
            $parts = explode('/', $propertyFolder);
            if (count($parts) >= 3) {
                $propertyIdPart = $parts[2];
                $propertyId = (int) explode('_', $propertyIdPart)[0];

                // Si la propiedad no existe en la base de datos, eliminar su carpeta
                if (!$existingProperties->has($propertyId)) {
                    $this->warn("  Eliminando carpeta de propiedad {$propertyId} (no existe en BD): {$propertyFolder}");
                    
                    $folderSize = $this->calculateFolderSize($disk, $propertyFolder);
                    $disk->deleteDirectory($propertyFolder);
                    
                    $this->info("  ✓ Carpeta de propiedad eliminada. Tamaño liberado: " . $this->formatBytes($folderSize));
                }
            }
        }
    }

    /**
     * Calcular el tamaño total de una carpeta
     */
    private function calculateFolderSize($disk, $path): int
    {
        $size = 0;
        $files = $disk->allFiles($path);
        
        foreach ($files as $file) {
            $size += $disk->size($file);
        }
        
        return $size;
    }

    /**
     * Formatear bytes en formato legible
     */
    private function formatBytes(int $bytes): string
    {
        $units = ['B', 'KB', 'MB', 'GB'];
        $bytes = max($bytes, 0);
        $pow = floor(($bytes ? log($bytes) : 0) / log(1024));
        $pow = min($pow, count($units) - 1);
        
        $bytes /= pow(1024, $pow);
        
        return round($bytes, 2) . ' ' . $units[$pow];
    }
}
