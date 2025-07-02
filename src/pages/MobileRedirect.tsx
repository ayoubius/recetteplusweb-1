
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Smartphone, ArrowLeft, Download, Shield, Phone, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const MobileRedirect = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-indigo-400/20 to-blue-400/20 rounded-full animate-pulse delay-1000"></div>
      </div>
      
      <Card className="w-full max-w-md relative z-10 shadow-2xl border-0 backdrop-blur-sm bg-white/95 animate-fade-in">
        <CardHeader className="text-center relative">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform duration-300">
                <Smartphone className="h-10 w-10 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center animate-bounce">
                <Sparkles className="h-3 w-3 text-white" />
              </div>
            </div>
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Fonctionnalité mobile
          </CardTitle>
          <p className="text-gray-600 text-sm mt-3 leading-relaxed">
            L'ajout de numéro de téléphone nécessite notre application mobile sécurisée
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100 transform hover:scale-[1.02] transition-transform duration-300">
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-blue-900 mb-2">Sécurité renforcée</h3>
                <p className="text-sm text-blue-700 leading-relaxed">
                  Pour des raisons de sécurité, la vérification par SMS n'est disponible que sur notre application mobile sécurisée.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-orange-50 to-red-50 p-6 rounded-xl border border-orange-100 transform hover:scale-[1.02] transition-transform duration-300">
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <Phone className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-orange-900 mb-2">Authentification SMS</h3>
                <p className="text-sm text-orange-700 leading-relaxed">
                  Ajoutez et vérifiez votre numéro de téléphone malien directement depuis l'application.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <Link to="/download-app" className="block">
              <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 rounded-xl shadow-lg transform hover:scale-[1.02] transition-all duration-300">
                <Download className="h-5 w-5 mr-2" />
                Télécharger l'application
              </Button>
            </Link>
            
            <div className="text-center py-4">
              <p className="text-sm text-gray-600 mb-2 font-medium">
                Vous avez déjà l'application ?
              </p>
              <p className="text-xs text-gray-500 leading-relaxed">
                Ouvrez Recette+ sur votre téléphone et accédez à votre profil pour ajouter votre numéro.
              </p>
            </div>
          </div>

          <div className="text-center pt-6 border-t border-gray-100">
            <Link 
              to="/profile" 
              className="inline-flex items-center text-gray-500 hover:text-gray-700 text-sm font-medium transition-colors duration-300 hover:scale-105 transform"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour au profil
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MobileRedirect;
