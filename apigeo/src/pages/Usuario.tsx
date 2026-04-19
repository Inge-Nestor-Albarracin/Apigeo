import { useEffect, useState } from 'react';
import type { Country } from '../types/Country';
import './Usuario.css';

const Usuario = () => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nombre, setNombre] = useState('');
  const [edad, setEdad] = useState('');
  const [paisSeleccionado, setPaisSeleccionado] = useState<Country | null>(null);
  const [enviado, setEnviado] = useState(false);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          'https://restcountries.com/v3.1/region/america?fields=name,capital,population,region,flags,cca2'
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (nombre.trim() === '' || edad === '' || !paisSeleccionado) {
      alert('Por favor completa todos los campos');
      return;
    }
    const edadNum = parseInt(edad);
    if (isNaN(edadNum) || edadNum < 0 || edadNum > 150) {
      alert('Ingresa una edad válida entre 0 y 150 años');
      return;
    }
    setEnviado(true);
  };

  const handleReset = () => {
    setNombre('');
    setEdad('');
    setPaisSeleccionado(null);
    setEnviado(false);
  };

  if (loading) return <div className="loading">Cargando lista de paises...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="usuario-container">
      <h1>Datos del usuario</h1>
      
      {!enviado ? (
        <form onSubmit={handleSubmit} className="usuario-form">
          <div className="form-group">
            <label htmlFor="nombre">Nombre completo</label>
            <input
              type="text"
              id="nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej: Ana María Pérez"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="edad">Edad (años)</label>
            <input
              type="number"
              id="edad"
              value={edad}
              onChange={(e) => setEdad(e.target.value)}
              placeholder="18"
              min="0"
              max="150"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="pais">País de origen</label>
            <select
              id="pais"
              value={paisSeleccionado?.cca2 || ''}
              onChange={(e) => {
                const cca2 = e.target.value;
                const pais = countries.find(c => c.cca2 === cca2);
                setPaisSeleccionado(pais || null);
              }}
              required
            >
              <option value="">-- Selecciona un país --</option>
              {countries.map(pais => (
                <option key={pais.cca2} value={pais.cca2}>
                  {pais.name.common}
                </option>
              ))}
            </select>
          </div>

          {paisSeleccionado && (
            <div className="vista-previa-pais">
              <img src={paisSeleccionado.flags.svg} alt={`Bandera de ${paisSeleccionado.name.common}`} className="flag-preview" />
              <div className="pais-info-preview">
                <p><strong>Capital:</strong> {paisSeleccionado.capital?.[0] || 'N/A'}</p>
                <p><strong>Población:</strong> {paisSeleccionado.population.toLocaleString()}</p>
                <p><strong>Región:</strong> {paisSeleccionado.region}</p>
              </div>
            </div>
          )}

          <div className="form-buttons">
            <button type="submit" className="btn-submit">Guardar datos</button>
            <button type="button" className="btn-reset" onClick={handleReset}>Limpiar</button>
          </div>
        </form>
      ) : (
        <div className="datos-enviados">
          <h2>Datos registrados</h2>
          <div className="tarjeta-usuario">
            <p><strong>Nombre:</strong> {nombre}</p>
            <p><strong>Edad:</strong> {edad} años</p>
            <p><strong>País:</strong> {paisSeleccionado?.name.common}</p>
            {paisSeleccionado && (
              <img src={paisSeleccionado.flags.svg} alt="Bandera" className="flag-resultado" />
            )}
          </div>
          <button onClick={handleReset} className="btn-nuevo">Registrar otro usuario</button>
        </div>
      )}
    </div>
  );
};

export default Usuario;