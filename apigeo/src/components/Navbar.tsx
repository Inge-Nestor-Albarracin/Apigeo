import { NavLink } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <ul>
        <li><NavLink to="/" end>Home</NavLink></li>
        <li><NavLink to="/favoritos">Favoritos</NavLink></li>
        <li><NavLink to="/original">Original</NavLink></li>
        <li><NavLink to="/informativa">Informativa</NavLink></li>
        <li><NavLink to="/usuario">Usuario</NavLink></li>
      </ul>
    </nav>
  );
};

export default Navbar;