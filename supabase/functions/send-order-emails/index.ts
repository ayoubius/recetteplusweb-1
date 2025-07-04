
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface EmailData {
  orderId: string;
  userEmail: string;
  userName: string;
  orderItems: any[];
  totalAmount: number;
  emailType: 'validation' | 'delivery';
  orderNumber: string;
}

const sendEmail = async (emailData: EmailData) => {
  const { orderId, userEmail, userName, orderItems, totalAmount, emailType, orderNumber } = emailData;
  
  const smtpServer = Deno.env.get('BREVO_SMTP_SERVER');
  const smtpPort = Deno.env.get('BREVO_PORT');
  const smtpLogin = Deno.env.get('BREVO_LOGIN');
  const smtpPassword = Deno.env.get('BREVO_PASSWORD');

  if (!smtpServer || !smtpPort || !smtpLogin || !smtpPassword) {
    throw new Error('Configuration SMTP manquante');
  }

  const subject = emailType === 'validation' 
    ? `Commande validée #${orderNumber}` 
    : `Commande livrée #${orderNumber}`;

  const htmlContent = emailType === 'validation' 
    ? getValidationEmailHTML(userName, orderNumber, orderItems, totalAmount)
    : getDeliveryEmailHTML(userName, orderNumber, orderItems, totalAmount);

  // Configuration de l'email
  const emailConfig = {
    from: smtpLogin,
    to: userEmail,
    subject: subject,
    html: htmlContent
  };

  // Envoi via l'API Brevo
  const response = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': smtpPassword // Brevo utilise la clé API dans les headers
    },
    body: JSON.stringify({
      sender: { email: smtpLogin, name: 'Recette+' },
      to: [{ email: userEmail, name: userName }],
      subject: subject,
      htmlContent: htmlContent
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Erreur envoi email: ${error}`);
  }

  return await response.json();
};

const getValidationEmailHTML = (userName: string, orderNumber: string, items: any[], total: number) => {
  const itemsHTML = items.map(item => {
    const itemName = item.name || item.product_name || 'Produit';
    const itemQuantity = item.quantity || 1;
    const itemPrice = item.price || item.unit_price || 0;
    
    return `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">${itemName}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${itemQuantity}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">${itemPrice} FCFA</td>
      </tr>
    `;
  }).join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Commande Validée</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #10B981 0%, #059669 100%); padding: 40px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 28px;">✅ Commande Validée !</h1>
      </div>
      
      <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
        <h2 style="color: #10B981; margin-bottom: 20px;">Bonjour ${userName} ! 🎉</h2>
        
        <p style="margin-bottom: 20px;">
          Excellente nouvelle ! Votre commande <strong>#${orderNumber}</strong> a été validée et est maintenant en cours de préparation.
        </p>
        
        <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10B981;">
          <h3 style="color: #10B981; margin-top: 0;">📋 Détails de votre commande</h3>
          
          <table style="width: 100%; border-collapse: collapse; margin: 15px 0;">
            <thead>
              <tr style="background: #f8f9fa;">
                <th style="padding: 10px; text-align: left; border-bottom: 2px solid #ddd;">Produit</th>
                <th style="padding: 10px; text-align: center; border-bottom: 2px solid #ddd;">Qté</th>
                <th style="padding: 10px; text-align: right; border-bottom: 2px solid #ddd;">Prix</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHTML}
            </tbody>
          </table>
          
          <div style="text-align: right; margin-top: 20px; padding-top: 15px; border-top: 2px solid #10B981;">
            <strong style="font-size: 18px; color: #10B981;">Total: ${total} FCFA</strong>
          </div>
        </div>
        
        <div style="background: #fef3e2; padding: 15px; border-radius: 8px; border: 1px solid #f59e0b; margin: 20px 0;">
          <h4 style="color: #f59e0b; margin-top: 0;">📦 Prochaines étapes</h4>
          <ul style="margin: 10px 0; padding-left: 20px;">
            <li>Préparation de votre commande</li>
            <li>Attribution à un livreur</li>
            <li>Livraison à votre adresse</li>
            <li>Paiement à la livraison</li>
          </ul>
        </div>
        
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
          <p style="color: #666; font-size: 14px;">
            Merci de faire confiance à Recette+ pour vos achats d'ingrédients !<br>
            © 2025 Recette+ - Tous droits réservés
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
};

const getDeliveryEmailHTML = (userName: string, orderNumber: string, items: any[], total: number) => {
  const itemsHTML = items.map(item => {
    const itemName = item.name || item.product_name || 'Produit';
    const itemQuantity = item.quantity || 1;
    const itemPrice = item.price || item.unit_price || 0;
    
    return `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">${itemName}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${itemQuantity}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">${itemPrice} FCFA</td>
      </tr>
    `;
  }).join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Commande Livrée</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #059669 0%, #047857 100%); padding: 40px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 28px;">🚚 Commande Livrée !</h1>
      </div>
      
      <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
        <h2 style="color: #059669; margin-bottom: 20px;">Bonjour ${userName} ! 🎉</h2>
        
        <p style="margin-bottom: 20px;">
          Votre commande <strong>#${orderNumber}</strong> a été livrée avec succès ! 
          Nous espérons que vous êtes satisfait(e) de vos achats.
        </p>
        
        <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #059669;">
          <h3 style="color: #059669; margin-top: 0;">🧾 Reçu de votre commande</h3>
          
          <table style="width: 100%; border-collapse: collapse; margin: 15px 0;">
            <thead>
              <tr style="background: #f8f9fa;">
                <th style="padding: 10px; text-align: left; border-bottom: 2px solid #ddd;">Produit</th>
                <th style="padding: 10px; text-align: center; border-bottom: 2px solid #ddd;">Qté</th>
                <th style="padding: 10px; text-align: right; border-bottom: 2px solid #ddd;">Prix</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHTML}
            </tbody>
          </table>
          
          <div style="text-align: right; margin-top: 20px; padding-top: 15px; border-top: 2px solid #059669;">
            <strong style="font-size: 18px; color: #059669;">Total payé: ${total} FCFA</strong>
          </div>
        </div>
        
        <div style="background: #e0f2fe; padding: 15px; border-radius: 8px; border: 1px solid #0288d1; margin: 20px 0;">
          <h4 style="color: #0288d1; margin-top: 0;">👨‍🍳 Bon appétit !</h4>
          <p style="margin: 10px 0;">
            Nous espérons que vous allez préparer de délicieux plats avec vos ingrédients frais. 
            N'hésitez pas à consulter nos recettes pour vous inspirer !
          </p>
        </div>
        
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
          <p style="color: #666; font-size: 14px;">
            Merci de faire confiance à Recette+ !<br>
            À bientôt pour de nouvelles commandes.<br>
            © 2025 Recette+ - Tous droits réservés
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { orderId, emailType } = await req.json();
    
    if (!orderId || !emailType) {
      throw new Error('orderId et emailType sont requis');
    }

    // Initialiser le client Supabase
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Récupérer les détails de la commande
    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (orderError || !order) {
      throw new Error(`Commande non trouvée: ${orderError?.message}`);
    }

    // Récupérer le profil utilisateur
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('display_name, email')
      .eq('id', order.user_id)
      .single();

    if (profileError || !profile) {
      throw new Error(`Profil utilisateur non trouvé: ${profileError?.message}`);
    }

    if (!profile.email) {
      throw new Error('Email utilisateur non trouvé dans le profil');
    }

    // Enrichir les items avec les informations des produits
    let enrichedItems = [];
    
    if (Array.isArray(order.items)) {
      console.log('Items originaux de la commande:', order.items);
      
      // Pour chaque item de la commande, récupérer les détails du produit
      for (const item of order.items) {
        let enrichedItem = {
          name: item.name || item.product_name || 'Produit',
          quantity: item.quantity || 1,
          price: item.price || item.unit_price || 0
        };

        // Si on a un product_id, récupérer les détails du produit
        if (item.product_id) {
          try {
            const { data: product, error: productError } = await supabaseAdmin
              .from('products')
              .select('name, price')
              .eq('id', item.product_id)
              .single();

            if (product && !productError) {
              enrichedItem.name = product.name;
              enrichedItem.price = product.price;
              console.log(`Produit enrichi: ${product.name} - ${product.price} FCFA`);
            }
          } catch (productError) {
            console.log(`Impossible de récupérer le produit ${item.product_id}:`, productError);
          }
        }

        enrichedItems.push(enrichedItem);
      }
    } else {
      console.log('Items format inattendu:', order.items);
      enrichedItems = [{
        name: 'Produit',
        quantity: 1,
        price: order.total_amount || 0
      }];
    }

    console.log('Items enrichis pour email:', enrichedItems);

    const emailData: EmailData = {
      orderId: order.id,
      userEmail: profile.email,
      userName: profile.display_name || 'Client',
      orderItems: enrichedItems,
      totalAmount: order.total_amount,
      emailType: emailType,
      orderNumber: order.id.slice(0, 8).toUpperCase()
    };

    // Envoyer l'email
    const result = await sendEmail(emailData);
    
    console.log(`Email ${emailType} envoyé pour la commande ${orderId}:`, result);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Email ${emailType} envoyé avec succès`,
        result 
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );

  } catch (error: any) {
    console.error('Erreur dans send-order-emails:', error);
    
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
