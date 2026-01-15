-- Migration to enable anonymous access to the data
-- This is necessary because the application uses the anon key and no official login flow is implemented in the UI

-- Allow anonymous users to view auditorias
CREATE POLICY "Usuarios anonimos pueden ver auditorías"
  ON auditorias
  FOR SELECT
  TO anon
  USING (true);

-- Allow anonymous users to view medicos
CREATE POLICY "Usuarios anonimos pueden ver medicos"
  ON medicos_foja_quirurgica
  FOR SELECT
  TO anon
  USING (true);

-- Allow anonymous users to view errores medicos
CREATE POLICY "Usuarios anonimos pueden ver errores medicos"
  ON errores_medicos
  FOR SELECT
  TO anon
  USING (true);

-- Allow anonymous users to view mensajes_enviados
CREATE POLICY "Usuarios anonimos pueden ver mensajes"
  ON mensajes_enviados
  FOR SELECT
  TO anon
  USING (true);
