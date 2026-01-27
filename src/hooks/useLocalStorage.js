 const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = React.useState(() => {
    try {
      const item = typeof window !== 'undefined' 
        ? window.localStorage.getItem(key) 
        : null;
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error("Error reading localStorage:", error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function 
        ? value(storedValue) 
        : value;
      setStoredValue(valueToStore);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error("Error setting localStorage:", error);
    }
  };

  return [storedValue, setValue];
};


<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {notes.map((note, index) => {
    const isLast = index === notes.length - 1;

    return (
      <div ref={isLast ? lastRef : null} key={note._id}>
        <TrackedNoteCard note={note} />
      </div>
    );
  })}
</div>

{loading && (
  <div className="text-center py-6 text-neutral-400">
    Loading more notes…
  </div>
)}

{!pagination.hasMore && (
  <div className="text-center py-6 text-neutral-600 text-sm">
    You’ve reached the end 📘
  </div>
)}