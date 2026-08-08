import { AlertCircle, RefreshCw } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';

interface ErrorMessageProps {
  message?: string;
  queryKey?: string[];
}

export default function ErrorMessage({ 
  message = 'Failed to load data', 
  queryKey 
}: ErrorMessageProps) {
  const queryClient = useQueryClient();

  const handleRetry = () => {
    if (queryKey) {
      // Refetch specific query
      queryClient.invalidateQueries({ queryKey });
    } else {
      // Refetch ALL queries
      queryClient.invalidateQueries();
    }
  };

  return (
    <div className="min-h-[400px] flex flex-col items-center justify-center gap-4 p-6">
      <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
        <AlertCircle className="w-8 h-8 text-red-500" />
      </div>
      <div className="text-center">
        <h3 className="font-semibold text-gray-900 mb-1">Oops! Something went wrong</h3>
        <p className="text-gray-600 text-sm">{message}</p>
      </div>
      <button 
        onClick={handleRetry}
        className="btn-primary flex items-center gap-2"
      >
        <RefreshCw className="w-4 h-4" />
        Try Again
      </button>
    </div>
  );
}