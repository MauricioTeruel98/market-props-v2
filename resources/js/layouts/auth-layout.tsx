import AuthLayoutTemplate from '@/layouts/auth/auth-simple-layout';

interface AuthLayoutProps {
    children: React.ReactNode;
    title: string;
    description: string;
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

export default function AuthLayout({ 
    children, 
    title, 
    description, 
    className,
    showBackButton,
    backUrl,
    backText,
    breadcrumbs,
    currentPage,
    ...props 
}: AuthLayoutProps) {
    return (
        <AuthLayoutTemplate 
            title={title} 
            description={description} 
            className={className}
            showBackButton={showBackButton}
            backUrl={backUrl}
            backText={backText}
            breadcrumbs={breadcrumbs}
            currentPage={currentPage}
            {...props}
        >
            {children}
        </AuthLayoutTemplate>
    );
}
