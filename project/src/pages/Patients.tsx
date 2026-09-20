import { useEffect, useState, useCallback } from 'react';
import { Plus, Pencil, Trash2, Users, Phone, Mail, Droplet } from 'lucide-react';
import { PageHeader } from '@/components/Layout';
import { SearchBar } from '@/components/SearchBar';
import { Button } from '@/components/Button';
import { Modal } from '@/components/Modal';
import { Field, TextInput, Select, TextArea } from '@/components/FormControls';
import { LoadingSpinner, EmptyState, ErrorState } from '@/components/States';
import { PatientService } from '@/lib/service/services';
import { PatientDTO, NewPatient, Gender, BloodGroup } from '@/lib/model/types';

const genders: Gender[] = ['Male', 'Female', 'Other'];
const bloodGroups: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const emptyForm: NewPatient = {
  patientCode: '',
  name: '',
  age: 0,
  gender: 'Male',
  phone: '',
  email: '',
  address: '',
  bloodGroup: 'O+',
  medicalCondition: '',
};

export function Patients() {
  const [patients, setPatients] = useState<PatientDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<NewPatient>(emptyForm);
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const data = await PatientService.getAll();
      setPatients(data);
      setError('');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load patients');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const openAdd = async () => {
    setEditingId(null);
    const code = await PatientService.nextCode();
    setForm({ ...emptyForm, patientCode: code });
    setFormError('');
    setModalOpen(true);
  };

  const openEdit = (p: PatientDTO) => {
    setEditingId(p.id);
    setForm({
      patientCode: p.patientCode,
      name: p.name,
      age: p.age,
      gender: p.gender,
      phone: p.phone,
      email: p.email,
      address: p.address,
      bloodGroup: p.bloodGroup,
      medicalCondition: p.medicalCondition,
    });
    setFormError('');
    setModalOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    setFormError('');
    try {
      if (editingId) {
        await PatientService.update(editingId, form);
      } else {
        await PatientService.create(form);
      }
      setModalOpen(false);
      await load();
    } catch (e) {
      setFormError(e instanceof Error ? e.message : 'Failed to save patient');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this patient? Their appointments will also be removed.')) return;
    try {
      await PatientService.delete(id);
      await load();
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Failed to delete patient');
    }
  };

  const filtered = PatientService.search(patients, search);

  return (
    <div>
      <PageHeader
        title="Patient Management"
        subtitle="Add, view, search, edit and delete patient records"
        action={
          <Button onClick={openAdd}>
            <Plus size={18} />
            Add Patient
          </Button>
        }
      />

      <div className="mb-5">
        <SearchBar value={search} onChange={setSearch} placeholder="Search by name, ID, phone, condition..." />
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
        {loading ? (
          <LoadingSpinner label="Loading patients..." />
        ) : error ? (
          <ErrorState message={error} />
        ) : filtered.length === 0 ? (
          <EmptyState message="No patients found" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                  <th className="px-5 py-3.5 font-semibold">Patient ID</th>
                  <th className="px-5 py-3.5 font-semibold">Name</th>
                  <th className="px-5 py-3.5 font-semibold">Age</th>
                  <th className="px-5 py-3.5 font-semibold">Gender</th>
                  <th className="px-5 py-3.5 font-semibold">Contact</th>
                  <th className="px-5 py-3.5 font-semibold">Blood</th>
                  <th className="px-5 py-3.5 font-semibold">Condition</th>
                  <th className="px-5 py-3.5 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map((p) => (
                  <tr key={p.id} className="transition-colors hover:bg-sky-50/40">
                    <td className="px-5 py-4">
                      <span className="rounded-md bg-sky-50 px-2 py-1 text-xs font-semibold text-sky-700">
                        {p.patientCode}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-600">
                          {p.name.charAt(0)}
                        </div>
                        <span className="font-medium text-slate-800">{p.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-slate-600">{p.age}</td>
                    <td className="px-5 py-4 text-slate-600">{p.gender}</td>
                    <td className="px-5 py-4">
                      <div className="flex flex-col gap-0.5 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <Phone size={12} /> {p.phone}
                        </span>
                        {p.email && (
                          <span className="flex items-center gap-1">
                            <Mail size={12} /> {p.email}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-600">
                        <Droplet size={12} className="text-red-400" />
                        {p.bloodGroup}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-slate-600">{p.medicalCondition || '—'}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEdit(p)}
                          className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-sky-50 hover:text-sky-600"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
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
          Showing {filtered.length} of {patients.length} patients
        </p>
      )}

      <Modal
        open={modalOpen}
        title={editingId ? 'Edit Patient' : 'Add New Patient'}
        onClose={() => setModalOpen(false)}
        maxWidth="max-w-2xl"
      >
        {formError && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {formError}
          </div>
        )}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Patient ID" required>
            <TextInput value={form.patientCode} disabled className="bg-slate-50" />
          </Field>
          <Field label="Full Name" required>
            <TextInput
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. John Carter"
            />
          </Field>
          <Field label="Age" required>
            <TextInput
              type="number"
              value={form.age || ''}
              onChange={(e) => setForm({ ...form, age: parseInt(e.target.value) || 0 })}
            />
          </Field>
          <Field label="Gender" required>
            <Select value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value as Gender })}>
              {genders.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Phone" required>
            <TextInput
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="+1-555-0100"
            />
          </Field>
          <Field label="Email">
            <TextInput
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="patient@email.com"
            />
          </Field>
          <Field label="Blood Group">
            <Select
              value={form.bloodGroup}
              onChange={(e) => setForm({ ...form, bloodGroup: e.target.value as BloodGroup })}
            >
              {bloodGroups.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Medical Condition">
            <TextInput
              value={form.medicalCondition}
              onChange={(e) => setForm({ ...form, medicalCondition: e.target.value })}
              placeholder="e.g. Hypertension"
            />
          </Field>
          <div className="sm:col-span-2">
            <Field label="Address">
              <TextArea
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                placeholder="Street, City, State"
              />
            </Field>
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="secondary" onClick={() => setModalOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : editingId ? 'Update Patient' : 'Add Patient'}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
