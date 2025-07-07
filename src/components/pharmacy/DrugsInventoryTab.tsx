"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Space, Input, Modal } from "antd";
import { EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { drugsClient, FormattedDrug } from "@/clients/drugsClient";
import { useDebounce } from "use-debounce";
import OfflineTable from "@/components/OfflineTable";
import { cacheService } from "@/services/cacheService";
import { STORE_NAMES } from "@/types/IndexedDB";
import { IDrugWithId } from "@/types/Drug";

const { Search } = Input;
const { confirm } = Modal;

interface DrugsInventoryTabProps {
  messageApi: any;
}

export default function DrugsInventoryTab({ messageApi }: DrugsInventoryTabProps) {
  const router = useRouter();
  const [searchText, setSearchText] = useState("");
  const [debouncedSearch] = useDebounce(searchText, 500);

  const showDeleteConfirm = (drugId: string, drugName: string) => {
    confirm({
      title: `Are you sure you want to delete ${drugName}?`,
      icon: <ExclamationCircleOutlined />,
      content: `This action will be queued if you are offline.`,
      okText: "Yes, Delete",
      okType: "danger",
      cancelText: "No",
      onOk: async () => {
        try {
          await drugsClient.deleteDrug(drugId);
          messageApi?.success(`Successfully queued deletion for ${drugName}. It will be deleted upon syncing.`);
        } catch (error) {
          messageApi?.error("Failed to queue drug deletion.");
        }
      },
    });
  };

  const drugColumns: ColumnsType<FormattedDrug> = [
    { title: "BarCode", dataIndex: "barcode", key: "barcode", width: 120 },
    { title: "Name", dataIndex: "name", key: "name", width: 120 },
    { title: "Total Pills", dataIndex: "quantityByPills", key: "quantityByPills", width: 100, align: "right" },
    { title: "Strips", key: "completeStrips", width: 100, align: "right", render: (r) => Math.floor(r.quantityByPills / r.pillsPerStrip) || 0 },
    { title: "Boxes", key: "completeBoxes", width: 100, align: "right", render: (r) => Math.floor(r.quantityByPills / r.pillsPerStrip / r.stripsPerBox) || 0 },
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

  const renderDrugsTable = () => {
    const fetchData = async () => {
      const result = await drugsClient.getDrugs(1, 1000, debouncedSearch);
      return result.drugs;
    };

    const getCachedData = async () => {
      const result = await cacheService.query<IDrugWithId>({ store: STORE_NAMES.DRUGS });
      if (debouncedSearch) {
        return result.items.filter(drug => 
          drug.name.toLowerCase().includes(debouncedSearch.toLowerCase()) || 
          drug.barcode?.includes(debouncedSearch)
        );
      }
      return result.items;
    };

    return (
      <OfflineTable
        fetchData={fetchData}
        getCachedData={getCachedData}
        cacheKey={`drugs-table-${debouncedSearch}`}
        columns={drugColumns}
        rowKey="_id"
      />
    );
  };

  return (
    <>
      <Search
        placeholder="Search drugs by name or barcode..."
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        style={{ marginBottom: 16, width: 300 }}
        enterButton
      />
      {renderDrugsTable()}
    </>
  );
} 