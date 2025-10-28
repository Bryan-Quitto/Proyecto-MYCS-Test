import { useState, useEffect } from 'react';
import { supabase } from '../../utils/supabaseClient';
import { UserProfile } from '../../types/user';
import { Alert } from 'flowbite-react';
import ListUser from './Componentes/ListUser';
import EditUser from './Componentes/EditUser';

interface UserFormData extends Partial<UserProfile> {
  password?: string;
}

const UserManagement = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
  const [formData, setFormData] = useState<UserFormData>({});
  const [alert, setAlert] = useState<{ type: 'success' | 'failure'; message: string } | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('perfiles')
        .select('*')
        .is('deleted_at', null)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      setAlert({ type: 'failure', message: 'Error al cargar usuarios' });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user: UserProfile) => {
    setEditingUser(user);
    setFormData({ ...user });
    setShowEditModal(true);
  };

  const handleDelete = async (userId: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este usuario?')) return;

    try {
      const { error } = await supabase
        .from('perfiles')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', userId);

      if (error) throw error;

      setAlert({ type: 'success', message: 'Usuario eliminado exitosamente' });
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      setAlert({ type: 'failure', message: 'Error al eliminar usuario' });
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingUser) {
        // Update user
        const { error } = await supabase
          .from('perfiles')
          .update({
            ...formData,
            updated_at: new Date().toISOString(),
          })
          .eq('id', editingUser.id);

        if (error) throw error;
        setAlert({ type: 'success', message: 'Usuario actualizado exitosamente' });
      }

      setShowEditModal(false);
      fetchUsers();
    } catch (error: any) {
      console.error('Error saving user:', error);
      setAlert({ type: 'failure', message: error.message || 'Error al guardar usuario' });
    }
  };

  const handleInputChange = (field: keyof UserFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Lista de Usuarios</h1>
      </div>

      {alert && (
        <Alert color={alert.type === 'success' ? 'green' : 'red'} className="mb-4">
          {alert.message}
        </Alert>
      )}

      <ListUser
        users={users}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />



      <EditUser
        show={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSubmit={handleEditSubmit}
        formData={formData}
        setFormData={setFormData}
        handleInputChange={handleInputChange}
        editingUser={editingUser}
      />
    </div>
  );
};

export default UserManagement;
