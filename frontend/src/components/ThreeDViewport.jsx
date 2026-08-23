import React, { useRef, useState, useEffect } from 'react';
import { Maximize, RotateCcw, Box, Eye, Focus, MousePointer2, Move, Rotate3D, Scaling, Grid as GridIcon } from 'lucide-react';

const ThreeDViewport = () => {
  const [showWireframe, setShowWireframe] = useState(false);
  const [showGrid, setShowGrid] = useState(true);

  const handleResetCamera = () => {
  };

  const handleFullscreen = () => {
    const elem = document.getElementById('threed-container');
    if (elem) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        elem.requestFullscreen();
      }
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#1e1e1e]" id="threed-container">
      {/* 3D Viewport Toolbar */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-[#252526] border-b border-[#3b3b3b] shadow-sm select-none shrink-0">
        <div className="flex items-center gap-1 bg-[#333333] p-0.5 rounded border border-[#3b3b3b]">
          <button 
            className={`p-1 rounded flex items-center justify-center transition-colors bg-[#007acc] text-white`}
            title="Select Mode"
          >
            <MousePointer2 size={14} />
          </button>
          <div className="w-px h-4 bg-[#454545] mx-1"></div>
          <button 
            className={`p-1 rounded flex items-center justify-center transition-colors text-[#cccccc] opacity-50 cursor-not-allowed`}
            disabled={true}
            title="Move (Disabled)"
          >
            <Move size={14} />
          </button>
          <button 
            className={`p-1 rounded flex items-center justify-center transition-colors text-[#cccccc] opacity-50 cursor-not-allowed`}
            disabled={true}
            title="Rotate (Disabled)"
          >
            <Rotate3D size={14} />
          </button>
          <button 
            className={`p-1 rounded flex items-center justify-center transition-colors text-[#cccccc] opacity-50 cursor-not-allowed`}
            disabled={true}
            title="Scale (Disabled)"
          >
            <Scaling size={14} />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-[#333333] p-0.5 rounded border border-[#3b3b3b]">
            <button 
              className={`p-1 rounded flex items-center justify-center transition-colors ${showGrid ? 'bg-[#454545] text-white' : 'text-[#cccccc] hover:bg-[#454545]'}`}
              onClick={() => setShowGrid(!showGrid)}
              title="Toggle Grid"
            >
              <GridIcon size={14} />
            </button>
            <button 
              className={`p-1 rounded flex items-center justify-center transition-colors ${showWireframe ? 'bg-[#454545] text-white' : 'text-[#cccccc] hover:bg-[#454545]'}`}
              onClick={() => setShowWireframe(!showWireframe)}
              title="Toggle Wireframe"
            >
              <Box size={14} />
            </button>
          </div>
          
          <button 
            onClick={handleResetCamera} 
            className="p-1 text-[#cccccc] hover:bg-[#333333] hover:text-white rounded transition-colors border border-transparent hover:border-[#454545]"
            title="Reset Camera"
          >
            <RotateCcw size={14} />
          </button>
          <button 
            onClick={handleFullscreen} 
            className="p-1 text-[#cccccc] hover:bg-[#333333] hover:text-white rounded transition-colors border border-transparent hover:border-[#454545]"
            title="Fullscreen"
          >
            <Maximize size={14} />
          </button>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 relative bg-[#1e1e1e] flex flex-col items-center justify-center text-[#858585]">
        <div className="animate-pulse mb-4 opacity-50">
          <Rotate3D size={48} />
        </div>
        <p className="font-mono text-sm">3D Viewport is temporarily disabled.</p>
        <p className="font-mono text-xs opacity-70 mt-2 max-w-md text-center">Your browser is experiencing repeated WebGL crashes ("Context Lost"). We've disabled the 3D renderer here so you can access the code editor safely.</p>
        <button onClick={() => window.location.reload()} className="mt-6 px-4 py-2 bg-[#007acc] text-white rounded font-medium text-xs hover:bg-[#005f9e] transition-colors">
          Force Reload WebGL
        </button>
      </div>
    </div>
  );
};

export default ThreeDViewport;
