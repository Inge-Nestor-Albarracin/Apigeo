import { useEffect, useState } from 'react';
import type { Country } from '../types/Country';
import { useFavoritos } from '../context/FavoritosContext';
import './Home.css';

type OrderColumn = 'name' | 'population' | 'capital' | 'region';
type OrderDirection = 'asc' | 'desc';

const Home = () => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [filteredCountries, setFilteredCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [orderColumn, setOrderColumn] = useState<OrderColumn>('name');
  const [orderDirection, setOrderDirection] = useState<OrderDirection>('asc');
  const { agregarFavorito, eliminarFavorito, esFavorito } = useFavoritos();

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
    let result = [...countries];

    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (pais) =>
          pais.name.common.toLowerCase().includes(term) ||
          (pais.capital?.[0]?.toLowerCase() || '').includes(term) ||
          pais.region.toLowerCase().includes(term) ||
          pais.subregion.toLowerCase().includes(term)
      );
    }

    result.sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      switch (orderColumn) {
        case 'name':
          aValue = a.name.common;
          bValue = b.name.common;
          break;
        case 'population':
          aValue = a.population;
          bValue = b.population;
          break;
        case 'capital':
          aValue = a.capital?.[0] || '';
          bValue = b.capital?.[0] || '';
          break;
        case 'region':
          aValue = a.region;
          bValue = b.region;
          break;
        default:
          aValue = a.name.common;
          bValue = b.name.common;
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return orderDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }

      const aStr = String(aValue).toLowerCase();
      const bStr = String(bValue).toLowerCase();
      if (orderDirection === 'asc') {
        return aStr.localeCompare(bStr);
      } else {
        return bStr.localeCompare(aStr);
      }
    });

    setFilteredCountries(result);
  }, [countries, searchTerm, orderColumn, orderDirection]);

  const handleFavorito = (pais: Country) => {
    if (esFavorito(pais.cca2)) {
      eliminarFavorito(pais.cca2);
    } else {
      agregarFavorito(pais);
    }
  };

  const toggleOrderDirection = () => {
    setOrderDirection(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  if (loading) return <div className="loading">Cargando paises de America...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="home-container">
      <h1>Paises de America</h1>
      
      <div className="controls">
        <div className="search-box">
          <input
            type="text"
            placeholder="Buscar por nombre, capital, region..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="order-controls">
          <select
            value={orderColumn}
            onChange={(e) => setOrderColumn(e.target.value as OrderColumn)}
          >
            <option value="name">Nombre</option>
            <option value="population">Poblacion</option>
            <option value="capital">Capital</option>
            <option value="region">Region</option>
          </select>
          
          <button onClick={toggleOrderDirection}>
            {orderDirection === 'asc' ? 'Ascendente' : 'Descendente (mayor a menor)'}
          </button>
        </div>
      </div>
      
      <div className="table-responsive">
        <table className="countries-table">
          <thead>
            <tr>
              <th>Bandera</th>
              <th>Nombre</th>
              <th>Capital</th>
              <th>Poblacion</th>
              <th>Region</th>
              <th>Subregion</th>
              <th>Accion</th>
            </tr>
          </thead>
          <tbody>
            {filteredCountries.map((pais) => (
              <tr key={pais.cca2}>
                <td>
                  <img src={pais.flags.svg} alt={pais.flags.alt || `Bandera de ${pais.name.common}`} className="flag" />
                </td>
                <td>{pais.name.common}</td>
                <td>{pais.capital?.[0] || 'N/A'}</td>
                <td>{pais.population.toLocaleString()}</td>
                <td>{pais.region}</td>
                <td>{pais.subregion}</td>
                <td>
                  <button
                    className={`fav-btn ${esFavorito(pais.cca2) ? 'remove' : 'add'}`}
                    onClick={() => handleFavorito(pais)}
                  >
                    {esFavorito(pais.cca2) ? 'Quitar' : 'Agregar'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Home;