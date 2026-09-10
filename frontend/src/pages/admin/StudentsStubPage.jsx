import React, { useState, useEffect, useCallback } from 'react';
import api from '../../lib/axios';
import DebouncedSearchInput from '../../components/common/DebouncedSearchInput';
import Pagination from '../../components/common/Pagination';

export default function StudentsStubPage() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [pagination, setPagination] = useState({
    currentPage: 1,
    lastPage: 1,
    total: 0,
    from: 0,
    to: 0,
  });

  const fetchStudents = useCallback(async (searchQuery = '', page = 1) => {
    setLoading(true);
    try {
      const response = await api.get('/admin/students', {
        params: {
          search: searchQuery,
          page: page,
        },
      });

      const data = response.data;
      // Laravel paginate returns { data: [...], current_page, last_page, total, from, to }
      if (data && data.data) {
        setStudents(data.data);
        setPagination({
          currentPage: data.current_page || 1,
          lastPage: data.last_page || 1,
          total: data.total || 0,
          from: data.from || 0,
          to: data.to || 0,
        });
      } else if (Array.isArray(data)) {
        setStudents(data);
        setPagination({
          currentPage: 1,
          lastPage: 1,
          total: data.length,
          from: 1,
          to: data.length,
        });
      }
    } catch (err) {
      console.error('Error loading students:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch when search or pagination changes
  useEffect(() => {
    fetchStudents(search, pagination.currentPage);
  }, [search, pagination.currentPage, fetchStudents]);

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
          <h1 className="text-2xl font-bold text-slate-800">Students Management</h1>
          <p className="text-sm text-slate-500 mt-1">
            View, search, and paginate through enrolled student records.
          </p>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        {/* Table Toolbar & Debounced Search Input */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700 text-sm">Student List</span>
            <span className="bg-indigo-50 text-indigo-700 text-xs font-medium px-2.5 py-0.5 rounded-full border border-indigo-100">
              {pagination.total} Total
            </span>
            {search && (
              <span className="text-xs text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full">
                Filtered: &ldquo;{search}&rdquo;
              </span>
            )}
          </div>

          {/* Debounced Search Input above table */}
          <div className="w-full sm:w-72">
            <DebouncedSearchInput
              value={search}
              onChange={handleSearchChange}
              placeholder="Search by code, name, phone..."
              debounceTime={350}
            />
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase font-semibold text-slate-500 tracking-wider">
              <tr>
                <th className="px-6 py-3.5">Code</th>
                <th className="px-6 py-3.5">Khmer Name</th>
                <th className="px-6 py-3.5">English Name</th>
                <th className="px-6 py-3.5">Gender</th>
                <th className="px-6 py-3.5">Class</th>
                <th className="px-6 py-3.5">Guardian Phone</th>
                <th className="px-6 py-3.5 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-slate-400">
                    <div className="inline-flex items-center gap-2 text-sm">
                      <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                      <span>Loading students...</span>
                    </div>
                  </td>
                </tr>
              ) : students.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-slate-400">
                    <p className="text-base font-medium text-slate-600">No students found</p>
                    <p className="text-xs text-slate-400 mt-1">
                      {search ? 'Try clearing or changing your search term.' : 'No records registered yet.'}
                    </p>
                  </td>
                </tr>
              ) : (
                students.map((student) => {
                  const activeClass =
                    student.classrooms && student.classrooms.length > 0
                      ? student.classrooms[0].name
                      : '-';

                  return (
                    <tr key={student.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-6 py-4 font-mono font-medium text-indigo-600 text-xs">
                        {student.student_code}
                      </td>
                      <td className="px-6 py-4 font-medium text-slate-800">
                        {student.name_kh || '-'}
                      </td>
                      <td className="px-6 py-4 text-slate-700">
                        {student.name_en || '-'}
                      </td>
                      <td className="px-6 py-4 capitalize text-xs">
                        {student.gender === 'female' ? (
                          <span className="text-pink-600 bg-pink-50 px-2 py-0.5 rounded-md font-medium">Female</span>
                        ) : (
                          <span className="text-sky-600 bg-sky-50 px-2 py-0.5 rounded-md font-medium">Male</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-slate-600 text-xs font-medium">
                        {activeClass}
                      </td>
                      <td className="px-6 py-4 font-mono text-xs text-slate-500">
                        {student.guardian_phone || '-'}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                          Active
                        </span>
                      </td>
                    </tr>
                  );
                })
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
