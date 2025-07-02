
import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* À propos */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <img 
                src="/lovable-uploads/fd4068e4-5395-416a-a0d9-2f2084813da4.png" 
                alt="Recette+" 
                className="h-12 w-auto filter brightness-0 invert"
              />
            </div>
            <p className="text-gray-300 mb-4">
              Recette⁺ est votre application tout-en-un pour découvrir des recettes en vidéo 
              et commander les ingrédients nécessaires, livrés directement chez vous.
            </p>
            <div className="flex space-x-4">
              <Facebook className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
              <Twitter className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
              <Instagram className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
              <Youtube className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Navigation</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white transition-colors">
                  Accueil
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-white transition-colors">
                  À propos
                </Link>
              </li>
              <li>
                <Link to="/recettes" className="text-gray-300 hover:text-white transition-colors">
                  Recettes
                </Link>
              </li>
              <li>
                <Link to="/produits" className="text-gray-300 hover:text-white transition-colors">
                  Produits
                </Link>
              </li>
              <li>
                <Link to="/videos" className="text-gray-300 hover:text-white transition-colors">
                  Vidéos
                </Link>
              </li>
            </ul>
          </div>

          {/* Informations */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Informations</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/favoris" className="text-gray-300 hover:text-white transition-colors">
                  Mes favoris
                </Link>
              </li>
              <li>
                <Link to="/panier" className="text-gray-300 hover:text-white transition-colors">
                  Mon panier
                </Link>
              </li>
              <li>
                <Link to="/profile" className="text-gray-300 hover:text-white transition-colors">
                  Mon profil
                </Link>
              </li>
              <li>
                <Link to="/download-app" className="text-gray-300 hover:text-white transition-colors">
                  Télécharger l'app
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-orange-500" />
                <a 
                  href="mailto:contact@recette-plus.com" 
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  contact@recette-plus.com
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-orange-500" />
                <div className="text-gray-300">
                  <p>+223 78 21 63 98</p>
                  <p>+223 90 74 10 90</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-4 w-4 text-orange-500" />
                <p className="text-gray-300">
                  ACI 2000, Bamako, Mali
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2025 Recette+ SARL. Tous droits réservés.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                Conditions d'utilisation
              </a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                Politique de confidentialité
              </a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                Mentions légales
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
