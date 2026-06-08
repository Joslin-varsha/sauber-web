import { Search, Users, ClipboardCheck } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      stepNum: 1,
      title: 'Search Service',
      desc: 'Choose the service you need and set your details.',
      icon: Search,
    },
    {
      stepNum: 2,
      title: 'Choose a Worker',
      desc: 'Browse profiles, compare reviews and prices.',
      icon: Users,
    },
    {
      stepNum: 3,
      title: 'Get It Done',
      desc: 'Confirm and relax while the job gets done right.',
      icon: ClipboardCheck,
    },
  ];

  return (
    <section id="how-it-works-section" className="w-full pt-0 pb-8 bg-white text-left">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Block */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-sans font-bold text-lg sm:text-xl text-[#092040]">
            How It Works
          </h2>
          <a
            href="#how-it-works"
            className="font-sans font-bold text-xs sm:text-[13px] text-[#137DC5] hover:underline transition-all cursor-pointer"
          >
            View all steps
          </a>
        </div>
 
        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4 items-start relative">
          
          {steps.map((step, idx) => {
            const StepIcon = step.icon;
            return (
              <div key={step.stepNum} className="flex flex-col items-center text-center relative group">
                
                {/* Horizontal dotted connector arrow for desktop */}
                {idx < 2 && (
                  <div className="hidden md:flex absolute top-14 left-[68%] w-18 justify-center items-center z-0 text-[#137DC5]/80">
                    <svg className="w-14 h-4" viewBox="0 0 60 16" fill="none">
                      <path d="M0 8H50" stroke="currentColor" strokeWidth="2" strokeDasharray="3 3"/>
                      <path d="M44 3L50 8L44 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                )}
 
                {/* Step badge */}
                <div className="w-6 h-6 rounded-full bg-[#137DC5] text-white flex items-center justify-center font-sans font-extrabold text-[11px] mb-4 shadow-sm shadow-blue-500/25 z-10">
                  {step.stepNum}
                </div>

                {/* Plain Icon without background circle */}
                <div className="w-16 h-16 flex items-center justify-center mb-4 text-[#137DC5] group-hover:scale-105 transition-transform duration-300">
                  <StepIcon className="w-7 h-7 stroke-[1.8]" />
                </div>

                {/* Step Details */}
                <h3 className="font-sans font-bold text-slate-800 text-[14.5px] mb-1.5 z-10">
                  {step.title}
                </h3>
                <p className="font-sans text-[12.5px] text-slate-400 max-w-[200px] leading-relaxed z-10">
                  {step.desc}
                </p>
                
              </div>
            );
          })}

        </div>

      </div>
    </section>
  );
}
