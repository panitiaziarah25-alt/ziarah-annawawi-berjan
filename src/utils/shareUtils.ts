export interface ShareData {
  title: string;
  summary: string;
  url: string;
  image?: string;
  category?: string;
}

export function formatWhatsAppMessage(data: ShareData): string {
  return `Assalamu'alaikum Warahmatullahi Wabarakatuh.

Berikut informasi Ziarah An-Nawawi 2026:

*${data.title}*

${data.summary}

Selengkapnya kunjungi:
${data.url}

Wassalamu'alaikum Warahmatullahi Wabarakatuh.`;
}

export function getWhatsAppShareUrl(data: ShareData): string {
  const text = formatWhatsAppMessage(data);
  return `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
}

export function getTelegramShareUrl(data: ShareData): string {
  return `https://t.me/share/url?url=${encodeURIComponent(data.url)}&text=${encodeURIComponent(data.title + ' - ' + data.summary)}`;
}

export function getFacebookShareUrl(data: ShareData): string {
  return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(data.url)}`;
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      textArea.style.top = "-999999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const successful = document.execCommand("copy");
      textArea.remove();
      return successful;
    }
  } catch (err) {
    console.error("Gagal menyalin tautan", err);
    return false;
  }
}

export async function triggerNativeShare(data: ShareData): Promise<boolean> {
  if (navigator.share) {
    try {
      await navigator.share({
        title: data.title,
        text: data.summary,
        url: data.url,
      });
      return true;
    } catch {
      return false;
    }
  }
  return false;
}
