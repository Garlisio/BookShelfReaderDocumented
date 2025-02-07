import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import Login from "../pages/Login";
import { vi } from "vitest";
import { useNavigate } from "react-router-dom";

// Mock de useNavigate
vi.mock("react-router-dom", () => ({
  useNavigate: vi.fn(),
}));

describe("Login Component", () => {
  it("Comprobar que muestra el modal de recuperación de contraseña cuando se hace clic en 'He olvidado la contraseña'", () => {
    render(<Login />);

    const forgotPasswordLink = screen.getByRole("link", {
      name: /he olvidado la contraseña/i,
    });
    fireEvent.click(forgotPasswordLink);

    const modal = screen.getByText(/recuperar contraseña/i);
    expect(modal).toBeInTheDocument();
  });

  it("Comprobar que muestra un mensaje de alerta cuando se envía el correo para recuperar la contraseña", async () => {
    const alertMock = vi.fn();
    global.alert = alertMock;

    render(<Login />);

    const forgotPasswordLink = screen.getByRole("link", {
      name: /he olvidado la contraseña/i,
    });
    fireEvent.click(forgotPasswordLink);

    const modal = screen.getByText(/recuperar contraseña/i);
    expect(modal).toBeInTheDocument();

    const emailInput = screen.getByPlaceholderText("Introduce tu correo");
    fireEvent.change(emailInput, { target: { value: "test@correo.com" } });

    const sendButton = screen.getByRole("button", { name: /enviar/i });
    fireEvent.click(sendButton);

    await waitFor(() =>
      expect(alertMock).toHaveBeenCalledWith(
        "Se ha enviado un correo para restablecer la contraseña."
      )
    );

    expect(screen.queryByText(/recuperar contraseña/i)).not.toBeInTheDocument();
  });
});
