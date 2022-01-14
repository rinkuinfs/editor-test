import React from 'react';
import Editor from '@atlaskit/editor-core/editor';
import TextArea from '@atlaskit/textarea';
import { EditorActions, EditorContext, WithEditorActions, ToolbarHelp } from '@atlaskit/editor-core';
import {
  getEmojiProvider,
  currentUser,
} from '@atlaskit/util-data-test/get-emoji-provider';
import { mentionResourceProvider } from '@atlaskit/util-data-test/mention-story-data';
import { getMockTaskDecisionResource } from '@atlaskit/util-data-test/task-decision-story-data';
import { storyMediaProviderFactory, fakeMediaProvider } from '@atlaskit/editor-test-helpers/media-provider';
import { EmojiProvider } from '@atlaskit/emoji/resource';
import styled from 'styled-components';
import * as mediaTestHelpers from '@atlaskit/media-test-helpers';

export const mediaProvider = fakeMediaProvider({
  includeUserAuthProvider: false,
});

interface AdfState {
  isValidAdf: boolean;
}

const Wrapper: any = styled.div`
  display: 'flex';
  padding: '10px';
  flex-direction: 'column';
`;

export const providers: any = {
  emojiProvider: getEmojiProvider({
    uploadSupported: false,
    currentUser,
  }) as Promise<EmojiProvider>,
  taskDecisionProvider: Promise.resolve(getMockTaskDecisionResource()),
  mentionProvider: Promise.resolve(mentionResourceProvider),
};

export default class Example extends React.Component<{}, AdfState> {
  
  private editorActions?: EditorActions;
  private adfTextArea?: HTMLTextAreaElement;
  state = {
    isValidAdf: true,
  };

  render() {
    return (
      <EditorContext>
        <Wrapper>
          <div>
            <WithEditorActions
              render={(actions) => {
                this.editorActions = actions;
                return (
                  <Editor
                    onChange={this.handleEditorChange}
                    appearance="full-page"
                    allowRule={true}
                    allowTextColor={true}
                    allowTables={{
                      allowControls: true,
                    }}
                    allowPanel={true}
                    allowHelpDialog={true}
                    primaryToolbarComponents={[
                      <ToolbarHelp key={1} titlePosition="top" title="Help" />,
                    ]}
                    media={{
                      provider: mediaProvider,
                      allowMediaSingle: true,
                    }}
                    {...providers}
                  />
                );
              }}
            />
          </div>
          <div>
            <h2>ADF</h2>
            <TextArea
               isInvalid={!this.state.isValidAdf}
               ref={(ref: any) => (this.adfTextArea = ref)}
               placeholder='{"version": 1...'
               isMonospaced={true}
               minimumRows={20}
            />
          </div>
        </Wrapper>
      </EditorContext>
    )
  }

  private handleEditorChange = () => {
    this.updateFields();
  };

  private updateFields = () => {
    if (!this.editorActions) {
      return;
    }

    this.editorActions.getValue().then((value) => {
      if (this.adfTextArea) {
        this.adfTextArea.value = JSON.stringify(value, null, 2);
      }
    });
  };
}
