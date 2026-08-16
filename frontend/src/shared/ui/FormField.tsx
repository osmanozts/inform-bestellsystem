import { Field } from '@chakra-ui/react';
import type { ReactNode } from 'react';

type FormFieldProps = {
  label: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
};

export function FormField({ label, error, required, children }: FormFieldProps) {
  return (
    <Field.Root invalid={!!error} required={required}>
      <Field.Label>{label}</Field.Label>
      {children}
      {error && <Field.ErrorText>{error}</Field.ErrorText>}
    </Field.Root>
  );
}
