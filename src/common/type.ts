export type Anime = {
  aired: Date;
  id?: number;
  studios: string[];
  episodes_count: number;
  title: string;
  sequel_id?: number;
  prequel_id?: number;
  characters?: any[];
  synopsis: string;
};
