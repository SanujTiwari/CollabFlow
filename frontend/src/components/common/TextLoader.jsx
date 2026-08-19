import React from 'react';

/**
 * TextLoader Component
 * Sliced text loading effect with animated wave scrolling and wobble line.
 * 
 * @param {Object} props
 * @param {string} [props.text='LOADING'] - Text to display in loader
 * @param {'default'|'amber'|'white'} [props.variant='default'] - Color scheme
 * @param {string} [props.size] - Custom CSS size override (e.g. '2em', '3em')
 * @param {boolean} [props.fullScreen=false] - Whether to center in full screen container
 * @param {string} [props.className=''] - Additional wrapper CSS classes
 */
export const TextLoader = ({
  text = 'LOADING',
  variant = 'default',
  size,
  fullScreen = false,
  className = '',
}) => {
  const variantClass =
    variant === 'white'
      ? 'loader-white'
      : variant === 'amber'
      ? 'loader-amber'
      : '';

  const loaderStyle = size ? { '--main-size': size } : undefined;

  const loaderJsx = (
    <div
      className={`loader ${variantClass} ${className}`.trim()}
      style={loaderStyle}
    >
      {[...Array(9)].map((_, i) => (
        <div key={i} className="text">
          <span>{text}</span>
        </div>
      ))}
      <div className="line" />
    </div>
  );

  if (fullScreen) {
    return (
      <div className="min-h-screen bg-[#F4F1EC] flex flex-col items-center justify-center p-6">
        {loaderJsx}
      </div>
    );
  }

  return loaderJsx;
};

export default TextLoader;
