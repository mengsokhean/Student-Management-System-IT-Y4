import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../../lib/axios'; // Or '../../api' depending on what we decided, let's use lib/axios

export default function AttendancePage() {
  const [activeTab, setActiveTab] = useState('daily'); // 'daily' or 'report'
  const [classrooms, setClassrooms] = useState([]);
  
  // Daily Form State
  const [selectedClassId, setSelectedClassId] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({}); // { student_id: { status: 'present', note: '' } }
  const [loading, setLoading] = useState(false);

  // Report State
  const [reportMonth, setReportMonth] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  });
  const [reportData, setReportData] = useState([]);
  const [loadingReport, setLoadingReport] = useState(false);

  useEffect(() => {
    fetchClassrooms();
  }, []);

  const fetchClassrooms = async () => {
    try {
      const res = await api.get('/admin/attendance/classrooms');
      setClassrooms(res.data);
      if (res.data.length > 0) {
        setSelectedClassId(res.data[0].id);
      }
    } catch (error) {
      // error handled by interceptor
    }
  };

  useEffect(() => {
    if (activeTab === 'daily' && selectedClassId && date) {
      fetchStudents();
    }
  }, [activeTab, selectedClassId, date]);

  useEffect(() => {
    if (activeTab === 'report' && selectedClassId && reportMonth) {
      fetchReport();
    }
  }, [activeTab, selectedClassId, reportMonth]);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/attendance/students', {
        params: { classroom_id: selectedClassId, date }
      });
      setStudents(res.data.students);
      
      // Initialize attendance state with existing records or default to 'present'
      const initialAttendance = {};
      res.data.students.forEach(student => {
        const existing = res.data.attendance[student.id];
        initialAttendance[student.id] = {
          status: existing ? existing.status : 'present',
          note: existing ? existing.note || '' : ''
        };
      });
      setAttendance(initialAttendance);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const fetchReport = async () => {
    setLoadingReport(true);
    try {
      const res = await api.get('/admin/attendance/report', {
        params: { classroom_id: selectedClassId, month: reportMonth }
      });
      setReportData(res.data.report);
    } catch (error) {
    } finally {
      setLoadingReport(false);
    }
  };

  const handleStatusChange = (studentId, status) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: { ...prev[studentId], status }
    }));
  };

  const handleNoteChange = (studentId, note) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: { ...prev[studentId], note }
    }));
  };

  const handleSaveAttendance = async () => {
    try {
      await api.post('/admin/attendance/bulk', {
        classroom_id: selectedClassId,
        date,
        attendance
      });
      toast.success('Attendance saved successfully!');
    } catch (error) {
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto font-sans">
      <h1 className="text-2xl font-bold mb-6">Attendance Management</h1>
      
      <div className="mb-6 flex space-x-4 border-b border-gray-200">
        <button 
          onClick={() => setActiveTab('daily')}
          className={`py-2 px-4 border-b-2 font-medium ${activeTab === 'daily' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
          Daily Attendance
        </button>
        <button 
          onClick={() => setActiveTab('report')}
          className={`py-2 px-4 border-b-2 font-medium ${activeTab === 'report' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
          Monthly Report
        </button>
      </div>

      <div className="mb-6 flex items-center space-x-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Classroom</label>
          <select 
            className="border-gray-300 rounded-md shadow-sm border p-2 focus:ring-blue-500 focus:border-blue-500"
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(e.target.value)}
          >
            {classrooms.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        
        {activeTab === 'daily' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input 
              type="date" 
              className="border-gray-300 rounded-md shadow-sm border p-2 focus:ring-blue-500 focus:border-blue-500"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
        )}

        {activeTab === 'report' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Month</label>
            <input 
              type="month" 
              className="border-gray-300 rounded-md shadow-sm border p-2 focus:ring-blue-500 focus:border-blue-500"
              value={reportMonth}
              onChange={(e) => setReportMonth(e.target.value)}
            />
          </div>
        )}
      </div>

      {activeTab === 'daily' && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {loading ? (
            <div className="p-6 text-center text-gray-500">Loading students...</div>
          ) : students.length === 0 ? (
            <div className="p-6 text-center text-gray-500">No students found in this class.</div>
          ) : (
            <>
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name (EN)</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Note</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {students.map(student => (
                    <tr key={student.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.student_code}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{student.name_en}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex space-x-3">
                          {['present', 'absent', 'late', 'leave'].map(status => (
                            <label key={status} className="flex items-center space-x-1 cursor-pointer">
                              <input 
                                type="radio" 
                                name={`status_${student.id}`} 
                                value={status}
                                checked={attendance[student.id]?.status === status}
                                onChange={() => handleStatusChange(student.id, status)}
                                className="text-blue-600 focus:ring-blue-500"
                              />
                              <span className="capitalize">{status}</span>
                            </label>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <input 
                          type="text" 
                          placeholder="Optional note" 
                          className="border-gray-300 rounded-md shadow-sm border p-1 text-sm focus:ring-blue-500 focus:border-blue-500 w-full"
                          value={attendance[student.id]?.note || ''}
                          onChange={(e) => handleNoteChange(student.id, e.target.value)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-end">
                <button 
                  onClick={handleSaveAttendance}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                >
                  Save Attendance
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {activeTab === 'report' && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {loadingReport ? (
            <div className="p-6 text-center text-gray-500">Loading report...</div>
          ) : reportData.length === 0 ? (
            <div className="p-6 text-center text-gray-500">No data available.</div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name (EN)</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Total Days</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-green-600 uppercase tracking-wider">Present</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-yellow-600 uppercase tracking-wider">Late</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-red-600 uppercase tracking-wider">Absent</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-purple-600 uppercase tracking-wider">Leave</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-blue-600 uppercase tracking-wider">Attendance %</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reportData.map(row => (
                  <tr key={row.student_id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.student_code}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{row.name_en}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">{row.total}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">{row.present}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">{row.late}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">{row.absent}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">{row.leave}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        row.percentage >= 90 ? 'bg-green-100 text-green-800' :
                        row.percentage >= 75 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {row.percentage}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
