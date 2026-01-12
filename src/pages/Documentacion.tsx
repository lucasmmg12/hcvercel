import {
  FileText, Workflow, AlertTriangle, MessageSquare,
  Activity, Stethoscope, Syringe, Smartphone, Calendar, Search
} from 'lucide-react';

export function Documentacion() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-white drop-shadow-sm">Sistema de Auditoría Médica</h1>
        <p className="text-xl text-green-700 font-semibold">Sanatorio Argentino - San Juan</p>
        <p className="text-lg text-white max-w-3xl mx-auto font-medium">
          Automatización inteligente mediante algoritmos avanzados para la detección de errores y clasificación clínica.
        </p>
      </div>

      <section className="bg-white/95 backdrop-blur-sm rounded-xl shadow-xl p-8 border-l-4 border-green-600">
        <div className="flex items-start gap-4">
          <FileText className="w-8 h-8 text-blue-600 flex-shrink-0 mt-1" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Descripción General Actualizada</h2>
            <p className="text-gray-800 leading-relaxed">
              El sistema ha evolucionado de un simple auditor de completitud a una herramienta diagnóstica integral.
              No solo verifica la presencia de documentos, sino que ahora implementa un potente <strong>motor de análisis semántico desarrollado a medida</strong>.
              Esto permite interpretar la narrativa médica mediante lógica computacional avanzada para clasificar internaciones,
              detectar prácticas complejas y asegurar la trazabilidad clínica con máxima precisión.
            </p>
          </div>
        </div>
      </section>

      {/* NUEVO: Módulos Especializados */}
      <section className="bg-white/95 backdrop-blur-sm rounded-xl shadow-xl p-8 border-l-4 border-purple-600">
        <div className="flex items-start gap-4">
          <Activity className="w-8 h-8 text-purple-600 flex-shrink-0 mt-1" />
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Nuevos Módulos de Análisis Clínico</h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-purple-50 p-5 rounded-xl border border-purple-100">
                <div className="flex items-center gap-2 mb-3">
                  <Activity className="w-5 h-5 text-purple-600" />
                  <h3 className="text-lg font-bold text-gray-900">Clasificación de Terapia</h3>
                </div>
                <p className="text-gray-700 text-sm mb-3">
                  El sistema analiza el texto diario buscando "Criterios Mayores" (ej: asistencia respiratoria mecánica - ARM)
                  y "Criterios Menores" (ej: monitoreo cardíaco, drogas vasoactivas).
                </p>
                <ul className="text-sm text-gray-600 space-y-1 ml-2">
                  <li className="flex items-center gap-2">🔹 Distingue <strong>Terapia Intensiva</strong> vs <strong>Intermedia</strong>.</li>
                  <li className="flex items-center gap-2">🔹 Justifica el nivel de complejidad por día.</li>
                  <li className="flex items-center gap-2">🔹 Alerta si un paciente en Terapia no cumple criterios.</li>
                </ul>
              </div>

              <div className="bg-blue-50 p-5 rounded-xl border border-blue-100">
                <div className="flex items-center gap-2 mb-3">
                  <Stethoscope className="w-5 h-5 text-blue-600" />
                  <h3 className="text-lg font-bold text-gray-900">Interconsultas y Especialistas</h3>
                </div>
                <p className="text-gray-700 text-sm mb-3">
                  Rastrea automáticamente solicitudes de valoración por especialistas en las evoluciones.
                </p>
                <ul className="text-sm text-gray-600 space-y-1 ml-2">
                  <li className="flex items-center gap-2">🔹 Identifica la <strong>especialidad</strong> solicitada.</li>
                  <li className="flex items-center gap-2">🔹 Captura el nombre del médico consultor.</li>
                  <li className="flex items-center gap-2">🔹 Extrae el diagnóstico o motivo de la consulta.</li>
                </ul>
              </div>

              <div className="bg-yellow-50 p-5 rounded-xl border border-yellow-100">
                <div className="flex items-center gap-2 mb-3">
                  <Syringe className="w-5 h-5 text-yellow-600" />
                  <h3 className="text-lg font-bold text-gray-900">Prácticas Excluidas / Complejas</h3>
                </div>
                <p className="text-gray-700 text-sm mb-3">
                  Detecta procedimientos que suelen requerir autorización previa o se facturan por fuera del módulo diario.
                </p>
                <ul className="text-sm text-gray-600 space-y-1 ml-2">
                  <li className="flex items-center gap-2">⚠️ Punciones (Lumbar, Pleural, Paracentesis).</li>
                  <li className="flex items-center gap-2">⚠️ Colocación de vías centrales y catéteres.</li>
                  <li className="flex items-center gap-2">⚠️ Genera alertas de <strong>"Requiere Autorización"</strong>.</li>
                </ul>
              </div>

              <div className="bg-pink-50 p-5 rounded-xl border border-pink-100">
                <div className="flex items-center gap-2 mb-3">
                  <Search className="w-5 h-5 text-pink-600" />
                  <h3 className="text-lg font-bold text-gray-900">Módulo Endoscopías</h3>
                </div>
                <p className="text-gray-700 text-sm mb-3">
                  Seguimiento específico de procedimientos endoscópicos (VEDA, Venc, Colonoscopía).
                </p>
                <ul className="text-sm text-gray-600 space-y-1 ml-2">
                  <li className="flex items-center gap-2">🔹 Detecta fecha, hora y operador.</li>
                  <li className="flex items-center gap-2">🔹 Verifica si se realizaron <strong>biopsias</strong>.</li>
                  <li className="flex items-center gap-2">🔹 Resume los hallazgos principales.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* NUEVO: Herramientas de Gestión */}
      <section className="bg-white/95 backdrop-blur-sm rounded-xl shadow-xl p-8 border-l-4 border-indigo-600">
        <div className="flex items-start gap-4">
          <Calendar className="w-8 h-8 text-indigo-600 flex-shrink-0 mt-1" />
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Herramientas de Gestión y Trazabilidad</h2>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-indigo-100 p-3 rounded-lg">
                  <Calendar className="w-6 h-6 text-indigo-700" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Trazabilidad Día x Día</h3>
                  <p className="text-gray-700 mt-1">
                    El sistema genera una tabla interactiva que muestra cada día de internación. Para cada fecha,
                    verifica visualmente (con ✅ o ❌) si existe:
                  </p>
                  <ul className="mt-2 text-sm text-gray-600 grid grid-cols-2 gap-2">
                    <li>• Evolución Médica diaria</li>
                    <li>• Foja Quirúrgica (si aplica)</li>
                    <li>• Estudios complementarios realizados ese día</li>
                    <li>• Clasificación de complejidad (Piso/Terapia)</li>
                  </ul>
                </div>
              </div>

              <div className="flex items-start gap-4 border-t border-gray-100 pt-6">
                <div className="bg-green-100 p-3 rounded-lg">
                  <Smartphone className="w-6 h-6 text-green-700" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Gestión de Reclamos vía WhatsApp</h3>
                  <p className="text-gray-700 mt-1">
                    Integración directa para la resolución de conflictos. Al detectar un error (ej: falta evolución),
                    el sistema redacta automáticamente un mensaje formal citando al responsable.
                  </p>
                  <p className="text-sm text-green-700 mt-2 font-medium">
                    Funcionalidad: Click en "Enviar por WhatsApp" → Abre chat con el médico → Envía reclamo pre-redactado.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white/95 backdrop-blur-sm rounded-xl shadow-xl p-8 border-l-4 border-green-700">
        <div className="flex items-start gap-4">
          <Workflow className="w-8 h-8 text-green-700 flex-shrink-0 mt-1" />
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Flujo de Trabajo Completado</h2>

            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 bg-green-50 rounded-lg">
                <div className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">1</div>
                <div>
                  <h4 className="font-semibold text-gray-900">Carga del PDF</h4>
                  <p className="text-gray-600">Subida y extracción de texto mediante OCR/Lectura directa.</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-green-50 rounded-lg">
                <div className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">2</div>
                <div>
                  <h4 className="font-semibold text-gray-900">Procesamiento Lógico Avanzado</h4>
                  <p className="text-gray-600">
                    El sistema ejecuta algoritmos de análisis textual estructurado para extraer indicadores clínicos.
                    Evalúa condiciones complejas (estabilidad, ARM, inotrópicos) mediante reglas de negocio predefinidas.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-green-50 rounded-lg">
                <div className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">3</div>
                <div>
                  <h4 className="font-semibold text-gray-900">Auditoría de Procesos</h4>
                  <p className="text-gray-600">
                    Se cruzan datos: ¿Hay cirugía? → Debe haber foja. ¿Hay catéter? → Requiere autorización.
                    ¿Está en Terapia? → Debe haber justificación clínica.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-green-50 rounded-lg">
                <div className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">4</div>
                <div>
                  <h4 className="font-semibold text-gray-900">Reporte y Acción</h4>
                  <p className="text-gray-600">
                    Presentación de resultados en Tablero de Control. Envío inmediato de correcciones solicitadas vía WhatsApp a los médicos.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white/95 backdrop-blur-sm rounded-xl shadow-xl p-8 border-l-4 border-red-600">
        <div className="flex items-start gap-4">
          <AlertTriangle className="w-8 h-8 text-red-600 flex-shrink-0 mt-1" />
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Tipos de Errores Detectados</h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="font-semibold text-red-600 text-lg">Administrativos y Admisión</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2"><span className="text-red-600">•</span> Falta de datos filiatorios (DNI, Edad, OS).</li>
                  <li className="flex items-start gap-2"><span className="text-red-600">•</span> Ausencia de Epicrisis o Alta médica.</li>
                  <li className="flex items-start gap-2"><span className="text-red-600">•</span> Internaciones sin cierre administrativo.</li>
                </ul>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-red-600 text-lg">Clínicos y Evolutivos</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2"><span className="text-red-600">•</span> Días sin evolución médica (Salto de días).</li>
                  <li className="flex items-start gap-2"><span className="text-red-600">•</span> Evoluciones "Copy-Paste" (texto repetido).</li>
                  <li className="flex items-start gap-2"><span className="text-red-600">•</span> Falta de sello/matrícula del profesional.</li>
                </ul>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-red-600 text-lg">Quirúrgicos</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2"><span className="text-red-600">•</span> Cirugía sin Foja Quirúrgica asociada.</li>
                  <li className="flex items-start gap-2"><span className="text-red-600">•</span> Falta de horarios de inicio/fin en foja.</li>
                  <li className="flex items-start gap-2"><span className="text-red-600">•</span> Uso de instrumental costoso (bisturí armónico) no justificado.</li>
                </ul>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-red-600 text-lg">Facturación y Auditoría</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2"><span className="text-red-600">•</span> Práctica excluida realizada sin autorización.</li>
                  <li className="flex items-start gap-2"><span className="text-red-600">•</span> Incongruencia en días de Terapia (Facturado vs Real).</li>
                  <li className="flex items-start gap-2"><span className="text-red-600">•</span> Biopsias realizadas sin informe de anatomía patológica.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white/95 backdrop-blur-sm rounded-xl shadow-xl p-8 border-l-4 border-orange-600">
        <div className="flex items-start gap-4">
          <MessageSquare className="w-8 h-8 text-orange-600 flex-shrink-0 mt-1" />
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Matriz de Comunicaciones</h2>
            <p className="text-gray-700 mb-6">
              El sistema decide automáticamente a quién notificar basándose en el tipo de error y el sector responsable.
            </p>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-4 bg-orange-50 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Admisión</h3>
                <p className="text-gray-600 text-sm">Errores en DNI, falta de carnet, datos filiatorios.</p>
              </div>
              <div className="p-4 bg-orange-50 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Cuerpo Médico</h3>
                <p className="text-gray-600 text-sm">Falta de firmas, evoluciones, epicrisis, fojas.</p>
              </div>
              <div className="p-4 bg-orange-50 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Auditoría Interna</h3>
                <p className="text-gray-600 text-sm">Discrepancias en Terapia, materiales costosos, prótesis.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
