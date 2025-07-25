import React, { useState, useRef } from 'react';
import { FiPlus, FiImage, FiType, FiSliders, FiLayout, FiToggleRight, FiMinus, FiTrash2, FiMove, FiEdit } from 'react-icons/fi';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, convertToRaw } from 'draft-js';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
const SettingsPanel = ({ page, currentPage, updatePage, updatePageComponent, togglePage, removeComponent }) => {
  const [activeTab, setActiveTab] = useState('content');
  const [customTexts, setCustomTexts] = useState([]);
  const [customImages, setCustomImages] = useState([]);
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [isMinimized, setIsMinimized] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [fileInputKey, setFileInputKey] = useState(Date.now());
  const modalRef = useRef(null);
  const dragRef = useRef(null);
const [editorStates, setEditorStates] = useState({});


  // Draggable modal functionality
  const handleMouseDown = (e) => {
    if (e.target !== dragRef.current) return;
    
    const startX = e.clientX - position.x;
    const startY = e.clientY - position.y;
    
    const handleMouseMove = (e) => {
      setPosition({
        x: e.clientX - startX,
        y: e.clientY - startY
      });
    };
    
    const handleMouseUp = () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const handleStyleChange = (component, property, value) => {
    updatePageComponent(currentPage, component, {
      style: {
        ...page.components[component].style,
        [property]: value
      }
    });
  };

const handleImageUpload = (e, componentId, type = 'image') => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (event) => {
      updatePageComponent(currentPage, componentId, { 
        image: event.target.result,
        // Reset some styles when first adding an image
        style: {
          ...page.components[componentId].style,
          width: page.components[componentId].style.width || '200px',
          height: page.components[componentId].style.height || 'auto'
        }
      });
    };
    reader.readAsDataURL(file);
  }
};

  const addNewTextElement = () => {
    const newId = `custom-text-${Date.now()}`;
    setCustomTexts([...customTexts, newId]);
    updatePageComponent(currentPage, newId, {
      text: 'New Text Element',
      position: { x: 50, y: 50 + (customTexts.length * 60) },
      style: {
        fontSize: '16px',
        color: '#333333',
        backgroundColor: 'transparent',
        padding: '8px 12px',
        borderRadius: '4px'
      }
    });
    setSelectedComponent(newId);
  };

  const addNewImageElement = () => {
    const newId = `custom-image-${Date.now()}`;
    setCustomImages([...customImages, newId]);
    updatePageComponent(currentPage, newId, {
      image: null,
      position: { x: 50, y: 50 + (customImages.length * 200) },
      style: {
        width: '200px',
        height: 'auto',
        backgroundColor: 'transparent',
        borderRadius: '4px',
        border: '1px dashed #ccc'
      }
    });
    setSelectedComponent(newId);
  };



  const handleRemoveComponent = (componentId) => {
    removeComponent(currentPage, componentId);
    setSelectedComponent(null);
  };

  const handleBgRemove = () => {
    updatePage(currentPage, { backgroundImage: null });
    setFileInputKey(Date.now());
  };

  const handleBgUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      updatePage(currentPage, { 
        backgroundImage: URL.createObjectURL(file)
      });
    }
  };

  const handleStyleButtonClick = (componentId) => {
    setSelectedComponent(componentId);
    setActiveTab('style');
  };

  const handleEditorChange = (componentId, editorState) => {
  setEditorStates(prev => ({
    ...prev,
    [componentId]: editorState
  }));
  
  const content = JSON.stringify(convertToRaw(editorState.getCurrentContent()));
  updatePageComponent(currentPage, componentId, { content });
};



const addTableRow = (componentId) => {
  const component = page.components[componentId];
  const newRow = {};
  component.columns.forEach(col => {
    newRow[col.id] = '';
  });
  updatePageComponent(currentPage, componentId, {
    rows: [...component.rows, newRow]
  });
};

const addTableColumn = (componentId) => {
  const component = page.components[componentId];
  const newColId = `col_${Date.now()}`;
  updatePageComponent(currentPage, componentId, {
    columns: [
      ...component.columns,
      { id: newColId, label: 'New Column', width: '20%' }
    ],
    rows: component.rows.map(row => ({
      ...row,
      [newColId]: ''
    }))
  });
};

const updateColumnLabel = (componentId, columnId, newLabel) => {
  const component = page.components[componentId];
  updatePageComponent(currentPage, componentId, {
    columns: component.columns.map(col => 
      col.id === columnId ? { ...col, label: newLabel } : col
    )
  });
};

const updateTableCell = (componentId, rowIndex, columnId, value) => {
  const component = page.components[componentId];
  const newRows = [...component.rows];
  newRows[rowIndex] = {
    ...newRows[rowIndex],
    [columnId]: value
  };
  updatePageComponent(currentPage, componentId, { rows: newRows });
};

const removeTableRow = (componentId, rowIndex) => {
  const component = page.components[componentId];
  const newRows = [...component.rows];
  newRows.splice(rowIndex, 1);
  updatePageComponent(currentPage, componentId, { rows: newRows });
};

  return (
    <div 
      className="settings-modal"
      ref={modalRef}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
        display: isMinimized ? 'none' : 'block'
      }}
      onMouseDown={handleMouseDown}
    >
      <div className="modal-header" ref={dragRef}>
        <h2>
          <span className="page-name">{page.title}</span>
          <span className="settings-title">Settings</span>
        </h2>
        <div className="modal-controls">
          <button onClick={() => setIsMinimized(true)}>
            <FiMinus />
          </button>
        </div>
      </div>

      {isMinimized && (
        <div 
          className="minimized-modal"
          onClick={() => setIsMinimized(false)}
          style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
        >
          <FiSliders />
          <span>Settings</span>
        </div>
      )}

      <div className="settings-header">
        <div className="settings-tabs">
          <button 
            className={`tab-btn ${activeTab === 'content' ? 'active' : ''}`}
            onClick={() => setActiveTab('content')}
          >
            <FiType /> Content
          </button>
          <button 
            className={`tab-btn ${activeTab === 'style' ? 'active' : ''}`}
            onClick={() => setActiveTab('style')}
            disabled={!selectedComponent}
          >
            <FiSliders /> Style
          </button>
          <button 
            className={`tab-btn ${activeTab === 'layout' ? 'active' : ''}`}
            onClick={() => setActiveTab('layout')}
          >
            <FiLayout /> Layout
          </button>
        </div>
      </div>

      <div className="settings-content">
        {activeTab === 'content' && (
          <div className="tab-content">
            <div className="section">
              <h3 className="section-title">
                <FiImage /> Background
              </h3>
              <div className="form-group">
                <label>Background Image</label>
                <div className="file-upload">
                  <input 
                    key={fileInputKey}
                    type="file" 
                    id="bg-upload"
                    accept="image/*"
                    onChange={handleBgUpload}
                  />
                  <label htmlFor="bg-upload" className="upload-btn">
                    {page.backgroundImage ? 'Change Image' : 'Upload Image'}
                  </label>
                  {page.backgroundImage && (
                    <button 
                      className="remove-btn"
                      onClick={handleBgRemove}
                    >
                      <FiTrash2 /> Remove
                    </button>
                  )}
                </div>
              </div>
            </div>

            {Object.entries(page.components).map(([key, component]) => (
              <div 
                key={key} 
                className={`section ${selectedComponent === key ? 'selected' : ''}`}
              >
                <div className="section-header">
                  <h3 className="section-title">
                    {component.image && <FiImage />}
                    {!component.image && <FiType />}
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </h3>
                  <div className="component-actions">
                    <button 
                      className="style-btn"
                      onClick={() => handleStyleButtonClick(key)}
                      title="Style this component"
                    >
                      <FiEdit />
                    </button>
                    <button 
                      className="component-delete-btn"
                      onClick={() => handleRemoveComponent(key)}
                      title="Delete this component"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
                
                {component.text !== undefined && (
                  <div className="form-group">
                    <label>Text Content</label>
                    {key === 'description' || key === 'content' ? (
                      <textarea
                        value={component.text}
                        onChange={(e) => updatePageComponent(currentPage, key, { text: e.target.value })}
                        rows={4}
                      />
                    ) : (
                      <input
                        type="text"
                        value={component.text}
                        onChange={(e) => updatePageComponent(currentPage, key, { text: e.target.value })}
                      />
                    )}
                  </div>
                )}
{component.type === 'richText' && (
      <div className="form-group">
        <label>Content</label>
        <Editor
          editorState={editorStates[key] || EditorState.createEmpty()}
          onEditorStateChange={(editorState) => handleEditorChange(key, editorState)}
          toolbar={{
            options: ['inline', 'blockType', 'list', 'textAlign', 'link'],
            inline: { options: ['bold', 'italic', 'underline'] },
            blockType: { options: ['Normal', 'H1', 'H2', 'H3', 'H4'] }
          }}
        />
      </div>
    )}

    {component.type === 'editableTable' && (
      <div className="form-group">
        <label>Invoice Items</label>
        <div className="table-editor-toolbar">
          <button onClick={() => addTableRow(key)}>Add Row</button>
          <button onClick={() => addTableColumn(key)}>Add Column</button>
        </div>
        <div className="table-responsive">
          <table className="editable-table">
            <thead>
              <tr>
                {component.columns.map(col => (
                  <th key={col.id} style={{ width: col.width }}>
                    <input
                      type="text"
                      value={col.label}
                      onChange={(e) => updateColumnLabel(key, col.id, e.target.value)}
                    />
                  </th>
                ))}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {component.rows.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {component.columns.map(col => (
                    <td key={col.id}>
                      <input
                        type="text"
                        value={row[col.id] || ''}
                        onChange={(e) => updateTableCell(key, rowIndex, col.id, e.target.value)}
                      />
                    </td>
                  ))}
                  <td>
                    <button onClick={() => removeTableRow(key, rowIndex)}>
                      <FiTrash2 />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )}

                {component.image !== undefined && (
                  <div className="form-group">
                    <label>Image</label>
                    <div className="file-upload">
                      <input 
                        type="file" 
                        id={`${key}-upload`}
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, key)}
                      />
                      <label htmlFor={`${key}-upload`} className="upload-btn">
                        {component.image ? 'Change Image' : 'Upload Image'}
                      </label>
                      {component.image && (
                        <button 
                          className="remove-btn"
                          onClick={() => updatePageComponent(currentPage, key, { image: null })}
                        >
                          <FiTrash2 /> Remove
                        </button>
                      )}
                    </div>
                    {component.image && (
                      <div className="image-preview">
                        <img 
                          src={component.image} 
                          alt="Preview" 
                          style={{ 
                            maxWidth: '100%', 
                            maxHeight: '150px',
                            marginTop: '10px',
                            borderRadius: '4px'
                          }} 
                        />
                      </div>
                    )}
                  </div>
                )}



                {key === 'form' && (
                  <div className="form-group">
                    <label>Form Fields</label>
                    <div className="form-fields-editor">
                      <input
                        type="text"
                        value={component.fields.join(', ')}
                        onChange={(e) => updatePageComponent(currentPage, key, { 
                          fields: e.target.value.split(',').map(field => field.trim()) 
                        })}
                        placeholder="Field1, Field2, Field3"
                      />
                      <small>Separate fields with commas</small>
                    </div>
                  </div>
                )}
              </div>
            ))}

            <div className="add-element">
              <button className="add-btn" onClick={addNewTextElement}>
                <FiPlus /> Add Text Element
              </button>
               <button className="add-btn" onClick={addNewImageElement}>
                <FiImage /> Add Image Element
              </button>
            </div>
          </div>
        )}

        {activeTab === 'style' && selectedComponent && (
          <div className="tab-content">
            <div className="section">
              <h3 className="section-title">
                {selectedComponent.charAt(0).toUpperCase() + selectedComponent.slice(1)} Styling
              </h3>
              
              <div className="style-grid">
                {page.components[selectedComponent]?.text !== undefined && (
                  <>
                    <div className="form-group">
                      <label>Font Size</label>
                      <div className="input-with-unit">
                        <input
                          type="number"
                          value={parseInt(page.components[selectedComponent]?.style?.fontSize) || ''}
                          onChange={(e) => handleStyleChange(selectedComponent, 'fontSize', `${e.target.value}px`)}
                          placeholder="16"
                        />
                        <span className="unit">px</span>
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Font Weight</label>
                      <select
                        value={page.components[selectedComponent]?.style?.fontWeight || 'normal'}
                        onChange={(e) => handleStyleChange(selectedComponent, 'fontWeight', e.target.value)}
                      >
                        <option value="normal">Normal</option>
                        <option value="bold">Bold</option>
                        <option value="lighter">Lighter</option>
                        <option value="100">Thin (100)</option>
                        <option value="300">Light (300)</option>
                        <option value="500">Medium (500)</option>
                        <option value="700">Bold (700)</option>
                        <option value="900">Black (900)</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Text Color</label>
                      <div className="color-picker">
                        <input
                          type="color"
                          value={page.components[selectedComponent]?.style?.color || '#000000'}
                          onChange={(e) => handleStyleChange(selectedComponent, 'color', e.target.value)}
                        />
                        <span>{page.components[selectedComponent]?.style?.color || '#000000'}</span>
                      </div>
                    </div>
                  </>
                )}

                {page.components[selectedComponent]?.image !== undefined && (
                  <>
                    <div className="form-group">
                      <label>Width</label>
                      <div className="input-with-unit">
                        <input
                          type="number"
                          value={parseInt(page.components[selectedComponent]?.style?.width) || ''}
                          onChange={(e) => handleStyleChange(selectedComponent, 'width', `${e.target.value}px`)}
                          placeholder="Auto"
                        />
                        <span className="unit">px</span>
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Height</label>
                      <div className="input-with-unit">
                        <input
                          type="number"
                          value={parseInt(page.components[selectedComponent]?.style?.height) || ''}
                          onChange={(e) => handleStyleChange(selectedComponent, 'height', `${e.target.value}px`)}
                          placeholder="Auto"
                        />
                        <span className="unit">px</span>
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Object Fit</label>
                      <select
                        value={page.components[selectedComponent]?.style?.objectFit || 'contain'}
                        onChange={(e) => handleStyleChange(selectedComponent, 'objectFit', e.target.value)}
                      >
                        <option value="contain">Contain</option>
                        <option value="cover">Cover</option>
                        <option value="fill">Fill</option>
                        <option value="none">None</option>
                        <option value="scale-down">Scale Down</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Border Radius</label>
                      <div className="input-with-unit">
                        <input
                          type="number"
                          value={parseInt(page.components[selectedComponent]?.style?.borderRadius) || ''}
                          onChange={(e) => handleStyleChange(selectedComponent, 'borderRadius', `${e.target.value}px`)}
                          placeholder="0"
                        />
                        <span className="unit">px</span>
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Border</label>
                      <input
                        type="text"
                        value={page.components[selectedComponent]?.style?.border || ''}
                        onChange={(e) => handleStyleChange(selectedComponent, 'border', e.target.value)}
                        placeholder="e.g. 1px solid #ccc"
                      />
                    </div>
                  </>
                )}

                <div className="form-group">
                  <label>Background Color</label>
                  <div className="color-picker">
                    <input
                      type="color"
                      value={page.components[selectedComponent]?.style?.backgroundColor || 'transparent'}
                      onChange={(e) => handleStyleChange(selectedComponent, 'backgroundColor', e.target.value)}
                    />
                    <span>
                      {page.components[selectedComponent]?.style?.backgroundColor === 'transparent' 
                        ? 'Transparent' 
                        : page.components[selectedComponent]?.style?.backgroundColor || 'Transparent'
                      }
                    </span>
                  </div>
                </div>

                <div className="form-group">
                  <label>Width</label>
                  <div className="input-with-unit">
                    <input
                      type="number"
                      value={parseInt(page.components[selectedComponent]?.style?.width) || ''}
                      onChange={(e) => handleStyleChange(selectedComponent, 'width', `${e.target.value}px`)}
                      placeholder="Auto"
                    />
                    <span className="unit">px</span>
                  </div>
                </div>

                <div className="form-group">
                  <label>Padding</label>
                  <input
                    type="text"
                    value={page.components[selectedComponent]?.style?.padding || ''}
                    onChange={(e) => handleStyleChange(selectedComponent, 'padding', e.target.value)}
                    placeholder="e.g. 10px or 10px 20px"
                  />
                </div>

                <div className="form-group">
                  <label>Border Radius</label>
                  <div className="input-with-unit">
                    <input
                      type="number"
                      value={parseInt(page.components[selectedComponent]?.style?.borderRadius) || ''}
                      onChange={(e) => handleStyleChange(selectedComponent, 'borderRadius', `${e.target.value}px`)}
                      placeholder="0"
                    />
                    <span className="unit">px</span>
                  </div>
                </div>

                <div className="form-group">
                  <label>Opacity</label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={page.components[selectedComponent]?.style?.opacity || 1}
                    onChange={(e) => handleStyleChange(selectedComponent, 'opacity', e.target.value)}
                  />
                  <span className="range-value">{(page.components[selectedComponent]?.style?.opacity || 1) * 100}%</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'layout' && (
          <div className="tab-content">
            <div className="section">
              <h3 className="section-title">Page Settings</h3>
              <div className="form-group toggle-group">
                <label>
                  <FiToggleRight /> Enable This Page
                </label>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={page.enabled}
                    onChange={() => togglePage(currentPage)}
                  />
                  <span className="slider"></span>
                </label>
              </div>
            </div>

            <div className="section">
              <h3 className="section-title">Element Positions</h3>
              <p className="info-text">
                <FiMove /> Drag and drop elements on the page to position them. Their coordinates will be saved automatically.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsPanel;