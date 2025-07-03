
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const payload = await req.json();
    
    // Vérifier si c'est un webhook de changement de statut
    if (payload.type !== 'UPDATE' || payload.table !== 'orders') {
      return new Response(JSON.stringify({ message: 'Not a relevant update' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    const { record: newRecord, old_record: oldRecord } = payload;
    
    // Vérifier si le statut a changé
    if (newRecord.status === oldRecord.status) {
      return new Response(JSON.stringify({ message: 'Status unchanged' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    let emailType: 'validation' | 'delivery' | null = null;

    // Déterminer quel type d'email envoyer
    if (newRecord.status === 'validated' && oldRecord.status === 'pending') {
      emailType = 'validation';
    } else if (newRecord.status === 'delivered' && oldRecord.status !== 'delivered') {
      emailType = 'delivery';
    }

    if (emailType) {
      // Appeler la fonction d'envoi d'email
      const { error } = await supabaseAdmin.functions.invoke('send-order-emails', {
        body: {
          orderId: newRecord.id,
          emailType: emailType
        }
      });

      if (error) {
        console.error('Erreur lors de l\'envoi de l\'email:', error);
        throw error;
      }

      console.log(`Email ${emailType} déclenché pour la commande ${newRecord.id}`);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Trigger traité avec succès',
        emailSent: !!emailType
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );

  } catch (error: any) {
    console.error('Erreur dans order-status-trigger:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Erreur inconnue',
        success: false 
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }
});
