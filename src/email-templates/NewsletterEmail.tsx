
import React from 'react';

interface NewsletterEmailProps {
  title: string;
  content: string;
  logoUrl?: string;
  featuredRecipes?: Array<{
    id: string;
    title: string;
    image: string;
    description: string;
  }>;
  unsubscribeUrl?: string;
}

export const NewsletterEmail = ({ 
  title, 
  content, 
  logoUrl, 
  featuredRecipes = [],
  unsubscribeUrl 
}: NewsletterEmailProps) => {
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
        background: 'linear-gradient(135deg, #F97316 0%, #DC2626 100%)',
        padding: '40px 30px',
        textAlign: 'center',
        position: 'relative'
      }}>
        <div style={{
          position: 'absolute',
          top: '20px',
          right: '30px',
          backgroundColor: 'rgba(255,255,255,0.2)',
          padding: '5px 12px',
          borderRadius: '20px',
          fontSize: '12px',
          color: '#ffffff',
          fontWeight: '500'
        }}>
          Newsletter
        </div>
        
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
          fontSize: '32px',
          fontWeight: 'bold',
          margin: '0',
          textShadow: '0 2px 4px rgba(0,0,0,0.2)'
        }}>
          {title}
        </h1>
      </div>

      {/* Main Content */}
      <div style={{ padding: '40px 30px' }}>
        <div style={{
          color: '#374151',
          fontSize: '16px',
          lineHeight: '1.7',
          marginBottom: '40px'
        }} dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, '<br/>') }} />

        {/* Featured Recipes Section */}
        {featuredRecipes.length > 0 && (
          <div style={{ marginBottom: '40px' }}>
            <h2 style={{
              color: '#F97316',
              fontSize: '24px',
              fontWeight: '600',
              marginBottom: '25px',
              textAlign: 'center'
            }}>
              🍽️ Recettes à la Une
            </h2>
            
            <div style={{ display: 'grid', gap: '20px' }}>
              {featuredRecipes.slice(0, 3).map((recipe, index) => (
                <div key={recipe.id} style={{
                  display: 'flex',
                  backgroundColor: '#F9FAFB',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  border: '1px solid #E5E7EB',
                  transition: 'all 0.3s ease'
                }}>
                  <img 
                    src={recipe.image} 
                    alt={recipe.title}
                    style={{
                      width: '120px',
                      height: '120px',
                      objectFit: 'cover'
                    }}
                  />
                  <div style={{ padding: '20px', flex: '1' }}>
                    <h3 style={{
                      color: '#1F2937',
                      fontSize: '18px',
                      fontWeight: '600',
                      margin: '0 0 10px 0'
                    }}>
                      {recipe.title}
                    </h3>
                    <p style={{
                      color: '#6B7280',
                      fontSize: '14px',
                      margin: '0 0 15px 0',
                      lineHeight: '1.5'
                    }}>
                      {recipe.description}
                    </p>
                    <a href={`#/recipe/${recipe.id}`} style={{
                      color: '#F97316',
                      textDecoration: 'none',
                      fontSize: '14px',
                      fontWeight: '600'
                    }}>
                      Voir la recette →
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CTA Section */}
        <div style={{
          backgroundColor: '#FEF3E2',
          border: '2px solid #F97316',
          borderRadius: '12px',
          padding: '30px',
          textAlign: 'center',
          marginBottom: '30px'
        }}>
          <h3 style={{
            color: '#F97316',
            fontSize: '20px',
            fontWeight: '600',
            margin: '0 0 15px 0'
          }}>
            📱 Téléchargez notre application mobile !
          </h3>
          <p style={{
            color: '#374151',
            margin: '0 0 20px 0',
            fontSize: '16px'
          }}>
            Emportez toutes vos recettes partout avec vous
          </p>
          <a href="#" style={{
            display: 'inline-block',
            backgroundColor: '#F97316',
            color: '#ffffff',
            padding: '12px 24px',
            borderRadius: '8px',
            textDecoration: 'none',
            fontWeight: 'bold',
            fontSize: '14px'
          }}>
            Télécharger maintenant
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
        <div style={{ marginBottom: '20px' }}>
          <h4 style={{
            color: '#374151',
            fontSize: '16px',
            fontWeight: '600',
            margin: '0 0 10px 0'
          }}>
            Restez connecté avec nous
          </h4>
          <div>
            <a href="#" style={{
              display: 'inline-block',
              margin: '0 15px',
              color: '#F97316',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: '500'
            }}>Facebook</a>
            <a href="#" style={{
              display: 'inline-block',
              margin: '0 15px',
              color: '#F97316',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: '500'
            }}>Instagram</a>
            <a href="#" style={{
              display: 'inline-block',
              margin: '0 15px',
              color: '#F97316',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: '500'
            }}>YouTube</a>
          </div>
        </div>
        
        <div style={{
          borderTop: '1px solid #E5E7EB',
          paddingTop: '20px'
        }}>
          <p style={{
            color: '#6B7280',
            fontSize: '14px',
            margin: '0 0 10px 0'
          }}>
            Vous recevez cet email car vous êtes abonné à la newsletter de Recette+
          </p>
          <p style={{
            color: '#9CA3AF',
            fontSize: '12px',
            margin: '0'
          }}>
            © 2024 Recette+ - Tous droits réservés<br/>
            {unsubscribeUrl && (
              <>
                <a href={unsubscribeUrl} style={{ color: '#F97316', textDecoration: 'none' }}>
                  Se désabonner
                </a>
                {' | '}
              </>
            )}
            <a href="#" style={{ color: '#F97316', textDecoration: 'none' }}>
              Modifier mes préférences
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default NewsletterEmail;
