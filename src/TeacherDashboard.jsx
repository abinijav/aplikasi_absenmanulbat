import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

// --- KONFIGURASI SUPABASE ---
// Ganti dengan URL dan Anon Key asli dari dashboard Supabase Anda
const supabaseUrl = 'https://xyzcompany.supabase.co'; 
const supabaseKey = 'public-anon-key';
const supabase = createClient(supabaseUrl, supabaseKey);

const TeacherDashboard = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fungsi ambil data
  const fetchAbsensi = async () => {
    try {
      setLoading(true);
      // Sesuaikan nama tabel 'absensi' dengan nama tabel Anda di Supabase
      let { data, error } = await supabase
        .from('absensi') 
        .select('*')
        // Filter: Hanya ambil yang role-nya siswa (jika ada kolom role)
        // .eq('role', 'siswa') 
        .order('created_at', { ascending: false }); // Urutkan dari yang terbaru

      if (error) throw error;
      if (data) setStudents(data);
      
    } catch (error) {
      console.error("Error mengambil data:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAbsensi();
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Laporan Kehadiran Siswa</h1>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-gray-600 uppercase">Nama</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-600 uppercase">Status</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-600 uppercase">Jam Masuk</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-600 uppercase">Lokasi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr><td colSpan="4" className="text-center py-4">Sedang memuat data...</td></tr>
            ) : students.length === 0 ? (
              <tr><td colSpan="4" className="text-center py-4">Belum ada data absensi.</td></tr>
            ) : (
              students.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50">
                  {/* Sesuaikan nama field di bawah dengan kolom Supabase Anda */}
                  <td className="px-6 py-4 font-medium text-gray-900">{student.nama}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                      student.status === 'Hadir' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {student.status || 'Alpha'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500">{student.jam_masuk || '-'}</td>
                  <td className="px-6 py-4 text-blue-600 cursor-pointer">Lihat Lokasi</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TeacherDashboard;