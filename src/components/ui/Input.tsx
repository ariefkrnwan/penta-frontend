"use client";

import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onRightIconClick?: () => void;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ icon, rightIcon, onRightIconClick, className = "", ...props }, ref) => {
    return (
      <div className="flex items-center gap-3 w-full bg-[#DDE5FE] border-2 border-[#1B4EF5] rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-[#1B4EF5]/40 transition-all">
        {icon && (
          <span className="text-gray-400 flex-shrink-0 text-lg">{icon}</span>
        )}
        <input
          ref={ref}
          className={`flex-1 bg-transparent outline-none text-gray-700 placeholder:text-gray-400 text-sm ${className}`}
          {...props}
        />
        {rightIcon && (
          <button
            type="button"
            onClick={onRightIconClick}
            className="text-gray-400 flex-shrink-0 hover:text-gray-600 transition-colors"
          >
            {rightIcon}
          </button>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;