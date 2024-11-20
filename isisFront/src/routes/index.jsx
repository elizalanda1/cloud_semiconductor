import React from 'react';
import { useRoutes } from 'react-router-dom';
import FormLogin from '../components/Login/FormLogin';
import Dashboard from '../Views/Dashboard/Dashboard';
import FormRegister from '../components/FormRegister/index'
import InventoryView from '../SingleViews/Inventory';
import ReportView from '../SingleViews/Reports';
import UserUpdate from '../components/UserUpdate';
import RobotArmControlView from '../SingleViews/ArmController'
import AnalyticsView from '../SingleViews/Analitics'
const AppRoutes = () => {
  const routes = useRoutes([
    { path: '/', element: <FormLogin /> },
    { path: '/registro', element: <FormRegister /> },
    { path: '/dashboard', element: <Dashboard /> },
    { path: '/home', element: <Dashboard /> },
    { path: '/inventary', element: <InventoryView /> },
    { path: '/reports', element: <ReportView /> },
    { path: '/profile', element: <UserUpdate /> },
    { path: '/arm controll', element: <RobotArmControlView /> },
    { path: '/Analitics', element: <AnalyticsView /> },




  ]);

  return routes;
};

export default AppRoutes;
