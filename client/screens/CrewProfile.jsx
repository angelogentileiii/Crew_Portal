import React, {useEffect, useState, useContext} from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

import * as SecureStore from 'expo-secure-store'

import { AuthContext } from '../contextProviders/AuthContext';
import useFetchAuthWrapper from '../components/fetchAuthWrapper';


function CrewProfile ({ navigation }) {
    const [userData, setUserData] = useState({})

    const authContext = useContext(AuthContext)
    const { attemptLogout, currentUser, checkAccessToken } = authContext
    
    // console.log('Within Profile: ', currentUser.data?.username)

    const fetchAuthWrapper = useFetchAuthWrapper({ navigation });

    useEffect(() => {
        const fetchData = async () => {
            let token = await SecureStore.getItemAsync('accessToken')
            let user = await checkAccessToken()
            console.log('Check Access:', user)

            try {
                const responseJSON = await fetchAuthWrapper('http://192.168.1.156:5555/users/currentUser', {
                // const responseJSON = await fetch401Wrapper(`http://10.129.3.82:5555/users/1`, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': "Bearer " + token
                    }
                })

                setUserData(responseJSON)
            }
            catch (error) {
                console.error('Error occurred while Fetching: ', error)
            }
        };

        fetchData()
    }, [])

    // console.log('USER DATA:', userData)

    return (
        <View>
            <View>
                <Text>{userData.firstName}</Text>
                <Text>{userData.lastName}</Text>
                <Text>{userData.address}</Text>
                <Text>{userData.email}</Text>
                <Text>{userData.phoneNumber}</Text>
                <Text>{userData.unionNumber}</Text>
            </View>
            <TouchableOpacity
                style={styles.button}
                underlayColor="#1E88E5" // Color when pressed
                onPress={() => {
                    attemptLogout()
                    // navigation.navigate('Login')
                }}
            >
                <Text style={styles.buttonText}>Logout?</Text>
            </TouchableOpacity>
        </View>
    )

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    button: {
        backgroundColor: '#2196F3', // Button background color
        padding: 12,
        borderRadius: 8, // Add rounded corners to match inputs
        width: 250,
        marginBottom: 20,
    },
    buttonText: {
        color: '#fff',
        textAlign: 'center',
        fontWeight: 'bold',
    },
});

export default CrewProfile