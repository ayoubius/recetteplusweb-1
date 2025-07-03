
-- Activer les extensions nécessaires pour les appels HTTP depuis PostgreSQL
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Créer une fonction qui sera appelée par le trigger
CREATE OR REPLACE FUNCTION trigger_order_status_email()
RETURNS TRIGGER AS $$
DECLARE
  should_send_email BOOLEAN := FALSE;
  email_type TEXT;
BEGIN
  -- Vérifier si le statut a changé
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    -- Déterminer quel type d'email envoyer
    IF NEW.status = 'validated' AND OLD.status = 'pending' THEN
      should_send_email := TRUE;
      email_type := 'validation';
    ELSIF NEW.status = 'delivered' AND OLD.status != 'delivered' THEN
      should_send_email := TRUE;
      email_type := 'delivery';
    END IF;
    
    -- Si on doit envoyer un email, appeler l'Edge Function
    IF should_send_email THEN
      PERFORM net.http_post(
        url := 'https://uymqovqiuoneslmvtvti.supabase.co/functions/v1/send-order-emails',
        headers := jsonb_build_object(
          'Content-Type', 'application/json',
          'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV5bXFvdnFpdW9uZXNsbXZ0dnRpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDk3NDU4MiwiZXhwIjoyMDY2NTUwNTgyfQ.5F5Z3-k_owksQL6j4pM3-IlYvAiXB1Aq0j-DKZEphFg'
        ),
        body := jsonb_build_object(
          'orderId', NEW.id,
          'emailType', email_type
        )
      );
      
      -- Log pour debug
      RAISE LOG 'Email % déclenché pour la commande %', email_type, NEW.id;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Créer le trigger sur la table orders
DROP TRIGGER IF EXISTS order_status_email_trigger ON orders;
CREATE TRIGGER order_status_email_trigger
  AFTER UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION trigger_order_status_email();

-- Mettre à jour le trigger de mise à jour du timestamp pour qu'il s'exécute avant le trigger d'email
DROP TRIGGER IF EXISTS orders_updated_at_trigger ON orders;
CREATE TRIGGER orders_updated_at_trigger
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
