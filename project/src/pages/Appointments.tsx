import { useEffect, useState, useCallback } from 'react';
import { Plus, CalendarX, CheckCircle2, Clock, Trash2, CalendarDays } from 'lucide-react';
import { PageHeader } from '@/components/Layout';
import { SearchBar } from '@/components/SearchBar';
import { Button } from '@/components/Button';
import { Modal } from '@/components/Modal';
import { Field, Select, TextInput, TextArea } from '@/components/FormControls';
import { LoadingSpinner, EmptyState, ErrorState } from '@/components/States';
import { PatientService, DoctorService, AppointmentService } from '@/lib/service/services';
import { PatientDTO, DoctorDTO, AppointmentDTO, AppointmentStatus } from '@/lib/model/types';

const statusConfig: Record<AppointmentStatus, { bg: string; text: string; icon: typeof Clock }> = {
  Scheduled: { bg: 'bg-amber-50', text: 'text-amber-700', icon: Clock },
  Completed: { bg: 'bg-emerald-50', text: 'text-emerald-700', icon: CheckCircle2 },
  Cancelled: { bg: 'bg-red-50', text: 'text-red-600', icon: CalendarX },
};

export function Appointments() {
  const [appointments, setAppointments] = useState<AppointmentDTO[]>([]);
  const [patients, setPatients] = useState<PatientDTO[]>([]);
  const [doctors, setDoctors] = useState<DoctorDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    appointmentCode: '',
    patientId: '',
    doctorId: '',
    date: '',
    time: '09:00',
    reason: '',
  });

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const [a, p, d] = await Promise.all([
        AppointmentService.getAll(),
        PatientService.getAll(),
        DoctorService.getAll(),
      ]);
      setPatients(p);
      setDoctors(d);
      setAppointments(AppointmentService.enrich(a, p, d));
      setError('');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load appointments');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const openAdd = async () => {
    const code = await AppointmentService.nextCode();
    setForm({ appointmentCode: code, patientId: '', doctorId: '', date: '', time: '09:00', reason: '' });
    setFormError('');
    setModalOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    setFormError('');
    try {
      await AppointmentService.create({
        appointmentCode: form.appointmentCode,
        patientId: form.patientId,
        doctorId: form.doctorId,
        date: form.date,
        time: form.time,
        reason: form.reason,
      });
      setModalOpen(false);
      await load();
    } catch (e) {
      setFormError(e instanceof Error ? e.message : 'Failed to book appointment');
    } finally {
      setSaving(false);
    }
  };

  const handleStatusChange = async (id: string, status: AppointmentStatus) => {
    try {
      if (status === 'Cancelled') await AppointmentService.cancel(id);
      else if (status === 'Completed') await AppointmentService.complete(id);
      else await AppointmentService.reschedule(id);
      await load();
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Failed to update appointment');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this appointment?')) return;
    try {
      await AppointmentService.delete(id);
      await load();
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Failed to delete appointment');
    }
  };

  const filtered = AppointmentService.search(appointments, search);

  return (
    <div>
      <PageHeader
        title="Appointment Management"
        subtitle="Book, view, search and manage appointments"
        action={
          <Button onClick={openAdd}>
            <Plus size={18} />
            Book Appointment
          </Button>
        }
      />

      <div className="mb-5">
        <SearchBar value={search} onChange={setSearch} placeholder="Search by patient, doctor, date, status..." />
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
        {loading ? (
          <LoadingSpinner label="Loading appointments..." />
        ) : error ? (
          <ErrorState message={error} />
        ) : filtered.length === 0 ? (
          <EmptyState message="No appointments found" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                  <th className="px-5 py-3.5 font-semibold">Appt ID</th>
                  <th className="px-5 py-3.5 font-semibold">Patient</th>
                  <th className="px-5 py-3.5 font-semibold">Doctor</th>
                  <th className="px-5 py-3.5 font-semibold">Date</th>
                  <th className="px-5 py-3.5 font-semibold">Time</th>
                  <th className="px-5 py-3.5 font-semibold">Reason</th>
                  <th className="px-5 py-3.5 font-semibold">Status</th>
                  <th className="px-5 py-3.5 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map((a) => {
                  const cfg = statusConfig[a.status];
                  const StatusIcon = cfg.icon;
                  return (
                    <tr key={a.id} className="transition-colors hover:bg-sky-50/40">
                      <td className="px-5 py-4">
                        <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600">
                          {a.appointmentCode}
                        </span>
                      </td>
                      <td className="px-5 py-4 font-medium text-slate-800">{a.patientName}</td>
                      <td className="px-5 py-4 text-slate-600">{a.doctorName}</td>
                      <td className="px-5 py-4 text-slate-600">{formatDate(a.date)}</td>
                      <td className="px-5 py-4 text-slate-600">{a.time}</td>
                      <td className="px-5 py-4 max-w-[200px] truncate text-slate-500" title={a.reason}>
                        {a.reason || '—'}
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${cfg.bg} ${cfg.text}`}>
                          <StatusIcon size={12} />
                          {a.status}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-1.5">
                          {a.status !== 'Completed' && (
                            <button
                              onClick={() => handleStatusChange(a.id, 'Completed')}
                              title="Mark completed"
                              className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-emerald-50 hover:text-emerald-600"
                            >
                              <CheckCircle2 size={16} />
                            </button>
                          )}
                          {a.status !== 'Cancelled' && (
                            <button
                              onClick={() => handleStatusChange(a.id, 'Cancelled')}
                              title="Cancel appointment"
                              className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-amber-50 hover:text-amber-600"
                            >
                              <CalendarX size={16} />
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(a.id)}
                            title="Delete"
                            className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {!loading && !error && filtered.length > 0 && (
        <p className="mt-3 text-xs text-slate-400">
          Showing {filtered.length} of {appointments.length} appointments
        </p>
      )}

      <Modal
        open={modalOpen}
        title="Book New Appointment"
        onClose={() => setModalOpen(false)}
      >
        {formError && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {formError}
          </div>
        )}
        <div className="space-y-4">
          <Field label="Appointment ID" required>
            <TextInput value={form.appointmentCode} disabled className="bg-slate-50" />
          </Field>
          <Field label="Patient" required>
            <Select
              value={form.patientId}
              onChange={(e) => setForm({ ...form, patientId: e.target.value })}
            >
              <option value="">Select a patient...</option>
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.patientCode} — {p.name}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Doctor" required>
            <Select
              value={form.doctorId}
              onChange={(e) => setForm({ ...form, doctorId: e.target.value })}
            >
              <option value="">Select a doctor...</option>
              {doctors.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.doctorCode} — {d.name} ({d.specialization})
                </option>
              ))}
            </Select>
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Date" required>
              <TextInput
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
              />
            </Field>
            <Field label="Time" required>
              <TextInput
                type="time"
                value={form.time}
                onChange={(e) => setForm({ ...form, time: e.target.value })}
              />
            </Field>
          </div>
          <Field label="Reason for Visit">
            <TextArea
              value={form.reason}
              onChange={(e) => setForm({ ...form, reason: e.target.value })}
              placeholder="e.g. Routine check-up"
            />
          </Field>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="secondary" onClick={() => setModalOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? 'Booking...' : 'Book Appointment'}
          </Button>
        </div>
      </Modal>
    </div>
  );
}

function formatDate(iso: string): string {
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}
