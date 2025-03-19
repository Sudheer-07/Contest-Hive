
import { Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from "@/components/ui/sheet";
import { FilterOptions, Platform } from "@/types";
import { Badge } from "@/components/ui/badge";

interface FilterSectionProps {
  filters: FilterOptions;
  onFilterChange: (newFilters: FilterOptions) => void;
  activeFiltersCount: number;
}

const platformLabels: Record<Platform, string> = {
  codeforces: "Codeforces",
  codechef: "CodeChef",
  leetcode: "LeetCode"
};

const FilterSection = ({ filters, onFilterChange, activeFiltersCount }: FilterSectionProps) => {
  const togglePlatform = (platform: Platform) => {
    const newPlatforms = filters.platforms.includes(platform)
      ? filters.platforms.filter(p => p !== platform)
      : [...filters.platforms, platform];
    
    onFilterChange({ ...filters, platforms: newPlatforms });
  };

  const clearFilters = () => {
    onFilterChange({
      platforms: ["codeforces", "codechef", "leetcode"],
      showUpcoming: true,
      showPast: true,
      bookmarkedOnly: false
    });
  };

  const allPlatformsSelected = filters.platforms.length === 3;

  return (
    <div className="flex flex-wrap gap-2 items-center mb-6">
      <h2 className="text-xl font-semibold mr-2">Contests</h2>
      
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="sm" className="relative">
            <Filter className="h-4 w-4 mr-2" />
            <span>Filters</span>
            {activeFiltersCount > 0 && (
              <Badge className="ml-2 bg-primary text-primary-foreground">
                {activeFiltersCount}
              </Badge>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Filter Contests</SheetTitle>
          </SheetHeader>
          <div className="py-4 space-y-6">
            <div className="space-y-4">
              <h3 className="font-medium">Platforms</h3>
              <div className="space-y-2">
                {(["codeforces", "codechef", "leetcode"] as Platform[]).map(platform => (
                  <div key={platform} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`platform-${platform}`} 
                      checked={filters.platforms.includes(platform)}
                      onCheckedChange={() => togglePlatform(platform)}
                      className={`${platform === "codeforces" ? "text-codeforces" : ""} ${platform === "codechef" ? "text-codechef" : ""} ${platform === "leetcode" ? "text-leetcode" : ""}`}
                    />
                    <label
                      htmlFor={`platform-${platform}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {platformLabels[platform]}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-medium">Contest Status</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="show-upcoming" 
                    checked={filters.showUpcoming}
                    onCheckedChange={(checked) => 
                      onFilterChange({ ...filters, showUpcoming: !!checked })
                    }
                  />
                  <label
                    htmlFor="show-upcoming"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Upcoming Contests
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="show-past" 
                    checked={filters.showPast}
                    onCheckedChange={(checked) => 
                      onFilterChange({ ...filters, showPast: !!checked })
                    }
                  />
                  <label
                    htmlFor="show-past"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Past Contests
                  </label>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-medium">Bookmarks</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="bookmarked-only" 
                    checked={filters.bookmarkedOnly}
                    onCheckedChange={(checked) => 
                      onFilterChange({ ...filters, bookmarkedOnly: !!checked })
                    }
                  />
                  <label
                    htmlFor="bookmarked-only"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Bookmarked Only
                  </label>
                </div>
              </div>
            </div>
            
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={clearFilters}
            >
              <X className="h-4 w-4 mr-2" />
              Reset Filters
            </Button>
          </div>
        </SheetContent>
      </Sheet>
      
      <div className="flex flex-wrap gap-2 sm:ml-2">
        {(["codeforces", "codechef", "leetcode"] as Platform[]).map(platform => (
          <Badge 
            key={platform}
            variant={filters.platforms.includes(platform) ? "default" : "outline"}
            className={`cursor-pointer ${filters.platforms.includes(platform) ? `bg-${platform} hover:bg-${platform}/80` : "hover:bg-secondary"}`}
            onClick={() => togglePlatform(platform)}
          >
            {platformLabels[platform]}
          </Badge>
        ))}
      </div>
      
      {activeFiltersCount > 0 && (
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={clearFilters} 
          className="ml-auto"
        >
          <X className="h-4 w-4 mr-1" />
          Clear
        </Button>
      )}
    </div>
  );
};

export default FilterSection;
