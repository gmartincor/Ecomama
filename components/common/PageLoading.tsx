import { Card } from "@/components/ui/Card";

type PageLoadingProps = {
  title?: string;
};

export const PageLoading = ({ title }: PageLoadingProps) => {
  return (
    <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
      <div className="max-w-2xl mx-auto">
        {title && <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 break-words">{title}</h1>}
        <Card className="p-4 sm:p-6">
          <div className="animate-pulse space-y-3 sm:space-y-4">
            <div className="h-16 w-16 sm:h-24 sm:w-24 bg-muted rounded-full mx-auto" />
            <div className="h-5 sm:h-6 bg-muted rounded w-1/3 mx-auto" />
            <div className="h-3 sm:h-4 bg-muted rounded w-2/3 mx-auto" />
          </div>
        </Card>
      </div>
    </div>
  );
};
