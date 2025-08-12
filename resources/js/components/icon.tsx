import { cn } from '@/lib/utils';
import { 
    Plus, 
    MoreHorizontal, 
    Edit, 
    Trash, 
    ArrowLeft, 
    X 
} from 'lucide-react';

interface IconProps {
    name: string;
    className?: string;
}

const iconMap = {
    'plus': Plus,
    'more-horizontal': MoreHorizontal,
    'edit': Edit,
    'trash': Trash,
    'arrow-left': ArrowLeft,
    'x': X,
};

export function Icon({ name, className, ...props }: IconProps) {
    const IconComponent = iconMap[name as keyof typeof iconMap];
    
    if (!IconComponent) {
        return null;
    }
    
    return <IconComponent className={cn('h-4 w-4', className)} {...props} />;
}
