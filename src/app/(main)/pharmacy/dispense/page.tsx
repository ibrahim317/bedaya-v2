"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Form,
  Button,
  Select,
  InputNumber,
  Space,
  Card,
  Row,
  Col,
  Typography,
  message,
  Table,
  Modal,
  Popconfirm,
} from "antd";
import {
  PlusOutlined,
  MinusCircleOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { useSession } from "next-auth/react";
import { searchPatients } from "@/clients/patientClient";
import { drugsClient } from "@/clients/drugsClient";
import { dispensedMedicationsClient } from "@/clients/dispensedMedicationsClient";
import { IPatient } from "@/types/Patient";
import { IDrugWithId } from "@/types/Drug";
import { IPopulatedDispensedMedication } from "@/types/DispensedMedication";
import type { ColumnsType } from "antd/es/table";

const { Title } = Typography;
const { Option } = Select;

export default function DispenseTreatmentPage() {
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const [patients, setPatients] = useState<IPatient[]>([]);
  const [drugs, setDrugs] = useState<IDrugWithId[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(
    null
  );
  const [dispensedMedications, setDispensedMedications] = useState<
    IPopulatedDispensedMedication[]
  >([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [currentEditRecord, setCurrentEditRecord] =
    useState<IPopulatedDispensedMedication | null>(null);
  const [editLoading, setEditLoading] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [patientData, drugData] = await Promise.all([
          searchPatients(""),
          drugsClient.getDrugs(1, 10000, ""),
        ]);
        setPatients(patientData.data);
        setDrugs(drugData.drugs);
      } catch (error) {
        message.error("Failed to load data");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    const patientIdFromUrl = searchParams.get("patientId");
    if (patientIdFromUrl && patients.length > 0) {
      form.setFieldsValue({ patientId: patientIdFromUrl });
      handlePatientChange(patientIdFromUrl);
    }
  }, [searchParams, patients, form]);

  const onFinish = async (values: any) => {
    try {
      const processedMedications = values.medications.map((med: any) => {
        const selectedDrug = drugs.find((d) => d._id === med.drug);
        if (!selectedDrug) {
          throw new Error("Selected drug not found");
        }

        return {
          drug: {
            name: selectedDrug.name,
            barcode: selectedDrug.barcode,
            expiryDate: selectedDrug.expiryDate,
          },
          quantity: med.quantity,
          quantityType: med.unit,
          remainingQuantity: med.remainingQuantity,
          remainingUnit: med.remainingUnit,
        };
      });

      const submissionData = {
        patientId: values.patientId,
        medications: processedMedications,
      };

      await dispensedMedicationsClient.create(submissionData);
      message.success("Treatment dispensed successfully!");
      router.push("/pharmacy/dispense");
    } catch (error) {
      message.error(
        error instanceof Error ? error.message : "Failed to dispense treatment"
      );
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

  const handleDrugChange = (
    formInstance: typeof form | typeof editForm,
    fieldKey: number
  ) => {
    const medications = formInstance.getFieldValue("medications");
    if (medications[fieldKey]) {
      medications[fieldKey].unit = "pills";
      formInstance.setFieldsValue({ medications });
    }
  };

  const refreshMedicationHistory = async () => {
    if (selectedPatientId) {
      try {
        setHistoryLoading(true);
        const data = await dispensedMedicationsClient.getByPatientId(
          selectedPatientId
        );
        setDispensedMedications(data);
      } catch (error) {
        message.error("Failed to refresh patient's medication history");
      } finally {
        setHistoryLoading(false);
      }
    }
  };

  const handleEdit = (record: IPopulatedDispensedMedication) => {
    setCurrentEditRecord(record);

    const initialValues = {
      patientId: record.patientId,
      medications: record.medications.map((med) => {
        const drugInState = drugs.find((d) => d.barcode === med.drug.barcode);
        return {
          drug: drugInState?._id,
          quantity: med.quantity,
          unit: med.quantityType,
        };
      }),
    };

    editForm.setFieldsValue(initialValues);
    setIsEditModalVisible(true);
  };

  const handleDelete = async (recordId: string) => {
    try {
      setHistoryLoading(true);
      await dispensedMedicationsClient.delete(String(recordId));
      message.success("Medication record deleted successfully");
      await refreshMedicationHistory();
    } catch (error) {
      message.error("Failed to delete medication record");
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleEditSubmit = async () => {
    if (!currentEditRecord?._id) return;

    try {
      setEditLoading(true);
      const values = await editForm.validateFields();

      const processedMedications = values.medications.map((med: any) => {
        const selectedDrug = drugs.find((d) => d._id === med.drug);
        if (!selectedDrug) {
          throw new Error("Selected drug not found");
        }

        return {
          drug: {
            name: selectedDrug.name,
            barcode: selectedDrug.barcode,
            expiryDate: selectedDrug.expiryDate,
          },
          quantity: med.quantity,
          quantityType: med.unit,
          remainingQuantity: med.remainingQuantity,
          remainingUnit: med.remainingUnit,
        };
      });

      const submissionData = {
        patientId: values.patientId,
        medications: processedMedications,
      };

      await dispensedMedicationsClient.update(
        String(currentEditRecord._id),
        submissionData
      );
      message.success("Medication record updated successfully");
      setIsEditModalVisible(false);
      await refreshMedicationHistory();
    } catch (error) {
      message.error(
        error instanceof Error
          ? error.message
          : "Failed to update medication record"
      );
    } finally {
      setEditLoading(false);
    }
  };

  const medicationHistoryColumns: ColumnsType<IPopulatedDispensedMedication> = [
    {
      title: "Date Dispensed",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text) => new Date(text).toLocaleDateString("en-GB"),
    },
    {
      title: "Number of Medications",
      dataIndex: "medications",
      key: "medicationCount",
      render: (medications) => medications.length,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            size="small"
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this record?"
            onConfirm={() => handleDelete(record._id as string)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger icon={<DeleteOutlined />} size="small">
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const expandedRowRender = (record: IPopulatedDispensedMedication) => {
    const columns: ColumnsType<(typeof record.medications)[0]> = [
      { title: "Drug Name", dataIndex: ["drug", "name"], key: "drugName" },
      { title: "Quantity", dataIndex: "quantity", key: "quantity" },
      { title: "Unit", dataIndex: "quantityType", key: "quantityType" },
      { title: "Total Pills", dataIndex: "remaining", key: "remaining" },
    ];

    return (
      <Table
        columns={columns}
        dataSource={record.medications}
        pagination={false}
        rowKey={(med) => med.drug.barcode}
      />
    );
  };

  const calculateTotalPills = (medication: any, allDrugs: IDrugWithId[]) => {
    if (
      !medication ||
      !medication.drug ||
      !medication.unit ||
      !medication.quantity
    ) {
      return 0;
    }
    const selectedDrug = allDrugs.find((d) => d._id === medication.drug);
    if (!selectedDrug) return 0;

    let totalPills = medication.quantity;
    if (medication.unit === "boxes") {
      totalPills =
        medication.quantity *
        (selectedDrug.stripsPerBox || 1) *
        (selectedDrug.pillsPerStrip || 1);
    } else if (medication.unit === "strips") {
      totalPills = medication.quantity * (selectedDrug.pillsPerStrip || 1);
    }
    return totalPills;
  };

  const renderMedicationFormList = (
    formInstance: typeof form | typeof editForm
  ) => (
    <Form.List name="medications">
      {(fields, { add, remove }) => (
        <>
          {fields.map(({ key, name, ...restField }) => (
            <Space
              key={key}
              style={{ display: "flex", marginBottom: 8 }}
              align="center"
            >
              <Form.Item
                {...restField}
                name={[name, "drug"]}
                rules={[{ required: true, message: "Missing drug" }]}
                style={{ minWidth: "300px" }}
                label="Drug"
              >
                <Select
                  showSearch
                  placeholder="Select a drug by name or barcode"
                  optionFilterProp="children"
                  loading={loading}
                  filterOption={(input, option) =>
                    option?.label
                      ? String(option.label)
                          .toLowerCase()
                          .includes(input.toLowerCase())
                      : false
                  }
                  onChange={() => handleDrugChange(formInstance, key)}
                >
                  {drugs.map((d) => (
                    <Option
                      key={d._id as string}
                      value={d._id as string}
                      label={`${d.name} (${d.barcode})`}
                    >
                      {d.name} ({d.barcode})
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                {...restField}
                name={[name, "quantity"]}
                rules={[{ required: true, message: "Missing quantity" }]}
                label="Quantity"
              >
                <InputNumber min={1} placeholder="Quantity" />
              </Form.Item>

              <Form.Item
                noStyle
                shouldUpdate={(prevValues, currentValues) =>
                  prevValues.medications?.[name]?.drug !==
                  currentValues.medications?.[name]?.drug
                }
              >
                {({ getFieldValue }) => {
                  const drugId = getFieldValue(["medications", name, "drug"]);
                  const selectedDrug = drugs.find((d) => d._id === drugId);

                  if (!selectedDrug) return null;

                  const hasStrips =
                    selectedDrug.pillsPerStrip &&
                    selectedDrug.pillsPerStrip > 1;
                  const hasBoxes =
                    selectedDrug.stripsPerBox && selectedDrug.stripsPerBox > 1;

                  if (!hasStrips && !hasBoxes) {
                    return <div style={{ width: 100 }} />;
                  }

                  return (
                    <Form.Item
                      {...restField}
                      name={[name, "unit"]}
                      initialValue="pills"
                      label="Unit"
                    >
                      <Select style={{ width: 100 }}>
                        <Option value="pills">Pill</Option>
                        {hasStrips && <Option value="strips">Strip</Option>}
                        {hasBoxes && <Option value="boxes">Box</Option>}
                      </Select>
                    </Form.Item>
                  );
                }}
              </Form.Item>

              <Form.Item
                {...restField}
                name={[name, "remainingQuantity"]}
                rules={[
                  { required: true, message: "Missing remaining quantity" },
                ]}
                label="Remaining Qty"
              >
                <InputNumber
                  placeholder="Remaining Qty"
                  style={{ width: "100%" }}
                />
              </Form.Item>
              <Form.Item
                {...restField}
                name={[name, "remainingUnit"]}
                rules={[{ required: true, message: "Missing remaining unit" }]}
                label="Remaining Unit"
              >
                <Select placeholder="Remaining Unit">
                  <Option value="pills">Pills</Option>
                  <Option value="strips">Strips</Option>
                  <Option value="boxes">Boxes</Option>
                </Select>
              </Form.Item>
              <MinusCircleOutlined onClick={() => remove(name)} />
            </Space>
          ))}
          <Form.Item>
            <Button
              type="dashed"
              onClick={() => add()}
              block
              icon={<PlusOutlined />}
            >
              Add Drug
            </Button>
          </Form.Item>
        </>
      )}
    </Form.List>
  );

  return (
    <div className="p-6">
      <Card>
        <Title level={2} className="mb-6">
          Dispense Patient Treatment
        </Title>
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
            rules={[{ required: true, message: "Please select a patient!" }]}
          >
            <Select
              showSearch
              placeholder="Select a patient"
              optionFilterProp="children"
              loading={loading}
              onChange={handlePatientChange}
              filterOption={(input, option) =>
                option?.label
                  ? String(option.label)
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  : false
              }
            >
              {patients.map((p) => (
                <Option
                  key={p._id as string}
                  value={p._id as string}
                  label={`${p.code} - ${p.name}`}
                >
                  {p.code} - {p.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Title level={4} className="mt-8">
            Medications
          </Title>

          {renderMedicationFormList(form)}

          <Form.Item className="mt-8">
            <Space>
              <Button type="primary" htmlType="submit">
                Dispense Treatment
              </Button>
              <Button
                htmlType="button"
                onClick={() => router.push("/pharmacy")}
              >
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>

      {selectedPatientId && (
        <Card className="mt-6">
          <Title level={3} className="mb-4">
            Patient Medication History
          </Title>
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

      <Modal
        title="Edit Dispensed Medication"
        open={isEditModalVisible}
        onCancel={() => setIsEditModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsEditModalVisible(false)}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={editLoading}
            onClick={handleEditSubmit}
          >
            Save Changes
          </Button>,
        ]}
        width={800}
      >
        <Form
          form={editForm}
          layout="vertical"
          name="edit_dispensed_medication"
        >
          <Form.Item
            name="patientId"
            label="Patient"
            rules={[{ required: true, message: "Please select a patient!" }]}
          >
            <Select
              disabled={true}
              showSearch
              placeholder="Select a patient"
              optionFilterProp="children"
              filterOption={(input, option) =>
                option?.label
                  ? String(option.label)
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  : false
              }
            >
              {patients.map((p) => (
                <Option
                  key={p._id as string}
                  value={p._id as string}
                  label={`${p.code} - ${p.name}`}
                >
                  {p.code} - {p.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          {renderMedicationFormList(editForm)}
        </Form>
      </Modal>
    </div>
  );
}
