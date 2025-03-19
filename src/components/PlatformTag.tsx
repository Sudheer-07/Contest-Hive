
import { Badge } from "@/components/ui/badge";
import { Platform } from "@/types";

interface PlatformTagProps {
  platform: Platform;
}

const platformNames: Record<Platform, string> = {
  codeforces: "Codeforces",
  codechef: "CodeChef",
  leetcode: "LeetCode"
};

const PlatformTag = ({ platform }: PlatformTagProps) => {
  return (
    <Badge className={`platform-tag-${platform}`} variant="outline">
      {platformNames[platform]}
    </Badge>
  );
};

export default PlatformTag;
