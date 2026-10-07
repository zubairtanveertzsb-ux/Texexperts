import React from 'react';
import { Appointment, AppointmentStatus } from '../../types';
import { sanitizePhoneForWhatsApp } from '../../utils/whatsapp';
import { 
  MessageCircle, 
  Clock, 
  Calendar, 
  CheckCircle2, 
  AlertCircle, 
  ChevronRight, 
  ChevronLeft,
  FileText
} from 'lucide-react';

interface KanbanBoardProps {
  appointments: Appointment[];
  onSelectAppointment: (appointment: Appointment) => void;
  onUpdateStatus: (id: string, status: AppointmentStatus) => void;
  onOpenWhatsAppModal: (appointment: Appointment) => void;
}

const COLUMNS: { status: AppointmentStatus; label: string; color: string; badgeBg: string }[] = [
  { status: 'Pending Contact', label: 'New / Pending Contact', color: 'border-slate-300', badgeBg: 'bg-slate-100 text-slate-800' },
  { status: 'Documents Awaiting', label: 'Docs Awaiting on WhatsApp', color: 'border-amber-300', badgeBg: 'bg-amber-100 text-amber-800' },
  { status: 'In Progress', label: 'In Progress / Drafting', color: 'border-sky-300', badgeBg: 'bg-sky-100 text-sky-800' },
  { status: 'Under Review', label: 'Under Review / Approval', color: 'border-indigo-300', badgeBg: 'bg-indigo-100 text-indigo-800' },
  { status: 'Completed', label: 'Completed & Filed', color: 'border-emerald-300', badgeBg: 'bg-emerald-100 text-emerald-800' }
];

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  appointments,
  onSelectAppointment,
  onUpdateStatus,
  onOpenWhatsAppModal
}) => {

  const getNextStatus = (current: AppointmentStatus): AppointmentStatus | null => {
    switch (current) {
      case 'Pending Contact': return 'Documents Awaiting';
      case 'Documents Awaiting': return 'In Progress';
      case 'In Progress': return 'Under Review';
      case 'Under Review': return 'Completed';
      default: return null;
    }
  };

  const getPrevStatus = (current: AppointmentStatus): AppointmentStatus | null => {
    switch (current) {
      case 'Completed': return 'Under Review';
      case 'Under Review': return 'In Progress';
      case 'In Progress': return 'Documents Awaiting';
      case 'Documents Awaiting': return 'Pending Contact';
      default: return null;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 overflow-x-auto pb-4">
      {COLUMNS.map(col => {
        const columnApps = appointments.filter(a => a.status === col.status);

        return (
          <div
            key={col.status}
            className="bg-slate-100/60 rounded-xl border border-slate-200/80 p-3 flex flex-col min-w-[260px] h-[720px]"
          >
            {/* Column Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 px-1">
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${
                  col.status === 'Completed' ? 'bg-emerald-500' :
                  col.status === 'In Progress' ? 'bg-sky-500' :
                  col.status === 'Documents Awaiting' ? 'bg-amber-500' : 'bg-slate-400'
                }`} />
                <h3 className="text-xs font-bold text-slate-800">{col.label}</h3>
              </div>
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full tabular-nums ${col.badgeBg}`}>
                {columnApps.length}
              </span>
            </div>

            {/* Column Cards Container */}
            <div className="flex-1 overflow-y-auto space-y-3 pt-3 pr-0.5">
              {columnApps.length === 0 ? (
                <div className="h-32 flex flex-col items-center justify-center text-center p-3 text-slate-400 border border-dashed border-slate-200 rounded-lg text-xs">
                  <span>No tasks in this stage</span>
                </div>
              ) : (
                columnApps.map(app => {
                  const docsDone = app.documentsChecklist.filter(d => d.isProvided).length;
                  const docsTotal = app.documentsChecklist.length;
                  const next = getNextStatus(app.status);
                  const prev = getPrevStatus(app.status);

                  return (
                    <div
                      key={app.id}
                      onClick={() => onSelectAppointment(app)}
                      className={`bg-white rounded-xl border p-3.5 shadow-2xs hover:shadow-md transition-all cursor-pointer space-y-2.5 ${
                        app.urgent ? 'border-l-4 border-l-rose-500 border-slate-200' : 'border-slate-200 hover:border-sky-300'
                      }`}
                    >
                      {/* Top Row */}
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-mono text-[10px] font-bold text-sky-700 bg-sky-50 px-1.5 py-0.5 rounded">
                          #{app.id}
                        </span>
                        {app.urgent && (
                          <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-1.5 py-0.2 rounded">
                            Urgent
                          </span>
                        )}
                      </div>

                      {/* Client & Service */}
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 leading-tight">
                          {app.clientName}
                        </h4>
                        <span className="text-[11px] text-slate-500 block leading-tight mt-0.5">
                          {app.serviceTitle}
                        </span>
                      </div>

                      {/* Date & Time */}
                      <div className="flex items-center gap-2 text-[11px] text-slate-500 tabular-nums">
                        <Calendar className="w-3 h-3 text-slate-400 shrink-0" />
                        <span>{app.appointmentDate} · {app.timeSlot.split('-')[0]}</span>
                      </div>

                      {/* Document Progress Meter */}
                      <div className="space-y-1 pt-1">
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="text-slate-500 flex items-center gap-1">
                            <FileText className="w-3 h-3 text-sky-600" />
                            <span>Documents</span>
                          </span>
                          <span className="font-semibold text-slate-700 tabular-nums">
                            {docsDone}/{docsTotal}
                          </span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${
                              docsDone === docsTotal ? 'bg-emerald-500' : 'bg-sky-500'
                            }`}
                            style={{ width: `${docsTotal ? (docsDone / docsTotal) * 100 : 0}%` }}
                          />
                        </div>
                      </div>

                      {/* Card Footer Actions */}
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-1">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenWhatsAppModal(app);
                          }}
                          className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold text-[11px] rounded-md flex items-center gap-1 transition-colors"
                          title="Open WhatsApp templates"
                        >
                          <MessageCircle className="w-3 h-3 text-emerald-600" />
                          <span>WhatsApp</span>
                        </button>

                        <div className="flex items-center gap-1">
                          {prev && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                onUpdateStatus(app.id, prev);
                              }}
                              className="p-1 hover:bg-slate-100 text-slate-500 rounded"
                              title={`Move to ${prev}`}
                            >
                              <ChevronLeft className="w-3.5 h-3.5" />
                            </button>
                          )}
                          {next && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                onUpdateStatus(app.id, next);
                              }}
                              className="p-1 hover:bg-sky-50 text-sky-600 rounded"
                              title={`Move to ${next}`}
                            >
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>

                    </div>
                  );
                })
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
