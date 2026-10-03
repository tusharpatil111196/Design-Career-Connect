import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
};

Deno.serve(async request => {
  if (request.method === 'OPTIONS') {
    return new Response('ok', {headers: corsHeaders});
  }

  if (request.method !== 'POST') {
    return Response.json({error: 'Method not allowed'}, {status: 405, headers: corsHeaders});
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const anonKey = Deno.env.get('SUPABASE_ANON_KEY');
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  const authorization = request.headers.get('Authorization');

  if (!supabaseUrl || !anonKey || !serviceRoleKey || !authorization) {
    return Response.json({error: 'Server configuration is incomplete.'}, {status: 500, headers: corsHeaders});
  }

  const callerClient = createClient(supabaseUrl, anonKey, {
    global: {headers: {Authorization: authorization}}
  });
  const {data: userData, error: authError} = await callerClient.auth.getUser();
  if (authError || !userData.user) {
    return Response.json({error: 'Sign in is required.'}, {status: 401, headers: corsHeaders});
  }

  const adminClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: {autoRefreshToken: false, persistSession: false}
  });
  const {data: callerProfile, error: profileError} = await adminClient
    .from('profiles')
    .select('role')
    .eq('id', userData.user.id)
    .single();

  if (profileError || callerProfile.role !== 'admin') {
    return Response.json({error: 'Admin access is required.'}, {status: 403, headers: corsHeaders});
  }

  let body: Record<string, string>;
  try {
    body = await request.json();
  } catch {
    return Response.json({error: 'Invalid request body.'}, {status: 400, headers: corsHeaders});
  }

  const email = body.email?.trim().toLowerCase();
  const password = body.password || '';
  const fullName = body.full_name?.trim();
  if (!email || !fullName || password.length < 8) {
    return Response.json({error: 'Name, email, and a password of at least 8 characters are required.'}, {status: 400, headers: corsHeaders});
  }

  const {data: created, error: createError} = await adminClient.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {full_name: fullName}
  });
  if (createError || !created.user) {
    return Response.json({error: createError?.message || 'Could not create the account.'}, {status: 400, headers: corsHeaders});
  }

  const {error: updateError} = await adminClient.from('profiles').update({
    full_name: fullName,
    phone: body.phone || '',
    location: body.location || '',
    qualification: body.qualification || '',
    experience: body.experience || '',
    skills: body.skills || '',
    resume_url: body.resume_url || ''
  }).eq('id', created.user.id);

  if (updateError) {
    await adminClient.auth.admin.deleteUser(created.user.id);
    return Response.json({error: 'Account setup failed; the new account was removed.'}, {status: 500, headers: corsHeaders});
  }

  return Response.json({id: created.user.id, email}, {status: 201, headers: corsHeaders});
});
