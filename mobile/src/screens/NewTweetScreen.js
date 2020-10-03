import React, { Component } from 'react';
import styled from 'styled-components/native';
import { Platform, Keyboard } from 'react-native';
import Touchable  from '@appandflow/touchable'
import { graphql, compose } from 'react-apollo';
import { connect } from 'react-redux';

import { colors } from "../utils/constants"
import CREATE_TWEET_MUTATION from '../graphql/mutations/createTweet';
import GET_TWEETS_QUERY from '../graphql/queries/getTweets';

const Root = styled.View`
  background-color: ${props => props.theme.WHITE};
  flex: 1;
  align-items: center;
`;

const Wrapper = styled.View`
  height: 80%;
  width: 90%;
  padding-top: 5px;
  position: relative;
`;

const Input = styled.TextInput.attrs({
  multiline: true,
  placeholder: 'What\'s happening?',
  maxLength: 140,
  selectionColor: Platform.OS === 'ios' && colors.PRIMARY,
  autoFocus: true
})`
  height: 40%;
  width: 100%;
  font-size: 18px;
  color: ${props => props.theme.SECONDARY}
`;

const TweetButton = styled(Touchable).attrs({
  feedback: 'opacity',
  hitSlop: { top: 20, left: 20, right: 20, bottom: 20 }
})`
  background-color: ${props => props.theme.PRIMARY};
  justify-content: center;
  align-items: center;
  width: 80px;
  height: 40px;
  border-radius: 20px;
  position: absolute;
  top: 60%;
  right: 0;
`

const TweetButtonText = styled.Text`
  color: ${props => props.theme.WHITE};
  font-size: 16px;
`;

const TextLength = styled.Text`
  font-size: 18px;
  color: ${props => props.theme.PRIMARY};
  position: absolute;
  top: 45%;
  right: 5%;
`;

class NewTweetScreen extends Component {
  state = {
    text: ''
  }

  _onChangeText = text => this.setState({ text });

  _onCreateTweetPress = async () => {
    const { username, firstName, lastName, avatar } = this.props.user;
    await this.props.mutate({
      variables: {
        text: this.state.text
      },
      optimisticResponse: {
        __typename: 'mutation',
        createTweet: {
          __typename: 'Tweet',
          text: this.state.text,
          _id: Math.round(Math.random() * -1000000),
          createdAt: new Date(),
          favoriteCount: 0,
          user: {
            __typename: 'User',
            username,
            firstName,
            lastName,
            avatar
          }
        }
      },
      update: (store, { data: { createTweet }}) => {
        const data = store.readQuery({ query: GET_TWEETS_QUERY });
        if (!data.getTweets.find(t => t._id === createTweet._id)) {
          store.writeQuery({
            query: GET_TWEETS_QUERY,
            data: { getTweets: [createTweet, ...data.getTweets]}
          })
        }
      }
    })
    Keyboard.dismiss();
    this.props.navigation.goBack(null)
  }

  get _textLength() {
    return 140 - this.state.text.length;
  }

  get _buttonDisabled() {
    return this.state.text.length < 5;
  }

  render() {
    return (
      <Root>
        <Wrapper>
          <Input value={this.state.text} onChangeText={this._onChangeText} />
          <TextLength>{this._textLength}</TextLength>
          <TweetButton disabled={this._buttonDisabled} onPress={this._onCreateTweetPress}>
            <TweetButtonText>Tweet</TweetButtonText>
          </TweetButton>
        </Wrapper>
      </Root>
    )
  }
}

export default compose(
  graphql(CREATE_TWEET_MUTATION),
  connect(({user}) => ({ user: user.info}))
)(NewTweetScreen);