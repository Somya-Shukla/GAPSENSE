import { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = ({ label, error, className = '', ...props }: InputProps) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium mb-2 text-gray-300">
          {label}
        </label>
      )}
      <input
        className={`w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-crimson-accent/50 focus:ring-2 focus:ring-crimson-accent/20 text-white placeholder-gray-400 ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-crimson-accent">{error}</p>}
    </div>
  );
};

export default Input;

