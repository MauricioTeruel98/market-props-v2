import { FileText, Scale, AlertTriangle, CheckCircle, XCircle, Users, Building2, Phone, Mail, MapPin } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Link } from '@inertiajs/react'
import AuthLayout from '@/layouts/auth-layout'

export default function Terms() {
  return (
    <AuthLayout 
      className="!max-w-3xl" 
      title="Términos y Condiciones - Urbani" 
      description="Estos términos establecen las reglas y regulaciones para el uso de la plataforma Urbani y los servicios relacionados."
      showBackButton={true}
      backUrl={route('home')}
      backText="Volver al inicio"
    >
      
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">

        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            {/* Hero Section */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-6">
                <FileText className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
                Términos y Condiciones
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
                Estos términos establecen las reglas y regulaciones para el uso de la plataforma 
                Urbani y los servicios relacionados.
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
                  <Scale className="h-5 w-5" />
                  Índice
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <a href="#aceptacion" className="block text-blue-600 dark:text-blue-400 hover:underline">1. Aceptación de términos</a>
                    <a href="#servicios" className="block text-blue-600 dark:text-blue-400 hover:underline">2. Descripción de servicios</a>
                    <a href="#registro" className="block text-blue-600 dark:text-blue-400 hover:underline">3. Registro y cuentas</a>
                    <a href="#uso" className="block text-blue-600 dark:text-blue-400 hover:underline">4. Uso aceptable</a>
                  </div>
                  <div className="space-y-2">
                    <a href="#propiedades" className="block text-blue-600 dark:text-blue-400 hover:underline">5. Publicación de propiedades</a>
                    <a href="#responsabilidades" className="block text-blue-600 dark:text-blue-400 hover:underline">6. Responsabilidades</a>
                    <a href="#propiedad-intelectual" className="block text-blue-600 dark:text-blue-400 hover:underline">7. Propiedad intelectual</a>
                    <a href="#contacto" className="block text-blue-600 dark:text-blue-400 hover:underline">8. Contacto</a>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Content Sections */}
            <div className="space-y-8">
              {/* Section 1 */}
              <Card id="aceptacion">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    1. Aceptación de términos
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-slate-600 dark:text-slate-300">
                    Al acceder y utilizar Urbani, aceptas estar sujeto a estos términos y condiciones. 
                    Si no estás de acuerdo con alguna parte de estos términos, no debes usar nuestros servicios.
                  </p>
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Importante:</h4>
                    <p className="text-blue-700 dark:text-blue-300 text-sm">
                      Estos términos constituyen un acuerdo legal entre tú y Urbani. 
                      Te recomendamos leerlos cuidadosamente antes de usar nuestros servicios.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Section 2 */}
              <Card id="servicios">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-blue-600" />
                    2. Descripción de servicios
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-slate-600 dark:text-slate-300">
                    Urbani es una plataforma de gestión inmobiliaria que ofrece los siguientes servicios:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <h4 className="font-semibold text-blue-700 dark:text-blue-300">Para propietarios:</h4>
                      <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-300 ml-4">
                        <li>Publicación de propiedades</li>
                        <li>Gestión de inventario</li>
                        <li>Herramientas de marketing</li>
                        <li>Análisis de mercado</li>
                      </ul>
                    </div>
                    <div className="space-y-3">
                      <h4 className="font-semibold text-green-700 dark:text-green-300">Para compradores:</h4>
                      <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-300 ml-4">
                        <li>Búsqueda de propiedades</li>
                        <li>Información detallada</li>
                        <li>Contacto directo</li>
                        <li>Mapas interactivos</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Section 3 */}
              <Card id="registro">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-purple-600" />
                    3. Registro y cuentas
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2 text-purple-700 dark:text-purple-300">Requisitos de registro:</h4>
                      <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-300 ml-4">
                        <li>Ser mayor de 18 años</li>
                        <li>Proporcionar información veraz y completa</li>
                        <li>Mantener la confidencialidad de tu cuenta</li>
                        <li>Notificar inmediatamente cualquier uso no autorizado</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2 text-purple-700 dark:text-purple-300">Responsabilidades de la cuenta:</h4>
                      <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-300 ml-4">
                        <li>Eres responsable de todas las actividades en tu cuenta</li>
                        <li>No compartas tus credenciales de acceso</li>
                        <li>Mantén tu información de contacto actualizada</li>
                        <li>Urbani puede suspender cuentas que violen estos términos</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Section 4 */}
              <Card id="uso">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-orange-600" />
                    4. Uso aceptable
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-slate-600 dark:text-slate-300">
                    Al usar Urbani, te comprometes a:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3 text-green-700 dark:text-green-300 flex items-center gap-2">
                        <CheckCircle className="h-4 w-4" />
                        Lo que SÍ puedes hacer:
                      </h4>
                      <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-300 ml-4">
                        <li>Usar la plataforma para fines legítimos</li>
                        <li>Publicar información precisa sobre propiedades</li>
                        <li>Contactar a otros usuarios de manera profesional</li>
                        <li>Reportar contenido inapropiado</li>
                        <li>Usar las herramientas de búsqueda y filtros</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3 text-red-700 dark:text-red-300 flex items-center gap-2">
                        <XCircle className="h-4 w-4" />
                        Lo que NO puedes hacer:
                      </h4>
                      <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-300 ml-4">
                        <li>Publicar información falsa o engañosa</li>
                        <li>Usar la plataforma para actividades ilegales</li>
                        <li>Spam o mensajes no solicitados</li>
                        <li>Violar derechos de propiedad intelectual</li>
                        <li>Intentar acceder a cuentas de otros usuarios</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Section 5 */}
              <Card id="propiedades">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-indigo-600" />
                    5. Publicación de propiedades
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2 text-indigo-700 dark:text-indigo-300">Responsabilidades del propietario:</h4>
                      <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-300 ml-4">
                        <li><strong>Información precisa:</strong> Todos los datos deben ser veraces y actualizados</li>
                        <li><strong>Imágenes reales:</strong> Las fotos deben ser de la propiedad actual</li>
                        <li><strong>Precios correctos:</strong> Los precios deben reflejar el valor real</li>
                        <li><strong>Disponibilidad:</strong> Mantener actualizado el estado de disponibilidad</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2 text-indigo-700 dark:text-indigo-300">Estándares de calidad:</h4>
                      <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-300 ml-4">
                        <li>Imágenes de alta calidad y bien iluminadas</li>
                        <li>Descripciones detalladas y honestas</li>
                        <li>Información de contacto actualizada</li>
                        <li>Respuesta oportuna a consultas</li>
                      </ul>
                    </div>
                    <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
                      <h4 className="font-semibold text-orange-800 dark:text-orange-200 mb-2">Política de moderación:</h4>
                      <p className="text-orange-700 dark:text-orange-300 text-sm">
                        Urbani se reserva el derecho de revisar, editar o eliminar publicaciones 
                        que no cumplan con nuestros estándares de calidad o términos de uso.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Section 6 */}
              <Card id="responsabilidades">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Scale className="h-5 w-5 text-red-600" />
                    6. Responsabilidades
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3 text-red-700 dark:text-red-300">Responsabilidades de Urbani:</h4>
                      <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-300 ml-4">
                        <li>Mantener la plataforma funcionando</li>
                        <li>Proteger la información personal</li>
                        <li>Proporcionar soporte técnico</li>
                        <li>Actualizar y mejorar los servicios</li>
                        <li>Moderar contenido inapropiado</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3 text-red-700 dark:text-red-300">Responsabilidades del usuario:</h4>
                      <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-300 ml-4">
                        <li>Usar la plataforma de manera responsable</li>
                        <li>Respetar los derechos de otros usuarios</li>
                        <li>Mantener información actualizada</li>
                        <li>Reportar problemas o abusos</li>
                        <li>Cumplir con las leyes aplicables</li>
                      </ul>
                    </div>
                  </div>
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                    <h4 className="font-semibold text-red-800 dark:text-red-200 mb-2">Limitación de responsabilidad:</h4>
                    <p className="text-red-700 dark:text-red-300 text-sm">
                      Urbani no se hace responsable por transacciones entre usuarios, 
                      daños indirectos o pérdidas de datos. Los usuarios utilizan la 
                      plataforma bajo su propio riesgo.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Section 7 */}
              <Card id="propiedad-intelectual">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-emerald-600" />
                    7. Propiedad intelectual
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2 text-emerald-700 dark:text-emerald-300">Derechos de Urbani:</h4>
                      <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-300 ml-4">
                        <li>La plataforma y su código son propiedad de Urbani</li>
                        <li>El diseño, logos y marca están protegidos</li>
                        <li>Los derechos de autor de la interfaz nos pertenecen</li>
                        <li>No se permite la reproducción sin autorización</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2 text-emerald-700 dark:text-emerald-300">Derechos del usuario:</h4>
                      <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-300 ml-4">
                        <li>Conservas los derechos sobre tu contenido</li>
                        <li>Puedes eliminar tu información en cualquier momento</li>
                        <li>Otorgas licencia para mostrar tu contenido en la plataforma</li>
                        <li>La licencia termina cuando eliminas tu cuenta</li>
                      </ul>
                    </div>
                  </div>
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
                    Si tienes preguntas sobre estos términos y condiciones, puedes contactarnos:
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
                <Link href={route('privacy')}>
                  <Button variant="outline">Ver política de privacidad</Button>
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
