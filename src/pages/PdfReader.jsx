import React, { useState, useEffect } from "react";
import "../assets/styles/PdfReader.css";
import { initDB } from "../pages/utils/db.js";
import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";
import { Document, Page } from "react-pdf";
import { useLocation, useNavigate } from "react-router-dom";

//Iconos
import { MdNavigateNext } from "react-icons/md";
import { MdNavigateBefore } from "react-icons/md";
import { IoIosExit } from "react-icons/io";

const PdfReader = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = location;
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  useEffect(() => {
    document.body.classList.add("back-reader");
    return () => {
      document.body.classList.remove("back-reader");
    };
  }, []);

  useEffect(() => {
    const fetchLastPage = async () => {
      const db = await initDB();
      const transaction = db.transaction("books", "readonly");
      const store = transaction.objectStore("books");
      const request = store.get(state?.name);

      request.onsuccess = () => {
        const book = request.result;
        if (book?.lastPage) {
          setPageNumber(book.lastPage);
        }
      };

      request.onerror = () => {
        console.error("Error al cargar la última página.");
      };
    };

    fetchLastPage();
  }, [state?.name]);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const handlePageChange = async (newPageNumber) => {
    setPageNumber(newPageNumber);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

    const db = await initDB();
    const transaction = db.transaction("books", "readwrite");
    const store = transaction.objectStore("books");
    const request = store.get(state?.name);

    request.onsuccess = () => {
      const book = request.result;
      if (book) {
        const updatedBook = { ...book, lastPage: newPageNumber };
        store.put(updatedBook);
      }
    };

    request.onerror = () => {
      console.error("Error al guardar la última página.");
    };
  };

  return (
    <div className="background-reader">
      <div className="pdf-reader-container">
        <h2>{state?.name || "Documento PDF"}</h2>
        <Document file={state?.content} onLoadSuccess={onDocumentLoadSuccess}>
          <Page pageNumber={pageNumber} />
        </Document>
        <div className="pdf-controls">
          <button className="exit-button" onClick={() => navigate("/books")}>
            <IoIosExit size={36} />
          </button>
          <button
            disabled={pageNumber <= 1}
            onClick={() => handlePageChange(pageNumber - 1)}
          >
            <MdNavigateBefore size={36} />
          </button>
          <span className="pdf-page-info">
            Página {pageNumber} de {numPages}
          </span>
          <button
            disabled={pageNumber >= numPages}
            onClick={() => handlePageChange(pageNumber + 1)}
          >
            <MdNavigateNext size={36} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PdfReader;
