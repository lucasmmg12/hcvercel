import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

/* =========================
   Tipos
   ========================= */
/* =========================
   Tipos
   ========================= */
type CategoriaEstudio = 'Imagenes' | 'Laboratorio' | 'Procedimientos';

interface Estudio {
  categoria: CategoriaEstudio;
  tipo: string;
  fecha?: string | null;
  hora?: string | null;
  lugar?: string | null;
  resultado?: string | null;
  informe_presente: boolean;
  advertencias: string[];
}

interface DiaInternacion {
  fecha: string;
  tieneEvolucion: boolean;
  tieneFojaQuirurgica: boolean;
  estudios: Estudio[];
}

export interface ResultadoAuditoria {
  nombreArchivo: string;
  datosPaciente: {
    nombre?: string;
    dni?: string;
    fecha_nacimiento?: string;
    sexo?: string;
    obra_social?: string;
    habitacion?: string;
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

  // ===== NUEVO: opcionales para Estudios =====
  estudios?: Estudio[];
  estudiosConteo?: {
    total: number;
    imagenes: number;
    laboratorio: number;
    procedimientos: number;
  };
  erroresEstudios?: string[];
  listaDiasInternacion?: DiaInternacion[];
  interconsultas?: any[];
  practicasExcluidas?: any[];
  endoscopias?: any[];
  practicasAmbulatorias?: any[];
  resultadoTerapia?: any;
}

/* =========================
   Colores (Estética Grow Labs Dark Tech adaptada a PDF)
   ========================= */
const COLOR_PRIMARY: [number, number, number] = [34, 197, 94]; // Green 500 (#22c55e) - Color de marca principal
const COLOR_DARK_BG: [number, number, number] = [5, 5, 5];     // Almost Black (#050505) - Fondo oscuro tecnológico
const COLOR_ACCENT: [number, number, number] = [74, 222, 128]; // Green 400 - Acentos brillantes para texto oscuro
const COLOR_TEXT_MAIN: [number, number, number] = [31, 41, 55]; // Gray 800 - Texto principal (para legibilidad en blanco)
const COLOR_TEXT_LIGHT: [number, number, number] = [107, 114, 128]; // Gray 500 - Texto secundario
const COLOR_ERROR: [number, number, number] = [220, 38, 38];   // Red 600 - Errores críticos
const COLOR_WARNING: [number, number, number] = [234, 179, 8]; // Yellow 500 - Advertencias

/* =========================
   Util
   ========================= */
const fmtBool = (v: boolean) => (v ? 'Sí' : 'No');

export async function generateAuditPDF(resultado: ResultadoAuditoria, downloadPDF: boolean = true): Promise<Blob> {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  let yPos = 20;

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-AR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    } catch (e) {
      return dateString;
    }
  };

  // Función auxiliar para dibujar encabezado y pie en todas las páginas
  const addHeaderFooter = (pageNumber: number, totalPages: number) => {
    // === HEADER ===
    // Fondo oscuro tecnológico
    doc.setFillColor(...COLOR_DARK_BG);
    doc.rect(0, 0, pageWidth, 20, 'F');

    // Línea verde neón inferior del header
    doc.setLineWidth(0.5);
    doc.setDrawColor(...COLOR_PRIMARY);
    doc.line(0, 20, pageWidth, 20);

    // Texto Izquierda: GROW LABS
    doc.setFontSize(12);
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.text('GROW LABS', 10, 11);

    doc.setFontSize(7);
    doc.setTextColor(...COLOR_ACCENT); // Verde neón
    doc.setFont('helvetica', 'normal');
    doc.text('Donde tus ideas crecen', 10, 15);

    // Texto Derecha: Institución
    doc.setFontSize(9);
    doc.setTextColor(255, 255, 255);
    doc.text('Sanatorio Argentino - Auditoría Inteligente', pageWidth - 10, 13, { align: 'right' });

    // === FOOTER ===
    // Fondo oscuro
    doc.setFillColor(...COLOR_DARK_BG);
    doc.rect(0, pageHeight - 12, pageWidth, 12, 'F');

    // Línea verde superior del footer
    doc.setDrawColor(...COLOR_PRIMARY);
    doc.line(0, pageHeight - 12, pageWidth, pageHeight - 12);

    doc.setFontSize(8);
    doc.setTextColor(156, 163, 175); // Gray 400
    doc.text(
      `Generado con IA por Grow Labs | Página ${pageNumber} de ${totalPages}`,
      pageWidth / 2,
      pageHeight - 5,
      { align: 'center' }
    );
  };

  const checkPageBreak = (requiredSpace: number) => {
    if (yPos + requiredSpace > pageHeight - 20) {
      doc.addPage();
      yPos = 30; // Margen superior un poco más amplio tras salto
      return true;
    }
    return false;
  };

  // Sección estilizada
  const addSection = (title: string, accentColor: number[] = COLOR_PRIMARY) => {
    checkPageBreak(15);
    doc.setFillColor(...accentColor);
    // Pequeña barra lateral verde en lugar de fondo completo para un look más moderno/clean
    doc.rect(10, yPos, 2, 8, 'F');

    doc.setFontSize(14);
    doc.setTextColor(...COLOR_TEXT_MAIN);
    doc.setFont('helvetica', 'bold');
    doc.text(title.toUpperCase(), 15, yPos + 6);

    // Línea sutil debajo
    doc.setDrawColor(229, 231, 235); // Gray 200
    doc.setLineWidth(0.1);
    doc.line(10, yPos + 10, pageWidth - 10, yPos + 10);

    yPos += 18;
  };

  /* =========================
     PORTADA
     ========================= */
  // Fondo oscuro completo para la parte superior de portada
  doc.setFillColor(...COLOR_DARK_BG);
  doc.rect(0, 0, pageWidth, 60, 'F');

  // Gradiente/acento visual (simulado con rect)
  doc.setFillColor(...COLOR_PRIMARY);
  doc.circle(pageWidth, 0, 40, 'F'); // Círculo verde en esquina superior derecha

  // Título Principal
  doc.setFontSize(24);
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.text('INFORME DE', 15, 30);
  doc.text('AUDITORÍA MÉDICA', 15, 40);

  // Subtítulo con fecha
  doc.setFontSize(10);
  doc.setTextColor(...COLOR_ACCENT);
  doc.setFont('helvetica', 'normal');
  const fechaHoy = new Date().toLocaleDateString('es-AR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  doc.text(fechaHoy.charAt(0).toUpperCase() + fechaHoy.slice(1), 15, 50);

  yPos = 75;

  // Información del Archivo (Card Style)
  doc.setFillColor(249, 250, 251); // Gray 50
  doc.setDrawColor(229, 231, 235); // Border Gray 200
  doc.roundedRect(10, yPos, pageWidth - 20, 20, 2, 2, 'FD');

  doc.setFontSize(9);
  doc.setTextColor(...COLOR_TEXT_LIGHT);
  doc.text('ARCHIVO ANALIZADO', 15, yPos + 8);

  doc.setFontSize(10);
  doc.setTextColor(...COLOR_TEXT_MAIN);
  doc.setFont('helvetica', 'bold');
  const fileNameText = doc.splitTextToSize(resultado.nombreArchivo, pageWidth - 30);
  doc.text(fileNameText, 15, yPos + 14);

  yPos += 30;

  /* =========================
     RESUMEN EJECUTIVO (KPIs)
     ========================= */
  addSection('RESUMEN EJECUTIVO');

  // Texto del resumen
  const resumenText = resultado.pacienteInternado
    ? `PACIENTE INTERNADO. Se han detectado ${resultado.totalErrores} hallazgos que requieren atención durante la internación.`
    : `AUDITORÍA DE CIERRE. Se detectaron ${resultado.totalErrores} hallazgos antes de la facturación.`;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...COLOR_TEXT_MAIN);
  const splitResumen = doc.splitTextToSize(resumenText, pageWidth - 24);
  doc.text(splitResumen, 12, yPos);

  yPos += splitResumen.length * 5 + 5;

  // KPIs Cards (Simuladas)
  const kpiY = yPos;
  const kpiWidth = (pageWidth - 25) / 3;
  const kpiHeight = 18;

  // KPI 1: Errores
  const kpi1Color = resultado.totalErrores > 0 ? COLOR_ERROR : COLOR_PRIMARY;
  doc.setDrawColor(...kpi1Color);
  doc.setLineWidth(0.5);
  doc.roundedRect(10, kpiY, kpiWidth, kpiHeight, 2, 2, 'S');
  doc.setFontSize(8);
  doc.setTextColor(107, 114, 128);
  doc.text('HALLAZGOS', 15, kpiY + 6);
  doc.setFontSize(14);
  doc.setTextColor(...kpi1Color);
  doc.setFont('helvetica', 'bold');
  doc.text(String(resultado.totalErrores), 15, kpiY + 13);

  // KPI 2: Días
  doc.setDrawColor(31, 41, 55); // Dark border
  doc.roundedRect(10 + kpiWidth + 2.5, kpiY, kpiWidth, kpiHeight, 2, 2, 'S');
  doc.setFontSize(8);
  doc.setTextColor(107, 114, 128);
  doc.setFont('helvetica', 'normal');
  doc.text('DÍAS INTERNACIÓN', 15 + kpiWidth + 2.5, kpiY + 6);
  doc.setFontSize(14);
  doc.setTextColor(...COLOR_TEXT_MAIN);
  doc.setFont('helvetica', 'bold');
  doc.text(String(resultado.diasHospitalizacion), 15 + kpiWidth + 2.5, kpiY + 13);

  if (resultado.resultadoTerapia?.esTerapia) {
    doc.setFontSize(7);
    doc.setTextColor(107, 114, 128);
    doc.setFont('helvetica', 'normal');
    const detail = `TI:${resultado.resultadoTerapia.diasTerapiaIntensiva} | TM:${resultado.resultadoTerapia.diasTerapiaIntermedia} | G:${resultado.resultadoTerapia.diasInternacionGeneral}`;
    doc.text(detail, 15 + kpiWidth + 2.5, kpiY + 16.5);
  }

  // KPI 3: Estado
  doc.setDrawColor(31, 41, 55);
  doc.roundedRect(10 + (kpiWidth + 2.5) * 2, kpiY, kpiWidth, kpiHeight, 2, 2, 'S');
  doc.setFontSize(8);
  doc.setTextColor(107, 114, 128);
  doc.setFont('helvetica', 'normal');
  doc.text('ESTADO', 15 + (kpiWidth + 2.5) * 2, kpiY + 6);
  doc.setFontSize(10); // Más pequeño para que quepa
  doc.setTextColor(...COLOR_TEXT_MAIN);
  doc.setFont('helvetica', 'bold');
  const estadoCorto = resultado.pacienteInternado ? 'INTERNADO' : resultado.estado.toUpperCase();
  doc.text(estadoCorto, 15 + (kpiWidth + 2.5) * 2, kpiY + 13);

  yPos += 28;

  /* =========================
     DATOS DEL PACIENTE
     ========================= */
  addSection('DATOS DEL PACIENTE');

  // Tabla limpia sin bordes verticales, estilo minimalista
  const pacienteData = [
    ['Paciente:', resultado.datosPaciente.nombre || 'No identificado'],
    ['DNI:', resultado.datosPaciente.dni || 'No identificado'],
    ['Obra Social:', resultado.datosPaciente.obra_social || 'No identificada'],
    ['Habitación:', resultado.datosPaciente.habitacion || 'No identificada'],
    ['Ingreso:', formatDate(resultado.fechaIngreso)],
    ['Egreso:', resultado.pacienteInternado ? 'En curso' : formatDate(resultado.fechaAlta)],
  ];

  autoTable(doc, {
    startY: yPos,
    body: pacienteData,
    theme: 'plain',
    styles: { fontSize: 10, cellPadding: 2, textColor: COLOR_TEXT_MAIN as any },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 35, textColor: COLOR_TEXT_LIGHT as any },
      1: { cellWidth: 'auto' },
    },
    margin: { left: 10, right: 10 },
  });

  yPos = (doc as any).lastAutoTable.finalY + 10;

  /* =========================
     CLASIFICACIÓN DE TERAPIA / NIVELES DE CUIDADO
     ========================= */
  if (resultado.resultadoTerapia?.esTerapia) {
    addSection('CLASIFICACIÓN DE NIVELES DE CUIDADO');

    // Resumen de días por sector
    const terapiaResumen = [
      ['Terapia Intensiva:', `${resultado.resultadoTerapia.diasTerapiaIntensiva} días`],
      ['Terapia Intermedia:', `${resultado.resultadoTerapia.diasTerapiaIntermedia} días`],
      ['Internación General:', `${resultado.resultadoTerapia.diasInternacionGeneral} días`],
    ];

    autoTable(doc, {
      startY: yPos,
      body: terapiaResumen,
      theme: 'plain',
      styles: { fontSize: 10, cellPadding: 2, textColor: COLOR_TEXT_MAIN as any },
      columnStyles: {
        0: { fontStyle: 'bold', cellWidth: 40, textColor: COLOR_TEXT_LIGHT as any },
        1: { cellWidth: 'auto' },
      },
      margin: { left: 10, right: 10 },
    });

    yPos = (doc as any).lastAutoTable.finalY + 8;

    // Detalle diario de clasificación y criterios
    const terapiaBody = resultado.resultadoTerapia.clasificacionPorDia.map((dia: any) => {
      const cumpleCriterios = !(dia.justificacion.toLowerCase().includes('no cumple') ||
        dia.justificacion.toLowerCase().includes('no respeta') ||
        dia.justificacion.toLowerCase().includes('no amerita') ||
        (dia.errores && dia.errores.length > 0));

      let sector = '';
      switch (dia.clasificacion) {
        case 'terapia_intensiva': sector = 'U.T.I.'; break;
        case 'terapia_intermedia': sector = 'U.C.E.'; break;
        case 'internacion_general': sector = 'PISO'; break;
        case 'no_corresponde_terapia': sector = 'PISO (NC)'; break;
        default: sector = 'OTRO';
      }

      return [
        formatDate(dia.fecha),
        sector,
        cumpleCriterios ? 'SÍ' : 'NO',
        dia.justificacion || '-'
      ];
    });

    autoTable(doc, {
      startY: yPos,
      head: [['Fecha', 'Sector', 'Cumple Criterios', 'Justificación / Hallazgo']],
      body: terapiaBody,
      theme: 'grid',
      headStyles: {
        fillColor: COLOR_DARK_BG as any,
        textColor: 255,
        fontStyle: 'bold',
        halign: 'center'
      },
      styles: { fontSize: 8, cellPadding: 3, textColor: COLOR_TEXT_MAIN as any },
      columnStyles: {
        0: { cellWidth: 25, halign: 'center' },
        1: { cellWidth: 25, halign: 'center' },
        2: { cellWidth: 30, halign: 'center', fontStyle: 'bold' },
        3: { cellWidth: 'auto' },
      },
      didParseCell: function (data) {
        if (data.section === 'body' && data.column.index === 2) {
          const val = data.cell.raw;
          if (val === 'NO') {
            data.cell.styles.textColor = [220, 38, 38];
          } else {
            data.cell.styles.textColor = [34, 197, 94];
          }
        }
      },
      margin: { left: 10, right: 10 },
    });

    yPos = (doc as any).lastAutoTable.finalY + 15;
  }

  /* =========================
     NUEVO: SECUENCIA DE INTERNACIÓN (DETALLE DÍA A DÍA)
     ========================= */
  if (resultado.listaDiasInternacion && resultado.listaDiasInternacion.length > 0) {
    addSection('SECUENCIA DE INTERNACIÓN (DÍA A DÍA)');

    // Preparar datos para tabla
    const diasBody = resultado.listaDiasInternacion.map(dia => {
      // Formatear estudios
      const estudiosCount = dia.estudios.length;
      const estudiosText = estudiosCount > 0
        ? `${estudiosCount} (${dia.estudios.map(e => e.tipo).join(', ').slice(0, 30)}${dia.estudios.map(e => e.tipo).join(', ').length > 30 ? '...' : ''})`
        : '-';

      return [
        formatDate(dia.fecha),
        dia.tieneEvolucion ? 'SÍ' : 'NO',
        dia.tieneFojaQuirurgica ? 'SÍ' : '-',
        estudiosText
      ];
    });

    autoTable(doc, {
      startY: yPos,
      head: [['Fecha', 'Evolución', 'Qx', 'Estudios Realizados']],
      body: diasBody,
      theme: 'grid',
      headStyles: {
        fillColor: COLOR_DARK_BG as any,
        textColor: 255,
        fontStyle: 'bold',
        halign: 'center'
      },
      bodyStyles: {
        textColor: COLOR_TEXT_MAIN as any,
        fontSize: 9
      },
      columnStyles: {
        0: { cellWidth: 30, halign: 'center' }, // Fecha
        1: { cellWidth: 25, halign: 'center', fontStyle: 'bold' }, // Evolución (importante)
        2: { cellWidth: 15, halign: 'center' }, // Qx
        3: { cellWidth: 'auto' }, // Estudios
      },
      // Colorear filas según estado
      didParseCell: function (data) {
        if (data.section === 'body' && data.column.index === 1) {
          const val = data.cell.raw;
          if (val === 'NO') {
            data.cell.styles.textColor = [220, 38, 38]; // Rojo si falta evolución
          } else {
            data.cell.styles.textColor = [34, 197, 94]; // Verde si está ok
          }
        }
      },
      margin: { left: 10, right: 10 }
    });

    yPos = (doc as any).lastAutoTable.finalY + 15;
  }

  /* =========================
     ESTUDIOS Y PRÁCTICAS
     ========================= */
  if (resultado.estudios && resultado.estudios.length > 0) {
    addSection('ESTUDIOS Y PRÁCTICAS');

    // Tabla Detallada
    const estudiosBody = resultado.estudios.map((e) => [
      e.categoria,
      e.tipo,
      e.resultado && e.resultado.length > 5 ? 'Presente' : 'Pendiente/No detectado',
      e.informe_presente ? 'OK' : 'FALTANTE'
    ]);

    autoTable(doc, {
      startY: yPos,
      head: [['Categoría', 'Estudio', 'Resultado', 'Informe PDF']],
      body: estudiosBody,
      theme: 'striped', // Striped para fácil lectura
      headStyles: {
        fillColor: [243, 244, 246] as any, // Gris muy claro
        textColor: COLOR_TEXT_MAIN as any,
        fontStyle: 'bold',
        lineColor: [229, 231, 235] as any,
        lineWidth: 0.1
      },
      styles: { fontSize: 9, cellPadding: 3, textColor: COLOR_TEXT_MAIN as any },
      columnStyles: {
        0: { cellWidth: 35 },
        1: { cellWidth: 'auto', fontStyle: 'bold' },
        2: { cellWidth: 40 },
        3: { cellWidth: 25, halign: 'center', fontStyle: 'bold' },
      },
      didParseCell: function (data) {
        if (data.section === 'body' && data.column.index === 3) {
          if (data.cell.raw === 'FALTANTE') {
            data.cell.styles.textColor = COLOR_ERROR as any;
          } else {
            data.cell.styles.textColor = COLOR_PRIMARY as any;
          }
        }
      },
      margin: { left: 10, right: 10 },
    });

    yPos = (doc as any).lastAutoTable.finalY + 10;
  }

  /* =========================
     HALLAZGOS Y ERRORES (Bloque unificado)
     ========================= */
  const tieneErrores = resultado.totalErrores > 0;
  if (tieneErrores) {
    addSection('DETALLE DE HALLAZGOS POR ÁREA');

    const printErrorBlock = (titulo: string, lista: string[], color: number[] = COLOR_ERROR) => {
      if (!lista || lista.length === 0) return;

      checkPageBreak(25);
      doc.setFontSize(10);
      doc.setTextColor(...color);
      doc.setFont('helvetica', 'bold');
      doc.text(titulo, 12, yPos);
      yPos += 6;

      doc.setFontSize(9);
      doc.setTextColor(...COLOR_TEXT_MAIN);
      doc.setFont('helvetica', 'normal');

      lista.forEach(item => {
        const itemText = doc.splitTextToSize(`• ${item}`, pageWidth - 25);
        checkPageBreak(itemText.length * 5 + 5);
        doc.text(itemText, 15, yPos);
        yPos += itemText.length * 5 + 2;
      });
      yPos += 5;
    };

    printErrorBlock('ERRORES DE ADMISIÓN', resultado.erroresAdmision);
    printErrorBlock('ERRORES EN EVOLUCIONES', resultado.erroresEvolucion);
    printErrorBlock('ERRORES EN FOJA QUIRÚRGICA', resultado.erroresFoja);
    printErrorBlock('ERRORES EN ESTUDIOS', resultado.erroresEstudios || []);
    printErrorBlock('ERRORES DE EPICRISIS / ALTA', [...resultado.erroresAltaMedica, ...resultado.erroresEpicrisis]);
  } else {
    // Success message
    addSection('RESULTADO DE AUDITORÍA');
    checkPageBreak(30);
    doc.setFillColor(220, 252, 231); // Green 100
    doc.setDrawColor(...COLOR_PRIMARY);
    doc.roundedRect(10, yPos, pageWidth - 20, 20, 2, 2, 'FD');

    doc.setFontSize(11);
    doc.setTextColor(...COLOR_PRIMARY); // Green 700ish
    doc.setFont('helvetica', 'bold');
    doc.text('AUDITORÍA APROBADA', 15, yPos + 8);

    doc.setFontSize(9);
    doc.setTextColor(...COLOR_TEXT_MAIN);
    doc.setFont('helvetica', 'normal');
    doc.text('Toda la documentación obligatoria ha sido verificada correctamente.', 15, yPos + 15);

    yPos += 30;
  }

  // Agregar Footer a todas las paginas al final
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    addHeaderFooter(i, totalPages);
  }

  const fileName = `Auditoria_${resultado.datosPaciente.nombre || 'Paciente'}_${new Date().toISOString().split('T')[0]}.pdf`;

  if (downloadPDF) doc.save(fileName);

  return doc.output('blob');
}
