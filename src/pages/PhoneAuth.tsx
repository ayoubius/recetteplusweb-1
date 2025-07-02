import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Phone, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from 'firebase/auth';
import { auth } from '@/lib/firebase';

const PhoneAuth = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
        callback: () => {
          console.log('reCAPTCHA solved');
        },
        'expired-callback': () => {
          console.log('reCAPTCHA expired');
        }
      });
    }
  };

  const formatPhoneNumber = (value: string) => {
    // Supprimer tous les caractères non numériques
    const numbers = value.replace(/\D/g, '');
    
    // Limiter à 8 chiffres maximum
    const limited = numbers.slice(0, 8);
    
    // Formater avec des espaces: XX XX XX XX
    if (limited.length >= 6) {
      return `${limited.slice(0, 2)} ${limited.slice(2, 4)} ${limited.slice(4, 6)} ${limited.slice(6)}`;
    } else if (limited.length >= 4) {
      return `${limited.slice(0, 2)} ${limited.slice(2, 4)} ${limited.slice(4)}`;
    } else if (limited.length >= 2) {
      return `${limited.slice(0, 2)} ${limited.slice(2)}`;
    }
    return limited;
  };

  const validateMalianNumber = (number: string) => {
    const cleanNumber = number.replace(/\D/g, '');
    // Numéros maliens: 8 chiffres, commençant par 6, 7, 8 ou 9
    return cleanNumber.length === 8 && /^[6-9]/.test(cleanNumber);
  };

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const cleanNumber = phoneNumber.replace(/\D/g, '');
    
    if (!validateMalianNumber(cleanNumber)) {
      toast({
        title: "Erreur",
        description: "Veuillez saisir un numéro de téléphone malien valide (8 chiffres commençant par 6, 7, 8 ou 9)",
        variant: "destructive"
      });
      return;
    }

    try {
      setLoading(true);
      setupRecaptcha();
      
      const formattedNumber = `+223${cleanNumber}`;
      console.log('Attempting to send SMS to:', formattedNumber);
      
      const confirmation = await signInWithPhoneNumber(auth, formattedNumber, window.recaptchaVerifier);
      
      setConfirmationResult(confirmation);
      setStep('otp');
      
      toast({
        title: "Code envoyé",
        description: "Un code de vérification a été envoyé à votre numéro"
      });
    } catch (error: any) {
      console.error('Phone auth error:', error);
      let errorMessage = "Impossible d'envoyer le code de vérification";
      
      if (error.code === 'auth/invalid-phone-number') {
        errorMessage = "Numéro de téléphone invalide";
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = "Trop de tentatives. Veuillez réessayer plus tard";
      } else if (error.code === 'auth/quota-exceeded') {
        errorMessage = "Quota SMS dépassé. Veuillez réessayer plus tard";
      } else if (error.code === 'auth/captcha-check-failed') {
        errorMessage = "Vérification reCAPTCHA échouée. Veuillez réessayer";
        // Reset reCAPTCHA
        if (window.recaptchaVerifier) {
          window.recaptchaVerifier.clear();
          window.recaptchaVerifier = undefined;
        }
      }
      
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!confirmationResult || otp.length !== 6) {
      toast({
        title: "Erreur",
        description: "Veuillez saisir le code à 6 chiffres",
        variant: "destructive"
      });
      return;
    }

    try {
      setLoading(true);
      await confirmationResult.confirm(otp);
      
      toast({
        title: "Connexion réussie",
        description: "Vous êtes maintenant connecté"
      });
      
      navigate('/');
    } catch (error: any) {
      console.error('OTP verification error:', error);
      let errorMessage = "Code de vérification incorrect";
      if (error.code === 'auth/invalid-verification-code') {
        errorMessage = "Le code saisi est incorrect";
      } else if (error.code === 'auth/code-expired') {
        errorMessage = "Le code a expiré. Veuillez en demander un nouveau";
      }
      
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

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
            {step === 'phone' ? 'Connexion par téléphone' : 'Vérification'}
          </CardTitle>
          <p className="text-gray-600 text-sm">
            {step === 'phone' 
              ? 'Saisissez votre numéro de téléphone malien'
              : 'Saisissez le code reçu par SMS'
            }
          </p>
        </CardHeader>
        <CardContent>
          {step === 'phone' ? (
            <form onSubmit={handlePhoneSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Numéro de téléphone
                </label>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center px-3 py-2 border border-gray-300 rounded-md bg-gray-50">
                    <img 
                      src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMTgiIHZpZXdCb3g9IjAgMCAyNCAxOCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjYiIGZpbGw9IiNGRkU5MDAiLz4KPHJZY3QgeT0iNiIgd2lkdGg9IjI0IiBoZWlnaHQ9IjYiIGZpbGw9IiNGRjAwMDAiLz4KPHJZY3QgeT0iMTIiIHdpZHRoPSIyNCIgaGVpZ2h0PSI2IiBmaWxsPSIjMDA5NzM5Ii8+Cjwvc3ZnPgo="
                      alt="Mali"
                      className="w-6 h-4"
                    />
                    <span className="text-sm text-gray-600 ml-2">+223</span>
                  </div>
                  <Input
                    type="tel"
                    placeholder="XX XX XX XX"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(formatPhoneNumber(e.target.value))}
                    className="flex-1"
                    maxLength={11}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Format: 8 chiffres commençant par 6, 7, 8 ou 9
                </p>
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-orange-500 hover:bg-orange-600"
                disabled={loading || !validateMalianNumber(phoneNumber.replace(/\D/g, ''))}
              >
                <Phone className="h-4 w-4 mr-2" />
                {loading ? "Envoi..." : "Envoyer le code"}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleOtpSubmit} className="space-y-4">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-4">
                  Code envoyé au +223 {phoneNumber}
                </p>
                <div className="flex justify-center">
                  <InputOTP 
                    maxLength={6} 
                    value={otp} 
                    onChange={(value) => setOtp(value)}
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-orange-500 hover:bg-orange-600"
                disabled={loading || otp.length !== 6}
              >
                {loading ? "Vérification..." : "Vérifier"}
              </Button>
              
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => {
                  setStep('phone');
                  setOtp('');
                  setConfirmationResult(null);
                }}
              >
                Modifier le numéro
              </Button>
            </form>
          )}

          <div className="mt-6 text-center">
            <Link 
              to="/login" 
              className="inline-flex items-center text-orange-500 hover:text-orange-600 font-medium"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Retour à la connexion
            </Link>
          </div>
        </CardContent>
      </Card>
      
      {/* reCAPTCHA container - caché avec CSS */}
      <div id="recaptcha-container" style={{ display: 'none' }}></div>
      
      {/* CSS pour cacher l'icône reCAPTCHA */}
      <style>{`
        .grecaptcha-badge {
          visibility: hidden !important;
          opacity: 0 !important;
          position: absolute !important;
          left: -9999px !important;
        }
      `}</style>
    </div>
  );
};

export default PhoneAuth;
