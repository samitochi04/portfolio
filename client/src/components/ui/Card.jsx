import { forwardRef } from 'react';

const Card = forwardRef(({ 
  children, 
  variant = 'default',
  className = '',
  hover = false,
  ...props 
}, ref) => {
  const baseClasses = 'bg-white border border-gray-200 rounded-lg shadow-sm transition-all duration-300';
  
  const variants = {
    default: 'bg-white border-gray-200',
    dark: 'bg-gray-900 border-gray-700 text-white',
    glass: 'bg-white/10 backdrop-blur-md border-white/20',
    gradient: 'bg-gradient-to-br from-white to-gray-50 border-gray-200',
  };

  const hoverClasses = hover ? 'hover:shadow-lg hover:scale-105 cursor-pointer' : '';
  
  const classes = `${baseClasses} ${variants[variant]} ${hoverClasses} ${className}`;

  return (
    <div
      ref={ref}
      className={classes}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = 'Card';

// Card sub-components
const CardHeader = ({ children, className = '', ...props }) => (
  <div className={`px-6 py-4 border-b border-gray-200 ${className}`} {...props}>
    {children}
  </div>
);

const CardBody = ({ children, className = '', ...props }) => (
  <div className={`px-6 py-4 ${className}`} {...props}>
    {children}
  </div>
);

const CardFooter = ({ children, className = '', ...props }) => (
  <div className={`px-6 py-4 border-t border-gray-200 ${className}`} {...props}>
    {children}
  </div>
);

Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;

export default Card;