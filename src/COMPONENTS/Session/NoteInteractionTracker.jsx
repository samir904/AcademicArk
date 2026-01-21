import { useDispatch, useSelector } from "react-redux";
import { trackNoteInteraction } from "../../REDUX/Slices/sessionSlice";

export const useNoteTracking = () => {
  const dispatch = useDispatch();
  const sessionId = useSelector(
    (state) => state.session.currentSession?.sessionId
  );

  const safeDispatch = (payload) => {
    if (!sessionId) return;
    dispatch(trackNoteInteraction({ sessionId, ...payload }));
  };

  return {
    trackView: (noteId, title) =>
      safeDispatch({ noteId, interactionType: "viewed" }),

    trackClick: (noteId) =>
      safeDispatch({ noteId, interactionType: "clicked" }),

    trackDownload: (noteId) =>
      safeDispatch({ noteId, interactionType: "downloaded" }),

    trackBookmark: (noteId) =>
      safeDispatch({ noteId, interactionType: "bookmarked" }),

    trackRate: (noteId, rating) =>
      safeDispatch({ noteId, interactionType: "rated", rating }),
  };
};
