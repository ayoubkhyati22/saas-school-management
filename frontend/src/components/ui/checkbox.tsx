import React from "react";

interface CheckboxProps {
  id?: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  id,
  checked,
  onCheckedChange,
  disabled = false,
  className = "",
}) => {
  return (
    <input
      type="checkbox"
      id={id}
      checked={checked}
      disabled={disabled}
      onChange={(e) => onCheckedChange(e.target.checked)}
      className={`h-4 w-4 cursor-pointer ${className}`}
    />
  );
};
