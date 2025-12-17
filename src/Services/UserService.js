// src/services/UserService.js
let userFoto = null;

const UserService = {
  getFoto: () => userFoto,
  
  setFoto: (foto) => {
    userFoto = foto;
    window.dispatchEvent(new CustomEvent('userFotoChanged', { detail: foto }));
  }
};

// Export como DEFAULT
export default UserService;