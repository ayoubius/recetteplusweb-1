
import React from 'react';

interface PasswordResetEmailProps {
  userName: string;
  resetUrl: string;
  logoUrl?: string;
}

export const PasswordResetEmail = ({ userName, resetUrl, logoUrl }: PasswordResetEmailProps) => {
  const defaultLogoUrl = "https://via.placeholder.com/150x60/F97316/FFFFFF?text=Recette%2B";
  
  return (
    <div style={{
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      maxWidth: '600px',
      margin: '0 auto',
      backgroundColor: '#ffffff',
      borderRadius: '12px',
      overflow: 'hidden',
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
    }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #DC2626 0%, #B91C1C 100%)',
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
        <h1 style={{
          color: '#ffffff',
          fontSize: '28px',
          fontWeight: 'bold',
          margin: '0',
          textShadow: '0 2px 4px rgba(0,0,0,0.2)'
        }}>
          Réinitialisation de mot de passe
        </h1>
      </div>

      {/* Content */}
      <div style={{ padding: '40px 30px' }}>
        <div style={{
          backgroundColor: '#FEE2E2',
          border: '2px solid #DC2626',
          borderRadius: '8px',
          padding: '20px',
          marginBottom: '30px',
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: '48px',
            marginBottom: '15px'
          }}>🔐</div>
          <h2 style={{
            color: '#DC2626',
            fontSize: '20px',
            fontWeight: '600',
            margin: '0 0 10px 0'
          }}>
            Demande de réinitialisation
          </h2>
        </div>

        <p style={{
          color: '#374151',
          fontSize: '16px',
          lineHeight: '1.6',
          marginBottom: '20px'
        }}>
          Bonjour {userName},
        </p>

        <p style={{
          color: '#374151',
          fontSize: '16px',
          lineHeight: '1.6',
          marginBottom: '30px'
        }}>
          Nous avons reçu une demande de réinitialisation de mot de passe pour votre compte Recette+. 
          Si vous n'êtes pas à l'origine de cette demande, vous pouvez ignorer cet email en toute sécurité.
        </p>

        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <a href={resetUrl} style={{
            display: 'inline-block',
            backgroundColor: '#DC2626',
            color: '#ffffff',
            padding: '15px 30px',
            borderRadius: '8px',
            textDecoration: 'none',
            fontWeight: 'bold',
            fontSize: '16px',
            transition: 'all 0.3s ease'
          }}>
            🔑 Réinitialiser mon mot de passe
          </a>
        </div>

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
            margin: '0 0 10px 0'
          }}>
            ⚠️ Important
          </h3>
          <ul style={{
            color: '#374151',
            fontSize: '14px',
            paddingLeft: '20px',
            margin: '0'
          }}>
            <li style={{ marginBottom: '5px' }}>Ce lien expirera dans 24 heures</li>
            <li style={{ marginBottom: '5px' }}>Ne partagez jamais ce lien avec personne</li>
            <li style={{ marginBottom: '5px' }}>Si le lien ne fonctionne pas, copiez-collez l'URL dans votre navigateur</li>
          </ul>
        </div>

        <p style={{
          color: '#6B7280',
          fontSize: '14px',
          textAlign: 'center',
          fontStyle: 'italic',
          marginBottom: '20px'
        }}>
          Si vous continuez à avoir des problèmes, contactez notre support à support@recetteplus.com
        </p>
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
          Cet email a été envoyé par Recette+ pour des raisons de sécurité
        </p>
        <p style={{
          color: '#9CA3AF',
          fontSize: '12px',
          margin: '0'
        }}>
          © 2024 Recette+ - Tous droits réservés<br/>
          Si vous n'avez pas demandé cette réinitialisation, veuillez nous contacter immédiatement.
        </p>
      </div>
    </div>
  );
};

export default PasswordResetEmail;
