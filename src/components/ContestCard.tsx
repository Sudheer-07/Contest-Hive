
import { useState, useEffect } from "react";
import { Calendar, Clock, ExternalLink, Bookmark, CheckCircle } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import PlatformTag from "./PlatformTag";
import { Contest } from "@/types";
import { formatDate, formatDuration, getTimeRemaining, isContestOngoing, isPast, isUpcoming } from "@/utils/timeUtils";

interface ContestCardProps {
  contest: Contest;
  isBookmarked: boolean;
  onToggleBookmark: () => void;
}

const ContestCard = ({ contest, isBookmarked, onToggleBookmark }: ContestCardProps) => {
  const [timeRemaining, setTimeRemaining] = useState(getTimeRemaining(contest.startTime));
  const ongoing = isContestOngoing(contest.startTime, contest.endTime);
  const past = isPast(contest.endTime);
  const upcoming = isUpcoming(contest.startTime);

  // Update time remaining every minute
  useEffect(() => {
    if (upcoming) {
      const interval = setInterval(() => {
        setTimeRemaining(getTimeRemaining(contest.startTime));
      }, 60000); // 1 minute
      
      return () => clearInterval(interval);
    }
  }, [contest.startTime, upcoming]);

  return (
    <Card className={`contest-card contest-card-${contest.platform} animate-fade-in`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <PlatformTag platform={contest.platform} />
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onToggleBookmark}
            aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
          >
            <Bookmark 
              className={`h-5 w-5 ${isBookmarked ? "fill-primary text-primary" : ""}`} 
            />
          </Button>
        </div>
        <h3 className="font-semibold text-lg mt-2">{contest.name}</h3>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex flex-col space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>{formatDate(contest.startTime)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>Duration: {formatDuration(contest.duration)}</span>
          </div>
          
          {ongoing && (
            <div className="mt-2">
              <span className="px-2 py-1 rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 text-xs font-medium">
                Ongoing
              </span>
            </div>
          )}
          
          {upcoming && (
            <div className="mt-2">
              <span className="px-2 py-1 rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-xs font-medium">
                Starts in {timeRemaining}
              </span>
            </div>
          )}
          
          {past && contest.solutionUrl && (
            <div className="mt-2">
              <a
                href={contest.solutionUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-primary hover:underline"
              >
                <CheckCircle className="h-4 w-4" />
                <span>Watch Solution</span>
              </a>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <a
          href={contest.url}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full"
        >
          <Button variant="outline" className="w-full">
            <span>View Contest</span>
            <ExternalLink className="h-4 w-4 ml-2" />
          </Button>
        </a>
      </CardFooter>
    </Card>
  );
};

export default ContestCard;
