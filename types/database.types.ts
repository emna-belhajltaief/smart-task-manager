export interface Board {
  id: string;
  workspace_id: string;
  name: string;
  description: string | null;
  background_color: string | null;
  is_favorite: boolean;
  is_archived: boolean;
  created_at: string;
  updated_at: string;
}
export interface profiles {
  id: string;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  updated_at: string ;
  created_at: string ;

}


