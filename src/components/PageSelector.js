import React from 'react';
import { FiCheck, FiX, FiEdit2, FiEye, FiEyeOff } from 'react-icons/fi';

const PageSelector = ({ pages, currentPage, setCurrentPage, setShowPageSelector, togglePage }) => {
  const handlePageSelect = (pageId) => {
    setCurrentPage(pageId);
    setShowPageSelector(false);
  };

  return (
    <div className="page-selector-modal">
      <div className="page-selector-container">
        <div className="page-selector-header">
          <h2>Select Page</h2>
          <button 
            className="close-btn"
            onClick={() => setShowPageSelector(false)}
          >
            <FiX />
          </button>
        </div>

        <div className="page-list">
          {Object.values(pages).map(page => (
            <div 
              key={page.id} 
              className={`page-item ${currentPage === page.id ? 'active' : ''} ${page.enabled ? '' : 'disabled'}`}
              onClick={() => handlePageSelect(page.id)}
            >
              <div className="page-info">
                <div className="page-icon">
                  <FiEdit2 />
                </div>
                <div className="page-details">
                  <h3>{page.title}</h3>
                  <p className="page-id">{page.id}</p>
                </div>
              </div>
              
              <div className="page-actions">
                <button
                  className={`toggle-btn ${page.enabled ? 'enabled' : 'disabled'}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    togglePage(page.id);
                  }}
                  title={page.enabled ? 'Disable page' : 'Enable page'}
                >
                  {page.enabled ? <FiEye /> : <FiEyeOff />}
                </button>
                
                {currentPage === page.id && (
                  <div className="current-indicator">
                    <FiCheck />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="page-selector-footer">
          <p className="hint-text">
            {pages[currentPage]?.enabled 
              ? 'This page is included in your export' 
              : 'This page will not be included in your export'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PageSelector;