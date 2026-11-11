import { RundownItem, SiteSettings, Tokoh, MakamLokasi } from '../types';

export const DEFAULT_WA_GREETING = "Assalamu'alaikum Warahmatullahi Wabarakatuh\n*INFORMASI RESMI SAFAR ZIARAH AN-NAWAWI 2026*";

export const DEFAULT_WA_CLOSING = "Wassalamu'alaikum Warahmatullahi Wabarakatuh\n_Panitia Ziarah Pondok Pesantren An-Nawawi Berjan Purworejo_";

export const DEFAULT_WA_PER_AGENDA_TEMPLATE = `{SALAM}

━━━━━━━━━━━━━━━━━━━━
📍 *LOKASI:* {LOKASI}
📅 *HARI/TANGGAL:* {HARI_TANGGAL}
🕒 *WAKTU:* {WAKTU_MASUK} - {WAKTU_KELUAR}
⏳ *DURASI DI LOKASI:* {DURASI}
{WAKTU_JALAN_LINE}
🕌 *KEGIATAN:* {KEGIATAN}
{TOKOH_SECTION}
{CATATAN_SECTION}
🌐 *PANDUAN & RINCIAN LENGKAP:*
{LINK_WEBSITE}
━━━━━━━━━━━━━━━━━━━━

{PENUTUP}`;

export const DEFAULT_WA_ALL_RUNDOWN_INTRO = `*JADWAL LENGKAP RUNDOWN SAFAR ZIARAH AN-NAWAWI 2026*
_Pondok Pesantren An-Nawawi Berjan Purworejo_`;

export const formatPerAgendaWAMessage = (
  item: RundownItem,
  settings: SiteSettings,
  tokohList: Tokoh[],
  makamList: MakamLokasi[]
): string => {
  const greeting = settings.waGreeting || DEFAULT_WA_GREETING;
  const closing = settings.waClosing || DEFAULT_WA_CLOSING;
  const template = settings.waPerAgendaTemplate || DEFAULT_WA_PER_AGENDA_TEMPLATE;

  // Resolve Tokoh
  const figures = item.figureIds
    ? item.figureIds.map((id) => tokohList.find((t) => t.id === id)).filter(Boolean)
    : [];

  const figuresText =
    figures.length > 0
      ? figures.map((f, idx) => `  ${idx + 1}. ${f?.name} (${f?.titleOrHonorific})`).join('\n')
      : '';

  const tokohSection = figures.length > 0 ? `\n👑 *Auliya' & Ulama' yang Diziarahi:*\n${figuresText}` : '';

  // Activities
  const activitiesList: string[] = [];
  if (item.activity) activitiesList.push(item.activity);
  if (item.subActivities && item.subActivities.length > 0) {
    activitiesList.push(...item.subActivities);
  }
  const kegiatanText = activitiesList.join(', ');

  const waktuMasuk = item.timeIn || item.time?.split('-')[0]?.trim() || '-';
  const waktuKeluar = item.timeOut || item.time?.split('-')[1]?.trim() || '-';
  const durasi = item.durationAtLocation || item.duration || '-';
  const waktuJalanLine =
    item.travelDuration && item.travelDuration !== '-'
      ? `⏱️ *Waktu di Jalan:* ${item.travelDuration}\n`
      : '';

  const catatanSection = item.notes ? `\n📝 *Catatan Khusus Panitia:*\n${item.notes}\n` : '';

  // App Link
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://ziarah-annawawi.id';
  const link = `${origin}/#/rundown`;

  let message = template
    .replace('{SALAM}', greeting)
    .replace('{LOKASI}', item.location)
    .replace('{HARI_TANGGAL}', `${item.dayName}`)
    .replace('{WAKTU_MASUK}', waktuMasuk)
    .replace('{WAKTU_KELUAR}', waktuKeluar)
    .replace('{DURASI}', durasi)
    .replace('{WAKTU_JALAN_LINE}', waktuJalanLine)
    .replace('{KEGIATAN}', kegiatanText)
    .replace('{TOKOH_SECTION}', tokohSection)
    .replace('{CATATAN_SECTION}', catatanSection)
    .replace('{LINK_WEBSITE}', link)
    .replace('{PENUTUP}', closing);

  // Clean double blank lines
  return message.replace(/\n{3,}/g, '\n\n').trim();
};

export const formatAllRundownWAMessage = (
  rundownList: RundownItem[],
  settings: SiteSettings,
  tokohList: Tokoh[],
  filterDay: number | 'all' = 'all'
): string => {
  const greeting = settings.waGreeting || DEFAULT_WA_GREETING;
  const closing = settings.waClosing || DEFAULT_WA_CLOSING;
  const intro = settings.waAllRundownIntro || DEFAULT_WA_ALL_RUNDOWN_INTRO;

  const filtered = rundownList
    .filter((r) => (filterDay === 'all' ? true : r.dayNumber === filterDay))
    .sort((a, b) => a.order - b.order);

  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://ziarah-annawawi.id';
  const link = `${origin}/#/rundown`;

  const lines: string[] = [greeting, '', intro, '━━━━━━━━━━━━━━━━━━━━'];

  if (filterDay !== 'all') {
    lines.push(`📅 *JADWAL HARI KE-${filterDay}*`);
  }

  filtered.forEach((item, idx) => {
    const waktuMasuk = item.timeIn || item.time?.split('-')[0]?.trim() || '-';
    const waktuKeluar = item.timeOut || item.time?.split('-')[1]?.trim() || '-';
    const durasi = item.durationAtLocation || item.duration || '-';

    lines.push(`\n*${idx + 1}. ${item.location.toUpperCase()}* (${item.dayName})`);
    if (item.travelDuration && item.travelDuration !== '-') {
      lines.push(`⏱️ Di Jalan: ${item.travelDuration}`);
    }
    lines.push(`🕒 Waktu: ${waktuMasuk} - ${waktuKeluar} (Durasi: ${durasi})`);
    lines.push(`🕌 Kegiatan: ${item.activity}`);

    if (item.figureIds && item.figureIds.length > 0) {
      const names = item.figureIds
        .map((fId) => tokohList.find((t) => t.id === fId)?.name)
        .filter(Boolean);
      if (names.length > 0) {
        lines.push(`👑 Maqbarah: ${names.join(', ')}`);
      }
    }

    if (item.subActivities && item.subActivities.length > 0) {
      lines.push(`📝 Tambahan: ${item.subActivities.join(' · ')}`);
    }

    const statusBadge =
      item.status === 'selesai'
        ? '✅ Selesai'
        : item.status === 'berlangsung'
        ? '▶️ SEDANG BERLANGSUNG'
        : '⏳ Menunggu';
    lines.push(`Status: ${statusBadge}`);
  });

  lines.push('━━━━━━━━━━━━━━━━━━━━');
  lines.push(`🌐 *Website & Peta Rute Lengkap:*`);
  lines.push(link);
  lines.push('');
  lines.push(closing);

  return lines.join('\n');
};

export const getWhatsAppUrl = (text: string): string => {
  return `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
};

export const shareToWhatsApp = (text: string) => {
  const url = getWhatsAppUrl(text);
  const a = document.createElement('a');
  a.href = url;
  a.target = '_blank';
  a.rel = 'noopener noreferrer';
  document.body.appendChild(a);
  a.click();
  a.remove();
};
