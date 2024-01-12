import React, { useCallback, useState } from 'react';
import { injectIntl, FormattedMessage, IntlShape } from 'react-intl';

import Avatar from '../../components/avatar';
import PrimaryButton from '../../components/primary-button';
// @ts-ignore flow import
import TextArea from '../../components/text-area';
import { TEXT_AREA } from './constants';
// @ts-ignore: no ts definition
// eslint-disable-next-line import/named
import { User } from '../../../common/types/core';
import ContentAnswersModalFooterActions from './ContentAnswersModalFooterActions';

import messages from './messages';

import './ContentAnswersModalFooter.scss';

type Props = {
    currentUser?: User;
    hasError: boolean;
    intl: IntlShape;
    isLoading: boolean;
    onAsk: (prompt: string) => void;
    onRetry: () => void;
};

const ContentAnswersModalFooter = ({ currentUser, hasError, intl, isLoading, onAsk, onRetry }: Props) => {
    const { formatMessage } = intl;
    const { id, name } = currentUser || {};
    const [prompt, setPrompt] = useState('');
    const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
    const [hasMaxCharacterError, setHasMaxCharacterError] = useState(false);

    const handleInputChange = useCallback(
        (event: React.FormEvent<HTMLInputElement>) => {
            let currentInput = event.currentTarget.value;
            if (currentInput.length > TEXT_AREA.MAX_LENGTH) {
                currentInput = currentInput.slice(0, TEXT_AREA.MAX_LENGTH);
            }
            setPrompt(currentInput);
            setHasMaxCharacterError(currentInput.length >= TEXT_AREA.MAX_LENGTH);
            if (!isLoading) {
                setIsSubmitDisabled(currentInput.trim().length === 0);
            }
        },
        [isLoading],
    );

    const handleOnAsk = useCallback(() => {
        if (!isSubmitDisabled && prompt) {
            onAsk(prompt);
            setPrompt('');
            setIsSubmitDisabled(true);
        }
    }, [isSubmitDisabled, onAsk, prompt]);

    const handleKeyDown = useCallback(
        event => {
            if (event.keyCode === 13 && event.shiftKey === false) {
                event.preventDefault();
                handleOnAsk();
            }
        },
        [handleOnAsk],
    );

    return (
        <div className="bdl-ContentAnswersModalFooter">
            <ContentAnswersModalFooterActions hasError={hasError} onRetry={onRetry} />
            <div className="bdl-ContentAnswersModalFooter-questionInput">
                <div className="bdl-ContentAnswersModalFooter-avatar">
                    <Avatar id={id} name={name} />
                </div>
                <TextArea
                    data-testid="content-answers-question-input"
                    error={
                        hasMaxCharacterError &&
                        formatMessage(messages.maxCharactersReachedError, {
                            characterLimit: TEXT_AREA.MAX_LENGTH,
                        })
                    }
                    hideLabel
                    label={formatMessage(messages.askQuestionPlaceholder)}
                    maxLength={TEXT_AREA.MAX_LENGTH}
                    onChange={handleInputChange}
                    placeholder={formatMessage(messages.askQuestionPlaceholder)}
                    value={prompt}
                    onKeyDown={handleKeyDown}
                />
                <PrimaryButton
                    className="bdl-ContentAnswersModalFooter-submitButton"
                    data-testid="content-answers-submit-button"
                    isDisabled={isSubmitDisabled}
                    onClick={handleOnAsk}
                >
                    <FormattedMessage {...messages.ask} />
                </PrimaryButton>
            </div>
        </div>
    );
};

export default injectIntl(ContentAnswersModalFooter);
