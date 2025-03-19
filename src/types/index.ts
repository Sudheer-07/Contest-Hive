
export type Platform = 'codeforces' | 'codechef' | 'leetcode';

export interface Contest {
  id: string;
  name: string;
  platform: Platform;
  url: string;
  startTime: string;
  endTime: string;
  duration: number; // in seconds
  solutionUrl?: string;
}

export interface FilterOptions {
  platforms: Platform[];
  showUpcoming: boolean;
  showPast: boolean;
  bookmarkedOnly: boolean;
}
