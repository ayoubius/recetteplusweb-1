
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Home, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

interface AccessDeniedProps {
  title?: string;
  message?: string;
  showBackButton?: boolean;
}

const AccessDenied: React.FC<AccessDeniedProps> = ({
  title = "Accès refusé",
  message = "Vous n'avez pas les permissions nécessaires pour accéder à cette page.",
  showBackButton = true
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-3 bg-red-100 rounded-full w-fit">
            <Shield className="h-8 w-8 text-red-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <p className="text-gray-600">
            {message}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/">
              <Button className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600">
                <Home className="h-4 w-4 mr-2" />
                Retour à l'accueil
              </Button>
            </Link>
            {showBackButton && (
              <Button 
                variant="outline" 
                onClick={() => window.history.back()}
                className="w-full sm:w-auto"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccessDenied;
