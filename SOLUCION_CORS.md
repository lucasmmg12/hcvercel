# Solución al Problema de CORS

## El Problema
El error "Failed to fetch" ocurre porque estás intentando llamar a una Edge Function de Supabase que:
1. Está definida localmente en tu código
2. Pero NO está desplegada en Supabase
3. Por lo tanto, cuando el navegador intenta hacer la petición, no encuentra la función

## Opción 1: Desplegar la Edge Function (RECOMENDADO)

### Paso 1: Instalar Supabase CLI

```bash
npm install -g supabase
```

### Paso 2: Iniciar sesión en Supabase

```bash
npx supabase login
```

Esto abrirá tu navegador para autenticarte.

### Paso 3: Vincular tu proyecto

```bash
npx supabase link --project-ref TU_PROJECT_REF
```

Para obtener tu `PROJECT_REF`:
1. Ve a https://supabase.com/dashboard
2. Selecciona tu proyecto
3. Ve a Settings → General
4. Copia el "Reference ID"

### Paso 4: Desplegar la función

```bash
npx supabase functions deploy auditar-pdf
```

### Paso 5: Verificar

Después del despliegue, deberías poder usar la aplicación normalmente.

---

## Opción 2: Usar Supabase Local (Para desarrollo)

Si prefieres trabajar localmente sin desplegar:

### Paso 1: Iniciar Supabase localmente

```bash
npx supabase start
```

Esto iniciará Supabase en Docker localmente.

### Paso 2: Actualizar tu .env

Cuando Supabase local inicie, te dará URLs locales. Actualiza tu `.env`:

```env
VITE_SUPABASE_URL=http://localhost:54321
VITE_SUPABASE_ANON_KEY=la-clave-que-te-dio-supabase-start
```

### Paso 3: Reiniciar el servidor de desarrollo

```bash
# Detén npm run dev (Ctrl+C)
npm run dev
```

---

## Opción 3: Solución Rápida - Modificar CORS en Supabase Dashboard

Si ya desplegaste la función pero sigue fallando:

1. Ve a https://supabase.com/dashboard
2. Selecciona tu proyecto
3. Ve a Settings → API
4. En "CORS Configuration", agrega:
   ```
   http://localhost:5173
   ```
5. Guarda los cambios

---

## ¿Cuál opción elegir?

- **Para producción**: Opción 1 (Desplegar)
- **Para desarrollo rápido**: Opción 2 (Local)
- **Si ya desplegaste**: Opción 3 (Configurar CORS)

## Verificar que funcionó

Después de aplicar cualquier opción:

1. Reinicia el servidor de desarrollo
2. Abre http://localhost:5173/
3. Intenta subir un PDF
4. Deberías ver en la consola:
   ```
   📄 Extrayendo texto del PDF...
   ✅ Texto extraído, longitud: XXXX
   🚀 Enviando a Edge Function: https://...
   📡 Response status: 200
   ✅ Resultado recibido: {...}
   ```

Si ves "Response status: 200", ¡funcionó! 🎉
