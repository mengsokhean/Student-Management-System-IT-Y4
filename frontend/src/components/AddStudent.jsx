import React, { useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

function AddStudent() {
    const [formData, setFormData] = useState({
        student_code: '',
        name_khmer: '',
        gender: 'ប្រុស',
        class: '',
        phone: ''
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/students', formData);
            toast.success('បញ្ចូលទិន្នន័យសិស្សបានជោគជ័យ!');
            navigate('/');
        } catch (error) {
            console.error("Error adding student:", error);
        }
    };

    return (
        <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md mt-6">
            <h2 className="text-xl font-bold mb-4 text-gray-800">បន្ថែមព័ត៌មានសិស្សថ្មី</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">អត្តលេខ</label>
                    <input type="text" name="student_code" onChange={handleChange} required className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">ឈ្មោះខ្មែរ</label>
                    <input type="text" name="name_khmer" onChange={handleChange} required className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">ភេទ</label>
                    <select name="gender" onChange={handleChange} className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none">
                        <option value="ប្រុស">ប្រុស</option>
                        <option value="ស្រី">ស្រី</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">ថ្នាក់រៀន</label>
                    <input type="text" name="class" onChange={handleChange} required className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">លេខទូរស័ព្ទ</label>
                    <input type="text" name="phone" onChange={handleChange} className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                </div>
                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-md transition">
                    រក្សាទុក
                </button>
            </form>
        </div>
    );
}

export default AddStudent;
