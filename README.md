# Fontanería Alborán

Web multipágina estática y panel privado con Supabase Auth, Postgres y Storage. Backend HTTP mediante Vercel Functions nativas de Node 24. SDK oficial Supabase JS 2.118.0 empaquetado localmente en assets/vendor; sin dependencias en tiempo de instalación.

## Estado
La implementación del panel está preparada en la rama fontaneria-alboran-admin. La activación depende de elegir la organización Supabase, provisionar un proyecto dedicado y configurar Auth, SMTP, permisos y variables. No se han creado cuentas de cliente ni contraseñas. No activar el formulario persistente hasta completar la información de privacidad y responsable.

## Funciones
- Inicio de sesión, verificación de cuenta autorizada, recuperación y cambio de contraseña, cierre local y global de sesiones.
- Consultas con estados, búsqueda, edición y exportación CSV protegida frente a fórmulas.
- Agenda con fecha, hora, estados y vinculación a consulta.
- Servicios editables con orden y publicación.
- Galería con subidas JPEG/PNG/WebP de hasta 5 MB y publicación.
- Datos del negocio y portada conectados a la web, notas privadas y registro de actividad.
- Contacto con validación en servidor y RPC restringida mediante secreto, cuota de cinco consultas por IP/hora y sin lectura anónima de datos privados.

## Activación y pruebas
Consultar db/ACTIVATION.md y db/schema.sql. Ejecutar `npm run check` y `npm test`. Esas pruebas verifican los contratos de API con un proveedor simulado; no sustituyen las comprobaciones de Auth, RLS, persistencia y Storage en la base real.

## Variables
ALBORAN_SUPABASE_URL y ALBORAN_SUPABASE_PUBLISHABLE_KEY: configuración publicable.
ALBORAN_CONTACT_SECRET: solo servidor; su SHA256 se guarda en private.alboran_contact_config. No usar service_role en cliente ni subir secretos a Git.

## Recursos visuales
Unsplash: photo-1620626011761-996317b8d101, photo-1600566753086-00f18fb6b3ea, photo-1556912172-45b7abe8b7e1, photo-1584622650111-993a426fbf0a. Google Fonts: DM Sans y Manrope. Logo SVG propuesto para la marca.
