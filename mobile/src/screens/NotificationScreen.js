import React, { Component } from 'react';
import styled from 'styled-components/native';

const Root = styled.View``;

const T = styled.Text``;

class NotificationScreen extends Component {
  state = {}
  render() {
    return (
      <Root>
        <T>Notification Screen</T>
      </Root>
    )
  }
}

export default NotificationScreen;