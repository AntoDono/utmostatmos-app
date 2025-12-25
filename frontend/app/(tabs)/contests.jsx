import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native'
import React, { useState } from 'react'

export default function Contests() {
    const [selected, setSelected] = useState('Scholarships')
    const [expandedId, setExpandedId] = useState(null)

    const scholarships = [
        {
            id: 1,
            title: 'Youth Environmental Leaders Scholarship',
            organization: 'Utmost Atmos',
            scope: 'National',
            grade: '9-12',
            deadline: 'March 15, 2026',
            prize: '$5,000 scholarship',
            description: 'A scholarship program that lets students apply their knowledge and compete for first place',
            requirements: [
                'Essay on environmental impact',
                'Two letters of recommendation'
            ]
        },
        // Add more scholarships as needed
    ]

    const toggleExpand = (id) => {
        setExpandedId(expandedId === id ? null : id)
    }

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerText}>Contests/Scholarships</Text>
            </View>

            {/* Content with Cards */}
            <ScrollView style={styles.scrollView}>
                {scholarships.map((scholarship) => (
                    <View key={scholarship.id} style={styles.card}>
                        {/* Collapsed View */}
                        <TouchableOpacity
                            style={styles.cardHeader}
                            onPress={() => toggleExpand(scholarship.id)}
                        >
                            <View style={styles.cardHeaderContent}>
                                <Text style={styles.cardTitle}>{scholarship.title}</Text>
                                <Text style={styles.organization}>{scholarship.organization}</Text>
                                <Text style={styles.scope}>{scholarship.scope}</Text>
                            </View>
                            <Text style={styles.arrow}>
                                {expandedId === scholarship.id ? '⌃' : '⌄'}
                            </Text>
                        </TouchableOpacity>

                        {/* Expanded View */}
                        {expandedId === scholarship.id && (
                            <View style={styles.cardBody}>
                                <View style={styles.detailRow}>
                                    <Text style={styles.detailLabel}>Grade:</Text>
                                    <Text style={styles.detailValue}>{scholarship.grade}</Text>
                                </View>

                                <View style={styles.detailRow}>
                                    <Text style={styles.detailLabel}>Scope:</Text>
                                    <Text style={styles.detailValue}>{scholarship.scope}</Text>
                                </View>

                                <View style={styles.detailRow}>
                                    <Text style={styles.detailLabel}>Deadline:</Text>
                                    <Text style={styles.detailValue}>{scholarship.deadline}</Text>
                                </View>

                                <Text style={styles.description}>{scholarship.description}</Text>

                                <Text style={styles.prize}>{scholarship.prize}</Text>

                                <Text style={styles.requirementTitle}>Requirement:</Text>
                                {scholarship.requirements.map((req, index) => (
                                    <Text key={index} style={styles.requirement}>• {req}</Text>
                                ))}
                            </View>
                        )}
                    </View>
                ))}
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        paddingTop: 60,
        paddingBottom: 20,
        paddingHorizontal: 20,
        backgroundColor: '#d3d3d3',
    },
    headerText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#000',
    },
    scrollView: {
        flex: 1,
        padding: 15,
    },
    card: {
        backgroundColor: '#d3d3d3',
        borderRadius: 12,
        marginBottom: 15,
        overflow: 'hidden',
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
    },
    cardHeaderContent: {
        flex: 1,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 8,
    },
    organization: {
        fontSize: 14,
        color: '#000',
        marginBottom: 4,
    },
    scope: {
        fontSize: 14,
        color: '#000',
    },
    arrow: {
        fontSize: 24,
        color: '#000',
        marginLeft: 10,
    },
    cardBody: {
        padding: 20,
        paddingTop: 0,
    },
    detailRow: {
        flexDirection: 'row',
        marginBottom: 10,
    },
    detailLabel: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#000',
        marginRight: 5,
    },
    detailValue: {
        fontSize: 14,
        color: '#000',
    },
    description: {
        fontSize: 14,
        color: '#000',
        marginVertical: 12,
        lineHeight: 20,
    },
    prize: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#5a9e6f',
        marginBottom: 12,
    },
    requirementTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 8,
    },
    requirement: {
        fontSize: 14,
        color: '#000',
        marginLeft: 10,
        marginBottom: 4,
    },
})