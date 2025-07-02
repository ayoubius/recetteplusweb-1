
import React from 'react';

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  image?: string;
}

interface OrderConfirmationEmailProps {
  userName: string;
  orderNumber: string;
  orderDate: string;
  items: OrderItem[];
  totalAmount: number;
  deliveryAddress: string;
  estimatedDelivery: string;
  logoUrl?: string;
}

export const OrderConfirmationEmail = ({ 
  userName, 
  orderNumber, 
  orderDate,
  items,
  totalAmount,
  deliveryAddress,
  estimatedDelivery,
  logoUrl 
}: OrderConfirmationEmailProps) => {
  const defaultLogoUrl = "https://via.placeholder.com/150x60/F97316/FFFFFF?text=Recette%2B";
  
  return (
    <div style={{
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      maxWidth: '650px',
      margin: '0 auto',
      backgroundColor: '#ffffff',
      borderRadius: '12px',
      overflow: 'hidden',
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
    }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
        padding: '40px 30px',
        textAlign: 'center'
      }}>
        <img 
          src={logoUrl || defaultLogoUrl} 
          alt="Recette+" 
          style={{
            height: '60px',
            marginBottom: '20px'
          }}
        />
        <div style={{
          backgroundColor: 'rgba(255,255,255,0.2)',
          borderRadius: '50px',
          padding: '15px',
          display: 'inline-block',
          marginBottom: '15px'
        }}>
          <div style={{ fontSize: '40px' }}>✅</div>
        </div>
        <h1 style={{
          color: '#ffffff',
          fontSize: '28px',
          fontWeight: 'bold',
          margin: '0',
          textShadow: '0 2px 4px rgba(0,0,0,0.2)'
        }}>
          Commande confirmée !
        </h1>
      </div>

      {/* Content */}
      <div style={{ padding: '40px 30px' }}>
        <h2 style={{
          color: '#10B981',
          fontSize: '24px',
          marginBottom: '15px',
          fontWeight: '600'
        }}>
          Merci {userName} ! 🎉
        </h2>

        <p style={{
          color: '#374151',
          fontSize: '16px',
          lineHeight: '1.6',
          marginBottom: '30px'
        }}>
          Votre commande a été confirmée et sera préparée avec soin. Vous recevrez bientôt vos 
          ingrédients frais pour concocter de délicieuses recettes !
        </p>

        {/* Order Details */}
        <div style={{
          backgroundColor: '#F0FDF4',
          border: '2px solid #10B981',
          borderRadius: '12px',
          padding: '25px',
          marginBottom: '30px'
        }}>
          <h3 style={{
            color: '#10B981',
            fontSize: '18px',
            fontWeight: '600',
            margin: '0 0 20px 0'
          }}>
            📋 Détails de la commande
          </h3>
          
          <div style={{ marginBottom: '15px' }}>
            <strong style={{ color: '#374151' }}>Numéro de commande:</strong> {orderNumber}
          </div>
          <div style={{ marginBottom: '15px' }}>
            <strong style={{ color: '#374151' }}>Date:</strong> {orderDate}
          </div>
          <div style={{ marginBottom: '15px' }}>
            <strong style={{ color: '#374151' }}>Livraison estimée:</strong> {estimatedDelivery}
          </div>
          <div>
            <strong style={{ color: '#374151' }}>Adresse de livraison:</strong><br/>
            {deliveryAddress}
          </div>
        </div>

        {/* Order Items */}
        <div style={{ marginBottom: '30px' }}>
          <h3 style={{
            color: '#374151',
            fontSize: '18px',
            fontWeight: '600',
            marginBottom: '20px'
          }}>
            🛒 Vos articles
          </h3>
          
          {items.map((item, index) => (
            <div key={item.id} style={{
              display: 'flex',
              alignItems: 'center',
              padding: '15px 0',
              borderBottom: index < items.length - 1 ? '1px solid #E5E7EB' : 'none'
            }}>
              {item.image && (
                <img 
                  src={item.image} 
                  alt={item.name}
                  style={{
                    width: '60px',
                    height: '60px',
                    objectFit: 'cover',
                    borderRadius: '8px',
                    marginRight: '15px'
                  }}
                />
              )}
              <div style={{ flex: '1' }}>
                <div style={{
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '5px'
                }}>
                  {item.name}
                </div>
                <div style={{
                  color: '#6B7280',
                  fontSize: '14px'
                }}>
                  Quantité: {item.quantity}
                </div>
              </div>
              <div style={{
                fontWeight: '600',
                color: '#10B981',
                fontSize: '16px'
              }}>
                {item.price.toFixed(2)} €
              </div>
            </div>
          ))}
          
          <div style={{
            textAlign: 'right',
            marginTop: '20px',
            paddingTop: '20px',
            borderTop: '2px solid #E5E7EB'
          }}>
            <div style={{
              fontSize: '20px',
              fontWeight: 'bold',
              color: '#10B981'
            }}>
              Total: {totalAmount.toFixed(2)} €
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div style={{
          backgroundColor: '#FEF3E2',
          border: '1px solid #F59E0B',
          borderRadius: '8px',
          padding: '20px',
          marginBottom: '30px'
        }}>
          <h3 style={{
            color: '#F59E0B',
            fontSize: '16px',
            fontWeight: '600',
            margin: '0 0 15px 0'
          }}>
            📦 Prochaines étapes
          </h3>
          <ul style={{
            color: '#374151',
            paddingLeft: '20px',
            margin: '0'
          }}>
            <li style={{ marginBottom: '8px' }}>Préparation de votre commande (24h)</li>
            <li style={{ marginBottom: '8px' }}>Expédition avec suivi par email</li>
            <li style={{ marginBottom: '8px' }}>Livraison à domicile</li>
            <li>Cuisinez et régalez-vous ! 🍽️</li>
          </ul>
        </div>

        <div style={{ textAlign: 'center' }}>
          <a href="#" style={{
            display: 'inline-block',
            backgroundColor: '#F97316',
            color: '#ffffff',
            padding: '15px 30px',
            borderRadius: '8px',
            textDecoration: 'none',
            fontWeight: 'bold',
            fontSize: '16px',
            marginRight: '15px'
          }}>
            📱 Suivre ma commande
          </a>
          <a href="#" style={{
            display: 'inline-block',
            backgroundColor: 'transparent',
            color: '#10B981',
            padding: '15px 30px',
            borderRadius: '8px',
            textDecoration: 'none',
            fontWeight: 'bold',
            fontSize: '16px',
            border: '2px solid #10B981'
          }}>
            🍽️ Voir les recettes
          </a>
        </div>
      </div>

      {/* Footer */}
      <div style={{
        backgroundColor: '#F9FAFB',
        padding: '30px',
        textAlign: 'center',
        borderTop: '1px solid #E5E7EB'
      }}>
        <p style={{
          color: '#6B7280',
          fontSize: '14px',
          margin: '0 0 15px 0'
        }}>
          Des questions ? Contactez notre service client à support@recetteplus.com
        </p>
        <p style={{
          color: '#9CA3AF',
          fontSize: '12px',
          margin: '0'
        }}>
          © 2024 Recette+ - Tous droits réservés<br/>
          Merci de faire confiance à Recette+ pour vos achats d'ingrédients !
        </p>
      </div>
    </div>
  );
};

export default OrderConfirmationEmail;
