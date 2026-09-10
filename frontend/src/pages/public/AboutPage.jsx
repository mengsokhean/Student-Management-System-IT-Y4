export default function AboutPage() {
  const values = [
    { icon: 'auto_stories',   title: 'ការអប់រំ',   desc: 'ផ្ដោតលើការអប់រំដ៏ប្រកបដោយគុណភាព'     },
    { icon: 'emoji_events',   title: 'សមិទ្ធផល',  desc: 'លើកទឹកចិត្តសិស្សឱ្យសម្រេចខ្ពស់'       },
    { icon: 'handshake',      title: 'សហការ',      desc: 'ការគោរពគ្នាទៅវិញទៅមក ក្នុងសហគមន៍'    },
    { icon: 'psychology',     title: 'ការគិត',      desc: 'ពង្រឹងជំនាញគិតប្រកបដោយវិជ្ជមាន'      },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 py-20 space-y-12">
      {/* Hero */}
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          អំពី NIEI High School
        </h1>
        <p className="text-gray-500 text-lg leading-relaxed">
          NIEI High School ជាគ្រឹះស្ថានអប់រំ
          ផ្ដល់ការសិក្សាថ្នាក់ ១០ · ១១ · ១២
          ដំណើរការក្រោមការគ្រប់គ្រងក្រសួងអប់រំ
          យុវជន និងកីឡា (MoEYS) ។
        </p>
      </div>

      {/* Vision + Mission */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { icon: 'visibility',  title: 'បំណង', color: 'bg-slate-900',
            text: 'ក្លាយជាគ្រឹះស្ថានអប់រំដ៏ល្អបំផុតក្នុងខេត្ត ដោយផ្ដល់ការអប់រំ ប្រកបដោយប្រជាធិបតេយ្យ ទូលំទូលាយ ហើយបំពេញតម្រូវការ ក្នុងសង្គម។' },
          { icon: 'flag',        title: 'បេសកកម្ម', color: 'bg-blue-700',
            text: 'ផ្ដល់ការអប់រំ ស្របតាមបរិបទ ជាតិ ដើម្បីពង្រឹងចំណេះ ជំនាញ និងគុណធម៌ ជូនដល់សិស្ស សម្រាប់ ការរស់នៅ ការងារ និង ការបន្ត ការសិក្សា។' },
        ].map(item => (
          <div key={item.title}
            className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm
                       hover:-translate-y-1 hover:shadow-md transition-all duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-12 h-12 ${item.color} rounded-xl flex items-center
                              justify-center flex-shrink-0`}>
                <span className="material-icons text-white text-2xl">{item.icon}</span>
              </div>
              <h2 className="font-bold text-gray-800 text-xl">{item.title}</h2>
            </div>
            <p className="text-gray-600 leading-relaxed">{item.text}</p>
          </div>
        ))}
      </div>

      {/* Values */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
          គុណតម្លៃ
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {values.map(v => (
            <div key={v.title}
              className="bg-white rounded-2xl border border-slate-100 p-5 text-center
                         shadow-sm hover:-translate-y-1 hover:shadow-md
                         transition-all duration-300">
              <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center
                              justify-center mx-auto mb-3">
                <span className="material-icons text-slate-700 text-3xl">{v.icon}</span>
              </div>
              <p className="font-bold text-gray-800 mb-1">{v.title}</p>
              <p className="text-gray-500 text-xs">{v.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Track System */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          ប្រព័ន្ធ Track
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              grade: 'ថ្នាក់ទី ១០',
              track: 'ការអប់រំទូទៅ',
              color: 'bg-slate-800',
              accent: 'text-slate-300',
              dot: 'bg-slate-400',
              subjects: ['ភាសាខ្មែរ', 'ភាសាអង់គ្លេស', 'គណិតវិទ្យា', 'ប្រវត្តិ', 'ភូមិ', 'ពលរដ្ឋ'],
            },
            {
              grade: 'ថ្នាក់ទី ១១-១២',
              track: 'វិទ្យាសាស្ត្រពិត',
              color: 'bg-slate-900',
              accent: 'text-blue-300',
              dot: 'bg-blue-400',
              subjects: ['រូបវិទ្យា', 'គីមីវិទ្យា', 'ជីវវិទ្យា', 'គណិតជ្រៅ'],
            },
            {
              grade: 'ថ្នាក់ទី ១១-១២',
              track: 'វិទ្យាសាស្ត្រសង្គម',
              color: 'bg-amber-600',
              accent: 'text-amber-100',
              dot: 'bg-amber-200',
              subjects: ['ប្រវត្តិ', 'ភូមិ', 'ផែនដី', 'ពលរដ្ឋ'],
            },
          ].map(t => (
            <div key={t.track}
              className="rounded-xl overflow-hidden border border-slate-200 shadow-sm
                         hover:-translate-y-1 hover:shadow-md transition-all duration-300">
              <div className={`${t.color} px-5 py-4`}>
                <p className="text-white font-extrabold text-sm tracking-wide">{t.grade}</p>
                <p className={`${t.accent} text-xs mt-0.5 font-medium`}>{t.track}</p>
              </div>
              <div className="p-4 space-y-2 bg-white">
                {t.subjects.map(s => (
                  <div key={s} className="flex items-center gap-2.5 text-sm text-gray-600">
                    <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${t.dot}`} />
                    {s}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}