import type { Language, Verdict } from '../types';

export const AUTH_TOKEN_KEY = 'oj_auth_token';
export const AUTH_USER_KEY = 'oj_auth_user';
export const THEME_KEY = 'oj_theme';

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.trim() || 'http://localhost:5000';

export const LANGUAGE_OPTIONS: Array<{ value: Language; label: string }> = [
  { value: 'cpp', label: 'C++' },
  { value: 'java', label: 'Java' },
  { value: 'python', label: 'Python' },
  { value: 'javascript', label: 'JavaScript' },
];

export const DIFFICULTY_ORDER = ['Easy', 'Medium', 'Hard'] as const;

export const VERDICT_LABELS: Record<Verdict, string> = {
  Pending: 'Pending',
  Accepted: 'Accepted',
  'Wrong Answer': 'Wrong Answer',
  'Compilation Error': 'Compilation Error',
  'Runtime Error': 'Runtime Error',
  'Time Limit Exceeded': 'Time Limit Exceeded',
  'Memory Limit Exceeded': 'Memory Limit Exceeded',
};

export const BASE_BOILERPLATES: Record<
  Language,
  { label: string; code: string }
> = {
  cpp: {
    label: 'C++17',
    code: `#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n\n    return 0;\n}`,
  },
  java: {
    label: 'Java',
    code: `import java.io.*;\nimport java.util.*;\n\npublic class Main {\n    public static void main(String[] args) throws Exception {\n        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));\n        PrintWriter out = new PrintWriter(System.out);\n\n        out.flush();\n    }\n}`,
  },
  python: {
    label: 'Python 3',
    code: `import sys\n\n\ndef main():\n    data = sys.stdin.read().strip().split()\n    if not data:\n        return\n\n\nif __name__ == '__main__':\n    main()`,
  },
  javascript: {
    label: 'Node.js',
    code: `const fs = require('fs');\n\nconst input = fs.readFileSync(0, 'utf8').trim().split(/\\s+/);\n\nfunction main() {\n  if (!input[0]) {\n    return;\n  }\n}\n\nmain();`,
  },
};

export const EMPTY_PROBLEM_STATE = {
  title: 'No problems yet',
  subtitle: 'Create the first problem from the backend and it will appear here.',
};

export const SUBMISSION_POLL_INTERVAL_MS = 2000;
export const NAV_LINKS = [
  { label: 'Problems', to: '/problems' },
  { label: 'Leaderboard', to: '/leaderboard' },
];
