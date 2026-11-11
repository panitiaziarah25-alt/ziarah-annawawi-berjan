import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Breadcrumb } from '../common/Breadcrumb';
import {
  Users,
  Phone,
  MessageSquare,
  Search,
  Shield,
  Clock,
  MapPin,
  ExternalLink,
} from 'lucide-react';

export const PanitiaView: React.FC = () => {
  const { panitiaList, siteSettings } = useApp();
  const [search, setSearch] = useState('');
  const [selectedDivision, setSelectedDivision] = useState<string>('all');

  const filteredPanitia = useMemo(() => {
    return panitiaList
      .filter((p) => {
        if (selectedDivision === 'all') return true;
        return p.division === selectedDivision;
      })
      .filter((p) => {
        if (!search.trim()) return true;
        const q = search.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.position.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.phone.includes(q)
        );
      });
  }, [panitiaList, selectedDivision, search]);

  const divisions = useMemo(() => {
    const standardOrder = [
      'Penanggungjawab',
      'Pembina',
      'Pengarah',
      'Ketua',
      'Wakil Ketua',
      'Sekretaris',
      'Wakil Sekretaris',
      'Bendahara',
      'Wakil Bendahara',
      'Pembantu Umum',
    ];

    const presentDivisions = Array.from(new Set(panitiaList.map((p) => p.division))).filter(Boolean);

    presentDivisions.sort((a, b) => {
      const idxA = standardOrder.indexOf(a);
      const idxB = standardOrder.indexOf(b);
      if (idxA !== -1 && idxB !== -1) return idxA - idxB;
      if (idxA !== -1) return -1;
      if (idxB !== -1) return 1;
      return a.localeCompare(b);
    });

    return [
      { id: 'all', label: `Semua Panitia (${panitiaList.length})` },
      ...presentDivisions.map((div) => ({
        id: div,
        label: `${div} (${panitiaList.filter((p) => p.division === div).length})`,
      })),
    ];
  }, [panitiaList]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      <Breadcrumb items={[{ label: 'Susunan Panitia' }]} />

      {/* Header Banner */}
      <div className="bg-emerald-950 text-white rounded-2xl p-6 sm:p-10 border border-emerald-900 shadow-md">
        <div className="max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs text-amber-300 font-semibold uppercase tracking-wider">
            <Users className="w-3.5 h-3.5" />
            <span>Struktur Panitia Pelaksana</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif-islamic font-bold text-white">
            Susunan Panitia Ziarah An-Nawawi 2026
          </h1>
          <p className="text-xs sm:text-sm text-emerald-200/90 leading-relaxed font-light">
            Daftar lengkap nama, jabatan, nomor kontak WhatsApp, dan bidang tugas panitia pelaksana kegiatan ziarah Pondok Pesantren An-Nawawi Berjan Purworejo.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
        {/* Division Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {divisions.map((div) => (
            <button
              key={div.id}
              onClick={() => setSelectedDivision(div.id)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                selectedDivision === div.id
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              {div.label}
            </button>
          ))}
        </div>

        {/* Search Field */}
        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama atau jabatan..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-stone-50 border border-stone-300 rounded-lg text-stone-900 focus:outline-hidden focus:border-emerald-700"
          />
        </div>
      </div>

      {/* Panitia Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredPanitia.map((member) => {
          const cleanPhone = member.phone.replace(/[^0-9]/g, '');
          const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
            `Assalamu'alaikum Warahmatullahi Wabarakatuh, Ustadz/Bapak ${member.name}. Saya peserta Ziarah An-Nawawi 2026 ingin menanyakan perihal...`
          )}`;

          return (
            <div
              key={member.id}
              className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 group"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">
                      {member.position}
                    </span>
                    <h3 className="font-bold text-base text-stone-900 group-hover:text-emerald-800 transition-colors mt-0.5">
                      {member.name}
                    </h3>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm shrink-0 border border-emerald-200">
                    {member.name.charAt(0)}
                  </div>
                </div>

                <p className="text-xs text-stone-600 mt-2.5 leading-relaxed font-serif">
                  {member.description}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
                <div className="text-xs font-mono text-stone-700 font-semibold">
                  {member.phone}
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <a
                    href={`tel:${cleanPhone}`}
                    className="p-2 text-stone-600 hover:text-emerald-800 hover:bg-stone-100 rounded-lg transition-colors"
                    title="Telepon Langsung"
                  >
                    <Phone className="w-4 h-4" />
                  </a>

                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors shadow-xs"
                    title="Hubungi WhatsApp"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
