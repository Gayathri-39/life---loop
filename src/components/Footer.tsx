import React, { useRef } from 'react';
import { Layers, Upload, RotateCcw, Heart, Sparkles, Github } from 'lucide-react';
import { Receipt } from '../types';
import { playClick } from '../utils/soundEffects';

interface FooterProps {
  onResetData: () => void;
  onImportData: (receipts: Receipt[]) => void;
  isCustomData: boolean;
}

export const Footer: React.FC<FooterProps> = ({
  onResetData,
  onImportData,
  isCustomData,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = event => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (Array.isArray(json)) {
          onImportData(json);
          playClick();
        } else {
          alert('Invalid JSON: expected an array of receipt objects.');
        }
      } catch (err) {
        alert('Could not parse JSON file.');
      }
    };
    reader.readAsText(file);
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
          <div className="flex items-center gap-3">
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              type="button"
              id="btn-upload-custom-dataset"
              onClick={() => {
                playClick();
                fileInputRef.current?.click();
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#DDD6CA] bg-white hover:bg-[#F2ECE1] text-[#161D26] font-medium transition-colors"
              title="Replace sample dataset with your own receipts JSON"
            >
              <Upload className="w-3.5 h-3.5 text-[#2B6CB0]" />
              <span>{isCustomData ? 'Load Different JSON' : 'Import Custom Dataset'}</span>
            </button>

            {isCustomData && (
              <button
                type="button"
                id="btn-reset-default-data"
                onClick={() => {
                  playClick();
                  onResetData();
                }}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-[#FAF0E6] text-[#A05A2C] border border-[#F0DFD1] hover:bg-[#FCEADE] transition-colors"
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
