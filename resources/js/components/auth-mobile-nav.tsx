import { Link } from '@inertiajs/react';
import { Home, LogIn, UserPlus, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AuthMobileNavProps {
    currentPage?: string;
    onBack?: () => void;
    backUrl?: string;
    backText?: string;
}

export default function AuthMobileNav({ 
    currentPage = 'auth',
    onBack,
    backUrl = '/',
    backText = 'Volver'
}: AuthMobileNavProps) {
    const navItems = [
        { label: 'Inicio', href: route('home'), icon: Home },
        { label: 'Login', href: route('login'), icon: LogIn },
        { label: 'Registro', href: route('register'), icon: UserPlus },
    ];

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border/40 md:hidden z-50">
            <div className="flex items-center justify-around p-2">
                {/* Botón de volver */}
                {onBack ? (
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={onBack}
                        className="flex flex-col items-center gap-1 h-auto py-2"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        <span className="text-xs">{backText}</span>
                    </Button>
                ) : (
                    <Link href={backUrl}>
                        <Button 
                            variant="ghost" 
                            size="sm"
                            className="flex flex-col items-center gap-1 h-auto py-2"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            <span className="text-xs">{backText}</span>
                        </Button>
                    </Link>
                )}

                {/* Enlaces de navegación */}
                {navItems.map((item) => (
                    <Link key={item.label} href={item.href}>
                        <Button 
                            variant={currentPage === item.label.toLowerCase() ? "default" : "ghost"}
                            size="sm"
                            className="flex flex-col items-center gap-1 h-auto py-2"
                        >
                            <item.icon className="h-4 w-4" />
                            <span className="text-xs">{item.label}</span>
                        </Button>
                    </Link>
                ))}
            </div>
        </div>
    );
}
