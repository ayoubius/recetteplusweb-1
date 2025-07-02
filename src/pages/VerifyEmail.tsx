
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { applyActionCode } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { CheckCircle, XCircle, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const VerifyEmail = () => {
  const [loading, setLoading] = useState(true);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const oobCode = searchParams.get('oobCode');

  useEffect(() => {
    const verifyEmail = async () => {
      if (!oobCode) {
        setError("Code de vérification manquant");
        setLoading(false);
        return;
      }

      try {
        await applyActionCode(auth, oobCode);
        setVerified(true);
        toast({
          title: "Email vérifié",
          description: "Votre adresse email a été vérifiée avec succès"
        });
      } catch (error: any) {
        let errorMessage = "Code de vérification invalide ou expiré";
        if (error.code === 'auth/invalid-action-code') {
          errorMessage = "Ce lien de vérification a expiré ou a déjà été utilisé";
        } else if (error.code === 'auth/expired-action-code') {
          errorMessage = "Ce lien de vérification a expiré";
        }
        
        setError(errorMessage);
        toast({
          title: "Erreur",
          description: errorMessage,
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    verifyEmail();
  }, [oobCode, toast]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="flex justify-center mb-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
            </div>
            <p className="text-center text-gray-600">Vérification de votre email...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <img 
              src="/lovable-uploads/fd4068e4-5395-416a-a0d9-2f2084813da4.png" 
              alt="Recette+" 
              className="h-20 w-auto"
            />
          </div>
          <CardTitle className="text-2xl text-gray-900">
            {verified ? "Email vérifié !" : "Erreur de vérification"}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <div className="flex justify-center mb-4">
            {verified ? (
              <CheckCircle className="h-16 w-16 text-green-500" />
            ) : (
              <XCircle className="h-16 w-16 text-red-500" />
            )}
          </div>
          
          <p className="text-gray-600 mb-6">
            {verified 
              ? "Votre adresse email a été vérifiée avec succès. Vous pouvez maintenant vous connecter."
              : error || "Une erreur s'est produite lors de la vérification de votre email."
            }
          </p>

          <div className="space-y-3">
            <Link to="/login">
              <Button className="w-full bg-orange-500 hover:bg-orange-600">
                {verified ? "Se connecter" : "Aller à la connexion"}
              </Button>
            </Link>
            
            <Link 
              to="/" 
              className="inline-flex items-center text-orange-500 hover:text-orange-600 font-medium"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Retour à l'accueil
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifyEmail;
