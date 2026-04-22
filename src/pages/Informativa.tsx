import { useEffect, useState } from 'react';
import type { Country } from '../types/Country';
import './Informativa.css';

const Informativa = () => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          'https://restcountries.com/v3.1/region/america?fields=name,capital,population,region,subregion,flags,cca2'
        );
        if (!response.ok) throw new Error('Error al cargar los datos');
        const data: Country[] = await response.json();
        // Ordenar alfabéticamente por nombre común
        data.sort((a, b) => a.name.common.localeCompare(b.name.common));
        setCountries(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };
    fetchCountries();
  }, []);

  const handleCountryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const cca2 = event.target.value;
    const country = countries.find(c => c.cca2 === cca2);
    setSelectedCountry(country || null);
  };

  if (loading) return <div className="loading">Cargando paises de America...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="informativa-container">
      <h1>Información de países</h1>
      <p className="subtitulo">Selecciona un país para ver su información detallada</p>

      <div className="selector-wrapper">
        <select onChange={handleCountryChange} value={selectedCountry?.cca2 || ''}>
          <option value="">-- Selecciona un país --</option>
          {countries.map(country => (
            <option key={country.cca2} value={country.cca2}>
              {country.name.common}
            </option>
          ))}
        </select>
      </div>

      {selectedCountry && (
        <div className="country-card">
          <div className="flag-container">
            <img 
              src={selectedCountry.flags.svg} 
              alt={selectedCountry.flags.alt || `Bandera de ${selectedCountry.name.common}`}
              className="country-flag"
            />
          </div>
          <div className="country-info">
            <h2>{selectedCountry.name.common}</h2>
            <p><strong>Nombre oficial:</strong> {selectedCountry.name.official}</p>
            <p><strong>Capital:</strong> {selectedCountry.capital?.[0] || 'N/A'}</p>
            <p><strong>Población:</strong> {selectedCountry.population.toLocaleString()}</p>
            <p><strong>Región:</strong> {selectedCountry.region}</p>
            <p><strong>Subregión:</strong> {selectedCountry.subregion}</p>
            <p><strong>Código:</strong> {selectedCountry.cca2}</p>
          </div>
        </div>
      )}

      {!selectedCountry && countries.length > 0 && (
        <div className="placeholder">
          <p> Selecciona un país del menú desplegable para ver su información</p>
        </div>
      )}
    </div>
  );
};

export default Informativa;