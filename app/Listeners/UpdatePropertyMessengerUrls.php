<?php

namespace App\Listeners;

use App\Models\Property;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class UpdatePropertyMessengerUrls
{
    use InteractsWithQueue;

    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle($event): void
    {
        $user = $event->user;
        
        // Solo procesar si el usuario tiene Facebook configurado
        if (!$user->facebook) {
            return;
        }
        
        // Generar nueva URL de Messenger
        $messengerUrl = $this->convertFacebookToMessenger($user->facebook);
        
        // Actualizar todas las propiedades del usuario
        Property::where('user_id', $user->id)
            ->update(['facebook_messenger' => $messengerUrl]);
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
