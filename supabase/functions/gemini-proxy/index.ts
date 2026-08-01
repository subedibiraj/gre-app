import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// CORS Headers for browser requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // 1. Verify User is Authenticated via Supabase
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Missing Authorization header' }), { 
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      })
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    const supabase = createClient(supabaseUrl, supabaseKey)

    const { data: { user }, error: userError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    )

    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { 
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      })
    }

    // 2. Fetch User's Plan from database
    // Only Pro users (or admin bypass) can use the proxy
    const { data: progress } = await supabase
      .from('user_progress')
      .select('plan, plan_expires')
      .eq('user_id', user.id)
      .single()

    const isPro = progress?.plan === 'pro' && (!progress?.plan_expires || new Date(progress.plan_expires) > new Date())
    const isAdmin = user.email === 'biraj.077bct031@acem.edu.np'

    if (!isPro && !isAdmin) {
      return new Response(JSON.stringify({ error: 'Payment Required: This feature requires a Pro subscription.' }), { 
        status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      })
    }

    // 3. Parse the Request Body for Gemini
    const { contents, systemInstruction, model = 'gemini-3.5-flash-lite' } = await req.json()

    if (!contents) {
      return new Response(JSON.stringify({ error: 'Missing request body (contents)' }), { 
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      })
    }

    // 4. Hit the actual Google Gemini API
    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY')
    if (!GEMINI_API_KEY) {
      throw new Error('Server configuration error: Missing GEMINI_API_KEY')
    }

    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents, systemInstruction })
    })

    const geminiData = await res.json()

    if (!res.ok) {
      console.error('Gemini API Error:', geminiData)
      return new Response(JSON.stringify({ error: 'Gemini API Error', details: geminiData }), {
        status: res.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // 5. Return the payload safely to the client
    return new Response(JSON.stringify(geminiData), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    console.error('Proxy Error:', error.message)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
