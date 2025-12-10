import { useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  AlertCircle,
  CheckCircle,
  Download,
  Send,
  User,
  Calendar,
  Activity,
  Stethoscope,
  Syringe,
  FileText,
  AlertTriangle,
  Loader2,
  CheckCircle2
} from 'lucide-react';
import { generateAuditPDF } from '../utils/pdfGenerator';
import { enviarMensajeWhatsApp } from '../services/whatsappService';
import { ConfirmacionEnvioModal } from './ConfirmacionEnvioModal';

// ===== INTERFACES =====
interface ResultadoAuditoria {
  nombreArchivo: string;
  datosPaciente: any;
  fechaIngreso: string;
  fechaAlta: string;
  diasHospitalizacion: number;
  totalErrores: number;
  comunicaciones: any[];
  interconsultas?: any[];
  practicasExcluidas?: any[];
  endoscopias?: any[];
  practicasAmbulatorias?: any[];
  resultadoTerapia?: any;
  erroresEvolucion: string[];
  advertencias: any[];
  [key: string]: any;
}

// ===== COMPONENTES AUXILIARES =====
function CollapsibleSection({
  title,
  icon: Icon,
  children,
  defaultOpen = true,
  badge,
  badgeColor = 'bg-blue-500'
}: any) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden mb-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <Icon className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          {badge !== undefined && (
            <span className={`${badgeColor} text-white px-3 py-1 rounded-full text-sm font-semibold`}>
              {badge}
            </span>
          )}
        </div>
        {isOpen ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
      </button>
      {isOpen && <div className="px-6 pb-6 pt-2">{children}</div>}
    </div>
  );
}

function MetricCard({ label, value, icon: Icon, color = 'blue', subtitle }: any) {
  const colorClasses: any = {
    blue: 'bg-blue-50 border-blue-200 text-blue-700',
    green: 'bg-green-50 border-green-200 text-green-700',
    red: 'bg-red-50 border-red-200 text-red-700',
    orange: 'bg-orange-50 border-orange-200 text-orange-700',
    purple: 'bg-purple-50 border-purple-200 text-purple-700',
  };

  return (
    <div className={`p-4 rounded-lg border-2 ${colorClasses[color]}`}>
      <Icon className="w-8 h-8 mb-2" />
      <p className="text-sm font-medium opacity-80 mb-1">{label}</p>
      <p className="text-3xl font-bold">{value}</p>
      {subtitle && <p className="text-xs opacity-70 mt-1">{subtitle}</p>}
    </div>
  );
}

function StatusBadge({ status }: { status: 'success' | 'warning' | 'error' }) {
  const styles: any = {
    success: 'bg-green-100 text-green-800 border-green-300',
    warning: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    error: 'bg-red-100 text-red-800 border-red-300',
  };

  const icons: any = {
    success: <CheckCircle className="w-4 h-4" />,
    warning: <AlertTriangle className="w-4 h-4" />,
    error: <AlertCircle className="w-4 h-4" />,
  };

  const labels: any = {
    success: 'Aprobado',
    warning: 'Requiere Atención',
    error: 'Crítico',
  };

  return (
    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 font-semibold ${styles[status]}`}>
      {icons[status]}
      {labels[status]}
    </div>
  );
}

// ===== COMPONENTE PRINCIPAL =====
export function InformeAuditoria({ resultado, auditoriaId }: { resultado: ResultadoAuditoria; auditoriaId?: string }) {
  const [generandoPDF, setGenerandoPDF] = useState(false);
  const [modalConfirmacionAbierto, setModalConfirmacionAbierto] = useState(false);
  const [comunicacionSeleccionada, setComunicacionSeleccionada] = useState<number | null>(null);
  const [numeroDestino, setNumeroDestino] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [notification, setNotification] = useState<any>(null);

  const totalErrores = resultado.totalErrores || 0;
  const estadoGeneral = totalErrores === 0 ? 'success' : totalErrores > 5 ? 'error' : 'warning';

  const handleDescargarPDF = async () => {
    setGenerandoPDF(true);
    try {
      await generateAuditPDF(resultado, auditoriaId);
      setNotification({ type: 'success', message: 'PDF generado exitosamente' });
    } catch (error) {
      setNotification({ type: 'error', message: 'Error al generar PDF' });
    } finally {
      setGenerandoPDF(false);
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const abrirModalEnvio = (idx: number) => {
    setComunicacionSeleccionada(idx);
    setModalConfirmacionAbierto(true);
  };

  const handleConfirmarEnvio = async () => {
    if (comunicacionSeleccionada === null) return;

    setEnviando(true);
    try {
      const com = resultado.comunicaciones[comunicacionSeleccionada];
      await enviarMensajeWhatsApp(numeroDestino, com.mensaje);
      setNotification({ type: 'success', message: 'Mensaje enviado correctamente' });
      setModalConfirmacionAbierto(false);
    } catch (error) {
      setNotification({ type: 'error', message: 'Error al enviar mensaje' });
    } finally {
      setEnviando(false);
      setTimeout(() => setNotification(null), 3000);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 py-8 px-4">
        <div className="max-w-7xl mx-auto">

          {/* Header */}
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Informe de Auditoría Médica</h1>
                <p className="text-gray-600">{resultado.nombreArchivo}</p>
              </div>
              <StatusBadge status={estadoGeneral} />
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleDescargarPDF}
                disabled={generandoPDF}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50"
              >
                {generandoPDF ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
                {generandoPDF ? 'Generando...' : 'Descargar PDF'}
              </button>
            </div>
          </div>

          {/* Métricas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <MetricCard
              label="Días de Hospitalización"
              value={resultado.diasHospitalizacion}
              icon={Calendar}
              color="blue"
            />
            <MetricCard
              label="Total de Errores"
              value={totalErrores}
              icon={AlertCircle}
              color={totalErrores === 0 ? 'green' : totalErrores > 5 ? 'red' : 'orange'}
            />
            <MetricCard
              label="Comunicaciones"
              value={resultado.comunicaciones?.length || 0}
              icon={Send}
              color="purple"
            />
            <MetricCard
              label="Interconsultas"
              value={resultado.interconsultas?.length || 0}
              icon={Stethoscope}
              color="blue"
            />
          </div>

          {/* Datos del Paciente */}
          <CollapsibleSection title="Datos del Paciente" icon={User}>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Nombre Completo</p>
                <p className="font-semibold text-gray-900">{resultado.datosPaciente.nombre || 'No especificado'}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">DNI</p>
                <p className="font-semibold text-gray-900">{resultado.datosPaciente.dni || 'No especificado'}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Obra Social</p>
                <p className="font-semibold text-gray-900">{resultado.datosPaciente.obra_social || 'No especificado'}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Habitación</p>
                <p className="font-semibold text-gray-900">{resultado.datosPaciente.habitacion || 'No especificado'}</p>
              </div>
            </div>
          </CollapsibleSection>

          {/* Terapia */}
          {resultado.resultadoTerapia?.esTerapia && (
            <CollapsibleSection
              title="Clasificación de Terapia"
              icon={Activity}
              badge={`${resultado.resultadoTerapia.diasTerapiaIntensiva + resultado.resultadoTerapia.diasTerapiaIntermedia} días`}
              badgeColor="bg-red-500"
            >
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <MetricCard label="Terapia Intensiva" value={resultado.resultadoTerapia.diasTerapiaIntensiva} icon={Activity} color="red" subtitle="días" />
                <MetricCard label="Terapia Intermedia" value={resultado.resultadoTerapia.diasTerapiaIntermedia} icon={Activity} color="orange" subtitle="días" />
                <MetricCard label="Internación General" value={resultado.resultadoTerapia.diasInternacionGeneral} icon={Activity} color="blue" subtitle="días" />
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold text-gray-800 mb-3">Clasificación Diaria</h3>
                {resultado.resultadoTerapia.clasificacionPorDia?.map((dia: any, idx: number) => (
                  <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className={`w-3 h-3 rounded-full ${dia.clasificacion === 'terapia_intensiva' ? 'bg-red-500' :
                        dia.clasificacion === 'terapia_intermedia' ? 'bg-orange-500' : 'bg-blue-500'
                      }`} />
                    <span className="font-semibold text-gray-700 w-28">{dia.fecha}</span>
                    <span className="flex-1 text-sm text-gray-600">{dia.justificacion}</span>
                  </div>
                ))}
              </div>
            </CollapsibleSection>
          )}

          {/* Interconsultas */}
          {resultado.interconsultas && resultado.interconsultas.length > 0 && (
            <CollapsibleSection title="Interconsultas" icon={Stethoscope} badge={resultado.interconsultas.length} badgeColor="bg-blue-500">
              <div className="space-y-3">
                {resultado.interconsultas.map((inter: any, idx: number) => (
                  <div key={idx} className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <span className="font-bold text-blue-900 text-lg">{inter.especialidad}</span>
                        <p className="text-sm text-blue-700">{inter.fecha} {inter.hora && `- ${inter.hora}`}</p>
                      </div>
                    </div>
                    <div className="space-y-1 text-sm">
                      <p><span className="font-semibold">Consultor:</span> {inter.consultor.nombre}</p>
                      <p><span className="font-semibold">Motivo:</span> {inter.motivo}</p>
                      {inter.diagnostico && <p><span className="font-semibold">Diagnóstico:</span> {inter.diagnostico}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </CollapsibleSection>
          )}

          {/* Prácticas Excluidas */}
          {resultado.practicasExcluidas && resultado.practicasExcluidas.length > 0 && (
            <CollapsibleSection title="Prácticas Excluidas" icon={Syringe} badge={resultado.practicasExcluidas.length} badgeColor="bg-yellow-500">
              <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4 mb-4">
                <p className="text-yellow-800 font-semibold flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Requieren autorización previa y/o facturación separada
                </p>
              </div>
              <div className="grid md:grid-cols-2 gap-3">
                {resultado.practicasExcluidas.map((practica: any, idx: number) => (
                  <div key={idx} className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <p className="font-bold text-yellow-900 mb-1">{practica.tipo}</p>
                    <p className="text-sm text-yellow-800 mb-2">{practica.advertencia}</p>
                    <div className="flex flex-wrap gap-2">
                      {practica.requiere_autorizacion && (
                        <span className="text-xs px-2 py-1 bg-red-200 text-red-800 rounded font-semibold">Requiere Autorización</span>
                      )}
                      {practica.facturacion_aparte && (
                        <span className="text-xs px-2 py-1 bg-blue-200 text-blue-800 rounded">Facturación Aparte</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CollapsibleSection>
          )}

          {/* Endoscopías */}
          {resultado.endoscopias && resultado.endoscopias.length > 0 && (
            <CollapsibleSection title="Endoscopías" icon={FileText} badge={resultado.endoscopias.length} badgeColor="bg-purple-500">
              <div className="space-y-4">
                {resultado.endoscopias.map((endo: any, idx: number) => (
                  <div key={idx} className="p-4 bg-purple-50 rounded-lg border-2 border-purple-200">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <span className="font-bold text-purple-900 text-lg">{endo.procedimiento}</span>
                        <p className="text-sm text-purple-700">{endo.fecha} {endo.hora_inicio && `- ${endo.hora_inicio}`}</p>
                      </div>
                      {endo.biopsias && (
                        <span className="px-3 py-1 bg-purple-200 text-purple-800 rounded-full text-sm font-semibold">Con biopsias</span>
                      )}
                    </div>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-semibold">Endoscopista:</span> {endo.endoscopista.nombre}</p>
                      {endo.hallazgos && (
                        <div>
                          <span className="font-semibold">Hallazgos:</span>
                          <p className="mt-1 p-2 bg-white rounded">{endo.hallazgos}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CollapsibleSection>
          )}

          {/* Errores y Comunicaciones */}
          {totalErrores > 0 && (
            <CollapsibleSection title="Errores y Comunicaciones" icon={AlertCircle} badge={totalErrores} badgeColor="bg-red-500" defaultOpen={true}>
              {resultado.comunicaciones?.map((com: any, idx: number) => (
                <div key={idx} className="mb-4 p-4 bg-red-50 rounded-lg border-l-4 border-red-500">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <span className="font-bold text-red-900">{com.sector}</span>
                      <p className="text-sm text-red-700">{com.responsable}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${com.urgencia === 'ALTA' ? 'bg-red-200 text-red-800' :
                        com.urgencia === 'MEDIA' ? 'bg-orange-200 text-orange-800' : 'bg-yellow-200 text-yellow-800'
                      }`}>
                      {com.urgencia}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">{com.motivo}</p>
                  <div className="bg-white p-3 rounded text-sm mb-3">{com.mensaje}</div>
                  <button
                    onClick={() => abrirModalEnvio(idx)}
                    disabled={enviando}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                    Enviar por WhatsApp
                  </button>
                </div>
              ))}
            </CollapsibleSection>
          )}

          {/* Footer */}
          <div className="mt-8 text-center text-gray-500 text-sm">
            <p>Sistema desarrollado por <strong className="text-blue-600">Grow Labs</strong> - Sanatorio Argentino, San Juan</p>
          </div>
        </div>

        {/* Notificaciones */}
        {notification && (
          <div className="fixed bottom-6 right-6 z-50 animate-slide-in">
            <div className={`px-6 py-4 rounded-lg shadow-2xl flex items-center gap-3 ${notification.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
              }`}>
              {notification.type === 'success' ? <CheckCircle2 className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}
              <p className="font-semibold">{notification.message}</p>
            </div>
          </div>
        )}
      </div>

      {/* Modal de Confirmación */}
      {comunicacionSeleccionada !== null && (
        <ConfirmacionEnvioModal
          isOpen={modalConfirmacionAbierto}
          onClose={() => setModalConfirmacionAbierto(false)}
          onConfirm={handleConfirmarEnvio}
          comunicacion={resultado.comunicaciones[comunicacionSeleccionada]}
          datosPaciente={resultado.datosPaciente}
          nombreArchivo={resultado.nombreArchivo}
          isLoading={enviando}
          numeroDestino={numeroDestino}
          onNumeroDestinoChange={setNumeroDestino}
        />
      )}
    </>
  );
}
