// src/PAGES/Note/CardRenderer.jsx
import React from 'react';
import NoteCard from './Notecard';
import PyqCard from './PyqCard';
import ImportantCard from './ImportantCard';

export default function CardRenderer({ note }) {
  // Switch between different card types based on category
  switch (note.category) {
    case 'PYQ':
      return <PyqCard note={note} />;
    case 'Important Question':
      return <ImportantCard note={note} />;
    default:
      return <NoteCard note={note} />;
  }
}
