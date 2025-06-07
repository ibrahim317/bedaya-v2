"use client";

import { useCallback, useState, useEffect } from "react";
import { Table, Button, Card, App, Tag, Input, Select } from "antd";
import { useRouter } from "next/navigation";
import { fetchPatients, updateLabTest } from "@/clients/patientClient";
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

  const handleStatusChange = async (
    patientId: string,
    labTestName: "Urine" | "Blood" | "Stool",
    status: PatientLabTestStatus,
    type: "adult" | "child"
  ) => {
    try {
      const updatedPatient = await updateLabTest(patientId, {
        labTestName,
        status,
      });
      message.success(
        `Successfully updated ${labTestName} status for patient ${updatedPatient.name}`
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
      message.error(error.message || `Failed to update ${labTestName} status`);
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
    testType: "Stool" | "Urine" | "Blood"
  ) => {
    router.push(`/labs/${testType.toLowerCase()}?patientId=${patientId}`);
  };

  const getStatusColumn = (
    labTestName: "Urine" | "Blood" | "Stool",
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
          style={{ width: 120 }}
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
      title: "Status",
      children: [
        getStatusColumn("Stool", type),
        getStatusColumn("Urine", type),
        getStatusColumn("Blood", type),
      ],
    },
    {
      title: "Actions",
      key: "actions",
      width: "20%",
      render: (record: IPatient) => (
        <div className="flex flex-col gap-2 items-start">
          {(["Stool", "Urine", "Blood"] as const).map((labName) => {
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

  useEffect(() => {
    fetchTableData("adult");
  }, [
    tableParams.adult.page,
    tableParams.adult.pageSize,
    tableParams.adult.search,
  ]);

  useEffect(() => {
    fetchTableData("child");
  }, [
    tableParams.child.page,
    tableParams.child.pageSize,
    tableParams.child.search,
  ]);

  return (
    <div className="p-6 space-y-6">
      <Card
        title="Adult Patients Lab Tests"
        className="overflow-x-auto"
        extra={
          <Search
            placeholder="Search by name or code..."
            allowClear
            onSearch={(value) => handleSearch("adult", value)}
            className="block self-end"
            style={{ width: 250 }}
          />
        }
      >
        <Table
          columns={getColumns("adult")}
          rowKey="_id"
          dataSource={data.adult}
          pagination={pagination.adult}
          loading={loading.adult}
          onChange={(pagination) => handleTableChange("adult", pagination)}
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
            onSearch={(value) => handleSearch("child", value)}
            style={{ width: 250 }}
          />
        }
      >
        <Table
          columns={getColumns("child")}
          rowKey="_id"
          dataSource={data.child}
          pagination={pagination.child}
          loading={loading.child}
          onChange={(pagination) => handleTableChange("child", pagination)}
          bordered
        />
      </Card>
    </div>
  );
};

export default LabsPage;