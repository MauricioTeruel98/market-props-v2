<?php

namespace App\Http\Controllers\super;

use App\Http\Controllers\Controller;
use App\Models\Property;
use App\Models\PropertyImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class PropertiesController extends Controller
{
    /**
     * Obtener la ruta de la carpeta del usuario para almacenar imágenes
     */
    private function getUserFolderPath(int $userId): string
    {
        return "users/{$userId}/properties";
    }

    /**
     * Obtener la ruta de la carpeta de una propiedad específica
     */
    private function getPropertyFolderPath(int $userId, int $propertyId, string $title): string
    {
        $slug = $this->generateSlug($title);
        return "users/{$userId}/properties/{$propertyId}_{$slug}";
    }

    /**
     * Generar slug a partir del título
     */
    private function generateSlug(string $title): string
    {
        // Convertir a minúsculas
        $slug = strtolower($title);
        
        // Reemplazar caracteres especiales y espacios con guiones
        $slug = preg_replace('/[^a-z0-9\s-]/', '', $slug);
        $slug = preg_replace('/[\s-]+/', '-', $slug);
        
        // Eliminar guiones al inicio y final
        $slug = trim($slug, '-');
        
        // Limitar longitud
        $slug = substr($slug, 0, 50);
        
        return $slug;
    }

    /**
     * Verifica si el usuario autenticado es superadmin.
     */
    private function ensureSuperadmin()
    {
        $user = auth()->user();
        if (!$user || $user->role !== 'superadmin') {
            return redirect()->route('dashboard')->with('error', 'Acceso denegado');
        }
    }

    public function index(): Response
    {
        $this->ensureSuperadmin();

        $properties = Property::with(['user', 'images'])
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return Inertia::render('super/properties/index', [
            'properties' => $properties,
        ]);
    }

    public function create(): Response
    {
        $this->ensureSuperadmin();

        return Inertia::render('admin/properties/create');
    }

    public function store(Request $request)
    {
        $this->ensureSuperadmin();

        $request->validate([
            'title' => 'required|string|max:255',
            'address' => 'required|string',
            'modality' => 'required|in:rent,sale',
            'currency' => 'required|in:ars,dollar',
            'price' => 'required|numeric|min:0',
            'amenities' => 'array',
            'cover_image' => 'required|image|mimes:jpeg,png,jpg|max:2048',
            'additional_images' => 'array|max:20',
            'additional_images.*' => 'image|mimes:jpeg,png,jpg|max:2048',
        ]);

        $userId = auth()->id();
        
        // Crear la propiedad primero para obtener el ID
        $property = Property::create([
            'title' => $request->title,
            'address' => $request->address,
            'modality' => $request->modality,
            'currency' => $request->currency,
            'price' => $request->price,
            'amenities' => $request->amenities ?? [],
            'cover_image' => '', // Temporal, se actualizará después
            'user_id' => $userId,
        ]);

        // Ahora crear la estructura de carpetas por propiedad
        $propertyFolder = $this->getPropertyFolderPath($userId, $property->id, $request->title);
        
        // Guardar imagen de portada
        $coverImagePath = $request->file('cover_image')->store("{$propertyFolder}/covers", 'public');
        
        // Actualizar la propiedad con la ruta de la imagen de portada
        $property->update(['cover_image' => $coverImagePath]);

        // Guardar imágenes adicionales
        if ($request->hasFile('additional_images')) {
            foreach ($request->file('additional_images') as $index => $image) {
                $imagePath = $image->store("{$propertyFolder}/additional", 'public');
                PropertyImage::create([
                    'property_id' => $property->id,
                    'image_path' => $imagePath,
                    'order' => $index,
                ]);
            }
        }

        return redirect()->route('admin.properties.index')->with('success', 'Propiedad creada exitosamente');
    }

    public function edit(Property $property): Response
    {
        $this->ensureSuperadmin();

        $property->load('images');
        
        return Inertia::render('admin/properties/edit', [
            'property' => $property,
        ]);
    }

    public function update(Request $request, Property $property)
    {
        $this->ensureSuperadmin();

        $request->validate([
            'title' => 'required|string|max:255',
            'address' => 'required|string',
            'modality' => 'required|in:rent,sale',
            'currency' => 'required|in:ars,dollar',
            'price' => 'required|numeric|min:0',
            'amenities' => 'array',
            'cover_image' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'additional_images' => 'array|max:20',
            'additional_images.*' => 'image|mimes:jpeg,png,jpg|max:2048',
        ]);

        // Validar que no se exceda el límite de 20 imágenes en total
        $currentImageCount = $property->images()->count();
        $newImageCount = $request->hasFile('additional_images') ? count($request->file('additional_images')) : 0;
        
        if ($currentImageCount + $newImageCount > 20) {
            return back()->withErrors([
                'additional_images' => "No puedes exceder el límite de 20 imágenes. Actualmente tienes {$currentImageCount} y estás intentando agregar {$newImageCount}."
            ]);
        }

        $data = [
            'title' => $request->title,
            'address' => $request->address,
            'modality' => $request->modality,
            'currency' => $request->currency,
            'price' => $request->price,
            'amenities' => $request->amenities ?? [],
        ];

        if ($request->hasFile('cover_image')) {
            // Eliminar imagen anterior
            if ($property->cover_image) {
                Storage::disk('public')->delete($property->cover_image);
            }
            
            // Guardar nueva imagen en la carpeta de la propiedad
            $userId = auth()->id();
            $propertyFolder = $this->getPropertyFolderPath($userId, $property->id, $property->title);
            $data['cover_image'] = $request->file('cover_image')->store("{$propertyFolder}/covers", 'public');
        }

        $property->update($data);

        // Manejar imágenes adicionales - SOLO AGREGAR NUEVAS, NO REEMPLAZAR
        if ($request->hasFile('additional_images')) {
            // Obtener el orden más alto actual para continuar desde ahí
            $maxOrder = $property->images()->max('order') ?? -1;
            
            // Crear estructura de carpetas por propiedad
            $userId = auth()->id();
            $propertyFolder = $this->getPropertyFolderPath($userId, $property->id, $property->title);
            
            // Agregar nuevas imágenes manteniendo las existentes
            foreach ($request->file('additional_images') as $index => $image) {
                $imagePath = $image->store("{$propertyFolder}/additional", 'public');
                PropertyImage::create([
                    'property_id' => $property->id,
                    'image_path' => $imagePath,
                    'order' => $maxOrder + $index + 1,
                ]);
            }
        }

        return redirect()->route('admin.properties.index')->with('success', 'Propiedad actualizada exitosamente');
    }

    public function destroy(Property $property)
    {
        $this->ensureSuperadmin();

        $userId = $property->user_id;

        // Eliminar imágenes
        if ($property->cover_image) {
            Storage::disk('public')->delete($property->cover_image);
        }
        
        foreach ($property->images as $image) {
            Storage::disk('public')->delete($image->image_path);
        }

        // Eliminar la propiedad
        $property->delete();

        // Limpiar carpeta de la propiedad
        $this->cleanupPropertyFolder($userId, $property->id, $property->title);

        // Verificar si es la última propiedad del usuario y limpiar carpetas vacías
        $remainingProperties = Property::where('user_id', $userId)->count();
        if ($remainingProperties === 0) {
            $this->cleanupUserFolders($userId);
        }

        return redirect()->route('admin.properties.index')->with('success', 'Propiedad eliminada exitosamente');
    }

    /**
     * Limpiar carpeta de una propiedad específica
     */
    private function cleanupPropertyFolder(int $userId, int $propertyId, string $title): void
    {
        $propertyFolder = $this->getPropertyFolderPath($userId, $propertyId, $title);
        
        // Eliminar carpeta completa de la propiedad
        Storage::disk('public')->deleteDirectory($propertyFolder);
    }

    /**
     * Limpiar carpetas del usuario cuando no tenga más propiedades
     */
    private function cleanupUserFolders(int $userId): void
    {
        $userFolder = $this->getUserFolderPath($userId);
        
        // Eliminar carpetas de imágenes adicionales
        Storage::disk('public')->deleteDirectory("{$userFolder}/additional");
        
        // Eliminar carpeta de imágenes de portada
        Storage::disk('public')->deleteDirectory("{$userFolder}/covers");
        
        // Eliminar carpeta principal del usuario si está vacía
        Storage::disk('public')->deleteDirectory($userFolder);
    }

    public function destroyImage(Property $property, PropertyImage $image)
    {
        $this->ensureSuperadmin();

        // Verificar que la imagen pertenezca a la propiedad
        if ($image->property_id !== $property->id) {
            return redirect()->route('dashboard')->with('error', 'No autorizado');
        }

        // Eliminar archivo físico
        Storage::disk('public')->delete($image->image_path);
        
        // Eliminar registro de la base de datos
        $image->delete();

        return back()->with('success', 'Imagen eliminada exitosamente');
    }
}
