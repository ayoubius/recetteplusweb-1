import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Mail, Send, Calendar, Users, Eye, X, Maximize2, Minimize2, Download, Share } from 'lucide-react';
import { useNewsletterCampaigns, useSendNewsletter } from '@/hooks/useNewsletters';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

const NewsletterManagement = () => {
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isFullscreenPreview, setIsFullscreenPreview] = useState(false);

  const { data: campaigns, isLoading } = useNewsletterCampaigns();
  const sendNewsletter = useSendNewsletter();

  const handleSend = async () => {
    if (!title.trim() || !subject.trim() || !content.trim()) {
      return;
    }

    try {
      await sendNewsletter.mutateAsync({
        title,
        subject,
        content
      });
      
      // Reset form
      setTitle('');
      setSubject('');
      setContent('');
      setIsPreviewMode(false);
    } catch (error) {
      console.error('Erreur envoi:', error);
    }
  };

  const generateEnhancedPreview = () => {
    const logoUrl = "https://uymqovqiuoneslmvtvti.supabase.co/storage/v1/object/public/logo/logo.png";
    
    return `
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${subject}</title>
        <style>
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes logoFloat {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-8px); }
          }
          @keyframes shimmer {
            0% { background-position: -1000px 0; }
            100% { background-position: 1000px 0; }
          }
          body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            line-height: 1.6; 
            color: #333; 
            margin: 0; 
            padding: 20px; 
            background: linear-gradient(135deg, #FEF3E2 0%, #FED7AA 100%);
            animation: fadeIn 0.8s ease-out;
          }
          .container { 
            max-width: 650px; 
            margin: 0 auto; 
            background: white; 
            border-radius: 16px; 
            overflow: hidden; 
            box-shadow: 0 20px 60px rgba(0,0,0,0.15);
            animation: fadeIn 1s ease-out 0.2s both;
          }
          .header { 
            text-align: center; 
            padding: 50px 40px; 
            background: linear-gradient(135deg, #F97316 0%, #DC2626 100%); 
            color: white; 
            position: relative;
            overflow: hidden;
          }
          .header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%);
            background-size: 200% 200%;
            animation: shimmer 3s ease-in-out infinite;
          }
          .header-badge {
            position: absolute;
            top: 25px;
            right: 40px;
            background: rgba(255,255,255,0.25);
            padding: 8px 16px;
            border-radius: 25px;
            font-size: 13px;
            font-weight: 600;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255,255,255,0.2);
          }
          .logo { 
            height: 70px; 
            margin-bottom: 25px; 
            filter: drop-shadow(0 4px 8px rgba(0,0,0,0.2));
            animation: logoFloat 4s ease-in-out infinite;
            position: relative;
            z-index: 1;
          }
          .content { 
            padding: 50px 40px; 
          }
          .footer { 
            text-align: center; 
            padding: 40px; 
            background: linear-gradient(135deg, #F9FAFB 0%, #F3F4F6 100%); 
            color: #6B7280; 
            font-size: 14px; 
            border-top: 1px solid #E5E7EB;
          }
          .unsubscribe { 
            color: #F97316; 
            text-decoration: none; 
            font-weight: 500;
          }
          h1 { 
            color: white; 
            margin: 0; 
            font-size: 36px; 
            font-weight: bold;
            text-shadow: 0 4px 8px rgba(0,0,0,0.3);
            position: relative;
            z-index: 1;
          }
          .content h2 { 
            color: #F97316; 
            font-size: 26px;
            margin-bottom: 25px;
            font-weight: 700;
          }
          .cta-section {
            background: linear-gradient(135deg, #FEF3E2 0%, #FED7AA 100%);
            border: 2px solid #F97316;
            border-radius: 16px;
            padding: 40px;
            text-align: center;
            margin: 40px 0;
            position: relative;
            overflow: hidden;
          }
          .cta-section::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: radial-gradient(circle at 50% 50%, rgba(249, 115, 22, 0.1) 0%, transparent 70%);
          }
          .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #F97316 0%, #DC2626 100%);
            color: white;
            padding: 18px 36px;
            border-radius: 50px;
            text-decoration: none;
            font-weight: bold;
            font-size: 18px;
            margin-top: 20px;
            box-shadow: 0 8px 25px rgba(249, 115, 22, 0.4);
            transition: all 0.3s ease;
            position: relative;
            z-index: 1;
          }
          .cta-button:hover {
            transform: translateY(-3px);
            box-shadow: 0 12px 35px rgba(249, 115, 22, 0.6);
          }
          .social-links {
            margin: 25px 0;
          }
          .social-links a {
            display: inline-block;
            margin: 0 20px;
            color: #F97316;
            text-decoration: none;
            font-weight: 600;
            font-size: 15px;
            transition: all 0.3s ease;
          }
          .social-links a:hover {
            color: #DC2626;
            transform: translateY(-2px);
          }
          .divider {
            border-top: 2px solid #E5E7EB;
            margin: 30px 0;
            padding-top: 25px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="header-badge">Newsletter Premium</div>
            <img src="${logoUrl}" alt="Recette+" class="logo" />
            <h1>${title}</h1>
          </div>
          <div class="content">
            <div style="color: #374151; font-size: 18px; line-height: 1.8; margin-bottom: 30px;">
              ${content.replace(/\n/g, '<br>')}
            </div>
            
            <div class="cta-section">
              <h3 style="color: #F97316; font-size: 24px; margin: 0 0 15px 0; font-weight: 700;">
                📱 Téléchargez notre application mobile !
              </h3>
              <p style="color: #374151; margin: 0; font-size: 18px; font-weight: 500;">
                Emportez toutes vos recettes partout avec vous
              </p>
              <a href="#" class="cta-button">Télécharger maintenant</a>
            </div>
          </div>
          <div class="footer">
            <h4 style="color: #374151; font-size: 18px; font-weight: 700; margin: 0 0 15px 0;">
              Restez connecté avec nous
            </h4>
            <div class="social-links">
              <a href="#">📘 Facebook</a>
              <a href="#">📸 Instagram</a>
              <a href="#">🎥 YouTube</a>
            </div>
            
            <div class="divider">
              <p style="margin: 0 0 15px 0; font-size: 15px;">
                Vous recevez cet email car vous êtes abonné à la newsletter de Recette+
              </p>
              <p style="color: #9CA3AF; font-size: 13px; margin: 0;">
                © 2025 Recette+ - Tous droits réservés<br/>
                <a href="#" class="unsubscribe">Se désabonner</a> | 
                <a href="#" class="unsubscribe">Modifier mes préférences</a>
              </p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;
  };

  const downloadPreview = () => {
    const htmlContent = generateEnhancedPreview();
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `newsletter-${title.replace(/\s+/g, '-').toLowerCase()}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const sharePreview = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Aperçu Newsletter: ${title}`,
          text: `Voici l'aperçu de la newsletter "${title}"`,
          url: window.location.href
        });
      } catch (error) {
        console.log('Partage annulé');
      }
    } else {
      // Fallback: copier dans le presse-papier
      try {
        await navigator.clipboard.writeText(generateEnhancedPreview());
        alert('HTML copié dans le presse-papier !');
      } catch (error) {
        console.error('Erreur copie:', error);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-4">
        <Mail className="h-8 w-8 text-orange-500" />
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion des Newsletters</h1>
          <p className="text-gray-600">Créez et envoyez des newsletters à vos abonnés</p>
        </div>
      </div>

      {/* Formulaire de création */}
      <Card>
        <CardHeader>
          <CardTitle>Nouvelle Newsletter</CardTitle>
          <CardDescription>
            Créez et envoyez une newsletter à tous vos abonnés non-administrateurs
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Titre de la newsletter</label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Nouvelles recettes de janvier"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Objet de l'email</label>
              <Input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Ex: Découvrez nos nouvelles recettes"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Contenu</label>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Rédigez le contenu de votre newsletter..."
              rows={8}
            />
          </div>

          <div className="flex items-center flex-wrap gap-3">
            <Button
              variant="outline"
              onClick={() => setIsPreviewMode(!isPreviewMode)}
              disabled={!title || !subject || !content}
            >
              <Eye className="h-4 w-4 mr-2" />
              {isPreviewMode ? 'Masquer l\'aperçu' : 'Aperçu'}
            </Button>

            {isPreviewMode && (
              <>
                <Dialog open={isFullscreenPreview} onOpenChange={setIsFullscreenPreview}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Maximize2 className="h-4 w-4 mr-2" />
                      Plein écran
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-7xl h-[95vh] p-0">
                    <DialogHeader className="p-6 pb-4 border-b">
                      <DialogTitle className="flex items-center justify-between">
                        <span>Aperçu Newsletter - {title}</span>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={downloadPreview}
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Télécharger
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={sharePreview}
                          >
                            <Share className="h-4 w-4 mr-2" />
                            Partager
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsFullscreenPreview(false)}
                          >
                            <Minimize2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </DialogTitle>
                    </DialogHeader>
                    <div className="flex-1 p-6">
                      <ScrollArea className="h-full w-full rounded-lg border bg-gray-50">
                        <div className="p-4">
                          <iframe
                            srcDoc={generateEnhancedPreview()}
                            className="w-full h-[800px] border-0 rounded-lg shadow-lg bg-white"
                            title="Aperçu Newsletter"
                            sandbox="allow-same-origin"
                          />
                        </div>
                      </ScrollArea>
                    </div>
                  </DialogContent>
                </Dialog>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={downloadPreview}
                  disabled={!title || !subject || !content}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Télécharger HTML
                </Button>
              </>
            )}
            
            <Button
              onClick={handleSend}
              disabled={!title.trim() || !subject.trim() || !content.trim() || sendNewsletter.isPending}
              className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
            >
              <Send className="h-4 w-4 mr-2" />
              {sendNewsletter.isPending ? 'Envoi...' : 'Envoyer la Newsletter'}
            </Button>
          </div>

          {isPreviewMode && !isFullscreenPreview && (
            <Card className="border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-red-50">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-sm flex items-center">
                    <Eye className="h-4 w-4 mr-2 text-orange-500" />
                    Aperçu de l'email
                  </h3>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={sharePreview}
                    >
                      <Share className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsPreviewMode(false)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-white rounded-lg p-3 shadow-inner">
                  <iframe
                    srcDoc={generateEnhancedPreview()}
                    className="w-full h-96 border-0 rounded"
                    title="Aperçu Newsletter"
                    style={{ 
                      transform: 'scale(0.8)', 
                      transformOrigin: 'top left', 
                      width: '125%', 
                      height: '500px'
                    }}
                    sandbox="allow-same-origin"
                  />
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      {/* Historique des newsletters */}
      <Card>
        <CardHeader>
          <CardTitle>Historique des Newsletters</CardTitle>
          <CardDescription>
            Consultez les newsletters déjà envoyées
          </CardDescription>
        </CardHeader>
        <CardContent>
          {campaigns && campaigns.length > 0 ? (
            <div className="space-y-4">
              {campaigns.map((campaign) => (
                <div key={campaign.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex-1">
                    <h3 className="font-medium">{campaign.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{campaign.subject}</p>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-4 w-4 mr-1" />
                        {campaign.sent_at 
                          ? format(new Date(campaign.sent_at), 'dd MMMM yyyy à HH:mm', { locale: fr })
                          : 'Brouillon'
                        }
                      </div>
                      {campaign.sent_count && (
                        <div className="flex items-center text-sm text-gray-500">
                          <Users className="h-4 w-4 mr-1" />
                          {campaign.sent_count} destinataires
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={campaign.sent_at ? 'default' : 'secondary'}>
                      {campaign.sent_at ? 'Envoyée' : 'Brouillon'}
                    </Badge>
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Mail className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>Aucune newsletter envoyée pour le moment</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default NewsletterManagement;
