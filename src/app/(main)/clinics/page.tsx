"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, Row, Col } from 'antd';
import { clinicsClient, IClinicSummary } from '@/clients/clinicsClient';

export default function ClinicsPage() {
  const [clinics, setClinics] = useState<IClinicSummary[]>([]);

  useEffect(() => {
    const fetchClinics = async () => {
      const clinics = await clinicsClient.getAllClinics();
      setClinics(clinics);
    };
    fetchClinics();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Clinics</h1>
      <Row gutter={[16, 16]}>
        {clinics.map((clinic) => (
          <Col key={clinic._id} xs={24} sm={12} md={8} lg={6}>
            <Link href={`/clinics/${clinic._id}`}>
              <Card 
                hoverable 
                className="h-full"
                title={clinic.name}
              >
                <div className="space-y-2">
                  <p>Common Diagnoses: {clinic.commonDiagnoses}</p>
                  <p>Common Treatments: {clinic.commonTreatments}</p>
                </div>
              </Card>
            </Link>
          </Col>
        ))}
      </Row>
    </div>
  );
}