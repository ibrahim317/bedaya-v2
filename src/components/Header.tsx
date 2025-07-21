'use client';

import { Button, Dropdown, Avatar } from 'antd';
import { MenuFoldOutlined, MenuUnfoldOutlined, LogoutOutlined, UserOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { usePathname, useRouter } from 'next/navigation';

interface HeaderProps {
  mobileView: boolean;
  collapsed: boolean;
  toggleDrawer: () => void;
  setCollapsed: (collapsed: boolean) => void;
  handleSignOut: () => void;
}

export default function HeaderComponent({
  mobileView,
  collapsed,
  toggleDrawer,
  setCollapsed,
  handleSignOut,
}: HeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  
  const rootPages = ['/dashboard', '/patients', '/clinics-management', '/users', '/labs', '/pharmacy', '/clinics'];
  // Show back button only on detail pages (pages that are not root pages)
  const showBackButton = !rootPages.some(page => pathname === page);

  return (
    <header className="bg-white z-10 p-0 flex justify-between items-center shadow-md">
      <div className="flex items-center">
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
        {showBackButton && (
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={() => router.back()}
            className="mr-4"
          >
            Back
          </Button>
        )}
      </div>
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
                onClick: handleSignOut,
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