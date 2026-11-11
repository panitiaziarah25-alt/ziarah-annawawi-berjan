import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { PanitiaMember } from '../../types';
import {
  Users,
  Plus,
  Search,
  Edit2,
  Trash2,
  Phone,
  MessageCircle,
  X,
  Save,
} from 'lucide-react';

export const STANDARD_DIVISIONS = [
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

export const AdminPanitiaManager: React.FC = () => {
  const { panitiaList, addPanitia, updatePanitia, deletePanitia, showToast } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDivision, setSelectedDivision] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<PanitiaMember | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [position, setPosition] = useState('');
  const [division, setDivision] = useState<string>('Ketua');
  const [isCustomDivision, setIsCustomDivision] = useState(false);
  const [customDivision, setCustomDivision] = useState('');
  const [phone, setPhone] = useState('');
  const [order, setOrder] = useState<number>(1);
  const [description, setDescription] = useState('');
  const [isContactPublic, setIsContactPublic] = useState(true);

  // Dynamic divisions from standard + custom existing
  const allDivisions = useMemo(() => {
    const set = new Set<string>(STANDARD_DIVISIONS);
    panitiaList.forEach((p) => {
      if (p.division) set.add(p.division);
    });
    return Array.from(set);
  }, [panitiaList]);

  const handleOpenAdd = () => {
    setEditingMember(null);
    setName('');
    setPosition('');
    setDivision('Ketua');
    setIsCustomDivision(false);
    setCustomDivision('');
    setPhone('+62 8');
    setOrder(panitiaList.length + 1);
    setDescription('');
    setIsContactPublic(true);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (member: PanitiaMember) => {
    setEditingMember(member);
    setName(member.name);
    setPosition(member.position);
    if (STANDARD_DIVISIONS.includes(member.division)) {
      setDivision(member.division);
      setIsCustomDivision(false);
      setCustomDivision('');
    } else {
      setDivision('Lainnya');
      setIsCustomDivision(true);
      setCustomDivision(member.division || '');
    }
    setPhone(member.phone);
    setOrder(member.order ?? panitiaList.length + 1);
    setDescription(member.description || '');
    setIsContactPublic(member.isContactPublic !== false);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !position.trim() || !phone.trim()) {
      showToast('Mohon lengkapi nama, jabatan, dan nomor telepon', 'error');
      return;
    }

    const finalDivision = isCustomDivision ? customDivision.trim() : division;
    if (!finalDivision) {
      showToast('Mohon tentukan divisi panitia', 'error');
      return;
    }

    if (editingMember) {
      updatePanitia(editingMember.id, {
        name: name.trim(),
        position: position.trim(),
        division: finalDivision,
        phone: phone.trim(),
        order: Number(order) || 1,
        description: description.trim(),
        isContactPublic,
      });
      showToast('Data panitia berhasil diperbarui', 'success');
    } else {
      addPanitia({
        name: name.trim(),
        position: position.trim(),
        division: finalDivision,
        phone: phone.trim(),
        order: Number(order) || panitiaList.length + 1,
        description: description.trim(),
        isContactPublic,
      });
      showToast('Anggota panitia baru berhasil ditambahkan', 'success');
    }

    setIsModalOpen(false);
  };

  const handleDelete = (id: string, memberName: string) => {
    if (window.confirm(`Yakin ingin menghapus panitia "${memberName}"?`)) {
      deletePanitia(id);
      showToast(`Panitia "${memberName}" telah dihapus`, 'info');
    }
  };

  const filteredPanitia = panitiaList
    .filter((member) => {
      const matchSearch =
        member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.division.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.phone.includes(searchQuery);
      const matchDivision = selectedDivision === 'all' || member.division === selectedDivision;
      return matchSearch && matchDivision;
    })
    .sort((a, b) => (a.order ?? 99) - (b.order ?? 99));

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-stone-200 pb-4">
        <div>
          <h2 className="text-xl font-bold text-stone-900">Kelola Susunan Panitia Ziarah</h2>
          <p className="text-xs text-stone-500">
            Atur data personil panitia, nomor telepon/WhatsApp, divisi, dan urutan tampilan untuk peserta.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg shadow-sm transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4 text-amber-300" />
          <span>Tambah Anggota Panitia</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl border border-stone-200 p-4 shadow-xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama, jabatan, divisi atau nomor HP..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-700"
          />
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs font-medium text-stone-600 whitespace-nowrap">Divisi:</label>
          <select
            value={selectedDivision}
            onChange={(e) => setSelectedDivision(e.target.value)}
            className="px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg text-stone-800 font-medium"
          >
            <option value="all">Semua Divisi ({panitiaList.length})</option>
            {allDivisions.map((div: string) => (
              <option key={div} value={div}>
                {div}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table of Members */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200 text-stone-700 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4 w-12 text-center">Urutan</th>
                <th className="py-3 px-4">Nama & Gelar</th>
                <th className="py-3 px-4">Jabatan</th>
                <th className="py-3 px-4">Divisi</th>
                <th className="py-3 px-4">Kontak WhatsApp / HP</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredPanitia.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-stone-500">
                    Tidak ada anggota panitia yang sesuai pencarian atau filter.
                  </td>
                </tr>
              ) : (
                filteredPanitia.map((member) => (
                  <tr key={member.id} className="hover:bg-stone-50/80 transition-colors">
                    <td className="py-3 px-4 font-bold text-stone-500 text-center">{member.order ?? '-'}</td>
                    <td className="py-3 px-4 font-semibold text-stone-900">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-[11px]">
                          {member.name.charAt(0)}
                        </div>
                        <div>
                          <span>{member.name}</span>
                          {member.description && (
                            <p className="text-[11px] text-stone-500 font-normal">{member.description}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-emerald-900 font-semibold">{member.position}</td>
                    <td className="py-3 px-4 text-stone-700 font-medium">
                      <span className="px-2.5 py-1 rounded-md bg-stone-100 border border-stone-200 text-stone-800 text-[11px] font-semibold">
                        {member.division}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-stone-800">
                      <div className="flex items-center gap-2">
                        <span>{member.phone}</span>
                        <a
                          href={`https://wa.me/${member.phone.replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1 text-emerald-700 hover:text-emerald-900 hover:bg-emerald-50 rounded"
                          title="Buka WhatsApp"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(member)}
                          className="p-1.5 text-stone-600 hover:text-emerald-800 hover:bg-stone-100 rounded cursor-pointer"
                          title="Edit Panitia"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(member.id, member.name)}
                          className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded cursor-pointer"
                          title="Hapus Panitia"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add / Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <h3 className="font-bold text-base text-stone-900">
                {editingMember ? 'Edit Anggota Panitia' : 'Tambah Anggota Panitia'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-stone-400 hover:text-stone-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-stone-700">Nama Lengkap & Gelar</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: Ust. Ahmad Fauzi, M.Pd."
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg text-stone-900"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-stone-700">Jabatan Kepanitiaan</label>
                  <input
                    type="text"
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    placeholder="Contoh: Koordinator Bus 1"
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg text-stone-900"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-stone-700">Nomor Urut Tampil</label>
                  <input
                    type="number"
                    value={order}
                    onChange={(e) => setOrder(parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg text-stone-900"
                    min={1}
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-stone-700">Divisi / Bidang Kepanitiaan</label>
                <select
                  value={isCustomDivision ? 'Lainnya' : division}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === 'Lainnya') {
                      setIsCustomDivision(true);
                    } else {
                      setIsCustomDivision(false);
                      setDivision(val);
                    }
                  }}
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg text-stone-900 font-medium"
                >
                  {STANDARD_DIVISIONS.map((div: string) => (
                    <option key={div} value={div}>
                      {div}
                    </option>
                  ))}
                  <option value="Lainnya">Lainnya (Ketik Manual...)</option>
                </select>

                {isCustomDivision && (
                  <div className="pt-2 space-y-1">
                    <label className="text-[11px] font-semibold text-amber-900 block">
                      Ketik Nama Divisi Manual:
                    </label>
                    <input
                      type="text"
                      value={customDivision}
                      onChange={(e) => setCustomDivision(e.target.value)}
                      placeholder="Contoh: Koordinator Posko Medis, Humas Wali Santri, dll."
                      className="w-full px-3 py-2 text-xs bg-amber-50/70 border border-amber-300 rounded-lg text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                      required
                    />
                    <p className="text-[10px] text-amber-800">
                      *Divisi yang Anda ketik manual akan otomatis tersimpan dan dapat difilter di daftar panitia.
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-stone-700">Nomor Telepon / WhatsApp</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+62 812-3456-7890"
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg font-mono text-stone-900"
                  required
                />
                <p className="text-[11px] text-stone-500">
                  Gunakan format internasional (+62...) agar tombol tautan WhatsApp berfungsi langsung.
                </p>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-stone-700">Catatan / Tanggung Jawab (Opsional)</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Contoh: Penanggung jawab registrasi dan inventaris bus"
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg text-stone-900"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg shadow-sm"
                >
                  <Save className="w-4 h-4" />
                  <span>Simpan Data Panitia</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
