import { Link } from "react-router-dom";
import { Home, ChevronRight } from "lucide-react";

export default function Breadcrumb({ filters, slug }) {
  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-400 mb-6">
      <Link 
        to="/" 
        className="flex items-center hover:text-white transition"
      >
        <Home className="w-4 h-4 mr-1" />
        Home
      </Link>

      <ChevronRight className="w-4 h-4 text-gray-600" />

      <Link to="/notes" className="hover:text-white transition">
        Notes
      </Link>

      {/* Semester breadcrumb */}
      {filters?.semester && (
        <>
          <ChevronRight className="w-4 h-4 text-gray-600" />
          <span className="text-white font-medium">
            Semester {filters.semester}
          </span>
        </>
      )}

      {/* Subject breadcrumb */}
      {filters?.subject && !filters?.semester && (
        <>
          <ChevronRight className="w-4 h-4 text-gray-600" />
          <span className="text-white font-medium capitalize">
            {filters.subject}
          </span>
        </>
      )}

      {/* Category breadcrumb */}
      {filters?.category && (
        <>
          <ChevronRight className="w-4 h-4 text-gray-600" />
          <span className="text-white font-medium">
            {filters.category}
          </span>
        </>
      )}
    </nav>
  );
}
