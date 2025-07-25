import React, { useRef, useState, useEffect } from 'react';
import Draggable from 'react-draggable';
import { FiZoomIn, FiZoomOut, FiMaximize, FiEdit } from 'react-icons/fi';
import { EditorState, convertFromRaw } from 'draft-js';

const PageEditor = ({ page, currentPage, updatePageComponent }) => {
  const refs = useRef({});
  const [zoomLevel, setZoomLevel] = useState(1);
  const [EditorStates, setEditorStates] = useState({});
  const [showEmptyState, setShowEmptyState] = useState(true);
  const pageRef = useRef(null);
  const containerRef = useRef(null);

  const handlePositionChange = (component, e, data) => {
    updatePageComponent(page.id, component, { position: { x: data.x, y: data.y } });
  };

  const getOrCreateRef = (component) => {
    if (!refs.current[component]) {
      refs.current[component] = React.createRef();
    }
    return refs.current[component];
  };

  const zoomIn = () => setZoomLevel(prev => Math.min(prev + 0.1, 2));
  const zoomOut = () => setZoomLevel(prev => Math.max(prev - 0.1, 0.5));
  const fitToScreen = () => setZoomLevel(1);

  useEffect(() => {
    const newEditorStates = {};
    Object.entries(page.components).forEach(([key, component]) => {
      if (component.type === 'richText' && component.content) {
        try {
          const contentState = convertFromRaw(JSON.parse(component.content));
          newEditorStates[key] = EditorState.createWithContent(contentState);
        } catch {
          newEditorStates[key] = EditorState.createEmpty();
        }
      }
    });
    setEditorStates(newEditorStates);
  }, [page]);

  useEffect(() => {
    const hasContent = Object.values(page.components).some(component => {
      return component.text || component.image || (component.fields && component.fields.length > 0);
    });
    setShowEmptyState(!hasContent && !page.backgroundImage);
  }, [page]);

  return (
    <div className="page-editor-container" ref={containerRef}>
      <div className="zoom-controls">
        <button onClick={zoomIn} title="Zoom In"><FiZoomIn /></button>
        <span>{Math.round(zoomLevel * 100)}%</span>
        <button onClick={zoomOut} title="Zoom Out"><FiZoomOut /></button>
        <button onClick={fitToScreen} title="Fit to Screen"><FiMaximize /></button>
      </div>

      <div className="page-content-wrapper" style={{ overflow: 'auto', backgroundColor: '#fff', position: 'relative' }}>
        <div
          className="page-content"
          ref={pageRef}
          data-page-id={currentPage}
          style={{
            width: `${794}px`,
            height: `${1123}px`,
            transform: `scale(${zoomLevel})`,
            transformOrigin: 'top left',
            backgroundImage: page.backgroundImage ? `url(${page.backgroundImage})` : '',
            backgroundColor: '#ffffff',
            backgroundRepeat: 'no-repeat',
            backgroundSize: '100% 100%',
            backgroundPosition: 'center center',
            position: 'relative',
            margin: '0 auto',
            padding: '0',
            boxSizing: 'border-box',
            boxShadow: '0 0 8px rgba(0,0,0,0.1)'
          }}
        >
          {showEmptyState && !page.backgroundImage ? (
            <div className="empty-state">
              <FiEdit size={48} />
              <h3>No Content Added Yet</h3>
              <p>Select a component from the settings panel to start designing</p>
            </div>
          ) : (
            Object.entries(page.components).map(([key, component]) => (
              <Draggable
                key={key}
                position={component.position}
                onStop={(e, data) => handlePositionChange(key, e, data)}
                nodeRef={getOrCreateRef(key)}
              >
                <div
                  ref={getOrCreateRef(key)}
                  className={`element ${key}-element`}
                  style={{
                    ...component.style,
                    transform: `scale(${1 / zoomLevel})`,
                    transformOrigin: 'top left',
                    position: 'absolute'
                  }}
                >
                  {component.type === 'richText' && component.content && (
                    <div dangerouslySetInnerHTML={{ __html: component.content }} />
                  )}

                  {component.type === 'editableTable' && (
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr>
                          {component.columns.map(col => (
                            <th key={col.id} style={{ padding: '8px', textAlign: 'left', borderBottom: '1px solid #ddd', width: col.width }}>{col.label}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {component.rows.map((row, rowIndex) => (
                          <tr key={rowIndex}>
                            {component.columns.map(col => (
                              <td key={col.id} style={{ padding: '8px', borderBottom: '1px solid #eee' }}>{row[col.id]}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}

                  {!component.type && key === 'logo' && component.image && (
                    <img
                      src={component.image}
                      alt="Logo"
                      style={{
                        maxWidth: '150px',
                        maxHeight: '150px',
                        width: '100%',
                        height: 'auto',
                        objectFit: 'contain',
                        display: 'block'
                      }}
                    />
                  )}

                  {!component.type && component.text && (
                    key === 'title' ? <h1>{component.text}</h1> :
                    key === 'description' ? <p>{component.text}</p> :
                    <div>{component.text}</div>
                  )}

                  {!component.type && key === 'form' && (
                    <div>
                      <h3>Billing Form</h3>
                      {component.fields.map((field, index) => (
                        <div key={index} style={{ marginBottom: '10px' }}>
                          <label>{field}</label>
                          <input
                            type="text"
                            placeholder={`Enter ${field}`}
                            style={{ width: '100%', padding: '8px' }}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </Draggable>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default PageEditor;
