import { Constants } from 'expo';
import { NetInfo, View, Text, StatusBar, StyleSheet, Platform} from 'react-native';
import React from 'react';

export default class Status extends React.Component {
	state = {
		info: null,
	}

	async componentDidMount() {
		this.subscription = NetInfo.addEventListener('connectionChange', this.handleChange);

		const info = await NetInfo.getConnectionInfo().type;

		this.setState({info});
	}

	componentWillUnmount() {
		this.subscription.remove();
	}

	handleChange = data => {
		const info = data.type
		console.log('status changed', info)
		this.setState({info})
	}

	render(){
		const {info} = this.state;
		// console.log(info)
		const isConnected = info !== 'none';
		// const isConnected = false;
		const backgroundColor = isConnected ? 'white': 'red';

		const statusBar = (
			<StatusBar 
				backgroundColor={backgroundColor}
				barStyle={isConnected?'dark-content': 'light-content'}
				animated={false}
			/>
		)

		const messageContainer = (
			<View style={styles.messageContainer} pointerEvents={'none'}>
				{statusBar}
				{!isConnected && (
					<View style={styles.bubble}>
						<Text style={styles.text}>No network connection</Text>
					</View>
				)}
			</View>
		)

		if (Platform.OS === 'ios'){
			return <View style={[styles.status, {backgroundColor}]}>{messageContainer}</View>
		}

		return messageContainer;
	}
}


const statusHeight = (Platform.OS === 'ios' ? Constants.statusHeight : 0)

const styles = StyleSheet.create({
	status: {
			zIndex: 1,
			height: statusHeight,
			// marginTop: Constants.statusBarHeight,
	},
	messageContainer: {
		zIndex: 1,
		position: 'absolute',
		right: 0,
		top: statusHeight + 20,
		left: 0,
		height: 80,
		alignItems: 'center',
	},
	bubble: {
		paddingHorizontal: 20,
		paddingVertical: 10,
		borderRadius: 20,
		backgroundColor: 'red',
	},
	text: {
		color: 'white'
	}
})