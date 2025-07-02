
-- Créer la table des commandes avec statuts de livraison
CREATE TABLE IF NOT EXISTS public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'validated', 'assigned', 'picked_up', 'in_transit', 'delivered', 'cancelled')),
  total_amount numeric NOT NULL,
  items jsonb NOT NULL,
  delivery_address jsonb NOT NULL,
  validated_by uuid REFERENCES auth.users(id),
  validated_at timestamp with time zone,
  assigned_to uuid REFERENCES auth.users(id),
  assigned_at timestamp with time zone,
  picked_up_at timestamp with time zone,
  delivered_at timestamp with time zone,
  qr_code text UNIQUE,
  delivery_notes text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Créer la table de tracking de livraison avec géolocalisation
CREATE TABLE IF NOT EXISTS public.delivery_tracking (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  delivery_person_id uuid REFERENCES auth.users(id) NOT NULL,
  latitude decimal(10, 8),
  longitude decimal(11, 8),
  status text NOT NULL,
  notes text,
  created_at timestamp with time zone DEFAULT now()
);

-- Mettre à jour la table des profils avec les nouveaux rôles
UPDATE public.profiles 
SET role = 'user' 
WHERE role NOT IN ('admin', 'manager', 'marketing_manager', 'content_creator', 'admin_assistant', 'order_validator', 'delivery_person');

-- Créer la table des permissions administratives avec les nouveaux rôles
CREATE TABLE IF NOT EXISTS public.admin_permissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  is_super_admin boolean DEFAULT false,
  can_manage_users boolean DEFAULT false,
  can_manage_products boolean DEFAULT false,
  can_manage_recipes boolean DEFAULT false,
  can_manage_videos boolean DEFAULT false,
  can_manage_categories boolean DEFAULT false,
  can_manage_orders boolean DEFAULT false,
  can_validate_orders boolean DEFAULT false,
  can_manage_deliveries boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Créer les fonctions de vérification des permissions
CREATE OR REPLACE FUNCTION public.has_order_validation_permission()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles p
    LEFT JOIN admin_permissions ap ON p.id = ap.user_id
    WHERE p.id = auth.uid() 
    AND (
      p.role IN ('admin', 'manager', 'admin_assistant', 'order_validator') OR
      (ap.can_validate_orders = true) OR
      (ap.is_super_admin = true)
    )
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.has_delivery_permission()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles p
    LEFT JOIN admin_permissions ap ON p.id = ap.user_id
    WHERE p.id = auth.uid() 
    AND (
      p.role IN ('admin', 'manager', 'admin_assistant') OR
      (p.role = 'delivery_person') OR
      (ap.can_manage_deliveries = true) OR
      (ap.is_super_admin = true)
    )
  );
END;
$$;

-- Créer les politiques RLS pour les commandes
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own orders" ON public.orders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Order validators can view all orders" ON public.orders
  FOR SELECT USING (public.has_order_validation_permission());

CREATE POLICY "Order validators can update orders" ON public.orders
  FOR UPDATE USING (public.has_order_validation_permission());

CREATE POLICY "Delivery persons can view assigned orders" ON public.orders
  FOR SELECT USING (auth.uid() = assigned_to OR public.has_delivery_permission());

CREATE POLICY "Delivery persons can update assigned orders" ON public.orders
  FOR UPDATE USING (auth.uid() = assigned_to OR public.has_delivery_permission());

-- Créer les politiques RLS pour le tracking de livraison
ALTER TABLE public.delivery_tracking ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view tracking of their orders" ON public.delivery_tracking
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.orders o 
      WHERE o.id = delivery_tracking.order_id 
      AND o.user_id = auth.uid()
    )
  );

CREATE POLICY "Delivery persons can manage tracking" ON public.delivery_tracking
  FOR ALL USING (
    auth.uid() = delivery_person_id OR 
    public.has_delivery_permission()
  );

-- Créer un trigger pour générer automatiquement le code QR
CREATE OR REPLACE FUNCTION generate_qr_code()
RETURNS trigger AS $$
BEGIN
  NEW.qr_code = 'QR_' || substring(NEW.id::text, 1, 8) || '_' || extract(epoch from now())::text;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER orders_qr_code_trigger
  BEFORE INSERT ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION generate_qr_code();

-- Créer un trigger pour mettre à jour le timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER orders_updated_at_trigger
  BEFORE UPDATE ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
