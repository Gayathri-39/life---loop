import React, { useRef } from 'react';
import { Layers, Upload, Download, RotateCcw, Sparkles } from 'lucide-react';
import { Receipt } from '../types';
import { playClick, playConnectHarmonics } from '../utils/soundEffects';
import { useToast } from './Toast';

interface FooterProps {
  onResetData: () => void;
  onImportData: (receipts: Receipt[]) => void;
  isCustomData: boolean;
  currentReceipts: Receipt[];
}

export const Footer: React.FC<FooterProps> = ({
  onResetData,
  onImportData,
  isCustomData,
  currentReceipts,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { showToast } = useToast();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = event => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (!Array.isArray(json)) {
          showToast(
            'Invalid Dataset Format',
            'Expected a JSON file containing an array of receipt objects.',
            'error'
          );
          return;
        }

        // Basic validation of receipts
        const validReceipts = json.filter(
          item =>
            item &&
            typeof item === 'object' &&
            item.title &&
            item.type &&
            item.date &&
            item.time
        ) as Receipt[];

        if (validReceipts.length === 0) {
          showToast(
            'No Valid Receipts Found',
            'Every receipt must have at least title, type, date, and time fields.',
            'error'
          );
          return;
        }

        // Ensure unique sequential IDs if missing
        const formatted = validReceipts.map((r, idx) => ({
          ...r,
          id: typeof r.id === 'number' ? r.id : idx + 1,
          keywords: Array.isArray(r.keywords) ? r.keywords : [r.type, r.location || 'everyday'],
        }));

        onImportData(formatted);
        playConnectHarmonics();
        showToast(
          'Dataset Imported Successfully',
          `Loaded ${formatted.length} digital life records into the Connection Engine.`,
          'success'
        );
      } catch {
        showToast('Parse Error', 'Could not parse JSON file. Please verify syntax.', 'error');
      }
    };
    reader.readAsText(file);
    // Reset file input value so user can upload same file again if modified
    e.target.value = '';
  };

  const handleExport = () => {
    playClick();
    try {
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(currentReceipts, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', `lifeloop-receipts-${Date.now()}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      showToast(
        'Dataset Exported',
        `Downloaded ${currentReceipts.length} receipts to lifeloop-receipts.json`,
        'success'
      );
    } catch {
      showToast('Export Failed', 'Could not export dataset to JSON.', 'error');
    }
  };

  return (
    <footer className="bg-[#FAF9F5] border-t border-[#E7E2DA] py-12 text-[#6B7280] text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo & Tagline */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#161D26] text-[#FAF9F5] flex items-center justify-center">
              <Layers className="w-4 h-4 text-[#E8DFD0]" />
            </div>
            <div>
              <span className="font-bold text-sm text-[#161D26] tracking-tight font-['Plus_Jakarta_Sans']">
                LIFELOOP
              </span>
              <p className="text-[11px] text-[#8C8275]">
                "Hundreds of moments. One story."
              </p>
            </div>
          </div>

          {/* Dataset Customization (Built for Hackathon judges & test data replacement) */}
          <div className="flex flex-wrap items-center gap-2.5">
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              className="hidden"
              aria-label="Upload receipts JSON"
            />
            <button
              type="button"
              id="btn-upload-custom-dataset"
              onClick={() => {
                playClick();
                fileInputRef.current?.click();
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#DDD6CA] bg-white hover:bg-[#F2ECE1] text-[#161D26] font-medium transition-colors"
              title="Upload your own custom receipts JSON to test the engine"
            >
              <Upload className="w-3.5 h-3.5 text-[#2B6CB0]" />
              <span>{isCustomData ? 'Load Different JSON' : 'Import Custom Dataset'}</span>
            </button>

            <button
              type="button"
              id="btn-export-dataset"
              onClick={handleExport}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#DDD6CA] bg-white hover:bg-[#F2ECE1] text-[#161D26] font-medium transition-colors"
              title="Download current dataset as JSON"
            >
              <Download className="w-3.5 h-3.5 text-[#10B981]" />
              <span>Export JSON ({currentReceipts.length})</span>
            </button>

            {isCustomData && (
              <button
                type="button"
                id="btn-reset-default-data"
                onClick={() => {
                  playClick();
                  onResetData();
                  showToast('Sample Data Restored', 'Reverted to the 52 curated demo moments.', 'info');
                }}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-[#FAF0E6] text-[#A05A2C] border border-[#F0DFD1] hover:bg-[#FCEADE] transition-colors"
                title="Revert back to the 52 default hackathon receipts"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset to Sample Data</span>
              </button>
            )}
          </div>
        </div>

        <div className="pt-6 border-t border-[#EAE5DC] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
          <p>
            Built for the 6-hour Frontend Hackathon Challenge • 100% Client-Side Engine • No Backend Required
          </p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              Raw Data <Sparkles className="w-3 h-3 text-[#D4AF37]" /> Insights <Sparkles className="w-3 h-3 text-[#D4AF37]" /> Connections <Sparkles className="w-3 h-3 text-[#D4AF37]" /> Story
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

