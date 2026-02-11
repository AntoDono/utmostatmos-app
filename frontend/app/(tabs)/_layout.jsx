import React from 'react'
import { Drawer } from 'expo-router/drawer'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import CustomDrawerContent from '../../components/Navigation/CustomDrawerContent'
import CustomHeader from '../../components/Navigation/CustomHeader'
import { CustomAlert } from '../../components/Alert'
import colors from '../../constants/colors'

export default function DrawerLayout() {
    const formatTitle = (name) => {
        // Handle special cases
        if (name === 'contests') return 'Contests';
        if (name === 'leaderboard') return 'Leaderboard';
        if (name === 'admin') return 'Admin Dashboard';
        return name.charAt(0).toUpperCase() + name.slice(1);
    };

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <Drawer
                drawerContent={(props) => <CustomDrawerContent {...props} />}
                screenOptions={({ route }) => ({
                    drawerStyle: {
                        backgroundColor: colors.WHITE,
                        width: 280,
                    },
                    headerShown: true,
                    header: () => <CustomHeader title={formatTitle(route.name)} />,
                })}
            >
                <Drawer.Screen
                    name="home"
                    options={{
                        drawerLabel: 'Home',
                        title: 'Home',
                    }}
                />
                <Drawer.Screen
                    name="contests"
                    options={{
                        drawerLabel: 'Contests',
                        title: 'Contests',
                    }}
                />
                <Drawer.Screen
                    name="quiz"
                    options={{
                        drawerLabel: 'Quiz',
                        title: 'Quiz',
                    }}
                />
                <Drawer.Screen
                    name="map"
                    options={{
                        drawerLabel: 'Map',
                        title: 'Map',
                    }}
                />
                <Drawer.Screen
                    name="leaderboard"
                    options={{
                        drawerLabel: 'Leaderboard',
                        title: 'Leaderboard',
                    }}
                />
                <Drawer.Screen
                    name="admin"
                    options={{
                        drawerLabel: 'Admin',
                        title: 'Admin Dashboard',
                    }}
                />
            </Drawer>
            <CustomAlert />
        </GestureHandlerRootView>
    )
}