import React from 'react';

/**
 * UiverseButton Component
 * Features the expandable fill hover effect by Gaurav-WebDev (Uiverse.io).
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Button label or content
 * @param {string} [props.variant='default'] - 'default' (#252525) or 'amber' (#D47E30 theme accent)
 * @param {boolean} [props.fullWidth=false] - Whether button spans 100% width
 * @param {string} [props.className=''] - Additional CSS classes
 * @param {React.ButtonHTMLAttributes<HTMLButtonElement>} props - Standard button props (onClick, type, disabled, etc.)
 */
export const UiverseButton = ({
  children,
  variant = 'default',
  fullWidth = false,
  className = '',
  type = 'button',
  ...props
}) => {
  const isAmber = variant === 'amber';
  
  const baseClass = `button type1 ${isAmber ? 'button-amber type1-amber' : ''} ${fullWidth ? 'button-full' : ''} ${className}`;

  return (
    <button type={type} className={baseClass.trim()} {...props}>
      <span className="btn-txt">{children}</span>
    </button>
  );
};

export default UiverseButton;
