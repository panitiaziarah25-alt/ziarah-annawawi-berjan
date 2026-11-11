import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Bus, MapPin, Plus, Trash2, Save, Phone } from 'lucide-react';

export const AdminPesertaManager: React.FC = () => {
  const { participantInfo, updateParticipantInfo, showToast } = useApp();

  const [meetingPoint, setMeetingPoint] = useState(participantInfo.departureSchedule.meetingPoint);
  const [assemblyTime, setAssemblyTime] = useState(participantInfo.departureSchedule.assemblyTime);
  const [departureTime, setDepartureTime] = useState(participantInfo.departureSchedule.departureTime);
  const [returnEstimate, setReturnEstimate] = useState(participantInfo.departureSchedule.returnEstimate);
  const [consumption, setConsumption] = useState(participantInfo.consumption);
  const [busFleets, setBusFleets] = useState(participantInfo.busFleets);
  const [contacts, setContacts] = useState(participantInfo.contacts);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateParticipantInfo({
      departureSchedule: {
        ...participantInfo.departureSchedule,
        meetingPoint,
        assemblyTime,
        departureTime,
        returnEstimate,
      },
      consumption,
      busFleets,
      contacts,
    });
    showToast('Informasi logistik peserta berhasil diperbarui!', 'success');
  };

  const handleAddBus = () => {
    const busNum = busFleets.length + 1;
    setBusFleets([
      ...busFleets,
      {
        busNumber: `Bus ${busNum.toString().padStart(2, '0')}`,
        coordinator: 'Nama Koordinator',
        phone: '+6281234567890',
        capacity: '50 Kursi',
        route: 'Berjan - Jawa Tengah - Jawa Timur',
      },
    ]);
  };

  const handleDeleteBus = (index: number) => {
    setBusFleets(busFleets.filter((_, idx) => idx !== index));
  };

  return (
    <form onSubmit={handleSave} className="space-y-8 max-w-4xl">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-stone-200 pb-4">
        <div>
          <h2 className="text-xl font-bold text-stone-900">Kelola Informasi Peserta & Logistik</h2>
          <p className="text-xs text-stone-500">
            Perbarui data titik kumpul, jadwal apel, daftar 10 armada bus, dan narahubung darurat.
          </p>
        </div>

        <button
          type="submit"
          className="flex items-center justify-center gap-1.5 px-5 py-2.5 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg shadow-sm transition-colors cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>Simpan Seluruh Perubahan</span>
        </button>
      </div>

      {/* Keberangkatan & Titik Kumpul */}
      <div className="bg-white rounded-xl border border-stone-200 p-6 space-y-4 shadow-xs">
        <h3 className="font-bold text-sm text-stone-900 flex items-center gap-2 border-b border-stone-100 pb-2">
          <MapPin className="w-4 h-4 text-emerald-700" />
          <span>Titik Kumpul & Jadwal Pelepasan</span>
        </h3>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-stone-700">Nama Titik Kumpul</label>
          <input
            type="text"
            value={meetingPoint}
            onChange={(e) => setMeetingPoint(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg"
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-stone-700">Waktu Kumpul & Manifes</label>
            <input
              type="text"
              value={assemblyTime}
              onChange={(e) => setAssemblyTime(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg"
              required
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-stone-700">Waktu Pelepasan</label>
            <input
              type="text"
              value={departureTime}
              onChange={(e) => setDepartureTime(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg"
              required
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-stone-700">Estimasi Kepulangan</label>
            <input
              type="text"
              value={returnEstimate}
              onChange={(e) => setReturnEstimate(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg"
              required
            />
          </div>
        </div>
      </div>

      {/* Daftar Armada Bus */}
      <div className="bg-white rounded-xl border border-stone-200 p-6 space-y-4 shadow-xs">
        <div className="flex items-center justify-between border-b border-stone-100 pb-2">
          <h3 className="font-bold text-sm text-stone-900 flex items-center gap-2">
            <Bus className="w-4 h-4 text-emerald-700" />
            <span>Daftar Armada Bus ({busFleets.length} Unit)</span>
          </h3>
          <button
            type="button"
            onClick={handleAddBus}
            className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah Bus</span>
          </button>
        </div>

        <div className="space-y-3">
          {busFleets.map((bus, idx) => (
            <div
              key={idx}
              className="p-3 bg-stone-50 rounded-lg border border-stone-200 grid grid-cols-1 sm:grid-cols-4 gap-2.5 items-center text-xs"
            >
              <input
                type="text"
                value={bus.busNumber}
                onChange={(e) => {
                  const updated = [...busFleets];
                  updated[idx].busNumber = e.target.value;
                  setBusFleets(updated);
                }}
                className="px-2.5 py-1.5 bg-white border border-stone-300 rounded font-bold text-emerald-950"
              />
              <input
                type="text"
                value={bus.coordinator}
                onChange={(e) => {
                  const updated = [...busFleets];
                  updated[idx].coordinator = e.target.value;
                  setBusFleets(updated);
                }}
                placeholder="Nama Koordinator"
                className="px-2.5 py-1.5 bg-white border border-stone-300 rounded"
              />
              <input
                type="text"
                value={bus.phone}
                onChange={(e) => {
                  const updated = [...busFleets];
                  updated[idx].phone = e.target.value;
                  setBusFleets(updated);
                }}
                placeholder="Nomor HP / WA"
                className="px-2.5 py-1.5 bg-white border border-stone-300 rounded"
              />
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={bus.capacity}
                  onChange={(e) => {
                    const updated = [...busFleets];
                    updated[idx].capacity = e.target.value;
                    setBusFleets(updated);
                  }}
                  placeholder="Kapasitas"
                  className="w-24 px-2 py-1.5 bg-white border border-stone-300 rounded"
                />
                <button
                  type="button"
                  onClick={() => handleDeleteBus(idx)}
                  className="p-1.5 text-stone-400 hover:text-rose-600 rounded"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Narahubung Hotline */}
      <div className="bg-white rounded-xl border border-stone-200 p-6 space-y-4 shadow-xs">
        <h3 className="font-bold text-sm text-stone-900 flex items-center gap-2 border-b border-stone-100 pb-2">
          <Phone className="w-4 h-4 text-emerald-700" />
          <span>Hotline & Kontak Darurat Panitia</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {contacts.map((contact, idx) => (
            <div key={idx} className="p-3 bg-stone-50 rounded-lg border border-stone-200 space-y-1.5 text-xs">
              <input
                type="text"
                value={contact.role}
                onChange={(e) => {
                  const updated = [...contacts];
                  updated[idx].role = e.target.value;
                  setContacts(updated);
                }}
                className="w-full px-2 py-1 bg-white border border-stone-300 rounded font-semibold text-emerald-900"
              />
              <input
                type="text"
                value={contact.name}
                onChange={(e) => {
                  const updated = [...contacts];
                  updated[idx].name = e.target.value;
                  setContacts(updated);
                }}
                className="w-full px-2 py-1 bg-white border border-stone-300 rounded"
              />
              <input
                type="text"
                value={contact.phone}
                onChange={(e) => {
                  const updated = [...contacts];
                  updated[idx].phone = e.target.value;
                  setContacts(updated);
                }}
                className="w-full px-2 py-1 bg-white border border-stone-300 rounded font-mono"
              />
            </div>
          ))}
        </div>
      </div>
    </form>
  );
};
