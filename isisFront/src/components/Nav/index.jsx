import React from 'react';
import { Link } from 'react-router-dom';
import { Layout, Menu, Avatar, Drawer } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png';
import './index.css';

const tabNames = ['Home', 'Inventary', 'Analitics','Arm Controll'];
const items = tabNames.map((tab, index) => ({
  key: index,
  label: <Link to={`/${tab.toLowerCase()}`}>{tab}</Link>,
}));  

const Nav = () => {

  const navigate = useNavigate(); // Define navigate con useNavigate

  const handleLogout = () => {
  localStorage.removeItem('token');
  navigate('/');
};
    const [drawerVisible, setDrawerVisible] = React.useState(false);
  
    const showDrawer = () => {
      setDrawerVisible(true);
    };
  
    const closeDrawer = () => {
      setDrawerVisible(false);
    };
  
    return (
      <Layout.Header className="header">
        <Link to="/home">
          <img src={logo} alt="Logo" style={{ height: '40px' }} />
        </Link>
        <Menu mode="horizontal" items={items} style={{ flex: 1, justifyContent: 'center' }} />
        <Avatar icon={<UserOutlined />} onClick={showDrawer} />
        <Drawer title="User Menu" placement="right" onClose={closeDrawer} visible={drawerVisible}>
          {/* Opciones dentro del Drawer */}
          {/*<p><Link to="/profile">Perfil</Link></p>*/}
          <button onClick={handleLogout} className="logout-button">
        Cerrar Sesión
      </button>
        </Drawer>
      </Layout.Header>
    );
  };
  
  export default Nav;