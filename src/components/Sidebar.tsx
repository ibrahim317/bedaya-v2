import React from "react";
import { Layout, Drawer } from "antd";
import Image from "next/image";
import { SideNavLinks } from "./SideNavLinks";
import Link from "next/link";

const { Sider } = Layout;

interface SidebarProps {
  collapsed: boolean;
  mobileView: boolean;
  drawerVisible: boolean;
  onDrawerClose: () => void;
  onBreakpoint: (broken: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  collapsed,
  mobileView,
  drawerVisible,
  onDrawerClose,
  onBreakpoint,
}) => {
  const sidebarContent = (
    <>
      <Link href="/" className="flex justify-center items-center p-2 border-b border-gray-200">
        <Image
          src="/logo.png"
          alt="Bedaya Logo"
          width={collapsed ? 40 : 120}
          height={40}
          className="object-contain h-20"
          priority
        />
      </Link>
      <SideNavLinks />
    </>
  );

  if (mobileView) {
    return (
      <Drawer
        placement="left"
        closable={false}
        onClose={onDrawerClose}
        open={drawerVisible}
        width={250}
        bodyStyle={{ padding: 0 }}
      >
        {sidebarContent}
      </Drawer>
    );
  }

  return (
    <Sider
      width={200}
      className="bg-white"
      collapsible
      collapsed={collapsed}
      breakpoint="md"
      onBreakpoint={onBreakpoint}
      trigger={null}
      collapsedWidth={80}
    >
      {sidebarContent}
    </Sider>
  );
}; 