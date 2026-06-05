-- Run this in the Supabase SQL Editor to schedule the daily-emails edge function to run every morning at 8:00 AM UTC.
-- Make sure to replace YOUR_PROJECT_REF with your actual Supabase project reference ID.

select
  cron.schedule(
    'daily-emails-job',
    '0 8 * * *', -- Run every day at 8:00 AM UTC
    $$
    select
      net.http_post(
          url:='https://YOUR_PROJECT_REF.supabase.co/functions/v1/daily-emails',
          headers:='{"Content-Type": "application/json", "Authorization": "Bearer YOUR_SERVICE_ROLE_KEY"}'::jsonb
      ) as request_id;
    $$
  );
