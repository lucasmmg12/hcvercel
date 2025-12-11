# Guía para Verificar y Solucionar el Error "Failed to fetch"

## Paso 1: Verificar Variables de Entorno

1. Abre el archivo `.env` en la raíz del proyecto
2. Asegúrate de que tenga estas dos líneas:
   ```
   VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
   VITE_SUPABASE_ANON_KEY=tu-clave-anonima-muy-larga
   ```

3. Para obtener estos valores:
   - Ve a https://supabase.com/dashboard
   - Selecciona tu proyecto
   - Ve a Settings → API
   - Copia "Project URL" → pégala en VITE_SUPABASE_URL
   - Copia "anon public" key → pégala en VITE_SUPABASE_ANON_KEY

4. **IMPORTANTE**: Después de modificar el `.env`, debes **reiniciar el servidor de desarrollo**:
   - Detén el servidor (Ctrl+C en la terminal donde corre `npm run dev`)
   - Vuelve a ejecutar `npm run dev`

## Paso 2: Verificar que la Edge Function esté desplegada

1. Ve a https://supabase.com/dashboard
2. Selecciona tu proyecto
3. Ve a "Edge Functions" en el menú lateral
4. Busca la función "auditar-pdf"
5. Verifica que esté **desplegada** (debe tener un estado "Active" o similar)

Si NO está desplegada:
```bash
# Desde la raíz del proyecto
npx supabase functions deploy auditar-pdf
```

## Paso 3: Verificar CORS

1. Ve a https://supabase.com/dashboard
2. Selecciona tu proyecto
3. Ve a Settings → API
4. Busca la sección "CORS Configuration"
5. Asegúrate de que `http://localhost:5173` esté en la lista de orígenes permitidos
   - O usa `*` para permitir todos los orígenes (solo para desarrollo)

## Paso 4: Probar la conexión

Después de hacer los cambios anteriores:

1. Reinicia el servidor de desarrollo (`npm run dev`)
2. Abre http://localhost:5173/
3. Abre la consola del navegador (F12)
4. Deberías ver:
   ```
   🔧 Configuración de Supabase:
     URL: ✅ Definida
     Anon Key: ✅ Definida
   ```

5. Intenta subir un PDF
6. Observa los logs en la consola:
   ```
   📄 Extrayendo texto del PDF...
   ✅ Texto extraído, longitud: XXXX
   🚀 Enviando a Edge Function: https://...
   🔑 URL de Supabase: https://...
   🔑 Tiene Anon Key: Sí
   📡 Response status: 200
   ```

Si ves "Failed to fetch", revisa los pasos anteriores.

## Paso 5: Si nada funciona

Ejecuta este comando para verificar que Supabase CLI esté configurado:

```bash
npx supabase status
```

Esto mostrará el estado de tu proyecto local de Supabase.
