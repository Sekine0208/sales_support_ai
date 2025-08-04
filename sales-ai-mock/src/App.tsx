import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ConfigProvider, App as AntApp } from 'antd';
import AppLayout from './components/layout/AppLayout';
import KPIDashboard from './pages/KPIDashboard';
import CallSupport from './pages/CallSupport';
import VisitSupport from './pages/VisitSupport';
import ManagementDashboard from './pages/ManagementDashboard';

import './App.css';

function App() {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#1890ff',
        },
      }}
    >
      <AntApp>
        <Router>
          <Routes>
            <Route path="/" element={<AppLayout />}>
              <Route index element={<KPIDashboard />} />
              <Route path="call" element={<CallSupport />} />
              <Route path="visit" element={<VisitSupport />} />
              <Route path="management" element={<ManagementDashboard />} />
            </Route>
          </Routes>
        </Router>
      </AntApp>
    </ConfigProvider>
  );
}

export default App;
