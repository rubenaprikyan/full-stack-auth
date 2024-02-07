import * as React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

function ItemSkeleton() {
  return <Skeleton className="mb-2 h-3 w-[100px]" />;
}

function ProfileInfoLoader() {
  return (
    <CardContent className="p-8">
      <div className="">
        <div className="mb-5 flex items-center gap-2">
          <Skeleton className="h-20 w-20 rounded-full" />
          <div>
            <Skeleton className="mb-5 h-4 w-[200px]" />
            <Skeleton className="h-3 w-[200px]" />
          </div>
        </div>

        <div className="mt-10 flex justify-between">
          <div className="space-y-2">
            <ItemSkeleton />
            <ItemSkeleton />
          </div>
          <div className="space-y-2">
            <ItemSkeleton />
            <ItemSkeleton />
          </div>
          <div className="space-y-2">
            <ItemSkeleton />
            <ItemSkeleton />
          </div>
        </div>
        <div className="mt-10 flex justify-start">
          <div className="mr-10 space-y-2">
            <ItemSkeleton />
            <ItemSkeleton />
          </div>
          <div className="space-y-2">
            <ItemSkeleton />
            <ItemSkeleton />
          </div>
        </div>
      </div>
    </CardContent>
  );
}

export default ProfileInfoLoader;
