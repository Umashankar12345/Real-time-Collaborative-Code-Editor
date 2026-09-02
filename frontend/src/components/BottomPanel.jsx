import React from 'react';
import { X } from 'lucide-react';

const BottomPanel = ({ isOpen, onClose, executionResult, isExecuting }) => {
  if (!isOpen) return null;

  return (
    <div className="flex flex-col h-full bg-[#1e1e1e] w-full text-[#cccccc]">
      <div className="flex items-center justify-between pr-4 border-b border-[#3b3b3b] bg-[#1e1e1e] shrink-0">
        <div className="flex">
          <div className="px-4 py-2 text-[11px] font-medium tracking-wide transition-none border-b-2 text-white border-[#007acc]">
            OUTPUT
          </div>
        </div>
        <button 
          onClick={onClose} 
          className="text-[#969696] hover:text-white hover:bg-[#333333] p-1 rounded-sm transition-colors"
          title="Close Panel"
        >
          <X size={14} />
        </button>
      </div>

      <div className="flex-1 p-3 overflow-y-auto text-[13px] font-mono">
        <div className="flex flex-col gap-1">
          <div className="text-[#969696]">
            [CodeCollab IDE] Ready. Output channel initialized.
          </div>
          {executionResult && (
            <div className="mt-2 border-t border-[#3b3b3b] pt-2">
              {executionResult.type === 'running' && (
                <span className="text-[#007acc] animate-pulse">{executionResult.message}</span>
              )}
              {executionResult.type === 'error' && (
                <span className="text-[var(--error-color)]">{executionResult.message}</span>
              )}
              {executionResult.type === 'success' && (
                <div className="flex flex-col gap-2">
                  {executionResult.data.stdout && (
                    <pre className="text-[#cccccc] whitespace-pre-wrap">{executionResult.data.stdout}</pre>
                  )}
                  {executionResult.data.stderr && (
                    <pre className="text-[var(--error-color)] whitespace-pre-wrap">{executionResult.data.stderr}</pre>
                  )}
                  {!executionResult.data.stdout && !executionResult.data.stderr && (
                    <span className="text-[#969696] italic">Program exited with code {executionResult.data.code}</span>
                  )}
                  {executionResult.data.code !== undefined && (
                    <div className="text-[#969696] text-xs mt-2 pt-2 border-t border-[#3b3b3b]/50">
                      Exited with code {executionResult.data.code}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BottomPanel;
