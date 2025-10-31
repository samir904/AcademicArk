// src/PAGES/Note/CardRenderer.jsx
import React from 'react';
import NoteCard from './NoteCard';
import PyqCard from './PyqCard';
import ImportantCard from './ImportantCard';
import HandwrittenCard from './HandwrittenCard';

export default function CardRenderer({ note }) {
  // Switch between different card types based on category
  switch (note.category) {
    case 'PYQ':
      return <PyqCard note={note} />;
    case 'Important Question':
      return <ImportantCard note={note} />;
    case 'Handwritten Notes':
      return <HandwrittenCard note={note} />;
    default:
      return <NoteCard note={note} />;
  }
}
