import React from 'react';

import { cn } from '@/lib/utils';

import UploadCustomFormInput from '@/components/UploadCustomFormInput';

interface UploadPictureStepProps {
  isLoading: boolean;
  className: string;
}

function UploadPictureStep({ isLoading, className }: UploadPictureStepProps) {
  return (
    <div className={cn(className)}>
      <UploadCustomFormInput
        name="avatarKey"
        labelText="Avatar"
        transformValues={(d) => d[0].key}
        multiple={false}
      />
      <UploadCustomFormInput
        name="photos"
        labelText="Photos"
        transformValues={(d) =>
          d.map((f) => ({
            name: f.name,
            key: f.key,
          }))
        }
        transformFakeValue={() =>
          Array(4).fill(() => ({ name: 'fake', key: 'fake' }))
        }
        multiple
      />
    </div>
  );
}

export default UploadPictureStep;
