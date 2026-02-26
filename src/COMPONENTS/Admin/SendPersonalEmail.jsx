// COMPONENTS/Admin/SendPersonalEmail.jsx
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Mail, Send, X, CheckCircle, AlertTriangle } from 'lucide-react';
import {
  sendPersonalEmail,
  clearEmailState,
} from '../../REDUX/Slices/emailCampaignSlice';

export default function SendPersonalEmail() {
  const dispatch = useDispatch();
  const { sending, success, error } = useSelector(s => s.emailCampaign);

  const [form, setForm] = useState({
    to:       '',
    subject:  '',
    message:  '',
    ctaText:  '',
    ctaLink:  '',
  });

  // ✅ Pre-fill for Shivanshu — remove this after use
  const prefillShivanshu = () => {
    setForm({
      to:      'pshivanshu807@gmail.com',
      subject: 'Your AcademicArk Payment — Important Update',
      message: `Hi Shivanshu,\n\nHope your studies are going well!\n\nWe noticed your payment of ₹59 for the Semester Support plan on February 20th didn't go through successfully.\n\n✅ Good news — no money was deducted from your account.\n\nWe're really sorry for the confusion. The issue was on our end (a technical glitch during checkout) and has now been fixed.\n\nYou can retry your payment by clicking the button below.\n\nAs an apology, if you face any issues during checkout, just reply to this email and we'll sort it out personally.\n\nThank you for being one of the first to support AcademicArk 🙏\n\n— Goon\nAcademicArk`,
      ctaText: 'Retry Payment →',
      ctaLink: `${import.meta.env.VITE_FRONTEND_URL || 'https://academicark.in'}/plans`,
    });
  };

  // ✅ auto clear success/error after 4s
  useEffect(() => {
    if (success || error) {
      const t = setTimeout(() => dispatch(clearEmailState()), 4000);
      return () => clearTimeout(t);
    }
  }, [success, error]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!form.to || !form.subject || !form.message) return;
    dispatch(sendPersonalEmail(form));
  };

  return (
    <div
      className="rounded-2xl border border-[#242424] overflow-hidden"
      style={{ background: '#141414' }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-5 py-4 border-b border-[#1f1f1f]"
        style={{ background: '#111' }}
      >
        <div className="flex items-center gap-2.5">
          <Mail size={14} className="text-[#555]" />
          <h3 className="text-[#aaa] text-sm font-semibold">Send Personal Email</h3>
        </div>

        {/* ✅ Prefill button for Shivanshu */}
        <button
          onClick={prefillShivanshu}
          className="text-xs px-3 py-1.5 rounded-lg border border-[#2a2a2a] text-[#666] hover:text-white hover:border-[#3a3a3a] transition-colors"
          style={{ background: '#1a1a1a' }}
        >
          📋 Prefill Shivanshu
        </button>
      </div>

      <form onSubmit={handleSend} className="p-5 space-y-4">

        {/* To */}
        <div>
          <label className="text-xs text-[#555] font-medium uppercase tracking-wide block mb-1.5">
            To (Email)
          </label>
          <input
            type="email"
            value={form.to}
            onChange={e => setForm(p => ({ ...p, to: e.target.value }))}
            placeholder="user@example.com"
            required
            className="w-full px-3.5 py-2.5 rounded-xl text-sm text-white placeholder-[#444] border border-[#2a2a2a] focus:border-[#3a3a3a] focus:outline-none transition-colors"
            style={{ background: '#1a1a1a' }}
          />
        </div>

        {/* Subject */}
        <div>
          <label className="text-xs text-[#555] font-medium uppercase tracking-wide block mb-1.5">
            Subject
          </label>
          <input
            type="text"
            value={form.subject}
            onChange={e => setForm(p => ({ ...p, subject: e.target.value }))}
            placeholder="Payment Failed — Important Update"
            required
            className="w-full px-3.5 py-2.5 rounded-xl text-sm text-white placeholder-[#444] border border-[#2a2a2a] focus:border-[#3a3a3a] focus:outline-none transition-colors"
            style={{ background: '#1a1a1a' }}
          />
        </div>

        {/* Message */}
        <div>
          <label className="text-xs text-[#555] font-medium uppercase tracking-wide block mb-1.5">
            Message
          </label>
          <textarea
            rows={7}
            value={form.message}
            onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
            placeholder="Write your personal message here..."
            required
            className="w-full px-3.5 py-2.5 rounded-xl text-sm text-white placeholder-[#444] border border-[#2a2a2a] focus:border-[#3a3a3a] focus:outline-none transition-colors resize-none"
            style={{ background: '#1a1a1a' }}
          />
        </div>

        {/* CTA row */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-[#555] font-medium uppercase tracking-wide block mb-1.5">
              CTA Button Text
            </label>
            <input
              type="text"
              value={form.ctaText}
              onChange={e => setForm(p => ({ ...p, ctaText: e.target.value }))}
              placeholder="Retry Payment →"
              className="w-full px-3.5 py-2.5 rounded-xl text-sm text-white placeholder-[#444] border border-[#2a2a2a] focus:border-[#3a3a3a] focus:outline-none transition-colors"
              style={{ background: '#1a1a1a' }}
            />
          </div>
          <div>
            <label className="text-xs text-[#555] font-medium uppercase tracking-wide block mb-1.5">
              CTA Link
            </label>
            <input
              type="url"
              value={form.ctaLink}
              onChange={e => setForm(p => ({ ...p, ctaLink: e.target.value }))}
              placeholder="https://academicark.in/plans"
              className="w-full px-3.5 py-2.5 rounded-xl text-sm text-white placeholder-[#444] border border-[#2a2a2a] focus:border-[#3a3a3a] focus:outline-none transition-colors"
              style={{ background: '#1a1a1a' }}
            />
          </div>
        </div>

        {/* Success / Error */}
        {success && (
          <div className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm text-emerald-400 border border-emerald-500/20" style={{ background: 'rgba(16,185,129,0.05)' }}>
            <CheckCircle size={14} /> {success}
          </div>
        )}
        {error && (
          <div className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm text-red-400 border border-red-500/20" style={{ background: 'rgba(239,68,68,0.05)' }}>
            <AlertTriangle size={14} /> {error}
          </div>
        )}

        {/* Send button */}
        <button
          type="submit"
          disabled={sending}
          className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ background: sending ? '#1d4ed8' : '#2563eb' }}
        >
          {sending ? (
            <><span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" /> Sending...</>
          ) : (
            <><Send size={14} /> Send Email</>
          )}
        </button>

      </form>
    </div>
  );
}
