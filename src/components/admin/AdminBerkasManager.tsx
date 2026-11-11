import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DownloadableDoc } from '../../types';
import {
  FileText,
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  Eye,
  Download,
  Upload,
} from 'lucide-react';

export const AdminBerkasManager: React.FC = () => {
  const { downloadableDocs, addDocument, updateDocument, deleteDocument, openPreviewDoc, showToast } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDoc, setEditingDoc] = useState<DownloadableDoc | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [fileName, setFileName] = useState('');
  const [category, setCategory] = useState<DownloadableDoc['category']>('panduan');
  const [fileSize, setFileSize] = useState('2.5 MB');
  const [description, setDescription] = useState('');
  const [previewContent, setPreviewContent] = useState('');

  const handleOpenAdd = () => {
    setEditingDoc(null);
    setTitle('');
    setFileName('Panduan-Ziarah-2026.pdf');
    setCategory('panduan');
    setFileSize('2.5 MB');
    setDescription('');
    setPreviewContent('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (doc: DownloadableDoc) => {
    setEditingDoc(doc);
    setTitle(doc.title);
    setFileName(doc.fileName);
    setCategory(doc.category);
    setFileSize(doc.fileSize);
    setDescription(doc.description);
    setPreviewContent(doc.previewContent || '');
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !fileName.trim()) {
      showToast('Judul dan nama berkas wajib diisi', 'error');
      return;
    }

    if (editingDoc) {
      updateDocument(editingDoc.id, {
        title: title.trim(),
        fileName: fileName.trim(),
        category,
        fileSize: fileSize.trim() || '1.0 MB',
        description: description.trim(),
        previewContent: previewContent.trim(),
      });
    } else {
      addDocument({
        title: title.trim(),
        fileName: fileName.trim(),
        category,
        fileSize: fileSize.trim() || '1.0 MB',
        description: description.trim(),
        previewContent: previewContent.trim(),
      });
    }

    setIsModalOpen(false);
  };

  const handleDelete = (doc: DownloadableDoc) => {
    if (window.confirm(`Yakin ingin menghapus berkas "${doc.title}"?`)) {
      deleteDocument(doc.id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-stone-200 pb-4">
        <div>
          <h2 className="text-xl font-bold text-stone-900">Kelola Berkas & Dokumen Peserta</h2>
          <p className="text-xs text-stone-500">
            Unggah dan kelola berkas resmi (PDF, panduan, denah bus, surat izin) yang dapat diunduh dan dipratinjau peserta.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg shadow-sm transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4 text-amber-300" />
          <span>Tambah Dokumen Baru</span>
        </button>
      </div>

      {/* Documents Table */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-stone-200 flex items-center justify-between">
          <h4 className="font-bold text-xs uppercase tracking-wider text-stone-700">
            Daftar Berkas Terpublikasi ({downloadableDocs.length} Berkas)
          </h4>
        </div>

        <div className="divide-y divide-stone-100">
          {downloadableDocs.map((doc) => (
            <div key={doc.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-stone-50/80 transition-colors">
              <div className="space-y-1 flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-sm bg-emerald-100 text-emerald-900">
                    {doc.category}
                  </span>
                  <span className="text-[11px] text-stone-500 font-mono">
                    {doc.fileSize}
                  </span>
                  <span className="text-[11px] text-stone-400">
                    · {doc.uploadedAt}
                  </span>
                </div>
                <h5 className="font-bold text-sm text-stone-900 truncate">
                  {doc.title}
                </h5>
                <p className="text-xs text-stone-500 font-mono truncate">
                  {doc.fileName}
                </p>
                <p className="text-xs text-stone-600 line-clamp-2">
                  {doc.description}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => openPreviewDoc(doc)}
                  className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-emerald-900 bg-emerald-50 hover:bg-emerald-100 rounded-lg cursor-pointer"
                  title="Lihat Pratinjau"
                >
                  <Eye className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Preview</span>
                </button>
                <button
                  onClick={() => handleOpenEdit(doc)}
                  className="p-1.5 text-stone-600 hover:text-emerald-800 hover:bg-stone-100 rounded-lg cursor-pointer"
                  title="Edit Berkas"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(doc)}
                  className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                  title="Hapus Berkas"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Add / Edit Document */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <h3 className="font-bold text-base text-stone-900">
                {editingDoc ? 'Edit Data Berkas Dokumen' : 'Tambah Berkas Dokumen Baru'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-stone-700">Judul Dokumen</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Contoh: Denah Kursi 10 Armada Bus..."
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg text-stone-900"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-stone-700">Nama Berkas (File Name)</label>
                  <input
                    type="text"
                    value={fileName}
                    onChange={(e) => setFileName(e.target.value)}
                    placeholder="Contoh: Denah-Bus-2026.pdf"
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg font-mono text-stone-900"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-stone-700">Kategori</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as DownloadableDoc['category'])}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg text-stone-900"
                  >
                    <option value="panduan">Buku Panduan</option>
                    <option value="denah">Denah Bus & Kursi</option>
                    <option value="surat">Surat Izin / Edaran</option>
                    <option value="sop">SOP Medis & Keamanan</option>
                    <option value="jadwal">Jadwal Saku</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-stone-700">Estimasi Ukuran File</label>
                <input
                  type="text"
                  value={fileSize}
                  onChange={(e) => setFileSize(e.target.value)}
                  placeholder="Contoh: 3.2 MB"
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg text-stone-900"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-stone-700">Ringkasan Keterangan</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Uraian singkat isi berkas..."
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg text-stone-900"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-stone-700">
                  Isi Teks Dokumen untuk Pratinjau (Preview) Langsung di HP
                </label>
                <textarea
                  value={previewContent}
                  onChange={(e) => setPreviewContent(e.target.value)}
                  placeholder="Tulis atau paste isi teks dokumen agar peserta bisa membaca langsung..."
                  rows={5}
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg text-stone-900 font-mono leading-relaxed"
                />
                <p className="text-[11px] text-stone-500">
                  Teks ini yang akan ditampilkan saat peserta menekan tombol "Preview / Baca" di HP.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-200">
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
                  <span>Simpan Berkas Dokumen</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
