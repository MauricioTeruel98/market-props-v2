import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/icon";

export function BackToTop() {
    const [isVisible, setIsVisible] = useState(false);

    // Función para hacer scroll suave hacia arriba
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    // Función para mostrar/ocultar el botón basado en el scroll
    const toggleVisibility = () => {
        if (window.pageYOffset > 300) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    };

    // Efecto para agregar el event listener del scroll
    useEffect(() => {
        window.addEventListener("scroll", toggleVisibility);
        return () => {
            window.removeEventListener("scroll", toggleVisibility);
        };
    }, []);

    return (
        <>
            {isVisible && (
                <Button
                    onClick={scrollToTop}
                    className="fixed bottom-6 right-6 z-50 bg-sky-400 hover:bg-sky-500 text-sky-900 rounded-full w-12 h-12 p-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
                    aria-label="Volver arriba"
                >
                    <Icon name="chevron-up" className="h-6 w-6" />
                </Button>
            )}
        </>
    );
}
