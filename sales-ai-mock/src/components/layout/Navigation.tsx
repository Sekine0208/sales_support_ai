import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Breadcrumb } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import type { ItemType } from 'antd/es/breadcrumb/Breadcrumb';

const Navigation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const pathSnippets = location.pathname.split('/').filter(i => i);

  const breadcrumbItems: ItemType[] = [
    {
      title: (
        <>
          <HomeOutlined />
          <span>ホーム</span>
        </>
      ),
      onClick: () => navigate('/'),
    },
  ];

  const routeNameMap: Record<string, string> = {
    call: '架電支援',
    visit: '訪問支援',
  };

  pathSnippets.forEach((snippet, index) => {
    const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
    breadcrumbItems.push({
      title: routeNameMap[snippet] || snippet,
      onClick: () => navigate(url),
    });
  });

  return <Breadcrumb items={breadcrumbItems} style={{ marginBottom: 16 }} />;
};

export default Navigation;
