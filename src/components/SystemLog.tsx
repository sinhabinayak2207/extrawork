"use client";

import React, { useState, useEffect, useRef } from 'react';

interface LogEntry {
  timestamp: Date;
  message: string;
  type: 'info' | 'error' | 'success';
}

interface SystemLogProps {
  maxEntries?: number;
}

const SystemLog: React.FC<SystemLogProps> = ({ maxEntries = 50 }) => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const logContainerRef = useRef<HTMLDivElement>(null);
  
  // Add a log entry
  const addLog = (message: string, type: 'info' | 'error' | 'success' = 'info') => {
    setLogs(prevLogs => {
      const newLogs = [
        { timestamp: new Date(), message, type },
        ...prevLogs
      ].slice(0, maxEntries);
      
      return newLogs;
    });
  };
  
  // Listen for custom log events
  useEffect(() => {
    const handleLogEvent = (event: CustomEvent) => {
      const { message, type } = event.detail;
      addLog(message, type || 'info');
    };
    
    window.addEventListener('system-log', handleLogEvent as EventListener);
    
    // Add initial log
    addLog('System log initialized', 'info');
    
    // Expose the log function globally
    if (typeof window !== 'undefined') {
      (window as any).systemLog = {
        info: (message: string) => addLog(message, 'info'),
        error: (message: string) => addLog(message, 'error'),
        success: (message: string) => addLog(message, 'success')
      };
    }
    
    return () => {
      window.removeEventListener('system-log', handleLogEvent as EventListener);
      if (typeof window !== 'undefined') {
        delete (window as any).systemLog;
      }
    };
  }, []);
  
  // Scroll to the bottom when logs change
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = 0;
    }
  }, [logs]);
  
  return (
    <div className="bg-gray-900 text-white rounded-lg p-4 mt-6">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-medium">System Log</h3>
        <button 
          onClick={() => setLogs([])} 
          className="text-xs bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded"
        >
          Clear
        </button>
      </div>
      
      <div 
        ref={logContainerRef}
        className="h-64 overflow-y-auto font-mono text-sm"
      >
        {logs.length === 0 ? (
          <div className="text-gray-500 italic">No logs yet</div>
        ) : (
          <div className="space-y-1">
            {logs.map((log, index) => (
              <div 
                key={index} 
                className={`py-1 border-b border-gray-800 ${
                  log.type === 'error' ? 'text-red-400' : 
                  log.type === 'success' ? 'text-green-400' : 
                  'text-blue-300'
                }`}
              >
                <span className="text-gray-500 mr-2">
                  [{log.timestamp.toLocaleTimeString()}]
                </span>
                {log.message}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Helper function to log from anywhere in the app
export const logToSystem = (message: string, type: 'info' | 'error' | 'success' = 'info') => {
  if (typeof window !== 'undefined') {
    if ((window as any).systemLog) {
      (window as any).systemLog[type](message);
    } else {
      // Dispatch event if direct access not available
      const event = new CustomEvent('system-log', { 
        detail: { message, type },
        bubbles: true 
      });
      window.dispatchEvent(event);
    }
  }
};

export default SystemLog;
