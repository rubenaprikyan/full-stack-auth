import { useUploadMutation } from '@/rtk-api/endpoints';
import { useFormContext } from 'react-hook-form';
import React, { useEffect } from 'react';
import { cn } from '@/lib/utils';
import CustomFormField from '@/components/CustomFormField';
import { Input } from '@/components/ui/input';
import omit from 'lodash/omit';

import { FileUploadResponse } from '@/rtk-api/models/files.models';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/Avatar';

interface UploadCustomFormInputProps {
  name: string;
  labelText: string;
  transformValues: (d: FileUploadResponse[]) => any;
  transformFakeValue?: Function;
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
 * @param transformFakeValue - set value after on click to prevent unnecessary error display
 * @constructor
 */
function UploadCustomFormInput({
  name,
  transformValues,
  className,
  multiple,
  labelText,
  size = 1048576,
  transformFakeValue,
}: UploadCustomFormInputProps) {
  const [upload, { isLoading: isFileUploadLoading, data, error }] =
    useUploadMutation({});

  const { setValue, setError } = useFormContext();

  /**
   * handles input file changes
   */
  const onChangePhotos = React.useCallback(
    (e: any) => {
      e.preventDefault();
      if (transformFakeValue) {
        setValue(name, transformFakeValue(), {
          shouldValidate: true,
        });
      }
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
    [upload, transformFakeValue, setValue],
  );

  // handle upload success
  useEffect(() => {
    if (data && !isFileUploadLoading) {
      setValue(name, transformValues(data.data), {
        shouldValidate: true,
        shouldTouch: true,
      });
    }
  }, [setValue, data, name, isFileUploadLoading]);

  // error handler
  useEffect(() => {
    if (error && !isFileUploadLoading) {
      // @ts-ignore
      if (error.statusCode === 400) {
        setError(
          name,
          {
            // @ts-ignore
            message: error.details.message,
          },
          {
            shouldFocus: true,
          },
        );
      }
    }
  }, [error, setError, name]);

  return (
    <div className={cn(className)}>
      <CustomFormField
        name={name}
        labelText={labelText}
        renderController={({ field }) => (
          <>
            <div className="max- max-w-500  max-h-100 mb-2 mt-2 flex flex-wrap gap-2 overflow-y-auto">
              {data &&
                data.data.map((file) => (
                  <Avatar key={file.key} className="h-11 w-11 rounded-none">
                    <AvatarImage src={file.location} alt={file.name} />
                    <AvatarFallback className="h-11 w-11 rounded-none" />
                  </Avatar>
                ))}
            </div>
            <Input
              {...omit(field, 'value')}
              size={size}
              type="file"
              multiple={multiple}
              accept="image/jpeg"
              onChange={onChangePhotos}
            />
          </>
        )}
      />
    </div>
  );
}

export default React.memo<UploadCustomFormInputProps>(UploadCustomFormInput);
