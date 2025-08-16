<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Config;

class CheckSecurityConfig extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'security:check-inertia';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Verificar la configuración de seguridad de Inertia';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('🔒 Verificando configuración de seguridad de Inertia...');

        // Verificar SSR
        $ssrEnabled = Config::get('inertia.ssr.enabled', false);
        $ssrUrl = Config::get('inertia.ssr.url', 'http://127.0.0.1:13714');

        if ($ssrEnabled) {
            $this->warn('⚠️  SSR está habilitado');
            $this->line("   URL: {$ssrUrl}");
            
            if (str_contains($ssrUrl, '127.0.0.1') || str_contains($ssrUrl, 'localhost')) {
                $this->error('❌ SSR apunta a una URL local - RIESGO DE SEGURIDAD!');
            }
        } else {
            $this->info('✅ SSR está deshabilitado');
        }

        // Verificar configuración de seguridad
        $forceHtml = Config::get('inertia.security.force_html_response', true);
        $preventJson = Config::get('inertia.security.prevent_json_exposure', true);

        if ($forceHtml) {
            $this->info('✅ Respuestas HTML forzadas habilitadas');
        } else {
            $this->warn('⚠️  Respuestas HTML forzadas deshabilitadas');
        }

        if ($preventJson) {
            $this->info('✅ Prevención de exposición JSON habilitada');
        } else {
            $this->warn('⚠️  Prevención de exposición JSON deshabilitada');
        }

        // Verificar entorno
        $env = Config::get('app.env', 'production');
        $debug = Config::get('app.debug', false);

        $this->line("   Entorno: {$env}");
        $this->line("   Debug: " . ($debug ? 'HABILITADO' : 'DESHABILITADO'));

        if ($debug && $env === 'production') {
            $this->error('❌ Debug habilitado en producción - RIESGO DE SEGURIDAD!');
        }

        $this->newLine();
        $this->info('🔍 Verificación completada');
        
        return 0;
    }
}
