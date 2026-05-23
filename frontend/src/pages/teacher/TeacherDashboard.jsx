import { useEffect, useState } from 'react'
import api from '../../lib/axios'
import useAuthStore from '../../store/authStore'

export default function TeacherDashboard() {
  const { user } = useAuthStore()
  const [data, setData]     = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/teacher/my-classrooms')
      .then(r => setData(r.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-3 text-gray-400">
          <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg"
            fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10"
              stroke="currentColor" strokeWidth="4"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
          </svg>
          <span className="text-sm">កំពុងផ្ទុក...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-5">

      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-700 to-indigo-600 rounded-xl p-5
                      flex items-center gap-4 text-white shadow-sm">
        <div className="w-14 h-14 bg-white bg-opacity-20 rounded-xl
                        flex items-center justify-center flex-shrink-0">
          <span className="material-icons text-white text-3xl">person</span>
        </div>
        <div>
          <p className="text-blue-100 text-sm">សូមស្វាគមន៍</p>
          <p className="text-xl font-bold">{user?.name}</p>
          <p className="text-blue-200 text-xs mt-0.5">គ្រូបង្រៀន · ប្រព័ន្ធគ្រប់គ្រងសិស្ស</p>
        </div>
      </div>

      {/* Homeroom Card */}
      {data?.homeroom ? (
        <div className="card border-l-4 border-blue-500">
          <div className="card-header">
            <div className="flex items-center gap-2">
              <span className="material-icons text-blue-600 text-xl">home</span>
              <h3 className="font-bold text-gray-800 text-sm">ថ្នាក់ Homeroom</h3>
            </div>
            <span className="badge badge-blue">Homeroom</span>
          </div>
          <div className="card-body">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <span className="material-icons text-blue-600 text-2xl">meeting_room</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{data.homeroom.name}</p>
                <p className="text-gray-500 text-sm">{data.homeroom.grade?.name}</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="card border-l-4 border-yellow-400">
          <div className="card-body flex items-center gap-3">
            <span className="material-icons text-yellow-500 text-xl">warning_amber</span>
            <p className="text-sm text-gray-600">អ្នកមិនទាន់ត្រូវបានចាត់តាំងជា Homeroom Teacher នៅឡើយ</p>
          </div>
        </div>
      )}

      {/* Subject Assignments */}
      <div className="card">
        <div className="card-header">
          <div className="flex items-center gap-2">
            <span className="material-icons text-purple-600 text-xl">menu_book</span>
            <h3 className="font-bold text-gray-800 text-sm">ថ្នាក់ដែលខ្ញុំបង្រៀន</h3>
          </div>
          <span className="badge badge-purple">
            {data?.classrooms?.length ?? 0} ថ្នាក់
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="table-th">#</th>
                <th className="table-th">ថ្នាក់</th>
                <th className="table-th">ថ្នាក់ទី</th>
                <th className="table-th">មុខវិជ្ជា</th>
              </tr>
            </thead>
            <tbody>
              {(!data?.classrooms || data.classrooms.length === 0) && (
                <tr>
                  <td colSpan={4} className="table-td text-center text-gray-400 py-8">
                    <span className="material-icons text-3xl block mb-2 text-gray-300">
                      menu_book
                    </span>
                    មិនទាន់មានថ្នាក់
                  </td>
                </tr>
              )}
              {data?.classrooms?.map((item, i) => (
                <tr key={i} className="table-tr-hover">
                  <td className="table-td text-gray-400 text-xs w-10">{i + 1}</td>
                  <td className="table-td font-bold text-gray-800">
                    {item.classroom?.name}
                  </td>
                  <td className="table-td">
                    <span className="badge badge-blue">{item.classroom?.grade?.name}</span>
                  </td>
                  <td className="table-td">
                    <div className="flex flex-wrap gap-1">
                      {item.subjects?.map(s => (
                        <span key={s.id} className="badge badge-green">{s.name_kh}</span>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <a href="/teacher/attendance"
          className="card p-5 flex items-center gap-4 hover:shadow-md
                     transition-shadow cursor-pointer group">
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center
                          justify-center group-hover:bg-green-200 transition-colors">
            <span className="material-icons text-green-600 text-2xl">fact_check</span>
          </div>
          <div>
            <p className="font-bold text-gray-800">ចុះវត្តមាន</p>
            <p className="text-xs text-gray-500">ប្រចាំថ្ងៃ</p>
          </div>
        </a>
        <a href="/teacher/scores"
          className="card p-5 flex items-center gap-4 hover:shadow-md
                     transition-shadow cursor-pointer group">
          <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center
                          justify-center group-hover:bg-orange-200 transition-colors">
            <span className="material-icons text-orange-600 text-2xl">grade</span>
          </div>
          <div>
            <p className="font-bold text-gray-800">បញ្ចូលពិន្ទុ</p>
            <p className="text-xs text-gray-500">ប្រចាំខែ / សោធន</p>
          </div>
        </a>
      </div>

    </div>
  )
}