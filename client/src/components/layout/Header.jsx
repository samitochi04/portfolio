import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const Header = () => {
  const { t, i18n } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);

  const navItems = [
    { key: 'home', href: '#home' },
    { key: 'skills', href: '#skills' },
    { key: 'experiences', href: '#experiences' },
    { key: 'projects', href: '#projects' },
    { key: 'contact', href: '#contact' },
  ];

  const languages = [
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' }
  ];

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleLanguageDropdown = () => {
    setIsLanguageDropdownOpen(!isLanguageDropdownOpen);
  };

  const changeLanguage = (languageCode) => {
    i18n.changeLanguage(languageCode);
    setIsLanguageDropdownOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-black via-gray-800 to-white">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo/Name */}
        <div className="text-white text-xl font-bold">
          Samuel FOTSO
        </div>

        {/* Desktop Navigation and Language Selector */}
        <div className="hidden md:flex items-center space-x-8">
          <nav className="flex space-x-8">
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

          {/* Language Dropdown */}
          <div className="relative">
            <button
              onClick={toggleLanguageDropdown}
              className="flex items-center space-x-2 text-white hover:text-gray-300 transition-colors duration-300 bg-white/10 px-3 py-2 rounded-lg backdrop-blur-sm"
            >
              <span>{currentLanguage.flag}</span>
              <span className="text-sm font-medium">{currentLanguage.code.toUpperCase()}</span>
              <svg
                className={`w-4 h-4 transition-transform duration-200 ${isLanguageDropdownOpen ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Language Dropdown Menu */}
            {isLanguageDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-black/90 backdrop-blur-md border border-white/10 rounded-lg shadow-lg">
                {languages.map((language) => (
                  <button
                    key={language.code}
                    onClick={() => changeLanguage(language.code)}
                    className={`w-full text-left px-4 py-3 text-white hover:bg-white/10 transition-colors duration-200 flex items-center space-x-3 ${
                      currentLanguage.code === language.code ? 'bg-white/5' : ''
                    }`}
                  >
                    <span>{language.flag}</span>
                    <span className="text-sm">{language.name}</span>
                    {currentLanguage.code === language.code && (
                      <svg className="w-4 h-4 ml-auto text-green-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

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
            
            {/* Mobile Language Selection */}
            <div className="border-t border-white/20 pt-4 mt-4">
              <p className="text-white/60 text-sm mb-2">Language</p>
              <div className="space-y-2">
                {languages.map((language) => (
                  <button
                    key={language.code}
                    onClick={() => {
                      changeLanguage(language.code);
                      setIsMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-white hover:bg-white/10 transition-colors duration-200 flex items-center space-x-3 rounded ${
                      currentLanguage.code === language.code ? 'bg-white/5' : ''
                    }`}
                  >
                    <span>{language.flag}</span>
                    <span className="text-sm">{language.name}</span>
                    {currentLanguage.code === language.code && (
                      <svg className="w-4 h-4 ml-auto text-green-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;