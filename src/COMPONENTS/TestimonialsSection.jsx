import React, { useState, useEffect } from 'react';

const TestimonialsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);  // ✨ Track hover state

  const testimonials = [
    {
      name: 'Md Guffran Khan',
      image: "/gufran.jpg",
      review: 'Academic Ark is an outstanding platform for students. It provides everything a learner needs in one place — from well-structured notes and previous year question papers to important questions and an efficient attendance manager. The interface is clean, user-friendly, and designed with students\' needs in mind. It truly makes studying more organized and effective. Highly recommended for every student aiming for smart preparation and better results.',
      rating: 5
    },
    {
      name: 'Ranveer Kumar Singh',
      image: '/ranveer.jpg',
      review: 'AcademicArk is a great, free website for AKTU students. It has easy-to-understand notes for all subjects, important exam questions, and previous year papers that match the latest AKTU syllabus. The site also has an Attendance Manager to help you keep track of your class attendance. The interface is simple and lets you quickly find what you need, like Data Structures, Java, Python, and more. You can study and practice at your own pace. AcademicArk really helps make AKTU exam preparation and attendance easy and stress-free. Highly recommended for all AKTU students!',
      rating: 5
    },
    {
      name: 'Faraz Azmat karimi',
      image: '/fraz.jpg',
      review: 'Academic Ark is a really helpful website for students. The notes are clear, well-organized, and easy to understand. I really liked how everything is available in one place, which saves a lot of time while studying. The website is simple to use and looks neat too. Overall, it\'s a great platform for quick and effective learning!',
      rating: 5
    },
    {
      name: 'Pallavi Kumari',
      image: '/pallavi.jpg',
      review: 'Pros: ✅ UI & overall design of the site ✅ Quality Content ✅ Signup & Login feature ✅ Organised content at one place ✅ Searching materials using keywords. Areas of improvement: Along with AKTU, material for other universities & some skill development courses could also be added. Quizzes & DPPs would make it more engaging with leaderboard. AI assistant for guidance if faced any query.',
      rating: 5
    }
  ];

  // ✨ AUTO-ROTATE EFFECT
  useEffect(() => {
    if (isHovering) return;  // Stop rotation on hover

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);  // Change every 5 seconds

    return () => clearInterval(interval);
  }, [isHovering, testimonials.length]);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="py-32 border-t border-gray-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/5 via-transparent to-purple-900/5"></div>
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-72 h-72 bg-purple-500/5 rounded-full blur-3xl"></div>

      <div className="relative max-w-6xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-20">
          <h2 className="text-4xl sm:text-5xl font-light text-white mb-4">
            Loved by
            <span className="block font-semibold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mt-2">
              AKTU Students
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            See what students are saying about their experience with AcademicArk
          </p>
        </div>

        {/* Main Testimonials Carousel */}
        <div 
          className="mb-12"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <div className="grid md:grid-cols-3 gap-6">
            {/* Left Card - Previous */}
            <div className="opacity-40 transform scale-95 transition-all duration-300">
              {(() => {
                const prevIndex = (currentIndex - 1 + testimonials.length) % testimonials.length;
                const prevTestimonial = testimonials[prevIndex];
                return (
                  <div className="p-6 bg-gray-900/30 border border-gray-800 rounded-2xl h-full">
                    <div className="flex items-center space-x-4 mb-4">
                      <img 
                        src={prevTestimonial.image} 
                        alt={prevTestimonial.name}
                        className="w-12 h-12 rounded-full border-2 border-gray-700 object-cover"
                      />
                      <div>
                        <h3 className="text-white font-semibold">{prevTestimonial.name}</h3>
                        <div className="flex items-center space-x-1">
                          {[...Array(prevTestimonial.rating)].map((_, i) => (
                            <span key={i} className="text-yellow-400 text-sm">★</span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-400 text-sm line-clamp-3">{prevTestimonial.review}</p>
                  </div>
                );
              })()}
            </div>

            {/* Center Card - Current (Active) */}
            <div className="transform scale-100 transition-all duration-300">
              <div className="p-8 bg-gradient-to-br from-indigo-950/50 to-teal-950/50 border border-indigo-500/30 rounded-2xl h-full hover:border-indigo-400/50 transition-all duration-300 shadow-lg">
                {/* Stars */}
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-lg">★</span>
                  ))}
                </div>

                {/* Review Text */}
                <p className="text-indigo-100 leading-relaxed mb-6 line-clamp-4">
                  "{testimonials[currentIndex].review}"
                </p>

                {/* User Info */}
                <div className="flex items-center space-x-4 pt-6 border-t border-indigo-500/20">
                  <img 
                    src={testimonials[currentIndex].image} 
                    alt={testimonials[currentIndex].name}
                    className="w-14 h-14 rounded-full border-2 border-indigo-400/50 object-cover"
                  />
                  <div>
                    <h3 className="text-white font-bold text-lg">
                      {testimonials[currentIndex].name}
                    </h3>
                    <p className="text-indigo-300 text-sm">AKTU Student</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Card - Next */}
            <div className="opacity-40 transform scale-95 transition-all duration-300">
              {(() => {
                const nextIndex = (currentIndex + 1) % testimonials.length;
                const nextTestimonial = testimonials[nextIndex];
                return (
                  <div className="p-6 bg-gray-900/30 border border-gray-800 rounded-2xl h-full">
                    <div className="flex items-center space-x-4 mb-4">
                      <img 
                        src={nextTestimonial.image} 
                        alt={nextTestimonial.name}
                        className="w-12 h-12 rounded-full border-2 border-gray-700 object-cover"
                      />
                      <div>
                        <h3 className="text-white font-semibold">{nextTestimonial.name}</h3>
                        <div className="flex items-center space-x-1">
                          {[...Array(nextTestimonial.rating)].map((_, i) => (
                            <span key={i} className="text-yellow-400 text-sm">★</span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-400 text-sm line-clamp-3">{nextTestimonial.review}</p>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>

        {/* Navigation Controls */}
        <div className="flex items-center justify-center space-x-4">
          {/* Previous Button */}
          <button
            onClick={prevTestimonial}
            className="p-3 bg-gray-900/50 hover:bg-gray-800/70 border border-gray-800 hover:border-gray-700 rounded-full transition-all duration-300 group"
          >
            <svg className="w-5 h-5 text-gray-400 group-hover:text-white group-hover:-translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Dots Indicator with Progress */}
          <div className="flex items-center space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`transition-all duration-300 ${
                  index === currentIndex
                    ? 'w-8 h-2 bg-gradient-to-r from-indigo-500 to-teal-500'
                    : 'w-2 h-2 bg-gray-700 hover:bg-gray-600'
                } rounded-full`}
              />
            ))}
          </div>

          {/* Next Button */}
          <button
            onClick={nextTestimonial}
            className="p-3 bg-gray-900/50 hover:bg-gray-800/70 border border-gray-800 hover:border-gray-700 rounded-full transition-all duration-300 group"
          >
            <svg className="w-5 h-5 text-gray-400 group-hover:text-white group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Auto-rotate indicator */}
        <div className="text-center mt-6">
          <p className="text-xs text-gray-500 flex items-center justify-center space-x-2">
            <span className={`w-2 h-2 rounded-full ${isHovering ? 'bg-gray-600' : 'bg-indigo-500 animate-pulse'}`}></span>
            <span>{isHovering ? 'Paused' : 'Auto-rotating every 5 seconds'}</span>
          </p>
        </div>

       
      </div>
    </section>
  );
};

export default TestimonialsSection;

/* {/* All Testimonials Grid - Below */
        // <div className="mt-20 pt-12 border-t border-gray-900">
        //   <h3 className="text-2xl font-semibold text-white text-center mb-12">
        //     What Our Students Are Saying
        //   </h3>
        //   <div className="grid md:grid-cols-2 gap-6">
        //     {testimonials.map((testimonial, index) => (
        //       <div 
        //         key={index}
        //         className="p-6 bg-gray-900/40 hover:bg-gray-900/60 border border-gray-800 hover:border-gray-700 rounded-xl transition-all duration-300 group cursor-pointer"
        //         onClick={() => setCurrentIndex(index)}
        //       >
        //         {/* Header */}
        //         <div className="flex items-start justify-between mb-4">
        //           <div className="flex items-center space-x-3">
        //             <img 
        //               src={testimonial.image} 
        //               alt={testimonial.name}
        //               className="w-10 h-10 rounded-full border-2 border-gray-700 group-hover:border-indigo-500/50 transition-all object-cover"
        //             />
        //             <div>
        //               <h4 className="text-white font-semibold text-sm">{testimonial.name}</h4>
        //               <p className="text-gray-500 text-xs">AKTU Student</p>
        //             </div>
        //           </div>
        //           <div className="flex items-center space-x-0.5">
        //             {[...Array(testimonial.rating)].map((_, i) => (
        //               <span key={i} className="text-yellow-400 text-xs">★</span>
        //             ))}
        //           </div>
        //         </div>

        //         {/* Review Text */}
        //         <p className="text-gray-300 text-sm leading-relaxed line-clamp-3 group-hover:line-clamp-none transition-all">
        //           "{testimonial.review}"
        //         </p>

        //         {/* Read More Hint */}
        //         <p className="text-indigo-400 text-xs mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
        //           Click to view in carousel →
        //         </p>
        //       </div>
        //     ))}
        //   </div>
        // </div>
