<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Property;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class PropertiesController extends Controller
{
    public function index(Request $request)
    {
        $query = Property::with(['user', 'images'])
            ->where('status', 'available')
            ->orderBy('created_at', 'desc');

        // Filtro de búsqueda
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('address', 'like', "%{$search}%");
            });
        }

        // Filtro de modalidad
        if ($request->filled('modality') && $request->modality !== 'all') {
            $query->where('modality', $request->modality);
        }

        // Filtro de moneda
        if ($request->filled('currency') && $request->currency !== 'all') {
            $query->where('currency', $request->currency);
        }

        // Filtro de precio mínimo
        if ($request->filled('minPrice')) {
            $query->where('price', '>=', $request->minPrice);
        }

        // Filtro de precio máximo
        if ($request->filled('maxPrice')) {
            $query->where('price', '<=', $request->maxPrice);
        }

        // Filtro de amenities
        if ($request->filled('amenities') && is_array($request->amenities)) {
            foreach ($request->amenities as $amenity) {
                // Usar whereRaw para mayor compatibilidad
                $query->whereRaw("JSON_CONTAINS(amenities, ?)", [json_encode($amenity)]);
            }
        }

        $properties = $query->paginate(12);

        // Preparar filtros para la vista
        $filters = [
            'search' => $request->search,
            'modality' => $request->modality ?: 'all',
            'currency' => $request->currency ?: 'all',
            'minPrice' => $request->minPrice,
            'maxPrice' => $request->maxPrice,
            'amenities' => $request->amenities ?? [],
        ];

        return Inertia::render('public/properties/index', [
            'properties' => $properties,
            'filters' => $filters,
        ]);
    }

    public function show(Property $property)
    {
        // Verificar que la propiedad esté disponible
        if ($property->status !== 'available') {
            abort(404, 'Propiedad no encontrada');
        }

        $property->load(['user', 'images']);

        // Obtener propiedades relacionadas (solo disponibles)
        $relatedProperties = Property::where('id', '!=', $property->id)
            ->where('status', 'available')
            ->where('modality', $property->modality)
            ->limit(3)
            ->get();

        return Inertia::render('public/properties/show', [
            'property' => $property,
            'relatedProperties' => $relatedProperties,
        ]);
    }
}
