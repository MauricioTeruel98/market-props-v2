<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use App\Models\Property;

class UpdateMessengerUrls extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'properties:update-messenger-urls {user_id? : ID del usuario específico}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Actualiza las URLs de Messenger de las propiedades basándose en las URLs de Facebook de los usuarios';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $userId = $this->argument('user_id');
        
        if ($userId) {
            $users = User::where('id', $userId)->get();
        } else {
            $users = User::whereNotNull('facebook')->get();
        }

        $this->info("Procesando {$users->count()} usuarios...");
        
        $updatedProperties = 0;
        
        foreach ($users as $user) {
            if (!$user->facebook) {
                $this->warn("Usuario {$user->id} no tiene URL de Facebook configurada");
                continue;
            }
            
            $messengerUrl = $this->convertFacebookToMessenger($user->facebook);
            
            // Actualizar todas las propiedades del usuario
            $properties = Property::where('user_id', $user->id)->get();
            
            foreach ($properties as $property) {
                if ($property->facebook_messenger !== $messengerUrl) {
                    $property->update(['facebook_messenger' => $messengerUrl]);
                    $updatedProperties++;
                    $this->line("  - Propiedad {$property->id}: {$property->title}");
                }
            }
            
            $this->info("Usuario {$user->id}: {$user->name} - Facebook: {$user->facebook} → Messenger: {$messengerUrl}");
        }
        
        $this->info("¡Completado! Se actualizaron {$updatedProperties} propiedades.");
        
        return 0;
    }

    /**
     * Convertir URL de Facebook a URL de Messenger
     */
    private function convertFacebookToMessenger(string $facebookUrl): string
    {
        // Extraer el nombre de usuario de la URL de Facebook
        if (preg_match('/facebook\.com\/([^\/\?]+)/', $facebookUrl, $matches)) {
            $username = $matches[1];
            // Remover parámetros adicionales si los hay
            $username = explode('?', $username)[0];
            return "https://m.me/{$username}";
        }
        
        return $facebookUrl; // Si no se puede convertir, devolver la URL original
    }
}
