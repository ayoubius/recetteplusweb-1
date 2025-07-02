
import React from 'react';

interface WelcomeEmailProps {
  userName: string;
  logoUrl?: string;
}

export const WelcomeEmail = ({ userName, logoUrl }: WelcomeEmailProps) => {
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
        background: 'linear-gradient(135deg, #F97316 0%, #DC2626 100%)',
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
          Bienvenue sur Recette+ !
        </h1>
      </div>

      {/* Content */}
      <div style={{ padding: '40px 30px' }}>
        <h2 style={{
          color: '#F97316',
          fontSize: '24px',
          marginBottom: '20px',
          fontWeight: '600'
        }}>
          Bonjour {userName} ! 👋
        </h2>

        <p style={{
          color: '#374151',
          fontSize: '16px',
          lineHeight: '1.6',
          marginBottom: '20px'
        }}>
          Nous sommes ravis de vous accueillir dans la communauté Recette+ ! Vous venez de rejoindre 
          la plus grande plateforme de cuisine malienne en ligne.
        </p>

        <div style={{
          backgroundColor: '#FEF3E2',
          border: '2px solid #F97316',
          borderRadius: '8px',
          padding: '20px',
          marginBottom: '30px'
        }}>
          <h3 style={{
            color: '#F97316',
            fontSize: '18px',
            marginBottom: '15px',
            fontWeight: '600'
          }}>
            🎉 Que pouvez-vous faire maintenant ?
          </h3>
          <ul style={{
            color: '#374151',
            paddingLeft: '20px',
            margin: '0'
          }}>
            <li style={{ marginBottom: '8px' }}>Découvrir plus de 500 recettes authentiques</li>
            <li style={{ marginBottom: '8px' }}>Commander des ingrédients frais</li>
            <li style={{ marginBottom: '8px' }}>Regarder nos vidéos tutoriels exclusives</li>
            <li style={{ marginBottom: '8px' }}>Partager vos propres créations</li>
          </ul>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <a href="#" style={{
            display: 'inline-block',
            backgroundColor: '#F97316',
            color: '#ffffff',
            padding: '15px 30px',
            borderRadius: '8px',
            textDecoration: 'none',
            fontWeight: 'bold',
            fontSize: '16px',
            transition: 'all 0.3s ease'
          }}>
            🍽️ Commencer à explorer
          </a>
        </div>

        <p style={{
          color: '#6B7280',
          fontSize: '14px',
          textAlign: 'center',
          fontStyle: 'italic'
        }}>
          "La cuisine malienne n'aura plus de secrets pour vous !"
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
          margin: '0 0 10px 0'
        }}>
          Suivez-nous sur nos réseaux sociaux pour ne rien manquer !
        </p>
        <div style={{ marginBottom: '20px' }}>
          <a href="#" style={{
            display: 'inline-block',
            margin: '0 10px',
            color: '#F97316',
            textDecoration: 'none'
          }}>Facebook</a>
          <a href="#" style={{
            display: 'inline-block',
            margin: '0 10px',
            color: '#F97316',
            textDecoration: 'none'
          }}>Instagram</a>
          <a href="#" style={{
            display: 'inline-block',
            margin: '0 10px',
            color: '#F97316',
            textDecoration: 'none'
          }}>YouTube</a>
        </div>
        <p style={{
          color: '#9CA3AF',
          fontSize: '12px',
          margin: '0'
        }}>
          © 2024 Recette+ - Tous droits réservés<br/>
          Si vous ne souhaitez plus recevoir nos emails, 
          <a href="#" style={{ color: '#F97316' }}> cliquez ici pour vous désabonner</a>
        </p>
      </div>
    </div>
  );
};

export default WelcomeEmail;
