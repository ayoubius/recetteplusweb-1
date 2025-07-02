
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // Vérifier s'il y a déjà un admin
    const { data: existingAdmin } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('role', 'admin')
      .limit(1)
      .single()

    if (existingAdmin) {
      return new Response(
        JSON.stringify({ message: 'Admin already exists' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      )
    }

    // Créer un utilisateur admin par défaut
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: 'admin@recetteplus.com',
      password: 'AdminRecettePlus2024!',
      email_confirm: true,
      user_metadata: {
        display_name: 'Administrateur',
        full_name: 'Administrateur'
      }
    })

    if (authError) {
      console.error('Error creating admin user:', authError)
      throw authError
    }

    // Mettre à jour le profil pour le rendre admin
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .update({ role: 'admin' })
      .eq('id', authData.user.id)

    if (profileError) {
      console.error('Error updating profile to admin:', profileError)
      throw profileError
    }

    return new Response(
      JSON.stringify({ 
        message: 'Admin user created successfully',
        email: 'admin@recetteplus.com',
        password: 'AdminRecettePlus2024!'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    )
  }
})
