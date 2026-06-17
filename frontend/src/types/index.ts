export type Difficulty = 'Easy' | 'Medium' | 'Hard';
export type Language = 'cpp' | 'java' | 'python' | 'javascript';
export type Verdict =
  | 'Pending'
  | 'Accepted'
  | 'Wrong Answer'
  | 'Compilation Error'
  | 'Runtime Error'
  | 'Time Limit Exceeded'
  | 'Memory Limit Exceeded';

export interface ApiErrorResponse {
  success?: boolean;
  message?: string;
}

export interface ApiListResponse<T> {
  success: boolean;
  count?: number;
  data: T;
}

export interface ApiItemResponse<T> {
  success: boolean;
  data: T;
}

export interface AuthUser {
  _id?: string;
  id?: string;
  username: string;
  email: string;
  rating?: number;
  solvedProblems?: ProblemSummary[];
  submissions?: SubmissionSummary[];
}

export type SubmissionSummary = Submission;

export interface AuthProfileResponse {
  user: AuthUser;
  submissions: SubmissionSummary[];
}

export interface AuthLoginResponse {
  token: string;
  user: AuthUser;
}

export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  username: string;
  password: string;
}

export interface TestCase {
  input: string;
  output: string;
}

export interface Problem {
  _id: string;
  title: string;
  statement: string;
  inputFormat: string;
  outputFormat: string;
  constraints: string;
  difficulty: Difficulty;
  visibleTestCases: TestCase[];
  hiddenTestCases?: TestCase[];
  timeLimit?: number;
  memoryLimit?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProblemSummary {
  _id: string;
  title: string;
  difficulty: Difficulty;
}

export interface ProblemListItem {
  _id: string;
  title: string;
  difficulty: Difficulty;
  createdAt?: string;
}

export interface RunResult {
  input: string;
  expectedOutput: string;
  actualOutput: string;
  passed: boolean;
  customOutput?: string;
}

export interface RunResponse {
  success: boolean;
  results: RunResult[];
}

export interface Submission {
  _id: string;
  userId:
    | string
    | {
        _id?: string;
        username?: string;
      };
  problemId:
    | string
    | {
        _id?: string;
        title?: string;
        difficulty?: Difficulty;
      };
  language: Language;
  code: string;
  verdict: Verdict;
  testCasesPassed: number;
  executionTime: number;
  memoryUsed?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface SubmissionCreatePayload {
  userId: string;
  problemId: string;
  language: Language;
  code: string;
}

export interface LeaderboardEntry {
  _id: string;
  username: string;
  rating: number;
}

export interface SubmissionFilter {
  language?: Language | 'all';
  verdict?: Verdict | 'all';
}
