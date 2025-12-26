import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminOnlyRoute = () => {
  const { user } = useAuth();
  
  // Solo los administradores pueden acceder
  if (user?.rol !== 'admin') {
    // Redirigir a la página principal según el rol
    if (user?.rol === 'empleado') {
      return <Navigate to="/empleado-dashboard" replace />;
    }
    return <Navigate to="/mi-dashboard" replace />;
  }
  
  return <Outlet />;
};

export default AdminOnlyRoute;
