// src/PAGES/Note/CardRenderer.jsx - UPDATED to handle Notes AND Videos

import React from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import NoteCard from './NoteCard';
import PyqCard from './PyqCard';
import ImportantCard from './ImportantCard';
import HandwrittenCard from './HandwrittenCard';
import VideoCard from '../video/VideoCard';// ✨ NEW: Import VideoCard
export default function CardRenderer({ note, item, type }) {
  // ✅ Handle both old (note prop) and new (item + type props) calling patterns
  const resource = item || note;
  
  // ✅ FIXED: Check for video properties more carefully
  const isVideo = type === 'video' || 
                  resource?.videoId || 
                  resource?.embedUrl ||
                  resource?.platform === 'YOUTUBE';

  // ✅ NEW: If it's a video, render VideoCard
  if (isVideo) {
    return <VideoCard video={resource} />;
  }

  // ✅ Guard: Check if resource exists
  if (!resource) {
    return null;
  }

  // Existing logic: Switch between different note card types based on category
  switch (resource?.category) {
    case 'PYQ':
      return <PyqCard note={resource} />;
    case 'Important Question':
      return <ImportantCard note={resource} />;
    case 'Handwritten Notes':
      return <HandwrittenCard note={resource} />;
    default:
      return <NoteCard note={resource} />;
  }
}
