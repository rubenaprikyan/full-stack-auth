import * as React from 'react';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useFormField,
} from '@/components/ui/form';
import type { ControllerProps, FieldValues } from 'react-hook-form';
import type { UseFormStateReturn } from 'react-hook-form';
import type {
  ControllerFieldState,
  ControllerRenderProps,
} from 'react-hook-form';

export interface IRenderControllerProps {
  field: ControllerRenderProps<FieldValues, any> & { disabled?: boolean };
  fieldState: ControllerFieldState;
  formState: UseFormStateReturn<FieldValues>;
}

export interface ICustomFormFieldProps extends Omit<ControllerProps, 'render'> {
  labelText: string;
  renderController: (props: IRenderControllerProps) => React.JSX.Element;
}

/**
 * component CustomFormField
 * @param {ICustomFormFieldProps} props
 * @constructor
 */
function CustomFormField(props: ICustomFormFieldProps) {
  const { error, formMessageId, isTouched } = useFormField();
  const message = error && isTouched ? String(error?.message) : null;

  return (
    <FormField
      control={props.control}
      name={props.name}
      render={(controllerRenderProps) => (
        <FormItem>
          <FormLabel>{props.labelText}</FormLabel>
          <FormMessage>{message}</FormMessage>
          <FormControl>
            {props.renderController({
              ...controllerRenderProps,
              field: {
                ...controllerRenderProps.field,
                disabled: props.disabled,
              },
            })}
          </FormControl>
        </FormItem>
      )}
    />
  );
}

CustomFormField.displayName = 'CustomFormField';
export default CustomFormField;
