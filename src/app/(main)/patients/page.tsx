"use client";

import { useCallback, useState, useEffect } from "react";
import { Table, Input, Button, Card, App, Popconfirm } from "antd";
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { fetchPatients, deletePatient } from "@/clients/patientClient";
import { PatientType } from "@/types/Patient";
import dayjs from "dayjs";

const { Search } = Input;

interface TableParams {
  search: string;
  sortField: string;
  sortOrder: "ascend" | "descend" | null;
  page: number;
  pageSize: number;
}

const PatientListPage = () => {
  const router = useRouter();
  const { message } = App.useApp();
  const [loading, setLoading] = useState({ adult: false, child: false });
  const [data, setData] = useState({ adult: [], child: [] });
  const [pagination, setPagination] = useState({
    adult: { current: 1, pageSize: 10, total: 0 },
    child: { current: 1, pageSize: 10, total: 0 },
  });

  const [tableParams, setTableParams] = useState<{
    adult: TableParams;
    child: TableParams;
  }>({
    adult: {
      search: "",
      sortField: "createdAt",
      sortOrder: "descend",
      page: 1,
      pageSize: 10,
    },
    child: {
      search: "",
      sortField: "createdAt",
      sortOrder: "descend",
      page: 1,
      pageSize: 10,
    },
  });

  const fetchTableData = useCallback(
    async (type: "adult" | "child") => {
      try {
        setLoading({ ...loading, [type]: true });
        const params = tableParams[type];
        
        const response = await fetchPatients({
          type: type === "adult" ? PatientType.Adult : PatientType.Child,
          search: params.search,
          sortField: params.sortField,
          sortOrder: params.sortOrder === "ascend" ? "asc" : "desc",
          page: params.page,
          pageSize: params.pageSize,
        });

        setData((prev) => ({ ...prev, [type]: response.data }));
        setPagination((prev) => ({
          ...prev,
          [type]: {
            ...prev[type],
            total: response.pagination.total,
          },
        }));
      } catch (error) {
        message.error("Failed to fetch patients");
      } finally {
        setLoading({ ...loading, [type]: false });
      }
    },
    [tableParams, message]
  );

  const handleTableChange = (
    type: "adult" | "child",
    pagination: any,
    filters: any,
    sorter: any
  ) => {
    setTableParams((prev) => ({
      ...prev,
      [type]: {
        ...prev[type],
        page: pagination.current,
        pageSize: pagination.pageSize,
        sortField: sorter.field || "createdAt",
        sortOrder: sorter.order || "descend",
      },
    }));
  };

  const handleSearch = (type: "adult" | "child", value: string) => {
    setTableParams((prev) => ({
      ...prev,
      [type]: {
        ...prev[type],
        search: value,
        page: 1,
      },
    }));
  };

  const handleDelete = async (type: "adult" | "child", id: string) => {
    try {
      setLoading((prev) => ({ ...prev, [type]: true }));
      await deletePatient(id);
      message.success("Patient deleted successfully");
      fetchTableData(type);
    } catch (error: any) {
      message.error(error.message || "Failed to delete patient");
    } finally {
      setLoading((prev) => ({ ...prev, [type]: false }));
    }
  };

  const columns = [
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
            onClick={() => router.push(`/patients/update-adult/${record._id}`)}
            size="small"
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure to delete this patient?"
            onConfirm={() => handleDelete(record.type === PatientType.Adult ? "adult" : "child", record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              icon={<DeleteOutlined />}
              danger
              size="small"
            >
              Delete
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  useEffect(() => {
    fetchTableData("adult");
  }, [
    tableParams.adult.search,
    tableParams.adult.sortField,
    tableParams.adult.sortOrder,
    tableParams.adult.page,
    tableParams.adult.pageSize,
  ]);

  useEffect(() => {
    fetchTableData("child");
  }, [
    tableParams.child.search,
    tableParams.child.sortField,
    tableParams.child.sortOrder,
    tableParams.child.page,
    tableParams.child.pageSize,
  ]);

  return (
    <div className="p-6 space-y-6">
      {/* Adult Patients */}
      <Card
        title="Adult Patients"
        extra={
          <div className="flex gap-4">
            <Search
              placeholder="Search patients..."
              allowClear
              onSearch={(value) => handleSearch("adult", value)}
              style={{ width: 250 }}
            />
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => router.push("/patients/create-adult")}
            >
              Add Adult Patient
            </Button>
          </div>
        }
      >
        <Table
          columns={columns}
          rowKey="_id"
          dataSource={data.adult}
          pagination={pagination.adult}
          loading={loading.adult}
          onChange={(pagination, filters, sorter) =>
            handleTableChange("adult", pagination, filters, sorter)
          }
        />
      </Card>

      {/* Child Patients */}
      <Card
        title="Child Patients"
        extra={
          <div className="flex gap-4">
            <Search
              placeholder="Search patients..."
              allowClear
              onSearch={(value) => handleSearch("child", value)}
              style={{ width: 250 }}
            />
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => router.push("/patients/create-child")}
            >
              Add Child Patient
            </Button>
          </div>
        }
      >
        <Table
          columns={columns}
          rowKey="_id"
          dataSource={data.child}
          pagination={pagination.child}
          loading={loading.child}
          onChange={(pagination, filters, sorter) =>
            handleTableChange("child", pagination, filters, sorter)
          }
        />
      </Card>
    </div>
  );
};

export default PatientListPage;