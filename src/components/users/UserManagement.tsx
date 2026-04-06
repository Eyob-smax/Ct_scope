import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  MoreHorizontal, 
  UserPlus, 
  Shield, 
  Mail, 
  MapPin,
  Calendar,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { useUsers, useCreateUser, useUpdateUser } from '../../features/users/hooks';
import { User, UserRole } from '../../types';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Modal } from '../shared/Modal';
import { UserForm } from './UserForm';
import { UserFormData } from '../../features/users/schema';
import { toast } from 'sonner';

export default function UserManagement() {
  const { data: users = [], isLoading } = useUsers();
  const createUserMutation = useCreateUser();
  const updateUserMutation = useUpdateUser();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const handleCreateUser = async (data: UserFormData) => {
    try {
      await createUserMutation.mutateAsync(data as Omit<User, 'id'>);
      setIsCreateModalOpen(false);
      toast.success('User created successfully');
    } catch (error) {
      toast.error('Failed to create user');
    }
  };

  const handleUpdateUser = async (data: UserFormData) => {
    if (!editingUser) return;
    try {
      await updateUserMutation.mutateAsync({ id: editingUser.id, user: data as Partial<User> });
      setEditingUser(null);
      toast.success('User updated successfully');
    } catch (error) {
      toast.error('Failed to update user');
    }
  };

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'federal_admin': return <Badge className="bg-red-500 hover:bg-red-600">Federal Admin</Badge>;
      case 'regional_admin': return <Badge className="bg-blue-500 hover:bg-blue-600">Regional Admin</Badge>;
      case 'zonal_admin': return <Badge className="bg-purple-500 hover:bg-purple-600">Zonal Admin</Badge>;
      case 'woreda_admin': return <Badge className="bg-orange-500 hover:bg-orange-600">Woreda Admin</Badge>;
      case 'technician': return <Badge className="bg-green-500 hover:bg-green-600">Technician</Badge>;
      default: return <Badge variant="outline">{role}</Badge>;
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-full">Loading users...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground">Manage administrative access and roles across all tiers of the platform.</p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <UserPlus className="mr-2 h-4 w-4" /> Add New User
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-card p-4 rounded-xl border shadow-sm">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users by name or email..."
            className="pl-8"
          />
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="h-9 px-4">Total Users: {users.length}</Badge>
          <Badge variant="outline" className="h-9 px-4">Active: {users.filter(u => u.status === 'active').length}</Badge>
        </div>
      </div>

      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Region / Zone</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="font-medium">{user.name}</span>
                      <span className="text-xs text-muted-foreground">{user.email}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{getRoleBadge(user.role)}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 text-xs">
                    <MapPin className="h-3 w-3 text-muted-foreground" />
                    <span>{user.region}</span>
                    {user.zone && <span className="text-muted-foreground"> / {user.zone}</span>}
                  </div>
                </TableCell>
                <TableCell>
                  {user.status === 'active' ? (
                    <div className="flex items-center gap-1 text-green-500 text-xs font-medium">
                      <CheckCircle2 className="h-3 w-3" /> Active
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-red-500 text-xs font-medium">
                      <XCircle className="h-3 w-3" /> Inactive
                    </div>
                  )}
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  {user.phone}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuGroup>
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      </DropdownMenuGroup>
                      <DropdownMenuItem onClick={() => setEditingUser(user)}>
                        <Shield className="mr-2 h-4 w-4" /> Edit User
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Mail className="mr-2 h-4 w-4" /> Send Message
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive">
                        Deactivate User
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Add New User"
        description="Create a new administrative user for the platform."
      >
        <UserForm
          onSubmit={handleCreateUser}
          isSubmitting={createUserMutation.isPending}
        />
      </Modal>

      <Modal
        isOpen={!!editingUser}
        onClose={() => setEditingUser(null)}
        title="Edit User"
        description="Update user information and permissions."
      >
        {editingUser && (
          <UserForm
            initialData={editingUser}
            onSubmit={handleUpdateUser}
            isSubmitting={updateUserMutation.isPending}
          />
        )}
      </Modal>
    </div>
  );
}
