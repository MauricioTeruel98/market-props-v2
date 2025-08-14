import { Link } from '@inertiajs/react';
import { Icon } from '@/components/icon';
import { Button } from '@/components/ui/button';

interface WelcomeSectionProps {
    userName: string;
    userRole: string;
    lastLogin?: string;
}

export function WelcomeSection({ userName, userRole, lastLogin }: WelcomeSectionProps) {
    const getRoleLabel = (role: string) => {
        switch (role) {
            case 'superadmin':
                return 'Super Administrador';
            case 'admin':
                return 'Administrador';
            default:
                return 'Usuario';
        }
    };

    return (
        <div className="rounded-xl border border-sidebar-border/70 bg-gradient-to-r from-primary/10 to-primary/5 p-6 dark:border-sidebar-border">
            <div className="flex items-start justify-between">
                <div className="space-y-2">
                    <h1 className="text-2xl font-bold text-foreground">
                        ¡Bienvenido de vuelta, {userName}! 👋
                    </h1>
                    <p className="text-muted-foreground">
                        {getRoleLabel(userRole)} • {lastLogin ? `Último acceso: ${lastLogin}` : 'Sesión activa'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                        Gestiona tus propiedades inmobiliarias desde este panel de control
                    </p>
                </div>
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/20">
                    <Icon name="user" className="h-8 w-8 text-primary" />
                </div>
            </div>
            
            <div className="mt-6 flex flex-wrap gap-3">
                <Button asChild size="sm">
                    <Link href="/admin/properties/create">
                        <Icon name="plus" className="mr-2 h-4 w-4" />
                        Nueva Propiedad
                    </Link>
                </Button>
                <Button asChild variant="outline" size="sm">
                    <Link href="/admin/properties">
                        <Icon name="list" className="mr-2 h-4 w-4" />
                        Ver Propiedades
                    </Link>
                </Button>
                {userRole === 'superadmin' && (
                    <Button asChild variant="outline" size="sm">
                        <Link href="/super/properties">
                            <Icon name="settings" className="mr-2 h-4 w-4" />
                            Panel Superadmin
                        </Link>
                    </Button>
                )}
            </div>
        </div>
    );
}
