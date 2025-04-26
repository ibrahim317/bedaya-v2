import {
  DashboardOutlined,
  UserOutlined,
  SettingOutlined,
  ExperimentOutlined,
  MedicineBoxOutlined,
  TeamOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import { Menu } from "antd";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { MenuProps } from 'antd';

export const SideNavLinks = () => {
  const pathname = usePathname();

  const items: MenuProps['items'] = [
    {
      key: "/dashboard",
      icon: <DashboardOutlined />,
      label: <Link href="/dashboard">Dashboard</Link>,
    },
    {
      key: "/users",
      icon: <UserOutlined />,
      label: <Link href="/users">Users</Link>,
    },
    {
      key: "/patients",
      icon: <TeamOutlined />,
      label: <Link href="/patients">Patients</Link>,
    },
    {
      key: "/pharmacy",
      icon: <MedicineBoxOutlined />,
      label: <Link href="/pharmacy">Pharmacy</Link>,
    },
    {
      key: "/clinics",
      icon: <HomeOutlined />,
      label: <Link href="/clinics">Clinics</Link>,
    },
    {
      key: "/labs",
      icon: <ExperimentOutlined />,
      label: <Link href="/labs">Labs</Link>,
    },
  ];

  return (
    <Menu
      mode="inline"
      selectedKeys={[pathname]}
      className="mt-4 border-r-0"
      items={items}
      theme="light"
    />
  );
};
