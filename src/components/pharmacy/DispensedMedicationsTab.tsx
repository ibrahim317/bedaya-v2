"use client";

import { useState, useEffect } from "react";
import { Table, Button, Modal, Space, Input, Badge, Tag } from "antd";
import { EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { dispensedMedicationsClient } from "@/clients/dispensedMedicationsClient";
import { IPopulatedDispensedMedication } from "@/types/DispensedMedication";
import { useDebounce } from "use-debounce";

const { Search } = Input;
const { confirm } = Modal;

interface DispensedMedicationsTabProps {
  messageApi: any;
  onEdit: (record: IPopulatedDispensedMedication) => void;
}

export default function DispensedMedicationsTab({ messageApi, onEdit }: DispensedMedicationsTabProps) {
  const [treatments, setTreatments] = useState<IPopulatedDispensedMedication[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [searchText, setSearchText] = useState("");
  const [debouncedSearch] = useDebounce(searchText, 500);

  const fetchTreatments = async (page = 1, pageSize = 10) => {
    setLoading(true);
    try {
      const result = await dispensedMedicationsClient.getAll(page, pageSize, debouncedSearch);
      setTreatments(result.medications);
      setPagination({
        current: page,
        pageSize: pageSize,
        total: result.total,
      });
    } catch (error) {
      messageApi?.error("Failed to fetch dispensed medications");
      console.error("Error fetching treatments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTreatments(1, pagination.pageSize);
  }, [debouncedSearch]);

  const showDeleteConfirm = (treatmentId: string, patientName: string) => {
    confirm({
      title: `Are you sure you want to delete this dispensed medication record?`,
      icon: <ExclamationCircleOutlined />,
      content: `This will delete the dispensed medication record for ${patientName}. The drug quantities will be restored to inventory.`,
      okText: "Yes, Delete",
      okType: "danger",
      cancelText: "No",
      onOk: async () => {
        try {
          await dispensedMedicationsClient.delete(treatmentId);
          messageApi?.success(`Successfully deleted dispensed medication record.`);
          fetchTreatments(pagination.current, pagination.pageSize);
        } catch (error) {
          messageApi?.error("Failed to delete dispensed medication.");
        }
      },
    });
  };

  const treatmentColumns: ColumnsType<IPopulatedDispensedMedication> = [
    {
      title: "Patient Code",
      dataIndex: ["patientId", "code"],
      key: "patientCode",
      width: 120,
    },
    {
      title: "Patient Name",
      dataIndex: ["patientId", "name"],
      key: "patientName",
      width: 150,
    },
    {
      title: "Medications Count",
      key: "medicationsCount",
      width: 120,
      align: "center",
      render: (_, record) => (
        <Badge count={record.medications.length} style={{ backgroundColor: '#52c41a' }} />
      ),
    },
    {
      title: "Total Quantity",
      key: "totalQuantity",
      width: 120,
      align: "right",
      render: (_, record) => {
        const total = record.medications.reduce((sum, med) => sum + med.remaining, 0);
        return <span>{total}</span>;
      },
    },
    {
      title: "Dispensed Date",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 120,
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Actions",
      key: "actions",
      width: 120,
      render: (_, record) => (
        <Space>
          <Button 
            icon={<EditOutlined />} 
            onClick={() => onEdit(record)} 
            size="small" 
          />
          <Button 
            danger 
            icon={<DeleteOutlined />} 
            onClick={() => showDeleteConfirm(record._id, record.patientId.name)} 
            size="small" 
          />
        </Space>
      ),
    },
  ];

  const expandedRowRender = (record: IPopulatedDispensedMedication) => {
    const medicationColumns: ColumnsType<any> = [
      {
        title: "Drug Name",
        dataIndex: ["drug", "name"],
        key: "drugName",
      },
      {
        title: "Barcode",
        dataIndex: ["drug", "barcode"],
        key: "barcode",
      },
      {
        title: "Quantity",
        dataIndex: "quantity",
        key: "quantity",
        align: "right",
      },
      {
        title: "Type",
        dataIndex: "quantityType",
        key: "quantityType",
        render: (type) => <Tag>{type}</Tag>,
      },
      {
        title: "Remaining",
        dataIndex: "remaining",
        key: "remaining",
        align: "right",
      },
      {
        title: "Expiry Date",
        dataIndex: ["drug", "expiryDate"],
        key: "expiryDate",
        render: (date) => new Date(date).toLocaleDateString(),
      },
    ];

    return (
      <Table
        columns={medicationColumns}
        dataSource={record.medications}
        pagination={false}
        size="small"
        rowKey={(item, index) => `${record._id}-${index}`}
      />
    );
  };

  return (
    <>
      <div style={{ marginBottom: 16 }}>
        <Search
          placeholder="Search by patient name or code..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 300 }}
          enterButton
        />
      </div>
      <Table
        columns={treatmentColumns}
        dataSource={treatments}
        loading={loading}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
          onChange: (page, pageSize) => {
            fetchTreatments(page, pageSize || 10);
          },
        }}
        expandable={{
          expandedRowRender: expandedRowRender,
          rowExpandable: (record) => record.medications.length > 0,
        }}
        rowKey="_id"
      />
    </>
  );
} 