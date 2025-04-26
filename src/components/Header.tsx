'use client';

import { Button, Dropdown, Avatar } from 'antd';
import { MenuFoldOutlined, MenuUnfoldOutlined, LogoutOutlined, UserOutlined } from '@ant-design/icons';
import Link from 'next/link';  // Assuming the app title might need linking, but keeping it simple

interface HeaderProps {
  mobileView: boolean;
  collapsed: boolean;
  toggleDrawer: () => void;
  setCollapsed: (collapsed: boolean) => void;
  handleSignOut: () => void;  // Added as a prop
}

export default function HeaderComponent({
  mobileView,
  collapsed,
  toggleDrawer,
  setCollapsed,
  handleSignOut,
}: HeaderProps) {
  return (
    <header className="bg-white p-0 flex justify-between items-center shadow-md">
      <Button
        type="text"
        icon={
          mobileView ? (
            <MenuUnfoldOutlined />
          ) : collapsed ? (
            <MenuUnfoldOutlined />
          ) : (
            <MenuFoldOutlined />
          )
        }
        onClick={mobileView ? toggleDrawer : () => setCollapsed(!collapsed)}
        className="w-16 h-16"
      />
      <h1 className="text-xl font-bold text-black px-4">Bedaya App</h1>
      <div className="relative mr-4">
        <Dropdown
          menu={{
            items: [
              {
                key: "logout",
                label: "Logout",
                danger: true,
                icon: <LogoutOutlined />,
                onClick: handleSignOut,  // Use the prop here
              },
            ],
          }}
          placement="bottomRight"
        >
          <Avatar
            size={40}
            icon={<UserOutlined />}
            className="cursor-pointer"
          />
        </Dropdown>
      </div>
    </header>
  );
} 