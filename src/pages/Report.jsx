import "../assets/styles/Login.css";
import ReporteUsuarios from "../ReporteUsuarios";

const Report = () => {
  return (
    <div className="login-page">
      <div className="container-report">
        <h2 className="title">REPORTE</h2>
        <ReporteUsuarios />
      </div>
    </div>
  );
};

export default Report;
