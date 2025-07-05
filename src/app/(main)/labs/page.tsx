"use client";

import { useCallback, useState, useEffect } from "react";
import { Table, Button, Card, App, Tag, Input, Select, Row, Col, Statistic } from "antd";
import { useRouter } from "next/navigation";
import { fetchPatients, updateLabTest, updatePatient } from "@/clients/patientClient";
import { getDashboardStats } from "@/clients/dashboard";
import {
  PatientType,
  IPatient,
  PatientLabTest,
  PatientLabTestStatus,
} from "@/types/Patient";

const { Search } = Input;
const { Option } = Select;

interface TableParams {
  page: number;
  pageSize: number;
  search: string;
}

const LabsPage = () => {
  const router = useRouter();
  const { message } = App.useApp();
  const [loading, setLoading] = useState({ adult: false, child: false });
  const [data, setData] = useState<{ adult: IPatient[]; child: IPatient[] }>({
    adult: [],
    child: [],
  });
  const [pagination, setPagination] = useState({
    adult: { current: 1, pageSize: 10, total: 0 },
    child: { current: 1, pageSize: 10, total: 0 },
  });

  const [stats, setStats] = useState<{ labTotalIn: number; labTotalOut: number } | null>(null);

  const [tableParams, setTableParams] = useState<{
    adult: TableParams;
    child: TableParams;
  }>({
    adult: {
      page: 1,
      pageSize: 10,
      search: "",
    },
    child: {
      page: 1,
      pageSize: 10,
      search: "",
    },
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const dashboardStats = await getDashboardStats();
        setStats({
          labTotalIn: dashboardStats.labTotalIn,
          labTotalOut: dashboardStats.labTotalOut,
        });
      } catch (error) {
        message.error("Failed to fetch lab stats");
      }
    };
    fetchStats();
  }, [message]);

  const fetchTableData = useCallback(
    async (type: "adult" | "child") => {
      try {
        setLoading((prev) => ({ ...prev, [type]: true }));
        const params = tableParams[type];

        const response = await fetchPatients({
          type: type === "adult" ? PatientType.Adult : PatientType.Child,
          page: params.page,
          pageSize: params.pageSize,
          sortField: "createdAt",
          sortOrder: "desc",
          search: params.search,
        });

        setData((prev) => ({ ...prev, [type]: response.data }));
        setPagination((prev) => ({
          ...prev,
          [type]: {
            ...prev[type],
            total: response.pagination.total,
            current: params.page,
            pageSize: params.pageSize,
          },
        }));
      } catch (error) {
        message.error(`Failed to fetch ${type} patients`);
      } finally {
        setLoading((prev) => ({ ...prev, [type]: false }));
      }
    },
    [tableParams, message]
  );

  useEffect(() => {
    fetchTableData("adult");
  }, [tableParams.adult, fetchTableData]);

  useEffect(() => {
    fetchTableData("child");
  }, [tableParams.child, fetchTableData]);

  const handleStatusChange = async (
    patientId: string,
    labTestName: "Urine" | "Blood" | "Stool" | "Albumin-Creat",
    status: PatientLabTestStatus,
    type: "adult" | "child"
  ) => {
    try {
      let updatedPatient = await updateLabTest(patientId, {
        labTestName,
        status,
      });
      message.success(
        `Successfully updated ${labTestName} status for patient ${updatedPatient.name}`
      );

      if (
        status === PatientLabTestStatus.CheckedIn &&
        updatedPatient.overAllLabsStatus !== "Checked In"
      ) {
        updatedPatient = await updatePatient(patientId, {
          overAllLabsStatus: "Checked In",
        });
        message.info(
          `Overall lab status set to "Checked In" for patient ${updatedPatient.name}`
        );
      }
      
      // Update local data to avoid refetch
      setData((prev) => {
        const patientList = prev[type];
        const patientIndex = patientList.findIndex(
          (p) => p._id === patientId
        );

        if (patientIndex === -1) {
          return prev;
        }

        const updatedPatientList = [...patientList];
        updatedPatientList[patientIndex] = updatedPatient;

        return {
          ...prev,
          [type]: updatedPatientList,
        };
      });
    } catch (error: any) {
      message.error(error.message || `Failed to update ${labTestName} status`);
    }
  };

  const handleOverallStatusChange = async (
    patientId: string,
    status: "Not Requested" | "Checked In" | "Checked Out",
    type: "adult" | "child"
  ) => {
    try {
      const updatedPatient = await updatePatient(patientId, {
        overAllLabsStatus: status,
      });
      message.success(
        `Successfully updated overall lab status for patient ${updatedPatient.name}`
      );
      // Update local data to avoid refetch
      setData((prev) => {
        const patientList = prev[type];
        const patientIndex = patientList.findIndex(
          (p) => p._id === patientId
        );

        if (patientIndex === -1) {
          return prev;
        }

        const updatedPatientList = [...patientList];
        updatedPatientList[patientIndex] = updatedPatient;

        return {
          ...prev,
          [type]: updatedPatientList,
        };
      });
    } catch (error: any) {
      message.error(error.message || `Failed to update overall lab status`);
    }
  };


  const handleTableChange = (
    type: "adult" | "child",
    pagination: any
  ) => {
    setTableParams((prev) => ({
      ...prev,
      [type]: {
        ...prev[type],
        page: pagination.current,
        pageSize: pagination.pageSize,
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

  const handleSetResult = (
    patientId: string,
    testType: "Stool" | "Urine" | "Blood" | "Albumin-Creat"
  ) => {
    router.push(`/labs/${testType.toLowerCase()}?patientId=${patientId}`);
  };

  const getStatusColumn = (
    labTestName: "Urine" | "Blood" | "Stool" | "Albumin-Creat",
    type: "adult" | "child"
  ) => ({
    title: labTestName,
    key: labTestName.toLowerCase(),
    width: "10%",
    render: (record: IPatient) => {
      const test = record.labTest?.find((t) => t.labTestName === labTestName);
      const status = test?.status;

      return (
        <Select
          value={status || "Not Requested"}
          onChange={(newStatus) =>
            handleStatusChange(
              String(record._id),
              labTestName,
              newStatus as PatientLabTestStatus,
              type
            )
          }
        >

          {Object.values(PatientLabTestStatus)
            .map((s) => (
              <Option key={s} value={s}>
                {s}
              </Option>
            ))}
        </Select>
      );
    },
  });


  const getColumns = (type: "adult" | "child") => [
    {
      title: "Code",
      dataIndex: "code",
      key: "code",
      width: "10%",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: "10%",
    },
    {
      title: "Overall Status",
      key: "overallStatus",
      width: "10%",
      render: (record: IPatient) => {
        const hasCheckedInLab = record.labTest?.some(
          (test) => test.status === PatientLabTestStatus.CheckedIn
        );
        const hasProgressedLab = record.labTest?.some(
          (test) =>
            test.status === PatientLabTestStatus.CheckedIn ||
            test.status === PatientLabTestStatus.CheckedOut
        );
        return (
          <Select
            value={record.overAllLabsStatus || "Not Requested"}
            onChange={(newStatus) =>
              handleOverallStatusChange(
                String(record._id),
                newStatus as "Not Requested" | "Checked In" | "Checked Out",
                type
              )
            }
          >
            {(["Not Requested", "Checked In", "Checked Out"] as const).map(
              (s) => (
                <Option
                  key={s}
                  value={s}
                  disabled={
                    (s === "Checked Out" && hasCheckedInLab) ||
                    (s === "Not Requested" && hasProgressedLab)
                  }
                >
                  {s}
                </Option>
              )
            )}
          </Select>
        );
      },
    },
    {
      title: "Status",
      children: [
        getStatusColumn("Stool", type),
        getStatusColumn("Urine", type),
        getStatusColumn("Blood", type),
        getStatusColumn("Albumin-Creat", type),
      ],
    },
    {
      title: "Actions",
      key: "actions",
      width: "20%",
      render: (record: IPatient) => (
        <div className="flex flex-col gap-2 items-start">
          {(["Stool", "Urine", "Blood", "Albumin-Creat"] as const).map((labName) => {
            const test = record.labTest?.find(
              (t) => t.labTestName === labName
            );
            const isCheckedIn =
              test?.status === PatientLabTestStatus.CheckedIn;
            const isCheckedOut =
              test?.status === PatientLabTestStatus.CheckedOut;
            const isDisabled = !isCheckedIn && !isCheckedOut;
            const buttonText = isCheckedOut
              ? `Show ${labName} Result`
              : `Set ${labName} Results`;

            const handleClick = () => {
              if (isDisabled) {
                message.warning(
                  `Please set the ${labName} status to "Checked In" first`
                );
              } else {
                handleSetResult(String(record._id), labName);
              }
            };

            return (
              <div onClick={handleClick} key={labName}>
                <Button
                  size="small"
                  disabled={isDisabled}
                  style={{ pointerEvents: isDisabled ? "none" : "auto" }}
                >
                  {buttonText}
                </Button>
              </div>
            );
          })}
        </div>
      ),
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <Card>
        <Row gutter={16}>
          <Col span={12}>
            <Statistic title="Total Patients In" value={stats?.labTotalIn ?? 'Loading...'} />
          </Col>
          <Col span={12}>
            <Statistic title="Total Patients Out" value={stats?.labTotalOut ?? 'Loading...'} />
          </Col>
        </Row>
      </Card>

      <Card
        title="Adult Patients Lab Tests"
        className="overflow-x-auto"
        extra={
          <Search
            placeholder="Search by name or code..."
            allowClear
            onSearch={(value) => handleSearch('adult', value)}
            className="block self-end"
            style={{ width: 250 }}
          />
        }
      >
        <Table
          columns={getColumns('adult')}
          rowKey="_id"
          dataSource={data.adult}
          pagination={pagination.adult}
          loading={loading.adult}
          onChange={(pagination) => handleTableChange('adult', pagination)}
          bordered
        />
      </Card>

      <Card
        title="Child Patients Lab Tests"
        className="overflow-x-auto"
        extra={
          <Search
            placeholder="Search by name or code..."
            allowClear
            onSearch={(value) => handleSearch('child', value)}
            style={{ width: 250 }}
          />
        }
      >
        <Table
          columns={getColumns('child')}
          rowKey="_id"
          dataSource={data.child}
          pagination={pagination.child}
          loading={loading.child}
          onChange={(pagination) => handleTableChange('child', pagination)}
          bordered
        />
      </Card>
    </div>
  );
};

export default LabsPage;