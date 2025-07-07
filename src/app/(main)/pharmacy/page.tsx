"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button, message, Card, Tabs } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { IPopulatedDispensedMedication } from "@/types/DispensedMedication";
import DrugsInventoryTab from "@/components/pharmacy/DrugsInventoryTab";
import DispensedMedicationsTab from "@/components/pharmacy/DispensedMedicationsTab";
import PharmacyDashboard from "@/components/pharmacy/PharmacyDashboard";
import EditMedicationModal from "@/components/pharmacy/EditMedicationModal";

const { TabPane } = Tabs;

export default function PharmacyPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("drugs");
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [currentEditRecord, setCurrentEditRecord] = useState<IPopulatedDispensedMedication | null>(null);
  const messageApiRef = useRef(message.useMessage()[0]);

  const handleEdit = (record: IPopulatedDispensedMedication) => {
    setCurrentEditRecord(record);
    setIsEditModalVisible(true);
  };

  const handleEditSuccess = () => {
    setIsEditModalVisible(false);
    setCurrentEditRecord(null);
    // Force refresh of the dispensed medications tab
    window.location.reload();
  };

  const handleEditCancel = () => {
    setIsEditModalVisible(false);
    setCurrentEditRecord(null);
  };

  const getAddButtonText = () => {
    switch (activeTab) {
      case 'drugs':
        return 'Add New Drug';
      case 'treatments':
        return 'Dispense Medication';
      default:
        return 'Add';
    }
  };

  const handleAddButtonClick = () => {
    if (activeTab === 'drugs') {
      router.push('/pharmacy/drug/create');
    } else if (activeTab === 'treatments') {
      router.push('/pharmacy/dispense');
    }
  };

  return (
    <div className="md:p-6">
      <Card
        title="Pharmacy Management"
        extra={
          activeTab !== 'dashboard' && (
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAddButtonClick}
            >
              {getAddButtonText()}
            </Button>
          )
        }
      >
        <Tabs activeKey={activeTab} onChange={(key) => setActiveTab(key as string)}>
          <TabPane tab="Drugs Inventory" key="drugs">
            <DrugsInventoryTab messageApi={messageApiRef.current} />
          </TabPane>
          <TabPane tab="Dispensed Medications" key="treatments">
            <DispensedMedicationsTab 
              messageApi={messageApiRef.current} 
              onEdit={handleEdit}
            />
          </TabPane>
          <TabPane tab="Dashboard" key="dashboard">
            <PharmacyDashboard messageApi={messageApiRef.current} />
          </TabPane>
        </Tabs>
      </Card>

      <EditMedicationModal
        visible={isEditModalVisible}
        onCancel={handleEditCancel}
        onSuccess={handleEditSuccess}
        record={currentEditRecord}
        messageApi={messageApiRef.current}
      />
    </div>
  );
}
