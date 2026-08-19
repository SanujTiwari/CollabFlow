import React from 'react';
import TextLoader from './TextLoader';

export const LoaderShowcase = () => {
  return (
    <div className="bg-white border border-[#E5E0D8] rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#E5E0D8]">
        <div>
          <h3 className="text-lg font-bold text-[#1E293B]">Uiverse Sliced Text Loading Effect</h3>
          <p className="text-xs text-[#64748B] mt-0.5">3D Wave Sliced Text with Scrolling Gradient & Wobble Underline</p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 bg-[#FEF3E7] text-[#D47E30] rounded-full">
          Live Interactive Demo
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center justify-items-center py-6">
        {/* Dark Slate Variant */}
        <div className="flex flex-col items-center gap-4 p-6 bg-[#F8F6F2] rounded-xl w-full">
          <p className="text-xs font-semibold text-[#64748B]">Dark Variant (Default)</p>
          <TextLoader text="LOADING" variant="default" size="2.5em" />
        </div>

        {/* CollabFlow Amber Variant */}
        <div className="flex flex-col items-center gap-4 p-6 bg-[#1E293B] rounded-xl w-full">
          <p className="text-xs font-semibold text-slate-300">CollabFlow Theme Variant</p>
          <TextLoader text="COLLABFLOW" variant="amber" size="2.5em" />
        </div>
      </div>
    </div>
  );
};

export default LoaderShowcase;
