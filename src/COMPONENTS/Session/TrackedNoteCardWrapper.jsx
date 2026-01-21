/*
FILE: src/COMPONENTS/Session/TrackedNoteCardWrapper.jsx

This component:
1. Takes a note/resource
2. Renders CardRenderer (existing perfect design)
3. Intercepts clicks and adds tracking
4. Passes click handlers to CardRenderer

WHY THIS IS BETTER:
- Reuses your existing perfect card designs (NoteCard, PyqCard, etc.)
- No duplication
- No need to redesign
- Just adds tracking layer
- Works with ALL categories automatically
*/

import React, { useState } from 'react';
import { useNoteTracking} from './NoteInteractionTracker' // Your tracking hook
import NoteCard from '../../PAGES/Note/NoteCard';
import PyqCard from '../../PAGES/Note/PyqCard';
import ImportantCard from '../../PAGES/Note/ImportantCard';
import HandwrittenCard from '../../PAGES/Note/HandwrittenCard';
import VideoCard from '../../PAGES/video/VideoCard';

export const TrackedNoteCard = ({ 
  item, 
  note,
  type,
  onView,
  onDownload,
  onBookmark,
  onRate 
}) => {
  const resource = item || note;
  const { trackView, trackClick, trackDownload, trackBookmark, trackRate } = useNoteTracking();
  const [isRating, setIsRating] = useState(false);

  // ✅ Detect if video
  const isVideo = type === 'video' || 
                  resource?.videoId || 
                  resource?.embedUrl ||
                  resource?.platform === 'YOUTUBE';

  if (!resource) {
    return null;
  }

  // ════════════════════════════════════════════════════════════════════

  // ✅ HANDLERS WITH TRACKING
  // ════════════════════════════════════════════════════════════════════

  const handleViewNote = () => {
    // 1️⃣ TRACK IT
    trackView(resource._id, resource.title);
    trackClick(resource._id);
    
    // 2️⃣ CALL PARENT HANDLER
    onView && onView(resource);
  };

  const handleDownloadNote = () => {
    // 1️⃣ TRACK IT
    trackDownload(resource._id);
    
    // 2️⃣ CALL PARENT HANDLER
    onDownload && onDownload(resource);
  };

  const handleBookmarkNote = () => {
    // 1️⃣ TRACK IT
    trackBookmark(resource._id);
    
    // 2️⃣ CALL PARENT HANDLER
    onBookmark && onBookmark(resource);
  };

  const handleRateNote = (rating) => {
    // 1️⃣ TRACK IT
    trackRate(resource._id, rating);
    
    // 2️⃣ CALL PARENT HANDLER
    onRate && onRate(resource, rating);
    
    // 3️⃣ CLOSE RATING UI
    setIsRating(false);
  };

  // ════════════════════════════════════════════════════════════════════

  // ✅ VIDEO: Return VideoCard (videos don't need special tracking UI)
  // ════════════════════════════════════════════════════════════════════
  
  if (isVideo) {
    return (
      <div onClick={() => handleViewNote()}>
        <VideoCard video={resource} />
      </div>
    );
  }

  // ════════════════════════════════════════════════════════════════════

  // ✅ NOTES: Render correct card based on CATEGORY (like CardRenderer)
  // ════════════════════════════════════════════════════════════════════

  // This wraps the existing card components and adds tracking buttons
  
  const CardComponent = (() => {
    switch (resource?.category) {
      case 'PYQ':
        return PyqCard;
      case 'Important Question':
        return ImportantCard;
      case 'Handwritten Notes':
        return HandwrittenCard;
      default:
        return NoteCard;
    }
  })();

  return (
    <div className="relative group">
      {/* 1️⃣ RENDER THE CORRECT CARD (NoteCard, PyqCard, etc.) */}
      <CardComponent 
        note={resource}
        onClick={handleViewNote}
      />
      
     
    </div>
  );
};

export default TrackedNoteCard;