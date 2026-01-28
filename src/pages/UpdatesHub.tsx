import { useState } from 'react';
import { GitCommit, Tag, Clock } from 'lucide-react';

type UpdateRow = {
  id: string;
  hash: string;
  title: string;
  content_md: string;
  tags: string[];
  status: 'publicado';
  created_at: string;
};

// Datos históricos generados automáticamente desde Git Log
const GIT_COMMITS: UpdateRow[] = [
  {
    id: '18',
    hash: '7b05057',
    title: 'PDF: Detalle de Niveles de Cuidado y Criterios',
    content_md: 'Se incorporó una nueva sección al reporte PDF que detalla la estancia por sectores (UTI/UCE/Piso) y el cumplimiento de criterios médicos día por día. Incluye indicadores visuales (SÍ/NO) y justificaciones técnicas para una auditoría más ágil y profesional.',
    tags: ['pdf', 'feat', 'audit'],
    status: 'publicado',
    created_at: '2026-01-28T20:40:00-03:00'
  },
  {
    id: '17',
    hash: 'e547b8d',
    title: 'UX: Claridad en Estados de Internación',
    content_md: 'Mejora visual en la tabla de días de internación: se reemplazó la etiqueta "(Alta)" por "(Hoy)" cuando el paciente continúa internado, evitando confusiones sobre su estado actual. Se ajustó la lógica de detección de fechas de alta para prevenir falsos positivos por saltos de línea en el PDF.',
    tags: ['ui', 'ux', 'fix'],
    status: 'publicado',
    created_at: '2026-01-23T17:58:30-03:00'
  },
  {
    id: '16',
    hash: '53f95c9',
    title: 'Notificaciones WhatsApp y Endoscopía',
    content_md: 'Se eliminó la etiqueta de prueba en los mensajes salientes para producción. Se optimizó el algoritmo de lectura OCR en fojas de endoscopía, ampliando el contexto de búsqueda para localizar fechas en encabezados distantes.',
    tags: ['whatsapp', 'backend', 'ocr'],
    status: 'publicado',
    created_at: '2026-01-23T17:48:36-03:00'
  },
  {
    id: '15',
    hash: 'bce62f1',
    title: 'Módulo de Auditoría de Terapia Ad-Hoc',
    content_md: 'Implementación de reportes directos para días de terapia con discrepancias: ahora los auditores pueden enviar reclamos específicos por día vía WhatsApp. Se integró la validación de "Paciente Internado" en el header del reporte.',
    tags: ['feat', 'terapia', 'whatsapp'],
    status: 'publicado',
    created_at: '2026-01-23T17:42:00-03:00'
  },
  {
    id: '14',
    hash: 'f3f3bcb',
    title: 'Validación Estricta de Equipo Quirúrgico',
    content_md: 'Se robusteció la detección de duplicados en fojas quirúrgicas comparando la composición exacta del equipo médico (Cirujano, Anestesista, Ayudantes). Esto previene la fusión errónea de cirugías distintas realizadas en fechas cercanas.',
    tags: ['fix', 'backend', 'logic'],
    status: 'publicado',
    created_at: '2026-01-23T17:35:00-03:00'
  },
  {
    id: '8',
    hash: 'e127d61',
    title: 'Corrección de Comunicación Frontend-WhatsApp',
    content_md: 'Se corrigió un error crítico en la llamada al servicio de WhatsApp donde los argumentos se enviaban de forma incorrecta. Ahora los mensajes se envían con el payload completo requerido por Builderbot y se mejoró el manejo de errores en el frontend.',
    tags: ['fix', 'whatsapp', 'frontend'],
    status: 'publicado',
    created_at: '2026-01-20T11:39:49-03:00'
  },
  {
    id: '9',
    hash: 'a678dcc',
    title: 'Mejora Visual: Texto de Vista Previa',
    content_md: 'Se ajustó el color del texto en la vista previa del mensaje a negro (#000000) para garantizar una legibilidad óptima sobre el fondo claro del contenedor.',
    tags: ['style', 'ui', 'ux'],
    status: 'publicado',
    created_at: '2026-01-20T11:32:15-03:00'
  },
  {
    id: '10',
    hash: '22158da',
    title: 'Ajustes Finales en Mensajería Genérica',
    content_md: 'Sincronización final de todas las plantillas de mensaje y validaciones para asegurar consistencia en la comunicación con las obras sociales.',
    tags: ['chore', 'whatsapp', 'sync'],
    status: 'publicado',
    created_at: '2026-01-20T11:28:52-03:00'
  },
  {
    id: '11',
    hash: '5a70a1c',
    title: 'Universalización en Edge Function',
    content_md: 'Actualización de la Edge Function "enviar-whatsapp" para utilizar terminología genérica (la Obra Social) en lugar de marcas específicas, permitiendo auditar casos de cualquier prestador.',
    tags: ['fix', 'backend', 'whatsapp'],
    status: 'publicado',
    created_at: '2026-01-20T11:19:02-03:00'
  },
  {
    id: '12',
    hash: '3569d98',
    title: 'Reemplazo Global de Marca OSDE',
    content_md: 'Se eliminaron todas las referencias hardcodeadas a OSDE en el frontend y backend. El sistema ahora utiliza "la Obra Social" como término estándar en todas las comunicaciones y reportes.',
    tags: ['fix', 'refactor', 'branding'],
    status: 'publicado',
    created_at: '2026-01-20T11:13:31-03:00'
  },
  {
    id: '13',
    hash: '83e9ec8',
    title: 'Flexibilización de Auditoría Quirúrgica',
    content_md: 'Cambio arquitectónico en el motor de auditoría: la ausencia de foja quirúrgica ya no se considera un error crítico si no se detecta actividad quirúrgica en el documento. Esto permite procesar internaciones clínicas correctamente.',
    tags: ['fix', 'audit', 'logic'],
    status: 'publicado',
    created_at: '2026-01-20T11:11:04-03:00'
  },
  {
    id: '1',
    hash: 'a3dbd1c',
    title: 'Actualización de Documentación: Nuevas Funcionalidades',
    content_md: 'Se ha renovado completamente la sección de Documentación para reflejar las nuevas capacidades del sistema: Clasificación de Terapia, Detección de Prácticas Excluidas, Módulo de Interconsultas y Endoscopías. Se eliminaron referencias genéricas a IA en favor de terminología técnica más precisa.',
    tags: ['docs', 'feature', 'refactor'],
    status: 'publicado',
    created_at: '2026-01-12T15:14:31-03:00'
  },
  {
    id: '2',
    hash: 'ea65def',
    title: 'Mejora en Deduplicación de Fojas Quirúrgicas',
    content_md: 'Corrección crítica en la lógica de procesamiento de fojas quirúrgicas. Ahora se verifica el equipo médico completo para evitar falsos duplicados y se optimizó el despliegue de las funciones serverless.',
    tags: ['fix', 'backend', 'logic'],
    status: 'publicado',
    created_at: '2025-12-26T19:45:03-03:00'
  },
  {
    id: '3',
    hash: '018899f',
    title: 'Detección Inteligente de Fechas en Cirugías',
    content_md: 'Se implementó un algoritmo de proximidad para asignar la fecha correcta a cada foja quirúrgica, capturando la fecha válida más cercana en el texto extraído del PDF.',
    tags: ['fix', 'algorithm', 'parser'],
    status: 'publicado',
    created_at: '2025-12-26T19:39:41-03:00'
  },
  {
    id: '4',
    hash: '30ebe19',
    title: 'Ajuste de Regex para Videoesofagogastroduodenoscopía',
    content_md: 'Se corrigieron las expresiones regulares para detectar variantes de escritura en estudios endoscópicos complejos y se relajaron ciertas reglas de deduplicación que eran demasiado estrictas.',
    tags: ['fix', 'regex', 'bug'],
    status: 'publicado',
    created_at: '2025-12-26T19:35:02-03:00'
  },
  {
    id: '5',
    hash: '4f2c88f',
    title: 'Rediseño de Branding en Header y Footer',
    content_md: 'Actualización estética de la interfaz: el logo ahora se presenta dentro de un contenedor circular blanco con borde verde distintivo, alineándose con la nueva identidad visual.',
    tags: ['style', 'ui', 'branding'],
    status: 'publicado',
    created_at: '2025-12-26T19:25:36-03:00'
  },
  {
    id: '6',
    hash: '8b34b81',
    title: 'Corrección de Estructura HTML en Informe',
    content_md: 'Limpieza de código: se eliminaron divs de cierre huérfanos que causaban problemas de renderizado en el componente de Informe de Auditoría.',
    tags: ['fix', 'html', 'cleanup'],
    status: 'publicado',
    created_at: '2025-12-26T19:19:34-03:00'
  },
  {
    id: '7',
    hash: '925c2dc',
    title: 'Resolución de Errores de Build',
    content_md: 'Se solucionaron conflictos de tipos en TypeScript relacionados con la librería de PDF y el componente de auditoría, asegurando un build de producción estable.',
    tags: ['fix', 'build', 'typescript'],
    status: 'publicado',
    created_at: '2025-12-26T19:15:58-03:00'
  }
];

export function UpdatesHub() {
  const [q, setQ] = useState('');

  const filtered = GIT_COMMITS.filter((i) => {
    const query = q.trim().toLowerCase();
    if (!query) return true;
    return (
      i.title.toLowerCase().includes(query) ||
      i.content_md.toLowerCase().includes(query) ||
      i.tags.some((t) => t.toLowerCase().includes(query)) ||
      i.hash.includes(query)
    );
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <GitCommit className="w-8 h-8 text-green-400" />
            Actualizaciones del Sistema
          </h2>
          <p className="text-green-100 mt-2">Bitácora de cambios, mejoras y correcciones desplegadas.</p>
        </div>
      </div>

      <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div className="relative w-full md:w-96">
            <input
              placeholder="Buscar por versión, título o tag..."
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all outline-none pl-11 text-gray-900 placeholder-gray-500"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
            <svg
              className="w-5 h-5 text-gray-400 absolute left-3 top-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <div className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            {filtered.length} versiones encontradas
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <GitCommit className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-lg">No se encontraron actualizaciones con ese criterio.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((u) => (
              <article key={u.id} className="group relative bg-white rounded-xl border border-gray-100 p-6 hover:shadow-lg hover:border-green-200 transition-all duration-300">
                <div className="absolute top-0 left-0 w-1 h-full bg-gray-200 rounded-l-xl group-hover:bg-green-500 transition-colors"></div>

                <div className="flex flex-col md:flex-row gap-6">
                  {/* Columna Izquierda: MetaInfo */}
                  <div className="md:w-48 flex-shrink-0 flex flex-col gap-2 border-b md:border-b-0 md:border-r border-gray-100 pb-4 md:pb-0 md:pr-4">
                    <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                      <Clock className="w-4 h-4" />
                      <time dateTime={u.created_at}>
                        {new Date(u.created_at).toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </time>
                    </div>
                    <div className="font-mono text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded w-fit flex items-center gap-1">
                      <GitCommit className="w-3 h-3" />
                      {u.hash}
                    </div>
                    <div className="mt-auto pt-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 capitalize">
                        {u.status}
                      </span>
                    </div>
                  </div>

                  {/* Columna Derecha: Contenido */}
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-green-700 transition-colors mb-2">
                      {u.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed text-sm mb-4">
                      {u.content_md}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {(u.tags || []).map((t) => (
                        <span key={t} className="inline-flex items-center gap-1 px-3 py-1 bg-gray-50 text-gray-600 border border-gray-200 rounded-full text-xs font-medium hover:bg-green-50 hover:text-green-700 hover:border-green-200 transition-colors cursor-default">
                          <Tag className="w-3 h-3" />
                          #{t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
