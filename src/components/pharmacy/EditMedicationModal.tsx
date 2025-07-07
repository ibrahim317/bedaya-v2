"use client";

import { useState, useEffect } from "react";
import { Modal, Form, Select, InputNumber, Button, Space } from "antd";
import { PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";
import { dispensedMedicationsClient } from "@/clients/dispensedMedicationsClient";
import { IPopulatedDispensedMedication } from "@/types/DispensedMedication";
import { searchPatients } from "@/clients/patientClient";
import { drugsClient } from "@/clients/drugsClient";
import { IPatient } from "@/types/Patient";
import { IDrugWithId } from "@/types/Drug";

const { Option } = Select;

interface EditMedicationModalProps {
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
  record: IPopulatedDispensedMedication | null;
  messageApi: any;
}

export default function EditMedicationModal({ 
  visible, 
  onCancel, 
  onSuccess, 
  record, 
  messageApi 
}: EditMedicationModalProps) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [patients, setPatients] = useState<IPatient[]>([]);
  const [drugs, setDrugs] = useState<IDrugWithId[]>([]);

  // Load patients and drugs
  useEffect(() => {
    async function fetchData() {
      try {
        const [patientData, drugData] = await Promise.all([
          searchPatients(''),
          drugsClient.getDrugs(1, 10000, '')
        ]);
        setPatients(patientData);
        setDrugs(drugData.drugs);
      } catch (error) {
        console.error('Failed to load patients and drugs:', error);
      }
    }
    fetchData();
  }, []);

  // Set initial form values when record changes
  useEffect(() => {
    if (record && drugs.length > 0) {
      const initialValues = {
        patientId: record.patientId._id,
        medications: record.medications.map(med => {
          const drugInState = drugs.find(d => d.barcode === med.drug.barcode);
          return {
            drug: drugInState?._id,
            quantity: med.quantity,
            unit: med.quantityType
          };
        })
      };
      
      form.setFieldsValue(initialValues);
    }
  }, [record, drugs, form]);

  const handleSubmit = async () => {
    if (!record?._id) return;
    
    try {
      setLoading(true);
      const values = await form.validateFields();
      
      const processedMedications = values.medications.map((med: any) => {
        const selectedDrug = drugs.find(d => d._id === med.drug);
        if (!selectedDrug) {
          throw new Error('Selected drug not found');
        }
        
        let remainingInPills = med.quantity;
        if (med.unit === 'boxes') {
          remainingInPills = med.quantity * (selectedDrug.stripsPerBox || 1) * (selectedDrug.pillsPerStrip || 1);
        } else if (med.unit === 'strips') {
          remainingInPills = med.quantity * (selectedDrug.pillsPerStrip || 1);
        }

        return {
          drug: {
            name: selectedDrug.name,
            barcode: selectedDrug.barcode,
            expiryDate: selectedDrug.expiryDate,
          },
          quantity: med.quantity,
          quantityType: med.unit,
          remaining: remainingInPills,
        };
      });

      const submissionData = {
        patientId: values.patientId,
        medications: processedMedications,
      };
      
      await dispensedMedicationsClient.update(String(record._id), submissionData);
      messageApi?.success('Medication record updated successfully');
      onSuccess();
    } catch (error) {
      messageApi?.error(error instanceof Error ? error.message : 'Failed to update medication record');
    } finally {
      setLoading(false);
    }
  };

  const handleDrugChange = (fieldKey: number) => {
    const medications = form.getFieldValue('medications');
    if (medications[fieldKey]) {
      medications[fieldKey].unit = 'pills';
      form.setFieldsValue({ medications });
    }
  };

  return (
    <Modal
      title="Edit Dispensed Medication"
      open={visible}
      onOk={handleSubmit}
      onCancel={onCancel}
      confirmLoading={loading}
      width={700}
    >
      <Form form={form} layout="vertical">
        <Form.Item name="patientId" label="Patient" rules={[{ required: true, message: 'Please select a patient' }]}>
          <Select
            style={{ width: '100%' }}
            loading={!patients.length}
            placeholder="Select a patient"
          >
            {patients.map(patient => (
              <Option key={patient._id as string} value={patient._id as string}>
                {patient.code} - {patient.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.List name="medications">
          {(fields, { add, remove }) => (
            <>
              {fields.map((field, index) => (
                <div key={field.key} style={{ marginBottom: '10px' }}>
                  <Space>
                    <Form.Item
                      {...field}
                      name={[field.name, 'drug']}
                      rules={[{ required: true, message: 'Please select a drug' }]}
                    >
                      <Select
                        style={{ width: '150px' }}
                        loading={!drugs.length}
                        placeholder="Select a drug"
                        onChange={() => handleDrugChange(field.name)}
                      >
                        {drugs.map(drug => (
                          <Option key={drug._id as string} value={drug._id as string}>
                            {drug.barcode} - {drug.name}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>

                    <Form.Item
                      {...field}
                      name={[field.name, 'quantity']}
                      rules={[{ required: true, message: 'Please enter quantity' }]}
                    >
                      <InputNumber
                        style={{ width: '100px' }}
                        min={0}
                        placeholder="Quantity"
                      />
                    </Form.Item>

                    <Form.Item
                      {...field}
                      name={[field.name, 'unit']}
                      rules={[{ required: true, message: 'Please select unit' }]}
                    >
                      <Select
                        style={{ width: '100px' }}
                        placeholder="Unit"
                      >
                        <Option value="pills">Pills</Option>
                        <Option value="strips">Strips</Option>
                        <Option value="boxes">Boxes</Option>
                      </Select>
                    </Form.Item>

                    <MinusCircleOutlined onClick={() => remove(field.name)} />
                  </Space>
                </div>
              ))}
              <Form.Item>
                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                  Add medication
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
      </Form>
    </Modal>
  );
} 