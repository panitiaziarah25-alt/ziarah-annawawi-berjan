import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { RundownItem, Tokoh, MakamLokasi } from '../../types';
import {
  Plus,
  Edit2,
  Trash2,
  ArrowUp,
  ArrowDown,
  Clock,
  MapPin,
  X,
  PlayCircle,
  CheckCircle2,
  UserCheck,
  Search,
  BookOpen,
  Calendar,
  MessageSquare,
  Sliders,
  Sparkles,
  RotateCcw,
} from 'lucide-react';
import { initialRundown } from '../../data/initialData';
import { initialRundownNgulon } from '../../data/routeDataNgulon';
import {
  formatPerAgendaWAMessage,
  formatAllRundownWAMessage,
  shareToWhatsApp,
  DEFAULT_WA_GREETING,
  DEFAULT_WA_CLOSING,
  DEFAULT_WA_PER_AGENDA_TEMPLATE,
  DEFAULT_WA_ALL_RUNDOWN_INTRO,
} from '../../utils/whatsappShare';

export const RUNDOWN_ACTIVITY_OPTIONS = [
  { id: 'ziarah', label: 'Ziarah', fullLabel: 'Ziarah Maqbarah Auliya\'', icon: '🕌' },
  { id: 'makan', label: 'Makan', fullLabel: 'Santap Makan Bersama', icon: '🍽️' },
  { id: 'belanja', label: 'Belanja', fullLabel: 'Belanja Oleh-Oleh', icon: '🛍️' },
  { id: 'istirahat', label: 'Istirahat', fullLabel: 'Istirahat / Transit', icon: '🛌' },
  { id: 'mandi', label: 'Mandi', fullLabel: 'Mandi & Bersih Diri', icon: '🚿' },
] as const;

export const AdminRundownManager: React.FC = () => {
  const {
    rundownList,
    tokohList,
    makamList,
    siteSettings,
    addRundown,
    updateRundown,
    deleteRundown,
    reorderRundown,
    addTokoh,
    ziarahMode,
    showToast,
  } = useApp();

  const [editingItem, setEditingItem] = useState<RundownItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form state
  const [selectedActivities, setSelectedActivities] = useState<('ziarah' | 'makan' | 'belanja' | 'istirahat' | 'mandi' | 'lainnya')[]>(['ziarah']);
  const [selectedMakamId, setSelectedMakamId] = useState<string>('');
  const [locationName, setLocationName] = useState('');
  const [selectedFigureIds, setSelectedFigureIds] = useState<string[]>([]);
  const [travelDuration, setTravelDuration] = useState('1 Jam 30 Menit');
  const [timeIn, setTimeIn] = useState('10.00 WIB');
  const [durationAtLocation, setDurationAtLocation] = useState('1 Jam 0 Menit');
  const [timeOut, setTimeOut] = useState('11.00 WIB');
  const [activity, setActivity] = useState('');
  const [extraActivitiesText, setExtraActivitiesText] = useState('');
  const [dayNumber, setDayNumber] = useState(1);
  const [dayName, setDayName] = useState('Selasa, 6 Okt 2026');
  const [date, setDate] = useState('2026-10-06');
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState<'selesai' | 'berlangsung' | 'berikutnya'>('berikutnya');

  // Search in Tokoh picker
  const [tokohSearch, setTokohSearch] = useState('');
  const [isAddingNewTokoh, setIsAddingNewTokoh] = useState(false);
  const [newTokohName, setNewTokohName] = useState('');
  const [newTokohTitle, setNewTokohTitle] = useState('');

  // Quick WhatsApp Preview Modal State
  const [previewWAModal, setPreviewWAModal] = useState<{ title: string; content: string } | null>(null);

  // Map of Tokoh by ID
  const tokohMap = useMemo(() => {
    const map = new Map<string, Tokoh>();
    tokohList.forEach((t) => map.set(t.id, t));
    return map;
  }, [tokohList]);

  const filteredTokohList = useMemo(() => {
    if (!tokohSearch.trim()) return tokohList;
    const q = tokohSearch.toLowerCase();
    return tokohList.filter(
      (t) => t.name.toLowerCase().includes(q) || t.titleOrHonorific.toLowerCase().includes(q)
    );
  }, [tokohList, tokohSearch]);

  const toggleActivity = (actId: 'ziarah' | 'makan' | 'belanja' | 'istirahat' | 'mandi') => {
    setSelectedActivities((prev) => {
      const exists = prev.includes(actId);
      let updated: ('ziarah' | 'makan' | 'belanja' | 'istirahat' | 'mandi' | 'lainnya')[];
      if (exists) {
        updated = prev.filter((a) => a !== actId);
        if (updated.length === 0) {
          updated = ['ziarah']; // Keep at least one
        }
      } else {
        updated = [...prev, actId];
      }

      // Auto update suggested activity title if current activity is standard/empty
      const labels = updated.map((id) => {
        const opt = RUNDOWN_ACTIVITY_OPTIONS.find((o) => o.id === id);
        return opt ? opt.label : id;
      });

      if (updated.includes('ziarah')) {
        if (!activity || activity.startsWith('Kegiatan') || activity.startsWith('Makan') || activity.startsWith('Istirahat')) {
          setActivity(`Ziarah ${locationName || 'Maqbarah Auliya\''}`);
        }
      } else {
        setActivity(`${labels.join(' & ')} di ${locationName || 'Lokasi'}`);
      }

      return updated;
    });
  };

  const openAddModal = () => {
    setEditingItem(null);
    setSelectedActivities(['ziarah']);
    setSelectedMakamId('');
    setLocationName('');
    setSelectedFigureIds([]);
    setTravelDuration('1 Jam 30 Menit');
    setTimeIn('10.00 WIB');
    setDurationAtLocation('1 Jam 0 Menit');
    setTimeOut('11.00 WIB');
    setActivity('');
    setExtraActivitiesText('Sholat Jama\' Ta\'khir Dzuhur-Ashar');
    setDayNumber(1);
    setDayName('Selasa, 6 Okt 2026');
    setDate('2026-10-06');
    setNotes('');
    setStatus('berikutnya');
    setTokohSearch('');
    setIsAddingNewTokoh(false);
    setIsModalOpen(true);
  };

  const openEditModal = (item: RundownItem) => {
    setEditingItem(item);

    // Determine activity types
    if (item.activityTypes && item.activityTypes.length > 0) {
      setSelectedActivities(item.activityTypes);
    } else {
      const inferred: ('ziarah' | 'makan' | 'belanja' | 'istirahat' | 'mandi' | 'lainnya')[] = [];
      const text = `${item.activity || ''} ${item.location || ''} ${(item.subActivities || []).join(' ')}`.toLowerCase();
      if (text.includes('ziarah') || (item.figureIds && item.figureIds.length > 0) || item.locationId) inferred.push('ziarah');
      if (text.includes('makan') || text.includes('sarapan') || text.includes('kuliner') || text.includes('santap')) inferred.push('makan');
      if (text.includes('belanja') || text.includes('oleh-oleh') || text.includes('pasar')) inferred.push('belanja');
      if (text.includes('istirahat') || text.includes('transit') || text.includes('hotel') || text.includes('tidur')) inferred.push('istirahat');
      if (text.includes('mandi') || text.includes('bersih diri') || text.includes('toilet')) inferred.push('mandi');
      if (inferred.length === 0) inferred.push('ziarah');
      setSelectedActivities(inferred);
    }

    setSelectedMakamId(item.locationId || '');
    setLocationName(item.location || '');
    setSelectedFigureIds(item.figureIds || []);
    setTravelDuration(item.travelDuration || '-');
    setTimeIn(item.timeIn || item.time?.split('-')[0]?.trim() || '');
    setDurationAtLocation(item.durationAtLocation || item.duration || '');
    setTimeOut(item.timeOut || item.time?.split('-')[1]?.trim() || '');
    setActivity(item.activity || '');
    setExtraActivitiesText(
      item.subActivities && item.subActivities.length > 0
        ? item.subActivities.join('\n')
        : ''
    );
    setDayNumber(item.dayNumber);
    setDayName(item.dayName || `Hari ${item.dayNumber}`);
    setDate(item.date);
    setNotes(item.notes || '');
    setStatus(item.status);
    setTokohSearch('');
    setIsAddingNewTokoh(false);
    setIsModalOpen(true);
  };

  // When Makam is picked in dropdown, auto-fill location name and suggest linked tokoh!
  const handleMakamChange = (makamId: string) => {
    setSelectedMakamId(makamId);
    if (!makamId) return;

    const makam = makamList.find((m) => m.id === makamId);
    if (makam) {
      setLocationName(makam.name);
      if (!activity) {
        setActivity(`Ziarah ${makam.name}`);
      }
      // If figures exist for this tomb, auto check them
      if (makam.figureIds && makam.figureIds.length > 0) {
        setSelectedFigureIds(Array.from(new Set([...selectedFigureIds, ...makam.figureIds])));
      }
    }
  };

  const toggleFigureSelection = (figureId: string) => {
    setSelectedFigureIds((prev) =>
      prev.includes(figureId) ? prev.filter((id) => id !== figureId) : [...prev, figureId]
    );
  };

  const handleAddNewTokohQuick = () => {
    if (!newTokohName.trim()) {
      showToast('Masukkan nama tokoh yang ingin ditambahkan', 'error');
      return;
    }

    const newTokohId = `tokoh-custom-${Date.now()}`;
    const slug = newTokohName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    addTokoh({
      name: newTokohName.trim(),
      titleOrHonorific: newTokohTitle.trim() || 'Tokoh Ulama & Auliya\'',
      slug,
      photo: '/src/assets/images/ulama_ziarah_doa_1794285627516.jpg',
      biography: `Riwayat dan biografi ${newTokohName.trim()}, diziarahi dalam rangkaian Ziarah An-Nawawi Berjan 2026.`,
      genealogy: 'Sanad keilmuan pesantren ahlussunnah wal jama\'ah.',
      education: 'Pesantren Salaf.',
      strugglesAndContributions: 'Berdakwah dan mengabdi untuk kemaslahatan umat.',
      worksAndLegacy: 'Amaliah dakwah dan peninggalan pesantren.',
      tombLocationId: selectedMakamId || 'lokasi-makam-berjan',
      status: 'published',
    });

    // Auto-select this newly created tokoh
    setSelectedFigureIds((prev) => [...prev, newTokohId]);
    setNewTokohName('');
    setNewTokohTitle('');
    setIsAddingNewTokoh(false);
    showToast(`Tokoh "${newTokohName}" berhasil ditambahkan ke database!`, 'success');
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    const parsedSubActivities = extraActivitiesText
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    const generatedTime = `${timeIn} - ${timeOut}`;
    const generatedDuration = durationAtLocation || '60 Menit';

    const hasZiarah = selectedActivities.includes('ziarah');
    const finalLocation = locationName.trim() || (hasZiarah ? 'Lokasi Makam' : 'Lokasi Kegiatan');
    const finalLocationId = hasZiarah ? (selectedMakamId || undefined) : undefined;
    const finalFigureIds = hasZiarah ? selectedFigureIds : [];

    const finalActivity =
      activity.trim() ||
      (hasZiarah && finalFigureIds.length > 0
        ? `Ziarah Maqbarah ${tokohMap.get(finalFigureIds[0])?.name || finalLocation}`
        : `${selectedActivities.map((id) => RUNDOWN_ACTIVITY_OPTIONS.find((o) => o.id === id)?.label || id).join(' & ')} di ${finalLocation}`);

    const data: Omit<RundownItem, 'id' | 'order'> = {
      location: finalLocation,
      locationId: finalLocationId,
      figureIds: finalFigureIds,
      activityTypes: selectedActivities,
      travelDuration,
      timeIn,
      durationAtLocation,
      timeOut,
      activity: finalActivity,
      subActivities: parsedSubActivities,
      time: generatedTime,
      duration: generatedDuration,
      dayNumber,
      dayName,
      date,
      notes,
      status,
    };

    if (editingItem) {
      updateRundown(editingItem.id, data);
      showToast('Baris rundown berhasil diperbarui & disinkronkan', 'success');
    } else {
      addRundown(data);
      showToast('Baris rundown baru berhasil ditambahkan', 'success');
    }

    setIsModalOpen(false);
  };

  const moveUp = (index: number) => {
    if (index > 0) {
      reorderRundown(index, index - 1);
    }
  };

  const moveDown = (index: number) => {
    if (index < rundownList.length - 1) {
      reorderRundown(index, index + 1);
    }
  };

  const handleResetToStandard = () => {
    if (
      window.confirm(
        'Muat ulang rundown ke master dokumen resmi (Gunungpring, Santren, Demak, Kudus, Muria, dll) dengan relasi tokoh lengkap? Data kustom akan diganti.'
      )
    ) {
      const defaultData = ziarahMode === 'ngulon' ? initialRundownNgulon : initialRundown;
      localStorage.setItem(`zan_2026_rundown_${ziarahMode}`, JSON.stringify(defaultData));
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6">
      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-stone-900">Kelola Rundown & Sinkronisasi Tokoh</h2>
            <span className="text-xs bg-emerald-100 text-emerald-800 font-extrabold px-2.5 py-0.5 rounded border border-emerald-300">
              Relasional Tokoh & Makam
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            Setiap makam dan tokoh terhubung satu sumber data. Checklist tokoh yang dikunjungi dan biografi akan otomatis tersinkronisasi.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => {
              const msg = formatAllRundownWAMessage(rundownList, siteSettings, tokohList, 'all');
              shareToWhatsApp(msg);
              showToast('Membuka WhatsApp untuk membagikan seluruh jadwal...', 'success');
            }}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-2xs transition-colors cursor-pointer"
            title="Bagikan seluruh jadwal rundown ke grup WhatsApp"
          >
            <MessageSquare className="w-3.5 h-3.5 text-amber-300" />
            <span>Share Semua ke WA</span>
          </button>

          <button
            onClick={handleResetToStandard}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-stone-700 bg-white hover:bg-stone-50 border border-stone-300 rounded-lg shadow-2xs transition-colors cursor-pointer"
            title="Muat Ulang Rundown Resmi Dokumen"
          >
            <RotateCcw className="w-3.5 h-3.5 text-stone-500" />
            <span>Reset ke Master</span>
          </button>

          <button
            onClick={openAddModal}
            className="flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg shadow-2xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Baris Rundown</span>
          </button>
        </div>
      </div>

      {/* Rundown List Table */}
      <div className="bg-white rounded-xl border border-stone-800 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#00a2e8] text-black font-extrabold uppercase border-b-2 border-stone-900">
                <th className="py-3 px-2 text-center w-12 border-r border-stone-900">Urut</th>
                <th className="py-3 px-3 w-44 border-r border-stone-900">NAMA LOKASI & TANGGAL</th>
                <th className="py-3 px-2 text-center w-24 border-r border-stone-900">DI JALAN</th>
                <th className="py-3 px-2 text-center w-20 border-r border-stone-900">MASUK</th>
                <th className="py-3 px-2 text-center w-24 border-r border-stone-900">DI LOKASI</th>
                <th className="py-3 px-2 text-center w-20 border-r border-stone-900">KELUAR</th>
                <th className="py-3 px-3 border-r border-stone-900">KEGIATAN & TOKOH TERSINKRON</th>
                <th className="py-3 px-3 text-center w-32 border-r border-stone-900">STATUS</th>
                <th className="py-3 px-3 text-right w-20">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200">
              {rundownList.map((item, index) => {
                const linkedTokoh: Tokoh[] = [];
                if (item.figureIds && item.figureIds.length > 0) {
                  item.figureIds.forEach((id) => {
                    const t = tokohMap.get(id);
                    if (t) linkedTokoh.push(t);
                  });
                }

                return (
                  <tr
                    key={item.id}
                    className={`hover:bg-stone-50 transition-colors ${
                      item.status === 'berlangsung' ? 'bg-amber-50/60' : ''
                    }`}
                  >
                    {/* Order */}
                    <td className="py-2.5 px-2 text-center font-bold text-stone-500 tabular-nums border-r border-stone-200">
                      <div className="flex items-center justify-center gap-1">
                        <span>{item.order}</span>
                        <div className="flex flex-col">
                          <button
                            type="button"
                            disabled={index === 0}
                            onClick={() => moveUp(index)}
                            className="text-stone-400 hover:text-stone-700 disabled:opacity-20 cursor-pointer"
                          >
                            <ArrowUp className="w-2.5 h-2.5" />
                          </button>
                          <button
                            type="button"
                            disabled={index === rundownList.length - 1}
                            onClick={() => moveDown(index)}
                            className="text-stone-400 hover:text-stone-700 disabled:opacity-20 cursor-pointer"
                          >
                            <ArrowDown className="w-2.5 h-2.5" />
                          </button>
                        </div>
                      </div>
                    </td>

                    {/* Location & Day/Date */}
                    <td className="py-2.5 px-3 font-bold text-stone-900 border-r border-stone-200">
                      <div className="text-xs">{item.location}</div>
                      <div className="text-[11px] font-semibold text-emerald-800 mt-0.5">{item.dayName}</div>
                    </td>

                    {/* Di Jalan */}
                    <td className="py-2.5 px-2 text-center tabular-nums text-stone-700 border-r border-stone-200 whitespace-nowrap">
                      {item.travelDuration === '-' ? (
                        <span className="inline-block w-8 h-4 bg-stone-400 rounded-2xs" title="Titik Awal" />
                      ) : (
                        item.travelDuration || '-'
                      )}
                    </td>

                    {/* Masuk */}
                    <td className="py-2.5 px-2 text-center font-semibold text-stone-900 tabular-nums border-r border-stone-200 whitespace-nowrap">
                      {item.timeIn || item.time?.split('-')[0]?.trim()}
                    </td>

                    {/* Di Lokasi */}
                    <td className="py-2.5 px-2 text-center text-stone-700 tabular-nums border-r border-stone-200 whitespace-nowrap">
                      {item.durationAtLocation || item.duration}
                    </td>

                    {/* Keluar */}
                    <td className="py-2.5 px-2 text-center font-semibold text-stone-900 tabular-nums border-r border-stone-200 whitespace-nowrap">
                      {item.timeOut || item.time?.split('-')[1]?.trim() || '-'}
                    </td>

                    {/* Kegiatan & Tokoh Tersinkron */}
                    <td className="py-2.5 px-3 border-r border-stone-200 text-[11px] leading-snug space-y-1">
                      <div className="font-bold text-stone-900">{item.activity}</div>

                      {/* Linked Tokoh Pills */}
                      {linkedTokoh.length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-0.5">
                          {linkedTokoh.map((t) => (
                            <span
                              key={t.id}
                              className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-900 border border-emerald-200 px-1.5 py-0.5 rounded text-[10px] font-medium"
                            >
                              <UserCheck className="w-2.5 h-2.5 text-emerald-700" />
                              <span>{t.name}</span>
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Sub activities */}
                      {item.subActivities && item.subActivities.length > 0 && (
                        <div className="text-stone-500 text-[10px]">
                          {item.subActivities.join(' · ')}
                        </div>
                      )}
                    </td>

                    {/* Status */}
                    <td className="py-2.5 px-3 text-center border-r border-stone-200 whitespace-nowrap">
                      <select
                        value={item.status}
                        onChange={(e) => updateRundown(item.id, { status: e.target.value as any })}
                        className={`text-[11px] font-bold rounded-full px-2.5 py-1 border transition-all cursor-pointer ${
                          item.status === 'selesai'
                            ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                            : item.status === 'berlangsung'
                            ? 'bg-amber-200 text-amber-950 border-amber-400 font-extrabold'
                            : 'bg-stone-100 text-stone-700 border-stone-300'
                        }`}
                      >
                        <option value="selesai">✓ Selesai</option>
                        <option value="berlangsung">▶ Berlangsung</option>
                        <option value="berikutnya">⏳ Berikutnya</option>
                      </select>
                    </td>

                    {/* Actions */}
                    <td className="py-2.5 px-3 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => {
                            const msg = formatPerAgendaWAMessage(item, siteSettings, tokohList, makamList);
                            shareToWhatsApp(msg);
                            showToast(`Membuka WhatsApp untuk agenda "${item.location}"`, 'success');
                          }}
                          className="p-1 text-emerald-700 hover:text-emerald-900 hover:bg-emerald-50 rounded-md cursor-pointer transition-colors"
                          title="Share Agenda ini ke WhatsApp"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => openEditModal(item)}
                          className="p-1 text-stone-500 hover:text-sky-700 hover:bg-stone-100 rounded-md cursor-pointer"
                          title="Edit Baris Rundown"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Hapus baris rundown lokasi "${item.location}"?`)) {
                              deleteRundown(item.id);
                            }
                          }}
                          className="p-1 text-stone-500 hover:text-rose-700 hover:bg-stone-100 rounded-md cursor-pointer"
                          title="Hapus Rundown"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add / Edit with Unified Tokoh Checklist */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[92vh] overflow-y-auto border border-stone-200 shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-[#00a2e8] text-black">
              <div>
                <h3 className="font-extrabold text-base tracking-tight">
                  {editingItem ? 'Edit Baris Rundown & Tokoh Ziarah' : 'Tambah Baris Rundown & Sinkronkan Tokoh'}
                </h3>
                <p className="text-[11px] text-stone-800 font-medium">
                  Terintegrasi langsung dengan Database Profil Tokoh & Lokasi Makam
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-stone-800 hover:text-black p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4 text-xs sm:text-sm">
              {/* 1. CHECKLIST JENIS AGENDA / AKTIVITAS */}
              <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="font-extrabold text-stone-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <Sliders className="w-4 h-4 text-emerald-700" />
                    <span>Pilihan Jenis Agenda di Lokasi Ini:</span>
                  </label>
                  <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300">
                    {selectedActivities.length} Dipilih
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {RUNDOWN_ACTIVITY_OPTIONS.map((opt) => {
                    const isChecked = selectedActivities.includes(opt.id as any);
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => toggleActivity(opt.id as any)}
                        className={`flex items-center gap-2 p-2.5 rounded-lg border cursor-pointer select-none transition-all text-left ${
                          isChecked
                            ? 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold shadow-2xs ring-1 ring-emerald-300'
                            : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          readOnly
                          className="rounded text-emerald-700 focus:ring-emerald-600 w-3.5 h-3.5 cursor-pointer pointer-events-none"
                        />
                        <span className="text-sm">{opt.icon}</span>
                        <span className="text-xs">{opt.label}</span>
                      </button>
                    );
                  })}
                </div>
                <p className="text-[11px] text-stone-500">
                  {selectedActivities.includes('ziarah')
                    ? '✓ Ziarah aktif: Pilihan makam dan checklist tokoh auliya\' ditampilkan di bawah.'
                    : 'ℹ️ Tanpa Ziarah: Pilihan makam & checklist tokoh dinonaktifkan secara otomatis.'}
                </p>
              </div>

              {/* 2. SUMBER DATA: JIKA ADA ZIARAH, TAMPILKAN MAKAM & CHECKLIST TOKOH */}
              {selectedActivities.includes('ziarah') ? (
                <>
                  {/* PILIH MAKAM / LOKASI */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-stone-50 p-3.5 rounded-xl border border-stone-200">
                    <div className="space-y-1">
                      <label className="font-bold text-stone-900 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-rose-600" />
                        <span>Pilih Makam dari Database:</span>
                      </label>
                      <select
                        value={selectedMakamId}
                        onChange={(e) => handleMakamChange(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs font-medium"
                      >
                        <option value="">-- Lokasi Kustom / Lainnya --</option>
                        {makamList.map((m) => (
                          <option key={m.id} value={m.id}>
                            {m.name} ({m.regency})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-stone-900">
                        Nama Lokasi Tampil di Tabel:
                      </label>
                      <input
                        type="text"
                        value={locationName}
                        onChange={(e) => setLocationName(e.target.value)}
                        placeholder="Misal: Gunungpring Muntilan / Demak"
                        className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs font-semibold"
                        required
                      />
                    </div>
                  </div>

                  {/* CHECKLIST TOKOH AULIYA' & ULAMA' (Single Source of Truth!) */}
                  <div className="bg-emerald-50/60 p-4 rounded-xl border border-emerald-200 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <label className="font-extrabold text-emerald-950 text-xs uppercase tracking-wider flex items-center gap-1.5">
                          <BookOpen className="w-3.5 h-3.5 text-emerald-800" />
                          <span>Checklist Tokoh yang Dikunjungi ({selectedFigureIds.length} Terpilih):</span>
                        </label>
                        <p className="text-[11px] text-stone-600">
                          Centang tokoh yang diziarahi di lokasi ini. Biografi lengkap otomatis tersinkron ke peserta.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => setIsAddingNewTokoh(!isAddingNewTokoh)}
                        className="text-[11px] font-bold text-emerald-800 hover:text-emerald-950 bg-white border border-emerald-300 px-2.5 py-1 rounded-md cursor-pointer shrink-0"
                      >
                        {isAddingNewTokoh ? 'Batal Tambah' : '+ Tambah Tokoh Baru'}
                      </button>
                    </div>

                    {/* Quick Add New Tokoh Form */}
                    {isAddingNewTokoh && (
                      <div className="bg-white p-3 rounded-lg border border-emerald-300 space-y-2 animate-in fade-in">
                        <span className="font-bold text-xs text-stone-800 block">Tambah Tokoh Baru ke Database:</span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <input
                            type="text"
                            value={newTokohName}
                            onChange={(e) => setNewTokohName(e.target.value)}
                            placeholder="Nama Tokoh (misal: Simbah Ky. Raden Santri)"
                            className="px-2.5 py-1.5 bg-stone-50 border border-stone-300 rounded text-xs"
                          />
                          <input
                            type="text"
                            value={newTokohTitle}
                            onChange={(e) => setNewTokohTitle(e.target.value)}
                            placeholder="Gelar / Sebutan kehormatan"
                            className="px-2.5 py-1.5 bg-stone-50 border border-stone-300 rounded text-xs"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={handleAddNewTokohQuick}
                          className="px-3 py-1 bg-emerald-800 text-white font-bold rounded text-xs hover:bg-emerald-900 cursor-pointer"
                        >
                          Simpan & Pilih Tokoh Ini
                        </button>
                      </div>
                    )}

                    {/* Search Tokoh */}
                    <div className="relative">
                      <Search className="w-3 h-3 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={tokohSearch}
                        onChange={(e) => setTokohSearch(e.target.value)}
                        placeholder="Filter daftar tokoh..."
                        className="w-full pl-7 pr-3 py-1 text-xs bg-white border border-stone-300 rounded-md"
                      />
                    </div>

                    {/* Interactive Tokoh Checklist Grid */}
                    <div className="max-h-48 overflow-y-auto space-y-1.5 p-2 bg-white rounded-lg border border-stone-200">
                      {filteredTokohList.map((tokoh) => {
                        const isChecked = selectedFigureIds.includes(tokoh.id);
                        return (
                          <label
                            key={tokoh.id}
                            className={`flex items-center gap-2.5 p-2 rounded-md transition-colors cursor-pointer select-none ${
                              isChecked ? 'bg-emerald-50 border border-emerald-300' : 'hover:bg-stone-50 border border-transparent'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => toggleFigureSelection(tokoh.id)}
                              className="rounded text-emerald-800 focus:ring-emerald-700 w-4 h-4 cursor-pointer"
                            />
                            <div className="min-w-0 flex-1">
                              <div className="font-bold text-xs text-stone-900">{tokoh.name}</div>
                              <div className="text-[10px] text-stone-500 truncate">{tokoh.titleOrHonorific}</div>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                </>
              ) : (
                /* JIKA TIDAK ADA ZIARAH (Makan, Belanja, Istirahat, Mandi, dll) */
                <div className="bg-sky-50/60 p-4 rounded-xl border border-sky-200 space-y-2">
                  <label className="font-bold text-sky-950 text-xs flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-sky-700" />
                    <span>Nama Lokasi / Tempat (Rest Area / Rumah Makan / Pusat Oleh-Oleh / Hotel):</span>
                  </label>
                  <input
                    type="text"
                    value={locationName}
                    onChange={(e) => setLocationName(e.target.value)}
                    placeholder="Misal: Rest Area KM 429 Ungaran / RM Baledono / Pasar Kudus"
                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs font-semibold text-stone-900"
                    required
                  />
                  <p className="text-[11px] text-stone-600">
                    Karena agenda ini bukan ziarah maqbarah, checklist tokoh dan data makam dinonaktifkan secara otomatis.
                  </p>
                </div>
              )}

              {/* 3. RENCANA WAKTU: DI JALAN, MASUK, DI LOKASI, KELUAR */}
              <div className="bg-sky-50/70 p-3.5 rounded-xl border border-sky-200 space-y-3">
                <div className="font-extrabold text-sky-950 text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-sky-700" />
                  <span>Rencana Waktu Sesuai Dokumen</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-semibold text-stone-700 text-xs">Di Jalan (Estimasi)</label>
                    <input
                      type="text"
                      value={travelDuration}
                      onChange={(e) => setTravelDuration(e.target.value)}
                      placeholder="1 Jam 30 Menit (atau -)"
                      className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-stone-700 text-xs">Di Lokasi (Durasi)</label>
                    <input
                      type="text"
                      value={durationAtLocation}
                      onChange={(e) => setDurationAtLocation(e.target.value)}
                      placeholder="1 Jam 0 Menit / 2 Jam 30 Menit"
                      className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-semibold text-stone-700 text-xs">Jam Masuk (Tiba)</label>
                    <input
                      type="text"
                      value={timeIn}
                      onChange={(e) => setTimeIn(e.target.value)}
                      placeholder="10.00 WIB"
                      className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs font-semibold"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-stone-700 text-xs">Jam Keluar (Berangkat)</label>
                    <input
                      type="text"
                      value={timeOut}
                      onChange={(e) => setTimeOut(e.target.value)}
                      placeholder="11.00 WIB"
                      className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs font-semibold"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* 4. AGENDA TAMBAHAN & RINGKASAN */}
              <div className="space-y-1">
                <label className="font-bold text-stone-900 text-xs">
                  Agenda Ibadah & Kegiatan Tambahan di Lokasi:
                </label>
                <textarea
                  value={extraActivitiesText}
                  onChange={(e) => setExtraActivitiesText(e.target.value)}
                  rows={2}
                  placeholder="Sholat Jama' Ta'khir Dzuhur-Ashar di Masjid Santren&#10;Santap siang bersama kuliner rekanan"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs leading-relaxed"
                />
                <span className="text-[11px] text-stone-500">
                  Tip: Satu baris per kegiatan tambahan. Tokoh yang sudah diceklis di atas tidak perlu diketik ulang karena sudah otomatis muncul di rincian ziarah.
                </span>
              </div>

              {/* 5. TANGGAL, HARI & STATUS DI AKHIR TABEL */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="space-y-1">
                  <label className="font-bold text-stone-900 text-xs flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-stone-500" />
                    <span>Hari & Tanggal Pelaksanaan:</span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      min={1}
                      max={7}
                      value={dayNumber}
                      onChange={(e) => setDayNumber(parseInt(e.target.value) || 1)}
                      className="w-16 px-2.5 py-1.5 bg-stone-50 border border-stone-300 rounded-lg text-xs font-bold text-center"
                      title="Hari ke-"
                    />
                    <input
                      type="text"
                      value={dayName}
                      onChange={(e) => setDayName(e.target.value)}
                      placeholder="Selasa, 6 Okt 2026"
                      className="flex-1 px-3 py-1.5 bg-stone-50 border border-stone-300 rounded-lg text-xs font-bold text-stone-900"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-stone-900 text-xs">
                    Status Kegiatan (Kolom Akhir):
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs font-bold"
                  >
                    <option value="selesai">✓ Selesai</option>
                    <option value="berlangsung">▶ Sedang Berlangsung</option>
                    <option value="berikutnya">⏳ Berikutnya (Menunggu)</option>
                  </select>
                </div>
              </div>

              {/* Catatan Teknis */}
              <div className="space-y-1">
                <label className="font-semibold text-stone-700 text-xs">Catatan Teknis Petugas & Santri</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Misal: Naik ojek resmi panitia, bawa buku doa ziarah."
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs"
                />
              </div>

              {/* Footer Actions */}
              <div className="pt-4 border-t border-stone-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-100 rounded-lg cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg shadow-xs cursor-pointer"
                >
                  Simpan Perubahan Rundown
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Quick WhatsApp Preview Modal */}
      {previewWAModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto border border-stone-200 shadow-2xl space-y-4 p-5">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-sm text-stone-900">{previewWAModal.title}</h3>
              </div>
              <button
                onClick={() => setPreviewWAModal(null)}
                className="text-stone-400 hover:text-stone-700 p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              <div className="bg-emerald-50/60 p-3.5 rounded-xl border border-emerald-200 text-xs font-mono whitespace-pre-wrap text-emerald-950 max-h-72 overflow-y-auto leading-relaxed">
                {previewWAModal.content}
              </div>
              <p className="text-[11px] text-stone-500">
                Pesan ini diformat otomatis sesuai template yang dikonfigurasi di menu Pengaturan Situs & WA.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-200">
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(previewWAModal.content);
                  showToast('Teks pesan WhatsApp berhasil disalin!', 'success');
                }}
                className="px-3 py-2 text-xs font-semibold text-stone-700 bg-white border border-stone-300 hover:bg-stone-50 rounded-lg cursor-pointer"
              >
                Salin Teks
              </button>
              <button
                type="button"
                onClick={() => {
                  shareToWhatsApp(previewWAModal.content);
                  showToast('Membuka WhatsApp...', 'success');
                }}
                className="px-4 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Buka WhatsApp</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
