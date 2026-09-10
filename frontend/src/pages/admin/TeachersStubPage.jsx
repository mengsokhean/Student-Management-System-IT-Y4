import React, { useState, useEffect, useCallback } from 'react';
import api from '../../lib/axios';
import DebouncedSearchInput from '../../components/common/DebouncedSearchInput';
import Pagination from '../../components/common/Pagination';

export default function TeachersStubPage() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [pagination, setPagination] = useState({
    currentPage: 1,
    lastPage: 1,
    total: 0,
    from: 0,
    to: 0,
  });

  const fetchTeachers = useCallback(async (searchQuery = '', page = 1) => {
    setLoading(true);
    try {
      const response = await api.get('/admin/teachers', {
        params: {
          search: searchQuery,
          page: page,
        },
      });

      const data = response.data;
      if (data && data.data) {
        setTeachers(data.data);
        setPagination({
          currentPage: data.current_page || 1,
          lastPage: data.last_page || 1,
          total: data.total || 0,
          from: data.from || 0,
          to: data.to || 0,
        });
      } else if (Array.isArray(data)) {
        setTeachers(data);
        setPagination({
          currentPage: 1,
          lastPage: 1,
          total: data.length,
          from: 1,
          to: data.length,
        });
      }
    } catch (err) {
      console.error('Error loading teachers:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTeachers(search, pagination.currentPage);
  }, [search, pagination.currentPage, fetchTeachers]);

  const handleSearchChange = (val) => {
    setSearch(val);
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, currentPage: newPage }));
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Teachers Management</h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage faculty records with real-time search and pagination.
          </p>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        {/* Toolbar & Debounced Search Input */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700 text-sm">Faculty List</span>
            <span className="bg-indigo-50 text-indigo-700 text-xs font-medium px-2.5 py-0.5 rounded-full border border-indigo-100">
              {pagination.total} Total
            </span>
            {search && (
              <span className="text-xs text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full">
                Filtered: &ldquo;{search}&rdquo;
              </span>
            )}
          </div>

          {/* Debounced Search Input */}
          <div className="w-full sm:w-72">
            <DebouncedSearchInput
              value={search}
              onChange={handleSearchChange}
              placeholder="Search by code, name, email..."
              debounceTime={350}
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase font-semibold text-slate-500 tracking-wider">
              <tr>
                <th className="px-6 py-3.5">Code</th>
                <th className="px-6 py-3.5">Khmer Name</th>
                <th className="px-6 py-3.5">English Name</th>
                <th className="px-6 py-3.5">Gender</th>
                <th className="px-6 py-3.5">Email</th>
                <th className="px-6 py-3.5">Phone</th>
                <th className="px-6 py-3.5 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-slate-400">
                    <div className="inline-flex items-center gap-2 text-sm">
                      <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                      <span>Loading teachers...</span>
                    </div>
                  </td>
                </tr>
              ) : teachers.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-slate-400">
                    <p className="text-base font-medium text-slate-600">No teachers found</p>
                    <p className="text-xs text-slate-400 mt-1">
                      {search ? 'Try adjusting your search terms.' : 'No teachers registered yet.'}
                    </p>
                  </td>
                </tr>
              ) : (
                teachers.map((teacher) => (
                  <tr key={teacher.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4 font-mono font-medium text-indigo-600 text-xs">
                      {teacher.teacher_code}
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-800">
                      {teacher.name_kh || '-'}
                    </td>
                    <td className="px-6 py-4 text-slate-700">
                      {teacher.name_en || '-'}
                    </td>
                    <td className="px-6 py-4 capitalize text-xs">
                      {teacher.gender === 'female' ? (
                        <span className="text-pink-600 bg-pink-50 px-2 py-0.5 rounded-md font-medium">Female</span>
                      ) : (
                        <span className="text-sky-600 bg-sky-50 px-2 py-0.5 rounded-md font-medium">Male</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-slate-600 text-xs">
                      {teacher.user?.email || '-'}
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-slate-500">
                      {teacher.phone || '-'}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {teacher.user?.is_active ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                          Inactive
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Reusable Pagination */}
        <Pagination
          currentPage={pagination.currentPage}
          lastPage={pagination.lastPage}
          total={pagination.total}
          from={pagination.from}
          to={pagination.to}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}
