'use client';

import { useEffect, useState, useRef, useLayoutEffect, MutableRefObject } from 'react';
import gsap from 'gsap';
import { Typography, Card, Row, Col, Statistic, Spin, Alert, Divider } from 'antd';
import { Line, Column, ColumnConfig } from '@ant-design/charts';
import { getDashboardStats } from '@/clients/dashboard';
import { clinicsClient, IClinicSummary } from '@/clients/clinicsClient';
import { DashboardStats } from '@/types/Dashboard';
import { UserOutlined, MedicineBoxOutlined, HomeOutlined, PlusSquareOutlined, SolutionOutlined, ExperimentOutlined, LoginOutlined, LogoutOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { PatientType, PatientLabTestStatus } from '@/types/Patient';
import CountUp from '@/components/textAnimations/CountUp/CountUp';
import DotGrid from '@/components/backgrounds/DotGrid/DotGrid';

const { Title, Text } = Typography;

const labTestNames = ["Stool", "Urine", "Blood", "Albumin-Creat"];
const labTestStatuses = Object.values(PatientLabTestStatus);

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [clinics, setClinics] = useState<IClinicSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [confetti, setConfetti] = useState(false); // Easter egg state

  // Refs for GSAP
  const cardsRef = useRef<HTMLDivElement[]>([]);
  const titleRef = useRef<HTMLDivElement | null>(null);
  const labStatsRef = useRef<HTMLDivElement[]>([]);
  const chartRef = useRef<HTMLDivElement | null>(null);
  const patientsPerClinicRef = useRef<HTMLDivElement | null>(null);
  const easterEggRef = useRef<HTMLDivElement | null>(null);

  // Konami code logic + Mobile-friendly long-press trigger
  useEffect(() => {
    const konami = [38,38,40,40,37,39,37,39,66,65];
    let pos = 0;
    async function onKeyDown(e: KeyboardEvent) {
      if (e.keyCode === konami[pos]) {
        pos++;
        if (pos === konami.length) {
          // Check if user has solved the riddle before (by IP)
          let ip: string = localStorage.getItem('user_ip') || '';
          if (!ip) {
            try {
              const res = await fetch('https://api.ipify.org?format=json');
              const data = await res.json();
              ip = data.ip;
              localStorage.setItem('user_ip', ip);
            } catch {}
          }
          const solved = localStorage.getItem(`riddle_solved_${ip}`);
          if (solved === 'true') {
            localStorage.setItem('easterEggPuzzleAccess', 'true');
            window.location.href = '/dashboard/puzzle';
            return;
          }
          setConfetti(true);
          setTimeout(() => setConfetti(false), 4000);
          pos = 0;
        }
      } else {
        pos = 0;
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  // --- Long-press logic for mobile/desktop ---
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);
  const longPressTriggered = useRef(false);

  async function handleLongPress() {
    // Check if user has solved the riddle before (by IP)
    let ip: string = localStorage.getItem('user_ip') || '';
    if (!ip) {
      try {
        const res = await fetch('https://api.ipify.org?format=json');
        const data = await res.json();
        ip = data.ip;
        localStorage.setItem('user_ip', ip);
      } catch {}
    }
    const solved = localStorage.getItem(`riddle_solved_${ip}`);
    if (solved === 'true') {
      localStorage.setItem('easterEggPuzzleAccess', 'true');
      window.location.href = '/dashboard/puzzle';
      return;
    }
    setConfetti(true);
    setTimeout(() => setConfetti(false), 4000);
  }

  function onTitlePressStart() {
    longPressTriggered.current = false;
    longPressTimer.current = setTimeout(() => {
      longPressTriggered.current = true;
      handleLongPress();
    }, 2000); // 2 seconds
  }
  function onTitlePressEnd() {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  }

  // --- Tap 4 times logic for mobile/desktop ---
  const tapCount = useRef(0);
  const tapTimeout = useRef<NodeJS.Timeout | null>(null);

  async function handleEasterEggTrigger() {
    // Check if user has solved the riddle before (by IP)
    let ip: string = localStorage.getItem('user_ip') || '';
    if (!ip) {
      try {
        const res = await fetch('https://api.ipify.org?format=json');
        const data = await res.json();
        ip = data.ip;
        localStorage.setItem('user_ip', ip);
      } catch {}
    }
    const solved = localStorage.getItem(`riddle_solved_${ip}`);
    if (solved === 'true') {
      localStorage.setItem('easterEggPuzzleAccess', 'true');
      window.location.href = '/dashboard/puzzle';
      return;
    }
    setConfetti(true);
    setTimeout(() => setConfetti(false), 4000);
  }

  function onTitleTap() {
    tapCount.current += 1;
    if (tapTimeout.current) clearTimeout(tapTimeout.current);
    if (tapCount.current === 4) {
      tapCount.current = 0;
      handleEasterEggTrigger();
      return;
    }
    tapTimeout.current = setTimeout(() => {
      tapCount.current = 0;
    }, 2000); // 2 seconds to reset
  }

  // GSAP entrance animations
  useLayoutEffect(() => {
    if (!loading && !error) {
      gsap.from(titleRef.current, { y: -50, opacity: 0, duration: 1, ease: 'power3.out' });
      gsap.from(cardsRef.current, {
        opacity: 0,
        y: 30,
        stagger: 0.1,
        duration: 0.8,
        ease: 'back.out(1.7)'
      });
      gsap.from(labStatsRef.current, {
        opacity: 0,
        scale: 0.8,
        stagger: 0.15,
        duration: 0.7,
        delay: 0.5,
        ease: 'elastic.out(1,0.7)'
      });
      gsap.from(chartRef.current, { opacity: 0, y: 40, duration: 1, delay: 0.7 });
      gsap.from(patientsPerClinicRef.current, { opacity: 0, y: 40, duration: 1, delay: 0.9 });
    }
  }, [loading, error]);

  // Card hover effect
  useEffect(() => {
    if (!loading && !error) {
      cardsRef.current.forEach((el) => {
        if (!el) return;
        el.onmouseenter = () => gsap.to(el, { scale: 1.05, boxShadow: '0 8px 32px #4CAF5040', duration: 0.3 });
        el.onmouseleave = () => gsap.to(el, { scale: 1, boxShadow: '0 1px 4px #00000010', duration: 0.3 });
      });
    }
  }, [loading, error]);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [statsData, clinicsData] = await Promise.all([
          getDashboardStats(),
          clinicsClient.getAllClinics()
        ]);
        setStats(statsData);
        setClinics(clinicsData);
        setError(null);
      } catch (err) {
        setError('Failed to load dashboard data. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return <Alert message="Error" description={error} type="error" showIcon />;
  }

  const renderLabStats = (patientType: PatientType, idx: number) => {
    const title = patientType === PatientType.Adult ? "Adult Lab Test Statistics" : "Child Lab Test Statistics";
    const patientStats = stats?.labTestStats[patientType];
    const labTotals = stats?.labTotals[patientType];

    return (
      <div className="mb-8" ref={el => { if (el) labStatsRef.current[idx] = el; }}>
        <Title level={3} className="mb-4">{title}</Title>
        
        {labTotals && (
          <Row gutter={[16, 16]} className="mb-6">
            <Col xs={24} sm={12} md={8}>
              <Card>
                <Statistic title="Patients Not Requested (Overall Status)" value={labTotals.labTotalNotRequested} prefix={<QuestionCircleOutlined />} />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Card>
                <Statistic title="Patients Checked In (Overall Status)" value={labTotals.labTotalIn} prefix={<LoginOutlined />} />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Card>
                <Statistic title="Patients Checked Out (Overall Status)" value={labTotals.labTotalOut} prefix={<LogoutOutlined />} />
              </Card>
            </Col>
          </Row>
        )}

        {patientStats ? (
          <Row gutter={[16, 16]}>
            {labTestNames.map((labName) => {
              const labData = patientStats[labName];
              return (
                <Col xs={24} sm={12} md={12} lg={6} key={labName}>
                  <Card>
                    <Title level={5}>{labName} Tests</Title>
                    <Statistic
                      title="Total Patients"
                      value={labData?.total || 0}
                      prefix={<ExperimentOutlined />}
                    />
                    <Divider className="my-2" />
                    {labTestStatuses.map((status) => (
                      <Row key={status}>
                        <Col span={12}><Text type="secondary">{status}</Text></Col>
                        <Col span={12}><Text strong>{labData?.statuses[status] || 0}</Text></Col>
                      </Row>
                    ))}
                  </Card>
                </Col>
              );
            })}
          </Row>
        ) : (
          <Text>No lab test data available for {patientType.toLowerCase()}s.</Text>
        )}
      </div>
    );
  };

  const lineConfig = stats ? {
    data: stats.dailyPatientCounts,
    xField: 'date',
    yField: 'count',
    point: {
      shape: 'diamond',
      size: 4,
    },
    label: {
      style: {
        fill: '#aaa',
      },
    },
    yAxis: {
      min: 0,
    }
  } : {};

  const patientsPerClinicData = clinics.flatMap(clinic => {
    const adultStat = stats?.patientsPerClinic.find(p => p.clinicName === clinic.name && p.type === PatientType.Adult);
    const childStat = stats?.patientsPerClinic.find(p => p.clinicName === clinic.name && p.type === PatientType.Child);
    return [
      { clinicName: clinic.name, patientCount: adultStat ? adultStat.patientCount : 0, type: 'Adults' },
      { clinicName: clinic.name, patientCount: childStat ? childStat.patientCount : 0, type: 'Children' },
    ];
  });


  const patientsPerClinicConfig = {
    data: patientsPerClinicData,
    xField: 'clinicName',
    yField: 'patientCount',
    seriesField: 'type',
    isGroup: true,
    // Change the color from a single string to an array of strings
   color: ({ type }: { type: string }) => {
    console.log(type);
      if (type === 'Adults') {
        return '#5B8FF9'; // Return blue for Adults
      }
      return '#5AD8A6'; // Return green for Children
    },
    legend: {
      position: 'top-right' as const,
    },
    xAxis: {
      label: {
        autoHide: true,
        autoRotate: true,
      },
    },
    meta: {
      patientCount: {
        alias: 'Number of Patients',
      },
      clinicName: {
        alias: 'Clinic',
      },
      type: {
        alias: 'Patient Type',
      },
    },
  };

  return (
    <div className="p-4 md:p-8 relative" style={{position:'relative',zIndex:1}}>
      {/* Confetti Easter Egg Dialog */}
      {confetti && (
        <MovingEasterEggDialog onSuccess={() => setConfetti(false)} />
      )}
      <Title level={2} className="mb-8" ref={titleRef as any}
        onClick={onTitleTap}
        style={{ userSelect: 'none', cursor: 'pointer' }}
      >
        System Dashboard <span className='md:hidden' style={{ fontSize: 10, opacity: 0.5 }}>
          (Tap on it)
        </span>
      </Title>

      <Row gutter={[16, 16]} className="mb-8">
        {[stats?.adultPatientCount, stats?.childPatientCount, stats?.userCount, stats?.clinicCount, stats?.drugCount, stats?.dispensedMedicationCount].map((val, i) => (
          <Col xs={24} sm={12} md={8} lg={6} xl={4} key={i}>
            <Card ref={el => { if (el) cardsRef.current[i] = el; }}>
              <Statistic
                title={
                  i === 0
                    ? "Total Adult Patients"
                    : i === 1
                    ? "Total Child Patients"
                    : i === 2
                    ? (
                        <>
                          Total Users{" "}
                          <span className='max-md:hidden' style={{ fontSize: 10, opacity: 0.5 }}>
                            (Try the Konami code!)
                          </span>
                        </>
                      )
                    : i === 3
                    ? "Total Clinics"
                    : i === 4
                    ? "Total Drugs"
                    : "Dispensed Meds"
                }
                valueRender={() => <CountUp to={typeof val === 'number' ? val : 0} duration={1.2} className="text-lg" />}
                prefix={
                  i === 0
                    ? <UserOutlined />
                    : i === 1
                    ? <UserOutlined />
                    : i === 2
                    ? <UserOutlined />
                    : i === 3
                    ? <HomeOutlined />
                    : i === 4
                    ? <MedicineBoxOutlined />
                    : <PlusSquareOutlined />
                }
              />
            </Card>
          </Col>
        ))}
      </Row>

      {renderLabStats(PatientType.Adult, 0)}
      {renderLabStats(PatientType.Child, 1)}

      <Card title="New Patients (Last 7 Days)" className="mb-8" ref={chartRef as any}>
        {stats && <Line {...lineConfig} />}
      </Card>

      <Card title="Unique Patients per Clinic" ref={patientsPerClinicRef as any}>
        {patientsPerClinicData.length > 0 ? (
          <Column {...patientsPerClinicConfig} />
        ) : (
          <Text>No clinic patient data available.</Text>
        )}
      </Card>
    </div>
  );
}

// Confetti animation component using GSAP
function ConfettiAnimation() {
  const confettiRef = useRef<HTMLDivElement[]>([]);
  useLayoutEffect(() => {
    const colors = ['#4CAF50','#5B8FF9','#5AD8A6','#FFC107','#FF4081','#FF5722'];
    confettiRef.current.forEach((el, i) => {
      if (!el) return;
      gsap.fromTo(el, {
        y: -100,
        x: Math.random() * window.innerWidth,
        background: colors[i % colors.length],
        opacity: 1,
        scale: 1 + Math.random()
      }, {
        y: window.innerHeight + 100,
        x: "+=" + (Math.random() * 200 - 100),
        rotation: Math.random() * 720,
        duration: 2.5 + Math.random(),
        ease: 'power1.in',
        opacity: 0,
        scale: 0.7,
      });
    });
  }, []);
  return (
    <>
      {Array.from({length: 40}).map((_, i) => (
        <div
          key={i}
          ref={el => { if (el) confettiRef.current[i] = el; }}
          style={{
            position: 'absolute',
            width: 16,
            height: 16,
            borderRadius: 4,
            background: '#4CAF50',
            left: 0,
            top: 0,
            pointerEvents: 'none',
            zIndex: 9999,
          }}
        />
      ))}
    </>
  );
}

// Moving dialog component for the easter egg
function MovingEasterEggDialog({ onSuccess }: { onSuccess: () => void }) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ top: 100, left: 100 });
  const [moving, setMoving] = useState(true);
  const moveInterval = useRef<NodeJS.Timeout | null>(null);

  // Move the dialog randomly every 600ms
  useEffect(() => {
    if (!moving) return;
    moveInterval.current = setInterval(() => {
      setPosition({
        top: Math.random() * (window.innerHeight - 180),
        left: Math.random() * (window.innerWidth - 320),
      });
    }, 600);
    return () => {
      if (moveInterval.current) clearInterval(moveInterval.current);
    };
  }, [moving]);

  // Stop moving on hover (to make it possible to click)
  const handleMouseEnter = () => setMoving(false);
  const handleMouseLeave = () => setMoving(true);

  const handleButtonClick = () => {
    localStorage.setItem('easterEggPuzzleAccess', 'true');
    onSuccess();
    window.location.href = '/dashboard/puzzle';
  };

  return (
    <div
      ref={dialogRef}
      style={{
        position: 'fixed',
        top: position.top,
        left: position.left,
        width: 300,
        padding: 24,
        background: 'white',
        borderRadius: 16,
        boxShadow: '0 8px 32px #4CAF5040',
        zIndex: 10000,
        transition: 'top 0.4s cubic-bezier(0.4,2,0.6,1)',
        cursor: moving ? 'pointer' : 'default',
        userSelect: 'none',
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div style={{ textAlign: 'center' }}>
        <h3 style={{ marginBottom: 12 }}>🎉 You found the secret!</h3>
        <p style={{ marginBottom: 16 }}>Can you catch the button? <br/>Click to take the challenge!</p>
        <button
          style={{
            padding: '8px 20px',
            fontSize: 16,
            borderRadius: 8,
            background: '#4CAF50',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 2px 8px #4CAF5040',
            transition: 'background 0.2s',
          }}
          onClick={handleButtonClick}
        >
          Take the Challenge
        </button>
      </div>
    </div>
  );
}