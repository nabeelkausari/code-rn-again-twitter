import React, { Component } from 'react';
import styled from 'styled-components/native';
import Touchable from '@appandflow/touchable';

import SignupForm from '../components/SignupForm';

const Root = styled.View`
  flex: 1;
  background-color: ${props => props.theme.SECONDARY}
  position: relative;
`;

const ButtonSignupText = styled.Text`
  color: ${props => props.theme.WHITE};
  font-weight: bold;
  font-size: 20;
`;

const ButtonSignup = styled(Touchable).attrs({
  feedback: 'opacity'
})`
  height: 75;
  width: 150;
  background-color: ${props => props.theme.PRIMARY};
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 30%;
  right: 0;
  border-top-left-radius: 20;
  border-bottom-left-radius: 20;
  shadow-opacity: 0.4;
  shadow-radius: 5;
  shadow-offset: 0px 4px;
  shadow-color: #000;
`;

const BottomContainer = styled.View`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 200;
  align-items: center;
  justify-content: center;
`;

const ButtonLogin = styled(Touchable).attrs({
  feedback: 'opacity',
  hitSlop: { top: 20, bottom: 20, right: 20, left: 20 }
})`
  justify-content: center;
  align-items: center;
`;

const ButtonLoginText = styled.Text`
  color: ${props => props.theme.WHITE};
  font-weight: 400;
  font-size: 16;
`;

const initialState = {
  showSignup: false,
  showLogin: false
}

class AuthenticationScreen extends Component {
  state = initialState;

  _onShowSignup = () => this.setState({ showSignup: true });
  _onBackPress = () => this.setState({ ...initialState });


  render() {
    if (this.state.showSignup) {
      return (
        <Root>
          <SignupForm onBackPress={this._onBackPress} />
        </Root>
      )
    }
    return (
      <Root>
        <ButtonSignup onPress={this._onShowSignup}>
          <ButtonSignupText>Get Started</ButtonSignupText>
        </ButtonSignup>
        <BottomContainer>
          <ButtonLogin>
            <ButtonLoginText>
              Already have an account?
            </ButtonLoginText>
          </ButtonLogin>
        </BottomContainer>
      </Root>
    )
  }
}

export default AuthenticationScreen;