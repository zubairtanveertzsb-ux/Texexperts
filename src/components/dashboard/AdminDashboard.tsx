import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Appointment, AppointmentStatus } from '../../types';
import { KanbanBoard } from './KanbanBoard';
import { AppointmentDetailModal } from './AppointmentDetailModal';
import { NewAppointmentModal } from './NewAppointmentModal';
import { SettingsModal } from './SettingsModal';
import { 
  Search, 
  Filter, 
  Plus, 
  Download, 
  Settings, 
  MessageCircle, 
  FileText, 
  Clock, 
  Calendar, 
  CheckCircle2, 
  AlertCircle, 
  MoreHorizontal, 
  ChevronRight,
  LayoutGrid,
  List,
  CalendarDays,
  UserPlus,
  RefreshCw
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { 
    appointments, 
    services, 
    businessProfile, 
    updateAppointmentStatus, 
    selectedAppointment, 
    setSelectedAppointment 
  } = useApp();

  const [viewMode, setViewMode] = useState<'table' | 'kanban' | 'schedule'>('table');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [serviceFilter, setServiceFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');

  const [isNewAppointmentOpen, setIsNewAppointmentOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [initialWhatsAppTab, setInitialWhatsAppTab] = useState(false);

  // Filtered Appointments
  const filteredAppointments = useMemo(() => {
    return appointments.filter(app => {
      // Search
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = app.clientName.toLowerCase().includes(query);
        const matchesPhone = app.clientPhone.toLowerCase().includes(query);
        const matchesId = app.id.toLowerCase().includes(query);
        const matchesCnic = (app.clientCnicOrTaxId || '').toLowerCase().includes(query);
        const matchesBiz = (app.businessName || '').toLowerCase().includes(query);
        if (!matchesName && !matchesPhone && !matchesId && !matchesCnic && !matchesBiz) {
          return false;
        }
      }

      // Status
      if (statusFilter !== 'all' && app.status !== statusFilter) {
        return false;
      }

      // Service
      if (serviceFilter !== 'all' && app.serviceId !== serviceFilter) {
        return false;
      }

      // Date
      if (dateFilter === 'today') {
        const todayStr = new Date().toISOString().split('T')[0];
        if (app.appointmentDate !== todayStr) return false;
      } else if (dateFilter === 'urgent') {
        if (!app.urgent) return false;
      }

      return true;
    });
  }, [appointments, searchQuery, statusFilter, serviceFilter, dateFilter]);

  // Metrics
  const metrics = useMemo(() => {
    const total = appointments.length;
    const pendingContact = appointments.filter(a => a.status === 'Pending Contact').length;
    const docsAwaiting = appointments.filter(a => a.status === 'Documents Awaiting').length;
    const inProgress = appointments.filter(a => a.status === 'In Progress' || a.status === 'Under Review').length;
    const completed = appointments.filter(a => a.status === 'Completed').length;

    return { total, pendingContact, docsAwaiting, inProgress, completed };
  }, [appointments]);

  // CSV Export
  const handleExportCSV = () => {
    const headers = ['Booking ID', 'Client Name', 'Phone', 'CNIC/NTN', 'Business', 'Service', 'Date', 'Time Slot', 'Mode', 'Status', 'Fee (PKR)', 'Payment Status', 'Docs Provided/Total'];
    const rows = filteredAppointments.map(a => [
      a.id,
      `"${a.clientName}"`,
      `"${a.clientPhone}"`,
      `"${a.clientCnicOrTaxId || ''}"`,
      `"${a.businessName || ''}"`,
      `"${a.serviceTitle}"`,
      a.appointmentDate,
      `"${a.timeSlot}"`,
      `"${a.consultationMode}"`,
      `"${a.status}"`,
      a.fee,
      `"${a.paymentStatus}"`,
      `"${a.documentsChecklist.filter(d => d.isProvided).length}/${a.documentsChecklist.length}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `tax_appointments_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleOpenWhatsAppFromRow = (app: Appointment) => {
    setSelectedAppointment(app);
    setInitialWhatsAppTab(true);
  };

  const handleOpenDetailModal = (app: Appointment) => {
    setSelectedAppointment(app);
    setInitialWhatsAppTab(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-7 space-y-6">
      
      {/* Top Workspace Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-sky-100">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>Tax Operations</span>
            <span>/</span>
            <span className="font-semibold text-slate-800">Pending Tasks & Appointments</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mt-0.5">
            Tax Client Workflow Desk
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Firm: <strong className="text-slate-700">{businessProfile.firmName}</strong> · WhatsApp Line: <span className="font-mono text-emerald-700 font-semibold">{businessProfile.displayWhatsApp}</span>
          </p>
        </div>

        {/* Primary Header Controls */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => setIsNewAppointmentOpen(true)}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-xl shadow-xs transition-colors"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add Walk-in Client</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-colors"
            title="Download CSV report"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => setIsSettingsOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-colors"
            title="Configure settings"
          >
            <Settings className="w-4 h-4 text-slate-500" />
            <span>Settings</span>
          </button>
        </div>
      </div>

      {/* KPI Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
        <div className="bg-white p-4 rounded-xl border border-sky-100 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide block">
            Total Bookings
          </span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-bold text-slate-900 tabular-nums">{metrics.total}</span>
            <span className="text-xs text-slate-400">All time</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-600 uppercase tracking-wide block">
            Pending Contact
          </span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-bold text-slate-800 tabular-nums">{metrics.pendingContact}</span>
            <span className="text-[11px] font-medium text-slate-500">Need message</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-amber-200/80 shadow-2xs">
          <span className="text-[11px] font-semibold text-amber-700 uppercase tracking-wide block">
            Docs Awaiting
          </span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-bold text-amber-800 tabular-nums">{metrics.docsAwaiting}</span>
            <span className="text-[11px] font-medium text-amber-600">On WhatsApp</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-sky-200 shadow-2xs">
          <span className="text-[11px] font-semibold text-sky-700 uppercase tracking-wide block">
            In Progress & Review
          </span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-bold text-sky-800 tabular-nums">{metrics.inProgress}</span>
            <span className="text-[11px] font-medium text-sky-600">Active filing</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-emerald-200 shadow-2xs col-span-2 sm:col-span-1">
          <span className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wide block">
            Completed & Filed
          </span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-bold text-emerald-800 tabular-nums">{metrics.completed}</span>
            <span className="text-[11px] font-medium text-emerald-600">Issued</span>
          </div>
        </div>
      </div>

      {/* Control Strip: Search, Filters & View Toggle */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3.5 bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
        
        {/* Left: Search input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search by client, WhatsApp phone, CNIC or Ref ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>

        {/* Middle: Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-sky-500"
          >
            <option value="all">All Statuses</option>
            <option value="Pending Contact">Pending Contact</option>
            <option value="Documents Awaiting">Documents Awaiting</option>
            <option value="In Progress">In Progress</option>
            <option value="Under Review">Under Review</option>
            <option value="Completed">Completed</option>
          </select>

          {/* Service Filter */}
          <select
            value={serviceFilter}
            onChange={(e) => setServiceFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-sky-500 max-w-[180px] truncate"
          >
            <option value="all">All Services</option>
            {services.map(s => (
              <option key={s.id} value={s.id}>{s.title}</option>
            ))}
          </select>

          {/* Date Filter */}
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-sky-500"
          >
            <option value="all">All Dates</option>
            <option value="today">Today's Appointments</option>
            <option value="urgent">Urgent Priority Only</option>
          </select>
        </div>

        {/* Right: View Mode Toggle */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg shrink-0">
          <button
            onClick={() => setViewMode('table')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 ${
              viewMode === 'table' ? 'bg-white text-sky-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <List className="w-3.5 h-3.5" />
            <span>Table</span>
          </button>

          <button
            onClick={() => setViewMode('kanban')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 ${
              viewMode === 'kanban' ? 'bg-white text-sky-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Kanban</span>
          </button>

          <button
            onClick={() => setViewMode('schedule')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 ${
              viewMode === 'schedule' ? 'bg-white text-sky-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <CalendarDays className="w-3.5 h-3.5" />
            <span>Schedule</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: DATA TABLE */}
      {viewMode === 'table' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs divide-y divide-slate-200">
              <thead className="bg-slate-50/80 text-slate-500 font-semibold tracking-wider uppercase text-[10px]">
                <tr>
                  <th className="px-4 py-3">Booking Ref</th>
                  <th className="px-4 py-3">Client & WhatsApp</th>
                  <th className="px-4 py-3">Service</th>
                  <th className="px-4 py-3">Date & Slot</th>
                  <th className="px-4 py-3">Docs Progress</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Fee</th>
                  <th className="px-4 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {filteredAppointments.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-10 text-center text-slate-400">
                      No appointments match the selected filter criteria.
                    </td>
                  </tr>
                ) : (
                  filteredAppointments.map(app => {
                    const docsDone = app.documentsChecklist.filter(d => d.isProvided).length;
                    const docsTotal = app.documentsChecklist.length;

                    return (
                      <tr
                        key={app.id}
                        className="hover:bg-sky-50/40 transition-colors cursor-pointer group"
                        onClick={() => handleOpenDetailModal(app)}
                      >
                        {/* Ref ID */}
                        <td className="px-4 py-3.5 whitespace-nowrap">
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono text-xs font-bold text-sky-700 bg-sky-50 px-1.5 py-0.5 rounded">
                              #{app.id}
                            </span>
                            {app.urgent && (
                              <span className="w-2 h-2 rounded-full bg-rose-500" title="Urgent Priority" />
                            )}
                          </div>
                        </td>

                        {/* Client info */}
                        <td className="px-4 py-3.5">
                          <div>
                            <span className="font-bold text-slate-900 block leading-tight">{app.clientName}</span>
                            <span className="text-slate-500 font-mono text-[11px] block mt-0.5 tabular-nums">
                              {app.clientPhone}
                            </span>
                            {app.clientCnicOrTaxId && (
                              <span className="text-slate-400 font-mono text-[10px] block">
                                {app.clientCnicOrTaxId}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Service */}
                        <td className="px-4 py-3.5">
                          <span className="font-semibold text-slate-800 block">{app.serviceTitle}</span>
                          <span className="text-[11px] text-slate-400">{app.consultationMode}</span>
                        </td>

                        {/* Date & Slot */}
                        <td className="px-4 py-3.5 whitespace-nowrap tabular-nums">
                          <span className="font-medium text-slate-800 block">{app.appointmentDate}</span>
                          <span className="text-[11px] text-slate-500 block">{app.timeSlot}</span>
                        </td>

                        {/* Docs Progress */}
                        <td className="px-4 py-3.5 whitespace-nowrap">
                          <div className="space-y-1 w-28">
                            <div className="flex items-center justify-between text-[10px]">
                              <span className="text-slate-500">Docs</span>
                              <span className="font-bold text-slate-700 tabular-nums">
                                {docsDone}/{docsTotal}
                              </span>
                            </div>
                            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${docsDone === docsTotal ? 'bg-emerald-500' : 'bg-sky-500'}`}
                                style={{ width: `${docsTotal ? (docsDone / docsTotal) * 100 : 0}%` }}
                              />
                            </div>
                          </div>
                        </td>

                        {/* Status Dropdown */}
                        <td className="px-4 py-3.5 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                          <select
                            value={app.status}
                            onChange={(e) => updateAppointmentStatus(app.id, e.target.value as AppointmentStatus)}
                            className={`text-xs font-semibold px-2 py-1 rounded-md border focus:outline-none focus:ring-1 focus:ring-sky-500 ${
                              app.status === 'Completed'
                                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                                : app.status === 'In Progress'
                                ? 'bg-sky-50 border-sky-200 text-sky-800'
                                : app.status === 'Documents Awaiting'
                                ? 'bg-amber-50 border-amber-200 text-amber-800'
                                : 'bg-slate-100 border-slate-200 text-slate-800'
                            }`}
                          >
                            <option value="Pending Contact">Pending Contact</option>
                            <option value="Documents Awaiting">Documents Awaiting</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Under Review">Under Review</option>
                            <option value="Completed">Completed</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>

                        {/* Fee */}
                        <td className="px-4 py-3.5 text-right whitespace-nowrap tabular-nums">
                          <span className="font-bold text-slate-900 block">
                            PKR {app.fee.toLocaleString()}
                          </span>
                          <span className={`text-[10px] font-medium block ${
                            app.paymentStatus === 'Fully Paid' ? 'text-emerald-600' :
                            app.paymentStatus === 'Advance Paid' ? 'text-amber-600' : 'text-slate-400'
                          }`}>
                            {app.paymentStatus}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-3.5 text-center whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleOpenWhatsAppFromRow(app)}
                              className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold text-xs rounded-lg flex items-center gap-1 transition-colors"
                              title="Send WhatsApp message with template"
                            >
                              <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                              <span>WhatsApp</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleOpenDetailModal(app)}
                              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                              title="View details & document checklist"
                            >
                              <MoreHorizontal className="w-4 h-4" />
                            </button>
                          </div>
                        </td>

                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW 2: KANBAN PIPELINE */}
      {viewMode === 'kanban' && (
        <KanbanBoard
          appointments={filteredAppointments}
          onSelectAppointment={handleOpenDetailModal}
          onUpdateStatus={updateAppointmentStatus}
          onOpenWhatsAppModal={handleOpenWhatsAppFromRow}
        />
      )}

      {/* VIEW 3: SCHEDULE / CALENDAR DAY VIEW */}
      {viewMode === 'schedule' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-sky-600" />
              <span>Upcoming Consultations Schedule</span>
            </h2>
            <span className="text-xs text-slate-500 tabular-nums">
              {filteredAppointments.length} appointments scheduled
            </span>
          </div>

          <div className="space-y-3">
            {filteredAppointments.map(app => (
              <div
                key={app.id}
                onClick={() => handleOpenDetailModal(app)}
                className="p-4 rounded-xl border border-slate-200 hover:border-sky-300 bg-slate-50/50 hover:bg-white transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-start sm:items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-sky-100 text-sky-700 flex flex-col items-center justify-center font-bold text-xs shrink-0 tabular-nums">
                    <span>{new Date(app.appointmentDate).getDate()}</span>
                    <span className="text-[9px] uppercase font-medium">{new Date(app.appointmentDate).toLocaleString('default', { month: 'short' })}</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{app.clientName}</span>
                      <span className="font-mono text-xs text-slate-400">({app.clientPhone})</span>
                      <span className="text-xs font-mono text-sky-700 font-semibold bg-sky-50 px-1.5 py-0.2 rounded">
                        #{app.id}
                      </span>
                    </div>
                    <span className="text-xs text-slate-600 block">{app.serviceTitle} · {app.timeSlot}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-md ${
                    app.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' :
                    app.status === 'In Progress' ? 'bg-sky-100 text-sky-800' :
                    app.status === 'Documents Awaiting' ? 'bg-amber-100 text-amber-800' : 'bg-slate-200 text-slate-800'
                  }`}>
                    {app.status}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenWhatsAppFromRow(app);
                    }}
                    className="p-2 bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100"
                  >
                    <MessageCircle className="w-4 h-4 text-emerald-600" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODALS */}
      {selectedAppointment && (
        <AppointmentDetailModal
          appointment={selectedAppointment}
          onClose={() => setSelectedAppointment(null)}
          initialOpenWhatsAppTab={initialWhatsAppTab}
        />
      )}

      {isNewAppointmentOpen && (
        <NewAppointmentModal onClose={() => setIsNewAppointmentOpen(false)} />
      )}

      {isSettingsOpen && (
        <SettingsModal onClose={() => setIsSettingsOpen(false)} />
      )}

    </div>
  );
};
