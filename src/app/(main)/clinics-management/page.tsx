'use client';

import { useState } from 'react';
import { Button, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import ClinicCard from './components/ClinicCard';
import AddEditClinicModal from './components/AddEditClinicModal';
import { clinicsClient, IClinicSummary } from '@/clients/clinicsClient';
import OfflineDataWrapper from '@/components/OfflineDataWrapper';
import { cacheService } from '@/services/cacheService';
import { STORE_NAMES } from '@/types/IndexedDB';

export default function ClinicsManagementPage() {
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [selectedClinic, setSelectedClinic] = useState<IClinicSummary | null>(null);

  // The state for clinics and loading is now managed by OfflineDataWrapper

  const handleAddClinic = () => {
    setSelectedClinic(null);
    setAddModalOpen(true);
  };

  const handleEditClinic = (clinic: IClinicSummary) => {
    setSelectedClinic(clinic);
    setAddModalOpen(true);
  };

  const handleModalClose = () => {
    setAddModalOpen(false);
    setSelectedClinic(null);
    // Here, we should ideally trigger a refresh of the OfflineDataWrapper data.
    // For now, a page reload might be the simplest way, though not ideal.
    window.location.reload();
  };

  const fetchData = async () => {
    return await clinicsClient.getAllClinics();
  };

  const getCachedData = async () => {
    const result = await cacheService.query<IClinicSummary>({ store: STORE_NAMES.CLINICS_SUMMARY });
    return result.items;
  };


  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Clinics Management</h1>
        <Button 
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAddClinic}
        >
          Add Clinic
        </Button>
      </div>

      <OfflineDataWrapper
        fetchData={fetchData}
        getCachedData={getCachedData}
        cacheKey="clinics-list"
      >
        {(clinics, loading) => (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {clinics.map((clinic) => (
                    <ClinicCard
                        key={clinic._id}
                        clinic={clinic}
                        onEdit={() => handleEditClinic(clinic)}
                    />
                ))}
            </div>
        )}
      </OfflineDataWrapper>

      <AddEditClinicModal
        open={addModalOpen}
        clinic={selectedClinic}
        onClose={handleModalClose}
      />
    </div>
  );
}