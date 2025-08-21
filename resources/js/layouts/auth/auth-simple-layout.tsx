import AppLogoIcon from '@/components/app-logo-icon';
import { Link } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/icon';
import AuthBreadcrumbs from '@/components/auth-breadcrumbs';
import AuthMobileNav from '@/components/auth-mobile-nav';

interface AuthLayoutProps {
    name?: string;
    title?: string;
    description?: string;
    className?: string;
    showBackButton?: boolean;
    backUrl?: string;
    backText?: string;
    breadcrumbs?: Array<{
        label: string;
        href?: string;
        current?: boolean;
    }>;
    currentPage?: string;
}

export default function AuthSimpleLayout({ 
    children, 
    title, 
    description, 
    className,
    showBackButton = true,
    backUrl = '/',
    backText = 'Volver al inicio',
    breadcrumbs = [],
    currentPage
}: PropsWithChildren<AuthLayoutProps>) {
    return (
        <div className="flex min-h-svh flex-col bg-background">
            {/* Barra de navegación superior */}
            <nav className="w-full bg-background border-b border-border/40">
                <div className="flex items-center justify-between h-16 max-w-7xl mx-auto px-4">
                    <Link href={route('home')} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                        <AppLogoIcon className="size-8 fill-current text-[var(--foreground)] dark:text-white" />
                        <span className="font-semibold text-lg">Urbani</span>
                    </Link>
                    
                    <div className="hidden md:flex items-center gap-4">
                        <Link href={route('home')}>
                            <Button variant="ghost" size="sm">
                                <Icon name="home" className="h-4 w-4 mr-2" />
                                Inicio
                            </Button>
                        </Link>
                        <Link href={route('login')}>
                            <Button variant="ghost" size="sm">
                                <Icon name="log-in" className="h-4 w-4 mr-2" />
                                Iniciar Sesión
                            </Button>
                        </Link>
                        <Link href={route('register')}>
                            <Button variant="ghost" size="sm">
                                <Icon name="user-plus" className="h-4 w-4 mr-2" />
                                Registrarse
                            </Button>
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Breadcrumbs */}
            {breadcrumbs.length > 0 && (
                <div className="border-b border-border/40 bg-muted/20">
                    <div className="max-w-7xl mx-auto px-4 py-2">
                        <AuthBreadcrumbs items={breadcrumbs} />
                    </div>
                </div>
            )}

            {/* Contenido principal */}
            <div className="flex-1 flex items-center justify-center p-6 md:p-10 pb-20 md:pb-10">
                <div className={`w-full max-w-sm ${className}`}>
                    <div className="flex flex-col gap-8">
                        <div className="flex flex-col items-center gap-4">
                            <div className="flex flex-col items-center gap-2 font-medium">
                                <div className="mb-1 flex h-12 w-12 items-center justify-center rounded-md">
                                    <AppLogoIcon className="size-12 fill-current text-[var(--foreground)] dark:text-white" />
                                </div>
                                <span className="sr-only">{title}</span>
                            </div>

                            <div className="space-y-2 text-center">
                                <h1 className="text-xl font-medium">{title}</h1>
                                <p className="text-center text-sm text-muted-foreground">{description}</p>
                            </div>
                        </div>
                        {children}
                        
                        {/* Botón de volver */}
                        {showBackButton && (
                            <div className="pt-4 border-t border-border/40">
                                <Link href={backUrl}>
                                    <Button variant="outline" className="w-full" size="sm">
                                        <Icon name="arrow-left" className="h-4 w-4 mr-2" />
                                        {backText}
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Navegación móvil */}
            <AuthMobileNav 
                currentPage={currentPage}
                backUrl={backUrl}
                backText={backText}
            />
        </div>
    );
}
