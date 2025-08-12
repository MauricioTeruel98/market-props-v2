import { Link } from "@inertiajs/react";
import { Icon } from "@/components/icon";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { MenuIcon } from "lucide-react";

interface PublicLayoutProps {
    children: React.ReactNode;
}

export default function PublicLayout({ children }: PublicLayoutProps) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <>
            {/* Header */}
            <header className="bg-black shadow-sm border-b border-gray-800">
                <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-14 sm:h-16">
                        {/* Logo */}
                        <div className="flex items-center">
                            <Link href="/" className="text-xl sm:text-2xl font-bold text-white">Market Props</Link>
                        </div>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex space-x-6 lg:space-x-8">
                            <Link href="/" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                                Inicio
                            </Link>
                            <Link href="/public/properties" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                                Propiedades
                            </Link>
                            <Link href="/register" passHref legacyBehavior>
                                <Button
                                    asChild
                                    className="bg-sky-400 hover:bg-sky-500 text-sky-900 font-semibold px-3 py-2 rounded-md text-sm transition-colors"
                                >
                                    <a>Publica</a>
                                </Button>
                            </Link>
                        </nav>

                        {/* Mobile Menu Button */}
                        <div className="md:hidden">
                            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                                <SheetTrigger asChild>
                                    <Button variant="ghost" size="sm" className="text-white hover:bg-gray-800 p-2">
                                        <MenuIcon />
                                    </Button>
                                </SheetTrigger>
                                <SheetContent side="right" className="w-64 bg-gray-900 border-gray-800">
                                    <SheetHeader className="border-b border-gray-800 pb-4 mb-6">
                                        <SheetTitle className="text-white text-lg">Menú</SheetTitle>
                                    </SheetHeader>
                                    <nav className="flex flex-col space-y-4">
                                        <Link 
                                            href="/" 
                                            className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-base font-medium transition-colors hover:bg-gray-800"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                        >
                                            Inicio
                                        </Link>
                                        <Link 
                                            href="/public/properties" 
                                            className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-base font-medium transition-colors hover:bg-gray-800"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                        >
                                            Propiedades
                                        </Link>
                                        <Link 
                                            href="/register"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            passHref
                                            legacyBehavior
                                        >
                                            <Button
                                                asChild
                                                className="bg-sky-400 hover:bg-sky-500 text-sky-900 font-semibold px-3 mx-3 py-2 rounded-md text-base transition-colors"
                                            >
                                                <a>Publica</a>
                                            </Button>
                                        </Link>
                                    </nav>
                                </SheetContent>
                            </Sheet>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="bg-black min-h-screen">
                {children}
            </main>

            {/* Footer */}
            <footer className="bg-black text-white py-8 sm:py-12 border-t border-gray-800">
                <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
                        <div>
                            <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-white">Market Props</h3>
                            <p className="text-sm sm:text-base text-gray-400">
                                Tu plataforma confiable para encontrar la propiedad ideal.
                            </p>
                        </div>
                        
                        <div>
                            <h4 className="font-semibold mb-3 sm:mb-4 text-white">Enlaces</h4>
                            <ul className="space-y-2">
                                <li><Link href="/" className="text-sm sm:text-base text-gray-400 hover:text-white transition-colors">Inicio</Link></li>
                                <li><Link href="/public/properties" className="text-sm sm:text-base text-gray-400 hover:text-white transition-colors">Propiedades</Link></li>
                                <li><Link href="/auth/login" className="text-sm sm:text-base text-gray-400 hover:text-white transition-colors">Iniciar Sesión</Link></li>
                            </ul>
                        </div>
                        
                        <div>
                            <h4 className="font-semibold mb-3 sm:mb-4 text-white">Servicios</h4>
                            <ul className="space-y-2">
                                <li className="text-sm sm:text-base text-gray-400">Alquiler</li>
                                <li className="text-sm sm:text-base text-gray-400">Venta</li>
                                <li className="text-sm sm:text-base text-gray-400">Asesoramiento</li>
                            </ul>
                        </div>
                        
                        <div>
                            <h4 className="font-semibold mb-3 sm:mb-4 text-white">Contacto</h4>
                            <ul className="space-y-2">
                                <li className="text-sm sm:text-base text-gray-400">info@marketprops.com</li>
                                <li className="text-sm sm:text-base text-gray-400">+54 11 1234-5678</li>
                                <li className="text-sm sm:text-base text-gray-400">Buenos Aires, Argentina</li>
                            </ul>
                        </div>
                    </div>
                    
                    <div className="border-t border-gray-800 mt-6 sm:mt-8 pt-6 sm:pt-8 text-center text-gray-400">
                        <p className="text-sm sm:text-base">&copy; 2024 Market Props. Todos los derechos reservados.</p>
                    </div>
                </div>
            </footer>
        </>
    );
}
