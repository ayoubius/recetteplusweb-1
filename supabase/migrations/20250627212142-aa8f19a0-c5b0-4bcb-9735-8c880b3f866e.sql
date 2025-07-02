
-- Ajouter le champ newsletter_enabled aux préférences utilisateur
UPDATE profiles SET preferences = jsonb_set(
  COALESCE(preferences, '{}'),
  '{newsletter_enabled}',
  'true'
) WHERE preferences IS NULL OR NOT (preferences ? 'newsletter_enabled');

-- Créer la table pour l'équipe d'experts
CREATE TABLE public.team_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  description TEXT,
  photo_url TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Ajouter RLS pour la table team_members
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre à tous de lire les membres actifs de l'équipe
CREATE POLICY "Anyone can view active team members" 
  ON public.team_members 
  FOR SELECT 
  USING (is_active = true);

-- Politique pour permettre aux admins de gérer les membres de l'équipe
CREATE POLICY "Admins can manage team members" 
  ON public.team_members 
  FOR ALL 
  USING (public.has_admin_permission('users'));

-- Créer la table pour les campagnes de newsletter
CREATE TABLE public.newsletter_campaigns (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  subject TEXT NOT NULL,
  content TEXT NOT NULL,
  sent_at TIMESTAMP WITH TIME ZONE,
  sent_count INTEGER DEFAULT 0,
  created_by UUID REFERENCES auth.users NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Ajouter RLS pour les campagnes
ALTER TABLE public.newsletter_campaigns ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre aux admins de gérer les campagnes
CREATE POLICY "Admins can manage campaigns" 
  ON public.newsletter_campaigns 
  FOR ALL 
  USING (public.has_admin_permission('users'));

-- Insérer des données d'exemple pour l'équipe
INSERT INTO public.team_members (name, role, description, display_order) VALUES
('Amadou Traoré', 'Fondateur & CEO', 'Visionnaire passionné par la préservation du patrimoine culinaire malien', 1),
('Fatoumata Keita', 'Chef Culinaire en Chef', 'Experte reconnue en cuisine traditionnelle malienne, 20 ans d''expérience', 2),
('Ibrahim Diallo', 'Directeur Technique', 'Architecte de solutions digitales innovantes pour la gastronomie', 3);
