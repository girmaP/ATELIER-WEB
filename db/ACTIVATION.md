# Activación de Alborán

Estado: implementación preparada; requiere seleccionar un proyecto Supabase dedicado. No reutilizar bases de GFactu u otras webs sin autorización.

1. Crear el proyecto en la cuenta/organización elegida y revisar el coste. Ejecutar schema.sql una vez. pgcrypto debe estar disponible en el esquema extensions (configuración estándar de Supabase).
2. Configurar Auth Site URL https://fontaneria-alboran.vercel.app y Redirect URLs https://fontaneria-alboran.vercel.app/admin y https://fontaneria-alboran.vercel.app/admin?recovery=1. Configurar SMTP de producción antes de entregar el acceso, comprobar correos de confirmación y recuperación. No cambiar la configuración Auth de otro proyecto.
3. Autorizar el correo del propietario con INSERT INTO private.alboran_invites(email) VALUES ('correo-autorizado') ON CONFLICT DO NOTHING. No se ha invitado al cliente ni creado contraseñas.
4. Configurar ALBORAN_SUPABASE_URL y ALBORAN_SUPABASE_PUBLISHABLE_KEY en Vercel. Generar ALBORAN_CONTACT_SECRET aleatorio de 32 bytes o más, guardarlo como secreto de Vercel y guardar solo su SHA256 en private.alboran_contact_config. Nunca incluirlo en Git.
5. Activar el acceso desde /admin, confirmar el correo y entrar. Verificar usuario autorizado y usuario sin permisos. Probar salida, caducidad, recuperación y cambio de contraseña.
6. Verificar CRUD de consultas, agenda, servicios, proyectos y notas; confirmar RLS con anon y usuario ajeno, carga y borrado de imágenes, contenidos publicados y ocultos, y cambio visible en la web.
7. Completar la información legal y de privacidad del responsable antes de activar recogida de datos. Activar ALBORAN_CONTACT_SECRET al terminar; sin él la web conserva la consulta por WhatsApp. Probar formulario -> RPC -> consulta del panel y límite por IP (5/hora).
8. Desplegar el commit verificado en producción. La configuración pública contiene únicamente URL y clave publicable. No existe endpoint público para crear administradores ni cambiar permisos.

Seguridad: RLS activada; autorización por pertenencia a alboran_admins; invitaciones aceptables solo por usuarios verificados; notas por usuario; lectura pública de contenido publicado; escritura de contactos exclusivamente mediante RPC con secreto del servidor y límite en BD. Los datos privados no se incluyen en HTML. Al cerrar sesión se vacía el estado en memoria. Subidas limitadas a JPEG/PNG/WebP y 5 MB. Todo fichero de galería tiene URL pública: subir solo imágenes publicables. Borradores no se incluyen en la página pública, pero no son un almacén de ficheros confidenciales.
