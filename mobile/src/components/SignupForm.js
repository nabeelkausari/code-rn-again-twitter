import React, { Component } from 'react';
import styled from 'styled-components/native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import Touchable from '@appandflow/touchable';
import { Platform, Keyboard, AsyncStorage } from 'react-native';
import { graphql, compose } from 'react-apollo';
import { connect } from 'react-redux';

import {colors, fakeAvatar, STORAGE_KEY} from "../utils/constants";
import SIGNUP_MUTATION from '../graphql/mutations/signup';
import Loading from '../components/Loading';
import { login } from "../actions/user";

const Root = styled(Touchable).attrs({
  feedback: 'none'
})`
  flex: 1;
  position: relative;
  justify-content: center;
  align-items: center;
`;


const Wrapper = styled.View`
  align-self: stretch;
  align-items: center;
  justify-content: center;
  height: 100%;
`;

const InputWrapper = styled.View`
  height: 50px;
  width: 70%;
  border-bottom-width: 2px;
  border-bottom-color: ${props => props.theme.LIGHT_GRAY};
  margin-vertical: 5;
  justify-content: flex-end;
`;

const Input = styled.TextInput.attrs({
  placeholderTextColor: colors.LIGHT_GRAY,
  selectionColor: Platform.OS === 'ios' ? colors.PRIMARY : undefined,
  autoCorrect: false
})`
  height: 30px;
  color: ${props => props.theme.WHITE}
`;

const BackButton = styled(Touchable).attrs({
  feedback: 'opacity'
})`
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 5%;
  left: 5%;
`;

const ButtonConfirm = styled(Touchable).attrs({
  feedback: 'opacity'
})`
  justify-content: center;
  align-items: center;
  position: absolute;
  bottom: 15%;
  width: 70%;
  height: 50px;
  background-color: ${props => props.theme.PRIMARY}
  border-radius: 10px;
  shadow-color: #000;
  shadow-radius: 5;
  shadow-offset: 0px 2px;
`;

const ButtonConfirmText = styled.Text`
  color: ${props => props.theme.WHITE};
  font-weight: 600;
`;

class SignupForm extends Component {
  state = {
    fullName: '',
    email: '',
    password: '',
    username: ''
  };

  _outsidePress = () => Keyboard.dismiss();

  _onChangeText = (text, type) => this.setState({ [type]: text })

  _checkIfDisabled () {
    const { fullName, email, password, username } = this.state;
    return (!fullName || !email || !password || !username);
  }

  _onSignupPress = async () => {
    this.setState({ loading: true });

    const { fullName, email, password, username } = this.state;
    const avatar = fakeAvatar;

    const { data } =  await this.props.mutate({
      variables: {
        fullName,
        email,
        password,
        username,
        avatar
      }
    });

    console.log('data: ', data)

    try {
      await AsyncStorage.setItem(STORAGE_KEY, data.signup.token)
      this.setState({ loading: false })
      return this.props.login();
    } catch (err) {
      throw err;
    }
  }

  render() {
    if (this.state.loading) {
      return <Loading/>;
    }
    return (
      <Root onPress={this._outsidePress}>
        <BackButton onPress={this.props.onBackPress}>
          <MaterialIcon color={colors.WHITE} size={30} name="arrow-back" />
        </BackButton>
        <Wrapper>
          <InputWrapper>
            <Input
              autoCapitalize="words"
              placeholder="Full Name"
              onChangeText={text => this._onChangeText(text, 'fullName')}
            />
          </InputWrapper>
          <InputWrapper>
            <Input
              autoCapitalize="none"
              keyboardType="email-address"
              placeholder="Email"
              onChangeText={text => this._onChangeText(text, 'email')}
            />
          </InputWrapper>
          <InputWrapper>
            <Input
              secureTextEntry
              placeholder="Password"
              onChangeText={text => this._onChangeText(text, 'password')}
            />
          </InputWrapper>
          <InputWrapper>
            <Input
              autoCapitalize="none"
              placeholder="Username"
              onChangeText={text => this._onChangeText(text, 'username')}
            />
          </InputWrapper>
        </Wrapper>
        <ButtonConfirm onPress={this._onSignupPress} disabled={this._checkIfDisabled()}>
          <ButtonConfirmText>
            Sign Up
          </ButtonConfirmText>
        </ButtonConfirm>
      </Root>
    )
  }
}

export default compose(
  graphql(SIGNUP_MUTATION),
  connect(null, { login })
)(SignupForm)