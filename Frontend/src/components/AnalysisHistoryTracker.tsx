import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { addToAnalysisHistory } from '../Settings/history';

/**
 * This component tracks when a stock is analyzed and adds it to the analysis history.
 * It should be included once in the main App component.
 */
const AnalysisHistoryTracker = () => {
  const location = useLocation();

  useEffect(() => {
    // Check if we're on the analysis page with a ticker parameter
    if (location.pathname === '/analysis') {
      const searchParams = new URLSearchParams(location.search);
      const ticker = searchParams.get('ticker');
      
      if (ticker) {
        console.log(`AnalysisHistoryTracker detected stock analysis for: ${ticker}`);
        addToAnalysisHistory(ticker);
      }
    }
  }, [location]);

  // This component doesn't render anything
  return null;
};

export default AnalysisHistoryTracker; 