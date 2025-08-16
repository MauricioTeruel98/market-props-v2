# 🔒 Guía de Seguridad - Market Props

## Problema Identificado

Se detectó una **falla de seguridad crítica** donde Inertia.js estaba exponiendo información sensible de la aplicación (incluyendo todas las rutas) en formato JSON en lugar de renderizar HTML.

**Problema adicional**: Los mensajes de error de validación mostraban claves de traducción (`auth.failed`) en lugar de mensajes en español.

## Causa del Problema

1. **SSR mal configurado**: El Server Side Rendering estaba habilitado pero apuntaba a una URL local inexistente
2. **Fallback incorrecto**: Cuando el SSR fallaba, Inertia devolvía JSON en lugar de HTML
3. **Headers incorrectos**: La respuesta no tenía el `Content-Type` correcto
4. **Idioma no configurado**: Laravel no tenía archivos de idioma español configurados

## Soluciones Implementadas

### 1. Configuración de Inertia (`config/inertia.php`)
- SSR deshabilitado por defecto en producción
- Variables de entorno para controlar la configuración
- Configuración de seguridad adicional

### 2. Middleware de Seguridad (`app/Http/Middleware/SecurityHeaders.php`)
- Headers de seguridad HTTP
- Prevención de exposición de información del servidor
- Control de Content-Type para respuestas de Inertia

### 3. Middleware de Inertia Mejorado (`app/Http/Middleware/HandleInertiaRequests.php`)
- Manejo mejorado de requests
- Control de headers Accept
- Aseguramiento de respuestas HTML

### 4. Controlador de Autenticación Mejorado
- Manejo de errores mejorado
- Prevención de respuestas JSON en errores de login

### 5. Configuración de Idioma Español
- Archivos de idioma español completos (`lang/es/`)
- Middleware `SetLocale` para forzar idioma español
- Configuración de aplicación en español por defecto

## Configuración en Producción

### Variables de Entorno (.env)
```bash
# Inertia SSR - DESHABILITAR en producción
INERTIA_SSR_ENABLED=false
INERTIA_SSR_URL=http://127.0.0.1:13714

# Configuración de la aplicación
APP_ENV=production
APP_DEBUG=false
APP_URL=https://urbani.info

# Idioma (opcional, español por defecto)
APP_LOCALE=es
APP_FALLBACK_LOCALE=es

# Seguridad adicional
INERTIA_FORCE_HTML=true
INERTIA_PREVENT_JSON_EXPOSURE=true
```

### Verificación de Seguridad
```bash
# Ejecutar el comando de verificación
php artisan security:check-inertia
```

## Pasos para Implementar en Producción

1. **Actualizar archivos de código** (ya implementado)
2. **Configurar variables de entorno** en el servidor
3. **Limpiar caché de configuración**:
   ```bash
   php artisan config:clear
   php artisan config:cache
   ```
4. **Reiniciar servicios web** (Apache/Nginx)
5. **Verificar configuración** con el comando de seguridad

## Headers de Seguridad Implementados

- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- Remoción de headers `Server` y `X-Powered-By`

## Archivos de Idioma Español

- `lang/es/auth.php` - Mensajes de autenticación
- `lang/es/validation.php` - Mensajes de validación
- `lang/es/passwords.php` - Mensajes de contraseñas
- Middleware `SetLocale` para forzar idioma español

## Monitoreo Continuo

- Revisar logs de errores regularmente
- Monitorear respuestas HTTP para detectar JSON no deseado
- Ejecutar verificaciones de seguridad periódicamente
- Mantener actualizadas las dependencias
- Verificar que los mensajes de error aparezcan en español

## Notas Importantes

⚠️ **NUNCA** habilitar SSR en producción sin un servidor SSR dedicado y configurado correctamente.

⚠️ **NUNCA** habilitar debug en producción.

⚠️ **SIEMPRE** usar HTTPS en producción.

⚠️ **VERIFICAR** que las respuestas sean HTML y no JSON para requests de navegación.

⚠️ **VERIFICAR** que los mensajes de error aparezcan en español, no como claves de traducción.

## Contacto

Para reportar problemas de seguridad, contactar al equipo de desarrollo inmediatamente.
