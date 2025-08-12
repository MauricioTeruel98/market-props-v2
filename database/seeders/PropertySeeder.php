<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Property;
use App\Models\User;

class PropertySeeder extends Seeder
{
    public function run(): void
    {
        $user = User::first();
        
        if (!$user) {
            $user = User::factory()->create();
        }

        $properties = [
            [
                'title' => 'Hermoso departamento en Palermo',
                'address' => 'Av. Santa Fe 1234, Palermo, CABA',
                'modality' => 'rent',
                'currency' => 'dollar',
                'price' => 1200.00,
                'amenities' => ['Aire acondicionado', 'WiFi', 'Estacionamiento', 'Balcón'],
                'cover_image' => 'properties/covers/placeholder.jpg',
                'user_id' => $user->id,
            ],
            [
                'title' => 'Casa moderna en Belgrano',
                'address' => 'Av. Cabildo 5678, Belgrano, CABA',
                'modality' => 'sale',
                'currency' => 'ars',
                'price' => 150000000,
                'amenities' => ['Calefacción', 'WiFi', 'Estacionamiento', 'Jardín', 'Piscina'],
                'cover_image' => 'properties/covers/placeholder.jpg',
                'user_id' => $user->id,
            ],
            [
                'title' => 'PH acogedor en Villa Crespo',
                'address' => 'Av. Corrientes 9012, Villa Crespo, CABA',
                'modality' => 'rent',
                'currency' => 'ars',
                'price' => 450000,
                'amenities' => ['Aire acondicionado', 'WiFi', 'Balcón', 'Cocina equipada'],
                'cover_image' => 'properties/covers/placeholder.jpg',
                'user_id' => $user->id,
            ],
        ];

        foreach ($properties as $propertyData) {
            Property::create($propertyData);
        }
    }
}
