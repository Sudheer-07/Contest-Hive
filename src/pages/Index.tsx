
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Contest, FilterOptions, Platform } from "@/types";
import { fetchMockContests } from "@/services/api";
import { useBookmarks } from "@/hooks/useBookmarks";
import ContestCard from "@/components/ContestCard";
import FilterSection from "@/components/FilterSection";
import Header from "@/components/Header";
import { isUpcoming, isPast } from "@/utils/timeUtils";

const Index = () => {
  const { toast } = useToast();
  const [contests, setContests] = useState<Contest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { bookmarkedContests, toggleBookmark, isBookmarked } = useBookmarks();
  
  // Default filter settings
  const [filters, setFilters] = useState<FilterOptions>({
    platforms: ["codeforces", "codechef", "leetcode"],
    showUpcoming: true,
    showPast: true,
    bookmarkedOnly: false
  });
  
  // Calculate active filters count
  const activeFiltersCount = 
    (filters.platforms.length < 3 ? 1 : 0) +
    (!filters.showUpcoming || !filters.showPast ? 1 : 0) +
    (filters.bookmarkedOnly ? 1 : 0);
  
  // Fetch contests on component mount
  useEffect(() => {
    const fetchContests = async () => {
      try {
        setIsLoading(true);
        
        // In a real app, you would use fetchAllContests() instead
        // We're using mock data here for demonstration purposes
        const fetchedContests = fetchMockContests();
        
        // Sort contests: ongoing first, then upcoming (by start time), then past (by end time descending)
        const sortedContests = fetchedContests.sort((a, b) => {
          const aIsUpcoming = isUpcoming(a.startTime);
          const bIsUpcoming = isUpcoming(b.startTime);
          const aIsPast = isPast(a.endTime);
          const bIsPast = isPast(b.endTime);
          
          // If one is upcoming and the other is past
          if (aIsUpcoming && bIsPast) return -1;
          if (aIsPast && bIsUpcoming) return 1;
          
          // For upcoming contests, sort by start time
          if (aIsUpcoming && bIsUpcoming) {
            return new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
          }
          
          // For past contests, sort by end time (most recent first)
          if (aIsPast && bIsPast) {
            return new Date(b.endTime).getTime() - new Date(a.endTime).getTime();
          }
          
          return 0;
        });
        
        setContests(sortedContests);
        
        toast({
          title: "Contests Loaded",
          description: `${sortedContests.length} contests loaded successfully.`,
        });
      } catch (error) {
        console.error("Failed to fetch contests:", error);
        toast({
          title: "Error",
          description: "Failed to load contests. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchContests();
  }, [toast]);
  
  // Filter contests based on user preferences
  const filteredContests = contests.filter(contest => {
    // Filter by platform
    if (!filters.platforms.includes(contest.platform)) {
      return false;
    }
    
    // Filter by upcoming/past
    const isPastContest = isPast(contest.endTime);
    const isUpcomingContest = isUpcoming(contest.startTime);
    
    if (isPastContest && !filters.showPast) {
      return false;
    }
    
    if (isUpcomingContest && !filters.showUpcoming) {
      return false;
    }
    
    // Filter by bookmarked status
    if (filters.bookmarkedOnly && !isBookmarked(contest.id)) {
      return false;
    }
    
    return true;
  });
  
  // Handle bookmark toggling
  const handleToggleBookmark = (contestId: string) => {
    toggleBookmark(contestId);
    
    // Show toast notification
    toast({
      title: isBookmarked(contestId) ? "Bookmark Removed" : "Contest Bookmarked",
      description: isBookmarked(contestId)
        ? "Contest removed from your bookmarks."
        : "Contest added to your bookmarks.",
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <FilterSection 
          filters={filters} 
          onFilterChange={setFilters} 
          activeFiltersCount={activeFiltersCount}
        />
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div 
                key={i} 
                className="h-64 rounded-lg bg-muted animate-pulse"
              />
            ))}
          </div>
        ) : (
          <>
            {filteredContests.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-xl font-medium mb-2">No contests found</h3>
                <p className="text-muted-foreground">
                  Try changing your filters or check back later for new contests.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredContests.map(contest => (
                  <ContestCard
                    key={contest.id}
                    contest={contest}
                    isBookmarked={isBookmarked(contest.id)}
                    onToggleBookmark={() => handleToggleBookmark(contest.id)}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </main>
      
      <footer className="border-t py-6 text-center text-sm text-muted-foreground">
        <div className="container mx-auto px-4">
          <p>© {new Date().getFullYear()} Contest Hive. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
