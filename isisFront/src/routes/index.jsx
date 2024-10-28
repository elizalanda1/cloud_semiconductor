import React from 'react';
import { useRoutes } from 'react-router-dom';
import FormLogin from '../components/Login/FormLogin';
import Dashboard from '../Dashboard/Dashboard';
import FormRegister from '../components/FormRegister/index'

const AppRoutes = () => {
  const routes = useRoutes([
    { path: '/', element: <FormLogin /> },
    { path: '/dashboard', element: <Dashboard /> },
    { path: '/registro', element: <FormRegister /> },

  ]);

  return routes;
};

export default AppRoutes;
