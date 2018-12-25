import React from 'react';
import {
  Constants
} from 'expo';
import {
  StyleSheet,
  BackHandler,
  View,
  Alert,
  Image,
  TouchableHighlight
} from 'react-native';
import Status from './components/Status';
import MessageList from './components/MessageList';
import {
  createLocationMessage,
  createTextMessage,
  createImageMessage
} from './MessageUtils';

export default class App extends React.Component {
  state = {
    messages: [
      createImageMessage('https://unsplash.it/300/300'),
      createTextMessage('World'),
      createTextMessage('Hello'),
      createImageMessage('https://unsplash.it/300/300'),
      createLocationMessage({
        latitude: 37.78825,
        longitude: -122.4324,
      })
    ],
    fullscreenImageId: null,
    isInputFocused: false
  }
  dismissFullscreenId = () => {
    this.setState({
      fullscreenImageId: null
    })
  }
  renderFullScreenImage = () => {
    const {
      messages,
      fullscreenImageId
    } = this.state;

    const image = messages.find(message => message.id === fullscreenImageId);
    if (!image) return null;

    const {
      uri
    } = image;
    console.log(uri, fullscreenImageId)

    return (
      <TouchableHighlight style={styles.fullscreenOverlay} onPress={this.dismissFullscreenId} >
        <Image style={styles.fullscreenImage} source={{ uri }} />
      </TouchableHighlight>
    )
  }
  handlePressMessage = ({
    id,
    type
  }) => {
    switch (type) {
      case 'text':
        Alert.alert(
          'Delete message?',
          'Are you sure you want to permanently delete this message?',
          [{
              text: 'Cancel',
              style: 'cancel',
            },
            {
              text: 'Delete',
              style: 'destructive',
              onPress: () => {
                const {
                  messages
                } = this.state;
                this.setState({
                  messages: messages.filter(message => message.id != id)
                })
              }
            }
          ]
        )
        break;
      case 'image':
        this.setState({
          fullscreenImageId: id
        })
        break;
      default:
        break;
    }
  }
  renderMessageList() {
    const {
      messages
    } = this.state;
    return (
      <View style={styles.content}>
        <MessageList messages={messages} onPressMessage={this.handlePressMessage} />
      </View>
    )
  }
  renderInputMethodEditor() {
    return (
      <View style={styles.inputMethodEditor}>
      </View>
    )
  }
  renderToolbar() {
    return (
      <View style={styles.toolbar}>
      </View>
    )
  }
  componentWillMount = () => {
    this.subscription = BackHandler.addEventListener('hardwareBackPress', ()=>{
      const {fullscreenImageId} = this.state;

      if (fullscreenImageId) {
        this.dismissFullscreenId();
        return true;
      }
      return false;
    })
  }
  componentWillUnmount() {
    this.subscription.remove();
  }
  render() {
    return (
      <View style={styles.container}>
        <Status />
        {this.renderMessageList()}
        {this.renderFullScreenImage()}
        {this.renderToolbar()}
        {this.renderInputMethodEditor()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Constants.statusBarHeight,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    width: '100%'
  },
  inputMethodEditor: {
    flex: 1,
    backgroundColor: 'white',
  },
  toolbar: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.04)',
    backgroundColor: 'white',
  },
  fullscreenOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'black',
    zIndex: 2,
  },
  fullscreenImage: {
    flex: 1,
    resizeMode: 'contain',
  }
});