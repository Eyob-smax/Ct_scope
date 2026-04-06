import React from 'react';
import { useForm, UseFormReturn, FieldValues, DefaultValues, Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z, ZodType } from 'zod';
import { cn } from '../../lib/utils';
import { Button } from '../ui/button';

interface FormProps<T extends FieldValues> {
  schema: ZodType<T>;
  defaultValues?: DefaultValues<T>;
  onSubmit: (data: T) => void | Promise<void>;
  children: (methods: UseFormReturn<T>) => React.ReactNode;
  className?: string;
  submitLabel?: string;
  isSubmitting?: boolean;
}

export function Form<T extends FieldValues>({
  schema,
  defaultValues,
  onSubmit,
  children,
  className,
  submitLabel = 'Submit',
  isSubmitting = false,
}: FormProps<T>) {
  const methods = useForm<T>({
    resolver: zodResolver(schema) as Resolver<T>,
    defaultValues,
  });

  return (
    <form
      onSubmit={methods.handleSubmit(onSubmit)}
      className={cn('space-y-6', className)}
    >
      {children(methods)}
      <div className="flex justify-end gap-3">
        <Button
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : submitLabel}
        </Button>
      </div>
    </form>
  );
}
