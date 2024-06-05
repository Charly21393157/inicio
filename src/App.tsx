import React, { useState, useEffect } from "react";
import axios from "axios";
import "./UsuarioComponent.css"; // Importa los estilos CSS

interface Usuario {
  pkUsuario: number;
  nombre: string;
  user: string;
  password: string;
  fkRol: number;
}

const UsuarioComponent: React.FC = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [nombre, setNombre] = useState<string>("");
  const [user, setUser] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [fkRol, setFkRol] = useState<number>(0);
  const [editingUserId, setEditingUserId] = useState<number | null>(null);

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const fetchUsuarios = async () => {
    try {
      const response = await axios.get("https://localhost:7299/Usuario");
      setUsuarios(response.data.result);
      setLoading(false);
    } catch (error) {
      console.error("Error al obtener la lista de usuarios:", error);
    }
  };

  const handleDeleteUsuario = async (id: number) => {
    try {
      await axios.delete(`https://localhost:7299/Usuario/${id}`);
      setUsuarios((prevUsuarios) =>
        prevUsuarios.filter((usuario) => usuario.pkUsuario !== id)
      );
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
    }
  };

  const handleCrearUsuario = async () => {
    try {
      const response = await axios.post("https://localhost:7299/Usuario", {
        nombre: nombre,
        user: user,
        password: password,
        fkRol: fkRol,
      });
      await fetchUsuarios(); // Actualizar la lista después de crear un usuario
      // Limpiar los campos después de crear un usuario
      setNombre("");
      setUser("");
      setPassword("");
      setFkRol(0);
    } catch (error) {
      console.error("Error al crear usuario:", error);
    }
  };

  const handleEditarUsuario = async (id: number) => {
    try {
      const response = await axios.put(`https://localhost:7299/Usuario/${id}`, {
        nombre: nombre,
        user: user,
        password: password,
        fkRol: fkRol,
      });
      await fetchUsuarios(); // Actualizar la lista después de editar un usuario
      // Limpiar los campos después de editar un usuario
      setNombre("");
      setUser("");
      setPassword("");
      setFkRol(0);
      setEditingUserId(null); // Terminar el modo de edición
    } catch (error) {
      console.error("Error al editar usuario:", error);
    }
  };

  const handleEditarUsuarioClick = (id: number) => {
    const usuarioAEditar = usuarios.find((usuario) => usuario.pkUsuario === id);
    if (usuarioAEditar) {
      setNombre(usuarioAEditar.nombre);
      setUser(usuarioAEditar.user);
      setPassword(usuarioAEditar.password);
      setFkRol(usuarioAEditar.fkRol);
      setEditingUserId(id);
    }
  };
  
  const encodePassword = (password: string) => {
    return password.substring(0, password.length - 1).replace(/./g, '*') + password.charAt(password.length - 1);
  };

  if (loading) {
    return <div className="loading">Cargando...</div>;
  }

  return (
    <div className="usuario-container">
      <table className="usuario-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>User</th>
            <th>Password</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((usuario) => (
            <tr key={usuario.pkUsuario} className="usuario-row">
              <td>{usuario.pkUsuario}</td>
              <td>{usuario.nombre}</td>
              <td>{usuario.user}</td>
              <td>{encodePassword(usuario.password)}</td>
              <td>
                <button onClick={() => handleDeleteUsuario(usuario.pkUsuario)}>
                  Eliminar
                </button>
                <button
                  onClick={() => handleEditarUsuarioClick(usuario.pkUsuario)}
                >
                  Editar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <form className="usuario-form">
        <h2>{editingUserId ? "Editar Usuario" : "Crear Usuario"}</h2>
        <div className="form-group">
          <label htmlFor="nombre">Nombre:</label>
          <input
            type="text"
            id="nombre"
            placeholder="Nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="user">User:</label>
          <input
            type="text"
            id="user"
            placeholder="User"
            value={user}
            onChange={(e) => setUser(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="text" // Cambiado de "password" a "text"
            id="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="fkRol">ID de Rol:</label>
          <input
            type="number"
            id="fkRol"
            placeholder="ID de Rol"
            value={fkRol}
            onChange={(e) => setFkRol(parseInt(e.target.value))}
          />
        </div>
        <button
          onClick={
            editingUserId
              ? () => handleEditarUsuario(editingUserId)
              : handleCrearUsuario
          }
        >
          {editingUserId ? "Editar Usuario" : "Crear Usuario"}
        </button>
      </form>
    </div>
  );
};

export default UsuarioComponent;
