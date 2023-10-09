import { InputGroup, InputGroupText, TextInput, TextInputProps } from '@patternfly/react-core';
import { ReactNode } from 'react';

import { IRegisterData } from 'hooks/useForm';

import { LoadingSpinner } from 'components/LoadingSpinner/LoadingSpinner';
import { ErrorStateCard } from 'components/StateCard/ErrorStateCard';
import { TooltipWrapper } from 'components/TooltipWrapper/TooltipWrapper';

interface ITextInputAsyncValidatedProps extends TextInputProps {
  validationState?: IRegisterData<string>['validationState'];
  prefixComponent: ReactNode;
}

/**
 * Text input with state of async validation.
 * When async validation is being fetched, spinner is displayed.
 * When async validation request failed, error icon is displayed.
 *
 * props: same as TextInputProps + IRegisterData, and:
 * @param prefixComponent - Prefix of the text input
 */
export const TextInputAsyncValidated = (props: ITextInputAsyncValidatedProps) => (
  <InputGroup>
    {props.prefixComponent && <InputGroupText>{props.prefixComponent}</InputGroupText>}
    <TextInput {...props} />

    {props.validationState === 'validating' && (
      <InputGroupText>
        <TooltipWrapper tooltip="Validating input..">
          <LoadingSpinner isInline />
        </TooltipWrapper>
      </InputGroupText>
    )}

    {props.validationState === 'error' && (
      <InputGroupText>
        <ErrorStateCard title="validation" variant="icon" />
      </InputGroupText>
    )}
  </InputGroup>
);
