import { Menu } from "antd";
import { MenuProps } from "antd";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  DashboardOutlined,
  UserOutlined,
  TeamOutlined,
  MedicineBoxOutlined,
  HomeOutlined,
  ExperimentOutlined,
  FileTextOutlined,
  BookOutlined,
} from "@ant-design/icons";

// Define menu item interface for type safety
interface MenuItem {
  key: string;
  icon: React.ReactNode;
  label: React.ReactNode;
}

// Base menu items configuration
const BASE_MENU_ITEMS: MenuItem[] = [
  {
    key: "/dashboard",
    icon: <DashboardOutlined />,
    label: <Link href="/dashboard">Dashboard</Link>,
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

// Admin-only menu items
const ADMIN_MENU_ITEMS: MenuItem[] = [
  {
    key: "/users",
    icon: <UserOutlined />,
    label: <Link href="/users">Users</Link>,
  },
  {
    key: "/clinics-management",
    icon: <HomeOutlined />,
    label: <Link href="/clinics-management">Clinics Management</Link>,
  },
  {
    key: "/query-builder",
    icon: <FileTextOutlined />,
    label: <Link href="/query-builder">Query Builder</Link>,
  },
  {
    key: "/reports-management",
    icon: <FileTextOutlined />,
    label: <Link href="/reports-management">Reports Management</Link>,
  },
  {
    key: "/reports",
    icon: <BookOutlined />,
    label: <Link href="/reports">Reports</Link>,
  },
];

// Helper function to get menu items based on user role
const getMenuItems = (isAdmin: boolean): MenuProps["items"] => {
  if (!isAdmin) return BASE_MENU_ITEMS;

  return [
    ...BASE_MENU_ITEMS,
    { type: "divider" },
    { type: "group", label: "Admin Links" },
    ...ADMIN_MENU_ITEMS,
  ];
};

export const SideNavLinks = () => {
  const pathname = usePathname();
  const { data: session } = useSession();

  // Determine if user is admin
  const isAdmin = session?.user?.role === "admin";

  // Get appropriate menu items based on user role
  const menuItems = getMenuItems(isAdmin);

  return (
    <Menu
      mode="inline"
      selectedKeys={[pathname]}
      items={menuItems}
      theme="light"
      className="mt-4 border-r-0"
    />
  );
};
