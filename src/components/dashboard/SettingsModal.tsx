import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BusinessProfile } from '../../types';
import { X, Save, RotateCcw, MessageCircle, Building2, Phone } from 'lucide-react';

export const SettingsModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { businessProfile, updateBusinessProfile, resetAppointmentsToDefault } = useApp();
  const [profile, setProfile] = useState<BusinessProfile>(businessProfile);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateBusinessProfile(profile);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1000);
  };

  const handleReset = () => {
    if (window.confirm('Reset all appointments and business settings to initial sample state?')) {
      resetAppointmentsToDefault();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-sky-100 shadow-xl max-w-xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in-50">
        
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-sky-50/50">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-sky-600" />
            <div>
              <h2 className="text-base font-bold text-slate-900">Tax Firm & WhatsApp Configuration</h2>
              <p className="text-xs text-slate-500">Configure your business WhatsApp line and profile</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 text-xs">
          
          {/* WhatsApp Direct Line Section */}
          <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-3">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              <span className="font-bold text-emerald-950 uppercase tracking-wide">
                Official Business WhatsApp Settings
              </span>
            </div>
            <p className="text-[11px] text-slate-600 leading-normal">
              When clients book an appointment, they are automatically directed to this WhatsApp number to send their documents.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  WhatsApp Number (Digits Only with Country Code) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 923001234567"
                  value={profile.whatsAppNumber}
                  onChange={(e) => setProfile({ ...profile, whatsAppNumber: e.target.value.replace(/[^0-9]/g, '') })}
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 font-mono"
                />
                <span className="text-[10px] text-slate-400 block mt-0.5">Used for wa.me URL (e.g. 923001234567)</span>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Display WhatsApp Number *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. +92 300 1234567"
                  value={profile.displayWhatsApp}
                  onChange={(e) => setProfile({ ...profile, displayWhatsApp: e.target.value })}
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
                />
                <span className="text-[10px] text-slate-400 block mt-0.5">Shown on website UI</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Firm / Agency Title *</label>
              <input
                type="text"
                required
                value={profile.firmName}
                onChange={(e) => setProfile({ ...profile, firmName: e.target.value })}
                className="w-full p-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 font-semibold"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Lead Tax Advocate / Consultant *</label>
              <input
                type="text"
                required
                value={profile.consultantName}
                onChange={(e) => setProfile({ ...profile, consultantName: e.target.value })}
                className="w-full p-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 font-semibold"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Official Email Address</label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                className="w-full p-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Working Hours</label>
              <input
                type="text"
                value={profile.workingHours}
                onChange={(e) => setProfile({ ...profile, workingHours: e.target.value })}
                className="w-full p-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Office Chambers Address</label>
            <input
              type="text"
              value={profile.address}
              onChange={(e) => setProfile({ ...profile, address: e.target.value })}
              className="w-full p-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              onClick={handleReset}
              className="text-slate-500 hover:text-rose-600 flex items-center gap-1.5 font-medium"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Demo Data</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-slate-600 hover:text-slate-900 font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-xl shadow-xs flex items-center gap-1.5"
              >
                <Save className="w-4 h-4" />
                <span>{savedSuccess ? 'Saved!' : 'Save Settings'}</span>
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
};
