import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createSeoPage,
  updateSeoPage,
  previewSeoPage,
  clearPreview,
  clearError,
} from "../../REDUX/Slices/seoAdminSlice";
import {
  Save,
  Eye,
  X,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  Globe,
  FileText,
  Tag,
  AlignLeft,
  Link,
  HelpCircle,
  Filter,
  BarChart2,
  AlertCircle,
  CheckCircle,
  Loader2,
  RefreshCw,
} from "lucide-react";

// ============================================
// 🎯 CONSTANTS
// ============================================
const PAGE_TYPES = ["subject", "semester", "category", "university", "custom"];

const CHANGE_FREQ = ["always", "hourly", "daily", "weekly", "monthly", "yearly", "never"];

const EMPTY_FORM = {
  slug: "",
  pageType: "subject",
  title: "",
  h1: "",
  metaDescription: "",
  keywords: [],
  introContent: "",
  filters: {
    semester: "",
    subject: "",
    course: "",
    university: "",
    category: "",
  },
  faqs: [],
  published: true,
  changeFrequency: "weekly",
  sitemapPriority: 0.8,
};

// ============================================
// 🎯 SMALL REUSABLE COMPONENTS
// ============================================

const FormLabel = ({ children, required }) => (
  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
    {children}
    {required && <span className="text-red-400 ml-1">*</span>}
  </label>
);

const FormInput = ({ error, ...props }) => (
  <div>
    <input
      {...props}
      className={`w-full px-4 py-2.5 rounded-xl text-sm text-zinc-200 placeholder-zinc-600 outline-none
        transition focus:ring-1
        ${error
          ? "ring-1 ring-red-500/50 focus:ring-red-500/70"
          : "focus:ring-white/10"
        }`}
      style={{
        background: "rgba(255,255,255,0.04)",
        border: `1px solid ${error ? "rgba(239,68,68,0.3)" : "rgba(255,255,255,0.08)"}`,
      }}
    />
    {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
  </div>
);

const FormTextarea = ({ rows = 4, error, ...props }) => (
  <div>
    <textarea
      rows={rows}
      {...props}
      className={`w-full px-4 py-2.5 rounded-xl text-sm text-zinc-200 placeholder-zinc-600 outline-none
        resize-none transition focus:ring-1
        ${error ? "ring-1 ring-red-500/50" : "focus:ring-white/10"}`}
      style={{
        background: "rgba(255,255,255,0.04)",
        border: `1px solid ${error ? "rgba(239,68,68,0.3)" : "rgba(255,255,255,0.08)"}`,
      }}
    />
    {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
  </div>
);

const FormSelect = ({ children, ...props }) => (
  <select
    {...props}
    className="w-full px-4 py-2.5 rounded-xl text-sm text-zinc-200 outline-none transition
      focus:ring-1 focus:ring-white/10"
    style={{
      background: "rgba(255,255,255,0.04)",
      border: "1px solid rgba(255,255,255,0.08)",
    }}
  >
    {children}
  </select>
);

// Section card wrapper
const Section = ({ title, icon: Icon, children, defaultOpen = true }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ border: "1px solid rgba(255,255,255,0.07)" }}
    >
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className="w-full flex items-center justify-between px-5 py-4
          hover:bg-white/[0.02] transition"
        style={{ borderBottom: open ? "1px solid rgba(255,255,255,0.06)" : "none" }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ background: "rgba(255,255,255,0.05)" }}
          >
            <Icon className="w-4 h-4 text-zinc-300" />
          </div>
          <span className="text-sm font-semibold text-zinc-200">{title}</span>
        </div>
        {open
          ? <ChevronUp className="w-4 h-4 text-zinc-500" />
          : <ChevronDown className="w-4 h-4 text-zinc-500" />
        }
      </button>
      {open && <div className="px-5 py-5 space-y-4">{children}</div>}
    </div>
  );
};

// Character counter
const CharCount = ({ current, max, warn = max * 0.9 }) => (
  <p className={`text-xs mt-1 text-right ${current > max ? "text-red-400" : current > warn ? "text-amber-400" : "text-zinc-600"}`}>
    {current}/{max}
  </p>
);

// ============================================
// 🎯 KEYWORD INPUT
// ============================================
const KeywordInput = ({ keywords, onChange }) => {
  const [input, setInput] = useState("");

  const add = () => {
    const kw = input.trim().toLowerCase();
    if (kw && !keywords.includes(kw)) {
      onChange([...keywords, kw]);
    }
    setInput("");
  };

  const remove = (kw) => onChange(keywords.filter((k) => k !== kw));

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); add(); } }}
          placeholder="Type keyword and press Enter"
          className="flex-1 px-4 py-2.5 rounded-xl text-sm text-zinc-200 placeholder-zinc-600 outline-none
            focus:ring-1 focus:ring-white/10"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        />
        <button
          type="button"
          onClick={add}
          className="px-4 py-2.5 rounded-xl text-sm font-medium bg-white/[0.06]
            hover:bg-white/[0.1] text-zinc-300 transition"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {keywords.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {keywords.map((kw) => (
            <span
              key={kw}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium
                text-zinc-300"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              {kw}
              <button
                type="button"
                onClick={() => remove(kw)}
                className="hover:text-red-400 transition"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

// ============================================
// 🎯 FAQ EDITOR
// ============================================
const FaqEditor = ({ faqs, onChange }) => {
  const addFaq = () => onChange([...faqs, { question: "", answer: "" }]);

  const updateFaq = (i, field, value) => {
    const updated = [...faqs];
    updated[i] = { ...updated[i], [field]: value };
    onChange(updated);
  };

  const removeFaq = (i) => onChange(faqs.filter((_, idx) => idx !== i));

  return (
    <div className="space-y-3">
      {faqs.map((faq, i) => (
        <div
          key={i}
          className="p-4 rounded-xl space-y-3 relative"
          style={{
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-500">FAQ #{i + 1}</span>
            <button
              type="button"
              onClick={() => removeFaq(i)}
              className="p-1 rounded-lg hover:bg-red-500/10 text-zinc-600 hover:text-red-400 transition"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
          <input
            value={faq.question}
            onChange={(e) => updateFaq(i, "question", e.target.value)}
            placeholder="Question"
            className="w-full px-3 py-2 rounded-lg text-sm text-zinc-200 placeholder-zinc-600 outline-none"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          />
          <textarea
            value={faq.answer}
            onChange={(e) => updateFaq(i, "answer", e.target.value)}
            placeholder="Answer"
            rows={3}
            className="w-full px-3 py-2 rounded-lg text-sm text-zinc-200 placeholder-zinc-600 outline-none resize-none"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          />
        </div>
      ))}

      <button
        type="button"
        onClick={addFaq}
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium
          text-zinc-400 hover:text-zinc-200 transition w-full justify-center"
        style={{ border: "1px dashed rgba(255,255,255,0.1)" }}
      >
        <Plus className="w-4 h-4" />
        Add FAQ
      </button>
    </div>
  );
};

// ============================================
// 🎯 PREVIEW PANEL
// ============================================
const PreviewPanel = ({ data, onClose }) => {
  if (!data) return null;

  return (
    <div
      className="rounded-2xl p-5 space-y-4"
      style={{
        background: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(255,255,255,0.07)",
      }}
    >
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-zinc-200">Filter Preview Results</h3>
        <button onClick={onClose}>
          <X className="w-4 h-4 text-zinc-500" />
        </button>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Notes Found",      value: data.totalNotes },
          { label: "Total Downloads",  value: data.totalDownloads },
          { label: "Total Views",      value: data.totalViews },
        ].map(({ label, value }) => (
          <div
            key={label}
            className="p-3 rounded-xl text-center"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
          >
            <p className="text-xl font-bold text-white">{value}</p>
            <p className="text-xs text-zinc-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {data.sampleNotes?.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Sample Notes</p>
          {data.sampleNotes.map((note, i) => (
            <div
              key={i}
              className="flex items-center justify-between px-3 py-2 rounded-lg"
              style={{ background: "rgba(255,255,255,0.03)" }}
            >
              <div>
                <p className="text-sm text-zinc-300 font-medium">{note.title}</p>
                <p className="text-xs text-zinc-600">{note.subject} · Sem {note.semester}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-zinc-500">{note.downloads || 0} downloads</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {data.totalNotes === 0 && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl"
          style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.2)" }}>
          <AlertCircle className="w-4 h-4 text-amber-400" />
          <p className="text-xs text-amber-300">No notes match these filters. Consider adjusting them.</p>
        </div>
      )}
    </div>
  );
};

// ============================================
// 🎯 SEO SCORE WIDGET
// ============================================
const SeoScore = ({ form }) => {
  const checks = [
    { label: "Title length (50–60 chars)",   pass: form.title.length >= 50 && form.title.length <= 60 },
    { label: "Meta description (120–160)",    pass: form.metaDescription.length >= 120 && form.metaDescription.length <= 160 },
    { label: "Has keywords",                  pass: form.keywords.length >= 3 },
    { label: "H1 defined",                    pass: form.h1.length > 0 },
    { label: "Intro content (100+ chars)",    pass: form.introContent.length >= 100 },
    { label: "Has FAQs",                      pass: form.faqs.length >= 1 },
    { label: "Slug is clean",                 pass: /^[a-z0-9-]+$/.test(form.slug) },
  ];

  const score = Math.round((checks.filter((c) => c.pass).length / checks.length) * 100);
  const color = score >= 80 ? "text-emerald-400" : score >= 50 ? "text-amber-400" : "text-red-400";
  const barColor = score >= 80 ? "bg-emerald-500" : score >= 50 ? "bg-amber-500" : "bg-red-500";

  return (
    <div
      className="rounded-2xl p-5 space-y-4"
      style={{ border: "1px solid rgba(255,255,255,0.07)" }}
    >
      {/* Score header */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-zinc-200">SEO Score</span>
        <span className={`text-2xl font-black ${color}`}>{score}%</span>
      </div>

      {/* Score bar */}
      <div className="h-2 rounded-full" style={{ background: "rgba(255,255,255,0.06)" }}>
        <div
          className={`h-full rounded-full transition-all duration-500 ${barColor}`}
          style={{ width: `${score}%` }}
        />
      </div>

      {/* Checklist */}
      <div className="space-y-2">
        {checks.map(({ label, pass }) => (
          <div key={label} className="flex items-center gap-2.5">
            <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0
              ${pass ? "bg-emerald-500/20" : "bg-zinc-700/40"}`}>
              {pass
                ? <CheckCircle className="w-3 h-3 text-emerald-400" />
                : <X className="w-3 h-3 text-zinc-600" />
              }
            </div>
            <span className={`text-xs ${pass ? "text-zinc-300" : "text-zinc-600"}`}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ============================================
// 🎯 SLUG AUTO GENERATOR
// ============================================
const toSlug = (str) =>
  str.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-");

// ============================================
// 🎯 MAIN FORM COMPONENT
// ============================================
const SeoPageForm = ({ mode, initialData, onSuccess, onCancel }) => {
  const dispatch = useDispatch();
  const { creating, updating, previewing, previewData, createError, updateError } =
    useSelector((state) => state.seoAdmin);

  const isEdit = mode === "edit";
  const isLoading = creating || updating;

  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [slugManual, setSlugManual] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // ── Populate form on edit
  useEffect(() => {
    if (isEdit && initialData) {
      setForm({
        ...EMPTY_FORM,
        ...initialData,
        filters: { ...EMPTY_FORM.filters, ...(initialData.filters || {}) },
        keywords: initialData.keywords || [],
        faqs: initialData.faqs || [],
      });
      setSlugManual(true);
    }
  }, [isEdit, initialData]);

  // ── Clear errors from redux on unmount
  useEffect(() => () => { dispatch(clearError()); dispatch(clearPreview()); }, []);

  // ── Field update
  const set = (field, value) => {
    setForm((p) => ({ ...p, [field]: value }));
    if (errors[field]) setErrors((p) => ({ ...p, [field]: null }));
  };

  // ── Auto slug from title
  const handleTitleChange = (value) => {
    set("title", value);
    if (!slugManual) {
      set("slug", toSlug(value));
    }
    // Auto h1 if empty
    if (!form.h1) set("h1", value);
  };

  // ── Validate
  const validate = () => {
    const e = {};
    if (!form.slug.trim())           e.slug = "Slug is required";
    else if (!/^[a-z0-9-]+$/.test(form.slug)) e.slug = "Only lowercase letters, numbers, hyphens";
    if (!form.title.trim())          e.title = "Title is required";
    if (!form.h1.trim())             e.h1 = "H1 is required";
    if (!form.metaDescription.trim()) e.metaDescription = "Meta description is required";
    if (!form.introContent.trim())   e.introContent = "Intro content is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ── Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const action = isEdit
      ? updateSeoPage({ id: initialData._id, pageData: form })
      : createSeoPage(form);

    const result = await dispatch(action);

    if (!result.error) onSuccess();
  };

  // ── Preview filters
  const handlePreview = () => {
    dispatch(previewSeoPage(form.filters));
    setShowPreview(true);
  };

  const apiError = createError || updateError;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      {/* ── Top bar */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white">
            {isEdit ? "Edit SEO Page" : "Create New SEO Page"}
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            {isEdit ? `Editing /${initialData?.slug}` : "Build a new programmatic SEO page"}
          </p>
        </div>

        {/* Publish toggle */}
        <div className="flex items-center gap-3">
          <span className="text-sm text-zinc-400">
            {form.published ? "Live" : "Draft"}
          </span>
          <button
            type="button"
            onClick={() => set("published", !form.published)}
            className={`w-12 h-6 rounded-full transition-all duration-300 relative ${
              form.published ? "bg-emerald-500" : "bg-zinc-700"
            }`}
          >
            <span
              className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-300 ${
                form.published ? "left-7" : "left-1"
              }`}
            />
          </button>
        </div>
      </div>

      {/* ── API Error */}
      {apiError && (
        <div
          className="flex items-center gap-3 px-4 py-3 rounded-2xl"
          style={{
            background: "rgba(239,68,68,0.08)",
            border: "1px solid rgba(239,68,68,0.2)",
          }}
        >
          <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
          <span className="text-sm text-red-300">{apiError}</span>
        </div>
      )}

      {/* ── Two column layout */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-4">

        {/* LEFT — Main fields */}
        <div className="space-y-4">

          {/* Basic Info */}
          <Section title="Basic Info" icon={FileText}>

            {/* Page Type */}
            <div>
              <FormLabel required>Page Type</FormLabel>
              <div className="flex flex-wrap gap-2">
                {PAGE_TYPES.map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => set("pageType", type)}
                    className={`px-4 py-1.5 rounded-xl text-xs font-semibold capitalize transition ${
                      form.pageType === type
                        ? "bg-blue-600 text-white"
                        : "text-zinc-400 hover:text-zinc-200"
                    }`}
                    style={{
                      border: form.pageType === type
                        ? "1px solid rgba(59,130,246,0.5)"
                        : "1px solid rgba(255,255,255,0.08)",
                    }}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Title */}
            <div>
              <FormLabel required>Page Title (SEO)</FormLabel>
              <FormInput
                value={form.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="e.g. AKTU DBMS Notes – Semester 3 | AcademicArk"
                error={errors.title}
              />
              <CharCount current={form.title.length} max={60} />
            </div>

            {/* Slug */}
            <div>
              <FormLabel required>URL Slug</FormLabel>
              <div className="flex gap-2">
                <div
                  className="flex items-center px-3 rounded-xl text-sm text-zinc-500"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  /
                </div>
                <div className="flex-1">
                  <FormInput
                    value={form.slug}
                    onChange={(e) => {
                      setSlugManual(true);
                      set("slug", e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""));
                    }}
                    placeholder="aktu-dbms-notes-semester-3"
                    error={errors.slug}
                  />
                </div>
                {!isEdit && (
                  <button
                    type="button"
                    onClick={() => {
                      setSlugManual(false);
                      set("slug", toSlug(form.title));
                    }}
                    className="px-3 rounded-xl text-xs text-zinc-500 hover:text-zinc-300 transition"
                    style={{ border: "1px solid rgba(255,255,255,0.08)" }}
                    title="Auto-generate from title"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* H1 */}
            <div>
              <FormLabel required>H1 Heading</FormLabel>
              <FormInput
                value={form.h1}
                onChange={(e) => set("h1", e.target.value)}
                placeholder="e.g. AKTU DBMS Notes – Download Free PDF"
                error={errors.h1}
              />
            </div>
          </Section>

          {/* Meta & SEO */}
          <Section title="Meta & SEO" icon={Globe}>

            {/* Meta Description */}
            <div>
              <FormLabel required>Meta Description</FormLabel>
              <FormTextarea
                rows={3}
                value={form.metaDescription}
                onChange={(e) => set("metaDescription", e.target.value)}
                placeholder="Describe this page for Google (120–160 characters ideal)"
                error={errors.metaDescription}
              />
              <CharCount current={form.metaDescription.length} max={160} />
            </div>

            {/* Keywords */}
            <div>
              <FormLabel>Keywords</FormLabel>
              <KeywordInput
                keywords={form.keywords}
                onChange={(kws) => set("keywords", kws)}
              />
            </div>

            {/* Sitemap settings */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <FormLabel>Change Frequency</FormLabel>
                <FormSelect
                  value={form.changeFrequency}
                  onChange={(e) => set("changeFrequency", e.target.value)}
                >
                  {CHANGE_FREQ.map((f) => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </FormSelect>
              </div>
              <div>
                <FormLabel>Sitemap Priority</FormLabel>
                <div className="space-y-2">
                  <FormInput
                    type="number"
                    min="0"
                    max="1"
                    step="0.1"
                    value={form.sitemapPriority}
                    onChange={(e) => set("sitemapPriority", parseFloat(e.target.value))}
                  />
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={form.sitemapPriority}
                    onChange={(e) => set("sitemapPriority", parseFloat(e.target.value))}
                    className="w-full accent-blue-500"
                  />
                </div>
              </div>
            </div>
          </Section>

          {/* Content */}
          <Section title="Page Content" icon={AlignLeft}>
            <div>
              <FormLabel required>Intro Content</FormLabel>
              <FormTextarea
                rows={6}
                value={form.introContent}
                onChange={(e) => set("introContent", e.target.value)}
                placeholder="Write the intro paragraph that users and Google will see. Include relevant keywords naturally. Minimum 100 characters."
                error={errors.introContent}
              />
              <div className="flex items-center justify-between mt-1">
                <span className="text-xs text-zinc-600">{form.introContent.length} chars</span>
                {form.introContent.length < 100 && (
                  <span className="text-xs text-amber-400">
                    Need {100 - form.introContent.length} more chars
                  </span>
                )}
              </div>
            </div>
          </Section>

          {/* Filters */}
          <Section title="Content Filters" icon={Filter} defaultOpen={false}>
            <p className="text-xs text-zinc-500 -mt-1">
              These filters determine which notes appear on this page.
            </p>

            <div className="grid grid-cols-2 gap-4">
              {[
                { field: "semester",   placeholder: "e.g. 3" },
                { field: "subject",    placeholder: "e.g. dbms" },
                { field: "course",     placeholder: "e.g. B.Tech" },
                { field: "university", placeholder: "e.g. AKTU" },
                { field: "category",   placeholder: "e.g. notes" },
              ].map(({ field, placeholder }) => (
                <div key={field}>
                  <FormLabel>{field.charAt(0).toUpperCase() + field.slice(1)}</FormLabel>
                  <FormInput
                    value={form.filters[field]}
                    onChange={(e) =>
                      setForm((p) => ({
                        ...p,
                        filters: { ...p.filters, [field]: e.target.value },
                      }))
                    }
                    placeholder={placeholder}
                  />
                </div>
              ))}
            </div>

            {/* Preview button */}
            <button
              type="button"
              onClick={handlePreview}
              disabled={previewing}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium
                text-blue-300 hover:text-blue-200 transition"
              style={{ border: "1px solid rgba(59,130,246,0.2)" }}
            >
              {previewing
                ? <><Loader2 className="w-4 h-4 animate-spin" /> Fetching...</>
                : <><Eye className="w-4 h-4" /> Preview Filter Results</>
              }
            </button>

            {/* Preview results */}
            {showPreview && previewData && (
              <PreviewPanel
                data={previewData}
                onClose={() => { setShowPreview(false); dispatch(clearPreview()); }}
              />
            )}
          </Section>

          {/* FAQs */}
          <Section title="FAQs" icon={HelpCircle} defaultOpen={false}>
            <p className="text-xs text-zinc-500 -mt-1">
              FAQs improve SEO with FAQ schema markup. Add at least 3.
            </p>
            <FaqEditor
              faqs={form.faqs}
              onChange={(faqs) => set("faqs", faqs)}
            />
          </Section>
        </div>

        {/* RIGHT — Sidebar */}
        <div className="space-y-4">
          {/* SEO Score */}
          <SeoScore form={form} />

          {/* Quick tips */}
          <div
            className="rounded-2xl p-4 space-y-3"
            style={{ border: "1px solid rgba(255,255,255,0.06)" }}
          >
            <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Quick Tips</p>
            {[
              "Title: 50–60 chars with primary keyword first",
              "Meta: 120–160 chars, include a CTA",
              "Slug: short, hyphenated, keyword-rich",
              "Intro: 150+ words with natural keywords",
              "FAQs: target question-based searches",
            ].map((tip, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5 text-xs">→</span>
                <p className="text-xs text-zinc-500 leading-relaxed">{tip}</p>
              </div>
            ))}
          </div>

          {/* Form preview card */}
          <div
            className="rounded-2xl p-4 space-y-2"
            style={{ border: "1px solid rgba(255,255,255,0.06)" }}
          >
            <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">
              Google Preview
            </p>
            <div>
              <p className="text-blue-400 text-sm font-medium truncate">
                {form.title || "Page Title"}
              </p>
              <p className="text-emerald-600 text-xs truncate">
                academicark.com/{form.slug || "your-slug"}
              </p>
              <p className="text-zinc-400 text-xs mt-1 line-clamp-2 leading-relaxed">
                {form.metaDescription || "Meta description will appear here..."}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Submit Bar */}
      <div
        className="sticky bottom-4 flex items-center justify-between gap-3 px-5 py-4 rounded-2xl"
        style={{
          background: "rgba(10,10,10,0.95)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
        }}
      >
        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-2.5 rounded-xl text-sm font-medium text-zinc-400
            hover:text-zinc-200 transition"
          style={{ border: "1px solid rgba(255,255,255,0.08)" }}
        >
          Cancel
        </button>

        <div className="flex items-center gap-3">
          {/* Save as draft */}
          <button
            type="button"
            onClick={() => {
              set("published", false);
              setTimeout(() => handleSubmit({ preventDefault: () => {} }), 50);
            }}
            disabled={isLoading}
            className="px-5 py-2.5 rounded-xl text-sm font-medium text-zinc-300
              hover:bg-white/[0.06] transition"
            style={{ border: "1px solid rgba(255,255,255,0.08)" }}
          >
            Save Draft
          </button>

          {/* Publish */}
          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold
              bg-blue-600 hover:bg-blue-500 text-white transition disabled:opacity-60"
          >
            {isLoading
              ? <><Loader2 className="w-4 h-4 animate-spin" /> {isEdit ? "Saving..." : "Creating..."}</>
              : <><Save className="w-4 h-4" /> {isEdit ? "Save Changes" : "Publish Page"}</>
            }
          </button>
        </div>
      </div>
    </form>
  );
};

export default SeoPageForm;
