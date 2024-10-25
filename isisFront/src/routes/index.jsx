import React from 'react';
import { useRoutes } from 'react-router-dom';
import FormLogin from '../components/Login/FormLogin';
import Dashboard from '../Dashboard/Dashboard';

const AppRoutes = () => {
  const routes = useRoutes([
    { path: '/', element: <FormLogin /> },
    { path: '/dashboard', element: <Dashboard /> },
  ]);

  return routes;
};

export default AppRoutes;
