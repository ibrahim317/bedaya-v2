"use client";
import React from 'react';
import { Card } from 'antd';
import { clinicsClient } from '@/clients/clinicsClient';

interface ClinicPageProps {
  params: {
    'clinic-id': string;
  };
}

async function ClinicPage({ params }: ClinicPageProps) {
  const clinic = await clinicsClient.getClinicById(params['clinic-id']);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">{clinic.name}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Common Diagnoses" className="h-full">
          <p className="text-lg">{clinic.commonDiagnoses.length} diagnoses</p>
        </Card>
        <Card title="Common Treatments" className="h-full">
          <p className="text-lg">{clinic.commonTreatments.length} treatments</p>
        </Card>
      </div>
    </div>
  );
}

export default ClinicPage;