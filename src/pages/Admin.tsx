
import React, { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Contest, Platform } from "@/types";
import { fetchMockContests } from "@/services/api";
import Header from "@/components/Header";
import { isPast, formatDate } from "@/utils/timeUtils";
import PlatformTag from "@/components/PlatformTag";

interface ContestWithSolution extends Contest {
  hasYoutubeSolution: boolean;
}

const Admin = () => {
  const { toast } = useToast();
  const [pastContests, setPastContests] = useState<ContestWithSolution[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedContest, setSelectedContest] = useState<string | null>(null);
  const [youtubeLink, setYoutubeLink] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | "all">("all");
  
  // Fetch past contests on component mount
  useEffect(() => {
    const fetchPastContests = async () => {
      try {
        setIsLoading(true);
        
        // In a real app, you would use fetchAllContests() instead
        const allContests = fetchMockContests();
        
        // Filter to only include past contests and mark those with solutions
        const past = allContests
          .filter(contest => isPast(contest.endTime))
          .map(contest => ({
            ...contest,
            hasYoutubeSolution: !!contest.solutionUrl
          }))
          .sort((a, b) => {
            // Sort by end time, most recent first
            return new Date(b.endTime).getTime() - new Date(a.endTime).getTime();
          });
        
        setPastContests(past);
      } catch (error) {
        console.error("Failed to fetch past contests:", error);
        toast({
          title: "Error",
          description: "Failed to load past contests. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPastContests();
  }, [toast]);
  
  // Filter contests by platform
  const filteredContests = selectedPlatform === "all"
    ? pastContests
    : pastContests.filter(contest => contest.platform === selectedPlatform);
  
  // Handle form submission for adding a solution link
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedContest || !youtubeLink) {
      toast({
        title: "Error",
        description: "Please select a contest and enter a YouTube link.",
        variant: "destructive",
      });
      return;
    }
    
    // Validate YouTube link
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
    if (!youtubeRegex.test(youtubeLink)) {
      toast({
        title: "Error",
        description: "Please enter a valid YouTube link.",
        variant: "destructive",
      });
      return;
    }
    
    // Update the contest with the solution link
    setPastContests(prev => 
      prev.map(contest => 
        contest.id === selectedContest
          ? { ...contest, solutionUrl: youtubeLink, hasYoutubeSolution: true }
          : contest
      )
    );
    
    // Show success toast
    toast({
      title: "Solution Added",
      description: "The solution link has been added successfully.",
    });
    
    // Reset form
    setSelectedContest(null);
    setYoutubeLink("");
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Add Solution Link</CardTitle>
                <CardDescription>
                  Select a past contest and add a YouTube solution link
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Platform</label>
                    <Select 
                      value={selectedPlatform} 
                      onValueChange={(value) => setSelectedPlatform(value as Platform | "all")}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Platform" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Platforms</SelectItem>
                        <SelectItem value="codeforces">Codeforces</SelectItem>
                        <SelectItem value="codechef">CodeChef</SelectItem>
                        <SelectItem value="leetcode">LeetCode</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Contest</label>
                    <Select 
                      value={selectedContest || ""} 
                      onValueChange={setSelectedContest}
                      disabled={filteredContests.length === 0}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Contest" />
                      </SelectTrigger>
                      <SelectContent>
                        {filteredContests.map(contest => (
                          <SelectItem key={contest.id} value={contest.id}>
                            {contest.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">YouTube Link</label>
                    <Input
                      value={youtubeLink}
                      onChange={(e) => setYoutubeLink(e.target.value)}
                      placeholder="https://youtube.com/watch?v=..."
                    />
                  </div>
                  
                  <Button type="submit" className="w-full">
                    Add Solution Link
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
          
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Past Contests</CardTitle>
                <CardDescription>
                  View and manage solution links for past contests
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="h-64 rounded-lg bg-muted animate-pulse" />
                ) : (
                  <>
                    {filteredContests.length === 0 ? (
                      <div className="text-center py-8">
                        <p>No past contests found.</p>
                      </div>
                    ) : (
                      <div className="rounded-md border">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Contest</TableHead>
                              <TableHead>Platform</TableHead>
                              <TableHead>Date</TableHead>
                              <TableHead>Solution</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {filteredContests.map(contest => (
                              <TableRow key={contest.id}>
                                <TableCell className="font-medium">
                                  {contest.name}
                                </TableCell>
                                <TableCell>
                                  <PlatformTag platform={contest.platform} />
                                </TableCell>
                                <TableCell>
                                  {formatDate(contest.startTime)}
                                </TableCell>
                                <TableCell>
                                  {contest.hasYoutubeSolution ? (
                                    <a
                                      href={contest.solutionUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-primary hover:underline"
                                    >
                                      View Solution
                                    </a>
                                  ) : (
                                    <span className="text-muted-foreground">
                                      Not added
                                    </span>
                                  )}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <footer className="border-t py-6 text-center text-sm text-muted-foreground">
        <div className="container mx-auto px-4">
          <p>© {new Date().getFullYear()} Contest Hive. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Admin;
