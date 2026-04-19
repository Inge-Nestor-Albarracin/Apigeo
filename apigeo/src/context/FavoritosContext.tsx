import React, { createContext, useState, useContext, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Country } from '../types/Country';

interface FavoritosContextType {
  favoritos: Country[];
  agregarFavorito: (pais: Country) => void;
  eliminarFavorito: (cca2: string) => void;
  esFavorito: (cca2: string) => boolean;
}

const FavoritosContext = createContext<FavoritosContextType | undefined>(undefined);

export const FavoritosProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [favoritos, setFavoritos] = useState<Country[]>(() => {
    const stored = localStorage.getItem('favoritos');
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem('favoritos', JSON.stringify(favoritos));
  }, [favoritos]);

  const agregarFavorito = (pais: Country) => {
    setFavoritos((prev) => [...prev, pais]);
  };

  const eliminarFavorito = (cca2: string) => {
    setFavoritos((prev) => prev.filter((p) => p.cca2 !== cca2));
  };

  const esFavorito = (cca2: string) => {
    return favoritos.some((p) => p.cca2 === cca2);
  };

  return (
    <FavoritosContext.Provider value={{ favoritos, agregarFavorito, eliminarFavorito, esFavorito }}>
      {children}
    </FavoritosContext.Provider>
  );
};

export const useFavoritos = () => {
  const context = useContext(FavoritosContext);
  if (!context) throw new Error('useFavoritos must be used within FavoritosProvider');
  return context;
};