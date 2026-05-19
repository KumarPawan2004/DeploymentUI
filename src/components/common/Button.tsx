import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger' | 'success';
    isLoading?: boolean;
    size?: 'sm' | 'md' | 'lg';
    children: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            variant = 'primary',
            isLoading = false,
            size = 'md',
            className = '',
            children,
            disabled,
            ...props
        },
        ref
    ) => {
        const baseStyles =
            'inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 rounded-xl';

        const sizeStyles = {
            sm: 'px-4 py-2 text-sm',
            md: 'px-6 py-3 text-sm md:text-base',
            lg: 'px-8 py-4 text-base md:text-lg',
        };

        const variantStyles = {
            primary:
                'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/25 focus:ring-indigo-500 active:scale-[0.98]',
            secondary:
                'bg-white/5 border border-white/10 text-white hover:bg-white/10 focus:ring-white/20 active:scale-[0.98]',
            danger:
                'bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 hover:border-red-500/30 focus:ring-red-500 active:scale-[0.98]',
            success:
                'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 hover:border-emerald-500/30 focus:ring-emerald-500 active:scale-[0.98]',
        };

        return (
            <button
                ref={ref}
                disabled={isLoading || disabled}
                className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
                {...props}
            >
                {isLoading ? (
                    <>
                        <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    </>
                ) : (
                    children
                )}
            </button>
        );
    }
);

Button.displayName = 'Button';

export default Button;