export interface Brand {
  id?: string;
  shop_id?: string;
  name: string;
  description: string | null;
  logo_url: string | null;
  color_scheme: {
    primary: string;
    secondary: string;
  } | null;
  created_at?: string;
  updated_at?: string;
}