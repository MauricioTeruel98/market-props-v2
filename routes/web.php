<?php

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\admin\PropertiesController as AdminPropertiesController;
use App\Http\Controllers\super\PropertiesController as SuperPropertiesController;
use App\Http\Controllers\Public\PropertiesController as PublicPropertiesController;
use App\Http\Controllers\DashboardController;
use App\Http\Middleware\EnsureSuperadmin;

Route::get('/', function () {
    $featuredProperties = App\Models\Property::with(['user'])
        ->orderBy('created_at', 'desc')
        ->limit(6)
        ->get();
    
    // Obtener todas las propiedades con coordenadas para el mapa
    $allProperties = App\Models\Property::with(['user', 'images'])
        ->select('id', 'title', 'address', 'latitude', 'longitude', 'modality', 'currency', 'price', 'amenities', 'cover_image')
        ->where('status', 'available')
        ->whereNotNull('latitude')
        ->whereNotNull('longitude')
        ->where('latitude', '!=', '')
        ->where('longitude', '!=', '')
        ->get()
        ->map(function ($property) {
            // Obtener la imagen de portada
            $coverImagePath = $property->cover_image ? $property->cover_image : null;
            
            return [
                'id' => $property->id,
                'title' => $property->title,
                'address' => $property->address,
                'lat' => (float) $property->latitude,
                'lng' => (float) $property->longitude,
                'modality' => $property->modality,
                'currency' => $property->currency,
                'price' => $property->price,
                'cover_image' => $coverImagePath,
                'user' => [
                    'name' => $property->user->name ?? 'Propietario'
                ],
            ];
        });
    
    return Inertia::render('public/landing', [
        'featuredProperties' => $featuredProperties,
        'mapProperties' => $allProperties
    ]);
})->name('home');

Route::get('/autenticate', function () {
    if (Auth::check()) {
        return redirect()->route('dashboard');
    }
    return Inertia::render('auth/autenticate');
})->name('autenticate');

// Rutas públicas para propiedades
Route::get('/public/properties', [PublicPropertiesController::class, 'index'])->name('public.properties.index');
Route::get('/public/properties/{property}', [PublicPropertiesController::class, 'show'])->name('public.properties.show');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::get('properties', [AdminPropertiesController::class, 'index'])->name('properties');
});

// Rutas de administración de propiedades
Route::middleware(['auth', 'verified'])->prefix('admin')->name('admin.')->group(function () {
    Route::resource('properties', AdminPropertiesController::class);
    Route::delete('properties/{property}/images/{image}', [AdminPropertiesController::class, 'destroyImage'])->name('properties.images.destroy');
});

// Rutas de superadmin
Route::middleware(['auth', 'verified', EnsureSuperadmin::class])->prefix('super')->name('super.')->group(function () {
    Route::get('properties', [SuperPropertiesController::class, 'index'])->name('properties');

    Route::resource('properties', SuperPropertiesController::class);
    Route::delete('properties/{property}/images/{image}', [SuperPropertiesController::class, 'destroyImage'])->name('properties.images.destroy');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
