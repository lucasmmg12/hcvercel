import { AlertCircle, CheckCircle, AlertTriangle, Activity, Stethoscope, Syringe, FileText } from 'lucide-react';

// ===== Componente: Clasificación de Terapia =====
export function TerapiaClassificationSection({ resultadoTerapia }: { resultadoTerapia: any }) {
    if (!resultadoTerapia || !resultadoTerapia.esTerapia) return null;

    const getClasificacionColor = (clasificacion: string) => {
        switch (clasificacion) {
            case 'terapia_intensiva':
                return 'bg-red-100 text-red-800 border-red-300';
            case 'terapia_intermedia':
                return 'bg-orange-100 text-orange-800 border-orange-300';
            case 'internacion_general':
                return 'bg-blue-100 text-blue-800 border-blue-300';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-300';
        }
    };

    const getClasificacionLabel = (clasificacion: string) => {
        switch (clasificacion) {
            case 'terapia_intensiva':
                return 'Terapia Intensiva';
            case 'terapia_intermedia':
                return 'Terapia Intermedia';
            case 'internacion_general':
                return 'Internación General';
            default:
                return 'No corresponde terapia';
        }
    };

    return (
        <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-xl p-8 mb-6">
            <div className="flex items-center gap-3 mb-6">
                <Activity className="w-8 h-8 text-red-600" />
                <h2 className="text-2xl font-bold text-gray-900">Clasificación de Terapia Polivalente</h2>
            </div>

            {/* Resumen */}
            <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div className="p-4 bg-red-50 rounded-lg border-2 border-red-200">
                    <p className="text-sm text-red-600 mb-1">Días Terapia Intensiva</p>
                    <p className="text-3xl font-bold text-red-700">{resultadoTerapia.diasTerapiaIntensiva}</p>
                </div>
                <div className="p-4 bg-orange-50 rounded-lg border-2 border-orange-200">
                    <p className="text-sm text-orange-600 mb-1">Días Terapia Intermedia</p>
                    <p className="text-3xl font-bold text-orange-700">{resultadoTerapia.diasTerapiaIntermedia}</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
                    <p className="text-sm text-blue-600 mb-1">Días Internación General</p>
                    <p className="text-3xl font-bold text-blue-700">{resultadoTerapia.diasInternacionGeneral}</p>
                </div>
            </div>

            {/* Clasificación por día */}
            <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Clasificación Diaria</h3>
                {resultadoTerapia.clasificacionPorDia.map((dia: any, idx: number) => (
                    <div key={idx} className={`p-4 rounded-lg border-2 ${getClasificacionColor(dia.clasificacion)}`}>
                        <div className="flex items-center justify-between mb-2">
                            <span className="font-bold">{dia.fecha}</span>
                            <span className="px-3 py-1 rounded-full text-sm font-semibold">
                                {getClasificacionLabel(dia.clasificacion)}
                            </span>
                        </div>
                        <p className="text-sm mb-2">{dia.justificacion}</p>

                        {/* Criterios presentes */}
                        {dia.criteriosMayores.some((c: any) => c.presente) && (
                            <div className="mt-2">
                                <p className="text-xs font-semibold mb-1">Criterios Mayores:</p>
                                <div className="flex flex-wrap gap-1">
                                    {dia.criteriosMayores.filter((c: any) => c.presente).map((c: any, i: number) => (
                                        <span key={i} className="text-xs px-2 py-1 bg-white/50 rounded">
                                            {c.nombre}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {dia.criteriosMenores.some((c: any) => c.presente) && (
                            <div className="mt-2">
                                <p className="text-xs font-semibold mb-1">Criterios Menores:</p>
                                <div className="flex flex-wrap gap-1">
                                    {dia.criteriosMenores.filter((c: any) => c.presente).map((c: any, i: number) => (
                                        <span key={i} className="text-xs px-2 py-1 bg-white/50 rounded">
                                            {c.nombre}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

// ===== Componente: Interconsultas =====
export function InterconsultasSection({ interconsultas }: { interconsultas: any[] }) {
    if (!interconsultas || interconsultas.length === 0) return null;

    return (
        <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-xl p-8 mb-6">
            <div className="flex items-center gap-3 mb-6">
                <Stethoscope className="w-8 h-8 text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-900">Interconsultas Detectadas</h2>
            </div>

            <div className="space-y-4">
                {interconsultas.map((inter, idx) => (
                    <div key={idx} className="p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
                        <div className="flex items-start justify-between mb-2">
                            <div>
                                <span className="font-bold text-blue-900">{inter.especialidad}</span>
                                <p className="text-sm text-blue-700">
                                    {inter.fecha} {inter.hora && `- ${inter.hora}`}
                                </p>
                            </div>
                            {inter.errores.length > 0 && (
                                <AlertCircle className="w-5 h-5 text-red-500" />
                            )}
                        </div>

                        <div className="space-y-2 text-sm">
                            <div>
                                <span className="font-semibold">Consultor:</span> {inter.consultor.nombre}
                                {inter.consultor.matricula && ` (MP: ${inter.consultor.matricula})`}
                            </div>

                            <div>
                                <span className="font-semibold">Motivo:</span> {inter.motivo}
                            </div>

                            {inter.diagnostico && (
                                <div>
                                    <span className="font-semibold">Diagnóstico:</span> {inter.diagnostico}
                                </div>
                            )}

                            {inter.errores.length > 0 && (
                                <div className="mt-2 p-2 bg-red-100 rounded">
                                    {inter.errores.map((error, i) => (
                                        <p key={i} className="text-red-700 text-xs">⚠️ {error}</p>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ===== Componente: Prácticas Excluidas =====
export function PracticasExcluidasSection({ practicas }: { practicas: any[] }) {
    if (!practicas || practicas.length === 0) return null;

    const getCategoriaIcon = (categoria: string) => {
        switch (categoria) {
            case 'puncion':
                return '💉';
            case 'cateter':
                return '🔌';
            default:
                return '⚕️';
        }
    };

    return (
        <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-xl p-8 mb-6">
            <div className="flex items-center gap-3 mb-6">
                <Syringe className="w-8 h-8 text-yellow-600" />
                <h2 className="text-2xl font-bold text-gray-900">Prácticas Excluidas de Cobertura</h2>
            </div>

            <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4 mb-4">
                <p className="text-yellow-800 font-semibold">
                    ⚠️ Estas prácticas requieren autorización previa y/o se facturan por separado del módulo
                </p>
            </div>

            <div className="space-y-3">
                {practicas.map((practica, idx) => (
                    <div key={idx} className="p-4 bg-yellow-50 rounded-lg border-2 border-yellow-200">
                        <div className="flex items-start gap-3">
                            <span className="text-2xl">{getCategoriaIcon(practica.categoria)}</span>
                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-bold text-yellow-900">{practica.tipo}</span>
                                    {practica.fecha && (
                                        <span className="text-sm text-yellow-700">{practica.fecha}</span>
                                    )}
                                </div>

                                <p className="text-sm text-yellow-800 mb-2">{practica.advertencia}</p>

                                <div className="flex flex-wrap gap-2 text-xs">
                                    <span className="px-2 py-1 bg-yellow-200 rounded">
                                        {practica.ubicacion_documento}
                                    </span>
                                    {practica.codigo_nomenclador && (
                                        <span className="px-2 py-1 bg-yellow-200 rounded font-mono">
                                            {practica.codigo_nomenclador}
                                        </span>
                                    )}
                                    {practica.requiere_autorizacion && (
                                        <span className="px-2 py-1 bg-red-200 text-red-800 rounded font-semibold">
                                            Requiere Autorización
                                        </span>
                                    )}
                                    {practica.facturacion_aparte && (
                                        <span className="px-2 py-1 bg-blue-200 text-blue-800 rounded">
                                            Facturación Aparte
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ===== Componente: Endoscopías =====
export function EndoscopiasSection({ endoscopias }: { endoscopias: any[] }) {
    if (!endoscopias || endoscopias.length === 0) return null;

    return (
        <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-xl p-8 mb-6">
            <div className="flex items-center gap-3 mb-6">
                <FileText className="w-8 h-8 text-purple-600" />
                <h2 className="text-2xl font-bold text-gray-900">Endoscopías y Procedimientos</h2>
            </div>

            <div className="space-y-4">
                {endoscopias.map((endo, idx) => (
                    <div key={idx} className="p-4 bg-purple-50 rounded-lg border-2 border-purple-200">
                        <div className="flex items-start justify-between mb-3">
                            <div>
                                <span className="font-bold text-purple-900 text-lg">{endo.procedimiento}</span>
                                <p className="text-sm text-purple-700">
                                    {endo.fecha} {endo.hora_inicio && `- ${endo.hora_inicio}`}
                                    {endo.hora_fin && ` a ${endo.hora_fin}`}
                                </p>
                            </div>
                            {endo.biopsias && (
                                <span className="px-3 py-1 bg-purple-200 text-purple-800 rounded-full text-sm font-semibold">
                                    Con biopsias
                                </span>
                            )}
                        </div>

                        <div className="space-y-2 text-sm">
                            <div>
                                <span className="font-semibold">Endoscopista:</span> {endo.endoscopista.nombre}
                                {endo.endoscopista.matricula && ` (MP: ${endo.endoscopista.matricula})`}
                            </div>

                            {endo.hallazgos && (
                                <div>
                                    <span className="font-semibold">Hallazgos:</span>
                                    <p className="mt-1 p-2 bg-white rounded">{endo.hallazgos}</p>
                                </div>
                            )}

                            {endo.errores.length > 0 && (
                                <div className="mt-2 p-2 bg-red-100 rounded">
                                    {endo.errores.map((error, i) => (
                                        <p key={i} className="text-red-700 text-xs">⚠️ {error}</p>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ===== Componente: Prácticas Ambulatorias =====
export function PracticasAmbulatoriasSection({ practicas }: { practicas: any[] }) {
    if (!practicas || practicas.length === 0) return null;

    return (
        <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-xl p-8 mb-6">
            <div className="flex items-center gap-3 mb-6">
                <AlertTriangle className="w-8 h-8 text-orange-600" />
                <h2 className="text-2xl font-bold text-gray-900">Prácticas Ambulatorias Durante Internación</h2>
            </div>

            <div className="bg-orange-50 border-2 border-orange-300 rounded-lg p-4 mb-4">
                <p className="text-orange-800 font-semibold">
                    ℹ️ Estas prácticas fueron realizadas durante la internación y pueden requerir autorización
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-3">
                {practicas.map((practica, idx) => (
                    <div key={idx} className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                        <div className="flex items-center justify-between mb-1">
                            <span className="font-semibold text-orange-900">{practica.tipo}</span>
                            {practica.requiere_autorizacion && (
                                <CheckCircle className="w-4 h-4 text-orange-600" />
                            )}
                        </div>
                        <p className="text-sm text-orange-700">
                            {practica.fecha} {practica.hora && `- ${practica.hora}`}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
