import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import DoctorCard from '../components/DoctorCard'
import Loader from '../components/Loader'
import Footer from '../components/Footer'
import Chatbot from '../components/Chatbot'

const departments = [
  'All', 'Cardiology', 'Neurology', 'Orthopedics',
  'Pediatrics', 'General Medicine', 'Dental',
  'Ophthalmology', 'Dermatology'
]

const DoctorsList = () => {

  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [page, setPage] = useState(1);
  const limit = 10; 
  const [total, setTotal] = useState(0);

  const API_BASE_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/doctors?page=${page}&limit=${limit}`);
        const data = await res.json();
        if (res.ok) {
          setDoctors(data.doctors);
          setTotal(data.total || 0);
        }
      } catch (error) {
        console.log('Error fetching doctors:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, [page]);

  const filtered = doctors.filter(doc => {
    const matchDept = selectedDept === 'All' || doc.department === selectedDept;
    const matchSearch = doc.userId?.name?.toLowerCase().includes(search.toLowerCase()) ||
      doc.specialization?.toLowerCase().includes(search.toLowerCase());
    return matchDept && matchSearch;
  });

  const totalPages = Math.ceil(total / limit);

  if (loading) return <Loader />;

  return (
    <div>
      <Navbar />

      <div className='bg-white border-b border-gray-100 py-8 px-4'>
        <div className='max-w-7xl mx-auto'>
          <h1 className='text-3xl font-bold text-gray-900 mb-2'>Our Doctors</h1>
          <p className='text-gray-500'>Find and book appointments with our specialists</p>

          <div className='mt-5 max-w-md'>
            <input
              type='text'
              placeholder='Search by name or specialization...'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className='w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-teal-500 transition-all'
            />
          </div>
        </div>
      </div>

      <div className='max-w-7xl mx-auto px-4 py-8'>

        <div className='flex flex-wrap gap-2 mb-8'>
          {departments.map(dept => (
            <button
              key={dept}
              onClick={() => setSelectedDept(dept)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border ${
                selectedDept === dept
                  ? 'bg-teal-600 text-white border-teal-600'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-teal-400'
              }`}
            >
              {dept}
            </button>
          ))}
        </div>

        <p className='text-sm text-gray-500 mb-5'>
          {filtered.length} doctor{filtered.length !== 1 ? 's' : ''} found
        </p>

        {filtered.length === 0 ? (
          <div className='text-center py-20'>
            <p className='text-4xl mb-3'>👨‍⚕️</p>
            <p className='text-gray-500'>No doctors found</p>
          </div>
        ) : (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5'>
            {filtered.map(doctor => (
              <DoctorCard key={doctor._id} doctor={doctor} />
            ))}
          </div>
        )}

        {}
        <div className='flex justify-center items-center gap-4 mt-8'>
          <button
            onClick={() => setPage(prev => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className='px-4 py-2 bg-teal-600 text-white rounded disabled:opacity-50'
          >
            Previous
          </button>
          <span className='text-gray-700'>Page {page} of {totalPages || 1}</span>
          <button
            onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
            disabled={page === totalPages || totalPages === 0}
            className='px-4 py-2 bg-teal-600 text-white rounded disabled:opacity-50'
          >
            Next
          </button>
        </div>

      </div>
      <Footer />
      <Chatbot />
    </div>
  );
};

export default DoctorsList
