"use client";

import { useCallback, useState, useEffect } from "react";
import { Table, Input, Button, Card, App, Popconfirm, Tabs } from "antd";
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { fetchPatients, deletePatient } from "@/clients/patientClient";
import { cacheService } from "@/services/cacheService";
import { PatientType, IPatient } from "@/types/Patient";
import dayjs from "dayjs";
import OfflineTable from "@/components/OfflineTable";
import { STORE_NAMES } from "@/types/IndexedDB";
import { useMemo } from "react";

const { Search } = Input;
const { TabPane } = Tabs;

const PatientListPage = () => {
  const router = useRouter();
  const { message } = App.useApp();
  const [activeTab, setActiveTab] = useState<"adult" | "child">("adult");
  const [search, setSearch] = useState({ adult: "", child: "" });

  const handleDelete = async (id: string) => {
    try {
      await deletePatient(id);
      message.success("Patient deleted successfully");
      // Here we would ideally trigger a refresh of the offline table
      // For now, the table will refetch on the next online/offline state change
    } catch (error: any) {
      message.error(error.message || "Failed to delete patient");
    }
  };

  const columns = useMemo(() => (type: "adult" | "child") => [
    {
      title: "Name",
      dataIndex: "name",
      sorter: true,
      width: "20%",
    },
    {
      title: "Code",
      dataIndex: "code",
      sorter: true,
      width: "15%",
    },
    {
      title: "Sex",
      dataIndex: "sex",
      width: "10%",
    },
    {
      title: "Age",
      dataIndex: "age",
      sorter: true,
      width: "10%",
    },
    {
      title: "Mobile",
      dataIndex: "mobileNumber",
      width: "15%",
    },
    {
      title: "Day",
      dataIndex: "checkupDay",
      width: "10%",
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      sorter: true,
      width: "20%",
      render: (date: string) => dayjs(date).format("YYYY-MM-DD HH:mm"),
    },
    {
      title: "Actions",
      dataIndex: "actions",
      width: "10%",
      render: (_: any, record: any) => (
        <div className="flex gap-2">
          <Button
            icon={<EditOutlined />}
            onClick={() => router.push(`/patients/update-${type}/${record._id}`)}
            size="small"
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this patient?"
            onConfirm={() => handleDelete(record._id)}
          >
            <Button icon={<DeleteOutlined />} danger size="small">
              Delete
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ], [router]);

  const fetchData = useCallback(async (type: "adult" | "child") => {
    const patientType = type === "adult" ? PatientType.Adult : PatientType.Child;
    const response = await fetchPatients({
      type: patientType,
      search: search[type],
      page: 1,
      pageSize: 100,
    });
    return response;
  }, [search]);

  const getCachedData = useCallback(async (type: "adult" | "child") => {
    const patientType = type === "adult" ? PatientType.Adult : PatientType.Child;
    const result = await cacheService.query<IPatient>({
      store: STORE_NAMES.PATIENTS,
      filter: (p) => p.data.type === patientType,
    });
    return result.items;
  }, []);


  const renderTable = (type: "adult" | "child") => {
    return (
      <OfflineTable
        fetchData={() => fetchData(type)}
        getCachedData={() => getCachedData(type)}
        cacheKey={`${type}-patients-${search[type]}`}
        columns={columns(type)}
        rowKey="_id"
      />
    );
  };

  return (
    <div className="md:p-6">
      <Card
        className="overflow-x-auto"
        title="Patient Management"
        extra={
          <div className="flex gap-4">
            <Search
              placeholder={`Search ${activeTab} patients`}
              onSearch={(value) => setSearch({ ...search, [activeTab]: value })}
              style={{ width: 250 }}
            />
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => router.push(`/patients/create-${activeTab}`)}
            >
              Create {activeTab === "adult" ? "Adult" : "Child"} Patient
            </Button>
          </div>
        }
      >
        <Tabs
          activeKey={activeTab}
          onChange={(key) => setActiveTab(key as any)}
          destroyInactiveTabPane
        >
          <TabPane tab="Adult Patients" key="adult">
            {renderTable("adult")}
          </TabPane>
          <TabPane tab="Child Patients" key="child">
            {renderTable("child")}
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default PatientListPage;