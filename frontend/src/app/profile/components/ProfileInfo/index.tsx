import { Avatar, AvatarFallback, AvatarImage } from '@/components/Avatar';
import { UserProfile } from '@/rtk-api/models/users.models';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDateFromTimestamp } from '@/lib/utils';
import React from 'react';
import ProfileInfoLoader from '@/app/profile/components/ProfileInfo/Loader';
import { Button } from '@/components/ui/button';
import { handleLogout } from '@/lib/auth-service';
export interface ProfileInfoProps {
  user?: UserProfile;
  isLoading: boolean;
  error: any;
}

function ProfileInfo({ user, isLoading, error }: ProfileInfoProps) {
  return (
    <Card className="w-[500px]">
      {(isLoading || error) && <ProfileInfoLoader />}
      {user && (
        <CardContent className="p-8">
          <div className="">
            <div>
              <div className="flex justify-between">
                <div className="mb-2 flex items-center gap-2">
                  <Avatar className="h-20 w-20">
                    <AvatarImage
                      src={user.client.avatar}
                      alt={user.firstName}
                    />
                    <AvatarFallback>{user.firstName}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="mb-2 text-xl font-bold">{user.fullName}</h3>
                    <p className="text-sm">{user.email}</p>
                  </div>
                </div>

                <Button variant="ghost" onClick={handleLogout}>
                  Log out
                </Button>
              </div>
            </div>

            <div className="mt-10 flex justify-between">
              <div className="space-y-2">
                <p className="text-xs font-bold">First Name</p>
                <p className="text-sm tracking-tight">{user.firstName}</p>
              </div>
              <div className="space-y-2">
                <p className="text-xs font-bold">Last Name</p>
                <p className="text-sm tracking-tight">{user.lastName}</p>
              </div>
              <div className="space-y-2">
                <p className="text-xs font-bold">Account type</p>
                <p className="text-sm tracking-tight text-green-400">
                  {user.active ? 'active' : 'inActive'}
                </p>
              </div>
            </div>
            <div className="mt-10 flex justify-start">
              <div className="mr-10 space-y-2">
                <p className="text-xs font-bold">Role</p>
                <p className="text-sm tracking-tight">{user.role}</p>
              </div>
              <div className="space-y-2">
                <p className="text-xs font-bold">Registered on</p>
                <p className="text-sm tracking-tight">
                  {formatDateFromTimestamp(user.createdAt)}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
}

export default React.memo<ProfileInfoProps>(ProfileInfo);
