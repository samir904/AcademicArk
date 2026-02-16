import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

export default function FAQSection({ faqs }) {
  if (!faqs || faqs.length === 0) return null;

  return (
    <section className="mt-16">
      <div className="flex items-center space-x-3 mb-8">
        <HelpCircle className="w-8 h-8 text-blue-400" />
        <h2 className="text-2xl md:text-3xl font-bold text-white">
          Frequently Asked Questions
        </h2>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <FAQItem key={index} question={faq.question} answer={faq.answer} />
        ))}
      </div>
    </section>
  );
}

function FAQItem({ question, answer }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden hover:border-gray-700 transition">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-5 text-left flex items-center justify-between group"
      >
        <h3 className="font-semibold text-white text-lg pr-4 group-hover:text-blue-400 transition">
          {question}
        </h3>
        <ChevronDown
          className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      
      <div
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-6 pb-5 pt-2 border-t border-gray-800">
          <p className="text-gray-300 leading-relaxed">{answer}</p>
        </div>
      </div>
    </div>
  );
}
