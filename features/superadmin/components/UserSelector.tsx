"use client";

import { useState, useEffect, useMemo } from "react";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Card } from "@/components/ui/Card";

type SelectableUser = {
  id: string;
  name: string;
  email: string;
  role: string;
};

type UserSelectorProps = {
  value: string | null;
  onChange: (userId: string, user: SelectableUser) => void;
  error?: string;
};

export function UserSelector({ value, onChange, error }: UserSelectorProps) {
  const [users, setUsers] = useState<SelectableUser[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/superadmin/users/selectable");
        if (response.ok) {
          const data = await response.json();
          setUsers(data);
        }
      } catch (error) {
        console.error("Failed to fetch users", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    if (!searchTerm) return users;
    
    const term = searchTerm.toLowerCase();
    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term)
    );
  }, [users, searchTerm]);

  const selectedUser = users.find((u) => u.id === value);

  const handleUserSelect = (user: SelectableUser) => {
    onChange(user.id, user);
    setSearchTerm("");
    setShowDropdown(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setShowDropdown(true);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="admin-selector">
        Administrador de la Comunidad <span className="text-destructive">*</span>
      </Label>
      
      {selectedUser ? (
        <Card className="p-4 bg-muted">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">{selectedUser.name}</p>
              <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Rol actual: {selectedUser.role}
                {selectedUser.role === "USER" && " (se actualizará a ADMIN)"}
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                onChange("", {} as SelectableUser);
                setSearchTerm("");
              }}
              className="text-destructive hover:underline text-sm"
            >
              Cambiar
            </button>
          </div>
        </Card>
      ) : (
        <div className="relative">
          <Input
            id="admin-selector"
            type="text"
            placeholder="Buscar por nombre o email..."
            value={searchTerm}
            onChange={handleInputChange}
            onFocus={() => setShowDropdown(true)}
            disabled={isLoading}
          />
          
          {showDropdown && filteredUsers.length > 0 && (
            <div className="absolute z-50 w-full mt-1 bg-background border border-border rounded-md shadow-lg max-h-60 overflow-y-auto">
              {filteredUsers.map((user) => (
                <button
                  key={user.id}
                  type="button"
                  onClick={() => handleUserSelect(user)}
                  className="w-full px-4 py-3 text-left hover:bg-muted transition-colors border-b border-border last:border-b-0"
                >
                  <p className="font-medium text-sm">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {user.role}
                  </p>
                </button>
              ))}
            </div>
          )}
          
          {showDropdown && searchTerm && filteredUsers.length === 0 && (
            <div className="absolute z-50 w-full mt-1 bg-background border border-border rounded-md shadow-lg p-4">
              <p className="text-sm text-muted-foreground text-center">
                No se encontraron usuarios
              </p>
            </div>
          )}
        </div>
      )}

      {isLoading && (
        <p className="text-sm text-muted-foreground">Cargando usuarios...</p>
      )}

      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  );
}
