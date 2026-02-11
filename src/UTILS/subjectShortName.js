// utils/subjectShortName.js

const RAW_SUBJECT_ABBREVIATIONS = {
  "database management system": "DBMS",
  "data structures and algorithms": "DSA",
  "object oriented system design with c++": "OOP with C++",
  "object oriented programming with java": "OOP JAVA",
  "operating system": "OS",
  "computer organization and architecture": "COA",
  "theory of automata and formal languages": "TAFL",
  "design and analysis of algorithm": "DAA",
  "artificial intelligence": "AI",
  "machine learning techniques": "MLT",
  "engineering mathematics-i": "MATHS-I",
  "engineering mathematics-ii": "MATHS-II",
  "engineering physics": "PHYSICS",
  "fundamentals of electrical engineering": "ELECTRICAL",
  "environment and ecology": "EVS",
  "engineering chemistry": "CHEMISTRY",
  "soft skills": "SOFT SKILLS",
  "programming for problem solving": "PPS",
  "fundamentals of electronics engineering": "ELECTRONICS",
  "fundamentals of mechanical engineering": "FME",
  "discrete structures & theory of logic": "DSTL",
  "mathematics-iv": "MATHS-IV",
  "universal human values and professional ethics": "UHVE",
  "introduction to data analytics and visualization": "DAV",
  "social media analytics and data analysis": "SMA",
  "Big Data":"BD"
};
const SUBJECT_ABBREVIATIONS = Object.fromEntries(
  Object.entries(RAW_SUBJECT_ABBREVIATIONS).map(([key, value]) => [
    key.trim().toLowerCase(),
    value
  ])
);

 // Subject mapping by semester
  const subjectsBySemester = {
    1: [
      'engineering mathematics-i', 'engineering physics', 'programming for problem solving',
      'environment and ecology', "FUNDAMENTALS OF ELECTRONICS ENGINEERING", "soft skills",
      "fundamentals of mechanical engineering", "engineering chemistry", "fundamentals of electrical engineering"
    ],
    2: [
      'Mathematics-II', , 'engineering physics', 'programming for problem solving',
       'environment and ecology', "FUNDAMENTALS OF ELECTRONICS ENGINEERING", "soft skills",
      "fundamentals of mechanical engineering", "engineering chemistry", "fundamentals of electrical engineering"
    ],
    3: [
      'data structure', 'digital electronics',
      'computer organization and architecture', 'python programming',
      "discrete structures & theory of logic", "mathematics-iv", "technical communication"
    ],
    4: [
      'digital electronics',
      "mathematics-iv",
      "operating system",
      "Theory of Automata and Formal Languages",
      "Object Oriented Programming with Java",
      "CYBER SECURITY", "Universal Human Values and Professional Ethics"
    ],
    5: [
      'Web Technology', 'cloud computing',
      'design and analysis of algorithm',
      "object oriented system design with c++", "machine learning techniques",
      "database management system", "artificial intelligence", "introduction to data analytics and visualization", "Constitution of India"
    ],
    6: [
      'Computer network',
      'software project management',
      "software engineering",
      'Big data and analytics',
      'compiler design',
      "Machine Learning Techniques",
      "cloud computing",
      'Indian Tradition, Culture and Society'
    ],
    7: [
      // 'Advanced Machine Learning', 'Distributed Systems','Data Mining', 'Blockchain Technology',
      "internet of things",
      'project management', "cryptography & network security",
      "deep learning"
    ],
    8: [
      'Advanced AI', 'IoT Systems', 'Big Data Analytics',
      'Cyber Security', 'Industry Training', 'Major Project'
    ]
  };

export function getSubjectShortName(subject = "") {
  if (!subject) return "";

  const normalized = subject.trim().toLowerCase();

  // ✅ 1. Exact abbreviation match (now works)
  if (SUBJECT_ABBREVIATIONS[normalized]) {
    return SUBJECT_ABBREVIATIONS[normalized];
  }

  const words = normalized.split(/\s+/);

  // ✅ 2. Multi-word → initials
  if (words.length > 1) {
    return words.map(w => w[0]).join("").toUpperCase();
  }

  // ✅ 3. Single-word fallback (true last resort)
  const word = words[0];
  return word.length <= 6
    ? word.toUpperCase()
    : word.slice(0, 4).toUpperCase();
}
