import React, { useState, useEffect, useCallback } from 'react';
import api from '../../lib/axios';
import DebouncedSearchInput from '../../components/common/DebouncedSearchInput';
import Pagination from '../../components/common/Pagination';

export default function ClassesStubPage() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [pagination, setPagination] = useState({
    currentPage: 1,
    lastPage: 1,
    total: 0,
    from: 0,
    to: 0,
  });

  const fetchClasses = useCallback(async (searchQuery = '', page = 1) => {
    setLoading(true);
    try {
      const response = await api.get('/admin/classes', {
        params: {
          search: searchQuery,
          page: page,
        },
      });

      const data = response.data;
      if (data && data.data) {
        setClasses(data.data);
        setPagination({
          currentPage: data.current_page || 1,
          lastPage: data.last_page || 1,
          total: data.total || 0,
          from: data.from || 0,
          to: data.to || 0,
        });
      } else if (Array.isArray(data)) {
        setClasses(data);
        setPagination({
          currentPage: 1,
          lastPage: 1,
          total: data.length,
          from: 1,
          to: data.length,
        });
      }
    } catch (err) {
      console.error('Error loading classes:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClasses(search, pagination.currentPage);
  }, [search, pagination.currentPage, fetchClasses]);

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
          <h1 className="text-2xl font-bold text-slate-800">Classes Management</h1>
          <p className="text-sm text-slate-500 mt-1">
            Browse and filter academic classrooms with debounced search and pagination.
          </p>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        {/* Toolbar & Debounced Search Input */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700 text-sm">Classrooms List</span>
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
              placeholder="Search by class, grade, year..."
              debounceTime={350}
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase font-semibold text-slate-500 tracking-wider">
              <tr>
                <th className="px-6 py-3.5">Class Name</th>
                <th className="px-6 py-3.5">Grade Level</th>
                <th className="px-6 py-3.5">Track / Stream</th>
                <th className="px-6 py-3.5">Academic Year</th>
                <th className="px-6 py-3.5">Homeroom Teacher</th>
                <th className="px-6 py-3.5 text-center">Enrolled Students</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-slate-400">
                    <div className="inline-flex items-center gap-2 text-sm">
                      <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                      <span>Loading classrooms...</span>
                    </div>
                  </td>
                </tr>
              ) : classes.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-slate-400">
                    <p className="text-base font-medium text-slate-600">No classes found</p>
                    <p className="text-xs text-slate-400 mt-1">
                      {search ? 'Try adjusting your search criteria.' : 'No classrooms added yet.'}
                    </p>
                  </td>
                </tr>
              ) : (
                classes.map((cls) => {
                  const teacherName =
                    cls.homeroom_teacher?.teacher_profile?.name_en ||
                    cls.homeroom_teacher?.teacher_profile?.name_kh ||
                    '-';

                  return (
                    <tr key={cls.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-6 py-4 font-semibold text-slate-800">
                        {cls.name}
                      </td>
                      <td className="px-6 py-4 text-slate-700">
                        {cls.grade?.name || `Grade ${cls.grade?.level || '-'}`}
                      </td>
                      <td className="px-6 py-4 text-xs">
                        {cls.track === 'science' ? (
                          <span className="bg-teal-50 text-teal-700 font-medium px-2.5 py-0.5 rounded-full border border-teal-200">
                            Science
                          </span>
                        ) : cls.track === 'social_science' ? (
                          <span className="bg-amber-50 text-amber-700 font-medium px-2.5 py-0.5 rounded-full border border-amber-200">
                            Social Science
                          </span>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-slate-600 text-xs">
                        {cls.academic_year?.name || '-'}
                      </td>
                      <td className="px-6 py-4 text-slate-700 text-xs font-medium">
                        {teacherName}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
                          {cls.students_count ?? 0} Students
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
