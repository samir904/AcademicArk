import { useDispatch, useSelector } from "react-redux";
import { trackNoteInteraction } from "../../REDUX/Slices/sessionSlice";

export const useNoteTracking = () => {
  const dispatch = useDispatch();
  const sessionId = useSelector(
    (state) => state.session.currentSession?.sessionId
  );

  const safeDispatch = async(payload) => {
    if (!sessionId) return;
    dispatch(trackNoteInteraction({ sessionId, ...payload }));
    // 2️⃣ Persistent activity log (for resume logic)
      await logUserActivity({
        activityType: "NOTE_VIEWED",
        resourceId: noteId,
        resourceType: "NOTE",
        metadata: {
          viewDuration: metadata.duration || 0,
          scrollPercent: metadata.scrollPercent || 0
        }
      });
  };

  return {
    trackView: (noteId,metadata={}) =>
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
