import { Shield, Lock, Eye, Database, Users, Phone, Mail, MapPin } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Link } from '@inertiajs/react'
import AuthLayout from '@/layouts/auth-layout'

export default function PrivacyPolicy() {
  return (
    <AuthLayout 
      className="!max-w-3xl" 
      title="Política de Privacidad - Urbani" 
      description="Tu privacidad es importante para nosotros. Esta política describe cómo recopilamos, usamos y protegemos tu información personal en Urbani."
      showBackButton={true}
      backUrl={route('home')}
      backText="Volver al inicio"
    >
      
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">

        {/* Content */}
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            {/* Hero Section */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-6">
                <Shield className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
                Política de Privacidad
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
                Tu privacidad es importante para nosotros. Esta política describe cómo recopilamos, 
                usamos y protegemos tu información personal en Urbani.
              </p>
              <div className="flex items-center justify-center gap-4 mt-6 text-sm text-slate-500 dark:text-slate-400">
                <span>Última actualización: {new Date().toLocaleDateString('es-ES')}</span>
                <span>•</span>
                <span>Versión 1.0</span>
              </div>
            </div>

            {/* Table of Contents */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Índice
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <a href="#informacion-recopilada" className="block text-blue-600 dark:text-blue-400 hover:underline">1. Información que recopilamos</a>
                    <a href="#uso-informacion" className="block text-blue-600 dark:text-blue-400 hover:underline">2. Cómo usamos tu información</a>
                    <a href="#compartir-informacion" className="block text-blue-600 dark:text-blue-400 hover:underline">3. Compartir información</a>
                    <a href="#seguridad" className="block text-blue-600 dark:text-blue-400 hover:underline">4. Seguridad de datos</a>
                  </div>
                  <div className="space-y-2">
                    <a href="#cookies" className="block text-blue-600 dark:text-blue-400 hover:underline">5. Cookies y tecnologías</a>
                    <a href="#derechos" className="block text-blue-600 dark:text-blue-400 hover:underline">6. Tus derechos</a>
                    <a href="#menores" className="block text-blue-600 dark:text-blue-400 hover:underline">7. Menores de edad</a>
                    <a href="#contacto" className="block text-blue-600 dark:text-blue-400 hover:underline">8. Contacto</a>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Content Sections */}
            <div className="space-y-8">
              {/* Section 1 */}
              <Card id="informacion-recopilada">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5 text-blue-600" />
                    1. Información que recopilamos
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Información personal:</h4>
                    <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-300 ml-4">
                      <li>Nombre completo y apellidos</li>
                      <li>Dirección de correo electrónico</li>
                      <li>Número de teléfono</li>
                      <li>Información de contacto adicional</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Información de propiedades:</h4>
                    <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-300 ml-4">
                      <li>Detalles de las propiedades inmobiliarias</li>
                      <li>Imágenes y fotografías</li>
                      <li>Ubicación geográfica (coordenadas)</li>
                      <li>Precios y características</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Información técnica:</h4>
                    <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-300 ml-4">
                      <li>Dirección IP y datos de navegación</li>
                      <li>Información del dispositivo</li>
                      <li>Cookies y tecnologías similares</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* Section 2 */}
              <Card id="uso-informacion">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-green-600" />
                    2. Cómo usamos tu información
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold mb-2 text-green-700 dark:text-green-400">Para usuarios registrados:</h4>
                      <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-300 ml-4">
                        <li>Gestionar tu cuenta y propiedades</li>
                        <li>Procesar transacciones</li>
                        <li>Enviar notificaciones importantes</li>
                        <li>Proporcionar soporte técnico</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2 text-blue-700 dark:text-blue-400">Para todos los usuarios:</h4>
                      <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-300 ml-4">
                        <li>Mostrar propiedades disponibles</li>
                        <li>Mejorar nuestros servicios</li>
                        <li>Análisis y estadísticas</li>
                        <li>Comunicaciones de marketing</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Section 3 */}
              <Card id="compartir-informacion">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-purple-600" />
                    3. Compartir información
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 dark:text-slate-300 mb-4">
                    No vendemos, alquilamos ni compartimos tu información personal con terceros, excepto en las siguientes circunstancias:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-300 ml-4">
                    <li><strong>Con tu consentimiento:</strong> Solo compartimos información cuando nos das permiso explícito</li>
                    <li><strong>Proveedores de servicios:</strong> Trabajamos con terceros confiables para operar nuestra plataforma</li>
                    <li><strong>Cumplimiento legal:</strong> Cuando la ley lo requiera o para proteger nuestros derechos</li>
                    <li><strong>Información pública:</strong> Los detalles de las propiedades pueden ser visibles públicamente</li>
                  </ul>
                </CardContent>
              </Card>

              {/* Section 4 */}
              <Card id="seguridad">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="h-5 w-5 text-red-600" />
                    4. Seguridad de datos
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-slate-600 dark:text-slate-300">
                    Implementamos medidas de seguridad técnicas y organizativas para proteger tu información:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h4 className="font-semibold text-red-700 dark:text-red-400">Medidas técnicas:</h4>
                      <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-300 ml-4">
                        <li>Encriptación SSL/TLS</li>
                        <li>Acceso restringido a datos</li>
                        <li>Copias de seguridad regulares</li>
                        <li>Monitoreo de seguridad 24/7</li>
                      </ul>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-semibold text-red-700 dark:text-red-400">Medidas organizativas:</h4>
                      <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-300 ml-4">
                        <li>Políticas de acceso interno</li>
                        <li>Capacitación del personal</li>
                        <li>Auditorías regulares</li>
                        <li>Protocolos de respuesta a incidentes</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Section 5 */}
              <Card id="cookies">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="h-5 w-5 text-orange-600" />
                    5. Cookies y tecnologías
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 dark:text-slate-300 mb-4">
                    Utilizamos cookies y tecnologías similares para mejorar tu experiencia:
                  </p>
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-semibold text-orange-700 dark:text-orange-400">Cookies esenciales:</h4>
                      <p className="text-slate-600 dark:text-slate-300 ml-4">Necesarias para el funcionamiento básico del sitio</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-orange-700 dark:text-orange-400">Cookies de rendimiento:</h4>
                      <p className="text-slate-600 dark:text-slate-300 ml-4">Nos ayudan a mejorar la velocidad y funcionalidad</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-orange-700 dark:text-orange-400">Cookies de análisis:</h4>
                      <p className="text-slate-600 dark:text-slate-300 ml-4">Para entender cómo usas nuestro sitio</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Section 6 */}
              <Card id="derechos">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-emerald-600" />
                    6. Tus derechos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 dark:text-slate-300 mb-4">
                    Tienes los siguientes derechos respecto a tu información personal:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-300 ml-4">
                      <li><strong>Acceso:</strong> Solicitar una copia de tus datos</li>
                      <li><strong>Rectificación:</strong> Corregir información incorrecta</li>
                      <li><strong>Portabilidad:</strong> Recibir tus datos en formato estructurado</li>
                    </ul>
                    <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-300 ml-4">
                      <li><strong>Eliminación:</strong> Solicitar la eliminación de tus datos</li>
                      <li><strong>Limitación:</strong> Restringir el procesamiento</li>
                      <li><strong>Oposición:</strong> Oponerte al procesamiento</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* Section 7 */}
              <Card id="menores">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-pink-600" />
                    7. Menores de edad
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 dark:text-slate-300">
                    Nuestros servicios no están dirigidos a menores de 18 años. No recopilamos 
                    intencionalmente información personal de menores. Si eres padre o tutor y 
                    crees que tu hijo nos ha proporcionado información personal, contáctanos 
                    inmediatamente para que podamos eliminar dicha información.
                  </p>
                </CardContent>
              </Card>

              {/* Section 8 */}
              <Card id="contacto">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="h-5 w-5 text-indigo-600" />
                    8. Contacto
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 dark:text-slate-300 mb-4">
                    Si tienes preguntas sobre esta política de privacidad o sobre cómo manejamos 
                    tu información personal, puedes contactarnos:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-indigo-600" />
                        <span className="text-slate-600 dark:text-slate-300">consultas@urbani.info</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-indigo-600" />
                        <span className="text-slate-600 dark:text-slate-300">+54 381 558 2223</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-indigo-600" />
                        <span className="text-slate-600 dark:text-slate-300">Tucumán, Argentina</span>
                      </div>
                      <div className="text-sm text-slate-500 dark:text-slate-400">
                        Horario de atención: Lunes a Viernes 9:00 - 18:00
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Footer */}
            <div className="mt-12 text-center">
              <div className="flex items-center justify-center gap-4 mb-4">
                <Link href={route('home')}>
                  <Button variant="outline">Volver al inicio</Button>
                </Link>
                <Link href={route('terms')}>
                  <Button variant="outline">Ver términos y condiciones</Button>
                </Link>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                © {new Date().getFullYear()} Urbani. Todos los derechos reservados.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AuthLayout>
  )
}
