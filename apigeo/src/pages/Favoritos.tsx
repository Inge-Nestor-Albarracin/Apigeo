import { useFavoritos } from '../context/FavoritosContext';
import './Favoritos.css';

const Favoritos = () => {
  const { favoritos, eliminarFavorito } = useFavoritos();

  if (favoritos.length === 0) {
    return <div className="favoritos-container">No tienes paises favoritos.</div>;
  }

  return (
    <div className="favoritos-container">
      <h1>Mis Paises Favoritos</h1>
      <div className="table-responsive">
        <table className="favoritos-table">
          <thead>
            <tr>
              <th>Bandera</th>
              <th>Nombre</th>
              <th>Capital</th>
              <th>Poblacion</th>
              <th>Accion</th>
            </tr>
          </thead>
          <tbody>
            {favoritos.map((pais) => (
              <tr key={pais.cca2}>
                <td><img src={pais.flags.svg} alt={pais.flags.alt} className="flag" /></td>
                <td>{pais.name.common}</td>
                <td>{pais.capital?.[0] || 'N/A'}</td>
                <td>{pais.population.toLocaleString()}</td>
                <td>
                  <button className="fav-btn remove" onClick={() => eliminarFavorito(pais.cca2)}>
                    Eliminar
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

export default Favoritos;