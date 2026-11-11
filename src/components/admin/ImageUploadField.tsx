import React, { useRef, useState } from 'react';
import { Upload, Image as ImageIcon, X, Link, Check, RefreshCw } from 'lucide-react';
import { compressImageFile } from '../../utils/imageUpload';

interface ImageUploadFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  description?: string;
  placeholder?: string;
  aspectRatioClass?: string;
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  presets?: Array<{ label: string; url: string }>;
}

export const ImageUploadField: React.FC<ImageUploadFieldProps> = ({
  label,
  value,
  onChange,
  description,
  placeholder = 'https://... atau pilih foto dari perangkat',
  aspectRatioClass = 'aspect-16/9',
  maxWidth = 1000,
  maxHeight = 1000,
  quality = 0.75,
  presets,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsProcessing(true);
      setErrorMsg(null);
      const dataUrl = await compressImageFile(file, maxWidth, maxHeight, quality);
      onChange(dataUrl);
    } catch (err: any) {
      console.error('Error compressing image:', err);
      setErrorMsg(err.message || 'Gagal memproses gambar. Pastikan file berupa gambar.');
    } finally {
      setIsProcessing(false);
      // reset file input value so user can re-select same file if needed
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const isDataUrl = value && value.startsWith('data:image/');

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="font-semibold text-xs text-stone-800 flex items-center gap-1.5">
          <ImageIcon className="w-3.5 h-3.5 text-emerald-700" />
          <span>{label}</span>
        </label>
        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="text-[11px] text-emerald-700 hover:text-emerald-900 flex items-center gap-1 cursor-pointer font-medium"
        >
          <Link className="w-3 h-3" />
          <span>{showUrlInput ? 'Tutup Input URL' : 'Input URL / Link'}</span>
        </button>
      </div>

      {description && <p className="text-[11px] text-stone-500">{description}</p>}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Main Upload Box & Preview */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
        {/* Preview Container */}
        <div className="sm:col-span-5 relative group">
          <div
            className={`w-full ${aspectRatioClass} rounded-xl overflow-hidden border border-stone-200 bg-stone-100 flex items-center justify-center relative shadow-xs`}
          >
            {value ? (
              <img
                src={value}
                alt="Preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="%23999" stroke-width="1.5"><rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>';
                }}
              />
            ) : (
              <div className="text-center p-3 text-stone-400 flex flex-col items-center gap-1">
                <ImageIcon className="w-8 h-8 stroke-1" />
                <span className="text-[10px]">Belum ada foto</span>
              </div>
            )}

            {isProcessing && (
              <div className="absolute inset-0 bg-black/50 backdrop-blur-xs flex flex-col items-center justify-center text-white gap-2 text-xs font-semibold">
                <RefreshCw className="w-5 h-5 animate-spin text-emerald-400" />
                <span>Mengompres Foto...</span>
              </div>
            )}
          </div>

          {value && (
            <button
              type="button"
              onClick={() => onChange('')}
              className="absolute top-1.5 right-1.5 p-1 bg-stone-900/70 hover:bg-rose-600 text-white rounded-full transition-colors cursor-pointer shadow-sm"
              title="Hapus foto"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Action Buttons & Cloud Sync info */}
        <div className="sm:col-span-7 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isProcessing}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-emerald-900 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-lg shadow-2xs transition-colors cursor-pointer disabled:opacity-50"
            >
              <Upload className="w-3.5 h-3.5 text-emerald-700" />
              <span>Unggah dari HP / Laptop</span>
            </button>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] text-stone-500">
            {isDataUrl ? (
              <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                <Check className="w-3 h-3 text-emerald-600" />
                Sinkron Cloud Firestore (Tersimpan & Tampil di Semua Perangkat)
              </span>
            ) : (
              <span className="text-stone-500">
                💡 Foto otomatis terkompresi ringan agar tersinkronisasi instan ke seluruh perangkat jamaah.
              </span>
            )}
          </div>

          {errorMsg && (
            <p className="text-[11px] text-rose-600 font-medium">{errorMsg}</p>
          )}

          {/* Optional manual URL input */}
          {showUrlInput && (
            <div className="pt-1.5">
              <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full px-3 py-1.5 text-xs bg-stone-50 border border-stone-300 rounded-lg text-stone-900 font-mono"
              />
            </div>
          )}
        </div>
      </div>

      {/* Preset thumbnails if provided */}
      {presets && presets.length > 0 && (
        <div className="space-y-1.5 pt-2 border-t border-stone-100">
          <span className="text-[10px] font-semibold text-stone-500 uppercase tracking-wider block">
            Atau Pilih Preset Gambar Bawaan:
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {presets.map((preset, idx) => {
              const isSelected = value === preset.url;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => onChange(preset.url)}
                  className={`p-1.5 rounded-lg border text-left cursor-pointer transition-all flex items-center gap-2 ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-50 ring-1 ring-emerald-600'
                      : 'border-stone-200 bg-white hover:border-stone-300'
                  }`}
                >
                  <img
                    src={preset.url}
                    alt={preset.label}
                    className="w-8 h-8 rounded object-cover shrink-0 border border-stone-200"
                  />
                  <span className="text-[11px] font-medium text-stone-800 truncate">
                    {preset.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
