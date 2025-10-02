import { Card } from "@/components/ui/Card";

type PageLoadingProps = {
  title?: string;
};

export const PageLoading = ({ title }: PageLoadingProps) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        {title && <h1 className="text-3xl font-bold mb-6">{title}</h1>}
        <Card className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-24 w-24 bg-gray-200 rounded-full mx-auto" />
            <div className="h-6 bg-gray-200 rounded w-1/3 mx-auto" />
            <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto" />
          </div>
        </Card>
      </div>
    </div>
  );
};
