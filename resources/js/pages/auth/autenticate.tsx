import { Head, Link } from '@inertiajs/react'
import { ArrowRight, Building2, Shield, Users, Home, Key, UserPlus } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import AuthLayout from '@/layouts/auth-layout'

const features = [
  {
    icon: Home,
    title: 'Gestión Completa',
    desc: 'Administra todas tus propiedades desde un solo lugar',
    from: 'from-blue-50',
    to: 'to-blue-100',
    darkFrom: 'dark:from-blue-950/20',
    darkTo: 'dark:to-blue-900/20',
    dot: 'bg-blue-500',
  },
  {
    icon: Shield,
    title: 'Seguridad Total',
    desc: 'Tus datos están protegidos con la máxima seguridad',
    from: 'from-emerald-50',
    to: 'to-emerald-100',
    darkFrom: 'dark:from-emerald-950/20',
    darkTo: 'dark:to-emerald-900/20',
    dot: 'bg-emerald-500',
  },
  {
    icon: Users,
    title: 'Publica',
    desc: 'Llegá a más personas con tu propiedad',
    from: 'from-purple-50',
    to: 'to-purple-100',
    darkFrom: 'dark:from-purple-950/20',
    darkTo: 'dark:to-purple-900/20',
    dot: 'bg-purple-500',
  },
]

export default function Authenticate() {
  return (
    <AuthLayout 
      className="!max-w-3xl" 
      title="Bienvenido a Urbani" 
      description="Tu plataforma de gestión inmobiliaria profesional"
      showBackButton={true}
      backUrl={route('home')}
      backText="Volver al inicio"
    >
      <Head title="Autenticación - Urbani" />

      {/* Background decor */}
      {/* <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-32 left-1/2 h-72 w-[32rem] -translate-x-1/2 rounded-full bg-gradient-to-r from-blue-500/15 to-purple-600/15 blur-3xl" />
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(transparent_1px,rgba(0,0,0,0.03)_1px)] [background-size:24px_24px] dark:bg-[radial-gradient(transparent_1px,rgba(255,255,255,0.05)_1px)]" />
      </div> */}

      <div className="w-full max-w-3xl">
        <div className="flex flex-col gap-8">
          {/* Hero */}
          <div className="text-center space-y-5 animate-in fade-in duration-500">
            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 rounded-full blur-2xl opacity-30 bg-gradient-to-r from-blue-500 to-purple-600" />
                <div className="relative p-4 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg ring-1 ring-white/20 dark:ring-black/20">
                  <Building2 className="h-8 w-8 text-white" />
                </div>
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Gestiona tus propiedades de manera profesional</h1>
            <p className="text-muted-foreground max-w-xl mx-auto text-sm md:text-base">
              Accede a herramientas avanzadas para administrar, promocionar y vender propiedades inmobiliarias con eficiencia.
            </p>

            {/* CTA inline */}
            <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-4 pt-2">
              <Link href={route('login')} className="w-full sm:w-auto">
                <Button size="lg" className="w-full h-12 md:h-14 gap-2 text-base font-medium bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg transition-all duration-200 hover:shadow-xl">
                  <Key className="h-5 w-5" />
                  Iniciar Sesión
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href={route('register')} className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full h-12 md:h-14 gap-2 text-base font-medium border-2">
                  <UserPlus className="h-5 w-5" />
                  Crear Cuenta
                </Button>
              </Link>
            </div>
          </div>

          {/* Feature card (glass) */}
          <div className="rounded-3xl border bg-white/60 dark:bg-slate-900/40 backdrop-blur-xl shadow-xl ring-1 ring-black/[0.03] dark:ring-white/[0.06] p-6 md:p-8 animate-in fade-in duration-700 delay-150">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              {features.map((f) => (
                <Card
                  key={f.title}
                  className={`border-0 shadow-sm bg-gradient-to-br ${f.from} ${f.to} ${f.darkFrom} ${f.darkTo} hover:shadow-md transition-all duration-300 hover:-translate-y-1 rounded-2xl`}
                >
                  <CardHeader className="pb-3">
                    <div className={`w-11 h-11 ${f.dot} rounded-xl flex items-center justify-center mb-2 shadow-sm ring-1 ring-black/10/10`}>
                      <f.icon className="h-5 w-5 text-white" />
                    </div>
                    <CardTitle className="text-sm">{f.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-xs leading-relaxed">{f.desc}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Secondary CTAs */}
            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Link href={route('login')} className="w-full">
                <Button variant="secondary" className="w-full h-12 justify-between rounded-xl">
                  Continuar con mi cuenta
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href={route('register')} className="w-full">
                <Button variant="ghost" className="w-full h-12 justify-between rounded-xl">
                  Soy nuevo en Urbani
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Trust & meta */}
          <div className="text-center space-y-3 animate-in fade-in duration-700 delay-300">
            <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs text-muted-foreground bg-background/50 backdrop-blur">
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" aria-hidden />
              SSL y cifrado activo
            </div>
            <p className="text-xs text-muted-foreground">¿Necesitas ayuda? Contacta con nuestro equipo de soporte</p>
            <div className="flex justify-center flex-wrap items-center gap-3 text-xs">
              <Link href={route('home')} className="underline-offset-4 hover:underline">Volver al inicio</Link>
              <span className="text-muted-foreground">•</span>
              <Link href={route('terms')} className="underline-offset-4 hover:underline">Términos y condiciones</Link>
              <span className="text-muted-foreground">•</span>
              <Link href={route('privacy')} className="underline-offset-4 hover:underline">Política de privacidad</Link>
            </div>
          </div>
        </div>
      </div>
    </AuthLayout>
  )
}