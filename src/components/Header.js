import React from 'react';
import { FiDownload, FiSettings, FiRotateCcw } from 'react-icons/fi';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const Header = ({ pages, currentPage, setCurrentPage, setShowSettings }) => {

  const downloadPagesAsPDF = async () => {
    try {
      const pageOrder = ['cover', 'terms', 'billing', 'thanks'];
      const enabledPages = pageOrder
        .map(id => pages[id])
        .filter(page => page && page.enabled);

      if (enabledPages.length === 0) {
        alert('No pages enabled for download. Please enable at least one page.');
        return;
      }

      const pdf = new jsPDF();
      const originalPage = currentPage;

      for (let i = 0; i < enabledPages.length; i++) {
        const page = enabledPages[i];
        setCurrentPage(page.id);

        await new Promise((resolve) => {
          let checks = 0;
          const checkRender = () => {
            checks++;
            const contentDiv = document.querySelector('.page-content');
            if (contentDiv && contentDiv.innerHTML.includes(page.components.title?.text || page.id)) {
              resolve();
            } else if (checks < 20) {
              setTimeout(checkRender, 50);
            } else {
              resolve();
            }
          };
          checkRender();
        });

        await new Promise(resolve => setTimeout(resolve, 200));
        const element = document.querySelector('.page-content');
        if (!element) continue;

        const canvas = await html2canvas(element, {
          scale: 2,
          useCORS: true,
          onclone: (clonedDoc) => {
            clonedDoc.querySelectorAll('*').forEach(el => {
              el.style.opacity = '1';
              el.style.visibility = 'visible';
            });
          }
        });

        if (i > 0) pdf.addPage();
        const imgData = canvas.toDataURL('image/png');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      }

      setCurrentPage(originalPage);
      pdf.save('proposal_document.pdf');
    } catch (error) {
      console.error('PDF generation failed:', error);
      alert('Failed to generate PDF. See console for details.');
    }
  };

  const ResetPage = () => {
    localStorage.removeItem('pageBuilderPages');
    window.location.reload();
  };

  return (
    <>
      <style>{`
        .header {
          background-color: #ffffff;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.06);
          padding: 15px 25px;
          position: sticky;
          top: 0;
          z-index: 100;
        }
        .header-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
        }
        .logo h1 {
          font-size: 22px;
          font-weight: 700;
          color: #2c3e50;
          margin: 0;
        }
        .page-tabs {
          display: flex;
          gap: 10px;
          margin: 10px 0;
          flex-wrap: wrap;
          flex-grow: 1;
          justify-content: center;
        }
        .tab-btn {
          padding: 8px 16px;
          background-color: #ecf0f1;
          border: none;
          border-radius: 6px;
          font-size: 14px;
          color: #34495e;
          cursor: pointer;
          transition: background 0.3s ease;
        }
        .tab-btn.active {
          background-color: #3498db;
          color: white;
        }
        .tab-btn.disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .tab-btn:hover:not(.disabled):not(.active) {
          background-color: #d0d7de;
        }
        .header-actions {
          display: flex;
          gap: 10px;
        }
        .action-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 12px;
          background-color: #f1f1f1;
          color: #2c3e50;
          font-weight: 500;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s ease-in-out;
        }
        .action-btn:hover {
          background-color: #dfe6e9;
        }
        .action-btn .icon {
          font-size: 16px;
        }
        .settings-btn {
          background-color: #ffeaa7;
        }
        .settings-btn:hover {
          background-color: #fdcb6e;
        }
        .download-btn {
          background-color: #55efc4;
        }
        .download-btn:hover {
          background-color: #00cec9;
          color: white;
        }
      `}</style>

      <header className="header">
        <div className="header-container">
          <div className="logo">
            <h1>Page Builder Pro</h1>
          </div>

          <nav className="page-tabs">
            {Object.values(pages).map((page) => (
              <button
                key={page.id}
                className={`tab-btn ${currentPage === page.id ? 'active' : ''} ${page.enabled ? '' : 'disabled'}`}
                onClick={() => setCurrentPage(page.id)}
              >
                {page.title}
              </button>
            ))}
          </nav>

          <div className="header-actions">
            <button className="action-btn settings-btn" onClick={ResetPage}>
              <FiRotateCcw className="icon" />
              <span>Reset</span>
            </button>
            <button className="action-btn settings-btn" onClick={() => setShowSettings(prev => !prev)}>
              <FiSettings className="icon" />
              <span>Settings</span>
            </button>
            <button className="action-btn download-btn" onClick={downloadPagesAsPDF}>
              <FiDownload className="icon" />
              <span>Download PDF</span>
            </button>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
