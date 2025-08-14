<?php
// Archivo para generar el enlace simbólico de la carpeta storage a la carpeta public/storage
// Cargarlo dentro de public_html e ingresar en la url: /link.php
// public/link.php
error_reporting(E_ALL);
ini_set('display_errors', 1);

$target = realpath(__DIR__ . '/../storage/app/public'); // carpeta real
$link   = __DIR__ . '/storage';                          // enlace en /public

if (!is_dir($target)) {
    http_response_code(500);
    exit("ERROR: No existe la carpeta destino: $target");
}

if (is_link($link) || is_dir($link)) {
    exit("OK: Ya existe public/storage → " . readlink($link));
}

if (!function_exists('symlink')) {
    // Fallback: copiar archivos si symlink no está permitido en el hosting
    function rcopy($src, $dst) {
        $dir = opendir($src);
        @mkdir($dst, 0775, true);
        while(false !== ($file = readdir($dir))) {
            if (($file != '.') && ($file != '..')) {
                if (is_dir($src . '/' . $file)) {
                    rcopy($src . '/' . $file, $dst . '/' . $file);
                } else {
                    copy($src . '/' . $file, $dst . '/' . $file);
                }
            }
        }
        closedir($dir);
    }
    rcopy($target, $link);
    exit("OK: symlink() no disponible. Copié los archivos a /public/storage.");
}

if (@symlink($target, $link)) {
    echo "OK: Enlace creado public/storage → $target";
} else {
    $error = error_get_last();
    http_response_code(500);
    echo "ERROR creando symlink: " . ($error['message'] ?? 'desconocido');
}

// IMPORTANTE: elimina este archivo cuando termines.
