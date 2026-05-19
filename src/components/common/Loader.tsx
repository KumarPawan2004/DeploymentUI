export default function Loader({ size = "medium" }: { size?: 'small' | 'medium' | 'large' }) {
    const sizes = {
        small: 'w-5 h-5',
        medium: 'w-8 h-8',
        large: 'w-12 h-12'
    };

    return (
        <div className="flex justify-center items-center">
            <div className={`${sizes[size]} animate-spin rounded-full border-4 border-gray-300 border-t-blue-600`}></div>
        </div>
    );
}