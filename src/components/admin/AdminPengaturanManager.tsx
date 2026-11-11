import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Save, RotateCcw, AlertTriangle, CheckCircle2, MessageSquare, Copy, Sparkles } from 'lucide-react';
import {
  DEFAULT_WA_GREETING,
  DEFAULT_WA_CLOSING,
  DEFAULT_WA_PER_AGENDA_TEMPLATE,
  DEFAULT_WA_ALL_RUNDOWN_INTRO,
} from '../../utils/whatsappShare';

export const AdminPengaturanManager: React.FC = () => {
  const { siteSettings, updateSiteSettings, resetAllData, showToast } = useApp();

  const [siteTitle, setSiteTitle] = useState(siteSettings.siteTitle);
  const [tagline, setTagline] = useState(siteSettings.tagline);
  const [yearMasehi, setYearMasehi] = useState(siteSettings.yearMasehi);
  const [yearHijriah, setYearHijriah] = useState(siteSettings.yearHijriah);
  const [organizer, setOrganizer] = useState(siteSettings.organizer);
  const [headquarters, setHeadquarters] = useState(siteSettings.headquarters);
  const [eventDates, setEventDates] = useState(siteSettings.eventDates);
  const [contactWhatsApp, setContactWhatsApp] = useState(siteSettings.contactWhatsApp);
  const [contactEmail, setContactEmail] = useState(siteSettings.contactEmail);
  const [metaDescription, setMetaDescription] = useState(siteSettings.metaDescription);
  const [heroHeadline, setHeroHeadline] = useState(siteSettings.heroHeadline);
  const [heroSubheadline, setHeroSubheadline] = useState(siteSettings.heroSubheadline);

  // WhatsApp Broadcast & Share Templates
  const [waGreeting, setWaGreeting] = useState(siteSettings.waGreeting || DEFAULT_WA_GREETING);
  const [waClosing, setWaClosing] = useState(siteSettings.waClosing || DEFAULT_WA_CLOSING);
  const [waPerAgendaTemplate, setWaPerAgendaTemplate] = useState(
    siteSettings.waPerAgendaTemplate || DEFAULT_WA_PER_AGENDA_TEMPLATE
  );
  const [waAllRundownIntro, setWaAllRundownIntro] = useState(
    siteSettings.waAllRundownIntro || DEFAULT_WA_ALL_RUNDOWN_INTRO
  );

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSiteSettings({
      siteTitle,
      tagline,
      yearMasehi,
      yearHijriah,
      organizer,
      headquarters,
      eventDates,
      contactWhatsApp,
      contactEmail,
      metaDescription,
      heroHeadline,
      heroSubheadline,
      waGreeting,
      waClosing,
      waPerAgendaTemplate,
      waAllRundownIntro,
    });
    showToast('Pengaturan website dan template pesan WhatsApp berhasil disimpan!', 'success');
  };

  const resetWaTemplate = () => {
    setWaGreeting(DEFAULT_WA_GREETING);
    setWaClosing(DEFAULT_WA_CLOSING);
    setWaPerAgendaTemplate(DEFAULT_WA_PER_AGENDA_TEMPLATE);
    setWaAllRundownIntro(DEFAULT_WA_ALL_RUNDOWN_INTRO);
    showToast('Template WhatsApp dikembalikan ke standar awal.', 'info');
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="border-b border-stone-200 pb-4">
        <h2 className="text-xl font-bold text-stone-900">Pengaturan Umum Website Ziarah</h2>
        <p className="text-xs text-stone-500">
          Sesuaikan judul kegiatan, tahun hijriah/masehi, tanggal safar, identitas pondok, dan kontak hotline.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Identitas Kegiatan */}
        <div className="bg-white rounded-xl border border-stone-200 p-6 space-y-4 shadow-xs">
          <h3 className="font-bold text-sm text-stone-900 border-b border-stone-100 pb-2">
            Identitas & Tajuk Kegiatan
          </h3>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-stone-700">Judul Website</label>
            <input
              type="text"
              value={siteTitle}
              onChange={(e) => setSiteTitle(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-stone-700">Tahun Masehi</label>
              <input
                type="text"
                value={yearMasehi}
                onChange={(e) => setYearMasehi(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-stone-700">Tahun Hijriah</label>
              <input
                type="text"
                value={yearHijriah}
                onChange={(e) => setYearHijriah(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-stone-700">Lembaga Penyelenggara</label>
            <input
              type="text"
              value={organizer}
              onChange={(e) => setOrganizer(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-stone-700">Alamat Sekretariat Pondok</label>
            <input
              type="text"
              value={headquarters}
              onChange={(e) => setHeadquarters(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-stone-700">Rentang Waktu Pelaksanaan</label>
            <input
              type="text"
              value={eventDates}
              onChange={(e) => setEventDates(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg"
              required
            />
          </div>
        </div>

        {/* Teks Hero Banner */}
        <div className="bg-white rounded-xl border border-stone-200 p-6 space-y-4 shadow-xs">
          <h3 className="font-bold text-sm text-stone-900 border-b border-stone-100 pb-2">
            Teks Banner Utama (Hero Frontend)
          </h3>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-stone-700">Subjudul Penjelasan</label>
            <textarea
              value={heroSubheadline}
              onChange={(e) => setHeroSubheadline(e.target.value)}
              rows={2}
              className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg font-serif"
              required
            />
          </div>
        </div>

        {/* Kontak & Hotline */}
        <div className="bg-white rounded-xl border border-stone-200 p-6 space-y-4 shadow-xs">
          <h3 className="font-bold text-sm text-stone-900 border-b border-stone-100 pb-2">
            Kontak Hotline Panitia
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-stone-700">Nomor WhatsApp Resmi</label>
              <input
                type="text"
                value={contactWhatsApp}
                onChange={(e) => setContactWhatsApp(e.target.value)}
                placeholder="+6281234567890"
                className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg font-mono"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-stone-700">Alamat Email Panitia</label>
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg font-mono"
                required
              />
            </div>
          </div>
        </div>

        {/* PENGATURAN TEMPLATE PESAN WHATSAPP (SHARE WA) */}
        <div className="bg-white rounded-xl border border-stone-200 p-6 space-y-4 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-emerald-100 text-emerald-800 rounded-lg">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-stone-900">
                  Format Pesan Siaran WhatsApp (Share WA)
                </h3>
                <p className="text-xs text-stone-500">
                  Atur narasi salam, rincian agenda, catatan, serta salam penutup saat membagikan jadwal ke grup WA santri/jamaah.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={resetWaTemplate}
              className="px-2.5 py-1 text-[11px] font-semibold text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors cursor-pointer self-start sm:self-auto"
            >
              Reset ke Standar
            </button>
          </div>

          {/* Salam Pembuka */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-stone-700">
              1. Salam Pembuka (Greeting):
            </label>
            <input
              type="text"
              value={waGreeting}
              onChange={(e) => setWaGreeting(e.target.value)}
              placeholder="Assalamu'alaikum Warahmatullahi Wabarakatuh..."
              className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg font-medium"
              required
            />
          </div>

          {/* Template Pesan Per Agenda */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-stone-700">
                2. Format Narasi Pesan Per Agenda / Titik Rundown:
              </label>
            </div>
            <textarea
              value={waPerAgendaTemplate}
              onChange={(e) => setWaPerAgendaTemplate(e.target.value)}
              rows={6}
              className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg font-mono text-stone-900 leading-relaxed"
              required
            />
            <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[10px] text-stone-500">
              <span className="font-bold text-stone-700">Tag Otomatis:</span>
              <code className="bg-stone-100 px-1 py-0.5 rounded border border-stone-200">{"{SALAM}"}</code>
              <code className="bg-stone-100 px-1 py-0.5 rounded border border-stone-200">{"{LOKASI}"}</code>
              <code className="bg-stone-100 px-1 py-0.5 rounded border border-stone-200">{"{HARI_TANGGAL}"}</code>
              <code className="bg-stone-100 px-1 py-0.5 rounded border border-stone-200">{"{WAKTU_MASUK}"}</code>
              <code className="bg-stone-100 px-1 py-0.5 rounded border border-stone-200">{"{WAKTU_KELUAR}"}</code>
              <code className="bg-stone-100 px-1 py-0.5 rounded border border-stone-200">{"{DURASI}"}</code>
              <code className="bg-stone-100 px-1 py-0.5 rounded border border-stone-200">{"{KEGIATAN}"}</code>
              <code className="bg-stone-100 px-1 py-0.5 rounded border border-stone-200">{"{TOKOH_SECTION}"}</code>
              <code className="bg-stone-100 px-1 py-0.5 rounded border border-stone-200">{"{CATATAN_SECTION}"}</code>
              <code className="bg-stone-100 px-1 py-0.5 rounded border border-stone-200">{"{LINK_WEBSITE}"}</code>
              <code className="bg-stone-100 px-1 py-0.5 rounded border border-stone-200">{"{PENUTUP}"}</code>
            </div>
          </div>

          {/* Pengantar Semua Rundown */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-stone-700">
              3. Judul Pengantar Share Seluruh Rundown:
            </label>
            <input
              type="text"
              value={waAllRundownIntro}
              onChange={(e) => setWaAllRundownIntro(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg font-medium"
              required
            />
          </div>

          {/* Salam Penutup */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-stone-700">
              4. Salam Penutup / Tanda Tangan Panitia:
            </label>
            <input
              type="text"
              value={waClosing}
              onChange={(e) => setWaClosing(e.target.value)}
              placeholder="Wassalamu'alaikum... _Panitia Ziarah An-Nawawi_"
              className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg font-medium"
              required
            />
          </div>

          {/* Live Preview Box */}
          <div className="bg-emerald-950 text-white rounded-xl p-4 space-y-2 border border-emerald-900 mt-2">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-300 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Pratinjau Hasil Pesan WhatsApp (Live Preview):</span>
            </div>
            <pre className="text-[11px] font-mono whitespace-pre-wrap text-emerald-100 max-h-48 overflow-y-auto bg-emerald-900/60 p-3 rounded-lg border border-emerald-800">
              {waGreeting}
              {"\n\n━━━━━━━━━━━━━━━━━━━━\n📍 *LOKASI:* Maqbarah Sunan Kalijaga Kadilangu\n📅 *HARI/TANGGAL:* Selasa, 6 Okt 2026\n🕒 *WAKTU:* 10.00 WIB - 11.00 WIB\n⏳ *DURASI DI LOKASI:* 1 Jam 0 Menit\n⏱️ *Waktu di Jalan:* 1 Jam 30 Menit\n🕌 *KEGIATAN:* Ziarah Maqbarah, Makan Siang, Mandi & Sholat\n\n👑 *Auliya' & Ulama' yang Diziarahi:*\n  1. Kanjeng Sunan Kalijaga (Raden Mas Said)\n\n📝 *Catatan Khusus Panitia:*\nBawa sandal & kantong plastik wudhu.\n\n🌐 *PANDUAN & RINCIAN LENGKAP:*\nhttps://ziarah-annawawi.id/#/rundown\n━━━━━━━━━━━━━━━━━━━━\n\n"}
              {waClosing}
            </pre>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg shadow-sm transition-colors cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Simpan Pengaturan</span>
          </button>
        </div>
      </form>

      {/* Danger Zone: Reset Data */}
      <div className="bg-rose-50 border border-rose-200 rounded-xl p-6 space-y-3">
        <div className="flex items-center gap-2 text-rose-800">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          <h3 className="font-bold text-sm">Reset Data Demonstrasi</h3>
        </div>
        <p className="text-xs text-rose-700 leading-relaxed">
          Tombol ini akan mengembalikan seluruh data (agenda, rundown, lokasi, tokoh, berita, dan pengaturan) ke kondisi awal demonstrasi Ziarah An-Nawawi 2026.
        </p>
        <button
          type="button"
          onClick={() => {
            if (window.confirm('Yakin ingin mereset seluruh database ke contoh awal? Semua perubahan tersimpan akan ditimpa.')) {
              resetAllData();
            }
          }}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-rose-700 hover:bg-rose-800 rounded-lg transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset ke Data Awal Demo</span>
        </button>
      </div>
    </div>
  );
};
