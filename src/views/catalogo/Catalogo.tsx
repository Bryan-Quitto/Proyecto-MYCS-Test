import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '../../utils/supabaseClient';
import { Evento, Carrera } from '../../types/eventos';
import EventoCard from './components/EventoCard';
import FiltrosCatalogo from './components/FiltrosCatalogo';
import { Alert, Spinner } from 'flowbite-react';

const Catalogo: React.FC = () => {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [carreras, setCarreras] = useState<Carrera[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [filtros, setFiltros] = useState({
    tipo: '',
    carreraId: '',
    esPagado: 'todos',
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data: eventosData, error: eventosError } = await supabase
          .from('Eventos')
          .select('*, carreras(id, nombre)')
          .eq('estado', 'publicado');

        if (eventosError) throw eventosError;

        const { data: carrerasData, error: carrerasError } = await supabase
          .from('carreras')
          .select('id, nombre');
        
        if (carrerasError) throw carrerasError;

        setEventos(eventosData || []);
        setCarreras(carrerasData || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleFiltroChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFiltros(prev => ({ ...prev, [name]: value }));
  };
  
  const handlePagadoChange = (checked: boolean) => {
    setFiltros(prev => ({ ...prev, esPagado: checked ? 'pago' : 'todos' }));
  };

  const eventosFiltrados = useMemo(() => {
    return eventos.filter(evento => {
      const filtroTipo = !filtros.tipo || evento.tipo === filtros.tipo;
      const filtroCarrera = !filtros.carreraId || evento.audiencia !== 'estudiantes_carrera' || evento.carreras.some(c => c.id.toString() === filtros.carreraId);
      const filtroPagado = filtros.esPagado === 'todos' || (filtros.esPagado === 'pago' && evento.es_pagado);
      
      return filtroTipo && filtroCarrera && filtroPagado;
    });
  }, [eventos, filtros]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="xl" />
        <span className="pl-3">Cargando eventos...</span>
      </div>
    );
  }

  if (error) {
    return <Alert color="failure">Error al cargar los datos: {error}</Alert>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Catálogo de Cursos y Eventos</h1>
      <FiltrosCatalogo
        carreras={carreras}
        filtros={filtros}
        onFiltroChange={handleFiltroChange}
        onPagadoChange={handlePagadoChange}
      />
      {eventosFiltrados.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {eventosFiltrados.map(evento => (
            <EventoCard key={evento.id} evento={evento} />
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-lg text-gray-500">No se encontraron eventos que coincidan con los filtros seleccionados.</p>
        </div>
      )}
    </div>
  );
};

export default Catalogo;