"use client";
import React, { useState } from "react";
import { Layout, Button, message } from "antd";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";  // Import for signOut function
import { Sidebar } from "../../components/Sidebar";
import HeaderComponent from "../../components/Header";

const { Content } = Layout;

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileView, setMobileView] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const { status } = useSession();
  const router = useRouter();
  const [messageApi] = message.useMessage();
  
  const handleSignOut = async () => {
    try {
      await signOut({ redirect: false });
      messageApi.success('You have been successfully logged out');
      router.push('/login');
    } catch {
      messageApi.error('Failed to sign out');
    }
  };
  
  React.useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 768;
      setMobileView(isMobile);
      if (isMobile) {
        setCollapsed(true);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleDrawer = () => {
    setDrawerVisible(!drawerVisible);
  };

  return (
    <Layout style={{ height: "100vh" }}>
      <Sidebar
        collapsed={collapsed}
        mobileView={mobileView}
        drawerVisible={drawerVisible}
        onDrawerClose={toggleDrawer}
        onBreakpoint={setCollapsed}
      />
      <Layout>
        <HeaderComponent
          mobileView={mobileView}
          collapsed={collapsed}
          toggleDrawer={toggleDrawer}
          setCollapsed={setCollapsed}
          handleSignOut={handleSignOut}
        />
        <Content className="overflow-auto" style={{ height: "calc(100vh - 64px)" }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default AppLayout;
