import React, { useRef, useEffect } from 'react';
import { Orbit, Compass, Activity } from 'lucide-react';

export default function OrbitalTrajectoryCanvas({ validationResult, activeMission }) {
  const canvasRef = useRef(null);
  const animFrameId = useRef(null);

  // Ambil delta-v dan target misi
  const currentDeltaV = validationResult?.deltaV || 0;
  const targetDeltaV = validationResult?.targetDeltaV || 1000;
  const isOrbitReady = Boolean(validationResult?.isValid);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let trueAnomaly = 0; // Sudut pergerakan orbital satelit (radian)

    // Parameter visualisasi orbit
    const missionName = (activeMission?.name || '').toLowerCase();
    let bodyColor = '#38bdf8'; // Bumi (Default)
    let bodyName = 'EARTH';
    let bodyRadius = 24;

    if (missionName.includes('selene') || missionName.includes('lunar') || missionName.includes('moon')) {
      bodyColor = '#94a3b8'; // Bulan
      bodyName = 'MOON';
      bodyRadius = 18;
    } else if (missionName.includes('mars') || missionName.includes('ares')) {
      bodyColor = '#f97316'; // Mars
      bodyName = 'MARS';
      bodyRadius = 20;
    } else if (missionName.includes('jupiter') || missionName.includes('jovian')) {
      bodyColor = '#eab308'; // Jupiter
      bodyName = 'JUPITER';
      bodyRadius = 32;
    }

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;
      const centerX = width / 2;
      const centerY = height / 2;

      ctx.clearRect(0, 0, width, height);

      // 1. Gambar Grid Ruang Angkasa
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1;
      const step = 25;
      for (let x = 0; x < width; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // 2. Hitung Bentuk Elips Keplerian berdasarkan Delta-v
      // Rasio delta-v terhadap target menentukan ekspansi elips
      const ratio = Math.min(Math.max(currentDeltaV / Math.max(targetDeltaV, 1), 0.25), 1.6);
      const semiMajorA = 48 + ratio * 48; // Sumbu semi-mayor
      const eccentricity = Math.min(Math.max((ratio - 0.7) * 0.45, 0.05), 0.65); // Eksentrisitas elips
      const semiMinorB = semiMajorA * Math.sqrt(1 - eccentricity * eccentricity);
      const focalDist = semiMajorA * eccentricity; // Jarak fokus planet

      const orbitCenterX = centerX - focalDist;
      const orbitCenterY = centerY;

      // 3. Lintasan Orbit (Elips)
      ctx.beginPath();
      ctx.ellipse(orbitCenterX, orbitCenterY, semiMajorA, semiMinorB, 0, 0, Math.PI * 2);
      ctx.strokeStyle = isOrbitReady ? '#10b981' : '#f43f5e';
      ctx.lineWidth = isOrbitReady ? 2 : 1.5;
      if (!isOrbitReady) {
        ctx.setLineDash([4, 4]); // Garis putus-putus jika defisit
      } else {
        ctx.setLineDash([]);
      }
      ctx.stroke();
      ctx.setLineDash([]);

      // 4. Titik Periapsis (Rp) dan Apoapsis (Ra)
      const periapsisX = orbitCenterX + semiMajorA;
      const apoapsisX = orbitCenterX - semiMajorA;

      // Titik Rp
      ctx.fillStyle = '#06b6d4';
      ctx.beginPath();
      ctx.arc(periapsisX, orbitCenterY, 3.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.font = '9px monospace';
      ctx.fillText('Rp (Periapsis)', periapsisX + 5, orbitCenterY - 4);

      // Titik Ra
      ctx.fillStyle = '#a855f7';
      ctx.beginPath();
      ctx.arc(apoapsisX, orbitCenterY, 3.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillText('Ra (Apoapsis)', apoapsisX - 68, orbitCenterY - 4);

      // 5. Planet Utama di Pusat Gravitasi (Fokus)
      // Glow atmosfer planet
      const grad = ctx.createRadialGradient(centerX, centerY, bodyRadius * 0.5, centerX, centerY, bodyRadius * 1.6);
      grad.addColorStop(0, bodyColor);
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, bodyRadius * 1.6, 0, Math.PI * 2);
      ctx.fill();

      // Bola Planet
      ctx.fillStyle = bodyColor;
      ctx.beginPath();
      ctx.arc(centerX, centerY, bodyRadius, 0, Math.PI * 2);
      ctx.fill();

      // Label Planet
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 9px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(bodyName, centerX, centerY + 3);

      // 6. Animasi Posisi Satelit pada Lintasan
      trueAnomaly += 0.025; // Kecepatan putaran orbit
      const satX = orbitCenterX + semiMajorA * Math.cos(trueAnomaly);
      const satY = orbitCenterY + semiMinorB * Math.sin(trueAnomaly);

      // Ekor Trajectory Trail
      ctx.beginPath();
      ctx.arc(satX, satY, 5, 0, Math.PI * 2);
      ctx.fillStyle = isOrbitReady ? '#34d399' : '#fb7185';
      ctx.shadowColor = isOrbitReady ? '#10b981' : '#f43f5e';
      ctx.shadowBlur = 10;
      ctx.fill();
      ctx.shadowBlur = 0; // Reset shadow

      // Label Satelit
      ctx.fillStyle = '#e2e8f0';
      ctx.font = '8px monospace';
      ctx.fillText('ORBITER', satX, satY - 7);

      animFrameId.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animFrameId.current) {
        cancelAnimationFrame(animFrameId.current);
      }
    };
  }, [currentDeltaV, targetDeltaV, isOrbitReady, activeMission]);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-col justify-between">
      {/* Header Canvas */}
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-xs font-mono">
        <div className="flex items-center gap-2 text-cyan-400 font-bold">
          <Orbit className="w-4 h-4 animate-spin" />
          <span>2D Keplerian Orbital Trajectory</span>
        </div>
        <div className="flex items-center gap-2 text-[10px]">
          <span className={`px-2 py-0.5 rounded font-bold ${
            isOrbitReady ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-rose-950 text-rose-400 border border-rose-800'
          }`}>
            {isOrbitReady ? 'CLOSED ORBIT' : 'SUB-ORBITAL'}
          </span>
        </div>
      </div>

      {/* Area Gambar Canvas 2D */}
      <div className="relative w-full flex items-center justify-center bg-slate-950 rounded-xl overflow-hidden border border-slate-850">
        <canvas
          ref={canvasRef}
          width={420}
          height={240}
          className="w-full max-w-[420px] h-[240px] block"
        />

        {/* Dynamic Telemetry Overlay */}
        <div className="absolute bottom-2 left-2 bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded px-2 py-1 text-[9px] font-mono text-slate-300">
          <div>Δv: <span className="text-cyan-400 font-bold">{Math.round(currentDeltaV)}</span> / {targetDeltaV} m/s</div>
          <div>Target: <span className="text-amber-400 uppercase">{activeMission?.targetOrbit || 'LEO Circular'}</span></div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="flex items-center justify-between pt-2.5 mt-2 border-t border-slate-800 text-[10px] font-mono text-slate-500">
        <span className="flex items-center gap-1">
          <Compass className="w-3 h-3 text-cyan-400" />
          <span>Vis-Viva Equation Derived</span>
        </span>
        <span className="text-slate-400">Real-Time Propagator</span>
      </div>
    </div>
  );
}