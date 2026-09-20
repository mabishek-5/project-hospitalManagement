import { useEffect, useState, useCallback } from 'react';
import { Plus, Pencil, Trash2, Phone, Mail, Briefcase, Award } from 'lucide-react';
import { PageHeader } from '@/components/Layout';
import { SearchBar } from '@/components/SearchBar';
import { Button } from '@/components/Button';
import { Modal } from '@/components/Modal';
import { Field, TextInput } from '@/components/FormControls';
import { LoadingSpinner, EmptyState, ErrorState } from '@/components/States';
import { DoctorService } from '@/lib/service/services';
import { DoctorDTO, NewDoctor } from '@/lib/model/types';

const emptyForm: NewDoctor = {
  doctorCode: '',
  name: '',
  specialization: '',
  department: '',
  phone: '',
  email: '',
  experience: 0,
};

export function Doctors() {
  const [doctors, setDoctors] = useState<DoctorDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<NewDoctor>(emptyForm);
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const data = await DoctorService.getAll();
      setDoctors(data);
      setError('');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load doctors');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const openAdd = async () => {
    setEditingId(null);
    const code = await DoctorService.nextCode();
    setForm({ ...emptyForm, doctorCode: code });
    setFormError('');
    setModalOpen(true);
  };

  const openEdit = (d: DoctorDTO) => {
    setEditingId(d.id);
    setForm({
      doctorCode: d.doctorCode,
      name: d.name,
      specialization: d.specialization,
      department: d.department,
      phone: d.phone,
      email: d.email,
      experience: d.experience,
    });
    setFormError('');
    setModalOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    setFormError('');
    try {
      if (editingId) {
        await DoctorService.update(editingId, form);
      } else {
        await DoctorService.create(form);
      }
      setModalOpen(false);
      await load();
    } catch (e) {
      setFormError(e instanceof Error ? e.message : 'Failed to save doctor');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this doctor? Their appointments will also be removed.')) return;
    try {
      await DoctorService.delete(id);
      await load();
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Failed to delete doctor');
    }
  };

  const filtered = DoctorService.search(doctors, search);

  return (
    <div>
      <PageHeader
        title="Doctor Management"
        subtitle="Add, view, search, edit and delete doctor records"
        action={
          <Button onClick={openAdd}>
            <Plus size={18} />
            Add Doctor
          </Button>
        }
      />

      <div className="mb-5">
        <SearchBar value={search} onChange={setSearch} placeholder="Search by name, ID, specialization, department..." />
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
        {loading ? (
          <LoadingSpinner label="Loading doctors..." />
        ) : error ? (
          <ErrorState message={error} />
        ) : filtered.length === 0 ? (
          <EmptyState message="No doctors found" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                  <th className="px-5 py-3.5 font-semibold">Doctor ID</th>
                  <th className="px-5 py-3.5 font-semibold">Name</th>
                  <th className="px-5 py-3.5 font-semibold">Specialization</th>
                  <th className="px-5 py-3.5 font-semibold">Department</th>
                  <th className="px-5 py-3.5 font-semibold">Contact</th>
                  <th className="px-5 py-3.5 font-semibold">Experience</th>
                  <th className="px-5 py-3.5 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map((d) => (
                  <tr key={d.id} className="transition-colors hover:bg-sky-50/40">
                    <td className="px-5 py-4">
                      <span className="rounded-md bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-700">
                        {d.doctorCode}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
                          {d.name.replace('Dr. ', '').charAt(0)}
                        </div>
                        <span className="font-medium text-slate-800">{d.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-1 text-slate-600">
                        <Award size={14} className="text-blue-400" />
                        {d.specialization}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-1 text-slate-600">
                        <Briefcase size={14} className="text-slate-400" />
                        {d.department}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex flex-col gap-0.5 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <Phone size={12} /> {d.phone}
                        </span>
                        {d.email && (
                          <span className="flex items-center gap-1">
                            <Mail size={12} /> {d.email}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="font-medium text-slate-700">{d.experience}</span>
                      <span className="text-xs text-slate-400"> yrs</span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEdit(d)}
                          className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-sky-50 hover:text-sky-600"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(d.id)}
                          className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {!loading && !error && filtered.length > 0 && (
        <p className="mt-3 text-xs text-slate-400">
          Showing {filtered.length} of {doctors.length} doctors
        </p>
      )}

      <Modal
        open={modalOpen}
        title={editingId ? 'Edit Doctor' : 'Add New Doctor'}
        onClose={() => setModalOpen(false)}
        maxWidth="max-w-2xl"
      >
        {formError && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {formError}
          </div>
        )}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Doctor ID" required>
            <TextInput value={form.doctorCode} disabled className="bg-slate-50" />
          </Field>
          <Field label="Full Name" required>
            <TextInput
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Dr. Jane Doe"
            />
          </Field>
          <Field label="Specialization" required>
            <TextInput
              value={form.specialization}
              onChange={(e) => setForm({ ...form, specialization: e.target.value })}
              placeholder="e.g. Cardiology"
            />
          </Field>
          <Field label="Department" required>
            <TextInput
              value={form.department}
              onChange={(e) => setForm({ ...form, department: e.target.value })}
              placeholder="e.g. Cardiology"
            />
          </Field>
          <Field label="Phone" required>
            <TextInput
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="+1-555-0200"
            />
          </Field>
          <Field label="Email">
            <TextInput
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="doctor@hospital.com"
            />
          </Field>
          <Field label="Experience (years)" required>
            <TextInput
              type="number"
              value={form.experience || ''}
              onChange={(e) => setForm({ ...form, experience: parseInt(e.target.value) || 0 })}
            />
          </Field>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="secondary" onClick={() => setModalOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : editingId ? 'Update Doctor' : 'Add Doctor'}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
