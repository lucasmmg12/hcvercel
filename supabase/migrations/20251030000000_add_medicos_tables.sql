
CREATE TABLE IF NOT EXISTS medicos_foja_quirurgica (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  auditoria_id uuid REFERENCES auditorias(id) ON DELETE CASCADE,
  nombre_completo text NOT NULL,
  rol text,
  fecha_cirugia text,
  nombre_archivo text,
  paciente_dni text,
  paciente_nombre text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS errores_medicos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  auditoria_id uuid REFERENCES auditorias(id) ON DELETE CASCADE,
  medico_id uuid REFERENCES medicos_foja_quirurgica(id) ON DELETE CASCADE,
  nombre_medico text,
  rol_medico text,
  tipo_error text,
  descripcion text,
  severidad text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE medicos_foja_quirurgica ENABLE ROW LEVEL SECURITY;
ALTER TABLE errores_medicos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuarios autenticados pueden ver medicos" ON medicos_foja_quirurgica FOR SELECT TO authenticated USING (true);
CREATE POLICY "Usuarios autenticados pueden insertar medicos" ON medicos_foja_quirurgica FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Usuarios autenticados pueden ver errores medicos" ON errores_medicos FOR SELECT TO authenticated USING (true);
CREATE POLICY "Usuarios autenticados pueden insertar errores medicos" ON errores_medicos FOR INSERT TO authenticated WITH CHECK (true);
