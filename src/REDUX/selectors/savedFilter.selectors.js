import { createSelector } from "@reduxjs/toolkit";

/**
 * Base selector
 */
const selectSavedFilterState = (state) => state.savedFilters;

/**
 * 🔹 Get all saved filter presets
 */
export const selectSavedFilters = createSelector(
  [selectSavedFilterState],
  (savedFilters) => savedFilters.items
);

/**
 * 🔹 Get loading state
 */
export const selectSavedFiltersLoading = createSelector(
  [selectSavedFilterState],
  (savedFilters) => savedFilters.loading
);

/**
 * 🔹 Get error state
 */
export const selectSavedFiltersError = createSelector(
  [selectSavedFilterState],
  (savedFilters) => savedFilters.error
);

/**
 * ⭐ Get default saved filter preset
 */
export const selectDefaultSavedFilter = createSelector(
  [selectSavedFilters],
  (items) => items.find((item) => item.isDefault)
);

/**
 * 🔍 Get preset by id (factory selector)
 * usage: useSelector(selectSavedFilterById(id))
 */
export const selectSavedFilterById = (id) =>
  createSelector([selectSavedFilters], (items) =>
    items.find((item) => item._id === id)
  );