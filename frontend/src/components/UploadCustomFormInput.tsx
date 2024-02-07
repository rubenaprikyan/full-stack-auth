import { useUploadMutation } from '@/rtk-api/endpoints';
import { useFormContext } from 'react-hook-form';
import React, { useEffect } from 'react';
import { cn } from '@/lib/utils';
import CustomFormField from '@/components/CustomFormField';
import { Input } from '@/components/ui/input';
import omit from 'lodash/omit';

import { FileUploadResponse } from '@/rtk-api/models/files.models';

interface UploadCustomFormInputProps {
  name: string;
  labelText: string;
  transformValues: (d: FileUploadResponse[]) => any;
  size?: number; // bytes
  multiple?: boolean;
  className?: string;
}

/**
 * Powerful UploadCustomFormInput
 * This Component handles form input under form context + uploads files to server before applying to form
 * @param {String} name - name of the input
 * @param {String} className - className
 * @param {String} transformValues - function to return the value from array need to set on form state
 * @param {Boolean} multiple
 * @param {String} labelText
 * @param {String} size - bytes
 * @constructor
 */
function UploadCustomFormInput({
  name,
  transformValues,
  className,
  multiple,
  labelText,
  size = 1048576,
}: UploadCustomFormInputProps) {
  const [upload, { isLoading: isFileUploadLoading, data }] = useUploadMutation(
    {},
  );

  const { setValue } = useFormContext();

  /**
   * handles input file changes
   */
  const onChangePhotos = React.useCallback(
    (e: any) => {
      e.preventDefault();

      const files = e.target.files;
      const formData = new FormData();

      // TODO handle size validation

      // collect formData and store files in a map to cache later
      for (let i = 0; i < files.length; i++) {
        formData.append(files[i].name, files[i]);
      }

      // upload to server
      upload(formData);
    },
    [upload],
  );

  useEffect(() => {
    if (data && !isFileUploadLoading) {
      setValue(name, transformValues(data.data), {
        shouldValidate: true,
        shouldTouch: true,
      });
    }
  }, [setValue, data, name, isFileUploadLoading]);

  return (
    <div className={cn(className)}>
      <CustomFormField
        name={name}
        labelText={labelText}
        renderController={({ field }) => (
          <Input
            {...omit(field, 'value')}
            size={100}
            type="file"
            multiple={multiple}
            accept="image/jpeg"
            onChange={onChangePhotos}
          />
        )}
      />
    </div>
  );
}

export default UploadCustomFormInput;
