import '../styles/LoadingSpinner.scss';

const LoadingSpinner = ({ fullPage = false }) => {
  return (
    <div className={`loading-spinner ${fullPage ? 'full-page' : ''}`}>
      <div className="spinner">
        <div className="double-bounce1"></div>
        <div className="double-bounce2"></div>
      </div>
      <p>Loading...</p>
    </div>
  );
};

export default LoadingSpinner;