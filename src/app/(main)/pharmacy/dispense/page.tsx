'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Form, Button, Select, InputNumber, Space, Card, Row, Col, Typography, message, Table } from 'antd';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { useSession } from 'next-auth/react';
import { searchPatients } from '@/clients/patientClient';
import { drugsClient } from '@/clients/drugsClient';
import { dispensedMedicationsClient } from '@/clients/dispensedMedicationsClient';
import { IPatient } from '@/types/Patient';
import { IDrug } from '@/types/Drug';
import { IPopulatedDispensedMedication } from '@/types/DispensedMedication';
import type { ColumnsType } from 'antd/es/table';

const { Title } = Typography;
const { Option } = Select;

export default function DispenseTreatmentPage() {
  const [form] = Form.useForm();
  const router = useRouter();
  const { data: session } = useSession();
  const [patients, setPatients] = useState<IPatient[]>([]);
  const [drugs, setDrugs] = useState<IDrug[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [dispensedMedications, setDispensedMedications] = useState<IPopulatedDispensedMedication[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [patientData, drugData] = await Promise.all([
          searchPatients(''),
          drugsClient.getAllDrugs()
        ]);
        setPatients(patientData.data);
        setDrugs(drugData as IDrug[]);
      } catch (error) {
        message.error('Failed to load data');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const onFinish = async (values: any) => {
    try {
      const processedMedications = values.medications.map((med: any) => {
        if (med.unit === 'box') {
          const selectedDrug = drugs.find(d => d._id === med.drug);
          return {
            ...med,
            quantity: med.quantity * (selectedDrug?.stripsPerBox || 1),
          };
        }
        return med;
      });

      const submissionData = {
        ...values,
        medications: processedMedications.map(({ unit, ...rest }: { unit?: string }) => rest), // remove unit before submission
      };
      
      await dispensedMedicationsClient.create(submissionData);
      message.success('Treatment dispensed successfully!');
      router.push('/pharmacy');
    } catch (error) {
      message.error('Failed to dispense treatment');
    }
  };

  const handlePatientChange = async (patientId: string) => {
    setSelectedPatientId(patientId);
    if (patientId) {
      try {
        setHistoryLoading(true);
        const data = await dispensedMedicationsClient.getByPatientId(patientId);
        setDispensedMedications(data);
      } catch (error) {
        message.error("Failed to fetch patient's medication history");
      } finally {
        setHistoryLoading(false);
      }
    } else {
      setDispensedMedications([]);
    }
  };

  const handleDrugChange = (value: string, fieldKey: number) => {
    const selectedDrug = drugs.find(d => d._id === value);
    const medications = form.getFieldValue('medications');
    if (selectedDrug && medications[fieldKey]) {
      medications[fieldKey].unit = selectedDrug.stripsPerBox > 1 ? 'strip' : undefined;
      form.setFieldsValue({ medications });
    }
  };

  const medicationHistoryColumns: ColumnsType<IPopulatedDispensedMedication> = [
    {
      title: 'Date Dispensed',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text) => new Date(text).toLocaleDateString('en-GB'),
    },
    {
      title: 'Number of Medications',
      dataIndex: 'medications',
      key: 'medicationCount',
      render: (medications) => medications.length,
    },
  ];

  const expandedRowRender = (record: IPopulatedDispensedMedication) => {
    const columns: ColumnsType<{ drug: IDrug; quantity: number; }> = [
      { title: 'Drug Name', dataIndex: ['drug', 'name'], key: 'drugName' },
      { title: 'Quantity', dataIndex: 'quantity', key: 'quantity' },
    ];

    return <Table columns={columns} dataSource={record.medications} pagination={false} rowKey={(med) => med.drug._id} />;
  };

  return (
    <div className="p-6">
      <Card>
        <Title level={2} className="mb-6">Dispense Patient Treatment</Title>
        <Form
          form={form}
          name="dispense_treatment"
          onFinish={onFinish}
          autoComplete="off"
          layout="vertical"
        >
          <Form.Item
            name="patientId"
            label="Patient"
            rules={[{ required: true, message: 'Please select a patient!' }]}
          >
            <Select
              showSearch
              placeholder="Select a patient"
              optionFilterProp="children"
              loading={loading}
              onChange={handlePatientChange}
              filterOption={(input, option) =>
                (option?.label ? String(option.label).toLowerCase().includes(input.toLowerCase()) : false)
              }
            >
              {patients.map(p => (
                <Option key={p._id as string} value={p._id as string} label={`${p.code} - ${p.name}`}>
                  {p.code} - {p.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Title level={4} className="mt-8">Medications</Title>

          <Form.List name="medications">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                    <Form.Item
                      {...restField}
                      name={[name, 'drug']}
                      rules={[{ required: true, message: 'Missing drug' }]}
                      style={{ minWidth: '300px' }}
                    >
                      <Select
                        showSearch
                        placeholder="Select a drug by name or barcode"
                        optionFilterProp="children"
                        loading={loading}
                        filterOption={(input, option) =>
                          (option?.label ? String(option.label).toLowerCase().includes(input.toLowerCase()) : false)
                        }
                        onChange={(value) => handleDrugChange(value, key)}
                      >
                        {drugs.map(d => (
                          <Option key={d._id as string} value={d._id as string} label={`${d.name} (${d.barcode})`}>
                            {d.name} ({d.barcode})
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, 'quantity']}
                      rules={[{ required: true, message: 'Missing quantity' }]}
                    >
                      <InputNumber min={1} placeholder="Quantity" />
                    </Form.Item>

                    <Form.Item
                      noStyle
                      shouldUpdate={(prevValues, currentValues) =>
                        prevValues.medications[name]?.drug !== currentValues.medications[name]?.drug ||
                        prevValues.medications[name]?.unit !== currentValues.medications[name]?.unit
                      }
                    >
                      {({ getFieldValue }) => {
                        const drugId = getFieldValue(['medications', name, 'drug']);
                        const selectedDrug = drugs.find(d => d._id === drugId);
                        return selectedDrug && selectedDrug.stripsPerBox > 1 ? (
                          <Form.Item
                            {...restField}
                            name={[name, 'unit']}
                            initialValue="strip"
                            noStyle
                          >
                            <Select style={{ width: 80 }}>
                              <Option value="strip">Strip</Option>
                              <Option value="box">Box</Option>
                            </Select>
                          </Form.Item>
                        ) : null;
                      }}
                    </Form.Item>

                    <Form.Item
                      noStyle
                      shouldUpdate={(prevValues, currentValues) =>
                        prevValues.medications[name]?.unit !== currentValues.medications[name]?.unit ||
                        prevValues.medications[name]?.quantity !== currentValues.medications[name]?.quantity
                      }
                    >
                      {({ getFieldValue }) => {
                        const unit = getFieldValue(['medications', name, 'unit']);
                        if (unit === 'box') {
                          const quantity = getFieldValue(['medications', name, 'quantity']) || 0;
                          const drugId = getFieldValue(['medications', name, 'drug']);
                          const selectedDrug = drugs.find(d => d._id === drugId);
                          const totalStrips = quantity * (selectedDrug?.stripsPerBox || 1);
                          return (
                            <Form.Item label="Total Strips">
                              <InputNumber value={totalStrips} readOnly />
                            </Form.Item>
                          );
                        }
                        return null;
                      }}
                    </Form.Item>
                    
                    <MinusCircleOutlined onClick={() => remove(name)} />
                  </Space>
                ))}
                <Form.Item>
                  <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                    Add Drug
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>

          <Form.Item className="mt-8">
            <Space>
              <Button type="primary" htmlType="submit">
                Dispense Treatment
              </Button>
              <Button htmlType="button" onClick={() => router.push('/pharmacy')}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
      
      {selectedPatientId && (
        <Card className="mt-6">
          <Title level={3} className="mb-4">Patient Medication History</Title>
          <Table
            columns={medicationHistoryColumns}
            dataSource={dispensedMedications}
            rowKey="_id"
            loading={historyLoading}
            expandable={{ expandedRowRender }}
            pagination={{ pageSize: 5 }}
          />
        </Card>
      )}
    </div>
  );
} 