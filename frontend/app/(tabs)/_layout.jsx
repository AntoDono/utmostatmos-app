import { View, Text } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'
import Ionicons from '@expo/vector-icons/Ionicons';

export default function TabLayout() {
    return (
        <Tabs screenOptions={{
            headerShown:false,
            tabBarStyle: {
                height: '12%',
                paddingTop: '4%',
                paddingHorizontal: '2%'
            }
        }}>
            <Tabs.Screen name='home'
            options= {{
                tabBarIcon:({color, size})=> <Ionicons name="home-outline" size={size} color={color} />,
                tabBarLabel:'Home'
            }}/>
            <Tabs.Screen name='contests'
            options= {{
                tabBarIcon:({color, size})=> <Ionicons name="school-outline" size={size} color={color} />,
                tabBarLabel:'Contests'
            }}/>
            <Tabs.Screen name='quiz'
            options= {{
                tabBarIcon:({color, size})=> <Ionicons name="game-controller-outline" size={size} color={color} />,
                tabBarLabel:'Quiz'
            }}/>
            <Tabs.Screen name='map'
            options= {{
                tabBarIcon:({color, size})=> <Ionicons name="map-outline" size={size} color={color} />,
                tabBarLabel:'Map'
            }}/>
            <Tabs.Screen name='leaderboard'
            options= {{
                tabBarIcon:({color, size})=> <Ionicons name="podium-outline" size={size} color={color} />,
                tabBarLabel:'Leaderboard'
            }}/>
        </Tabs>
    )
}