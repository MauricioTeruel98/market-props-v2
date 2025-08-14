<?php

namespace App\Http\Controllers;

use App\Models\Property;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();
        
        // Solo estadísticas del usuario actual
        $userProperties = Property::where('user_id', $user->id)
            ->with(['images'])
            ->latest()
            ->take(5)
            ->get();
            
        $userPropertyStats = [
            'total' => Property::where('user_id', $user->id)->count(),
            'available' => Property::where('user_id', $user->id)->where('status', 'available')->count(),
            'rent' => Property::where('user_id', $user->id)->where('modality', 'rent')->count(),
            'sale' => Property::where('user_id', $user->id)->where('modality', 'sale')->count()
        ];
        
        // Estadísticas por moneda del usuario
        $currencyStats = [
            'ars' => Property::where('user_id', $user->id)->where('currency', 'ars')->count(),
            'usd' => Property::where('user_id', $user->id)->where('currency', 'usd')->count()
        ];
        
        // Propiedades por estado del usuario
        $statusStats = [
            'available' => $userPropertyStats['available'],
            'unavailable' => $userPropertyStats['total'] - $userPropertyStats['available']
        ];
        
        return Inertia::render('dashboard', [
            'userPropertyStats' => $userPropertyStats,
            'userProperties' => $userProperties,
            'currencyStats' => $currencyStats,
            'statusStats' => $statusStats,
            'userRole' => $user->role
        ]);
    }
}
