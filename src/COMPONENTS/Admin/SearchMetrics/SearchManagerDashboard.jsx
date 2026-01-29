import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createSearchCorrection,
  toggleSearchCorrection,
  resetSearchAdminManageState
} from "../../../REDUX/Slices/searchAdminManageSlice";

import { fetchCorrectionSuggestions, fetchSearchCorrections, fetchSearchSynonyms } from "../../../REDUX/Slices/searchAdminAnalyticsSlice";
import {
  createSearchSynonym,
  toggleSearchSynonym
} from "../../../REDUX/Slices/searchAdminManageSlice";

import { Link2, Plus, ToggleLeft, ToggleRight } from "lucide-react";

import {
  SpellCheck
} from "lucide-react";

const SearchManagerDashboard = () => {
  const dispatch = useDispatch();
/* ---------------- SYNONYM STATE ---------------- */
const [keyword, setKeyword] = useState("");
const [expandsTo, setExpandsTo] = useState("");

  const { corrections, loading,correctionSuggestions } = useSelector(
    (state) => state.searchAdminAnalytics
  );

  const { lastAction } = useSelector(
    (state) => state.searchAdminManage
  );

  /* ---------------- FORM STATE ---------------- */
  const [wrongQuery, setWrongQuery] = useState("");
  const [correctQuery, setCorrectQuery] = useState("");

  /* ---------------- LOAD DATA ---------------- */
  useEffect(() => {
    dispatch(fetchSearchSynonyms());
    dispatch(fetchSearchCorrections());
    dispatch(fetchCorrectionSuggestions());
  }, [dispatch]);

  /* ---------------- AFTER SUCCESS ---------------- */
  useEffect(() => {
    if (lastAction === "success") {
      setWrongQuery("");
      setCorrectQuery("");
    //   dispatch(fetchSearchCorrections());
      dispatch(resetSearchAdminManageState());
    }
  }, [lastAction, dispatch]);

  /* ---------------- HANDLERS ---------------- */

 const handleCreateCorrection = async () => {
  if (!wrongQuery.trim() || !correctQuery.trim()) return;

  const res = await dispatch(
    createSearchCorrection({ wrongQuery, correctQuery })
  );

  if (res.meta.requestStatus === "fulfilled") {
    dispatch(fetchSearchCorrections());
    dispatch(fetchCorrectionSuggestions());
  }
};

const handleCreateSynonym = () => {
  if (!keyword.trim() || !expandsTo.trim()) return;

  const res =dispatch(
    createSearchSynonym({
      keyword,
      expandsTo: expandsTo
        .split(",")
        .map(s => s.trim())
        .filter(Boolean)
    })
  );

   if (res.meta.requestStatus === "fulfilled") {
    dispatch(fetchSearchCorrections());
    dispatch(fetchCorrectionSuggestions());
  }

  setKeyword("");
  setExpandsTo("");
};

  const handleToggle = (id) => {
    dispatch(toggleSearchCorrection(id));
  };
const { synonyms } = useSelector(
  state => state.searchAdminAnalytics
);

  /* ---------------- UI ---------------- */

  return (
    <div className="space-y-10">

      {/* HEADER */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-blue-500/15 flex items-center justify-center">
          <SpellCheck className="w-5 h-5 text-blue-400" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-white">
            Search Manager
          </h2>
          <p className="text-sm text-gray-400">
            Control typos, corrections & search intelligence
          </p>
        </div>
      </div>
{correctionSuggestions.length > 0 && (
  <div className="mb-10">
    <h3 className="text-lg font-semibold text-white mb-4">
      ⚠️ Suggested Corrections
    </h3>

    <div className="space-y-3">
      {correctionSuggestions.map((item) => (
        <div
          key={item._id}
          className="flex items-center justify-between bg-[#111] border border-yellow-500/20 rounded-xl p-4"
        >
          <div>
            <p className="text-sm text-gray-300">
              Users searched <b className="text-yellow-400">{item.rawQuery}</b>
            </p>
            <p className="text-xs text-gray-500">
              Failed {item.count} times
            </p>
          </div>

          <button
            onClick={() =>
              dispatch(
                createSearchCorrection({
                  wrongQuery: item.rawQuery,
                  correctQuery: "" // admin fills
                })
              )
            }
            className="px-4 py-1.5 text-xs rounded-full bg-yellow-500/20 text-yellow-300 hover:bg-yellow-500/30"
          >
            Create Correction
          </button>
        </div>
      ))}
    </div>
  </div>
)}

      {/* CREATE CORRECTION */}
      <div className="bg-[#111111] border border-white/10 rounded-xl p-6">
        <h3 className="text-sm font-semibold text-white mb-4">
          ➕ Add Search Correction
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            value={wrongQuery}
            onChange={(e) => setWrongQuery(e.target.value)}
            placeholder="Wrong query (e.g. data structre)"
            className="bg-[#1F1F1F] border border-white/10 rounded-lg px-4 py-2 text-sm text-white"
          />

          <input
            value={correctQuery}
            onChange={(e) => setCorrectQuery(e.target.value)}
            placeholder="Correct query (e.g. data structure)"
            className="bg-[#1F1F1F] border border-white/10 rounded-lg px-4 py-2 text-sm text-white"
          />

          <button
            onClick={handleCreateCorrection}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2
              bg-blue-600 hover:bg-blue-700 text-white
              px-4 py-2 rounded-lg text-sm font-medium transition"
          >
            <Plus size={16} />
            Add
          </button>
        </div>
      </div>

      {/* CORRECTIONS TABLE */}
      <div className="bg-[#111111] border border-white/10 rounded-xl p-6">
        <h3 className="text-sm font-semibold text-white mb-4">
          🧠 Existing Corrections
        </h3>

        {corrections.length === 0 ? (
          <p className="text-xs text-gray-500">
            No corrections added yet
          </p>
        ) : (
          <div className="space-y-2">
            {corrections.map((c) => (
              <div
                key={c._id}
                className="flex items-center justify-between
                  bg-[#1A1A1A] border border-white/5
                  rounded-lg px-4 py-3"
              >
                <div>
                  <p className="text-sm text-white">
                    <span className="text-red-400">{c.wrongQuery}</span>
                    {" → "}
                    <span className="text-emerald-400">{c.correctQuery}</span>
                  </p>
                  <p className="text-xs text-gray-500">
                    Source: {c.source} • Used {c.frequency} times
                  </p>
                </div>

                <button
                  onClick={() => handleToggle(c._id)}
                  className="text-gray-400 hover:text-white transition"
                  title="Toggle active"
                >
                  {c.isActive ? (
                    <ToggleRight className="text-green-400" />
                  ) : (
                    <ToggleLeft className="text-gray-500" />
                  )}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* ================= SYNONYMS MANAGER ================= */}
<div className="bg-[#111111] border border-white/10 rounded-xl p-6">
  <div className="flex items-center gap-3 mb-6">
    <div className="w-9 h-9 rounded-lg bg-purple-500/15 flex items-center justify-center">
      <Link2 className="w-4 h-4 text-purple-400" />
    </div>
    <div>
      <h3 className="text-sm font-semibold text-white">
        Synonyms Manager
      </h3>
      <p className="text-xs text-gray-400">
        Expand meanings (DS → Data Structure)
      </p>
    </div>
  </div>

  {/* ADD SYNONYM */}
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
    <input
      value={keyword}
      onChange={(e) => setKeyword(e.target.value)}
      placeholder="Keyword (e.g. ds)"
      className="bg-[#1F1F1F] border border-white/10 rounded-lg px-4 py-2 text-sm text-white"
    />

    <input
      value={expandsTo}
      onChange={(e) => setExpandsTo(e.target.value)}
      placeholder="Expands to (comma separated)"
      className="bg-[#1F1F1F] border border-white/10 rounded-lg px-4 py-2 text-sm text-white"
    />

    <button
      onClick={handleCreateSynonym}
      className="inline-flex items-center justify-center gap-2
        bg-purple-600 hover:bg-purple-700 text-white
        px-4 py-2 rounded-lg text-sm font-medium transition"
    >
      <Plus size={16} />
      Add
    </button>
  </div>

  {/* EXISTING SYNONYMS */}
  <div className="space-y-2">
    {synonyms?.length === 0 ? (
      <p className="text-xs text-gray-500">
        No synonyms added yet
      </p>
    ) : (
      synonyms.map((s) => (
        <div
          key={s._id}
          className="flex items-center justify-between
            bg-[#1A1A1A] border border-white/5
            rounded-lg px-4 py-3"
        >
          <div>
            <p className="text-sm text-white">
              <span className="text-purple-400">{s.keyword}</span>
              {" → "}
              <span className="text-gray-300">
                {s.expandsTo.join(", ")}
              </span>
            </p>
          </div>

          <button
            onClick={() => dispatch(toggleSearchSynonym(s._id))}
            className="text-gray-400 hover:text-white transition"
          >
            {s.isActive ? (
              <ToggleRight className="text-green-400" />
            ) : (
              <ToggleLeft className="text-gray-500" />
            )}
          </button>
        </div>
      ))
    )}
  </div>
</div>

    </div>
  );
};

export default SearchManagerDashboard;
