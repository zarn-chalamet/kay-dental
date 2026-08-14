interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  fullScreen?: boolean;
  label?: string;
}

export default function LoadingSpinner({
  size = 'md',
  fullScreen = false,
  label,
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-8 w-8 border-2',
    md: 'h-12 w-12 border-[3px]',
    lg: 'h-16 w-16 border-4',
  };

  const containerClass = fullScreen
    ? 'min-h-screen flex items-center justify-center bg-gray-50'
    : 'min-h-[400px] flex items-center justify-center';

  return (
    <div className={containerClass}>
      <div className="flex flex-col items-center gap-4">
        {/* Modern dual-ring spinner */}
        <div className="relative">
          <div
            className={`${sizeClasses[size]} rounded-full border-gray-200`}
          />
          <div
            className={`${sizeClasses[size]} absolute top-0 left-0 rounded-full border-transparent border-t-green-600 animate-spin`}
          />
        </div>

        {label && (
          <p className="text-sm font-medium text-gray-500 animate-pulse">
            {label}
          </p>
        )}
      </div>
    </div>
  );
}