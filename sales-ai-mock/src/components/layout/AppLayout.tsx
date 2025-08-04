import React from 'react';
import { Layout, Menu, theme } from 'antd';
import {
  DashboardOutlined,
  PhoneOutlined,
  TeamOutlined,
  BarChartOutlined,
} from '@ant-design/icons';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';

const { Sider, Content } = Layout;

const AppLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  // 現在のパスに基づいてアクティブなメニューキーを決定
  const getSelectedKey = () => {
    const pathname = location.pathname;
    if (pathname === '/') return 'dashboard';
    if (pathname.startsWith('/call')) return 'call';
    if (pathname.startsWith('/visit')) return 'visit';
    if (pathname.startsWith('/management')) return 'management';
    return 'dashboard';
  };

  const menuItems = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: '営業ダッシュボード',
      onClick: () => navigate('/'),
    },
    {
      key: 'call',
      icon: <PhoneOutlined />,
      label: '架電支援',
      onClick: () => navigate('/call'),
    },
    {
      key: 'visit',
      icon: <TeamOutlined />,
      label: '訪問支援',
      onClick: () => navigate('/visit'),
    },
    {
      key: 'management',
      icon: <BarChartOutlined />,
      label: 'マネジメントダッシュボード',
      onClick: () => navigate('/management'),
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider theme="dark" width={240}>
        <div
          style={{
            height: 64,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '18px',
            fontWeight: 'bold',
          }}
        >
          営業サポートAI
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[getSelectedKey()]}
          items={menuItems}
        />
      </Sider>
      <Layout>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: '8px',
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AppLayout;
