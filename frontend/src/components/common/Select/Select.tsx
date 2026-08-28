import React from 'react';
import { SelectWrapper, Label, StyledSelect, ErrorMessage } from './Select.styles';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  error?: string;
  placeholder?: string;
}

export const Select: React.FC<SelectProps> = ({
  label, options, error, placeholder, id, ...props
}) => {
  const selectId = id ?? label?.toLowerCase().replace(/\s+/g, '-');
  return (
    <SelectWrapper>
      {label && <Label htmlFor={selectId}>{label}</Label>}
      <StyledSelect id={selectId} hasError={!!error} aria-invalid={!!error} {...props}>
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </StyledSelect>
      {error && <ErrorMessage role="alert">{error}</ErrorMessage>}
    </SelectWrapper>
  );
};
