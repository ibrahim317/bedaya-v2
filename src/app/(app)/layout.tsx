"use client"
import React, { useState } from 'react';
import { Layout, Menu, Button, Drawer } from 'antd';
import 'antd/dist/reset.css';  // Import Ant Design styles
import { DashboardOutlined, SettingOutlined, MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { UserOutlined } from '@ant-design/icons';

const { Header, Sider, Content } = Layout;

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileView, setMobileView] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);

  React.useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 768;
      setMobileView(isMobile);
      if (isMobile) {
        setCollapsed(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const menuItems = (
    <Menu mode="inline" defaultSelectedKeys={['1']} className="mt-4">
      <Menu.Item key="1" icon={<DashboardOutlined />}>Dashboard</Menu.Item>
      <Menu.Item key="2" icon={<UserOutlined />}>Users</Menu.Item>
      <Menu.Item key="3" icon={<SettingOutlined />}>Settings</Menu.Item>
    </Menu>
  );

  const toggleDrawer = () => {
    setDrawerVisible(!drawerVisible);
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {!mobileView ? (
        <Sider 
          width={200} 
          className="bg-white"
          collapsible 
          collapsed={collapsed}
          breakpoint="md"
          onBreakpoint={setCollapsed}
          trigger={null}
          collapsedWidth={80}
        >
          <div className="demo-logo-vertical" />
          {menuItems}
        </Sider>
      ) : (
        <Drawer
          placement="left"
          closable={false}
          onClose={toggleDrawer}
          open={drawerVisible}
          width={250}
          bodyStyle={{ padding: 0 }}
        >
          <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Bedaya App</h2>
            {menuItems}
          </div>
        </Drawer>
      )}
      <Layout>
        <Header className="bg-white p-0 flex justify-between items-center shadow-md">
          <Button
            type="text"
            icon={mobileView ? <MenuUnfoldOutlined /> : (collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />)}
            onClick={mobileView ? toggleDrawer : () => setCollapsed(!collapsed)}
            className="w-16 h-16"
          />
          <h1 className="text-xl font-bold text-black px-4">Bedaya App</h1>
          <Button type="primary" className="mr-4">Logout</Button>
        </Header>
        <Content className="p-6">
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default AppLayout; 