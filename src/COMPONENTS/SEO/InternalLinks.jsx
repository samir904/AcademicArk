import { Link } from "react-router-dom";
import { ArrowRight, BookOpen } from "lucide-react";

export default function InternalLinks({ currentSlug, pageType }) {
  // Define related pages based on page type
  const getRelatedPages = () => {
    if (pageType === "semester") {
      return [
        { slug: "aktu-pyq", title: "AKTU Previous Year Papers (PYQ)" },
        { slug: "aktu-handwritten-notes", title: "AKTU Handwritten Notes" },
        { slug: "aktu-dbms-notes", title: "DBMS Notes" }
      ];
    }

    if (pageType === "subject") {
      return [
        { slug: "aktu-semester-5-notes", title: "Semester 5 Notes" },
        { slug: "aktu-pyq", title: "Previous Year Papers" },
        { slug: "aktu-handwritten-notes", title: "Handwritten Notes" }
      ];
    }

    if (pageType === "category") {
      return [
        { slug: "aktu-semester-3-notes", title: "Semester 3 Notes" },
        { slug: "aktu-dbms-notes", title: "DBMS Study Material" },
        { slug: "aktu-daa-notes", title: "DAA Notes" }
      ];
    }

    // Default related pages
    return [
      { slug: "aktu-semester-5-notes", title: "Semester 5 Notes" },
      { slug: "aktu-pyq", title: "Previous Year Papers" },
      { slug: "aktu-handwritten-notes", title: "Handwritten Notes" }
    ];
  };

  const relatedPages = getRelatedPages().filter(page => page.slug !== currentSlug);

  if (relatedPages.length === 0) return null;

  return (
    <section className="mt-16">
      <div className="flex items-center space-x-3 mb-6">
        <BookOpen className="w-6 h-6 text-blue-400" />
        <h2 className="text-2xl font-bold text-white">
          You Might Also Like
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {relatedPages.map((page, idx) => (
          <Link
            key={idx}
            to={`/${page.slug}`}
            className="group bg-gray-900/50 border border-gray-800 rounded-xl p-6 hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/10 transition-all"
          >
            <h3 className="font-semibold text-white mb-2 group-hover:text-blue-400 transition flex items-center justify-between">
              {page.title}
              <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition" />
            </h3>
            <p className="text-sm text-gray-400">
              Explore more study material
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
