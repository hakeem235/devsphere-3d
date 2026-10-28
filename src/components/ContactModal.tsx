import React, { useState } from 'react';
import { DEVELOPER_PROFILE } from '../data/portfolioData';
import { soundManager } from '../utils/audio';
import {
  X,
  Mail,
  Copy,
  Check,
  Send,
  Linkedin,
  Github,
  Calendar,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [inquiryType, setInquiryType] = useState('fulltime');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleCopyEmail = () => {
    soundManager.playClick();
    navigator.clipboard.writeText(DEVELOPER_PROFILE.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    soundManager.playSwitch(true);
    setIsSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 overflow-y-auto">
      <div className="relative w-full max-w-xl bg-panel border border-hairline rounded-lg shadow-2xl overflow-hidden my-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-hairline bg-graphite">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-md bg-copper flex items-center justify-center text-graphite font-bold shadow-md">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-paper">Initiate Collaboration</h3>
              <p className="text-xs text-paper/50 font-mono">
                Staff / Senior Fullstack & Mobile Engineering
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="p-2 rounded-md bg-graphite border border-hairline text-paper/50 hover:text-paper transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-6">
          {/* Quick Copy Email Banner */}
          <div className="flex items-center justify-between p-3.5 rounded-md bg-graphite border border-hairline">
            <div className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-copper" />
              <div>
                <div className="text-[11px] text-paper/50">Direct inbox</div>
                <div className="text-xs sm:text-sm font-mono font-medium text-paper">
                  {DEVELOPER_PROFILE.email}
                </div>
              </div>
            </div>

            <button
              onClick={handleCopyEmail}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-copper/15 hover:bg-copper/25 text-copper border border-copper/30 transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-solder" />
                  <span className="text-solder">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>

          {isSubmitted ? (
            <div className="text-center py-8 space-y-3">
              <div className="w-12 h-12 rounded-full bg-solder/15 border border-solder/40 flex items-center justify-center mx-auto text-solder">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-paper">Message Dispatched!</h4>
              <p className="text-xs text-paper/50 max-w-sm mx-auto leading-relaxed">
                Thank you for reaching out, {name || 'there'}. I have received your message and will
                get back to you within 24 hours.
              </p>
              <button
                onClick={() => {
                  soundManager.playClick();
                  setIsSubmitted(false);
                  onClose();
                }}
                className="mt-4 px-5 py-2 rounded-md text-xs font-semibold bg-copper hover:bg-copper-dim text-graphite cursor-pointer"
              >
                Close Window
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-paper/50">Your name / company</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Acme Studio"
                    className="w-full mt-1 px-3 py-2 bg-graphite border border-hairline rounded-md text-xs text-paper focus:outline-none focus:border-copper font-sans"
                  />
                </div>

                <div>
                  <label className="text-xs text-paper/50">Contact email</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. recruiter@company.com"
                    className="w-full mt-1 px-3 py-2 bg-graphite border border-hairline rounded-md text-xs text-paper focus:outline-none focus:border-copper font-sans"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-paper/50">Engagement scope</label>
                <div className="grid grid-cols-3 gap-2 mt-1">
                  {[
                    { id: 'fulltime', label: 'Full-Time Role' },
                    { id: 'contract', label: 'Mobile MVP' },
                    { id: 'advisory', label: '3D Web / Consult' },
                  ].map((t) => (
                    <button
                      type="button"
                      key={t.id}
                      onClick={() => {
                        soundManager.playClick();
                        setInquiryType(t.id);
                      }}
                      className={`py-2 px-2 rounded-md text-xs font-medium text-center border transition-all cursor-pointer ${
                        inquiryType === t.id
                          ? 'bg-copper/15 border-copper/60 text-copper'
                          : 'bg-graphite border-hairline text-paper/50 hover:text-paper/80'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs text-paper/50">Project / role details</label>
                <textarea
                  rows={3}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell me about the engineering challenges, tech stack, or roadmap..."
                  className="w-full mt-1 px-3 py-2 bg-graphite border border-hairline rounded-md text-xs text-paper focus:outline-none focus:border-copper font-sans resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-3 rounded-md bg-copper hover:bg-copper-dim text-graphite font-medium text-xs shadow-lg transition-colors cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Transmit Inquiry</span>
              </button>
            </form>
          )}

          {/* Social Links */}
          <div className="flex items-center justify-center gap-4 pt-4 border-t border-hairline text-xs text-paper/50 font-mono">
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              onClick={() => soundManager.playClick()}
              className="flex items-center gap-1.5 hover:text-copper transition-colors"
            >
              <Github className="w-4 h-4" />
              <span>GitHub</span>
            </a>
            <span>•</span>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              onClick={() => soundManager.playClick()}
              className="flex items-center gap-1.5 hover:text-copper transition-colors"
            >
              <Linkedin className="w-4 h-4" />
              <span>LinkedIn</span>
            </a>
            <span>•</span>
            <span className="flex items-center gap-1 text-solder">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Open to Relocate / Remote</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
