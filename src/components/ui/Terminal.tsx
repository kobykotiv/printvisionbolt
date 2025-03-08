import React from 'react';

interface TerminalProps {
  output: string;
}

export function Terminal({ output }: TerminalProps) {
  return (
    <div className="bg-black text-green-400 p-4 rounded font-mono text-sm whitespace-pre-wrap overflow-x-auto">
      {output}
    </div>
  );
}
