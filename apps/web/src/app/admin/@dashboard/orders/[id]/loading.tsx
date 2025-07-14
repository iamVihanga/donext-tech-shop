import PageContainer from "@/components/dashboard/page-container";
import { Loader } from "lucide-react";

type Props = {};

export default function LoadingPage({}: Props) {
  return (
    <PageContainer scrollable={false}>
      <div className="flex flex-1 flex-col items-center justify-center space-y-4">
        <Loader className="size-8 text-muted-foreground/50 animate-spin" />
      </div>
    </PageContainer>
  );
}
