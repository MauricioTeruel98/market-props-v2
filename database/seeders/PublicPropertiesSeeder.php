<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Property;
use App\Models\User;
use App\Models\PropertyImage;

class PublicPropertiesSeeder extends Seeder
{
    public function run(): void
    {
        // Crear usuario de ejemplo si no existe
        $user = User::firstOrCreate(
            ['email' => 'demo@marketprops.com'],
            [
                'name' => 'Demo User',
                'password' => bcrypt('password'),
                'email_verified_at' => now(),
            ]
        );

        $properties = [
            [
                'title' => 'Hermoso departamento en Palermo',
                'address' => 'Palermo, Buenos Aires',
                'modality' => 'rent',
                'currency' => 'ars',
                'price' => 150000,
                'amenities' => ['Piscina', 'Gimnasio', 'Estacionamiento', 'Seguridad 24/7', 'Ascensor'],
                'cover_image' => 'properties/demo-1.jpg',
            ],
            [
                'title' => 'Casa moderna en Belgrano',
                'address' => 'Belgrano, Buenos Aires',
                'modality' => 'sale',
                'currency' => 'dollar',
                'price' => 250000,
                'amenities' => ['Jardín', 'Terraza', 'Aire acondicionado', 'Calefacción', 'Internet'],
                'cover_image' => 'properties/demo-2.jpg',
            ],
            [
                'title' => 'PH acogedor en Villa Crespo',
                'address' => 'Villa Crespo, Buenos Aires',
                'modality' => 'rent',
                'currency' => 'ars',
                'price' => 120000,
                'amenities' => ['Balcón', 'Cocina equipada', 'Lavandería', 'Cable'],
                'cover_image' => 'properties/demo-3.jpg',
            ],
            [
                'title' => 'Duplex de lujo en Puerto Madero',
                'address' => 'Puerto Madero, Buenos Aires',
                'modality' => 'sale',
                'currency' => 'dollar',
                'price' => 450000,
                'amenities' => ['Piscina', 'Gimnasio', 'Estacionamiento', 'Seguridad 24/7', 'Ascensor', 'Terraza'],
                'cover_image' => 'properties/demo-4.jpg',
            ],
            [
                'title' => 'Departamento familiar en Caballito',
                'address' => 'Caballito, Buenos Aires',
                'modality' => 'rent',
                'currency' => 'ars',
                'price' => 180000,
                'amenities' => ['Balcón', 'Aire acondicionado', 'Calefacción', 'Internet', 'Cable'],
                'cover_image' => 'properties/demo-5.jpg',
            ],
            [
                'title' => 'Casa quinta en San Isidro',
                'address' => 'San Isidro, Buenos Aires',
                'modality' => 'sale',
                'currency' => 'dollar',
                'price' => 800000,
                'amenities' => ['Jardín', 'Piscina', 'Estacionamiento', 'Seguridad 24/7', 'Terraza'],
                'cover_image' => 'properties/demo-6.jpg',
            ],
        ];

        foreach ($properties as $propertyData) {
            $property = Property::create([
                'title' => $propertyData['title'],
                'address' => $propertyData['address'],
                'modality' => $propertyData['modality'],
                'currency' => $propertyData['currency'],
                'price' => $propertyData['price'],
                'amenities' => $propertyData['amenities'],
                'cover_image' => $propertyData['cover_image'],
                'user_id' => $user->id,
            ]);

            // Crear imágenes de ejemplo para cada propiedad
            for ($i = 1; $i <= 3; $i++) {
                PropertyImage::create([
                    'property_id' => $property->id,
                    'image_path' => "properties/demo-{$property->id}-img-{$i}.jpg",
                    'order' => $i,
                ]);
            }
        }

        $this->command->info('Propiedades de ejemplo creadas exitosamente!');
    }
}
