import { useEffect, useState } from 'react';
import { Users, Stethoscope, CalendarDays, CalendarClock, TrendingUp, Activity, CheckCircle2, XCircle } from 'lucide-react';
import { PageHeader } from '@/components/Layout';
import { LoadingSpinner, ErrorState } from '@/components/States';
import { PatientService, DoctorService, AppointmentService } from '@/lib/service/services';
import { PatientDTO, DoctorDTO, AppointmentDTO } from '@/lib/model/types';
import { Page } from '@/components/Layout';

interface DashboardProps {
  onNavigate: (page: Page) => void;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const [patients, setPatients] = useState<PatientDTO[]>([]);
  const [doctors, setDoctors] = useState<DoctorDTO[]>([]);
  const [appointments, setAppointments] = useState<AppointmentDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const [p, d, a] = await Promise.all([
          PatientService.getAll(),
          DoctorService.getAll(),
          AppointmentService.getAll(),
        ]);
        setPatients(p);
        setDoctors(d);
        const enriched = AppointmentService.enrich(a, p, d);
        setAppointments(enriched);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load data');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <LoadingSpinner label="Loading dashboard..." />;
  if (error) return <ErrorState message={error} />;

  const today = new Date().toISOString().split('T')[0];
  const upcoming = appointments
    .filter((a) => a.date >= today && a.status === 'Scheduled')
    .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
  const completed = appointments.filter((a) => a.status === 'Completed').length;
  const cancelled = appointments.filter((a) => a.status === 'Cancelled').length;

  const stats = [
    {
      label: 'Total Patients',
      value: patients.length,
      icon: Users,
      color: 'sky',
      bg: 'bg-sky-50',
      iconBg: 'bg-sky-500',
    },
    {
      label: 'Total Doctors',
      value: doctors.length,
      icon: Stethoscope,
      color: 'blue',
      bg: 'bg-blue-50',
      iconBg: 'bg-blue-500',
    },
    {
      label: 'Total Appointments',
      value: appointments.length,
      icon: CalendarDays,
      color: 'emerald',
      bg: 'bg-emerald-50',
      iconBg: 'bg-emerald-500',
    },
    {
      label: 'Upcoming Appointments',
      value: upcoming.length,
      icon: CalendarClock,
      color: 'amber',
      bg: 'bg-amber-50',
      iconBg: 'bg-amber-500',
    },
  ];

  // Department distribution
  const deptMap = new Map<string, number>();
  doctors.forEach((d) => deptMap.set(d.department, (deptMap.get(d.department) ?? 0) + 1));
  const departments = Array.from(deptMap.entries()).sort((a, b) => b[1] - a[1]);
  const maxDept = Math.max(...departments.map((d) => d[1]), 1);

  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle="Hospital overview and key statistics"
      />

      {/* Stats cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.label}
              className="group relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition-all hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">{s.label}</p>
                  <p className="mt-2 text-3xl font-bold text-slate-800">{s.value}</p>
                </div>
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${s.iconBg} shadow-md`}>
                  <Icon size={24} className="text-white" />
                </div>
              </div>
              <div className={`absolute bottom-0 left-0 h-1 w-full ${s.iconBg} opacity-80`} />
            </div>
          );
        })}
      </div>

      {/* Appointment status summary */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50">
            <CheckCircle2 size={22} className="text-emerald-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-800">{completed}</p>
            <p className="text-sm text-slate-500">Completed</p>
          </div>
        </div>
        <div className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50">
            <Activity size={22} className="text-amber-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-800">{upcoming.length}</p>
            <p className="text-sm text-slate-500">Scheduled</p>
          </div>
        </div>
        <div className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50">
            <XCircle size={22} className="text-red-500" />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-800">{cancelled}</p>
            <p className="text-sm text-slate-500">Cancelled</p>
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Upcoming appointments */}
        <div className="lg:col-span-2">
          <div className="rounded-2xl border border-slate-100 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <div className="flex items-center gap-2">
                <CalendarClock size={20} className="text-sky-600" />
                <h2 className="font-semibold text-slate-800">Upcoming Appointments</h2>
              </div>
              <button
                onClick={() => onNavigate('appointments')}
                className="text-sm font-medium text-sky-600 hover:text-sky-700"
              >
                View all
              </button>
            </div>
            <div className="divide-y divide-slate-50">
              {upcoming.length === 0 ? (
                <p className="px-5 py-10 text-center text-sm text-slate-400">No upcoming appointments</p>
              ) : (
                upcoming.slice(0, 6).map((a) => (
                  <div key={a.id} className="flex items-center gap-4 px-5 py-3.5 transition-colors hover:bg-slate-50">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-sky-50 text-sm font-bold text-sky-700">
                      {a.appointmentCode.split('-')[1]}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-slate-800">{a.patientName}</p>
                      <p className="truncate text-xs text-slate-500">
                        {a.doctorName} — {a.reason}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-slate-700">{formatDate(a.date)}</p>
                      <p className="text-xs text-slate-400">{a.time}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Department distribution */}
        <div className="rounded-2xl border border-slate-100 bg-white shadow-sm">
          <div className="flex items-center gap-2 border-b border-slate-100 px-5 py-4">
            <TrendingUp size={20} className="text-sky-600" />
            <h2 className="font-semibold text-slate-800">Doctors by Department</h2>
          </div>
          <div className="space-y-4 p-5">
            {departments.map(([dept, count]) => (
              <div key={dept}>
                <div className="mb-1.5 flex items-center justify-between text-sm">
                  <span className="font-medium text-slate-700">{dept}</span>
                  <span className="text-slate-400">{count}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-sky-400 to-blue-500 transition-all"
                    style={{ width: `${(count / maxDept) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function formatDate(iso: string): string {
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
