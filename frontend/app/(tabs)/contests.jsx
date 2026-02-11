import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated, LayoutAnimation, Platform, UIManager, ActivityIndicator } from 'react-native'
import React, { useState, useRef, useEffect } from 'react'
import colors from '../../constants/colors'
import { contestAPI } from '../../utils/api'

// Enable LayoutAnimation for Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

const AccordionCard = ({ scholarship, isExpanded, onToggle }) => {
    const rotateAnim = useRef(new Animated.Value(isExpanded ? 1 : 0)).current;

    const handleToggle = () => {
        LayoutAnimation.configureNext(LayoutAnimation.create(
            250,
            LayoutAnimation.Types.easeInEaseOut,
            LayoutAnimation.Properties.opacity
        ));
        
        Animated.timing(rotateAnim, {
            toValue: isExpanded ? 0 : 1,
            duration: 250,
            useNativeDriver: true,
        }).start();
        
        onToggle();
    };

    const rotateInterpolate = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '180deg'],
    });

    return (
        <View style={styles.card}>
            <TouchableOpacity
                style={styles.cardHeader}
                onPress={handleToggle}
                activeOpacity={0.7}
            >
                <View style={styles.cardHeaderContent}>
                    <View style={styles.titleRow}>
                        <View style={styles.iconBadge}>
                            <Text style={styles.iconEmoji}>🏆</Text>
                        </View>
                        <View style={styles.titleContent}>
                            <Text style={styles.cardTitle}>{scholarship.title}</Text>
                            <Text style={styles.organization}>{scholarship.organization}</Text>
                        </View>
                    </View>
                    <View style={styles.tagsRow}>
                        <View style={styles.tag}>
                            <Text style={styles.tagText}>{scholarship.scope}</Text>
                        </View>
                        <View style={styles.tag}>
                            <Text style={styles.tagText}>Grade {scholarship.grade}</Text>
                        </View>
                    </View>
                </View>
                <Animated.Text style={[styles.arrow, { transform: [{ rotate: rotateInterpolate }] }]}>
                    ▼
                </Animated.Text>
            </TouchableOpacity>

            {isExpanded && (
                <View style={styles.cardBody}>
                    <View style={styles.divider} />
                    
                    <View style={styles.detailGrid}>
                        <View style={styles.detailItem}>
                            <Text style={styles.detailIcon}>📅</Text>
                            <View>
                                <Text style={styles.detailLabel}>Deadline</Text>
                                <Text style={styles.detailValue}>{scholarship.deadline}</Text>
                            </View>
                        </View>
                        
                        <View style={styles.detailItem}>
                            <Text style={styles.detailIcon}>🎁</Text>
                            <View>
                                <Text style={styles.detailLabel}>Prize</Text>
                                <Text style={styles.prizeValue}>{scholarship.prize}</Text>
                            </View>
                        </View>
                    </View>

                    <Text style={styles.description}>{scholarship.description}</Text>

                    <View style={styles.requirementsBox}>
                        <Text style={styles.requirementTitle}>📋 Requirements</Text>
                        {scholarship.requirements.map((req, index) => (
                            <View key={index} style={styles.requirementRow}>
                                <Text style={styles.requirementBullet}>•</Text>
                                <Text style={styles.requirement}>{req}</Text>
                            </View>
                        ))}
                    </View>
                </View>
            )}
        </View>
    );
};

export default function Contests() {
    const [expandedIds, setExpandedIds] = useState({});
    const [contests, setContests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadContests();
    }, []);

    const loadContests = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await contestAPI.getContests();
            
            // Parse requirements from JSON string to array
            const parsedContests = response.contests.map(contest => ({
                ...contest,
                requirements: typeof contest.requirements === 'string' 
                    ? JSON.parse(contest.requirements) 
                    : contest.requirements
            }));
            
            setContests(parsedContests);
        } catch (err) {
            console.error('Error loading contests:', err);
            setError(err.message || 'Failed to load contests');
        } finally {
            setLoading(false);
        }
    };

    const toggleExpand = (id) => {
        setExpandedIds(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerText}>Contests & Scholarships</Text>
                <Text style={styles.headerSubtext}>Discover opportunities to showcase your environmental passion</Text>
            </View>

            {/* Content with Cards */}
            {loading ? (
                <View style={styles.centerContainer}>
                    <ActivityIndicator size="large" color={colors.primary} />
                    <Text style={styles.loadingText}>Loading contests...</Text>
                </View>
            ) : error ? (
                <View style={styles.centerContainer}>
                    <Text style={styles.errorText}>Failed to load contests</Text>
                    <TouchableOpacity style={styles.retryButton} onPress={loadContests}>
                        <Text style={styles.retryButtonText}>Retry</Text>
                    </TouchableOpacity>
                </View>
            ) : contests.length === 0 ? (
                <View style={styles.centerContainer}>
                    <Text style={styles.emptyText}>No contests available</Text>
                </View>
            ) : (
                <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                    {contests.map((contest) => (
                        <AccordionCard
                            key={contest.id}
                            scholarship={contest}
                            isExpanded={expandedIds[contest.id] || false}
                            onToggle={() => toggleExpand(contest.id)}
                        />
                    ))}
                    <View style={styles.bottomPadding} />
                </ScrollView>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        paddingTop: 40,
        paddingBottom: 25,
        paddingHorizontal: 20,
        backgroundColor: colors.primaryDark,
    },
    headerText: {
        fontSize: 26,
        fontWeight: 'bold',
        color: colors.textOnDark,
        marginBottom: 6,
    },
    headerSubtext: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.8)',
    },
    scrollView: {
        flex: 1,
        padding: 15,
    },
    bottomPadding: {
        height: 20,
    },
    card: {
        backgroundColor: colors.surface,
        borderRadius: 16,
        marginBottom: 15,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: colors.border,
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
    },
    cardHeaderContent: {
        flex: 1,
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    iconBadge: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: colors.accentLight,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    iconEmoji: {
        fontSize: 22,
    },
    titleContent: {
        flex: 1,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.primaryDark,
        marginBottom: 4,
        lineHeight: 22,
    },
    organization: {
        fontSize: 13,
        color: colors.textSecondary,
    },
    tagsRow: {
        flexDirection: 'row',
        marginLeft: 56,
        gap: 8,
    },
    tag: {
        backgroundColor: colors.primaryMuted,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    tagText: {
        fontSize: 12,
        color: colors.primaryDark,
        fontWeight: '500',
    },
    arrow: {
        fontSize: 14,
        color: colors.primary,
        marginLeft: 10,
    },
    cardBody: {
        padding: 16,
        paddingTop: 0,
    },
    divider: {
        height: 1,
        backgroundColor: colors.border,
        marginBottom: 16,
    },
    detailGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    detailItem: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    detailIcon: {
        fontSize: 20,
        marginRight: 10,
    },
    detailLabel: {
        fontSize: 12,
        color: colors.textMuted,
        marginBottom: 2,
    },
    detailValue: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.text,
    },
    prizeValue: {
        fontSize: 14,
        fontWeight: 'bold',
        color: colors.primary,
    },
    description: {
        fontSize: 14,
        color: colors.textSecondary,
        lineHeight: 22,
        marginBottom: 16,
    },
    requirementsBox: {
        backgroundColor: colors.backgroundDark,
        borderRadius: 12,
        padding: 14,
    },
    requirementTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: colors.primaryDark,
        marginBottom: 10,
    },
    requirementRow: {
        flexDirection: 'row',
        marginBottom: 6,
    },
    requirementBullet: {
        fontSize: 14,
        color: colors.primary,
        marginRight: 8,
        fontWeight: 'bold',
    },
    requirement: {
        fontSize: 13,
        color: colors.textSecondary,
        flex: 1,
        lineHeight: 20,
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    loadingText: {
        marginTop: 10,
        fontSize: 14,
        color: colors.textSecondary,
    },
    errorText: {
        fontSize: 16,
        color: colors.error,
        marginBottom: 16,
        textAlign: 'center',
    },
    emptyText: {
        fontSize: 16,
        color: colors.textSecondary,
        textAlign: 'center',
    },
    retryButton: {
        backgroundColor: colors.primary,
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
    },
    retryButtonText: {
        color: colors.textOnPrimary,
        fontSize: 16,
        fontWeight: '600',
    },
})