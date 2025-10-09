import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Import das páginas criadas
import Home from "./pages/Home";
import Login from "./pages/Login";
import Principal from "./pages/Principal";
import Sobre from "./pages/Sobre";
import QuemSomos from "./pages/QuemSomos";
import EditarPerfil from "./pages/EditarPerfil";
import Contato from "./pages/Contato";
import ContatoInstitucional from "./pages/ContatoInstitucional";

function App() {
  return (
    <Router>
      <Routes>
        {/* Página inicial pública */}
        <Route path="/" element={<Home />} />

        {/* Demais páginas */}
        <Route path="/login" element={<Login />} />
        <Route path="/principal" element={<Principal />} />
        <Route path="/sobre" element={<Sobre />} />
        <Route path="/quemsomos" element={<QuemSomos />} />
        <Route path="/editarperfil" element={<EditarPerfil />} />
        <Route path="/contato" element={<Contato />} />
        <Route path="/contatoinstitucional" element={<ContatoInstitucional />} />

        {/* Rota alternativa para URLs não encontradas */}
        <Route
          path="*"
          element={
            <div style={{ padding: "2rem", textAlign: "center" }}>
              <h2>Página não encontrada 😕</h2>
              <p>Verifique o endereço e tente novamente.</p>
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
