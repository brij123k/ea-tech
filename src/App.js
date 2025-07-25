import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import PageSelector from './components/PageSelector';
import PageEditor from './components/PageEditor';
import SettingsPanel from './components/SettingsPanel';
import { defaultPages } from './data/pages';
import './App.css';

function App() {
  const [pages, setPages] = useState(() => {
    // Initialize from localStorage if available
    const savedPages = localStorage.getItem('pageBuilderPages');
    return savedPages ? JSON.parse(savedPages) : defaultPages;
  });
  const [currentPage, setCurrentPage] = useState('cover');
  const [showSettings, setShowSettings] = useState(false);
  const [showPageSelector, setShowPageSelector] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);

  // Save pages to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('pageBuilderPages', JSON.stringify(pages));
  }, [pages]);

  const updatePageComponent = (pageId, component, updates) => {
    setPages(prev => ({
      ...prev,
      [pageId]: {
        ...prev[pageId],
        components: {
          ...prev[pageId].components,
          [component]: {
            ...prev[pageId].components[component],
            ...updates
          }
        }
      }
    }));
  };

// In App.js
const updatePage = (pageId, updates) => {
  if (updates.backgroundImage) {
    // Apply background to all pages
    setPages(prev => {
      const newPages = {...prev};
      Object.keys(newPages).forEach(key => {
        newPages[key] = {
          ...newPages[key],
          backgroundImage: updates.backgroundImage
        };
      });
      return newPages;
    });
  } else {
    // Normal page update
    setPages(prev => ({
      ...prev,
      [pageId]: {
        ...prev[pageId],
        ...updates
      }
    }));
  }
};

  const togglePage = (pageId) => {
    updatePage(pageId, { enabled: !pages[pageId].enabled });
  };

  const addNewPage = (pageType) => {
    const newPageId = `${pageType}-${Date.now()}`;
    const newPage = {
      id: newPageId,
      title: `New ${pageType.charAt(0).toUpperCase() + pageType.slice(1)} Page`,
      enabled: true,
      backgroundImage: null,
      components: getDefaultComponentsForPageType(pageType)
    };
    
    setPages(prev => ({ ...prev, [newPageId]: newPage }));
    setCurrentPage(newPageId);
  };

  const removeComponent = (pageId, componentId) => {
  setPages(prev => {
    const updatedComponents = { ...prev[pageId].components };
    delete updatedComponents[componentId];
    return {
      ...prev,
      [pageId]: {
        ...prev[pageId],
        components: updatedComponents
      }
    };
  });
};

  const getDefaultComponentsForPageType = (pageType) => {
    // Return different default components based on page type
    switch(pageType) {
      case 'terms':
        return {
          title: { 
            text: 'Terms & Conditions', 
            position: { x: 100, y: 100 },
            style: {
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#000000',
              backgroundColor: 'rgba(255,255,255,0.8)',
              padding: '10px',
              borderRadius: '4px'
            }
          },
          content: { 
            text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...', 
            position: { x: 100, y: 150 },
            style: {
              fontSize: '16px',
              color: '#333333',
              backgroundColor: 'rgba(255,255,255,0.8)',
              padding: '15px',
              borderRadius: '4px',
              maxWidth: '500px'
            }
          }
        };

        
      // Add cases for other page types
      default:
        return defaultPages.cover.components;
    }
  };

  const handleZoomChange = (newZoomLevel) => {
    setZoomLevel(Math.min(Math.max(newZoomLevel, 0.5), 2)); // Keep between 50% and 200%
  };

  return (
    <div className="app">
      <Header 
        pages={pages}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        setShowSettings={setShowSettings}
        setShowPageSelector={setShowPageSelector}
        addNewPage={addNewPage}
      />
      
      {showPageSelector && (
        <PageSelector 
          pages={pages} 
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          setShowPageSelector={setShowPageSelector}
          togglePage={togglePage}
          addNewPage={addNewPage}
        />
      )}

      <div className="content">
        {showSettings && (
          <SettingsPanel 
            page={pages[currentPage]} 
            currentPage={currentPage}
            updatePage={updatePage}
            updatePageComponent={updatePageComponent}
            togglePage={togglePage}
            removeComponent={removeComponent}
          />
        )}
        
        <PageEditor 
          page={pages[currentPage]} 
          currentPage={currentPage}
          updatePageComponent={updatePageComponent}
          zoomLevel={zoomLevel}
          onZoomChange={handleZoomChange}
        />
      </div>
    </div>
  );
}



export default App;