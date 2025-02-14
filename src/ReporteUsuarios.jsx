import React, { useEffect, useState } from "react";
import { jsPDF } from "jspdf";
import { IoMdDownload } from "react-icons/io";
export default function ReporteLibros() {
  const [libros, setLibros] = useState([]);
  const [totalLibros, setTotalLibros] = useState(0);

  useEffect(() => {
    const cargarLibrosDesdeIndexedDB = () => {
      const request = window.indexedDB.open("LibraryDB");

      request.onsuccess = () => {
        const db = request.result;
        const transaction = db.transaction("books", "readonly");
        const store = transaction.objectStore("books");
        const allBooksRequest = store.getAll();

        allBooksRequest.onsuccess = () => {
          const storedBooks = allBooksRequest.result;
          setLibros(
            storedBooks.map(({ name, favorite, lastPage }) => ({
              name,
              favorite,
              lastPage,
            }))
          );
          setTotalLibros(storedBooks.length);
        };

        allBooksRequest.onerror = (error) => {
          console.error("Error al obtener los libros: ", error);
        };
      };

      request.onerror = (event) => {
        console.error("Error al abrir la base de datos: ", event.target.error);
      };
    };

    cargarLibrosDesdeIndexedDB();
  }, []);

  const generarPDF = () => {
    const doc = new jsPDF();
    doc.text("Informe de Libros", 10, 10);
    doc.text(`Total de libros: ${totalLibros}`, 10, 20);
    libros.forEach(({ name, favorite, lastPage }, index) => {
      doc.text(
        `${index + 1}. ${name} | Favorito: ${
          favorite ? "Sí" : "No"
        } | Última página: ${lastPage}`,
        10,
        30 + index * 10
      );
    });
    doc.save("informe_libros.pdf");
  };

  return (
    <div>
      <h2>
        Descargar Informe
        <a onClick={generarPDF}>
          {" "}
          <IoMdDownload />
        </a>
      </h2>
    </div>
  );
}

// “This above all: to thine own self be true.”
