import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const Header = () => {
  const { t } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { key: 'home', href: '#home' },
    { key: 'skills', href: '#skills' },
    { key: 'experiences', href: '#experiences' },
    { key: 'projects', href: '#projects' },
    { key: 'contact', href: '#contact' },
  ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-black via-gray-800 to-white">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo/Name */}
        <div className="text-white text-xl font-bold">
          Samuel FOTSO
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-8">
          {navItems.map((item) => (
            <a 
              key={item.key}
              href={item.href}
              className="text-white hover:text-gray-300 transition-colors duration-300"
            >
              {t(`nav.${item.key}`)}
            </a>
          ))}
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white focus:outline-none"
          onClick={toggleMenu}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {isMenuOpen ? (
              <path d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-black bg-opacity-90">
          <nav className="px-4 pt-2 pb-4 space-y-2">
            {navItems.map((item) => (
              <a
                key={item.key}
                href={item.href}
                className="block text-white hover:text-gray-300 py-2 transition-colors duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                {t(`nav.${item.key}`)}
              </a>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;