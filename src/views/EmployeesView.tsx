import React from 'react';
import { UserPlus, Clock, Phone, Trash2 } from 'lucide-react';
import { Employee } from '../types';
import { translations } from '../i18n/translations';

interface EmployeesViewProps {
  employees: Employee[];
  language: 'kh' | 'en';
  onOpenAddModal: () => void;
  onToggleClock: (id: string) => void;
  onDeleteEmployee: (id: string) => void;
}

export const EmployeesView: React.FC<EmployeesViewProps> = ({
  employees,
  language,
  onOpenAddModal,
  onToggleClock,
  onDeleteEmployee
}) => {
  const t = translations[language];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-[.16em] text-[#c77c35]">
            {t.teamManagement}
          </p>
          <h1 className="font-display mt-1 text-3xl font-bold text-[#261711]">
            {t.employees}
          </h1>
          <p className="mt-1 text-sm text-[#846b5c]">
            {t.teamDesc}
          </p>
        </div>

        <button
          onClick={onOpenAddModal}
          className="inline-flex items-center gap-2 rounded-xl bg-[#6f4e37] px-4 py-2.5 text-xs font-bold text-white shadow hover:bg-[#583b27] transition cursor-pointer"
        >
          <UserPlus className="h-4 w-4" />
          <span>{t.addEmployee}</span>
        </button>
      </div>

      {/* Grid */}
      <div className="glass-card rounded-3xl p-6 border border-[var(--line)]">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {employees.map((emp) => (
            <div
              key={emp.id}
              className="rounded-2xl border border-[var(--line)] bg-[#fbf1e7]/70 p-5 text-[#38241b] shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-base text-[#261711]">{emp.name}</h3>
                    <p className="text-xs font-semibold text-[#846b5c]">{emp.role}</p>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold ${
                      emp.clockedIn
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-stone-200 text-stone-600'
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        emp.clockedIn ? 'bg-emerald-600' : 'bg-stone-500'
                      }`}
                    ></span>
                    {emp.clockedIn ? t.onDuty : t.offDuty}
                  </span>
                </div>

                <div className="mt-4 space-y-1.5 text-xs text-[#846b5c]">
                  <p className="flex items-center gap-2">
                    <Clock className="h-3.5 w-3.5 text-[#6f4e37]" />
                    <span>{emp.shift}</span>
                  </p>
                  {emp.phone && (
                    <p className="flex items-center gap-2">
                      <Phone className="h-3.5 w-3.5 text-[#6f4e37]" />
                      <span>{emp.phone}</span>
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-5 flex items-center gap-2 border-t border-[var(--line)] pt-3">
                <button
                  onClick={() => onToggleClock(emp.id)}
                  className={`flex-1 rounded-xl py-2 text-xs font-bold transition cursor-pointer ${
                    emp.clockedIn
                      ? 'bg-amber-100 text-amber-900 hover:bg-amber-200'
                      : 'bg-emerald-100 text-emerald-900 hover:bg-emerald-200'
                  }`}
                >
                  {emp.clockedIn ? t.clockOut : t.clockIn}
                </button>
                <button
                  onClick={() => onDeleteEmployee(emp.id)}
                  className="rounded-xl bg-red-100 px-3 py-2 text-xs font-bold text-red-700 hover:bg-red-200 transition cursor-pointer"
                  title="Remove employee"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
