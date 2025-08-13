<?php

namespace App\Helpers;

class CoordinateHelper
{
    /**
     * Redondea una coordenada a 6 decimales para mantener consistencia
     * 6 decimales proporcionan una precisión de aproximadamente 1 metro
     */
    public static function roundCoordinate(?float $coordinate): ?float
    {
        if ($coordinate === null) {
            return null;
        }
        
        return round($coordinate * 1000000) / 1000000;
    }
    
    /**
     * Redondea tanto latitud como longitud
     */
    public static function roundCoordinates(?float $latitude, ?float $longitude): array
    {
        return [
            'latitude' => self::roundCoordinate($latitude),
            'longitude' => self::roundCoordinate($longitude)
        ];
    }
}
