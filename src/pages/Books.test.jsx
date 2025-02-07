import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import Books from "../pages/Books";
import { initDB } from "../pages/utils/db";

// Mock de useNavigate
vi.mock("react-router-dom", () => ({
  useNavigate: vi.fn(() => vi.fn()),
}));

// Mock de initDB
vi.mock("../pages/utils/db.js", () => ({
  initDB: vi.fn(() => ({
    transaction: vi.fn(() => ({
      objectStore: vi.fn(() => ({
        add: vi.fn(),
        getAll: vi.fn(() => ({
          onsuccess: vi.fn(),
          onerror: vi.fn(),
        })),
      })),
    })),
  })),
}));

// Mock de pdfjs y react-pdf
vi.mock("pdfjs-dist", () => ({
  GlobalWorkerOptions: {
    workerSrc: "",
  },
  getDocument: vi.fn(() => ({
    promise: Promise.resolve({
      getPage: vi.fn(() => ({
        getViewport: vi.fn(() => ({
          scale: 1,
        })),
        render: vi.fn(() => ({
          promise: Promise.resolve(),
        })),
      })),
    }),
  })),
}));

vi.mock("react-pdf", () => ({
  pdfjs: {
    GlobalWorkerOptions: {},
    getDocument: vi.fn(),
  },
}));



describe("Books Component", () => {
  it("Comprobar renderizado del componente Books", () => {
    render(<Books />);
    expect(screen.getByText(/Biblioteca/i)).toBeInTheDocument();
  });

  it("Comprobar renderizado de libros favoritos al inicio", () => {
    const mockBooks = [
      { name: "Libro 1", favorite: true, cover: "cover1.jpg" },
      { name: "Libro 2", favorite: false, cover: "cover2.jpg" },
    ];
    vi.mocked(initDB).mockResolvedValueOnce({
      transaction: () => ({
        objectStore: () => ({
          getAll: () => ({
            onsuccess: (callback) =>
              callback({ target: { result: mockBooks } }),
          }),
        }),
      }),
    });

    render(<Books />);
    expect(screen.getByAltText("Libro 1")).toBeInTheDocument();
  });

  it("Comprobar que se muestra el modal al hacer clic en un libro", () => {
    const mockBooks = [
      { name: "Libro 1", favorite: true, cover: "cover1.jpg" },
    ];
    vi.mocked(initDB).mockResolvedValueOnce({
      transaction: () => ({
        objectStore: () => ({
          getAll: () => ({
            onsuccess: (callback) =>
              callback({ target: { result: mockBooks } }),
          }),
        }),
      }),
    });

    render(<Books />);
    const book = screen.getByAltText("Libro 1");
    fireEvent.click(book);
    expect(screen.getByText("Libro 1")).toBeInTheDocument();
  });
});

it("Comprobar que se muestra la portada de los libros", () => {
  const mockBooks = [{ name: "Libro 1", cover: "cover1.jpg" }];
  vi.mocked(initDB).mockResolvedValueOnce({
    transaction: () => ({
      objectStore: () => ({
        getAll: () => ({
          onsuccess: (callback) => callback({ target: { result: mockBooks } }),
        }),
      }),
    }),
  });

  render(<Books />);
  const bookCover = screen.getByAltText("Libro 1");
  expect(bookCover).toHaveAttribute("src", "cover1.jpg");
});
