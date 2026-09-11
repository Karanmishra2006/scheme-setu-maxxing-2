import React, { useState, useCallback } from 'react';

interface StateData {
  name: string;
  central: number;
  state: number;
  top: string;
}

const STATE_DATA: Record<string, StateData> = {
  JK: { name: 'Jammu & Kashmir', central: 142, state: 38, top: 'PM Awas Yojana — Housing for all' },
  HP: { name: 'Himachal Pradesh', central: 142, state: 52, top: 'Mukhya Mantri Swavalamban Yojana' },
  PB: { name: 'Punjab', central: 142, state: 61, top: 'Ghar Ghar Rozgar Scheme' },
  HR: { name: 'Haryana', central: 142, state: 57, top: 'Mukhyamantri Parivar Samridhi Yojana' },
  UK: { name: 'Uttarakhand', central: 142, state: 44, top: 'Mukhyamantri Swarozgar Yojana' },
  DL: { name: 'Delhi', central: 142, state: 48, top: 'Rozgar Bazaar — Job Portal' },
  UP: { name: 'Uttar Pradesh', central: 142, state: 89, top: 'Mukhyamantri Yuva Swarozgar Yojana' },
  RJ: { name: 'Rajasthan', central: 142, state: 74, top: 'Mukhya Mantri Laghu Udyog Protsahan Yojana' },
  BR: { name: 'Bihar', central: 142, state: 63, top: 'Bihar Student Credit Card Scheme' },
  JH: { name: 'Jharkhand', central: 142, state: 49, top: 'Mukhyamantri Protsahan Yojana' },
  WB: { name: 'West Bengal', central: 142, state: 71, top: 'Krishak Bandhu Scheme' },
  SK: { name: 'Sikkim', central: 142, state: 29, top: 'Sikkim Organic Mission' },
  AS: { name: 'Assam', central: 142, state: 55, top: 'Arunodoi Scheme — DBT to women' },
  NE: { name: 'Northeast States', central: 142, state: 41, top: 'North East Special Package' },
  MP: { name: 'Madhya Pradesh', central: 142, state: 82, top: 'Mukhyamantri Udyam Kranti Yojana' },
  CG: { name: 'Chhattisgarh', central: 142, state: 53, top: 'Rajiv Gandhi Kisan Nyay Yojana' },
  OD: { name: 'Odisha', central: 142, state: 67, top: 'KALIA — Farmer assistance scheme' },
  GJ: { name: 'Gujarat', central: 142, state: 78, top: 'iKhedut — Farmer welfare portal' },
  MH: { name: 'Maharashtra', central: 142, state: 94, top: 'Mahatma Phule Jan Arogya Yojana' },
  TS: { name: 'Telangana', central: 142, state: 69, top: 'Rythu Bandhu — Farmer investment support' },
  AP: { name: 'Andhra Pradesh', central: 142, state: 72, top: 'YSR Rythu Bharosa — Farmer support' },
  KA: { name: 'Karnataka', central: 142, state: 76, top: 'Raitha Siri — Farmer scheme' },
  TN: { name: 'Tamil Nadu', central: 142, state: 85, top: "Chief Minister's Comprehensive Health Insurance" },
  KL: { name: 'Kerala', central: 142, state: 68, top: 'Karshaka Sreyas — Farmer welfare' },
  GA: { name: 'Goa', central: 142, state: 31, top: 'Dayanand Sahakari — Social security' },
};

const STATE_PATHS: Record<string, string> = {
  JK: 'M180,20 L220,15 L255,30 L265,55 L250,75 L230,80 L210,70 L185,55 Z',
  HP: 'M230,80 L255,75 L265,95 L250,110 L225,105 Z',
  PB: 'M185,55 L210,70 L225,105 L200,110 L175,90 L165,70 Z',
  HR: 'M200,110 L225,105 L235,125 L215,140 L195,130 Z',
  UK: 'M250,110 L280,105 L290,130 L265,145 L235,125 Z',
  DL: 'M210,135 L225,130 L228,145 L212,148 Z',
  UP: 'M215,140 L290,130 L310,155 L305,190 L270,205 L230,195 L210,170 Z',
  RJ: 'M130,110 L200,110 L210,170 L190,210 L150,220 L110,200 L100,160 L115,130 Z',
  BR: 'M305,155 L345,150 L355,180 L330,195 L305,190 Z',
  JH: 'M305,190 L355,180 L370,210 L355,235 L320,240 L300,220 Z',
  WB: 'M355,180 L390,175 L400,200 L390,230 L365,240 L355,235 L370,210 Z',
  SK: 'M390,155 L410,150 L415,168 L395,172 Z',
  AS: 'M400,155 L450,148 L465,168 L445,182 L410,180 L400,168 Z',
  NE: 'M450,148 L490,145 L500,170 L475,180 L450,175 L445,160 Z',
  MP: 'M150,220 L230,195 L270,205 L285,235 L265,265 L220,270 L175,255 L145,240 Z',
  CG: 'M270,205 L330,195 L355,235 L340,270 L305,280 L270,265 L265,265 Z',
  OD: 'M340,235 L390,230 L400,260 L385,285 L355,290 L335,270 Z',
  GJ: 'M100,200 L150,220 L145,260 L120,280 L85,265 L75,235 L90,215 Z',
  MH: 'M130,255 L220,270 L265,265 L280,300 L255,340 L210,355 L165,340 L130,310 L115,280 Z',
  TS: 'M265,295 L320,285 L335,310 L310,335 L275,330 Z',
  AP: 'M275,330 L355,290 L385,285 L395,320 L370,355 L320,365 L290,355 L275,340 Z',
  KA: 'M195,340 L255,340 L280,360 L270,400 L235,415 L195,400 L175,370 Z',
  TN: 'M235,415 L310,395 L320,420 L295,460 L260,470 L235,450 L225,430 Z',
  KL: 'M195,400 L235,415 L225,450 L205,460 L185,440 L180,415 Z',
  GA: 'M163,338 L178,335 L180,348 L165,350 Z',
};

function getStateFill(total: number, isSelected: boolean): string {
  if (isSelected) return '#16324f';
  if (total >= 230) return '#1D9E75';
  if (total >= 200) return '#9FE1CB';
  return '#B5D4F4';
}

export const IndiaSchemeMap: React.FC = () => {
  const [selected, setSelected] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);

  const handleClick = useCallback((id: string) => {
    setSelected(prev => (prev === id ? null : id));
  }, []);

  const selectedData = selected ? STATE_DATA[selected] : null;

  return (
    <div className="w-full flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-[#001d37]">
          Scheme coverage by state
        </span>
        <span className="text-[11px] px-2.5 py-1 rounded-full bg-[#E1F5EE] text-[#085041] font-semibold border border-[#5DCAA5]/40">
          850+ schemes
        </span>
      </div>

      {/* Map */}
      <div className="w-full rounded-xl bg-[#f5f3ed] border border-[#c3c6ce]/30 p-2">
        <svg
          viewBox="0 0 550 490"
          width="100%"
          xmlns="http://www.w3.org/2000/svg"
        >
          {Object.entries(STATE_PATHS).map(([id, d]) => {
            const data = STATE_DATA[id];
            const total = data.central + data.state;
            const isSelected = selected === id;
            const isHovered = hovered === id;
            return (
              <path
                key={id}
                d={d}
                fill={getStateFill(total, isSelected)}
                stroke={isSelected ? '#001d37' : '#ffffff'}
                strokeWidth={isSelected ? 2.5 : 1.5}
                opacity={hovered && !isHovered && !isSelected ? 0.6 : 1}
                style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                onClick={() => handleClick(id)}
                onMouseEnter={() => setHovered(id)}
                onMouseLeave={() => setHovered(null)}
              />
            );
          })}
        </svg>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-3 px-1">
        <span className="text-[11px] text-[#43474d]">Schemes:</span>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm" style={{ background: '#B5D4F4' }} />
          <span className="text-[11px] text-[#43474d]">170–199</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm" style={{ background: '#9FE1CB' }} />
          <span className="text-[11px] text-[#43474d]">200–229</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm" style={{ background: '#1D9E75' }} />
          <span className="text-[11px] text-[#43474d]">230+</span>
        </div>
      </div>

      {/* Info Card */}
      <div className="rounded-xl bg-white border border-[#c3c6ce]/30 p-4 min-h-[100px] transition-all">
        {!selectedData ? (
          <p className="text-sm text-[#43474d] text-center mt-4">
            Tap any state to see scheme coverage
          </p>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-[#001d37]">
                {selectedData.name}
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded bg-[#eae8e2] text-[#45617d] font-bold tracking-wider uppercase">
                {selectedData.central + selectedData.state} total
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="bg-[#f5f3ed] rounded-lg p-3">
                <div className="text-xl font-bold text-[#16324f]">
                  {selectedData.central}
                </div>
                <div className="text-[11px] text-[#43474d] mt-0.5">
                  Central schemes
                </div>
              </div>
              <div className="bg-[#E1F5EE] rounded-lg p-3">
                <div className="text-xl font-bold text-[#1D9E75]">
                  {selectedData.state}
                </div>
                <div className="text-[11px] text-[#085041] mt-0.5">
                  State schemes
                </div>
              </div>
            </div>

            <div className="bg-[#f5f3ed] rounded-lg p-3 border border-[#c3c6ce]/20">
              <span className="text-[10px] font-bold text-[#1D9E75] tracking-wider uppercase">
                Top scheme
              </span>
              <p className="text-xs text-[#1b1c18] font-medium mt-1 leading-relaxed">
                {selectedData.top}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
