-- Migration to add missing estudios columns to auditorias table
-- These columns are required by the latest version of the auditar-pdf Edge Function

DO $$
BEGIN
  -- Add estudios_total column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'auditorias' AND column_name = 'estudios_total'
  ) THEN
    ALTER TABLE auditorias ADD COLUMN estudios_total integer DEFAULT 0;
  END IF;

  -- Add estudios_imagenes column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'auditorias' AND column_name = 'estudios_imagenes'
  ) THEN
    ALTER TABLE auditorias ADD COLUMN estudios_imagenes integer DEFAULT 0;
  END IF;

  -- Add estudios_laboratorio column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'auditorias' AND column_name = 'estudios_laboratorio'
  ) THEN
    ALTER TABLE auditorias ADD COLUMN estudios_laboratorio integer DEFAULT 0;
  END IF;

  -- Add estudios_procedimientos column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'auditorias' AND column_name = 'estudios_procedimientos'
  ) THEN
    ALTER TABLE auditorias ADD COLUMN estudios_procedimientos integer DEFAULT 0;
  END IF;

  -- Add sesiones_kinesiologia column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'auditorias' AND column_name = 'sesiones_kinesiologia'
  ) THEN
    ALTER TABLE auditorias ADD COLUMN sesiones_kinesiologia integer DEFAULT 0;
  END IF;

  -- Add estudios column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'auditorias' AND column_name = 'estudios'
  ) THEN
    ALTER TABLE auditorias ADD COLUMN estudios jsonb DEFAULT '[]'::jsonb;
  END IF;

  -- Add errores_estudios column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'auditorias' AND column_name = 'errores_estudios'
  ) THEN
    ALTER TABLE auditorias ADD COLUMN errores_estudios jsonb DEFAULT '[]'::jsonb;
  END IF;
END $$;
