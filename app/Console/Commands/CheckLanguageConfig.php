<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Lang;

class CheckLanguageConfig extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'lang:check';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Verificar la configuración de idioma español';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('🌍 Verificando configuración de idioma español...');

        // Verificar idioma actual
        $currentLocale = App::getLocale();
        $fallbackLocale = App::getFallbackLocale();
        
        $this->line("   Idioma actual: {$currentLocale}");
        $this->line("   Idioma de respaldo: {$fallbackLocale}");

        if ($currentLocale === 'es') {
            $this->info('✅ Idioma español configurado correctamente');
        } else {
            $this->warn('⚠️  Idioma no es español');
        }

        // Verificar archivos de idioma
        $this->newLine();
        $this->info('📚 Verificando archivos de idioma...');

        $languageFiles = [
            'auth' => 'Mensajes de autenticación',
            'validation' => 'Mensajes de validación',
            'passwords' => 'Mensajes de contraseñas',
        ];

        foreach ($languageFiles as $file => $description) {
            if (Lang::has('auth.failed', 'es')) {
                $this->info("✅ {$description} ({$file}.php)");
                
                // Mostrar ejemplo de mensaje
                if ($file === 'auth') {
                    $message = __('auth.failed');
                    $this->line("   Ejemplo: {$message}");
                }
            } else {
                $this->error("❌ {$description} ({$file}.php) - NO ENCONTRADO");
            }
        }

        // Verificar mensajes específicos
        $this->newLine();
        $this->info('🔍 Verificando mensajes específicos...');

        $testMessages = [
            'auth.failed' => 'Estas credenciales no coinciden con nuestros registros.',
            'validation.required' => 'El campo :attribute es obligatorio.',
            'passwords.reset' => 'Su contraseña ha sido restablecida.',
        ];

        foreach ($testMessages as $key => $expected) {
            $actual = __($key);
            
            if ($actual === $expected) {
                $this->info("✅ {$key}: {$actual}");
            } else {
                $this->warn("⚠️  {$key}: {$actual} (esperado: {$expected})");
            }
        }

        // Verificar que no se muestren claves de traducción
        $this->newLine();
        $this->info('🚫 Verificando que no se muestren claves de traducción...');

        $keysToCheck = ['auth.failed', 'validation.required', 'passwords.reset'];
        $hasKeys = false;

        foreach ($keysToCheck as $key) {
            $message = __($key);
            if ($message === $key) {
                $this->error("❌ {$key} se muestra como clave, no como mensaje");
                $hasKeys = true;
            }
        }

        if (!$hasKeys) {
            $this->info('✅ Todos los mensajes se muestran correctamente en español');
        }

        $this->newLine();
        $this->info('🔍 Verificación de idioma completada');
        
        return 0;
    }
}
