import React, { useState, useEffect } from "react";
import "../assets/styles/Books.css";
import { initDB } from "../pages/utils/db.js";
import { useNavigate } from "react-router-dom";
import * as pdfjsLib from "pdfjs-dist";
import { pdfjs } from "react-pdf";

//Iconos
import { ImExit } from "react-icons/im";
import { IoMdAddCircleOutline } from "react-icons/io";
import { TbCircleLetterX } from "react-icons/tb";
import { IoLibrary } from "react-icons/io5";
import { MdDelete } from "react-icons/md";
import { FaRegStar } from "react-icons/fa";
import { FaStar } from "react-icons/fa";
import { FaBookOpen } from "react-icons/fa";

pdfjs.GlobalWorkerOptions.workerSrc =
  "/node_modules/pdfjs-dist/build/pdf.worker.mjs";

const Books = () => {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [fileInputVisible, setFileInputVisible] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [modalData, setModalData] = useState(null);

  const toggleFileInput = () => {
    setFileInputVisible(!fileInputVisible);
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter((file) => file.type === "application/pdf");
    setSelectedFiles((prevFiles) => [...prevFiles, ...validFiles]);
  };

  const generateCover = async (file, url) => {
    if (file.type === "application/pdf") {
      try {
        const loadingTask = pdfjsLib.getDocument(url);
        const pdf = await loadingTask.promise;
        const page = await pdf.getPage(1);
        const viewport = page.getViewport({ scale: 1 });
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderContext = {
          canvasContext: context,
          viewport: viewport,
        };
        await page.render(renderContext).promise;

        return canvas.toDataURL(); // Retorna la portada como base64 (importante)
      } catch (error) {
        console.error("Error al generar la portada:", error);
        return null;
      }
    }
    return null;
  };

  const saveBooksToDB = async (files) => {
    const db = await initDB();

    for (const file of files) {
      const fileArrayBuffer = await file.arrayBuffer(); // Convertir el archivo a ArrayBuffer
      const coverImage = await generateCover(file, URL.createObjectURL(file)); // La portada sigue usando el enlace temporal

      const bookData = {
        name: file.name,
        content: fileArrayBuffer,
        cover: coverImage,
        favorite: false,
        lastPage: 1,
      };

      const transaction = db.transaction("books", "readwrite");
      const store = transaction.objectStore("books");

      try {
        store.add(bookData);
        console.log(`Libro "${file.name}" guardado con éxito.`);
        loadBooksFromDB();
      } catch (error) {
        console.error(`Error al guardar el libro "${file.name}":`, error);
      }
    }
  };

  const loadBooksFromDB = async () => {
    const db = await initDB();
    const transaction = db.transaction("books", "readonly");
    const store = transaction.objectStore("books");
    const request = store.getAll();

    request.onsuccess = () => {
      const storedBooks = request.result.sort(
        (a, b) => b.favorite - a.favorite
      );
      setBooks(storedBooks);
    };

    request.onerror = (event) => {
      console.error("Error al cargar libros de IndexedDB:", event.target.error);
    };
  };

  const confirmFileSelection = () => {
    saveBooksToDB(selectedFiles);
    setSelectedFiles([]);
    setFileInputVisible(false);
  };

  const handleLogOutClick = (event) => {
    event.preventDefault();
    navigate("/login");
  };

  const openModal = (book) => {
    setModalData(book);
  };

  const closeModal = () => {
    setModalData(null);
  };

  const deleteBook = async (name) => {
    const db = await initDB();
    const transaction = db.transaction("books", "readwrite");
    const store = transaction.objectStore("books");
    store.delete(name);

    loadBooksFromDB();
    closeModal();
  };

  const toggleFavorite = async (book) => {
    const db = await initDB();
    const transaction = db.transaction("books", "readwrite");
    const store = transaction.objectStore("books");

    store.put({ ...book, favorite: !book.favorite });
    loadBooksFromDB();
  };

  const openInReader = async (bookName) => {
    const db = await initDB();
    const transaction = db.transaction("books", "readonly");
    const store = transaction.objectStore("books");
    const request = store.get(bookName);

    request.onsuccess = () => {
      const book = request.result;
      if (book) {
        const blob = new Blob([book.content], { type: "application/pdf" });
        const fileURL = URL.createObjectURL(blob);

        navigate("/reader", { state: { name: book.name, content: fileURL } });
      } else {
        console.error("Error: El libro no se encontró en IndexedDB.");
      }
    };

    request.onerror = () => {
      console.error("Error al abrir el libro desde IndexedDB.");
    };
  };

  useEffect(() => {
    loadBooksFromDB();
  }, []);

  useEffect(() => {
    // Simula la carga de datos desde una base de datos
    const fetchBooks = async () => {
      const mockBooks = [
        { id: 1, name: "Libro 1", favorite: false, cover: "cover1.jpg" },
        { id: 2, name: "Libro 2", favorite: false, cover: "cover2.jpg" },
      ];
      setBooks(mockBooks);
    };

    fetchBooks();
  }, []);

  return (
    <div className="bookshelf-container">
      <div className="bookshelf-header">
        <h2>
          <IoLibrary /> Biblioteca
        </h2>
      </div>
      <div className="bookshelf-header2">
        <button className="logout-button" onClick={handleLogOutClick}>
          <ImExit size={20} />
        </button>
        <button className="toggle-file-input" onClick={toggleFileInput}>
          {fileInputVisible ? (
            <TbCircleLetterX size={30} />
          ) : (
            <IoMdAddCircleOutline size={30} />
          )}
        </button>
      </div>

      <div className="bookshelf-grid">
        {books.map((book, index) => (
          <div
            key={index}
            className={`book-slot ${book.favorite ? "favorite" : ""}`}
            alt={book.name}
            onClick={() => openModal(book)}
          >
            <img src={book.cover} alt={book.name} className="book-cover" />
          </div>
        ))}
      </div>

      {fileInputVisible && (
        <>
          <div className="modal-overlay" onClick={toggleFileInput}></div>
          <div className="file-input-modal">
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              className="file-input"
              accept=".pdf"
              data-testid="file-input"
            />
            <button className="confirm-button" onClick={confirmFileSelection}>
              Confirmar selección
            </button>
          </div>
        </>
      )}

      {modalData && (
        <div className="modal-overlay" onClick={closeModal} data-testid="modal-overlay">
          <div
            className="file-input-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="file-input-modal-h3">{modalData.name}</h3>
            <div className="file-input-modal-buttons">
              <button
                className="delete-button"
                onClick={() => deleteBook(modalData.name)}
              >
                <MdDelete size={24} />
              </button>
              <button
                className="favorite-button"
                onClick={() => {
                  toggleFavorite(modalData);
                  closeModal();
                }}
              >
                {modalData.favorite ? (
                  <FaStar size={24} />
                ) : (
                  <FaRegStar size={24} />
                )}
              </button>
              <button
                className="open-button"
                onClick={() => openInReader(modalData.name)}
              >
                <FaBookOpen size={24} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Books;
