import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  Copy,
  Check,
  Share2,
  ExternalLink,
  MessageSquareShare,
  Send,
  Facebook,
} from 'lucide-react';
import {
  getWhatsAppShareUrl,
  getTelegramShareUrl,
  getFacebookShareUrl,
  copyToClipboard,
  triggerNativeShare,
  formatWhatsAppMessage,
} from '../../utils/shareUtils';

export const ShareModal: React.FC = () => {
  const { shareModalData, closeShareModal, showToast, siteSettings } = useApp();
  const [copied, setCopied] = useState(false);

  if (!shareModalData) return null;

  const currentUrl = shareModalData.url || window.location.href;
  const effectiveImage =
    shareModalData.image ||
    siteSettings?.heroImageUrl ||
    siteSettings?.logoUrl ||
    '/src/assets/images/hero_ziarah_annawawi_1794285626739.jpg';

  const dataWithUrl = { ...shareModalData, url: currentUrl, image: effectiveImage };

  // Sync Open Graph & Twitter Card dynamic tags for scrapers
  React.useEffect(() => {
    if (shareModalData) {
      const ogImg = document.querySelector('meta[property="og:image"]');
      if (ogImg) ogImg.setAttribute('content', effectiveImage);
      const twImg = document.querySelector('meta[name="twitter:image"]');
      if (twImg) twImg.setAttribute('content', effectiveImage);
      const ogTitle = document.querySelector('meta[property="og:title"]');
      if (ogTitle) ogTitle.setAttribute('content', shareModalData.title);
      const ogDesc = document.querySelector('meta[property="og:description"]');
      if (ogDesc) ogDesc.setAttribute('content', shareModalData.summary);
    }
  }, [shareModalData, effectiveImage]);

  const handleCopy = async () => {
    const success = await copyToClipboard(currentUrl);
    if (success) {
      setCopied(true);
      showToast('Tautan berhasil disalin ke clipboard!', 'success');
      setTimeout(() => setCopied(false), 2500);
    } else {
      showToast('Gagal menyalin tautan', 'error');
    }
  };

  const handleNativeShare = async () => {
    const success = await triggerNativeShare(dataWithUrl);
    if (success) {
      closeShareModal();
    }
  };

  const previewMessage = formatWhatsAppMessage(dataWithUrl);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full border border-stone-200 overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100 bg-emerald-900 text-white shrink-0">
          <div className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-amber-300" />
            <h3 className="font-semibold text-base">Bagikan Informasi Ziarah</h3>
          </div>
          <button
            onClick={closeShareModal}
            className="text-emerald-200 hover:text-white p-1 rounded-md transition-colors cursor-pointer"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4 overflow-y-auto">
          {/* Visual Card Image Preview (Foto yang Disertakan ke WhatsApp) */}
          <div className="relative rounded-xl overflow-hidden border border-stone-200 bg-stone-900 aspect-16/9 shadow-xs group">
            <img
              src={effectiveImage}
              alt={shareModalData.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  '/src/assets/images/hero_ziarah_annawawi_1794285626739.jpg';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-3 text-white">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300">
                {shareModalData.image ? 'Foto Khusus Konten Ini' : 'Foto Sampul Resmi Ziarah'}
              </span>
              <span className="font-bold text-xs sm:text-sm line-clamp-1">
                {shareModalData.title}
              </span>
            </div>
          </div>

          {/* Target Title & Summary */}
          <div>
            <h4 className="text-base font-bold text-stone-900 leading-snug">
              {shareModalData.title}
            </h4>
            <p className="text-xs text-stone-600 mt-1 line-clamp-2">
              {shareModalData.summary}
            </p>
          </div>

          {/* Share Action Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {/* WhatsApp */}
            <a
              href={getWhatsAppShareUrl(dataWithUrl)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-3 py-2.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors shadow-xs"
            >
              <MessageSquareShare className="w-4 h-4" />
              <span>WhatsApp</span>
            </a>

            {/* Telegram */}
            <a
              href={getTelegramShareUrl(dataWithUrl)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-3 py-2.5 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-lg transition-colors shadow-xs"
            >
              <Send className="w-4 h-4" />
              <span>Telegram</span>
            </a>

            {/* Facebook */}
            <a
              href={getFacebookShareUrl(dataWithUrl)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-3 py-2.5 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors shadow-xs"
            >
              <Facebook className="w-4 h-4" />
              <span>Facebook</span>
            </a>
          </div>

          {/* Native Share button if available */}
          {typeof navigator !== 'undefined' && 'share' in navigator && (
            <button
              onClick={handleNativeShare}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 border border-stone-200 rounded-lg transition-colors cursor-pointer"
            >
              <ExternalLink className="w-4 h-4 text-stone-600" />
              <span>Gunakan Menu Berbagi Bawaan Perangkat</span>
            </button>
          )}

          {/* Copy Link Input Bar */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-stone-700">Tautan Langsung (Permalink)</label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={currentUrl}
                className="flex-1 text-xs bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-stone-700 focus:outline-hidden"
              />
              <button
                type="button"
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg transition-colors cursor-pointer shrink-0"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Tersalin' : 'Salin'}</span>
              </button>
            </div>
          </div>

          {/* Message Preview Accordion */}
          <div className="bg-emerald-50/70 border border-emerald-100 rounded-lg p-3 text-xs text-stone-700 space-y-1">
            <span className="font-semibold text-emerald-900">Format Pesan WhatsApp Otomatis:</span>
            <pre className="text-xs text-stone-600 whitespace-pre-wrap font-sans bg-white p-2.5 rounded border border-emerald-200/60 max-h-32 overflow-y-auto leading-relaxed">
              {previewMessage}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
