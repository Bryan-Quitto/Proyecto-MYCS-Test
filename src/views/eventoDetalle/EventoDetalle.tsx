import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../../utils/supabaseClient';
import { Evento } from '../../types/eventos';
import { Alert, Spinner, Card, Badge } from 'flowbite-react';
import { HiCalendar, HiOutlineClock, HiUser, HiIdentification, HiOutlineSparkles } from 'react-icons/hi';

const EventoDetalle: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [evento, setEvento] = useState<Evento | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvento = async () => {
      if (!id || isNaN(Number(id))) {
        setError("El ID del evento no es válido.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const { data, error: dbError } = await supabase
          .from('Eventos')
          .select(`
            *,
            responsable:perfiles!responsable_id(id, nombre1, apellido1),
            docente:perfiles!docente_id(id, nombre1, apellido1)
          `)
          .eq('id', id)
          .single();

        if (dbError) {
          if (dbError.code === 'PGRST116') {
            throw new Error('El evento que buscas no existe.');
          }
          throw dbError;
        }
        
        setEvento(data);

      } catch (err: any) {
        setError(err.message || 'Ocurrió un error inesperado.');
      } finally {
        setLoading(false);
      }
    };

    fetchEvento();
  }, [id]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'No especificada';
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="xl" />
        <span className="pl-3">Cargando detalles del evento...</span>
      </div>
    );
  }

  if (error) {
    return <Alert color="failure">{error}</Alert>;
  }
  
  if (!evento) {
     return <Alert color="warning">No se pudo cargar la información del evento.</Alert>;
  }

  return (
    <Card>
      <div className="flex flex-col md:flex-row justify-between items-start">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">{evento.nombre}</h1>
        <Badge size="lg" color={evento.es_pagado ? 'warning' : 'success'}>
          {evento.es_pagado ? `Costo: $${evento.costo}` : 'Gratuito'}
        </Badge>
      </div>
      <p className="text-lg text-gray-600 dark:text-gray-400 mt-2 mb-6">
        {evento.descripcion || "Este evento no tiene una descripción detallada."}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Información General</h3>
          <p className="flex items-center"><HiCalendar className="mr-2" /> <b>Inicia:</b> {formatDate(evento.fecha_inicio_evento)}</p>
          <p className="flex items-center"><HiCalendar className="mr-2" /> <b>Finaliza:</b> {formatDate(evento.fecha_fin_evento)}</p>
          {evento.numero_horas && <p className="flex items-center"><HiOutlineClock className="mr-2" /> <b>Duración:</b> {evento.numero_horas} horas</p>}
          {evento.genera_certificado && <p className="flex items-center"><HiOutlineSparkles className="mr-2" /> Otorga certificado de {evento.tipo === 'curso' ? 'aprobación' : 'asistencia'}.</p>}
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Inscripciones</h3>
          <p className="flex items-center"><HiCalendar className="mr-2" /> <b>Apertura:</b> {formatDate(evento.fecha_inicio_inscripcion)}</p>
          <p className="flex items-center"><HiCalendar className="mr-2" /> <b>Cierre:</b> {formatDate(evento.fecha_fin_inscripcion)}</p>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Responsables</h3>
          {evento.responsable && <p className="flex items-center"><HiUser className="mr-2" /> <b>A cargo:</b> {`${evento.responsable.nombre1} ${evento.responsable.apellido1}`}</p>}
          {evento.docente && <p className="flex items-center"><HiIdentification className="mr-2" /> <b>Docente:</b> {`${evento.docente.nombre1} ${evento.docente.apellido1}`}</p>}
        </div>
      </div>
      
      <div className="mt-8 flex justify-end">
        <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg text-lg">
          Inscribirse en este curso
        </button>
      </div>
    </Card>
  );
};

export default EventoDetalle;