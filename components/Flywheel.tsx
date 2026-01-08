import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { ASSETS } from '../constants';
import { Asset } from '../types';
import { Info, Gauge, Play, Settings, Zap, X } from 'lucide-react';
import { Tooltip } from './Tooltip';

export const Flywheel: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // State
  const [hoveredAsset, setHoveredAsset] = useState<Asset | null>(null);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [hoverPosition, setHoverPosition] = useState<{x: number, y: number} | null>(null);
  
  // Speed Control State
  const [velocity, setVelocity] = useState(1);
  const [isAutoSpeed, setIsAutoSpeed] = useState(true);
  const velocityRef = useRef(velocity);

  // Sync ref for D3
  useEffect(() => {
    velocityRef.current = velocity;
  }, [velocity]);

  // Simulated Market Data (Auto Mode)
  useEffect(() => {
    if (!isAutoSpeed) return;

    const interval = setInterval(() => {
      setVelocity(prev => {
        // Random walk
        const change = (Math.random() - 0.5) * 0.4;
        let newVel = prev + change;
        // Clamp auto range
        if (newVel < 0.5) newVel = 0.5;
        if (newVel > 4.5) newVel = 4.5;
        return newVel;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isAutoSpeed]);

  // D3 Visualization
  useEffect(() => {
    if (!svgRef.current) return;

    const width = 600;
    const height = 600;
    const radius = Math.min(width, height) / 2 - 80;

    // Clear previous
    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3.select(svgRef.current)
      .attr("viewBox", `0 0 ${width} ${height}`)
      .append("g")
      .attr("transform", `translate(${width / 2},${height / 2})`);

    // --- Definitions (Filters & Gradients) ---
    const defs = svg.append("defs");
    
    // Standard Glow
    const filter = defs.append("filter").attr("id", "glow");
    filter.append("feGaussianBlur").attr("stdDeviation", "2.5").attr("result", "coloredBlur");
    const feMerge = filter.append("feMerge");
    feMerge.append("feMergeNode").attr("in", "coloredBlur");
    feMerge.append("feMergeNode").attr("in", "SourceGraphic");
    
    // Strong Glow (for Laser/Core)
    const strongFilter = defs.append("filter").attr("id", "strongGlow");
    strongFilter.append("feGaussianBlur").attr("stdDeviation", "6").attr("result", "coloredBlur");
    const feMergeStrong = strongFilter.append("feMerge");
    feMergeStrong.append("feMergeNode").attr("in", "coloredBlur");
    feMergeStrong.append("feMergeNode").attr("in", "SourceGraphic");

    // Beam Gradient
    const beamGradient = defs.append("linearGradient")
      .attr("id", "beamGradient")
      .attr("gradientUnits", "userSpaceOnUse"); 

    beamGradient.append("stop").attr("offset", "0%").attr("stop-color", "#39FF14").attr("stop-opacity", 0.9);
    beamGradient.append("stop").attr("offset", "50%").attr("stop-color", "#ffffff").attr("stop-opacity", 1);
    beamGradient.append("stop").attr("offset", "100%").attr("stop-color", "#39FF14").attr("stop-opacity", 0.9);

    // --- Core Hub ($thewclstrat) ---
    const centerGroup = svg.append("g").attr("class", "center-hub");
    
    // Rotating Index Ring
    const indexRing = centerGroup.append("circle")
      .attr("r", 55)
      .attr("fill", "none")
      .attr("stroke", "#ffffff")
      .attr("stroke-width", 1)
      .attr("stroke-dasharray", "10, 5")
      .attr("stroke-opacity", 0.5);

    // Solid Center Background
    centerGroup.append("circle")
      .attr("r", 45)
      .attr("fill", "#050505")
      .attr("stroke", "#333")
      .attr("stroke-width", 2);

    // Text Label
    centerGroup.append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "0.35em")
      .attr("fill", "white")
      .attr("font-weight", "900")
      .attr("font-size", "14px")
      .style("text-shadow", "0 0 10px rgba(255,255,255,0.5)")
      .text("$thewclstrat");

    // --- Data Prep ---
    const coreDriver = ASSETS.find(a => a.ticker === 'WCLUBBIGGS')!;
    const satelliteAssets = ASSETS.filter(a => a.ticker !== '$thewclstrat' && a.ticker !== 'WCLSTRAT' && a.ticker !== 'WCLUBBIGGS');
    
    // --- Core Driver Position ($thewclubbiggs) ---
    const driverDist = radius * 0.9;
    const driverAngle = -Math.PI * 0.5; // Top
    const driverX = driverDist * Math.cos(driverAngle);
    const driverY = driverDist * Math.sin(driverAngle);
    const driverColor = coreDriver.color || '#39FF14';

    // Update gradient coords to match positions
    beamGradient.attr("x1", driverX).attr("y1", driverY).attr("x2", 0).attr("y2", 0);

    // --- Laser Beam Connection ---
    const beamGroup = svg.append("g").attr("class", "beam-group");
    
    // 1. Outer Glow (Halo)
    const beamHalo = beamGroup.append("line")
      .attr("x1", 0).attr("y1", 0).attr("x2", driverX).attr("y2", driverY)
      .attr("stroke", driverColor)
      .attr("stroke-width", 8) 
      .attr("stroke-opacity", 0.3)
      .attr("stroke-linecap", "round")
      .style("filter", "url(#strongGlow)");

    // 2. Focused Beam (The Laser)
    const beamFocus = beamGroup.append("line")
      .attr("x1", 0).attr("y1", 0).attr("x2", driverX).attr("y2", driverY)
      .attr("stroke", "url(#beamGradient)")
      .attr("stroke-width", 3)
      .attr("stroke-opacity", 0.8)
      .style("filter", "url(#glow)");

    // 3. Energy Bolts (Moving Dashes)
    const beamBolts = beamGroup.append("line")
      .attr("x1", driverX).attr("y1", driverY).attr("x2", 0).attr("y2", 0)
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5)
      .attr("stroke-dasharray", "20, 30") 
      .attr("stroke-opacity", 1)
      .style("mix-blend-mode", "overlay");

    // --- Satellites Group ---
    const orbitGroup = svg.append("g").attr("class", "orbit-group");
    const angleStep = (2 * Math.PI) / satelliteAssets.length;
    
    const dynamicElements: any[] = [];

    satelliteAssets.forEach((asset, i) => {
      const angle = i * angleStep;
      const x = radius * Math.cos(angle);
      const y = radius * Math.sin(angle);
      const color = asset.color || "#888";

      const nodeGroup = orbitGroup.append("g")
        .attr("transform", `translate(${x}, ${y})`)
        .style("cursor", "pointer")
        .on("click", (event) => {
          event.stopPropagation();
          setSelectedAsset(asset);
        })
        .on("mouseenter", (event) => {
          const [mx, my] = d3.pointer(event, svgRef.current);
          setHoverPosition({ x: mx, y: my });
          setHoveredAsset(asset);
          d3.select(event.currentTarget).transition().duration(200).attr("transform", `translate(${x}, ${y}) scale(1.4)`);
        })
        .on("mouseleave", (event) => {
          setHoveredAsset(null);
          d3.select(event.currentTarget).transition().duration(200).attr("transform", `translate(${x}, ${y}) scale(1)`);
        });

      // 1. Vortex Chem Trail 
      // This path originates at the satellite (0,0 local) and will be curved to the center (-x, -y local)
      const trail = nodeGroup.append("path")
        .attr("fill", "none")
        .attr("stroke", color)
        .attr("stroke-linecap", "round")
        .style("filter", "url(#glow)")
        .style("mix-blend-mode", "screen");

      // 2. Vibrant Asset Orb
      // Halo
      nodeGroup.append("circle")
        .attr("r", 14) 
        .attr("fill", color)
        .attr("fill-opacity", 0.3)
        .style("filter", "url(#glow)");
        
      // Core
      nodeGroup.append("circle")
        .attr("r", 8)
        .attr("fill", color)
        .attr("stroke", "white")
        .attr("stroke-width", 1.5)
        .attr("stroke-opacity", 0.9);

      // Label
      const labelAngle = (angle * 180 / Math.PI);
      const isLeft = labelAngle > 90 && labelAngle < 270;
      nodeGroup.append("text")
        .attr("dx", isLeft ? -20 : 20)
        .attr("dy", "0.35em")
        .attr("text-anchor", isLeft ? "end" : "start")
        .attr("transform", `rotate(${isLeft ? 180 : 0})`)
        .text(asset.ticker)
        .attr("fill", color)
        .attr("font-size", "10px")
        .attr("font-weight", "bold")
        .style("text-shadow", `0 0 5px ${color}`);
        
      dynamicElements.push({
        trail,
        x, y, // Position relative to center
        color
      });
    });

    // --- Core Driver Node ($thewclubbiggs) ---
    const driverGroup = svg.append("g")
      .attr("transform", `translate(${driverX}, ${driverY})`)
      .style("cursor", "pointer")
      .on("click", (event) => {
          event.stopPropagation();
          setSelectedAsset(coreDriver);
      })
      .on("mouseenter", (event) => {
        const [mx, my] = d3.pointer(event, svgRef.current);
        setHoverPosition({ x: mx, y: my });
        setHoveredAsset(coreDriver);
        d3.select(event.currentTarget).transition().duration(200).attr("transform", `translate(${driverX}, ${driverY}) scale(1.1)`);
      })
      .on("mouseleave", (event) => {
        setHoveredAsset(null);
        d3.select(event.currentTarget).transition().duration(200).attr("transform", `translate(${driverX}, ${driverY}) scale(1)`);
      });

    // Driver Glow Ring
    const driverPulse = driverGroup.append("circle")
      .attr("r", 30)
      .attr("fill", driverColor)
      .attr("fill-opacity", 0.2)
      .attr("stroke", "none")
      .style("filter", "url(#strongGlow)");
      
    // Driver Solid Core
    driverGroup.append("circle")
      .attr("r", 22)
      .attr("fill", "#000")
      .attr("stroke", driverColor)
      .attr("stroke-width", 3);
      
    // Icon/Text
    driverGroup.append("text")
      .attr("text-anchor", "middle").attr("dy", "0.35em")
      .attr("fill", driverColor).attr("font-weight", "bold").attr("font-size", "6px")
      .text("$thewclubbiggs");

    // --- Animation Loop ---
    let lastTime = 0;
    let currentRotation = 0;
    let boltOffset = 0;
    
    const timer = d3.timer((elapsed) => {
      const dt = elapsed - lastTime;
      lastTime = elapsed;
      const v = velocityRef.current;
      
      // 1. Rotate Orbit Group
      currentRotation += (v * 0.05 * dt);
      orbitGroup.attr("transform", `rotate(${currentRotation})`);
      
      // 2. Rotate Center Index Ring (Opposite direction for mechanical feel)
      indexRing.attr("transform", `rotate(${-currentRotation * 0.5})`);
      
      // 3. Laser Beam Dynamics
      boltOffset -= (v * 0.5 * dt); 
      beamBolts.attr("stroke-dashoffset", boltOffset);

      const pulseSpeed = elapsed / (150 / Math.max(0.5, v)); 
      const intensity = Math.min(1, v / 3); 
      
      const w = 3 + Math.sin(pulseSpeed) * intensity;
      beamFocus.attr("stroke-width", w);
      
      const hOpacity = 0.2 + (intensity * 0.3) + (Math.sin(pulseSpeed) * 0.1);
      beamHalo.attr("stroke-opacity", hOpacity);
      
      const driverScale = 1 + (Math.sin(pulseSpeed) * 0.1 * intensity);
      driverPulse.attr("transform", `scale(${driverScale})`);

      // 4. Update Satellite Trails (Vortex Effect)
      dynamicElements.forEach(el => {
        // We create a quadratic curve from Satellite (0,0 local) to Center (-el.x, -el.y local)
        // Control point determines the "swirl"
        
        // Vortex Intensity scales with velocity
        const vortexIntensity = v * 0.8; 

        // Midpoint between sat and center
        const midX = -el.x * 0.5;
        const midY = -el.y * 0.5;
        
        // Perpendicular vector (tangent to rotation)
        // If rotation is clockwise, tangent leads
        // We push the control point out along the tangent to create the curve
        const perpX = -el.y; 
        const perpY = el.x;
        
        // Curve factor: 0.1 is base swirl, increases with velocity
        const curveFactor = 0.15 + (vortexIntensity * 0.15); 
        
        const cpX = midX + (perpX * curveFactor);
        const cpY = midY + (perpY * curveFactor);
        
        const d = `M 0,0 Q ${cpX},${cpY} ${-el.x},${-el.y}`;
        
        el.trail
           .attr("d", d)
           .attr("stroke-width", 1.5 + (v * 1.5)) 
           .attr("stroke-opacity", 0.2 + (v * 0.15));
      });
    });

    return () => timer.stop();
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="relative flex flex-col items-center bg-card-bg rounded-xl border border-white/10 shadow-2xl group overflow-hidden"
      onClick={() => setSelectedAsset(null)}
    >
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none">
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,_rgba(57,255,20,0.05),_transparent_70%)]"></div>
      </div>
      
      {/* Header */}
      <div className="z-10 w-full p-4 flex flex-col gap-4 border-b border-white/5 bg-black/20 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
              Index Flywheel
            </h2>
            <Tooltip content="Real-time visualization of the W Club ecosystem. The Core Asset ($thewclubbiggs) powers the Index ($thewclstrat)." position="right">
              <Info size={16} className="text-gray-500 hover:text-white transition cursor-help" />
            </Tooltip>
          </div>
          
          <div className="flex items-center gap-2 bg-black/40 rounded-full p-1 border border-white/10">
            <button 
              onClick={() => setIsAutoSpeed(true)}
              className={`px-3 py-1 rounded-full text-xs font-bold transition flex items-center gap-1 ${isAutoSpeed ? 'bg-neon-green text-black' : 'text-gray-400 hover:text-white'}`}
            >
              <Play size={10} fill="currentColor" /> Auto
            </button>
            <button 
              onClick={() => setIsAutoSpeed(false)}
              className={`px-3 py-1 rounded-full text-xs font-bold transition flex items-center gap-1 ${!isAutoSpeed ? 'bg-blue-500 text-white' : 'text-gray-400 hover:text-white'}`}
            >
              <Settings size={10} /> Manual
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-black/40 p-3 rounded-lg border border-white/5">
           <div className="flex items-center gap-2 text-neon-green min-w-[80px]">
             <Gauge size={18} />
             <span className="font-mono font-bold text-sm">{velocity.toFixed(2)}x</span>
           </div>
           
           <input 
             type="range" 
             min="0.1" 
             max="4.5" 
             step="0.1"
             value={velocity}
             onChange={(e) => {
               setIsAutoSpeed(false);
               setVelocity(parseFloat(e.target.value));
             }}
             className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-neon-green"
           />
        </div>
      </div>
      
      <div className="w-full max-w-[500px] aspect-square relative z-10">
        <svg ref={svgRef} className="w-full h-full overflow-visible" />

        {/* Selected Asset Info Panel */}
        {selectedAsset && (
          <div 
            className="absolute bottom-4 left-4 right-4 bg-black/90 backdrop-blur-xl border-t-4 p-4 rounded-xl shadow-2xl animate-in slide-in-from-bottom-10 fade-in duration-300 z-50"
            style={{ borderColor: selectedAsset.color || '#39FF14' }}
            onClick={(e) => e.stopPropagation()}
          >
             <button 
               onClick={() => setSelectedAsset(null)}
               className="absolute top-2 right-2 text-gray-400 hover:text-white p-1"
             >
               <X size={16} />
             </button>

             <div className="flex items-start gap-4">
                <div className="p-3 rounded-full bg-white/5 border border-white/10" style={{ color: selectedAsset.color || '#39FF14' }}>
                   <Zap size={24} fill="currentColor" className="opacity-80" />
                </div>
                <div>
                   <h3 className="text-xl font-bold text-white flex items-center gap-2">
                     {selectedAsset.name} 
                     <span className="text-sm font-mono opacity-60 bg-white/10 px-2 py-0.5 rounded">
                       {selectedAsset.ticker}
                     </span>
                   </h3>
                   <p className="text-sm text-gray-300 mt-2 leading-relaxed">
                     {selectedAsset.description || "Key ecosystem component."}
                   </p>
                </div>
             </div>
          </div>
        )}
        
        {/* Hover Tooltip */}
        {!selectedAsset && hoveredAsset && hoverPosition && (
          <div 
            className="absolute z-50 pointer-events-none"
            style={{ 
              left: hoverPosition.x, 
              top: hoverPosition.y,
              transform: 'translate(-50%, -120%)'
            }}
          >
            <div className="bg-black/90 backdrop-blur-md border p-3 rounded-xl text-center shadow-2xl w-48" style={{ borderColor: hoveredAsset.color || '#39FF14' }}>
              <h3 className="font-bold text-lg leading-none mb-1" style={{ color: hoveredAsset.color || '#39FF14' }}>{hoveredAsset.ticker}</h3>
              <p className="text-gray-400 text-[10px] leading-tight mb-2">{hoveredAsset.description}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};