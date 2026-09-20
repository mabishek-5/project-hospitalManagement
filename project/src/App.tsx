import { useState } from 'react';
import { Layout, Page } from '@/components/Layout';
import { Dashboard } from '@/pages/Dashboard';
import { Patients } from '@/pages/Patients';
import { Doctors } from '@/pages/Doctors';
import { Appointments } from '@/pages/Appointments';

function App() {
  const [page, setPage] = useState<Page>('dashboard');

  return (
    <Layout current={page} onNavigate={setPage}>
      {page === 'dashboard' && <Dashboard onNavigate={setPage} />}
      {page === 'patients' && <Patients />}
      {page === 'doctors' && <Doctors />}
      {page === 'appointments' && <Appointments />}
    </Layout>
  );
}

export default App;
