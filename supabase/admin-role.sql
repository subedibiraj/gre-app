-- ==============================================================================
-- 👑 SERVER-SIDE ADMIN AUTO-UPGRADE TRIGGER
-- ==============================================================================
-- Run this in the Supabase SQL Editor.
-- This removes the need to hardcode the admin email in the frontend JavaScript!
-- When the admin logs in, the database will automatically grant them 'pro' status.

-- 1. Create the function that checks the email and updates the plan
CREATE OR REPLACE FUNCTION grant_admin_pro_status()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if the user's email matches the admin email
  IF NEW.email = 'biraj.077bct031@acem.edu.np' THEN
    
    -- Update the user_progress table for this user ID
    -- We use an UPSERT (INSERT ... ON CONFLICT) just in case the row 
    -- doesn't exist yet (though it usually gets created on first login).
    INSERT INTO public.user_progress (user_id, plan, plan_expires)
    VALUES (NEW.id, 'pro', NULL)
    ON CONFLICT (user_id) 
    DO UPDATE SET plan = 'pro', plan_expires = NULL;
    
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
-- 'SECURITY DEFINER' allows the trigger to bypass RLS, which is necessary
-- since it's running as the database admin, not the user.

-- 2. Drop the trigger if it already exists (to allow re-running this script)
DROP TRIGGER IF EXISTS on_auth_user_login ON auth.users;

-- 3. Attach the trigger to the auth.users table
-- We run this AFTER UPDATE to catch login events (last_sign_in_at changes)
-- or AFTER INSERT to catch the very first signup.
CREATE TRIGGER on_auth_user_login
AFTER INSERT OR UPDATE OF last_sign_in_at ON auth.users
FOR EACH ROW
EXECUTE FUNCTION grant_admin_pro_status();
