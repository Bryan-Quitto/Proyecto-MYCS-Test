import { useState, useEffect } from 'react';
import { Button, Label, TextInput, Alert, Modal } from 'flowbite-react';
import { useNavigate } from 'react-router';
import { supabase } from '../../utils/supabaseClient';
import { useUser } from '../../contexts/UserContext';
import UserAvatar from '../../components/shared/UserAvatar';

const MiPerfil = () => {
    const navigate = useNavigate();
    const { user, profile, loading: userLoading } = useUser();
    
    const [updating, setUpdating] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [profileData, setProfileData] = useState({
        nombre1: '',
        nombre2: '',
        apellido1: '',
        apellido2: '',
        telefono: '',
        fecha_nacimiento: '',
    });

    useEffect(() => {
        if (profile) {
             const fetchFullProfile = async () => {
                const { data, error } = await supabase
                    .from('perfiles')
                    .select('*')
                    .eq('id', profile.id)
                    .single();

                if (error) {
                    setError('No se pudo cargar la información completa del perfil.');
                } else if (data) {
                    setProfileData({
                        nombre1: data.nombre1 || '',
                        nombre2: data.nombre2 || '',
                        apellido1: data.apellido1 || '',
                        apellido2: data.apellido2 || '',
                        telefono: data.telefono || '',
                        fecha_nacimiento: data.fecha_nacimiento || '',
                    });
                }
            };
            fetchFullProfile();
        }
    }, [profile]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setProfileData(prev => ({ ...prev, [name]: value }));
    };

    const handleUpdate = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null);
        setSuccessMessage(null);
        setUpdating(true);

        if (user) {
            const { error: updateError } = await supabase
                .from('perfiles')
                .update({
                    nombre1: profileData.nombre1.trim(),
                    nombre2: profileData.nombre2.trim() || null,
                    apellido1: profileData.apellido1.trim(),
                    apellido2: profileData.apellido2.trim() || null,
                    telefono: profileData.telefono.trim(),
                    fecha_nacimiento: profileData.fecha_nacimiento,
                    updated_at: new Date().toISOString(),
                })
                .eq('id', user.id);

            if (updateError) {
                setError('Error al actualizar el perfil. Inténtalo de nuevo.');
            } else {
                setSuccessMessage('¡Perfil actualizado con éxito!');
            }
        }
        setUpdating(false);
    };

    const handleDeactivate = async () => {
        setShowModal(false);
        if (user) {
            const { error: deactivateError } = await supabase
                .from('perfiles')
                .update({ is_active: false })
                .eq('id', user.id);

            if (deactivateError) {
                setError('No se pudo desactivar la cuenta. Inténtalo más tarde.');
            } else {
                await supabase.auth.signOut();
                navigate('/auth/login');
            }
        }
    };

    if (userLoading) {
        return <p className="p-4">Cargando perfil...</p>;
    }

    return (
        <>
            <div className="p-4 md:p-6">
                <h1 className="text-2xl font-semibold mb-6">Mi Perfil</h1>
                <div className="flex flex-col md:flex-row gap-8">
                    
                    <div className="w-full md:w-1/3 flex flex-col items-center">
                        <UserAvatar nombre={profileData.nombre1} apellido={profileData.apellido1} size={120} />
                        <h2 className="text-xl font-bold mt-4">{profileData.nombre1} {profileData.apellido1}</h2>
                        <p className="text-gray-500">{user?.email}</p>
                    </div>

                    <div className="w-full md:w-2/3">
                        <form onSubmit={handleUpdate}>
                            {error && <Alert color="failure" className="mb-4">{error}</Alert>}
                            {successMessage && <Alert color="success" className="mb-4">{successMessage}</Alert>}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <Label htmlFor="nombre1" value="Primer Nombre" />
                                    <TextInput id="nombre1" name="nombre1" type="text" required onChange={handleChange} value={profileData.nombre1} />
                                </div>
                                <div>
                                    <Label htmlFor="nombre2" value="Segundo Nombre (Opcional)" />
                                    <TextInput id="nombre2" name="nombre2" type="text" onChange={handleChange} value={profileData.nombre2} />
                                </div>
                                <div>
                                    <Label htmlFor="apellido1" value="Primer Apellido" />
                                    <TextInput id="apellido1" name="apellido1" type="text" required onChange={handleChange} value={profileData.apellido1} />
                                </div>
                                <div>
                                    <Label htmlFor="apellido2" value="Segundo Apellido (Opcional)" />
                                    <TextInput id="apellido2" name="apellido2" type="text" onChange={handleChange} value={profileData.apellido2} />
                                </div>
                                <div>
                                    <Label htmlFor="telefono" value="Teléfono" />
                                    <TextInput id="telefono" name="telefono" type="tel" maxLength={10} required onChange={handleChange} value={profileData.telefono} />
                                </div>
                                <div>
                                    <Label htmlFor="fecha_nacimiento" value="Fecha de Nacimiento" />
                                    <TextInput id="fecha_nacimiento" name="fecha_nacimiento" type="date" required onChange={handleChange} value={profileData.fecha_nacimiento} />
                                </div>
                            </div>
                            <Button color="primary" type="submit" disabled={updating}>
                                {updating ? 'Guardando...' : 'Guardar Cambios'}
                            </Button>
                        </form>

                        <div className="mt-10 pt-6 border-t border-gray-200">
                            <h2 className="text-xl font-semibold text-red-600">Desactivar Cuenta</h2>
                            <p className="my-2 text-sm text-gray-600">
                                Esta acción marcará tu cuenta como inactiva y cerrará tu sesión. No podrás volver a iniciar sesión.
                            </p>
                            <Button color="failure" onClick={() => setShowModal(true)}>
                                Desactivar mi cuenta
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <Modal show={showModal} onClose={() => setShowModal(false)} size="md" popup>
                <Modal.Header />
                <Modal.Body>
                    <div className="text-center">
                        <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                            ¿Estás seguro de que deseas desactivar tu cuenta?
                        </h3>
                        <div className="flex justify-center gap-4">
                            <Button color="failure" onClick={handleDeactivate}>
                                Sí, estoy seguro
                            </Button>
                            <Button color="gray" onClick={() => setShowModal(false)}>
                                No, cancelar
                            </Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default MiPerfil;