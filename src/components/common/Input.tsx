import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    icon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    helperText?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, icon, rightIcon, helperText, className = '', ...props }, ref) => {
        return (
            <div className="w-full">
                {label && (
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">
                        {label}
                    </label>
                )}
                <div className="relative group">
                    <div className="relative flex items-center">
                        {icon && (
                            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 flex items-center pointer-events-none group-focus-within:text-indigo-400 transition-colors">
                                {icon}
                            </div>
                        )}
                        <input
                            ref={ref}
                            className={`w-full py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500
                                focus:bg-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none 
                                transition-all duration-200
                                ${icon ? 'pl-10' : 'pl-4'} 
                                ${rightIcon ? 'pr-10' : 'pr-4'}
                                ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}
                                ${className}`}
                            {...props}
                        />
                        {rightIcon && (
                            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center text-slate-400 group-focus-within:text-indigo-400 transition-colors">
                                {rightIcon}
                            </div>
                        )}
                    </div>
                </div>

                {/* Error and Helper Text */}
                {error && (
                    <p className="text-red-400 text-sm mt-1.5 font-medium flex items-center gap-1.5">
                        {error}
                    </p>
                )}
                {helperText && !error && (
                    <p className="text-slate-400 text-xs mt-1.5">{helperText}</p>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';

export default Input;