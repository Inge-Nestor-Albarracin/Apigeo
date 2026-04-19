export type Country ={
  name: {
    common: string;
    official: string;
  };
  capital: string[];
  population: number;
  region: string;
  subregion: string;
  flags: {
    svg: string;
    png: string;
    alt: string;
  };
  cca2: string;
}