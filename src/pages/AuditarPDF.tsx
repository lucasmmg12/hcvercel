import { useState } from 'react';
import { Upload, FileCheck, Loader2 } from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';
import { InformeAuditoria } from '../components/InformeAuditoria';
import { supabaseUrl, supabaseAnonKey } from '../lib/supabase';

pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

interface ResultadoAuditoria {
  nombreArchivo: string;
  datosPaciente: {
    nombre?: string;
    dni?: string;
    fecha_nacimiento?: string;
    sexo?: string;
    obra_social?: string;
    errores_admision: string[];
  };
  fechaIngreso: string;
  fechaAlta: string;
  pacienteInternado: boolean;
  diasHospitalizacion: number;
  erroresAdmision: string[];
  erroresEvolucion: string[];
  evolucionesRepetidas: Array<{ fecha: string; texto: string }>;
  advertencias: Array<{ tipo: string; descripcion: string; fecha?: string }>;
  erroresAltaMedica: string[];
  erroresEpicrisis: string[];
  erroresFoja: string[];
  resultadosFoja: {
    bisturi_armonico: string | null;
    equipo_quirurgico: Array<{ rol: string; nombre: string }>;
    fecha_cirugia: string | null;
    hora_inicio: string | null;
    hora_fin: string | null;
    errores: string[];
  };
  doctores: {
    residentes: Array<{ nombre: string; matricula?: string }>;
    cirujanos: Array<{ nombre: string; matricula?: string }>;
    otros: Array<{ nombre: string; matricula?: string }>;
  };
  comunicaciones: Array<{
    sector: string;
    responsable: string;
    motivo: string;
    urgencia: string;
    errores: string[];
    mensaje: string;
    matricula?: string;
  }>;
  totalErrores: number;
  estado: string;
  listaDiasInternacion?: Array<{
    fecha: string;
    tieneEvolucion: boolean;
    tieneFojaQuirurgica: boolean;
    estudios: Array<{ tipo: string; categoria: string }>;
  }>;
  // ===== NUEVO: Terapia Intensiva/Intermedia =====
  diasTerapiaIntensiva?: number;
  diasTerapiaIntermedia?: number;
  diasInternacionGeneral?: number;
  resultadoTerapia?: {
    esTerapia: boolean;
    diasTerapiaIntensiva: number;
    diasTerapiaIntermedia: number;
    diasInternacionGeneral: number;
    clasificacionPorDia: Array<{
      fecha: string;
      clasificacion: 'terapia_intensiva' | 'terapia_intermedia' | 'internacion_general' | 'no_corresponde_terapia';
      criteriosMayores: Array<{ tipo: string; nombre: string; presente: boolean; evidencia?: string }>;
      criteriosMenores: Array<{ tipo: string; nombre: string; presente: boolean; evidencia?: string }>;
      justificacion: string;
      errores: string[];
      advertencias: string[];
    }>;
    erroresGenerales: string[];
  };
  // ===== NUEVO: Interconsultas =====
  interconsultas?: Array<{
    fecha: string;
    hora?: string;
    especialidad: string;
    consultor: { nombre: string; matricula?: string };
    motivo: string;
    diagnostico?: string;
    practicas_realizadas: string[];
    indicaciones: string[];
    errores: string[];
  }>;
  // ===== NUEVO: Prácticas Excluidas =====
  practicasExcluidas?: Array<{
    tipo: string;
    categoria: 'puncion' | 'cateter' | 'procedimiento_especial';
    fecha?: string;
    ubicacion_documento: 'evolucion' | 'foja_ambulatoria' | 'interconsulta';
    requiere_autorizacion: boolean;
    facturacion_aparte: boolean;
    codigo_nomenclador?: string;
    advertencia: string;
  }>;
  // ===== NUEVO: Endoscopías =====
  endoscopias?: Array<{
    tipo: 'endoscopia';
    procedimiento: string;
    fecha: string;
    hora_inicio?: string;
    hora_fin?: string;
    endoscopista: { nombre: string; matricula?: string };
    hallazgos?: string;
    biopsias: boolean;
    errores: string[];
  }>;
  // ===== NUEVO: Prácticas Ambulatorias =====
  practicasAmbulatorias?: Array<{
    tipo: string;
    fecha: string;
    hora?: string;
    ubicacion: 'durante_internacion';
    requiere_autorizacion: boolean;
    errores: string[];
  }>;
}

// Función para abreviar nombres de estudios
function abreviarEstudio(nombreCompleto: string): string {
  const abreviaturas: Record<string, string> = {
    // Imágenes
    'TAC': 'TAC',
    'Tomografía': 'TAC',
    'Resonancia Magnética': 'RM',
    'Resonancia': 'RM',
    'Radiografía': 'RX',
    'Ecografía': 'ECO',
    'Doppler': 'Doppler',
    'Angio': 'Angio',

    // Laboratorio
    'Hemograma': 'Hemograma',
    'PCR': 'PCR',
    'VSG': 'VSG',
    'Glucemia': 'Glucemia',
    'Creatinina': 'Creatinina',
    'Urea': 'Urea',
    'Ionograma': 'Ionograma',
    'Perfil hepático': 'P. Hepático',
    'Orina completa': 'Orina',

    // Procedimientos
    'Electrocardiograma': 'ECG',
    'Ecocardiograma': 'Ecocardio',
    'Endoscopía alta': 'VEDA',
    'Endoscopía': 'Endoscopía',
    'Colonoscopía': 'Colonoscopía',
    'Broncoscopía': 'Broncoscopía',
    'Procedimiento': 'Proc.',
    'Kinesiología': 'Kine',
    'Paracentesis': 'Paracentesis',
    'Toracocentesis': 'Toracocentesis',
    'Punción lumbar': 'P. Lumbar'
  };

  // Buscar coincidencia exacta primero
  for (const [clave, abrev] of Object.entries(abreviaturas)) {
    if (nombreCompleto.includes(clave)) {
      // Si tiene "de" (ej: "TAC de tórax"), mantener la parte específica
      const partes = nombreCompleto.split(' de ');
      if (partes.length > 1) {
        return `${abrev} ${partes[1]}`;
      }
      return abrev;
    }
  }

  // Si no hay coincidencia, devolver el nombre original truncado si es muy largo
  return nombreCompleto.length > 20 ? nombreCompleto.substring(0, 17) + '...' : nombreCompleto;
}

export function AuditarPDF() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultado, setResultado] = useState<ResultadoAuditoria | null>(null);
  const [auditoriaId, setAuditoriaId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const extractTextFromPDF = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = '';

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ');
      fullText += pageText + '\n';
    }

    return fullText;
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setError('Por favor seleccione un archivo PDF válido');
      return;
    }

    setIsProcessing(true);
    setError(null);
    setResultado(null);

    try {
      console.log('📄 Extrayendo texto del PDF...');
      const pdfText = await extractTextFromPDF(file);
      console.log('✅ Texto extraído, longitud:', pdfText.length);

      if (!pdfText || pdfText.length < 100) {
        throw new Error('El PDF parece estar vacío o no contiene texto extraíble');
      }

      const formData = new FormData();
      formData.append('pdfText', pdfText);
      formData.append('nombreArchivo', file.name);

      const edgeFunctionUrl = `${supabaseUrl}/functions/v1/auditar-pdf`;
      console.log('🚀 Enviando a Edge Function:', edgeFunctionUrl);
      console.log('🔑 URL de Supabase:', supabaseUrl);
      console.log('🔑 Tiene Anon Key:', supabaseAnonKey ? 'Sí' : 'No');

      const response = await fetch(edgeFunctionUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${supabaseAnonKey}`,
        },
        body: formData,
      });

      console.log('📡 Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`Error al procesar el PDF: ${errorText}`);
      }

      const data = await response.json();
      console.log('Resultado recibido:', data);

      if (!data.success || !data.resultado) {
        throw new Error(data.error || 'Error desconocido al procesar el PDF');
      }

      // Dejamos las fechas en ISO con offset que envía el backend
      // para que los componentes las formateen (evitamos 'Invalid Date' por DD/MM)
      setResultado(data.resultado);
      setAuditoriaId(data.auditoriaId || null);
    } catch (err) {
      console.error('❌ Error completo:', err);

      // Diagnosticar tipo de error
      if (err instanceof TypeError && err.message.includes('fetch')) {
        console.error('🔍 Diagnóstico: Error de red o CORS');
        console.error('   Posibles causas:');
        console.error('   1. La URL de Supabase es incorrecta');
        console.error('   2. La Edge Function no está desplegada');
        console.error('   3. Problema de CORS en Supabase');
        console.error('   4. No hay conexión a internet');
        setError('Error de conexión. Verifica que la URL de Supabase sea correcta y que la Edge Function esté desplegada.');
      } else {
        setError(err instanceof Error ? err.message : 'Error al procesar el archivo. Por favor intente nuevamente.');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-white mb-4 drop-shadow-sm">Auditar Historia Clínica</h1>
        <p className="text-lg text-white font-medium">
          Suba la historia clínica en PDF para generar el informe automático
        </p>
      </div>

      {!resultado && (
        <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-xl p-8 border-2 border-dashed border-gray-300 hover:border-green-500 transition-colors">
          <div className="text-center">
            <div className="mb-6 flex justify-center">
              {isProcessing ? (
                <Loader2 className="w-16 h-16 text-blue-600 animate-spin" />
              ) : (
                <Upload className="w-16 h-16 text-gray-400" />
              )}
            </div>

            {isProcessing ? (
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Procesando archivo...
                </h3>
                <p className="text-gray-600">
                  Esto puede tardar unos momentos. Por favor espere.
                </p>
              </div>
            ) : (
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Seleccione un archivo PDF
                </h3>
                <p className="text-gray-600 mb-6">
                  Formatos aceptados: PDF únicamente
                </p>

                <label
                  htmlFor="pdf-upload"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-all shadow-lg hover:shadow-xl cursor-pointer"
                >
                  <FileCheck className="w-5 h-5" />
                  Seleccionar PDF
                </label>
                <input
                  id="pdf-upload"
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>
            )}

            {error && (
              <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 font-medium">{error}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {resultado && (
        <div className="space-y-6">
          <div className="flex justify-center">
            <button
              onClick={() => {
                setResultado(null);
                setAuditoriaId(null);
                setError(null);
              }}
              className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-all shadow-lg hover:shadow-xl"
            >
              Auditar otro archivo
            </button>
          </div>

          {/* Tabla de días de internación */}
          {resultado.listaDiasInternacion && resultado.listaDiasInternacion.length > 0 && (
            <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-xl p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Días de Internación</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Día
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Evolución Médica
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Foja Quirúrgica
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Otros Estudios
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {resultado.listaDiasInternacion.map((dia, idx) => {
                      const esDiaAdmision = idx === 0;
                      const esDiaAlta = idx === resultado.listaDiasInternacion!.length - 1;
                      return (
                        <tr key={dia.fecha} className={!dia.tieneEvolucion && !esDiaAdmision && !esDiaAlta ? 'bg-red-50' : ''}>
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                            {dia.fecha}
                            {esDiaAdmision && <span className="ml-2 text-xs text-gray-500">(Admisión)</span>}
                            {esDiaAlta && <span className="ml-2 text-xs text-gray-500">(Alta)</span>}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">
                            {esDiaAdmision ? (
                              <span className="text-gray-500">Admisión</span>
                            ) : esDiaAlta ? (
                              <span className="text-gray-500">Alta</span>
                            ) : dia.tieneEvolucion ? (
                              <span className="text-green-600 font-semibold">✓ Sí</span>
                            ) : (
                              <span className="text-red-600 font-semibold">✗ No (ERROR)</span>
                            )}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">
                            {dia.tieneFojaQuirurgica ? (
                              <span className="text-green-600 font-semibold">✓ Sí</span>
                            ) : (
                              <span className="text-gray-400">No</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {dia.estudios.length > 0 ? (
                              <div className="flex flex-wrap gap-1">
                                {dia.estudios.map((estudio, eIdx) => (
                                  <span
                                    key={eIdx}
                                    className="inline-block px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs"
                                    title={estudio.tipo} // Tooltip con nombre completo
                                  >
                                    {abreviarEstudio(estudio.tipo)}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <InformeAuditoria resultado={resultado} auditoriaId={auditoriaId || undefined} />
        </div>
      )}
    </div>
  );
}
