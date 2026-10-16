-- Apply to the dedicated Alborán project. No changes to other applications.
begin;
create schema if not exists private;
create extension if not exists pgcrypto with schema extensions;
revoke all on schema private from public, anon;
create table public.alboran_admins (user_id uuid primary key references auth.users(id) on delete cascade, created_at timestamptz not null default now());
create table private.alboran_invites (email text primary key check(email=lower(email)),created_at timestamptz not null default now());
create table private.alboran_contact_config (id boolean primary key default true check(id), secret_hash text not null);
create table private.alboran_contact_limits (client_hash text primary key, window_start timestamptz not null, requests integer not null);
alter table public.alboran_admins enable row level security;
alter table private.alboran_invites enable row level security;
alter table private.alboran_contact_config enable row level security;
alter table private.alboran_contact_limits enable row level security;
create or replace function private.alboran_is_admin() returns boolean language sql stable security definer set search_path='' as $$ select exists(select 1 from public.alboran_admins where user_id=(select auth.uid())) $$;
revoke all on function private.alboran_is_admin() from public,anon;
grant usage on schema private to authenticated;
grant execute on function private.alboran_is_admin() to authenticated;
create policy admin_self on public.alboran_admins for select to authenticated using(user_id=(select auth.uid()));
grant select on public.alboran_admins to authenticated;
create or replace function public.alboran_accept_invite() returns boolean language plpgsql security definer set search_path='' as $$
declare v_email text;
begin
 if auth.uid() is null then return false;end if;
 select lower(email) into v_email from auth.users where id=auth.uid() and email_confirmed_at is not null;
 if v_email is not null and exists(select 1 from private.alboran_invites where email=v_email) then
  insert into public.alboran_admins(user_id) values(auth.uid()) on conflict do nothing;
  delete from private.alboran_invites where email=v_email;
 end if;
 return private.alboran_is_admin();
end;$$;
revoke all on function public.alboran_accept_invite() from public,anon;
grant execute on function public.alboran_accept_invite() to authenticated;
create table public.alboran_settings (id boolean primary key default true check(id),name text not null check(char_length(name) between 1 and 100),phone text not null check(phone ~ '^\+[0-9]{8,15}$'),instagram text not null default '' check(instagram ~ '^[A-Za-z0-9_.]{0,50}$'),town text not null check(char_length(town)<150),hero_title text not null check(char_length(hero_title)<150),hero_text text not null check(char_length(hero_text)<500),updated_at timestamptz not null default now());
create table public.alboran_services (id uuid primary key default gen_random_uuid(),slug text not null unique check(slug ~ '^[a-z0-9-]{1,60}$'),title text not null check(char_length(title) between 1 and 120),tagline text not null check(char_length(tagline)<180),description text not null check(char_length(description)<2000),items text[] not null default '{}',published boolean not null default true,position integer not null default 0,updated_at timestamptz not null default now(),check(cardinality(items)<=20));
create table public.alboran_projects (id uuid primary key default gen_random_uuid(),title text not null check(char_length(title) between 1 and 120),description text not null check(char_length(description)<2000),image_path text not null check(char_length(image_path)<300),published boolean not null default false,position integer not null default 0,updated_at timestamptz not null default now());
create table public.alboran_leads (id uuid primary key default gen_random_uuid(),name text not null check(char_length(name) between 1 and 100),email text not null default '' check(char_length(email)<254),phone text not null default '' check(char_length(phone)<40),town text not null check(char_length(town) between 1 and 150),service text not null check(char_length(service)<120),message text not null check(char_length(message) between 1 and 3000),status text not null default 'Nueva' check(status in ('Nueva','En revisión','Presupuestada','Cerrada','Archivada')),notes text not null default '' check(char_length(notes)<5000),created_at timestamptz not null default now(),updated_at timestamptz not null default now());
create index alboran_leads_created on public.alboran_leads(created_at desc);
create table public.alboran_tasks (id uuid primary key default gen_random_uuid(),title text not null check(char_length(title) between 1 and 180),due_at timestamptz not null,status text not null default 'Pendiente' check(status in ('Pendiente','En curso','Completada','Cancelada')),lead_id uuid references public.alboran_leads(id) on delete set null,notes text not null default '' check(char_length(notes)<3000),created_at timestamptz not null default now(),updated_at timestamptz not null default now());
create index alboran_tasks_due on public.alboran_tasks(due_at);
create table public.alboran_notes (user_id uuid primary key references auth.users(id) on delete cascade,body text not null default '' check(char_length(body)<20000),updated_at timestamptz not null default now());
create table public.alboran_activity (id bigint generated always as identity primary key,actor uuid,action text not null,record_id text,created_at timestamptz not null default now());
create or replace function private.alboran_stamp() returns trigger language plpgsql set search_path='' as $$begin new.updated_at=now();return new;end$$;
create or replace function private.alboran_audit() returns trigger language plpgsql security definer set search_path='' as $$begin insert into public.alboran_activity(actor,action,record_id) values(auth.uid(),tg_op||' '||tg_table_name,case when tg_op='DELETE' then to_jsonb(old)->>'id' else to_jsonb(new)->>'id' end);return null;end$$;
revoke all on function private.alboran_audit() from public,anon,authenticated;
revoke all on function private.alboran_stamp() from public,anon,authenticated;
do $$declare t text;begin
 foreach t in array array['alboran_settings','alboran_services','alboran_projects','alboran_leads','alboran_tasks'] loop
 execute format('alter table public.%I enable row level security',t);
 execute format('create policy admin_all on public.%I for all to authenticated using (private.alboran_is_admin()) with check (private.alboran_is_admin())',t);
 execute format('grant select,insert,update,delete on public.%I to authenticated',t);
 execute format('create trigger stamp before update on public.%I for each row execute function private.alboran_stamp()',t);
 execute format('create trigger audit after insert or update or delete on public.%I for each row execute function private.alboran_audit()',t);
 end loop;
end$$;
create policy public_settings on public.alboran_settings for select to anon using(true);
create policy public_services on public.alboran_services for select to anon using(published);
create policy public_projects on public.alboran_projects for select to anon using(published);
-- Logged-in non-admins have the same public read access, never private data.
create policy visible_services on public.alboran_services for select to authenticated using(published);
create policy visible_projects on public.alboran_projects for select to authenticated using(published);
create policy visible_settings on public.alboran_settings for select to authenticated using(true);
grant select on public.alboran_settings,public.alboran_services,public.alboran_projects to anon;
alter table public.alboran_notes enable row level security;
create policy own_notes on public.alboran_notes for all to authenticated using(user_id=(select auth.uid()) and private.alboran_is_admin()) with check(user_id=(select auth.uid()) and private.alboran_is_admin());
grant select,insert,update,delete on public.alboran_notes to authenticated;
create trigger stamp before update on public.alboran_notes for each row execute function private.alboran_stamp();
alter table public.alboran_activity enable row level security;
create policy audit_read on public.alboran_activity for select to authenticated using(private.alboran_is_admin());
grant select on public.alboran_activity to authenticated;
revoke all on public.alboran_admins,public.alboran_leads,public.alboran_tasks,public.alboran_notes,public.alboran_activity from anon;
create or replace function public.alboran_submit_lead(p_secret text,p_client_hash text,p_name text,p_email text,p_phone text,p_town text,p_service text,p_message text) returns uuid language plpgsql security definer set search_path='' as $$
declare v_id uuid;v_count integer;
begin
 if p_secret is null or not exists(select 1 from private.alboran_contact_config where secret_hash=encode(extensions.digest(p_secret,'sha256'),'hex')) then raise exception 'not_allowed';end if;
 if p_client_hash !~ '^[a-f0-9]{64}$' then raise exception 'invalid_client';end if;
 insert into private.alboran_contact_limits(client_hash,window_start,requests) values(p_client_hash,now(),1)
 on conflict(client_hash) do update set requests=case when private.alboran_contact_limits.window_start<now()-interval '1 hour' then 1 else private.alboran_contact_limits.requests+1 end,window_start=case when private.alboran_contact_limits.window_start<now()-interval '1 hour' then now() else private.alboran_contact_limits.window_start end returning requests into v_count;
 if v_count>5 then return null;end if;
 delete from private.alboran_contact_limits where window_start<now()-interval '7 days';
 insert into public.alboran_leads(name,email,phone,town,service,message) values(trim(p_name),trim(p_email),trim(p_phone),trim(p_town),trim(p_service),trim(p_message)) returning id into v_id;
 return v_id;
end$$;
revoke all on function public.alboran_submit_lead(text,text,text,text,text,text,text,text) from public,authenticated;
grant execute on function public.alboran_submit_lead(text,text,text,text,text,text,text,text) to anon;
insert into public.alboran_settings values(true,'Fontanería Alborán','+34624223069','fontaneria_alboran','Almería','Que todo vuelva a fluir.','Fontanería en Almería. Soluciones para tu hogar, con las cosas claras desde el principio.',now());
insert into public.alboran_services(slug,title,tagline,description,items,position) values
('reparaciones','Reparaciones','Una fuga no tiene por qué complicarte el día.','Grifos que gotean, cisternas que pierden agua y conexiones que necesitan una revisión. Cuéntanos qué ocurre para valorar la reparación.',array['Fugas y filtraciones','Grifería y cisternas','Llaves de paso'],0),
('instalaciones','Instalaciones','Lo que no se ve también importa.','Planifica la instalación de agua y saneamiento de tu vivienda o local. Revisamos contigo las necesidades del espacio y los puntos de conexión.',array['Tuberías y conexiones','Sanitarios','Redes de agua'],1),
('banos-cocinas','Baños y cocinas','Un espacio que funciona mejor.','Cambiar un lavabo, renovar una ducha o adaptar las tomas de una cocina. Estudiaremos el alcance antes de proponerte una solución.',array['Cambio de sanitarios','Grifería de baño y cocina','Adaptación de tomas'],2),
('mantenimiento','Mantenimiento','Cuidar hoy. Evitar problemas mañana.','Consulta una revisión de los elementos de fontanería de tu hogar, local o comunidad y detecta los puntos que necesitan atención.',array['Revisión de conexiones','Comprobación de pérdidas','Puesta a punto'],3);
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types) values('alboran-gallery','alboran-gallery',true,5242880,array['image/jpeg','image/png','image/webp']);
create policy alboran_images_read on storage.objects for select to anon,authenticated using(bucket_id='alboran-gallery');
create policy alboran_images_insert on storage.objects for insert to authenticated with check(bucket_id='alboran-gallery' and private.alboran_is_admin());
create policy alboran_images_update on storage.objects for update to authenticated using(bucket_id='alboran-gallery' and private.alboran_is_admin()) with check(bucket_id='alboran-gallery' and private.alboran_is_admin());
create policy alboran_images_delete on storage.objects for delete to authenticated using(bucket_id='alboran-gallery' and private.alboran_is_admin());
commit;
