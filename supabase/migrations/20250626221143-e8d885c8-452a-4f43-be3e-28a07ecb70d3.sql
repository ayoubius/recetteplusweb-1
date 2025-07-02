
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create user profiles table
CREATE TABLE public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text,
  display_name text,
  photo_url text,
  role text default 'user' check (role in ('user', 'admin')),
  preferences jsonb default '{"dietaryRestrictions": [], "favoriteCategories": []}',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create categories tables
CREATE TABLE public.product_categories (
  id uuid default uuid_generate_v4() primary key,
  name text not null unique,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

CREATE TABLE public.recipe_categories (
  id uuid default uuid_generate_v4() primary key,
  name text not null unique,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create products table
CREATE TABLE public.products (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  image text,
  price decimal(10,2) not null,
  unit text not null,
  category text not null,
  rating decimal(2,1) default 0,
  in_stock boolean default true,
  promotion jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create recipes table
CREATE TABLE public.recipes (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text,
  image text,
  cook_time integer not null,
  servings integer not null,
  difficulty text check (difficulty in ('Facile', 'Moyen', 'Difficile')),
  rating decimal(2,1) default 0,
  category text not null,
  ingredients jsonb not null,
  instructions text[] not null,
  video_id uuid,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  created_by uuid references auth.users on delete cascade not null
);

-- Create videos table
CREATE TABLE public.videos (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text,
  cloudinary_public_id text not null,
  thumbnail text,
  duration text,
  views integer default 0,
  likes integer default 0,
  category text not null,
  recipe_id uuid references public.recipes(id) on delete set null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  created_by uuid references auth.users on delete cascade not null
);

-- Create favorites table
CREATE TABLE public.favorites (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  item_id uuid not null,
  type text check (type in ('recipe', 'product', 'video')) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, item_id, type)
);

-- Create cart items table
CREATE TABLE public.cart_items (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  product_id uuid references public.products(id) on delete cascade not null,
  quantity integer not null default 1,
  cart_type text check (cart_type in ('custom', 'recipe', 'preconfigured')) default 'custom',
  recipe_id uuid references public.recipes(id) on delete cascade,
  preconfigured_cart_id uuid,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create recipe carts table
CREATE TABLE public.recipe_carts (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  recipe_id uuid references public.recipes(id) on delete cascade not null,
  recipe_name text not null,
  cart_items uuid[] default array[]::uuid[],
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create preconfigured carts table
CREATE TABLE public.preconfigured_carts (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  description text,
  items jsonb not null,
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recipe_carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.preconfigured_carts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for products (public read, admin write)
CREATE POLICY "Anyone can view products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Admins can manage products" ON public.products FOR ALL USING (
  EXISTS(SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- RLS Policies for recipes
CREATE POLICY "Anyone can view recipes" ON public.recipes FOR SELECT USING (true);
CREATE POLICY "Users can create recipes" ON public.recipes FOR INSERT WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Users can update own recipes" ON public.recipes FOR UPDATE USING (auth.uid() = created_by);
CREATE POLICY "Users can delete own recipes" ON public.recipes FOR DELETE USING (auth.uid() = created_by);
CREATE POLICY "Admins can manage all recipes" ON public.recipes FOR ALL USING (
  EXISTS(SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- RLS Policies for videos
CREATE POLICY "Anyone can view videos" ON public.videos FOR SELECT USING (true);
CREATE POLICY "Users can create videos" ON public.videos FOR INSERT WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Users can update own videos" ON public.videos FOR UPDATE USING (auth.uid() = created_by);
CREATE POLICY "Users can delete own videos" ON public.videos FOR DELETE USING (auth.uid() = created_by);
CREATE POLICY "Admins can manage all videos" ON public.videos FOR ALL USING (
  EXISTS(SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- RLS Policies for favorites
CREATE POLICY "Users can view own favorites" ON public.favorites FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own favorites" ON public.favorites FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for cart items
CREATE POLICY "Users can view own cart items" ON public.cart_items FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own cart items" ON public.cart_items FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for recipe carts
CREATE POLICY "Users can view own recipe carts" ON public.recipe_carts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own recipe carts" ON public.recipe_carts FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for preconfigured carts
CREATE POLICY "Anyone can view active preconfigured carts" ON public.preconfigured_carts FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage preconfigured carts" ON public.preconfigured_carts FOR ALL USING (
  EXISTS(SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name, photo_url)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'display_name', new.raw_user_meta_data->>'full_name', new.email),
    new.raw_user_meta_data->>'avatar_url'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Insert default categories
INSERT INTO public.product_categories (name) VALUES 
  ('Légumes'), ('Fruits'), ('Viandes'), ('Poissons'), ('Produits laitiers'), 
  ('Céréales'), ('Légumineuses'), ('Épices'), ('Condiments'), ('Boissons');

INSERT INTO public.recipe_categories (name) VALUES 
  ('Entrées'), ('Plats principaux'), ('Desserts'), ('Boissons'), ('Salades'), 
  ('Soupes'), ('Grillades'), ('Pâtisseries'), ('Cuisine traditionnelle'), ('Cuisine internationale');
