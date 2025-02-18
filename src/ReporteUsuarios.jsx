import React, { useEffect, useState, useRef } from "react";
import { jsPDF } from "jspdf";
import { IoMdDownload } from "react-icons/io";
import { Bar } from "react-chartjs-2";
import html2canvas from "html2canvas";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function ReporteLibros() {
  const [libros, setLibros] = useState([]);
  const [totalLibros, setTotalLibros] = useState(0);
  const chartRef = useRef(null);

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
            storedBooks.map(({ name, favorite, lastPage }, index) => ({
              id: index + 1,
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
    libros.forEach(({ id, name, favorite, lastPage }, index) => {
      doc.text(
        `${id}. ${name} | Favorito: ${
          favorite ? "Sí" : "No"
        } | Última página: ${lastPage}`,
        10,
        30 + index * 10
      );
    });

    if (chartRef.current) {
      html2canvas(chartRef.current).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        doc.addImage(imgData, "PNG", 5, 100, 200, 100);
        doc.save("informe_libros.pdf");
      });
    } else {
      doc.save("informe_libros.pdf");
    }
  };

  const data = {
    labels: libros.map((libro) => libro.id.toString()),
    datasets: [
      {
        label: "Última Página Leída",
        data: libros.map((libro) => libro.lastPage),
        backgroundColor: "rgba(75, 192, 192, 0.5)",
      },
    ],
  };

  return (
    <div>
      <h2>
        <a onClick={generarPDF} style={{ cursor: "pointer" }}>
          <IoMdDownload />
        </a>
      </h2>
      <div>
        <h3>Total de libros: {totalLibros}</h3>
        <ul>
          {libros.map(({ id, name, favorite, lastPage }) => (
            <li key={id}>
              {id}. {name} | Favorito: {favorite ? "Sí" : "No"} | Última página:{" "}
              {lastPage}
            </li>
          ))}
        </ul>
      </div>
      <div
        ref={chartRef}
        style={{
          width: "100%",
          margin: "20px auto",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Bar
          data={data}
          options={{
            responsive: true,
            plugins: { legend: { display: false } },
          }}
        />
      </div>
    </div>
  );
}

// "We know what we are, but know not what we may be."
