export interface FacebookResponse {
  id?: string;
  email?: string;
  name?: string;
  picture?: {
    data: {
      height: number;
      width: string;
      is_silhouette: boolean;
      url: string;
    };
  };
}
