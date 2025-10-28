import React from 'react';
import { Card, Badge } from 'flowbite-react';
import { Link } from 'react-router-dom';
import { Evento } from '../../../types/eventos';

interface EventoCardProps {
  evento: Evento;
}

const EventoCard: React.FC<EventoCardProps> = ({ evento }) => {
  const displayPrice = evento.es_pagado ? `$${evento.costo}` : 'Gratis';
  const eventType = evento.tipo ? evento.tipo.charAt(0).toUpperCase() + evento.tipo.slice(1) : 'Evento';

  return (
    <Card className="h-full flex flex-col">
      <div className="flex-grow">
        <div className="flex justify-between items-center mb-2">
          <Badge color="indigo">{eventType}</Badge>
          <Badge color={evento.es_pagado ? 'warning' : 'success'}>{displayPrice}</Badge>
        </div>
        <h5 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
          {evento.nombre}
        </h5>
        <p className="font-normal text-gray-700 dark:text-gray-400 line-clamp-3 mt-2">
          {evento.descripcion || 'No hay descripción disponible.'}
        </p>
      </div>
      <Link to={`/evento/${evento.id}`}>
        <button className="w-full mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Ver más detalles
        </button>
      </Link>
    </Card>
  );
};

export default EventoCard;