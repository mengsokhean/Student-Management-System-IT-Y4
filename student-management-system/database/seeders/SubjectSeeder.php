<?php

namespace Database\Seeders;

use App\Models\Grade;
use App\Models\GradeSubject;
use App\Models\Subject;
use Illuminate\Database\Seeder;

class SubjectSeeder extends Seeder
{
    public function run(): void
    {
        $grade10 = Grade::where('level', '10')->first();
        $grade11 = Grade::where('level', '11')->first();
        $grade12 = Grade::where('level', '12')->first();

        // មុខវិជ្ជាទូទៅ (grades 10, 11, 12 - no track)
        $commonSubjects = [
            ['name_kh' => 'ភាសាខ្មែរ',      'name_en' => 'Khmer',              'code' => 'KH'],
            ['name_kh' => 'ភាសាអង់គ្លេស',    'name_en' => 'English',            'code' => 'EN'],
            ['name_kh' => 'គណិតវិទ្យា',      'name_en' => 'Mathematics',        'code' => 'MATH'],
            ['name_kh' => 'ប្រវត្តិវិទ្យា',  'name_en' => 'History',            'code' => 'HIST'],
            ['name_kh' => 'ភូមិវិទ្យា',      'name_en' => 'Geography',          'code' => 'GEO'],
            ['name_kh' => 'ពលរដ្ឋវិទ្យា',   'name_en' => 'Civic Education',    'code' => 'CIVIC'],
            ['name_kh' => 'សីលធម៌',          'name_en' => 'Ethics',             'code' => 'ETHICS'],
            ['name_kh' => 'អប់រំកាយ',        'name_en' => 'Physical Education', 'code' => 'PE'],
        ];

        $scienceSubjects = [
            ['name_kh' => 'រូបវិទ្យា',  'name_en' => 'Physics',   'code' => 'PHY'],
            ['name_kh' => 'គីមីវិទ្យា', 'name_en' => 'Chemistry', 'code' => 'CHEM'],
            ['name_kh' => 'ជីវវិទ្យា',  'name_en' => 'Biology',   'code' => 'BIO'],
        ];

        $socialSubjects = [
            ['name_kh' => 'សេដ្ឋកិច្ច',        'name_en' => 'Economics',     'code' => 'ECON'],
            ['name_kh' => 'គណនេយ្យ',           'name_en' => 'Accounting',    'code' => 'ACC'],
            ['name_kh' => 'ភាសាបារាំង',         'name_en' => 'French',        'code' => 'FR'],
        ];

        foreach ($commonSubjects as $data) {
            $subject = Subject::firstOrCreate(['code' => $data['code']], $data);
            foreach ([$grade10, $grade11, $grade12] as $grade) {
                GradeSubject::firstOrCreate([
                    'grade_id'   => $grade->id,
                    'subject_id' => $subject->id,
                    'track'      => null,
                ]);
            }
        }

        foreach ($scienceSubjects as $data) {
            $subject = Subject::firstOrCreate(['code' => $data['code']], $data);
            foreach ([$grade11, $grade12] as $grade) {
                GradeSubject::firstOrCreate([
                    'grade_id'   => $grade->id,
                    'subject_id' => $subject->id,
                    'track'      => 'science',
                ]);
            }
        }

        foreach ($socialSubjects as $data) {
            $subject = Subject::firstOrCreate(['code' => $data['code']], $data);
            foreach ([$grade11, $grade12] as $grade) {
                GradeSubject::firstOrCreate([
                    'grade_id'   => $grade->id,
                    'subject_id' => $subject->id,
                    'track'      => 'social_science',
                ]);
            }
        }
    }
}