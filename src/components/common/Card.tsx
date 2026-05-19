import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'default' | 'elevated' | 'outlined';
    children: React.ReactNode;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
    ({ variant = 'default', className = '', children, ...props }, ref) => {
        const baseStyles = 'rounded-2xl transition-all duration-300';

        const variantStyles = {
            default: 'bg-slate-900/80 backdrop-blur-md border border-slate-800 shadow-xl p-8',
            elevated: 'bg-slate-800 border border-slate-700 shadow-2xl p-8',
            outlined: 'bg-transparent border border-slate-800 p-8',
        };

        return (
            <div
                ref={ref}
                className={`${baseStyles} ${variantStyles[variant]} ${className}`}
                {...props}
            >
                {children}
            </div>
        );
    }
);

Card.displayName = 'Card';

export default Card;