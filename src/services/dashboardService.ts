import { supabase } from '../lib/supabase';

export interface DashboardStats {
    erroresPorEtapa: { etapa: string; cantidad: number }[];
    erroresPorSeveridad: { severidad: string; cantidad: number }[];
    topErrores: { tipo: string; cantidad: number }[];
    rankingMedicos: { nombre: string; errores: number }[];
    erroresPorRol: { rol: string; cantidad: number }[];
    auditoriasPorFecha: { fecha: string; cantidad: number }[];
    distribucionObraSocial: { nombre: string; cantidad: number }[];
    usoBisturi: { tipo: string; cantidad: number }[];
    totalAuditorias: number;
}

export async function obtenerDatosDashboard(): Promise<DashboardStats> {
    console.log('📊 Dashboard: Iniciando carga de datos...');

    const { data: auditorias, error: errorAuditorias } = await supabase.from('auditorias').select('*');
    const { data: erroresMedicos, error: errorErrores } = await supabase.from('errores_medicos').select('*');

    if (errorAuditorias) console.error('❌ Dashboard: Error en auditorias:', errorAuditorias);
    if (errorErrores) console.error('❌ Dashboard: Error en errores_medicos:', errorErrores);

    const auditoriasSeguras = auditorias || [];
    const erroresSeguros = erroresMedicos || [];

    console.log(`📈 Dashboard: ${auditoriasSeguras.length} auditorías encontradas`);
    console.log(`📉 Dashboard: ${erroresSeguros.length} errores médicos encontrados`);

    // A. Análisis de Errores por Etapa
    const etapas = [
        {
            etapa: 'Admisión',
            cantidad: auditoriasSeguras.reduce((s, a) => s + (Number(a.errores_admision) || 0), 0)
        },
        {
            etapa: 'Evoluciones',
            cantidad: auditoriasSeguras.reduce((s, a) => s + (Number(a.errores_evoluciones) || 0), 0)
        },
        {
            etapa: 'Foja Quir.',
            cantidad: auditoriasSeguras.reduce((s, a) => s + (Number(a.errores_foja_quirurgica) || 0), 0)
        },
        {
            etapa: 'Epicrisis',
            cantidad: auditoriasSeguras.reduce((s, a) => s + (Number(a.errores_epicrisis) || 0), 0)
        },
        {
            etapa: 'Alta Médica',
            cantidad: auditoriasSeguras.reduce((s, a) => s + (Number(a.errores_alta_medica || a.errores_alta || 0) || 0), 0)
        },
    ];

    const totalAuditorias = auditoriasSeguras.length;

    // A. Severidad
    const severidadMap: Record<string, number> = {};
    erroresSeguros.forEach(e => {
        const sev = (e.severidad || 'No definida').toUpperCase();
        severidadMap[sev] = (severidadMap[sev] || 0) + 1;
    });
    const errores_por_severidad = Object.entries(severidadMap).map(([severidad, cantidad]) => ({ severidad, cantidad }));

    // A. Top Tipos de Errores
    const tiposMap: Record<string, number> = {};
    erroresSeguros.forEach(e => {
        const tipo = (e.tipo_error || 'Otro');
        tiposMap[tipo] = (tiposMap[tipo] || 0) + 1;
    });
    const topErrores = Object.entries(tiposMap)
        .map(([tipo, cantidad]) => ({ tipo, cantidad }))
        .sort((a, b) => b.cantidad - a.cantidad)
        .slice(0, 10);

    // B. Ranking Médicos
    const medicosMap: Record<string, number> = {};
    erroresSeguros.forEach(e => {
        const nombre = e.nombre_medico || 'Desconocido';
        medicosMap[nombre] = (medicosMap[nombre] || 0) + 1;
    });
    const rankingMedicos = Object.entries(medicosMap)
        .map(([nombre, errores]) => ({ nombre, errores }))
        .sort((a, b) => b.errores - a.errores)
        .slice(0, 10);

    // B. Errores por Rol
    const rolesMap: Record<string, number> = {};
    erroresSeguros.forEach(e => {
        const rol = e.rol_medico || 'Otro';
        rolesMap[rol] = (rolesMap[rol] || 0) + 1;
    });
    const erroresPorRol = Object.entries(rolesMap).map(([rol, cantidad]) => ({ rol, cantidad }));

    // C. Auditorias por Fecha (últimos 30 días)
    const fechasMap: Record<string, number> = {};
    auditoriasSeguras.forEach(a => {
        const dateVal = a.created_at || a.fecha_auditoria;
        if (!dateVal) return;
        try {
            const dateObj = new Date(dateVal);
            if (isNaN(dateObj.getTime())) return;
            const fecha = dateObj.toLocaleDateString('es-AR');
            fechasMap[fecha] = (fechasMap[fecha] || 0) + 1;
        } catch (e) { /* ignore */ }
    });

    const auditoriasPorFecha = Object.entries(fechasMap)
        .map(([fecha, cantidad]) => ({ fecha, cantidad }))
        .sort((a, b) => {
            const [da, ma, ya] = a.fecha.split('/');
            const [db, mb, yb] = b.fecha.split('/');
            const dateA = new Date(parseInt(ya), parseInt(ma) - 1, parseInt(da)).getTime();
            const dateB = new Date(parseInt(yb), parseInt(mb) - 1, parseInt(db)).getTime();
            return dateA - dateB;
        });

    // C. Distribución Obra Social
    const osMap: Record<string, number> = {};
    auditoriasSeguras.forEach(a => {
        const os = a.obra_social || 'Desconocida';
        osMap[os] = (osMap[os] || 0) + 1;
    });
    const distribucionObraSocial = Object.entries(osMap)
        .map(([nombre, cantidad]) => ({ nombre, cantidad }))
        .sort((a, b) => b.cantidad - a.cantidad)
        .slice(0, 15);

    // C. Uso Bisturí Armónico
    const bisturiMap: Record<string, number> = { 'SI': 0, 'NO': 0, 'No determinado': 0 };
    auditoriasSeguras.forEach(a => {
        let val = String(a.bisturi_armonico || 'No determinado').toUpperCase();
        if (val === 'SÍ') val = 'SI';
        if (bisturiMap.hasOwnProperty(val)) {
            bisturiMap[val]++;
        } else {
            bisturiMap['No determinado']++;
        }
    });
    const usoBisturi = Object.entries(bisturiMap).map(([tipo, cantidad]) => ({ tipo, cantidad }));

    console.log('📊 Dashboard: Proceso de datos completado');

    return {
        erroresPorEtapa: etapas,
        erroresPorSeveridad: errores_por_severidad,
        topErrores,
        rankingMedicos,
        erroresPorRol,
        auditoriasPorFecha,
        distribucionObraSocial,
        usoBisturi,
        totalAuditorias
    };
}
