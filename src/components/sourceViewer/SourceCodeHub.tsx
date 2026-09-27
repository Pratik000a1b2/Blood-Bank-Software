import React, { useState } from 'react';
import { SOURCE_CODE_FILES, SourceFile } from '../../data/sourceCodeFiles';
import {
  Code2,
  Copy,
  Check,
  Database,
  Server,
  Smartphone,
  BookOpen,
  Download,
  Terminal,
  Layers,
  ArrowRight,
} from 'lucide-react';

export const SourceCodeHub: React.FC = () => {
  const [selectedFileIndex, setSelectedFileIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const categories = [
    'ALL',
    'Setup Guide',
    'MySQL Schema',
    'Spring Boot Backend',
    'Android XML Frontend',
    'Android Java Backend',
  ];

  const currentFile = SOURCE_CODE_FILES[selectedFileIndex] || SOURCE_CODE_FILES[0];

  const filteredFiles = SOURCE_CODE_FILES.filter((f) =>
    selectedCategory === 'ALL' ? true : f.category === selectedCategory
  );

  const handleCopy = () => {
    navigator.clipboard.writeText(currentFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([currentFile.content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = currentFile.path.split('/').pop() || 'file.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Title & Architecture Flowchart */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Code2 className="w-5 h-5 text-rose-600" />
            Full-Stack Project Architecture & Source Code Hub
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Production Spring Boot (Java 17) REST APIs, MySQL schema, and Android XML/Java layout components
          </p>
        </div>
      </div>

      {/* 4-Tier Enterprise Architecture Banner */}
      <div className="p-4 bg-slate-900 text-white rounded-xl shadow-xs">
        <span className="text-[10px] uppercase font-bold tracking-wider text-rose-400 block mb-2">
          System Architecture Pipeline
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-center text-xs">
          <div className="p-2.5 rounded-lg bg-slate-800 border border-slate-700 flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-emerald-400 shrink-0" />
            <div>
              <div className="font-bold">Android XML / Web</div>
              <div className="text-[10px] text-slate-400">CardView & Material Design</div>
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-800 border border-slate-700 flex items-center gap-2">
            <Server className="w-4 h-4 text-blue-400 shrink-0" />
            <div>
              <div className="font-bold">Spring Boot 3.2+</div>
              <div className="text-[10px] text-slate-400">Java REST Controllers & Services</div>
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-800 border border-slate-700 flex items-center gap-2">
            <Layers className="w-4 h-4 text-purple-400 shrink-0" />
            <div>
              <div className="font-bold">Spring Data JPA</div>
              <div className="text-[10px] text-slate-400">Hibernate ORM & Validation</div>
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-800 border border-slate-700 flex items-center gap-2">
            <Database className="w-4 h-4 text-amber-400 shrink-0" />
            <div>
              <div className="font-bold">MySQL 8.0+</div>
              <div className="text-[10px] text-slate-400">blood_bank_db relational schema</div>
            </div>
          </div>
        </div>
      </div>

      {/* Category Pills & Code Browser */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Sidebar: File Tree */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-4">
          <div>
            <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">
              Filter By Tier
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 bg-white"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-2">
              Repository Files ({filteredFiles.length})
            </span>
            <div className="space-y-1 max-h-[500px] overflow-y-auto pr-1">
              {filteredFiles.map((file) => {
                const isSelected = file.path === currentFile.path;
                return (
                  <button
                    key={file.path}
                    onClick={() => {
                      const idx = SOURCE_CODE_FILES.findIndex((f) => f.path === file.path);
                      setSelectedFileIndex(idx);
                    }}
                    className={`w-full text-left p-2 rounded-lg text-xs transition-colors cursor-pointer flex items-center justify-between gap-2 ${
                      isSelected
                        ? 'bg-rose-50 text-rose-900 font-semibold border border-rose-200'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span className="truncate font-mono text-[11px]">{file.path}</span>
                    <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-slate-200/60 text-slate-600 shrink-0 font-sans">
                      {file.language}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Main Pane: Code Viewer */}
        <div className="lg:col-span-3 bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs flex flex-col">
          {/* Header */}
          <div className="p-3.5 bg-slate-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-rose-400">{currentFile.path}</span>
              <span className="text-[10px] px-2 py-0.5 bg-slate-800 text-slate-300 rounded font-sans">
                {currentFile.category}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleDownload}
                className="px-2.5 py-1 text-[11px] bg-slate-800 hover:bg-slate-700 text-white rounded transition-colors cursor-pointer flex items-center gap-1 font-medium"
                title="Download File"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download</span>
              </button>

              <button
                onClick={handleCopy}
                className="px-3 py-1 text-[11px] bg-rose-600 hover:bg-rose-700 text-white rounded font-medium transition-colors cursor-pointer flex items-center gap-1.5"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy Code'}</span>
              </button>
            </div>
          </div>

          {/* Code Viewer Text Area */}
          <div className="p-4 bg-slate-950 overflow-x-auto flex-1 max-h-[580px]">
            <pre className="font-mono text-xs text-slate-200 leading-relaxed">
              <code>{currentFile.content}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
