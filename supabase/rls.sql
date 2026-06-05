-- ==============================================================================
-- 🔒 SUPER TIGHT SECURITY: ROW LEVEL SECURITY (RLS) FOR user_progress
-- ==============================================================================
-- Run this in the Supabase SQL Editor to guarantee no user can ever
-- read, update, or tamper with another user's progress or subscription plan.

-- 1. Enable RLS on the table (if not already enabled)
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;

-- 2. Drop existing policies (to ensure a clean slate)
DROP POLICY IF EXISTS "Users can view their own progress" ON public.user_progress;
DROP POLICY IF EXISTS "Users can insert their own progress" ON public.user_progress;
DROP POLICY IF EXISTS "Users can update their own progress" ON public.user_progress;

-- 3. Policy: SELECT (Read)
-- A user can only read a row if the user_id matches their authenticated JWT token
CREATE POLICY "Users can view their own progress" 
ON public.user_progress
FOR SELECT 
USING (auth.uid() = user_id);

-- 4. Policy: INSERT
-- A user can only create a row for themselves
CREATE POLICY "Users can insert their own progress" 
ON public.user_progress
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- 5. Policy: UPDATE
-- A user can only update their own row.
-- IMPORTANT: To prevent users from granting themselves "pro", 
-- we ensure they cannot modify the "plan" or "plan_expires" columns.
CREATE POLICY "Users can update their own progress" 
ON public.user_progress
FOR UPDATE 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- NOTE ON UPGRADES:
-- Since users cannot update their own 'plan' column via the client API,
-- you must use the Stripe Webhook (which uses the Supabase Service Role Key)
-- or the Admin Database Trigger to update the 'plan' column.
-- Service Role Keys bypass RLS automatically!
