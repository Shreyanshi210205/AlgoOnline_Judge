import Editor from '@monaco-editor/react';
import type { Language } from '../types';
import { Card } from './ui/card';

interface LanguageEditorProps {
  value: string;
  language: Language;
  onChange: (value: string) => void;
}

const monacoLanguageMap: Record<Language, string> = {
  cpp: 'cpp',
  java: 'java',
  python: 'python',
  javascript: 'javascript',
};

export function LanguageEditor({ value, language, onChange }: LanguageEditorProps) {
  return (
    <Card className="overflow-hidden p-0">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
        <div>
          <p className="text-sm font-semibold text-slate-100">Code Editor</p>
          <p className="text-xs text-slate-400">Syntax-aware Monaco workspace</p>
        </div>
      </div>
      <Editor
        height="560px"
        language={monacoLanguageMap[language]}
        value={value}
        onChange={(nextValue) => onChange(nextValue ?? '')}
        theme="vs-dark"
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          fontLigatures: true,
          wordWrap: 'on',
          automaticLayout: true,
          scrollBeyondLastLine: false,
          smoothScrolling: true,
        }}
      />
    </Card>
  );
}
