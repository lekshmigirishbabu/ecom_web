import { X } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  onClose?: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onClose }) => {
  return (
    <div className="mb-4 bg-red-50 border border-red-200 rounded-md p-4">
      <div className="flex items-center justify-between">
        <p className="text-red-800">{message}</p>
        {onClose && (
          <button
            onClick={onClose}
            className="text-red-600 hover:text-red-800"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
};