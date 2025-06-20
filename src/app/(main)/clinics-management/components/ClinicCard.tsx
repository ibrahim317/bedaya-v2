import { Card, Button, Tooltip } from 'antd';
import { EditOutlined, EyeOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { IClinicSummary } from '@/clients/clinicsClient';

interface ClinicCardProps {
  clinic: IClinicSummary;
  onEdit: () => void;
}

export default function ClinicCard({ clinic, onEdit }: ClinicCardProps) {
  return (
    <Card
      className="h-full"
      actions={[
        <Tooltip key="edit" title="Edit Clinic">
          <Button 
            type="text" 
            icon={<EditOutlined />} 
            onClick={onEdit}
          >
            Edit
          </Button>
        </Tooltip>,
        <Link key="view" href={`/clinics-management/${clinic._id}`}>
          <Tooltip title="View Details">
            <Button 
              type="text" 
              icon={<EyeOutlined />}
            >
              View
            </Button>
          </Tooltip>
        </Link>,
      ]}
    >
      <h3 className="text-lg font-semibold mb-4">{clinic.name}</h3>
      
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Common Diagnoses:</span>
          <span className="font-medium">{clinic.commonDiagnoses || 0}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Common Treatments:</span>
          <span className="font-medium">{clinic.commonTreatments || 0}</span>
        </div>
      </div>
    </Card>
  );
} 