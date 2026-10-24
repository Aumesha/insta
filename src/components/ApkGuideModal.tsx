import React, { useState } from 'react';
import { X, Github, Smartphone, Download, Copy, Check, Terminal, ExternalLink, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Language } from '../types';

interface ApkGuideModalProps {
  lang: Language;
  onClose: () => void;
}

export const ApkGuideModal: React.FC<ApkGuideModalProps> = ({ lang, onClose }) => {
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const gitCommands = `# 1. Add and commit all changes
git add .
git commit -m "Add InstaLink AutoDM with Android APK workflow"

# 2. Push to GitHub
git push origin main`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl my-8 bg-[#121622] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                {lang === 'kn' ? 'GitHub ನಲ್ಲಿ Android APK ರಚಿಸುವ ವಿಧಾನ' : 'Build Android APK in GitHub Actions'}
              </h2>
              <p className="text-xs text-slate-400">
                {lang === 'kn' ? 'ಯಾವುದೇ ದೋಷವಿಲ್ಲದೆ ಆಟೋಮ್ಯಾಟಿಕ್ ಆಗಿ APK ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ' : 'Automated CI/CD pipeline using Capacitor & GitHub Actions'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-5 max-h-[75vh] overflow-y-auto text-xs">
          {/* Status highlight */}
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-emerald-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{lang === 'kn' ? 'Capacitor ಮತ್ತು GitHub Workflow ಯಶಸ್ವಿಯಾಗಿ ಕಾನ್ಫಿಗರ್ ಆಗಿದೆ!' : 'Capacitor & GitHub Workflow Ready!'}</span>
            </div>
            <p className="text-[11px] text-emerald-300/90 leading-relaxed">
              {lang === 'kn'
                ? 'ನಿಮ್ಮ ಪ್ರಾಜೆಕ್ಟ್‌ನಲ್ಲಿ `.github/workflows/build-apk.yml` ಮತ್ತು `capacitor.config.json` ಫೈಲ್‌ಗಳನ್ನು ಈಗಾಗಲೇ ರಚಿಸಲಾಗಿದೆ. ನೀವು ಕೋಡ್ ಅನ್ನು GitHub ಗೆ ಪುಶ್ ಮಾಡಿದ ತಕ್ಷಣ APK ಬಿಲ್ಡ್ ಸ್ವಯಂಚಾಲಿತವಾಗಿ ರನ್ ಆಗುತ್ತದೆ.'
                : 'The files `.github/workflows/build-apk.yml` and `capacitor.config.json` have been configured. When you push to GitHub, the APK builds automatically.'}
            </p>
          </div>

          {/* Step 1 */}
          <div className="space-y-2 p-3.5 rounded-xl bg-black/40 border border-white/5">
            <div className="flex items-center gap-2 font-bold text-white text-xs">
              <span className="w-5 h-5 rounded-full bg-rose-500 text-white flex items-center justify-center text-[10px]">1</span>
              <span>{lang === 'kn' ? 'ಕೋಡ್ ಅನ್ನು GitHub ಗೆ ಪುಶ್ ಮಾಡಿ (Git Push)' : 'Push Code to GitHub'}</span>
            </div>
            <div className="relative">
              <pre className="p-2.5 rounded-lg bg-black text-slate-300 font-mono text-[11px] overflow-x-auto">
                {gitCommands}
              </pre>
              <button
                onClick={() => handleCopy(gitCommands, 'git')}
                className="absolute right-2 top-2 px-2 py-1 rounded bg-white/10 hover:bg-white/20 text-white text-[10px] flex items-center gap-1"
              >
                {copied === 'git' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied === 'git' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {/* Step 2 */}
          <div className="space-y-1.5 p-3.5 rounded-xl bg-black/40 border border-white/5">
            <div className="flex items-center gap-2 font-bold text-white text-xs">
              <span className="w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center text-[10px]">2</span>
              <span>{lang === 'kn' ? 'GitHub Actions ಟ್ಯಾಬ್ ತೆರೆಯಿರಿ' : 'Go to GitHub Actions Tab'}</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              {lang === 'kn'
                ? 'ನಿಮ್ಮ GitHub ರೆಪೊಸಿಟರಿಯಲ್ಲಿ ಮೇಲೆ ಇರುವ "Actions" ಟ್ಯಾಬ್ ಮೇಲೆ ಕ್ಲಿಕ್ ಮಾಡಿ. ಅಲ್ಲಿ "Build Android APK" ಎಂಬ ವರ್ಕ್‌ಫ್ಲೋ ರನ್ ಆಗುತ್ತಿರುವುದು ಕಾಣಿಸುತ್ತದೆ.'
                : 'In your GitHub repository, click on the "Actions" tab. You will see the "Build Android APK" workflow running automatically.'}
            </p>
          </div>

          {/* Step 3 */}
          <div className="space-y-1.5 p-3.5 rounded-xl bg-black/40 border border-white/5">
            <div className="flex items-center gap-2 font-bold text-white text-xs">
              <span className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px]">3</span>
              <span>{lang === 'kn' ? 'APK ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ (Download APK)' : 'Download APK Artifact'}</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              {lang === 'kn'
                ? 'ವರ್ಕ್‌ಫ್ಲೋ ಪೂರ್ಣಗೊಂಡಾಗ (ಹಸಿರು ಗುರುತು ಬಂದಾಗ), ಅದರ ಸಾರಾಂಶ (Summary) ಪೇಜ್‌ನ ಕೆಳಗೆ "Artifacts" ವಿಭಾಗದಲ್ಲಿ "InstaLink-AutoDM-Debug-APK" ಫೈಲ್ ಇರುತ್ತದೆ. ಅದನ್ನು ಒಂದೇ ಕ್ಲಿಕ್‌ನಲ್ಲಿ ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ ನಿಮ್ಮ ಆಂಡ್ರಾಯ್ಡ್ ಮೊಬೈಲ್‌ನಲ್ಲಿ ಇನ್‌ಸ್ಟಾಲ್ ಮಾಡಿಕೊಳ್ಳಿ!'
                : 'Once the workflow completes with a green checkmark, look under "Artifacts" at the bottom of the run summary to download "InstaLink-AutoDM-Debug-APK" and install it on your Android device!'}
            </p>
          </div>

          {/* Verified Workflow Details */}
          <div className="p-3 rounded-xl bg-black/30 border border-white/5 space-y-1.5 text-slate-400 text-[11px]">
            <span className="text-slate-200 font-semibold block">
              {lang === 'kn' ? 'ಯಾವುದೇ ದೋಷ ಬಾರದಂತೆ ಕಾಳಜಿ ವಹಿಸಲಾದ ವಿಷಯಗಳು:' : 'Error-prevention guarantees:'}
            </span>
            <ul className="list-disc list-inside space-y-1 text-slate-400">
              <li>Capacitor dependencies (@capacitor/core, @capacitor/cli, @capacitor/android) included in package.json</li>
              <li>Java 17 (Temurin) & Android SDK 34 platform configured</li>
              <li>`capacitor.config.json` properly linked to `dist` webDir</li>
              <li>Automated `gradlew assembleDebug` build command with executable permissions</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-white/10 bg-black/40 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-white text-xs font-semibold"
          >
            {lang === 'kn' ? 'ಮುಚ್ಚಿ' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
