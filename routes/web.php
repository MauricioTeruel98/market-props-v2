<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\admin\PropertiesController as AdminPropertiesController;
use App\Http\Controllers\super\PropertiesController as SuperPropertiesController;
use App\Http\Controllers\Public\PropertiesController as PublicPropertiesController;
use App\Http\Middleware\EnsureSuperadmin;

Route::get('/', function () {
    $featuredProperties = App\Models\Property::with(['user'])
        ->orderBy('created_at', 'desc')
        ->limit(6)
        ->get();
    
    return Inertia::render('public/landing', [
        'featuredProperties' => $featuredProperties
    ]);
})->name('home');

// Rutas públicas para propiedades
Route::get('/public/properties', [PublicPropertiesController::class, 'index'])->name('public.properties.index');
Route::get('/public/properties/{property}', [PublicPropertiesController::class, 'show'])->name('public.properties.show');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

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
