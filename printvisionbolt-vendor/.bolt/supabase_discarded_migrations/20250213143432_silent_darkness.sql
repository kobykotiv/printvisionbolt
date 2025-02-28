/*
  # Templates and Products Schema
  
  1. Core Tables
    - templates (product templates)
    - template_designs (design mappings)
    - products (final products)
  
  2. Security
    - RLS policies for all tables
    - Shop-based access control
*/

-- Create templates table
CREATE TABLE templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_id uuid REFERENCES shops NOT NULL,
  title text NOT NULL,
  description text,
  status product_status DEFAULT 'draft',
  tags text[],
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create template_designs junction table
CREATE TABLE template_designs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id uuid REFERENCES templates ON DELETE CASCADE,
  design_id uuid REFERENCES designs ON DELETE CASCADE,
  placement_data jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(template_id, design_id)
);

-- Create products table
CREATE TABLE products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_id uuid REFERENCES shops NOT NULL,
  template_id uuid REFERENCES templates,
  title text NOT NULL,
  description text,
  sku text,
  status product_status DEFAULT 'draft',
  pricing jsonb NOT NULL DEFAULT '{}'::jsonb,
  variants jsonb[] DEFAULT ARRAY[]::jsonb[],
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(shop_id, sku)
);

-- Enable RLS
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE template_designs ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- RLS Policies for templates
CREATE POLICY "Users can access shop templates"
  ON templates FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.shop_id = templates.shop_id
    )
  );

-- RLS Policies for template_designs
CREATE POLICY "Users can access template designs"
  ON template_designs FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM templates t
      JOIN user_roles ur ON ur.shop_id = t.shop_id
      WHERE t.id = template_designs.template_id
      AND ur.user_id = auth.uid()
    )
  );

-- RLS Policies for products
CREATE POLICY "Users can access shop products"
  ON products FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.shop_id = products.shop_id
    )
  );

-- Add indexes for performance
CREATE INDEX idx_templates_shop_id ON templates(shop_id);
CREATE INDEX idx_templates_status ON templates(status);
CREATE INDEX idx_template_designs_template_id ON template_designs(template_id);
CREATE INDEX idx_template_designs_design_id ON template_designs(design_id);
CREATE INDEX idx_products_shop_id ON products(shop_id);
CREATE INDEX idx_products_template_id ON products(template_id);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_sku ON products(shop_id, sku);

-- Add updated_at triggers
CREATE TRIGGER update_templates_updated_at
  BEFORE UPDATE ON templates
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_template_designs_updated_at
  BEFORE UPDATE ON template_designs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();