import CardRenderer from "../../PAGES/Note/CardRenderer";

export default function NotesGrid({ notes }) {

  const categoryPriority = {
    "Notes": 1,
    "Handwritten Notes": 2,
    "PYQ": 3,
    "Important Question": 4
  };

  const sortedNotes = [...notes].sort((a, b) => {
    const priorityA = categoryPriority[a.category] || 99;
    const priorityB = categoryPriority[b.category] || 99;
    return priorityA - priorityB;
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {sortedNotes.map((note) => (
        <CardRenderer key={note._id} note={note} />
      ))}
    </div>
  );
}
