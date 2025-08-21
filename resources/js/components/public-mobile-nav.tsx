import { Link } from '@inertiajs/react';
import { Home, Search, Plus, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PublicMobileNavProps {
    currentPage?: string;
    onBack?: () => void;
    backUrl?: string;
    backText?: string;
    showBackButton?: boolean;
}

export default function PublicMobileNav({ 
    currentPage = 'home',
    onBack,
    backUrl = '/',
    backText = 'Volver',
    showBackButton = false
}: PublicMobileNavProps) {
    const navItems = [
        { 
            label: 'Inicio', 
            href: route('home'), 
            icon: Home,
            key: 'home'
        },
        { 
            label: 'Propiedades', 
            href: route('public.properties.index'), 
            icon: Search,
            key: 'properties'
        },
        { 
            label: 'Publicar', 
            href: route('autenticate'), 
            icon: Plus,
            key: 'publish'
        },
    ];

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-gray-800 md:hidden z-50">
            <div className="flex items-center justify-around p-2">
                {/* Botón de volver (opcional) */}
                {showBackButton && (
                    onBack ? (
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={onBack}
                            className="flex flex-col items-center gap-1 h-auto py-2 text-gray-300 hover:text-white hover:bg-gray-800"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            <span className="text-xs">{backText}</span>
                        </Button>
                    ) : (
                        <Link href={backUrl}>
                            <Button 
                                variant="ghost" 
                                size="sm"
                                className="flex flex-col items-center gap-1 h-auto py-2 text-gray-300 hover:text-white hover:bg-gray-800"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                <span className="text-xs">{backText}</span>
                            </Button>
                        </Link>
                    )
                )}

                {/* Enlaces de navegación */}
                {navItems.map((item) => (
                    <Link key={item.key} href={item.href}>
                        <Button 
                            variant={currentPage === item.key ? "default" : "ghost"}
                            size="sm"
                            className={`flex flex-col items-center gap-1 h-auto py-2 ${
                                currentPage === item.key 
                                    ? "bg-sky-400 text-sky-900 hover:bg-sky-500" 
                                    : "text-gray-300 hover:text-white hover:bg-gray-800"
                            }`}
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
