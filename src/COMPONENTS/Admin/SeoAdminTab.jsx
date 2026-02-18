import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { clearCurrentPage } from "../../REDUX/Slices/seoAdminSlice";
import SeoAdminManager from "./SeoAdminManager";
import SeoPageForm from "./SeoPageForm"; // ← Part 4 (next)

const VIEWS = { LIST: "list", CREATE: "create", EDIT: "edit" };

const SeoAdminTab = () => {
  const dispatch = useDispatch();
  const [view, setView] = useState(VIEWS.LIST);
  const [editingPage, setEditingPage] = useState(null);

  const goToList = () => {
    setView(VIEWS.LIST);
    setEditingPage(null);
    dispatch(clearCurrentPage());
  };

  const goToEdit = (page) => {
    setEditingPage(page);
    setView(VIEWS.EDIT);
  };

  return (
    <div>
      {/* ── Breadcrumb */}
      {view !== VIEWS.LIST && (
        <div className="flex items-center gap-2 mb-6 text-sm">
          <button
            onClick={goToList}
            className="text-zinc-500 hover:text-zinc-200 transition"
          >
            SEO Manager
          </button>
          <span className="text-zinc-700">/</span>
          <span className="text-zinc-200 font-medium">
            {view === VIEWS.CREATE ? "New Page" : `Edit: ${editingPage?.slug}`}
          </span>
        </div>
      )}

      {/* ── Views */}
      {view === VIEWS.LIST && (
        <SeoAdminManager
          onCreateNew={() => setView(VIEWS.CREATE)}
          onEdit={goToEdit}
        />
      )}

      {(view === VIEWS.CREATE || view === VIEWS.EDIT) && (
        <SeoPageForm
          mode={view}
          initialData={editingPage}
          onSuccess={goToList}
          onCancel={goToList}
        />
      )}
    </div>
  );
};

export default SeoAdminTab;
