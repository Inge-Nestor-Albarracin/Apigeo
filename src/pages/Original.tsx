import { useEffect, useState } from 'react';
import type { Country } from '../types/Country';
import './Original.css';

const Original = () => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pais1, setPais1] = useState<Country | null>(null);
  const [pais2, setPais2] = useState<Country | null>(null);
  const [resultado, setResultado] = useState<string>('');

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          'https://restcountries.com/v3.1/region/america?fields=name,capital,population,region,subregion,flags,cca2'
        );
        if (!response.ok) throw new Error('Error al cargar los datos');
        const data: Country[] = await response.json();
        setCountries(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };
    fetchCountries();
  }, []);

  useEffect(() => {
    if (pais1 && pais2) {
      if (pais1.population > pais2.population) {
        setResultado(`${pais1.name.common} tiene mayor población (${pais1.population.toLocaleString()} habitantes) que ${pais2.name.common} (${pais2.population.toLocaleString()})`);
      } else if (pais2.population > pais1.population) {
        setResultado(`${pais2.name.common} tiene mayor población (${pais2.population.toLocaleString()} habitantes) que ${pais1.name.common} (${pais1.population.toLocaleString()})`);
      } else {
        setResultado(`Ambos países tienen la misma población: ${pais1.population.toLocaleString()} habitantes`);
      }
    } else {
      setResultado('');
    }
  }, [pais1, pais2]);

  const handleSelectPais1 = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const cca2 = e.target.value;
    const found = countries.find(c => c.cca2 === cca2);
    setPais1(found || null);
  };

  const handleSelectPais2 = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const cca2 = e.target.value;
    const found = countries.find(c => c.cca2 === cca2);
    setPais2(found || null);
  };

  if (loading) return <div className="loading">Cargando paises de America...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="original-container">
      <h1>Comparador de población</h1>
      <p className="subtitulo">Selecciona dos países de América y descubre cuál tiene más habitantes</p>

      <div className="comparador">
        <div className="selector-pais">
          <label>País 1</label>
          <select onChange={handleSelectPais1} value={pais1?.cca2 || ''}>
            <option value="">-- Selecciona un país --</option>
            {countries.map(pais => (
              <option key={pais.cca2} value={pais.cca2}>
                {pais.name.common}
              </option>
            ))}
          </select>
          {pais1 && (
            <div className="info-pais">
              <img src={pais1.flags.svg} alt={pais1.flags.alt} className="flag" />
              <p><strong>Capital:</strong> {pais1.capital?.[0] || 'N/A'}</p>
              <p><strong>Población:</strong> {pais1.population.toLocaleString()}</p>
            </div>
          )}
        </div>

        <div className="selector-pais">
          <label>País 2</label>
          <select onChange={handleSelectPais2} value={pais2?.cca2 || ''}>
            <option value="">-- Selecciona un país --</option>
            {countries.map(pais => (
              <option key={pais.cca2} value={pais.cca2}>
                {pais.name.common}
              </option>
            ))}
          </select>
          {pais2 && (
            <div className="info-pais">
              <img src={pais2.flags.svg} alt={pais2.flags.alt} className="flag" />
              <p><strong>Capital:</strong> {pais2.capital?.[0] || 'N/A'}</p>
              <p><strong>Población:</strong> {pais2.population.toLocaleString()}</p>
            </div>
          )}
        </div>
      </div>

      {resultado && (
        <div className="resultado">
          <h3>Resultado de la comparación</h3>
          <p>{resultado}</p>
        </div>
      )}
    </div>
  );
};

export default Original;