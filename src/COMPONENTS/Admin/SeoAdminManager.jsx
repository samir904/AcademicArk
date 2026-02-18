import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllSeoPages,
  deleteSeoPage,
  bulkUpdateStatus,
  toggleSelectedPage,
  selectAllPages,
  deselectAllPages,
  setFilters,
  resetFilters,
  clearError,
  clearSuccess,
} from "../../REDUX/Slices/seoAdminSlice";
import {
  Plus,
  Search,
  Filter,
  Trash2,
  Edit3,
  Eye,
  EyeOff,
  Globe,
  RefreshCw,
  CheckSquare,
  Square,
  ChevronDown,
  AlertCircle,
  TrendingUp,
  FileText,
  BarChart2,
  X,
} from "lucide-react";

// ============================================
// 🎯 SUB COMPONENTS
// ============================================

const StatCard = ({ icon: Icon, label, value, color }) => (
  <div
    className="flex items-center gap-3 p-4 rounded-2xl"
    style={{
      background: "rgba(255,255,255,0.03)",
      border: "1px solid rgba(255,255,255,0.06)",
    }}
  >
    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
      <Icon className="w-5 h-5" />
    </div>
    <div>
      <p className="text-xs text-zinc-500 font-medium">{label}</p>
      <p className="text-xl font-bold text-white">{value}</p>
    </div>
  </div>
);

const PageTypeBadge = ({ type }) => {
  const colors = {
    subject:  "bg-blue-500/15 text-blue-300 border-blue-500/20",
    semester: "bg-purple-500/15 text-purple-300 border-purple-500/20",
    category: "bg-emerald-500/15 text-emerald-300 border-emerald-500/20",
    university:"bg-amber-500/15 text-amber-300 border-amber-500/20",
    custom:   "bg-zinc-500/15 text-zinc-300 border-zinc-500/20",
  };

  return (
    <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold border ${colors[type] || colors.custom}`}>
      {type}
    </span>
  );
};

const StatusBadge = ({ published }) => (
  <span
    className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
      published
        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
        : "bg-zinc-500/10 text-zinc-400 border-zinc-500/20"
    }`}
  >
    <span className={`w-1.5 h-1.5 rounded-full ${published ? "bg-emerald-400" : "bg-zinc-500"}`} />
    {published ? "Live" : "Draft"}
  </span>
);

// ============================================
// 🎯 CONFIRM DELETE MODAL
// ============================================
const ConfirmDeleteModal = ({ page, onConfirm, onCancel, loading }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onCancel} />
    <div
      className="relative w-full max-w-sm rounded-2xl p-6"
      style={{
        background: "rgba(14,14,14,0.98)",
        border: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <div className="w-12 h-12 rounded-2xl bg-red-500/15 flex items-center justify-center mb-4">
        <Trash2 className="w-6 h-6 text-red-400" />
      </div>
      <h3 className="text-lg font-bold text-white mb-1">Delete SEO Page?</h3>
      <p className="text-sm text-zinc-400 mb-6">
        <span className="text-zinc-200 font-medium">/{page?.slug}</span> will be permanently removed.
        This cannot be undone.
      </p>
      <div className="flex gap-3">
        <button
          onClick={onCancel}
          className="flex-1 py-2.5 rounded-xl text-sm font-medium text-zinc-300 hover:bg-white/[0.06] transition"
          style={{ border: "1px solid rgba(255,255,255,0.08)" }}
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          disabled={loading}
          className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-red-500/20 hover:bg-red-500/30
            text-red-400 transition disabled:opacity-50"
          style={{ border: "1px solid rgba(239,68,68,0.2)" }}
        >
          {loading ? "Deleting..." : "Delete"}
        </button>
      </div>
    </div>
  </div>
);

// ============================================
// 🎯 MAIN COMPONENT
// ============================================
const SeoAdminManager = ({ onCreateNew, onEdit }) => {
  const dispatch = useDispatch();
  const {
    pages,
    totalPages,
    filters,
    selectedIds,
    loading,
    deleting,
    bulkUpdating,
    error,
    successMessage,
  } = useSelector((state) => state.seoAdmin);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // ── Initial fetch
  useEffect(() => {
    dispatch(fetchAllSeoPages(filters));
  }, []);

  // ── Auto dismiss success
  useEffect(() => {
    if (successMessage) {
      const t = setTimeout(() => dispatch(clearSuccess()), 3000);
      return () => clearTimeout(t);
    }
  }, [successMessage]);

  // ── Debounced search
  useEffect(() => {
    const t = setTimeout(() => {
      dispatch(setFilters({ search: searchInput }));
      dispatch(fetchAllSeoPages({ ...filters, search: searchInput }));
    }, 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  const handleFilterChange = (key, value) => {
    const updated = { ...filters, [key]: value };
    dispatch(setFilters(updated));
    dispatch(fetchAllSeoPages(updated));
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await dispatch(deleteSeoPage(deleteTarget._id));
    setDeleteTarget(null);
  };

  const handleBulkPublish = (published) => {
    if (!selectedIds.length) return;
    dispatch(bulkUpdateStatus({ ids: selectedIds, published }));
  };

  const handleSelectAll = () => {
    if (selectedIds.length === pages.length) {
      dispatch(deselectAllPages());
    } else {
      dispatch(selectAllPages());
    }
  };

  // ── Stats
  const published = pages.filter((p) => p.published).length;
  const drafts = pages.filter((p) => !p.published).length;
  const totalViews = pages.reduce((s, p) => s + (p.views || 0), 0);

  return (
    <div className="space-y-6">

      {/* ── Success Toast */}
      {successMessage && (
        <div
          className="flex items-center gap-3 px-4 py-3 rounded-2xl"
          style={{
            background: "rgba(16,185,129,0.1)",
            border: "1px solid rgba(16,185,129,0.2)",
          }}
        >
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-sm font-medium text-emerald-300">{successMessage}</span>
        </div>
      )}

      {/* ── Error Toast */}
      {error && (
        <div
          className="flex items-center justify-between gap-3 px-4 py-3 rounded-2xl"
          style={{
            background: "rgba(239,68,68,0.08)",
            border: "1px solid rgba(239,68,68,0.2)",
          }}
        >
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
            <span className="text-sm text-red-300">{error}</span>
          </div>
          <button onClick={() => dispatch(clearError())}>
            <X className="w-4 h-4 text-red-400" />
          </button>
        </div>
      )}

      {/* ── Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard icon={FileText}   label="Total Pages"    value={totalPages}   color="bg-blue-500/15 text-blue-400" />
        <StatCard icon={Globe}      label="Live"           value={published}    color="bg-emerald-500/15 text-emerald-400" />
        <StatCard icon={EyeOff}     label="Drafts"         value={drafts}       color="bg-zinc-500/15 text-zinc-400" />
        <StatCard icon={TrendingUp} label="Total Views"    value={totalViews.toLocaleString()} color="bg-purple-500/15 text-purple-400" />
      </div>

      {/* ── Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div
          className="flex items-center gap-2 flex-1 px-4 py-2.5 rounded-xl"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <Search className="w-4 h-4 text-zinc-500 flex-shrink-0" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search by title or slug..."
            className="flex-1 bg-transparent text-sm text-zinc-200 placeholder-zinc-600 outline-none"
          />
          {searchInput && (
            <button onClick={() => setSearchInput("")}>
              <X className="w-4 h-4 text-zinc-500" />
            </button>
          )}
        </div>

        {/* Filter toggle */}
        <button
          onClick={() => setShowFilters((p) => !p)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition ${
            showFilters ? "bg-white/10 text-white" : "text-zinc-400 hover:text-white"
          }`}
          style={{ border: "1px solid rgba(255,255,255,0.08)" }}
        >
          <Filter className="w-4 h-4" />
          Filters
          <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showFilters ? "rotate-180" : ""}`} />
        </button>

        {/* Refresh */}
        <button
          onClick={() => dispatch(fetchAllSeoPages(filters))}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-zinc-400 hover:text-white transition"
          style={{ border: "1px solid rgba(255,255,255,0.08)" }}
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
        </button>

        {/* Create */}
        <button
          onClick={onCreateNew}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold
            bg-blue-600 hover:bg-blue-500 text-white transition"
        >
          <Plus className="w-4 h-4" />
          New Page
        </button>
      </div>

      {/* ── Filter Panel */}
      {showFilters && (
        <div
          className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 rounded-2xl"
          style={{
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          {/* Page Type */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Page Type</label>
            <select
              value={filters.pageType}
              onChange={(e) => handleFilterChange("pageType", e.target.value)}
              className="w-full px-3 py-2 rounded-xl text-sm text-zinc-200 outline-none"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <option value="all">All Types</option>
              <option value="subject">Subject</option>
              <option value="semester">Semester</option>
              <option value="category">Category</option>
              <option value="university">University</option>
              <option value="custom">Custom</option>
            </select>
          </div>

          {/* Status */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Status</label>
            <select
              value={filters.published}
              onChange={(e) => handleFilterChange("published", e.target.value)}
              className="w-full px-3 py-2 rounded-xl text-sm text-zinc-200 outline-none"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <option value="all">All Status</option>
              <option value="true">Live</option>
              <option value="false">Draft</option>
            </select>
          </div>

          {/* Sort */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Sort By</label>
            <select
              value={filters.sortBy}
              onChange={(e) => handleFilterChange("sortBy", e.target.value)}
              className="w-full px-3 py-2 rounded-xl text-sm text-zinc-200 outline-none"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <option value="-createdAt">Newest First</option>
              <option value="createdAt">Oldest First</option>
              <option value="-views">Most Views</option>
              <option value="-clicks">Most Clicks</option>
            </select>
          </div>

          {/* Reset */}
          <button
            onClick={() => {
              dispatch(resetFilters());
              setSearchInput("");
              dispatch(fetchAllSeoPages({}));
            }}
            className="col-span-full text-xs text-zinc-500 hover:text-zinc-300 text-left transition"
          >
            ↺ Reset all filters
          </button>
        </div>
      )}

      {/* ── Bulk Actions Bar */}
      {selectedIds.length > 0 && (
        <div
          className="flex items-center justify-between px-4 py-3 rounded-2xl"
          style={{
            background: "rgba(59,130,246,0.08)",
            border: "1px solid rgba(59,130,246,0.2)",
          }}
        >
          <span className="text-sm font-medium text-blue-300">
            {selectedIds.length} page{selectedIds.length > 1 ? "s" : ""} selected
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleBulkPublish(true)}
              disabled={bulkUpdating}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold
                bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25 transition"
            >
              <Globe className="w-3.5 h-3.5" />
              Publish
            </button>
            <button
              onClick={() => handleBulkPublish(false)}
              disabled={bulkUpdating}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold
                bg-zinc-500/15 text-zinc-400 hover:bg-zinc-500/25 transition"
            >
              <EyeOff className="w-3.5 h-3.5" />
              Unpublish
            </button>
            <button
              onClick={() => dispatch(deselectAllPages())}
              className="p-1.5 rounded-lg hover:bg-white/10 transition"
            >
              <X className="w-4 h-4 text-zinc-400" />
            </button>
          </div>
        </div>
      )}

      {/* ── Table */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{ border: "1px solid rgba(255,255,255,0.06)" }}
      >
        {/* Table Header */}
        <div
          className="grid grid-cols-[auto_1fr_120px_100px_100px_80px_100px] gap-4 px-4 py-3 text-[11px]
            font-semibold text-zinc-500 uppercase tracking-wider"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
        >
          {/* Checkbox */}
          <button onClick={handleSelectAll} className="flex items-center">
            {selectedIds.length === pages.length && pages.length > 0 ? (
              <CheckSquare className="w-4 h-4 text-blue-400" />
            ) : (
              <Square className="w-4 h-4 text-zinc-600" />
            )}
          </button>
          <span>Page</span>
          <span>Type</span>
          <span>Status</span>
          <span>Views</span>
          <span>Clicks</span>
          <span className="text-right">Actions</span>
        </div>

        {/* Loading */}
        {loading && (
          <div className="py-16 flex flex-col items-center gap-3">
            <RefreshCw className="w-6 h-6 text-zinc-600 animate-spin" />
            <p className="text-sm text-zinc-600">Loading pages...</p>
          </div>
        )}

        {/* Empty */}
        {!loading && pages.length === 0 && (
          <div className="py-16 flex flex-col items-center gap-3">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center"
              style={{ background: "rgba(255,255,255,0.04)" }}
            >
              <FileText className="w-6 h-6 text-zinc-600" />
            </div>
            <p className="text-sm text-zinc-500">No SEO pages found</p>
            <button
              onClick={onCreateNew}
              className="text-xs text-blue-400 hover:text-blue-300 transition"
            >
              + Create your first page
            </button>
          </div>
        )}

        {/* Rows */}
        {!loading && pages.map((page, i) => {
          const isSelected = selectedIds.includes(page._id);
          const isLast = i === pages.length - 1;

          return (
            <div
              key={page._id}
              className={`grid grid-cols-[auto_1fr_120px_100px_100px_80px_100px] gap-4 px-4 py-3.5
                items-center hover:bg-white/[0.02] transition group
                ${isSelected ? "bg-blue-500/[0.04]" : ""}
                ${!isLast ? "border-b border-white/[0.04]" : ""}
              `}
            >
              {/* Checkbox */}
              <button onClick={() => dispatch(toggleSelectedPage(page._id))}>
                {isSelected ? (
                  <CheckSquare className="w-4 h-4 text-blue-400" />
                ) : (
                  <Square className="w-4 h-4 text-zinc-700 group-hover:text-zinc-500" />
                )}
              </button>

              {/* Page info */}
              <div className="min-w-0">
                <p className="text-sm font-medium text-zinc-200 truncate">{page.title}</p>
                <p className="text-xs text-zinc-600 truncate mt-0.5">/{page.slug}</p>
              </div>

              {/* Type */}
              <div>
                <PageTypeBadge type={page.pageType} />
              </div>

              {/* Status */}
              <div>
                <StatusBadge published={page.published} />
              </div>

              {/* Views */}
              <span className="text-sm text-zinc-400">
                {(page.views || 0).toLocaleString()}
              </span>

              {/* Clicks */}
              <span className="text-sm text-zinc-400">
                {(page.clicks || 0).toLocaleString()}
              </span>

              {/* Actions */}
              <div className="flex items-center justify-end gap-1">
                {/* Live preview */}
                <a
                  href={`/${page.slug}`}
                  target="_blank"
                  rel="noreferrer"
                  className="p-1.5 rounded-lg hover:bg-white/[0.06] text-zinc-600 hover:text-zinc-200 transition"
                  title="Preview"
                >
                  <Eye className="w-4 h-4" />
                </a>

                {/* Edit */}
                <button
                  onClick={() => onEdit(page)}
                  className="p-1.5 rounded-lg hover:bg-white/[0.06] text-zinc-600 hover:text-zinc-200 transition"
                  title="Edit"
                >
                  <Edit3 className="w-4 h-4" />
                </button>

                {/* Delete */}
                <button
                  onClick={() => setDeleteTarget(page)}
                  className="p-1.5 rounded-lg hover:bg-red-500/10 text-zinc-600 hover:text-red-400 transition"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Footer count */}
      {pages.length > 0 && (
        <p className="text-xs text-zinc-600 text-center">
          Showing {pages.length} page{pages.length !== 1 ? "s" : ""}
        </p>
      )}

      {/* ── Delete Modal */}
      {deleteTarget && (
        <ConfirmDeleteModal
          page={deleteTarget}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          loading={deleting}
        />
      )}
    </div>
  );
};

export default SeoAdminManager;
