export interface CommentData {
  name: string[];
  id: string[];
  comment: string[];
  date: string[];
}

export interface CommentValues {
  name: string;
  id: string;
  comment: string;
  date: string;
}

export interface IncomingWebHookResponse {
  signature: string;
  movie: Movie;
  broadcaster: User;
}

export interface Movie {
  id: string;
  user_id: string;
  title: string;
  subtitle: string;
  last_owner_comment?: string;
  category?: string;
  link: string;
  is_live: boolean;
  is_recorded: boolean;
  comment_count: number;
  large_thumbnail: string;
  small_thumbnail: string;
  country: string;
  duration: number;
  created: number;
  is_collabo: boolean;
  is_protected: boolean;
  max_view_count: number;
  current_view_count: number;
  total_view_count: number;
  hls_url?: string;
}

export interface User {
  id: string;
  screen_id: string;
  name: string;
  image: string;
  profile: string;
  level: number;
  last_movie_id?: string;
  is_live: boolean;
  supporter_count: number;
  supporting_count: number;
  created: number;
}
