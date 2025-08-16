<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SecurityHeaders
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        // Prevenir que se exponga información sensible en headers
        $response->headers->set('X-Content-Type-Options', 'nosniff');
        $response->headers->set('X-Frame-Options', 'DENY');
        $response->headers->set('X-XSS-Protection', '1; mode=block');
        
        // Remover headers que puedan exponer información del servidor
        $response->headers->remove('Server');
        $response->headers->remove('X-Powered-By');
        
        // Asegurar que las respuestas de Inertia siempre sean HTML
        if ($request->header('X-Inertia') && $response->headers->get('Content-Type') === 'application/json') {
            $response->headers->set('Content-Type', 'text/html; charset=utf-8');
        }

        return $response;
    }
}
