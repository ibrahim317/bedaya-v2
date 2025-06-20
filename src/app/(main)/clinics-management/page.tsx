'use client';

import { useEffect, useState } from 'react';
import { Button, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import ClinicCard from './components/ClinicCard';
import AddEditClinicModal from './components/AddEditClinicModal';
import { clinicsClient, IClinicSummary } from '@/clients/clinicsClient';

export default function ClinicsManagementPage() {
  const [clinics, setClinics] = useState<IClinicSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [selectedClinic, setSelectedClinic] = useState<IClinicSummary | null>(null);

  const fetchClinics = async () => {
    try {
      setLoading(true);
      const data = await clinicsClient.getAllClinics();
      setClinics(data);
    } catch (error) {
      message.error('Failed to load clinics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClinics();
  }, []);

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
    fetchClinics();
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clinics.map((clinic) => (
          <ClinicCard
            key={clinic._id}
            clinic={clinic}
            onEdit={() => handleEditClinic(clinic)}
          />
        ))}
      </div>

      <AddEditClinicModal
        open={addModalOpen}
        clinic={selectedClinic}
        onClose={handleModalClose}
      />
    </div>
  );
}