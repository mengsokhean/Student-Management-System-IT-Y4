import type { Student } from "../../types/student";
import { Star, UserCheck, UserX, Users } from "lucide-react";

type Props = {
  students: Student[];
};

function StudentStats({ students }: Props) {
  const totalStudents = students.length;
  const activeStudents = students.filter((student) => student.status === "active").length;
  const absentStudents = Math.max(totalStudents - activeStudents, 0);

  const cards = [
    {
      icon: Users,
      value: totalStudents,
      label: "សរុបសិស្ស | TOTAL STUDENTS",
    },
    {
      icon: UserCheck,
      value: activeStudents,
      label: "ចូលរៀនថ្ងៃនេះ | PRESENT TODAY",
    },
    {
      icon: UserX,
      value: absentStudents,
      label: "អវត្តមាន | ABSENT",
    },
    {
      icon: Star,
      value: "87.5%",
      label: "ពិន្ទុមធ្យម | AVG GRADE",
    },
  ];

  return (
    <section className="mb-5 grid grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.label}
            className="rounded-xl bg-white px-6 py-7 text-center shadow-md"
          >
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
              <Icon size={26} className="text-[#1a3a52]" />
            </div>

            <h3 className="mt-3 text-2xl font-bold text-[#1a3a52]">
              {card.value}
            </h3>

            <p className="mt-1 text-[11px] font-medium uppercase tracking-wide text-slate-500">
              {card.label}
            </p>
          </div>
        );
      })}
    </section>
  );
}

export default StudentStats;