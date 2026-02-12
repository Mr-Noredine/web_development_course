import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Header = () => {
  const location = useLocation();
  const { user, logout } = useAuth();

  const isActive = (path) => {
    return location.pathname === path ? 'nav-active' : '';
  };

  return (
    <header>
      <nav>
        <ul>
          <li>
            <Link to="/" className={isActive('/')}>
              Accueil
            </Link>
          </li>
          <li>
            <Link to="/quiz" className={isActive('/quiz')}>
              Quiz
            </Link>
          </li>
          <li>
            <Link to="/exercices" className={isActive('/exercices')}>
              Exercices
            </Link>
          </li>
          {user && (
            <li>
              <Link to="/dashboard" className={isActive('/dashboard')}>
                Dashboard
              </Link>
            </li>
          )}

          {/* Language switcher */}
          <li className="lang-switcher">
            <span className="lang-option active" data-lang="fr">
              FR
            </span>
            <span className="lang-divider">|</span>
            <span className="lang-option" data-lang="en">
              EN
            </span>
          </li>

          {/* Auth buttons */}
          {user ? (
            <>
              <li>
                <span style={{ color: '#757575', fontSize: '0.9rem' }}>
                  Bonjour, {user.firstname}
                </span>
              </li>
              <li>
                <button onClick={logout} className="btn-login">
                  Déconnexion
                </button>
              </li>
            </>
          ) : (
            <li>
              <Link to="/auth" className="btn-login">
                Connexion
              </Link>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;