# Bedaya Patient Management System

A comprehensive healthcare management platform built with Next.js and MongoDB, designed to streamline patient care, pharmacy operations, and clinical reporting.

## Features

### Core Patient Management
- **Patient Registration & Profiles**: Complete patient data entry for both adults and children
- **Medical Records**: Comprehensive health history, examinations, and treatment tracking
- **Visit Management**: Track patient visits, diagnoses, and follow-ups
- **Referral System**: Manage patient referrals between clinics and specialists

### Pharmacy Management
- **Drug Inventory**: Complete drug catalog with stock management
- **Prescription Dispensing**: Track medication dispensing and patient compliance
- **Pharmacy Analytics**: Monitor dispensing patterns and inventory levels
- **Drug Information**: Detailed drug profiles and interactions

### Clinical Operations
- **Clinic Management**: Multi-clinic support with clinic-specific configurations
- **Common Diagnoses & Treatments**: Standardized diagnosis and treatment protocols
- **Laboratory Integration**: Support for various lab tests (blood, urine, stool, etc.)
- **Medical Imaging**: Patient image upload and management

### Reporting & Analytics
- **Comprehensive Reports**: Generate detailed patient and clinic reports
- **Query Builder**: Advanced data querying and filtering capabilities
- **Dashboard Analytics**: Real-time statistics and performance metrics
- **Export Functionality**: Data export for external analysis

### User Management & Security
- **Role-Based Access Control**: Admin, doctor, nurse, and pharmacy staff roles
- **User Permissions**: Granular permission system for data access
- **Authentication**: Secure login with NextAuth.js
- **User Verification**: Email verification and admin approval system

### Technical Features
- **Modern UI**: Ant Design components with responsive design
- **Real-time Updates**: Live data synchronization
- **Data Validation**: Comprehensive input validation and error handling
- **Performance Optimized**: Server-side rendering and efficient data queries

## Technology Stack

- **Frontend**: Next.js 15 with App Router, React 18, TypeScript
- **UI Framework**: Ant Design with Tailwind CSS
- **Backend**: Next.js API Routes with MongoDB
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: NextAuth.js with JWT tokens
- **Styling**: Tailwind CSS with custom components

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/bedaya-v2.git
cd bedaya-v2
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env.local` file in the root directory with the following variables:

```env
# NextAuth Configuration
NEXTAUTH_SECRET=your-secret-key-change-in-production
NEXTAUTH_URL=http://localhost:3000

# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/bedaya

# Email Configuration (for transactional emails)
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=your-email@gmail.com
EMAIL_SERVER_PASSWORD=your-app-password
EMAIL_FROM=noreply@bedaya.com
```

### Development

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Project Structure

```
src/
├── app/                 # Next.js App Router pages and API routes
│   ├── (auth)/          # Authentication pages (login, register)
│   ├── (main)/          # Protected application routes
│   │   ├── dashboard/   # Analytics and statistics
│   │   ├── patients/    # Patient management
│   │   ├── clinics/     # Clinic operations
│   │   ├── pharmacy/    # Pharmacy management
│   │   ├── labs/        # Laboratory tests
│   │   ├── reports/     # Reporting system
│   │   └── users/       # User management
│   └── api/             # Backend API endpoints
├── components/          # Reusable React components
├── types/               # TypeScript type definitions
├── models/              # MongoDB schemas
├── services/            # Business logic layer
├── clients/             # Frontend API clients
├── providers/           # React context providers
└── lib/                 # Utility functions and configurations
```

## Key Features Overview

### Patient Management
- Complete patient registration for adults and children
- Comprehensive medical history tracking
- Visit and treatment management
- Image upload and document management

### Pharmacy System
- Drug inventory management
- Prescription dispensing workflow
- Stock tracking and alerts
- Pharmacy analytics and reporting

### Reporting & Analytics
- Custom report generation
- Advanced query builder
- Real-time dashboard metrics
- Data export capabilities

### User Roles & Permissions
- **Admin**: Full system access and user management
- **Doctor**: Patient care and medical record access
- **Nurse**: Patient data entry and basic operations
- **Pharmacist**: Pharmacy operations and drug management

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/verify/[id]` - Email verification

### Patients
- `GET /api/patients` - List patients
- `POST /api/patients` - Create patient
- `GET /api/patients/[id]` - Get patient details
- `PUT /api/patients/[id]` - Update patient

### Clinics
- `GET /api/clinics` - List clinics
- `POST /api/clinics` - Create clinic
- `GET /api/clinics/[id]` - Get clinic details
- `GET /api/clinics/[id]/stats` - Clinic statistics

### Pharmacy
- `GET /api/drugs` - List drugs
- `POST /api/drugs` - Add drug
- `GET /api/dispensed-medications` - Dispensing records
- `POST /api/dispensed-medications` - Record dispensing

### Reports
- `GET /api/reports` - List reports
- `POST /api/reports` - Generate report
- `GET /api/query` - Query builder endpoint

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support and questions, please contact the development team or create an issue in the repository.
