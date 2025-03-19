
import { Contest, Platform } from "@/types";

// Base URLs for the API endpoints
const API_ENDPOINTS = {
  codeforces: "https://codeforces.com/api/contest.list",
  codechef: "https://www.codechef.com/api/contests",
  leetcode: "https://leetcode.com/graphql"
};

/**
 * Fetches contests from Codeforces
 */
export const fetchCodeforcesContests = async (): Promise<Contest[]> => {
  try {
    const response = await fetch(API_ENDPOINTS.codeforces);
    const data = await response.json();
    
    if (!data.result) {
      throw new Error("Failed to fetch Codeforces contests");
    }
    
    return data.result.map((contest: any) => {
      const startTimeMs = contest.startTimeSeconds * 1000;
      const durationSeconds = contest.durationSeconds;
      const endTimeMs = startTimeMs + durationSeconds * 1000;
      
      return {
        id: `cf-${contest.id}`,
        name: contest.name,
        platform: "codeforces" as Platform,
        url: `https://codeforces.com/contest/${contest.id}`,
        startTime: new Date(startTimeMs).toISOString(),
        endTime: new Date(endTimeMs).toISOString(),
        duration: durationSeconds
      };
    });
  } catch (error) {
    console.error("Error fetching Codeforces contests:", error);
    return [];
  }
};

/**
 * Fetches contests from CodeChef
 */
export const fetchCodechefContests = async (): Promise<Contest[]> => {
  try {
    const response = await fetch(API_ENDPOINTS.codechef);
    const data = await response.json();
    
    const allContests = [
      ...(data.future_contests || []),
      ...(data.present_contests || []),
      ...(data.past_contests || [])
    ];
    
    return allContests.map((contest: any) => {
      const startTime = new Date(contest.start_date).toISOString();
      const endTime = new Date(contest.end_date).toISOString();
      const startTimeMs = new Date(startTime).getTime();
      const endTimeMs = new Date(endTime).getTime();
      const durationSeconds = (endTimeMs - startTimeMs) / 1000;
      
      return {
        id: `cc-${contest.code}`,
        name: contest.name,
        platform: "codechef" as Platform,
        url: `https://www.codechef.com/${contest.code}`,
        startTime,
        endTime,
        duration: durationSeconds
      };
    });
  } catch (error) {
    console.error("Error fetching CodeChef contests:", error);
    return [];
  }
};

/**
 * Fetches contests from LeetCode
 */
export const fetchLeetcodeContests = async (): Promise<Contest[]> => {
  try {
    const query = `
      query {
        allContests {
          title
          titleSlug
          startTime
          duration
        }
      }
    `;
    
    const response = await fetch(API_ENDPOINTS.leetcode, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ query })
    });
    
    const data = await response.json();
    
    if (!data.data?.allContests) {
      throw new Error("Failed to fetch LeetCode contests");
    }
    
    return data.data.allContests.map((contest: any) => {
      const startTimeMs = contest.startTime * 1000;
      const durationSeconds = contest.duration;
      const endTimeMs = startTimeMs + durationSeconds * 1000;
      
      return {
        id: `lc-${contest.titleSlug}`,
        name: contest.title,
        platform: "leetcode" as Platform,
        url: `https://leetcode.com/contest/${contest.titleSlug}`,
        startTime: new Date(startTimeMs).toISOString(),
        endTime: new Date(endTimeMs).toISOString(),
        duration: durationSeconds
      };
    });
  } catch (error) {
    console.error("Error fetching LeetCode contests:", error);
    return [];
  }
};

/**
 * Fetches all contests from all platforms
 */
export const fetchAllContests = async (): Promise<Contest[]> => {
  try {
    const [codeforcesContests, codechefContests, leetcodeContests] = await Promise.all([
      fetchCodeforcesContests(),
      fetchCodechefContests(),
      fetchLeetcodeContests()
    ]);
    
    return [
      ...codeforcesContests,
      ...codechefContests,
      ...leetcodeContests
    ];
  } catch (error) {
    console.error("Error fetching all contests:", error);
    return [];
  }
};

/**
 * Fetches mock contest data for development purposes
 * This helps during development when the actual APIs might be unstable or rate-limited
 */
export const fetchMockContests = (): Contest[] => {
  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  
  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);
  
  const nextWeek = new Date(now);
  nextWeek.setDate(now.getDate() + 7);
  
  const lastWeek = new Date(now);
  lastWeek.setDate(now.getDate() - 7);
  
  return [
    {
      id: "cf-1",
      name: "Codeforces Round #800 (Div. 2)",
      platform: "codeforces",
      url: "https://codeforces.com/contest/1",
      startTime: tomorrow.toISOString(),
      endTime: new Date(tomorrow.getTime() + 2 * 60 * 60 * 1000).toISOString(),
      duration: 2 * 60 * 60
    },
    {
      id: "cf-2",
      name: "Codeforces Round #799 (Div. 1)",
      platform: "codeforces",
      url: "https://codeforces.com/contest/2",
      startTime: lastWeek.toISOString(),
      endTime: new Date(lastWeek.getTime() + 2.5 * 60 * 60 * 1000).toISOString(),
      duration: 2.5 * 60 * 60,
      solutionUrl: "https://www.youtube.com/watch?v=example1"
    },
    {
      id: "cc-1",
      name: "CodeChef Long Challenge",
      platform: "codechef",
      url: "https://www.codechef.com/LONG1",
      startTime: nextWeek.toISOString(),
      endTime: new Date(nextWeek.getTime() + 10 * 24 * 60 * 60 * 1000).toISOString(),
      duration: 10 * 24 * 60 * 60
    },
    {
      id: "cc-2",
      name: "CodeChef Cook-Off",
      platform: "codechef",
      url: "https://www.codechef.com/COOK1",
      startTime: yesterday.toISOString(),
      endTime: new Date(yesterday.getTime() + 2.5 * 60 * 60 * 1000).toISOString(),
      duration: 2.5 * 60 * 60,
      solutionUrl: "https://www.youtube.com/watch?v=example2"
    },
    {
      id: "lc-1",
      name: "Weekly Contest 300",
      platform: "leetcode",
      url: "https://leetcode.com/contest/weekly-contest-300",
      startTime: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      endTime: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000 + 1.5 * 60 * 60 * 1000).toISOString(),
      duration: 1.5 * 60 * 60
    },
    {
      id: "lc-2",
      name: "Biweekly Contest 75",
      platform: "leetcode",
      url: "https://leetcode.com/contest/biweekly-contest-75",
      startTime: lastWeek.toISOString(),
      endTime: new Date(lastWeek.getTime() + 1.5 * 60 * 60 * 1000).toISOString(),
      duration: 1.5 * 60 * 60,
      solutionUrl: "https://www.youtube.com/watch?v=example3"
    }
  ];
};
