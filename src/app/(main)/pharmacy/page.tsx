"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Table,
  Button,
  Modal,
  message,
  Space,
  Input,
  Typography,
  Col,
  Row,
  Card,
  Tabs,
  Spin,
  Alert,
} from "antd";
import { Line } from '@ant-design/charts';
import type { ColumnsType } from "antd/es/table";
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { drugsClient, FormattedDrug, PaginatedDrugs } from "@/clients/drugsClient";
import { dispensedMedicationsClient } from "@/clients/dispensedMedicationsClient";
import { IPopulatedDispensedMedication } from "@/types/DispensedMedication";
import { useDebounce } from "use-debounce";

const { Title } = Typography;
const { Search } = Input;
const { TabPane } = Tabs;
const { confirm } = Modal;

export default function PharmacyPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("drugs");

  // Drugs state
  const [drugs, setDrugs] = useState<FormattedDrug[]>([]);
  const [drugsLoading, setDrugsLoading] = useState(true);
  const [drugsSearchText, setDrugsSearchText] = useState("");
  const [debouncedDrugsSearch] = useDebounce(drugsSearchText, 500);
  const [drugsPagination, setDrugsPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  // Treatments state
  const [treatments, setTreatments] = useState<IPopulatedDispensedMedication[]>([]);
  const [treatmentsLoading, setTreatmentsLoading] = useState(true);
  const [treatmentsSearchText, setTreatmentsSearchText] = useState("");
  const [debouncedTreatmentsSearch] = useDebounce(treatmentsSearchText, 500);
  const [treatmentsPagination, setTreatmentsPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  // Dashboard state
  const [dailyStats, setDailyStats] = useState<{ date: string; count: number }[]>([]);
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState<string | null>(null);

  const messageApiRef = useRef(message.useMessage()[0]);

  const fetchDrugs = async (page = 1, pageSize = 10, search = "") => {
    try {
      setDrugsLoading(true);
      const data: PaginatedDrugs = await drugsClient.getDrugs(page, pageSize, search);
      setDrugs(data.drugs);
      setDrugsPagination(prev => ({ ...prev, total: data.total, current: page, pageSize }));
    } catch (error) {
      messageApiRef.current?.error("Failed to fetch drugs");
    } finally {
      setDrugsLoading(false);
    }
  };

  const fetchTreatments = async (page = 1, pageSize = 10, search = "") => {
    try {
      setTreatmentsLoading(true);
      const data = await dispensedMedicationsClient.getAll(page, pageSize, search);
      setTreatments(data.medications);
      setTreatmentsPagination(prev => ({ ...prev, total: data.total, current: page, pageSize }));
    } catch (error) {
      messageApiRef.current?.error("Failed to fetch patient treatments");
    } finally {
      setTreatmentsLoading(false);
    }
  };

  const fetchDailyStats = async () => {
    try {
      setStatsLoading(true);
      const data = await dispensedMedicationsClient.getDailyDispensedStats();
      setDailyStats(data);
      setStatsError(null);
    } catch (error) {
      setStatsError("Failed to fetch daily stats");
    } finally {
      setStatsLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'drugs') {
      fetchDrugs(drugsPagination.current, drugsPagination.pageSize, debouncedDrugsSearch);
    }
  }, [debouncedDrugsSearch, drugsPagination.current, drugsPagination.pageSize, activeTab]);

  useEffect(() => {
    if (activeTab === 'treatments') {
      fetchTreatments(treatmentsPagination.current, treatmentsPagination.pageSize, debouncedTreatmentsSearch);
    }
  }, [treatmentsPagination.current, treatmentsPagination.pageSize, activeTab, debouncedTreatmentsSearch]);

  useEffect(() => {
    if (activeTab === 'dashboard') {
      fetchDailyStats();
    }
  }, [activeTab]);


  const handleDrugsTableChange = (pagination: any) => {
    fetchDrugs(pagination.current, pagination.pageSize, drugsSearchText);
  };
  
  const handleTreatmentsTableChange = (pagination: any) => {
    fetchTreatments(pagination.current, pagination.pageSize, treatmentsSearchText);
  };

  const showDeleteConfirm = (drugId: string, drugName: string) => {
    confirm({
      title: "Are you sure you want to delete this drug?",
      icon: <ExclamationCircleOutlined />,
      content: `This will permanently delete the drug: ${drugName}`,
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: async () => {
        try {
          await drugsClient.deleteDrug(drugId);
          fetchDrugs(drugsPagination.current, drugsPagination.pageSize, drugsSearchText);
          messageApiRef.current?.success("Drug deleted successfully");
        } catch (error) {
          messageApiRef.current?.error("Failed to delete drug");
        }
      },
    });
  };

  const drugColumns: ColumnsType<FormattedDrug> = [
    { title: "BarCode", dataIndex: "barcode", key: "barcode", width: 120 },
    { title: "Name", dataIndex: "name", key: "name", width: 120 },
    { title: "Total Pills", dataIndex: "quantityByPills", key: "quantityByPills", width: 100, align: "right" },
    { title: "Complete Strips", key: "completeStrips", width: 100, align: "right", render: (r) => Math.floor(r.quantityByPills / r.pillsPerStrip) || 0 },
    { title: "Complete Boxes", key: "completeBoxes", width: 100, align: "right", render: (r) => Math.floor(r.quantityByPills / r.pillsPerStrip / r.stripsPerBox) || 0 },
    { title: "Strips Per Box", dataIndex: "stripsPerBox", key: "stripsPerBox", width: 100, align: "right" },
    { title: "Pills Per Strip", dataIndex: "pillsPerStrip", key: "pillsPerStrip", width: 100, align: "right" },
    { title: "Expiry Date", dataIndex: "expiryDate", key: "expiryDate", render: (date) => date ? new Date(date).toLocaleDateString("en-GB") : "N/A", width: 180 },
    {
      title: "Actions",
      key: "actions",
      width: 100,
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => router.push(`/pharmacy/drug/update/${record._id}`)} size="small" />
          <Button danger icon={<DeleteOutlined />} onClick={() => showDeleteConfirm(record._id!, record.name)} size="small" />
        </Space>
      ),
    },
  ];

  const treatmentColumns: ColumnsType<IPopulatedDispensedMedication> = [
    { title: 'Patient Code', dataIndex: ['patientId', 'code'], key: 'patientCode' },
    { title: 'Patient Name', dataIndex: ['patientId', 'name'], key: 'patientName' },
    { title: 'Date Dispensed', dataIndex: 'createdAt', key: 'createdAt', render: (text) => new Date(text).toLocaleDateString('en-GB') },
    { title: 'Number of Medications', dataIndex: 'medications', key: 'medicationCount', render: (meds) => meds.length },
    {
        title: "Actions",
        key: "actions",
        render: (_, record) => (
          <Space size="middle">
            <Button onClick={() => router.push(`/pharmacy/dispense?patientId=${record.patientId._id}`)} size="small">
              View/Edit
            </Button>
          </Space>
        ),
      },
  ];

  const expandedTreatmentRender = (record: IPopulatedDispensedMedication) => {
    const columns = [
      { title: 'Drug Name', dataIndex: ['drug', 'name'], key: 'drugName' },
      { title: 'Quantity', dataIndex: 'quantity', key: 'quantity' },
      { title: 'Unit', dataIndex: 'quantityType', key: 'quantityType' },
      { title: 'Total Pills', dataIndex: 'remaining', key: 'remaining' },
    ];
    return <Table columns={columns} dataSource={record.medications} pagination={false} rowKey={(med) => med.drug.barcode} />;
  };
  
  const lineConfig = {
    data: dailyStats,
    xField: 'date',
    yField: 'count',
    point: {
      shape: 'diamond',
      size: 4,
    },
    label: {
      style: {
        fill: '#aaa',
      },
    },
    yAxis: {
      min: 0,
    },
    xAxis: {
      label: {
        autoHide: true,
        autoRotate: false,
      },
    },
    meta: {
      count: {
        alias: 'Dispensed Count',
      },
      date: {
        alias: 'Date',
      },
    },
  };


  return (
    <div className="p-6">
      <Card>
        <Row justify="space-between" align="middle" className="mb-6">
          <Col xs={24} md={12}>
            <Title level={2} className="!mb-0">
              Pharmacy
            </Title>
          </Col>
        </Row>

        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab="Dashboard" key="dashboard">
            <Title level={3} className="mb-4">Dispensed Medications per Day</Title>
            {statsLoading ? (
              <div className="flex items-center justify-center h-64">
                <Spin size="large" />
              </div>
            ) : statsError ? (
              <Alert message="Error" description={statsError} type="error" showIcon />
            ) : (
              <Line {...lineConfig} />
            )}
          </TabPane>
          <TabPane tab="Drugs" key="drugs">
            <Row justify="space-between" align="middle" className="mb-4">
              <Col>
                <Search
                  placeholder="Search drugs by name or barcode..."
                  allowClear
                  onChange={(e) => setDrugsSearchText(e.target.value)}
                  style={{ width: 300 }}
                />
              </Col>
              <Col>
                <Space>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => router.push("/pharmacy/dispense")}
                    >
                        Dispense Treatment
                    </Button>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => router.push("/pharmacy/drug/create")}
                    >
                        Add Drug
                    </Button>
                </Space>
              </Col>
            </Row>
            <Table
              columns={drugColumns}
              dataSource={drugs}
              rowKey="_id"
              loading={drugsLoading}
              pagination={drugsPagination}
              onChange={handleDrugsTableChange}
              scroll={{ x: 1200 }}
              size="middle"
              bordered
            />
          </TabPane>
          <TabPane tab="Patient Treatments" key="treatments">
            <Row justify="space-between" align="middle" className="mb-4">
                <Col>
                    <Search
                        placeholder="Search by patient name or code..."
                        allowClear
                        onChange={(e) => setTreatmentsSearchText(e.target.value)}
                        style={{ width: 300 }}
                    />
                </Col>
            </Row>
            <Table
              columns={treatmentColumns}
              dataSource={treatments}
              rowKey="_id"
              loading={treatmentsLoading}
              pagination={treatmentsPagination}
              onChange={handleTreatmentsTableChange}
              expandable={{ expandedRowRender: expandedTreatmentRender }}
              size="middle"
              bordered
            />
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
}
