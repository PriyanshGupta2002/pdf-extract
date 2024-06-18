import { cn } from "@/lib/utils";
import { FC } from "react";
import Wrapper from "./wrapper";
import { Input } from "../ui/input";

interface SummaryProps {
  summary: string;
  className?: string;
  isEditing: boolean;
  handleUpdateSummary: (summary: string) => void;
  imageByteString?: string;
}
const Summary: FC<SummaryProps> = ({
  summary,
  handleUpdateSummary,
  isEditing,
  className,
  imageByteString,
}) => {
  return (
    <Wrapper
      className={cn(
        "max-h-[200px] overflow-y-auto text-sm",
        imageByteString ? "col-span-2" : "col-span-1"
      )}
    >
      <h2 className="text-darkBlack700 font-medium">Summary</h2>
      {isEditing ? (
        <Input
          defaultValue={summary}
          onChange={(e) => handleUpdateSummary(e.target.value)}
        />
      ) : (
        <p className="text-darkBlack600 font-normal">{summary}</p>
      )}
    </Wrapper>
  );
};

export default Summary;
