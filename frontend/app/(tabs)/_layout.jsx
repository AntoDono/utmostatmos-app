import { View, Text, Platform } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'
import Ionicons from '@expo/vector-icons/Ionicons';
import colors from '../../constants/colors';

export default function TabLayout() {
    return (
        <Tabs screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: colors.LIGHTGREEN,
            tabBarInactiveTintColor: colors.GREY,
            tabBarStyle: {
                height: Platform.OS === 'ios' ? 88 : 68,
                paddingBottom: Platform.OS === 'ios' ? 28 : 12,
                paddingTop: Platform.OS === 'ios' ? 8 : 12,
                paddingHorizontal: 8,
                backgroundColor: colors.WHITE,
                borderTopWidth: 1,
                borderTopColor: '#E5E5E5',
                elevation: 8,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: -2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
            },
            tabBarLabelStyle: {
                fontSize: 12,
                fontFamily: 'Montserrat-Medium',
                marginTop: 4,
            },
            tabBarIconStyle: {
                marginBottom: 0,
            },
        }}>
            <Tabs.Screen 
                name='home'
                options={{
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons 
                            name={focused ? "home" : "home-outline"} 
                            size={24} 
                            color={color} 
                        />
                    ),
                    tabBarLabel: 'Home'
                }}
            />
            <Tabs.Screen 
                name='contests'
                options={{
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons 
                            name={focused ? "school" : "school-outline"} 
                            size={24} 
                            color={color} 
                        />
                    ),
                    tabBarLabel: 'Contests'
                }}
            />
            <Tabs.Screen 
                name='quiz'
                options={{
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons 
                            name={focused ? "game-controller" : "game-controller-outline"} 
                            size={24} 
                            color={color} 
                        />
                    ),
                    tabBarLabel: 'Quiz'
                }}
            />
            <Tabs.Screen 
                name='map'
                options={{
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons 
                            name={focused ? "map" : "map-outline"} 
                            size={24} 
                            color={color} 
                        />
                    ),
                    tabBarLabel: 'Map'
                }}
            />
            <Tabs.Screen 
                name='leaderboard'
                options={{
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons 
                            name={focused ? "podium" : "podium-outline"} 
                            size={24} 
                            color={color} 
                        />
                    ),
                    tabBarLabel: 'Leaderboard'
                }}
            />
        </Tabs>
    )
}