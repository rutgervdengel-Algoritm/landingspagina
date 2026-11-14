-- Elk uur verlopen voorstellen opruimen, ook als niemand de app opent.
create extension if not exists pg_cron;
select cron.schedule('verloop-voorstellen', '7 * * * *', $$select public.verloop_voorstellen()$$);
