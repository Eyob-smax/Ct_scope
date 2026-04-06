import React from 'react';
import { Form } from '../shared/Form';
import { userSchema, UserFormData } from '../../features/users/schema';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

interface UserFormProps {
  initialData?: Partial<UserFormData>;
  onSubmit: (data: UserFormData) => void;
  isSubmitting?: boolean;
}

export function UserForm({ initialData, onSubmit, isSubmitting }: UserFormProps) {
  return (
    <Form
      schema={userSchema}
      defaultValues={initialData}
      onSubmit={onSubmit}
      isSubmitting={isSubmitting}
      submitLabel={initialData ? 'Update User' : 'Create User'}
    >
      {(methods) => (
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              {...methods.register('name')}
              placeholder="Enter full name"
            />
            {methods.formState.errors.name && (
              <p className="text-xs text-destructive">{methods.formState.errors.name.message}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              {...methods.register('email')}
              placeholder="Enter email address"
            />
            {methods.formState.errors.email && (
              <p className="text-xs text-destructive">{methods.formState.errors.email.message}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="role">Role</Label>
            <Select
              onValueChange={(value) => methods.setValue('role', value as any)}
              defaultValue={methods.getValues('role')}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="federal_admin">Federal Admin</SelectItem>
                <SelectItem value="regional_admin">Regional Admin</SelectItem>
                <SelectItem value="zonal_admin">Zonal Admin</SelectItem>
                <SelectItem value="woreda_admin">Woreda Admin</SelectItem>
                <SelectItem value="technician">Technician</SelectItem>
              </SelectContent>
            </Select>
            {methods.formState.errors.role && (
              <p className="text-xs text-destructive">{methods.formState.errors.role.message}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              {...methods.register('phone')}
              placeholder="Enter phone number"
            />
            {methods.formState.errors.phone && (
              <p className="text-xs text-destructive">{methods.formState.errors.phone.message}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="region">Region</Label>
            <Input
              id="region"
              {...methods.register('region')}
              placeholder="Enter region"
            />
            {methods.formState.errors.region && (
              <p className="text-xs text-destructive">{methods.formState.errors.region.message}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="status">Status</Label>
            <Select
              onValueChange={(value) => methods.setValue('status', value as any)}
              defaultValue={methods.getValues('status')}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            {methods.formState.errors.status && (
              <p className="text-xs text-destructive">{methods.formState.errors.status.message}</p>
            )}
          </div>
        </div>
      )}
    </Form>
  );
}
