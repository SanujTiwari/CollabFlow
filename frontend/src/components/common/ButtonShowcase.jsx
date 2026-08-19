import React from 'react';
import UiverseButton from './UiverseButton';

export const ButtonShowcase = () => {
  return (
    <div className="bg-white border border-[#E5E0D8] rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#E5E0D8]">
        <div>
          <h3 className="text-lg font-bold text-[#1E293B]">Uiverse.io Button Effects</h3>
          <p className="text-xs text-[#64748B] mt-0.5">By Gaurav-WebDev • Smooth circular expand hover effect</p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 bg-[#FEF3E7] text-[#D47E30] rounded-full">
          Live Interactive Demo
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center justify-items-center py-4">
        {/* Dark / Original Variant */}
        <div className="flex flex-col items-center gap-3">
          <p className="text-xs font-semibold text-[#64748B]">Default Variant (#252525)</p>
          <button className="button type1">
            <span className="btn-txt">HOVER ME</span>
          </button>
          <span className="text-[11px] text-[#94A3B8]">Class: <code className="bg-slate-100 px-1 py-0.5 rounded">.button .type1</code></span>
        </div>

        {/* Amber / Theme Variant */}
        <div className="flex flex-col items-center gap-3">
          <p className="text-xs font-semibold text-[#64748B]">CollabFlow Accent (#D47E30)</p>
          <UiverseButton variant="amber">
            <span className="btn-txt">CLICK ME</span>
          </UiverseButton>
          <span className="text-[11px] text-[#94A3B8]">Class: <code className="bg-slate-100 px-1 py-0.5 rounded">.button-amber .type1-amber</code></span>
        </div>
      </div>
    </div>
  );
};

export default ButtonShowcase;
