
-- Ajouter la colonne created_by manquante à la table recipes
ALTER TABLE recipes ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Insertion de catégories de produits
INSERT INTO manageable_product_categories (name, description, is_active, display_order) 
SELECT * FROM (VALUES
  ('Légumes frais', 'Légumes locaux et de saison', true, 1),
  ('Fruits tropicaux', 'Fruits frais du Mali', true, 2),
  ('Céréales', 'Mil, riz, sorgho et autres céréales', true, 3),
  ('Épices et condiments', 'Épices traditionnelles maliennes', true, 4),
  ('Produits laitiers', 'Lait et fromages locaux', true, 5),
  ('Poissons', 'Poissons frais du fleuve Niger', true, 6),
  ('Viandes', 'Viandes locales', true, 7)
) AS t(name, description, is_active, display_order)
WHERE NOT EXISTS (
  SELECT 1 FROM manageable_product_categories WHERE manageable_product_categories.name = t.name
);

-- Insertion de catégories de recettes
INSERT INTO manageable_recipe_categories (name, description, is_active, display_order) 
SELECT * FROM (VALUES
  ('Plats traditionnels maliens', 'Recettes traditionnelles du Mali', true, 1),
  ('Soupes et bouillons', 'Soupes nourrissantes', true, 2),
  ('Desserts', 'Desserts traditionnels', true, 3),
  ('Boissons', 'Boissons traditionnelles', true, 4),
  ('Grillades', 'Viandes et poissons grillés', true, 5)
) AS t(name, description, is_active, display_order)
WHERE NOT EXISTS (
  SELECT 1 FROM manageable_recipe_categories WHERE manageable_recipe_categories.name = t.name
);

-- Insertion de produits
INSERT INTO products (name, price, unit, category, image, in_stock, rating) 
SELECT * FROM (VALUES
  ('Tomates fraîches', 750, 'kg', 'Légumes frais', 'https://images.unsplash.com/photo-1546470427-e035b8397fb4?w=400', true, 4.5),
  ('Oignons', 500, 'kg', 'Légumes frais', 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400', true, 4.2),
  ('Piments verts', 300, 'botte', 'Légumes frais', 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400', true, 4.0),
  ('Mangues', 800, 'kg', 'Fruits tropicaux', 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=400', true, 4.8),
  ('Papayes', 600, 'pièce', 'Fruits tropicaux', 'https://images.unsplash.com/photo-1517282009858-4c6d00c2d9ad?w=400', true, 4.3),
  ('Riz blanc', 1200, 'kg', 'Céréales', 'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=400', true, 4.7),
  ('Mil', 900, 'kg', 'Céréales', 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400', true, 4.1),
  ('Poivre noir', 2500, 'g', 'Épices et condiments', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400', true, 4.9),
  ('Gingembre', 800, 'g', 'Épices et condiments', 'https://images.unsplash.com/photo-1606820962135-7d9f7c6a5e74?w=400', true, 4.6),
  ('Lait frais', 1000, 'litre', 'Produits laitiers', 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400', true, 4.4),
  ('Poisson capitaine', 3500, 'kg', 'Poissons', 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400', true, 4.8),
  ('Viande de bœuf', 4500, 'kg', 'Viandes', 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?w=400', true, 4.5),
  ('Gombo', 400, 'kg', 'Légumes frais', 'https://images.unsplash.com/photo-1565499909193-17b67ae8db9e?w=400', true, 4.2),
  ('Arachides', 1500, 'kg', 'Épices et condiments', 'https://images.unsplash.com/photo-1566393915697-8d9b2b36a1d5?w=400', true, 4.7),
  ('Sésame', 2000, 'kg', 'Épices et condiments', 'https://images.unsplash.com/photo-1583306430699-e5b3e606d2e7?w=400', true, 4.3)
) AS t(name, price, unit, category, image, in_stock, rating)
WHERE NOT EXISTS (
  SELECT 1 FROM products WHERE products.name = t.name
);

-- Ajouter la colonne created_by manquante à la table videos
ALTER TABLE videos ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Insertion de vidéos
INSERT INTO videos (title, description, category, duration, views, likes, video_url, thumbnail, created_by) 
SELECT 
  t.title,
  t.description,
  t.category,
  t.duration,
  t.views,
  t.likes,
  t.video_url,
  t.thumbnail,
  (SELECT id FROM auth.users LIMIT 1) as created_by
FROM (VALUES
  ('Comment préparer le Riz au Gras', 'Technique traditionnelle pour le riz au gras malien', 'Plats traditionnels maliens', '15:30', 1250, 89, 'https://www.youtube.com/watch?v=sample1', 'https://images.unsplash.com/photo-1516684732162-798a0062be99?w=400'),
  ('Préparation du Tô de mil', 'Recette traditionnelle du tô au mil', 'Plats traditionnels maliens', '12:45', 890, 67, 'https://www.youtube.com/watch?v=sample2', 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400'),
  ('Soupe de gombo aux épinards', 'Soupe nutritive aux légumes locaux', 'Soupes et bouillons', '18:20', 670, 54, 'https://www.youtube.com/watch?v=sample3', 'https://images.unsplash.com/photo-1565499909193-17b67ae8db9e?w=400'),
  ('Dégué aux fruits', 'Dessert traditionnel malien', 'Desserts', '10:15', 450, 38, 'https://www.youtube.com/watch?v=sample4', 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400')
) AS t(title, description, category, duration, views, likes, video_url, thumbnail)
WHERE NOT EXISTS (
  SELECT 1 FROM videos WHERE videos.title = t.title
);

-- Insertion de recettes avec ingrédients liés aux produits
WITH product_ids AS (
  SELECT id, name FROM products
),
video_ids AS (
  SELECT id, title FROM videos
)
INSERT INTO recipes (title, description, image, cook_time, servings, difficulty, rating, category, ingredients, instructions, video_id, created_by) 
SELECT 
  recipe_data.title,
  recipe_data.description,
  recipe_data.image,
  recipe_data.cook_time,
  recipe_data.servings,
  recipe_data.difficulty,
  recipe_data.rating,
  recipe_data.category,
  recipe_data.ingredients,
  recipe_data.instructions,
  recipe_data.video_id,
  (SELECT id FROM auth.users LIMIT 1) as created_by
FROM (VALUES
  (
    'Riz au Gras Traditionnel',
    'Plat emblématique du Mali avec du riz cuit dans une sauce riche aux légumes et à la viande',
    'https://images.unsplash.com/photo-1516684732162-798a0062be99?w=400',
    75,
    6,
    'Moyen',
    4.8,
    'Plats traditionnels maliens',
    jsonb_build_array(
      jsonb_build_object('productId', (SELECT id FROM product_ids WHERE name = 'Riz blanc'), 'quantity', '500', 'unit', 'g'),
      jsonb_build_object('productId', (SELECT id FROM product_ids WHERE name = 'Viande de bœuf'), 'quantity', '400', 'unit', 'g'),
      jsonb_build_object('productId', (SELECT id FROM product_ids WHERE name = 'Tomates fraîches'), 'quantity', '3', 'unit', 'pièces'),
      jsonb_build_object('productId', (SELECT id FROM product_ids WHERE name = 'Oignons'), 'quantity', '2', 'unit', 'pièces'),
      jsonb_build_object('productId', (SELECT id FROM product_ids WHERE name = 'Gombo'), 'quantity', '200', 'unit', 'g')
    ),
    ARRAY[
      'Couper la viande en morceaux et faire revenir dans l''huile chaude',
      'Ajouter les oignons émincés et faire dorer',
      'Incorporer les tomates coupées et le gombo',
      'Ajouter le riz et mélanger délicatement',
      'Couvrir d''eau, saler et laisser mijoter 45 minutes',
      'Servir chaud avec du pain ou seul'
    ],
    (SELECT id FROM video_ids WHERE title = 'Comment préparer le Riz au Gras')
  ),
  (
    'Tô de Mil aux Légumes',
    'Plat traditionnel à base de farine de mil, accompagné de légumes locaux',
    'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400',
    45,
    4,
    'Facile',
    4.5,
    'Plats traditionnels maliens',
    jsonb_build_array(
      jsonb_build_object('productId', (SELECT id FROM product_ids WHERE name = 'Mil'), 'quantity', '300', 'unit', 'g'),
      jsonb_build_object('productId', (SELECT id FROM product_ids WHERE name = 'Oignons'), 'quantity', '1', 'unit', 'pièce'),
      jsonb_build_object('productId', (SELECT id FROM product_ids WHERE name = 'Tomates fraîches'), 'quantity', '2', 'unit', 'pièces'),
      jsonb_build_object('productId', (SELECT id FROM product_ids WHERE name = 'Piments verts'), 'quantity', '1', 'unit', 'botte')
    ),
    ARRAY[
      'Faire bouillir de l''eau dans une grande casserole',
      'Incorporer progressivement la farine de mil en remuant',
      'Cuire en remuant constamment pendant 20 minutes',
      'Préparer la sauce avec oignons, tomates et piments',
      'Servir le tô avec la sauce chaude'
    ],
    (SELECT id FROM video_ids WHERE title = 'Préparation du Tô de mil')
  ),
  (
    'Soupe de Gombo aux Épinards',
    'Soupe nourrissante aux légumes verts, riche en vitamines',
    'https://images.unsplash.com/photo-1565499909193-17b67ae8db9e?w=400',
    30,
    4,
    'Facile',
    4.3,
    'Soupes et bouillons',
    jsonb_build_array(
      jsonb_build_object('productId', (SELECT id FROM product_ids WHERE name = 'Gombo'), 'quantity', '300', 'unit', 'g'),
      jsonb_build_object('productId', (SELECT id FROM product_ids WHERE name = 'Oignons'), 'quantity', '1', 'unit', 'pièce'),
      jsonb_build_object('productId', (SELECT id FROM product_ids WHERE name = 'Poisson capitaine'), 'quantity', '200', 'unit', 'g'),
      jsonb_build_object('productId', (SELECT id FROM product_ids WHERE name = 'Gingembre'), 'quantity', '20', 'unit', 'g')
    ),
    ARRAY[
      'Nettoyer et couper le gombo en rondelles',
      'Faire revenir l''oignon dans l''huile',
      'Ajouter le poisson et le gingembre',
      'Incorporer le gombo et couvrir d''eau',
      'Laisser mijoter 20 minutes',
      'Assaisonner et servir chaud'
    ],
    (SELECT id FROM video_ids WHERE title = 'Soupe de gombo aux épinards')
  ),
  (
    'Dégué aux Fruits Tropicaux',
    'Dessert traditionnel malien à base de mil et fruits frais de saison',
    'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400',
    25,
    6,
    'Facile',
    4.6,
    'Desserts',
    jsonb_build_array(
      jsonb_build_object('productId', (SELECT id FROM product_ids WHERE name = 'Mil'), 'quantity', '200', 'unit', 'g'),
      jsonb_build_object('productId', (SELECT id FROM product_ids WHERE name = 'Lait frais'), 'quantity', '500', 'unit', 'ml'),
      jsonb_build_object('productId', (SELECT id FROM product_ids WHERE name = 'Mangues'), 'quantity', '2', 'unit', 'pièces'),
      jsonb_build_object('productId', (SELECT id FROM product_ids WHERE name = 'Papayes'), 'quantity', '1', 'unit', 'pièce')
    ),
    ARRAY[
      'Faire cuire le mil dans le lait avec un peu de sucre',
      'Laisser refroidir complètement',
      'Couper les fruits en petits dés',
      'Mélanger délicatement les fruits au mil refroidi',
      'Réfrigérer 2 heures avant de servir',
      'Servir frais en portions individuelles'
    ],
    (SELECT id FROM video_ids WHERE title = 'Dégué aux fruits')
  )
) AS recipe_data(title, description, image, cook_time, servings, difficulty, rating, category, ingredients, instructions, video_id)
WHERE NOT EXISTS (
  SELECT 1 FROM recipes WHERE recipes.title = recipe_data.title
);

-- Ajout de paniers préconfigurés
INSERT INTO preconfigured_carts (name, description, category, image, items, total_price, is_active, is_featured) 
SELECT 
  cart_data.name,
  cart_data.description,
  cart_data.category,
  cart_data.image,
  cart_data.items,
  cart_data.total_price,
  cart_data.is_active,
  cart_data.is_featured
FROM (VALUES
  (
    'Panier Riz au Gras Complet',
    'Tous les ingrédients pour préparer un délicieux riz au gras pour 6 personnes',
    'Plats traditionnels',
    'https://images.unsplash.com/photo-1516684732162-798a0062be99?w=400',
    jsonb_build_array(
      jsonb_build_object('productId', (SELECT id FROM products WHERE name = 'Riz blanc'), 'quantity', '500', 'unit', 'g'),
      jsonb_build_object('productId', (SELECT id FROM products WHERE name = 'Viande de bœuf'), 'quantity', '400', 'unit', 'g'),
      jsonb_build_object('productId', (SELECT id FROM products WHERE name = 'Tomates fraîches'), 'quantity', '3', 'unit', 'pièces'),
      jsonb_build_object('productId', (SELECT id FROM products WHERE name = 'Oignons'), 'quantity', '2', 'unit', 'pièces'),
      jsonb_build_object('productId', (SELECT id FROM products WHERE name = 'Gombo'), 'quantity', '200', 'unit', 'g')
    ),
    7450,
    true,
    true
  ),
  (
    'Kit Dessert Traditionnel',
    'Ingrédients pour préparer un dégué aux fruits pour toute la famille',
    'Desserts',
    'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400',
    jsonb_build_array(
      jsonb_build_object('productId', (SELECT id FROM products WHERE name = 'Mil'), 'quantity', '200', 'unit', 'g'),
      jsonb_build_object('productId', (SELECT id FROM products WHERE name = 'Lait frais'), 'quantity', '500', 'unit', 'ml'),
      jsonb_build_object('productId', (SELECT id FROM products WHERE name = 'Mangues'), 'quantity', '2', 'unit', 'pièces'),
      jsonb_build_object('productId', (SELECT id FROM products WHERE name = 'Papayes'), 'quantity', '1', 'unit', 'pièce')
    ),
    3300,
    true,
    false
  )
) AS cart_data(name, description, category, image, items, total_price, is_active, is_featured)
WHERE NOT EXISTS (
  SELECT 1 FROM preconfigured_carts WHERE preconfigured_carts.name = cart_data.name
);

-- Ajout de permissions admin pour les utilisateurs existants (prendre les 2 premiers utilisateurs)
WITH existing_users AS (
  SELECT id FROM auth.users LIMIT 2
)
INSERT INTO admin_permissions (user_id, is_super_admin, can_manage_users, can_manage_products, can_manage_recipes, can_manage_videos, can_manage_categories, can_manage_orders, can_validate_orders, can_manage_deliveries)
SELECT 
  id,
  CASE WHEN ROW_NUMBER() OVER() = 1 THEN true ELSE false END as is_super_admin,
  true,
  true,
  true, 
  true,
  true,
  true,
  true,
  true
FROM existing_users
WHERE NOT EXISTS (
  SELECT 1 FROM admin_permissions WHERE admin_permissions.user_id = existing_users.id
);

-- Ajout de quelques favoris pour les utilisateurs
WITH existing_users AS (
  SELECT id FROM auth.users LIMIT 3
),
sample_recipes AS (
  SELECT id FROM recipes LIMIT 2
),
sample_products AS (
  SELECT id FROM products LIMIT 3
)
INSERT INTO favorites (user_id, item_id, type)
SELECT u.id, r.id, 'recipe'
FROM existing_users u
CROSS JOIN sample_recipes r
WHERE NOT EXISTS (
  SELECT 1 FROM favorites WHERE favorites.user_id = u.id AND favorites.item_id = r.id AND favorites.type = 'recipe'
)
UNION ALL
SELECT u.id, p.id, 'product'
FROM existing_users u
CROSS JOIN sample_products p
WHERE NOT EXISTS (
  SELECT 1 FROM favorites WHERE favorites.user_id = u.id AND favorites.item_id = p.id AND favorites.type = 'product'
);
