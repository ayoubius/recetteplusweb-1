
# Application Mobile Flutter - Recette+

## Vue d'ensemble

Ce document détaille les informations nécessaires pour développer une application mobile Flutter pour Recette+, une plateforme de recettes et produits culinaires maliens.

## Configuration Firebase

### Informations du projet Firebase
```
Project ID: recette-plus-app
API Key: AIzaSyDyTa4_ltMe9y7nS0OHFK5Ata8C7ZuV8Bc
Auth Domain: recette-plus-app.firebaseapp.com
Storage Bucket: recette-plus-app.firebasestorage.app
Messaging Sender ID: 361640124056
App ID: 1:361640124056:web:5e7800c593d5ef089c7aed
Measurement ID: G-GZPWYFVQ9L
```

### Configuration Android (google-services.json)
```json
{
  "project_info": {
    "project_number": "361640124056",
    "project_id": "recette-plus-app",
    "storage_bucket": "recette-plus-app.firebasestorage.app"
  },
  "client": [
    {
      "client_info": {
        "mobilesdk_app_id": "1:361640124056:android:YOUR_ANDROID_APP_ID",
        "android_client_info": {
          "package_name": "com.recetteplus.app"
        }
      },
      "oauth_client": [
        {
          "client_id": "361640124056-YOUR_CLIENT_ID.apps.googleusercontent.com",
          "client_type": 3
        }
      ],
      "api_key": [
        {
          "current_key": "AIzaSyDyTa4_ltMe9y7nS0OHFK5Ata8C7ZuV8Bc"
        }
      ],
      "services": {
        "appinvite_service": {
          "other_platform_oauth_client": [
            {
              "client_id": "361640124056-YOUR_WEB_CLIENT_ID.apps.googleusercontent.com",
              "client_type": 3
            }
          ]
        }
      }
    }
  ],
  "configuration_version": "1"
}
```

### Configuration iOS (GoogleService-Info.plist)
```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
	<key>CLIENT_ID</key>
	<string>361640124056-YOUR_IOS_CLIENT_ID.apps.googleusercontent.com</string>
	<key>REVERSED_CLIENT_ID</key>
	<string>com.googleusercontent.apps.361640124056-YOUR_REVERSED_CLIENT_ID</string>
	<key>API_KEY</key>
	<string>AIzaSyDyTa4_ltMe9y7nS0OHFK5Ata8C7ZuV8Bc</string>
	<key>GCM_SENDER_ID</key>
	<string>361640124056</string>
	<key>PLIST_VERSION</key>
	<string>1</string>
	<key>BUNDLE_ID</key>
	<string>com.recetteplus.app</string>
	<key>PROJECT_ID</key>
	<string>recette-plus-app</string>
	<key>STORAGE_BUCKET</key>
	<string>recette-plus-app.firebasestorage.app</string>
	<key>IS_ADS_ENABLED</key>
	<false></false>
	<key>IS_ANALYTICS_ENABLED</key>
	<false></false>
	<key>IS_APPINVITE_ENABLED</key>
	<true></true>
	<key>IS_GCM_ENABLED</key>
	<true></true>
	<key>IS_SIGNIN_ENABLED</key>
	<true></true>
	<key>GOOGLE_APP_ID</key>
	<string>1:361640124056:ios:YOUR_IOS_APP_ID</string>
</dict>
</plist>
```

## Architecture de l'Application

### Fonctionnalités principales
1. **Authentification**
   - Connexion email/mot de passe
   - Connexion Google
   - Authentification par numéro de téléphone malien (+223)
   - Vérification OTP
   - Réinitialisation de mot de passe

2. **Gestion des recettes**
   - Affichage des recettes
   - Recherche et filtrage
   - Recettes favorites
   - Catégories (Cuisine française, italienne, asiatique, africaine, etc.)

3. **Gestion des produits**
   - Catalogue de produits
   - Panier d'achat
   - Commandes

4. **Profil utilisateur**
   - Informations personnelles
   - Préférences culinaires
   - Restrictions alimentaires
   - Historique des commandes

5. **Contenu vidéo**
   - Tutoriels de cuisine
   - Lecteur vidéo intégré

## Dépendances Flutter recommandées

```yaml
dependencies:
  flutter:
    sdk: flutter
  
  # Firebase
  firebase_core: ^2.24.2
  firebase_auth: ^4.15.3
  cloud_firestore: ^4.13.6
  firebase_storage: ^11.6.0
  
  # Authentification
  google_sign_in: ^6.1.6
  
  # Interface utilisateur
  flutter_svg: ^2.0.9
  cached_network_image: ^3.3.0
  image_picker: ^1.0.4
  
  # Navigation
  go_router: ^12.1.3
  
  # État de l'application
  provider: ^6.1.1
  riverpod: ^2.4.9
  
  # Utilitaires
  http: ^1.1.0
  intl: ^0.18.1
  shared_preferences: ^2.2.2
  
  # Vidéo
  video_player: ^2.8.1
  chewie: ^1.7.4
  
  # Formats de données
  json_annotation: ^4.8.1
  
dev_dependencies:
  flutter_test:
    sdk: flutter
  build_runner: ^2.4.7
  json_serializable: ^6.7.1
```

## Structure des dossiers recommandée

```
lib/
├── main.dart
├── app.dart
├── core/
│   ├── constants/
│   ├── errors/
│   ├── network/
│   └── utils/
├── features/
│   ├── auth/
│   │   ├── data/
│   │   ├── domain/
│   │   └── presentation/
│   ├── recipes/
│   │   ├── data/
│   │   ├── domain/
│   │   └── presentation/
│   ├── products/
│   │   ├── data/
│   │   ├── domain/
│   │   └── presentation/
│   ├── profile/
│   │   ├── data/
│   │   ├── domain/
│   │   └── presentation/
│   └── videos/
│       ├── data/
│       ├── domain/
│       └── presentation/
├── shared/
│   ├── widgets/
│   ├── themes/
│   └── extensions/
└── firebase_options.dart
```

## Modèles de données

### Utilisateur
```dart
class UserProfile {
  final String id;
  final String email;
  final String? displayName;
  final String? photoURL;
  final bool emailVerified;
  final String? phoneNumber;
  final UserRole role;
  final UserPreferences? preferences;
  final DateTime createdAt;
  final DateTime updatedAt;

  const UserProfile({
    required this.id,
    required this.email,
    this.displayName,
    this.photoURL,
    required this.emailVerified,
    this.phoneNumber,
    required this.role,
    this.preferences,
    required this.createdAt,
    required this.updatedAt,
  });
}

class UserPreferences {
  final List<String> dietaryRestrictions;
  final List<String> favoriteCategories;
  
  const UserPreferences({
    required this.dietaryRestrictions,
    required this.favoriteCategories,
  });
}

enum UserRole { user, admin }
```

### Recette
```dart
class Recipe {
  final String id;
  final String title;
  final String description;
  final String? imageUrl;
  final List<String> ingredients;
  final List<String> instructions;
  final String category;
  final int prepTime;
  final int cookTime;
  final int servings;
  final String difficulty;
  final bool isActive;
  final DateTime createdAt;
  final DateTime updatedAt;

  const Recipe({
    required this.id,
    required this.title,
    required this.description,
    this.imageUrl,
    required this.ingredients,
    required this.instructions,
    required this.category,
    required this.prepTime,
    required this.cookTime,
    required this.servings,
    required this.difficulty,
    required this.isActive,
    required this.createdAt,
    required this.updatedAt,
  });
}
```

### Produit
```dart
class Product {
  final String id;
  final String name;
  final String description;
  final double price;
  final String? imageUrl;
  final String category;
  final int stock;
  final bool isActive;
  final DateTime createdAt;
  final DateTime updatedAt;

  const Product({
    required this.id,
    required this.name,
    required this.description,
    required this.price,
    this.imageUrl,
    required this.category,
    required this.stock,
    required this.isActive,
    required this.createdAt,
    required this.updatedAt,
  });
}
```

## Configuration Firebase Firestore

### Règles de sécurité
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Règles pour les utilisateurs
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      allow read: if request.auth != null && 
        resource.data.role == 'admin' && 
        request.auth.token.admin == true;
    }
    
    // Règles pour les recettes
    match /recipes/{recipeId} {
      allow read: if resource.data.isActive == true;
      allow write: if request.auth != null && 
        request.auth.token.admin == true;
    }
    
    // Règles pour les produits
    match /products/{productId} {
      allow read: if resource.data.isActive == true;
      allow write: if request.auth != null && 
        request.auth.token.admin == true;
    }
    
    // Règles pour les vidéos
    match /videos/{videoId} {
      allow read: if resource.data.isActive == true;
      allow write: if request.auth != null && 
        request.auth.token.admin == true;
    }
    
    // Règles pour les commandes
    match /orders/{orderId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
      allow read: if request.auth != null && 
        request.auth.token.admin == true;
    }
  }
}
```

## Authentification par téléphone malien

### Configuration
```dart
// Numéros maliens acceptés: +223 suivi de 8 chiffres commençant par 6, 7, 8 ou 9
bool isValidMalianPhoneNumber(String phoneNumber) {
  final regex = RegExp(r'^\+223[6-9]\d{7}$');
  return regex.hasMatch(phoneNumber);
}

// Formatage du numéro
String formatMalianPhoneNumber(String input) {
  // Supprimer tous les caractères non numériques
  final numbers = input.replaceAll(RegExp(r'\D'), '');
  
  // Limiter à 8 chiffres
  final limited = numbers.substring(0, min(8, numbers.length));
  
  // Formater: XX XX XX XX
  if (limited.length >= 6) {
    return '${limited.substring(0, 2)} ${limited.substring(2, 4)} ${limited.substring(4, 6)} ${limited.substring(6)}';
  } else if (limited.length >= 4) {
    return '${limited.substring(0, 2)} ${limited.substring(2, 4)} ${limited.substring(4)}';
  } else if (limited.length >= 2) {
    return '${limited.substring(0, 2)} ${limited.substring(2)}';
  }
  return limited;
}
```

## Thème et couleurs

### Palette de couleurs
```dart
class AppColors {
  static const Color primary = Color(0xFFF97316); // Orange-500
  static const Color primaryDark = Color(0xFFEA580C); // Orange-600
  static const Color secondary = Color(0xFFDC2626); // Red-600
  static const Color background = Color(0xFFFFF7ED); // Orange-50
  static const Color surface = Color(0xFFFFFFFF);
  static const Color error = Color(0xFFDC2626);
  static const Color textPrimary = Color(0xFF111827); // Gray-900
  static const Color textSecondary = Color(0xFF6B7280); // Gray-500
}
```

## Spécificités Mali

### Formats locaux
- **Devise**: Franc CFA (XOF)
- **Format de date**: dd/MM/yyyy
- **Langue**: Français
- **Numéros de téléphone**: +223 XX XX XX XX

### Intégration des paiements mobiles
Considérer l'intégration des services de paiement mobile populaires au Mali:
- Orange Money
- Moov Money
- Malitel Money

## Déploiement

### Android
1. Configurer la signature de l'application
2. Générer le fichier APK/AAB
3. Publier sur Google Play Store

### iOS
1. Configurer les certificats Apple
2. Créer l'archive Xcode
3. Publier sur App Store Connect

## Notes importantes

1. **Permissions requises**:
   - Internet
   - Caméra (pour photos de profil)
   - Stockage (pour cache des images)
   - Notifications push

2. **Optimisations**:
   - Cache des images
   - Chargement progressif des listes
   - Compression des images uploadées

3. **Sécurité**:
   - Validation côté client et serveur
   - Chiffrement des données sensibles
   - Gestion sécurisée des tokens

4. **Tests**:
   - Tests unitaires pour la logique métier
   - Tests d'intégration pour Firebase
   - Tests UI pour les écrans principaux

Cette documentation fournit une base solide pour développer l'application mobile Flutter de Recette+. Adaptez les configurations selon vos besoins spécifiques et les évolutions du projet.
