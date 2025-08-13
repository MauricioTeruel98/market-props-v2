<?php

namespace App\Helpers;

class FacebookHelper
{
    /**
     * Convertir URL de Facebook a URL de Messenger
     * 
     * @param string $facebookUrl
     * @return string
     */
    public static function toMessenger(string $facebookUrl): string
    {
        if (empty($facebookUrl)) {
            return '';
        }
        
        // Extraer el nombre de usuario de la URL de Facebook
        if (preg_match('/facebook\.com\/([^\/\?]+)/', $facebookUrl, $matches)) {
            $username = $matches[1];
            // Remover parámetros adicionales si los hay
            $username = explode('?', $username)[0];
            return "https://m.me/{$username}";
        }
        
        return $facebookUrl; // Si no se puede convertir, devolver la URL original
    }

    /**
     * Extraer solo el nombre de usuario de la URL de Facebook
     * 
     * @param string $facebookUrl
     * @return string|null
     */
    public static function extractUsername(string $facebookUrl): ?string
    {
        if (preg_match('/facebook\.com\/([^\/\?]+)/', $facebookUrl, $matches)) {
            $username = $matches[1];
            return explode('?', $username)[0];
        }
        
        return null;
    }

    /**
     * Verificar si una URL es válida de Facebook
     * 
     * @param string $facebookUrl
     * @return bool
     */
    public static function isValidFacebookUrl(string $facebookUrl): bool
    {
        return preg_match('/^https?:\/\/(www\.)?facebook\.com\/[^\/\?]+/', $facebookUrl);
    }
}
