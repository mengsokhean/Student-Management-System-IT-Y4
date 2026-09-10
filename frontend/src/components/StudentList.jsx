import React, { useEffect, useState } from 'react';
import api from '../api';

function StudentList() {
    const [students, setStudents] = useState([]);

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            const response = await api.get('/students');
            setStudents(response.data);
        } catch (error) {
            console.error("Error fetching students:", error);
        }
    };

    return (
        <div className="container mx-auto p-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">បញ្ជីឈ្មោះសិស្សានុសិស្ស</h2>
            <div className="overflow-x-auto shadow-md rounded-lg">
                <table className="min-w-full text-left text-sm text-gray-600 bg-white">
                    <thead className="bg-gray-800 text-white uppercase text-xs">
                        <tr>
                            <th className="px-6 py-3">អត្តលេខ</th>
                            <th className="px-6 py-3">ឈ្មោះខ្មែរ</th>
                            <th className="px-6 py-3">ភេទ</th>
                            <th className="px-6 py-3">ថ្នាក់រៀន</th>
                            <th className="px-6 py-3">លេខទូរស័ព្ទ</th>
                            <th className="px-6 py-3 text-center">សកម្មភាព</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {students.map((student) => (
                            <tr key={student.id} className="hover:bg-gray-50 transition">
                                <td className="px-6 py-4 font-medium text-gray-900">{student.student_code}</td>
                                <td className="px-6 py-4">{student.name_khmer}</td>
                                <td className="px-6 py-4">{student.gender}</td>
                                <td className="px-6 py-4">{student.class}</td>
                                <td className="px-6 py-4">{student.phone}</td>
                                <td className="px-6 py-4 text-center">
                                    <button className="bg-amber-500 hover:bg-amber-600 text-white px-3 py-1.5 rounded-md text-sm mr-2 transition">
                                        កែប្រែ
                                    </button>
                                    <button className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-md text-sm transition">
                                        លុប
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default StudentList;
