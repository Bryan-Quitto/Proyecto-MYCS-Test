import { lazy } from 'react';
import { Navigate, createBrowserRouter, Outlet } from "react-router";
import Loadable from 'src/layouts/full/shared/loadable/Loadable';
import ProtectedRoute from './ProtectedRoute';
import { useUser } from '../contexts/UserContext';

const FullLayout = Loadable(lazy(() => import('../layouts/full/FullLayout')));
const BlankLayout = Loadable(lazy(() => import('../layouts/blank/BlankLayout')));
const Form = Loadable(lazy(() => import("../views/forms/Form")));
const CreateEvent = Loadable(lazy(() => import("../views/Eventos/CreateEvent")));
const ListEvents = Loadable(lazy(() => import("../views/Eventos/ListEvents")));
const UserManagement = Loadable(lazy(() => import("../views/Usuarios/UserManagement")));
const CreateUserPage = Loadable(lazy(() => import("../views/Usuarios/CreateUserPage")));
const Catalogo = Loadable(lazy(() => import('../views/catalogo/Catalogo')));
const EventoDetalle = Loadable(lazy(() => import('../views/eventoDetalle/EventoDetalle')));

const Dashboard = Loadable(lazy(() => import('../views/dashboards/Dashboard')));
const MiPerfil = Loadable(lazy(() => import('../views/perfil/MiPerfil')));

const Login = Loadable(lazy(() => import('../views/auth/login/Login')));
const Register = Loadable(lazy(() => import('../views/auth/register/Register')));
const Error = Loadable(lazy(() => import('../views/auth/error/Error')));


const AuthRoutes = () => {
  const { user, loading, isLoggingIn } = useUser();
  if (loading) return null;
  return user && !isLoggingIn ? <Navigate to="/" /> : <Outlet />;
};

const Router = [
  {
    path: '/',
    element: <ProtectedRoute />,
    children: [
      {
        path: '/',
        element: <FullLayout />,
        children: [
          { path: '/', element: <Dashboard /> },
          { path: '/catalogo', exact: true, element: <Catalogo /> },
          { path: '/evento/:id', exact: true, element: <EventoDetalle /> },
          { path: '/ui/form', exact: true, element: <Form/> },
          { path: '/eventos/crear', exact: true, element: <CreateEvent/> },
          { path: '/eventos/listar', exact: true, element: <ListEvents/> },
          { path: '/usuarios/listar', exact: true, element: <UserManagement/> },
          { path: '/usuarios/crear', exact: true, element: <CreateUserPage/> },
          { path: 'perfil', element: <MiPerfil /> },
        ],
      },
    ],
  },
  {
    path: '/auth',
    element: <AuthRoutes />,
    children: [
      {
        path: '',
        element: <BlankLayout />,
        children: [
          { path: 'login', element: <Login /> },
          { path: 'register', element: <Register /> },
          { path: '404', element: <Error /> },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/auth/404" />,
  },
];

const AppRouter = () => {
    return createBrowserRouter(Router);
}

const router = AppRouter();

export default router;