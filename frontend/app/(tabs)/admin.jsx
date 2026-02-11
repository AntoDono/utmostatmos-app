import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Alert,
    Modal,
    ActivityIndicator
} from 'react-native';
import { quizAPI, contestAPI, trackerAPI } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import colors from '../../constants/colors';

const AdminSection = ({ title, children, isExpanded, onToggle }) => {
    return (
        <View style={styles.section}>
            <TouchableOpacity
                style={styles.sectionHeader}
                onPress={onToggle}
                activeOpacity={0.7}
            >
                <Text style={styles.sectionTitle}>{title}</Text>
                <Text style={styles.expandIcon}>{isExpanded ? '▼' : '▶'}</Text>
            </TouchableOpacity>
            {isExpanded && (
                <View style={styles.sectionContent}>
                    {children}
                </View>
            )}
        </View>
    );
};

const ItemCard = ({ item, onDelete, onEdit, itemType }) => {
    const getItemDisplay = () => {
        if (itemType === 'quiz') {
            return `${item.item} → ${item.answer}`;
        } else if (itemType === 'contest') {
            return `${item.title} (${item.organization})`;
        } else if (itemType === 'tracker') {
            return `${item.name} (${item.type})`;
        }
        return item.id;
    };

    return (
        <View style={styles.itemCard}>
            <View style={styles.itemCardContent}>
                <Text style={styles.itemCardText} numberOfLines={2}>
                    {getItemDisplay()}
                </Text>
            </View>
            <View style={styles.itemCardActions}>
                <TouchableOpacity
                    style={[styles.actionButton, styles.editButton]}
                    onPress={() => onEdit(item)}
                >
                    <Text style={styles.actionButtonText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.actionButton, styles.deleteButton]}
                    onPress={() => onDelete(item.id)}
                >
                    <Text style={styles.actionButtonText}>Delete</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const AddItemModal = ({ visible, onClose, onSubmit, itemType, editingItem = null }) => {
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (editingItem) {
            if (itemType === 'quiz') {
                setFormData({
                    item: editingItem.item || '',
                    answer: editingItem.answer || '',
                    choices: editingItem.choices ? editingItem.choices.join(', ') : '',
                });
            } else if (itemType === 'contest') {
                setFormData({
                    title: editingItem.title || '',
                    organization: editingItem.organization || '',
                    scope: editingItem.scope || '',
                    grade: editingItem.grade || '',
                    deadline: editingItem.deadline || '',
                    prize: editingItem.prize || '',
                    description: editingItem.description || '',
                    requirements: editingItem.requirements ? editingItem.requirements.join('\n') : '',
                });
            } else if (itemType === 'tracker') {
                setFormData({
                    name: editingItem.name || '',
                    type: editingItem.type || '',
                    longitude: editingItem.longitude?.toString() || '',
                    latitude: editingItem.latitude?.toString() || '',
                });
            }
        } else {
            if (itemType === 'quiz') {
                setFormData({ item: '', answer: '', choices: '' });
            } else if (itemType === 'contest') {
                setFormData({
                    title: '', organization: '', scope: '', grade: '',
                    deadline: '', prize: '', description: '', requirements: ''
                });
            } else if (itemType === 'tracker') {
                setFormData({ name: '', type: '', longitude: '', latitude: '' });
            }
        }
    }, [visible, editingItem, itemType]);

    const handleSubmit = async () => {
        setLoading(true);
        try {
            let processedData = { ...formData };

            if (itemType === 'quiz') {
                processedData.choices = formData.choices.split(',').map(c => c.trim()).filter(c => c);
                if (!processedData.item || !processedData.answer || processedData.choices.length === 0) {
                    Alert.alert('Error', 'Please fill in all fields');
                    setLoading(false);
                    return;
                }
            } else if (itemType === 'contest') {
                processedData.requirements = formData.requirements.split('\n').map(r => r.trim()).filter(r => r);
                if (!processedData.title || !processedData.organization || !processedData.scope ||
                    !processedData.grade || !processedData.deadline || !processedData.prize || !processedData.description) {
                    Alert.alert('Error', 'Please fill in all required fields');
                    setLoading(false);
                    return;
                }
            } else if (itemType === 'tracker') {
                processedData.longitude = parseFloat(formData.longitude);
                processedData.latitude = parseFloat(formData.latitude);
                if (!processedData.name || !processedData.type ||
                    isNaN(processedData.longitude) || isNaN(processedData.latitude)) {
                    Alert.alert('Error', 'Please fill in all fields with valid values');
                    setLoading(false);
                    return;
                }
            }

            await onSubmit(processedData, editingItem?.id);
            onClose();
        } catch (error) {
            Alert.alert('Error', error.message || 'Failed to save item');
        } finally {
            setLoading(false);
        }
    };

    const renderFormFields = () => {
        if (itemType === 'quiz') {
            return (
                <>
                    <Text style={styles.label}>Item *</Text>
                    <TextInput
                        style={styles.input}
                        value={formData.item}
                        onChangeText={(text) => setFormData({ ...formData, item: text })}
                        placeholder="e.g., banana"
                    />
                    <Text style={styles.label}>Choices (comma-separated) *</Text>
                    <TextInput
                        style={styles.input}
                        value={formData.choices}
                        onChangeText={(text) => setFormData({ ...formData, choices: text })}
                        placeholder="e.g., Compost, Recycling, Trash, Donate"
                    />
                    <Text style={styles.label}>Correct Answer *</Text>
                    <TextInput
                        style={styles.input}
                        value={formData.answer}
                        onChangeText={(text) => setFormData({ ...formData, answer: text })}
                        placeholder="e.g., Compost"
                    />
                </>
            );
        } else if (itemType === 'contest') {
            return (
                <>
                    <Text style={styles.label}>Title *</Text>
                    <TextInput
                        style={styles.input}
                        value={formData.title}
                        onChangeText={(text) => setFormData({ ...formData, title: text })}
                        placeholder="Contest title"
                    />
                    <Text style={styles.label}>Organization *</Text>
                    <TextInput
                        style={styles.input}
                        value={formData.organization}
                        onChangeText={(text) => setFormData({ ...formData, organization: text })}
                        placeholder="Organization name"
                    />
                    <Text style={styles.label}>Scope *</Text>
                    <TextInput
                        style={styles.input}
                        value={formData.scope}
                        onChangeText={(text) => setFormData({ ...formData, scope: text })}
                        placeholder="e.g., National, Regional"
                    />
                    <Text style={styles.label}>Grade *</Text>
                    <TextInput
                        style={styles.input}
                        value={formData.grade}
                        onChangeText={(text) => setFormData({ ...formData, grade: text })}
                        placeholder="e.g., 9-12"
                    />
                    <Text style={styles.label}>Deadline *</Text>
                    <TextInput
                        style={styles.input}
                        value={formData.deadline}
                        onChangeText={(text) => setFormData({ ...formData, deadline: text })}
                        placeholder="e.g., March 15, 2026"
                    />
                    <Text style={styles.label}>Prize *</Text>
                    <TextInput
                        style={styles.input}
                        value={formData.prize}
                        onChangeText={(text) => setFormData({ ...formData, prize: text })}
                        placeholder="e.g., $5,000 scholarship"
                    />
                    <Text style={styles.label}>Description *</Text>
                    <TextInput
                        style={[styles.input, styles.textArea]}
                        value={formData.description}
                        onChangeText={(text) => setFormData({ ...formData, description: text })}
                        placeholder="Contest description"
                        multiline
                        numberOfLines={4}
                    />
                    <Text style={styles.label}>Requirements (one per line)</Text>
                    <TextInput
                        style={[styles.input, styles.textArea]}
                        value={formData.requirements}
                        onChangeText={(text) => setFormData({ ...formData, requirements: text })}
                        placeholder="Requirement 1&#10;Requirement 2"
                        multiline
                        numberOfLines={4}
                    />
                </>
            );
        } else if (itemType === 'tracker') {
            return (
                <>
                    <Text style={styles.label}>Name *</Text>
                    <TextInput
                        style={styles.input}
                        value={formData.name}
                        onChangeText={(text) => setFormData({ ...formData, name: text })}
                        placeholder="Tracker name"
                    />
                    <Text style={styles.label}>Type *</Text>
                    <TextInput
                        style={styles.input}
                        value={formData.type}
                        onChangeText={(text) => setFormData({ ...formData, type: text })}
                        placeholder="e.g., recycle, compost, waste"
                    />
                    <Text style={styles.label}>Longitude *</Text>
                    <TextInput
                        style={styles.input}
                        value={formData.longitude}
                        onChangeText={(text) => setFormData({ ...formData, longitude: text })}
                        placeholder="e.g., -122.4194"
                        keyboardType="numeric"
                    />
                    <Text style={styles.label}>Latitude *</Text>
                    <TextInput
                        style={styles.input}
                        value={formData.latitude}
                        onChangeText={(text) => setFormData({ ...formData, latitude: text })}
                        placeholder="e.g., 37.7749"
                        keyboardType="numeric"
                    />
                </>
            );
        }
        return null;
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>
                            {editingItem ? `Edit ${itemType}` : `Add New ${itemType}`}
                        </Text>
                        <TouchableOpacity onPress={onClose}>
                            <Text style={styles.closeButton}>✕</Text>
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.modalBody}>
                        {renderFormFields()}
                    </ScrollView>

                    <View style={styles.modalFooter}>
                        <TouchableOpacity
                            style={[styles.modalButton, styles.cancelButton]}
                            onPress={onClose}
                            disabled={loading}
                        >
                            <Text style={styles.modalButtonText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.modalButton, styles.submitButton]}
                            onPress={handleSubmit}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color={colors.textOnPrimary} />
                            ) : (
                                <Text style={styles.modalButtonText}>
                                    {editingItem ? 'Update' : 'Create'}
                                </Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default function Admin() {
    const { isAuthenticated, getAccessToken } = useAuth();
    const [loading, setLoading] = useState(true);
    const [expandedSections, setExpandedSections] = useState({
        quiz: true,
        contest: false,
        tracker: false,
    });

    // Data states
    const [quizzes, setQuizzes] = useState([]);
    const [contests, setContests] = useState([]);
    const [trackers, setTrackers] = useState([]);

    // Modal states
    const [modalVisible, setModalVisible] = useState(false);
    const [modalType, setModalType] = useState(null);
    const [editingItem, setEditingItem] = useState(null);

    useEffect(() => {
        loadAllData();
    }, [isAuthenticated]);

    const loadAllData = async () => {
        try {
            setLoading(true);
            let token = null;
            if (isAuthenticated) {
                try {
                    token = await getAccessToken();
                } catch (error) {
                    console.error('Error getting access token:', error);
                }
            }

            const [quizzesRes, contestsRes, trackersRes] = await Promise.all([
                token ? quizAPI.getAllQuizzes(token).catch(() => ({ quizzes: [] })) : quizAPI.getQuizzes(100).catch(() => ({ quizzes: [] })),
                contestAPI.getContests().catch(() => ({ contests: [] })),
                trackerAPI.getTrackers().catch(() => ({ trackers: [] })),
            ]);

            setQuizzes(quizzesRes.quizzes || []);
            setContests(contestsRes.contests || []);
            setTrackers(trackersRes.trackers || []);
        } catch (error) {
            console.error('Error loading data:', error);
            Alert.alert('Error', 'Failed to load data');
        } finally {
            setLoading(false);
        }
    };

    const handleAddItem = (type) => {
        setModalType(type);
        setEditingItem(null);
        setModalVisible(true);
    };

    const handleEditItem = (item, type) => {
        setModalType(type);
        setEditingItem(item);
        setModalVisible(true);
    };

    const handleDeleteItem = async (id, type) => {
        if (!isAuthenticated && type === 'quiz') {
            Alert.alert('Authentication Required', 'Please login to delete quizzes');
            return;
        }

        Alert.alert(
            'Confirm Delete',
            'Are you sure you want to delete this item?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            if (type === 'quiz') {
                                const token = await getAccessToken();
                                await quizAPI.deleteQuiz(token, id);
                            } else if (type === 'contest') {
                                await contestAPI.deleteContest(id);
                            } else if (type === 'tracker') {
                                await trackerAPI.deleteTracker(id);
                            }
                            await loadAllData();
                            Alert.alert('Success', 'Item deleted successfully');
                        } catch (error) {
                            Alert.alert('Error', error.message || 'Failed to delete item');
                        }
                    },
                },
            ]
        );
    };

    const handleSubmitItem = async (data, id) => {
        try {
            if (modalType === 'quiz') {
                if (!isAuthenticated) {
                    Alert.alert('Authentication Required', 'Please login to edit quizzes');
                    return;
                }
                const token = await getAccessToken();
                if (id) {
                    await quizAPI.updateQuiz(token, id, data);
                } else {
                    await quizAPI.createQuiz(token, data);
                }
            } else if (modalType === 'contest') {
                if (id) {
                    await contestAPI.updateContest(id, data);
                } else {
                    await contestAPI.createContest(data);
                }
            } else if (modalType === 'tracker') {
                if (id) {
                    await trackerAPI.updateTracker(id, data);
                } else {
                    await trackerAPI.createTracker(data.type, data.name, data.longitude, data.latitude);
                }
            }

            await loadAllData();
            Alert.alert('Success', `Item ${id ? 'updated' : 'created'} successfully`);
            setModalVisible(false);
        } catch (error) {
            throw error;
        }
    };

    const toggleSection = (section) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section],
        }));
    };

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={styles.loadingText}>Loading...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Admin Dashboard</Text>
                <Text style={styles.headerSubtitle}>Manage quizzes, contests, and trackers</Text>
            </View>

            <ScrollView style={styles.content}>
                {/* Quiz Section */}
                <AdminSection
                    title={`Quizzes (${quizzes.length})`}
                    isExpanded={expandedSections.quiz}
                    onToggle={() => toggleSection('quiz')}
                >
                    <TouchableOpacity
                        style={styles.addButton}
                        onPress={() => handleAddItem('quiz')}
                    >
                        <Text style={styles.addButtonText}>+ Add Quiz</Text>
                    </TouchableOpacity>
                    {quizzes.map((quiz) => (
                        <ItemCard
                            key={quiz.id}
                            item={quiz}
                            itemType="quiz"
                            onDelete={(id) => handleDeleteItem(id, 'quiz')}
                            onEdit={(item) => handleEditItem(item, 'quiz')}
                        />
                    ))}
                </AdminSection>

                {/* Contest Section */}
                <AdminSection
                    title={`Contests (${contests.length})`}
                    isExpanded={expandedSections.contest}
                    onToggle={() => toggleSection('contest')}
                >
                    <TouchableOpacity
                        style={styles.addButton}
                        onPress={() => handleAddItem('contest')}
                    >
                        <Text style={styles.addButtonText}>+ Add Contest</Text>
                    </TouchableOpacity>
                    {contests.map((contest) => (
                        <ItemCard
                            key={contest.id}
                            item={contest}
                            itemType="contest"
                            onDelete={(id) => handleDeleteItem(id, 'contest')}
                            onEdit={(item) => handleEditItem(item, 'contest')}
                        />
                    ))}
                </AdminSection>

                {/* Tracker Section */}
                <AdminSection
                    title={`Trackers (${trackers.length})`}
                    isExpanded={expandedSections.tracker}
                    onToggle={() => toggleSection('tracker')}
                >
                    <TouchableOpacity
                        style={styles.addButton}
                        onPress={() => handleAddItem('tracker')}
                    >
                        <Text style={styles.addButtonText}>+ Add Tracker</Text>
                    </TouchableOpacity>
                    {trackers.map((tracker) => (
                        <ItemCard
                            key={tracker.id}
                            item={tracker}
                            itemType="tracker"
                            onDelete={(id) => handleDeleteItem(id, 'tracker')}
                            onEdit={(item) => handleEditItem(item, 'tracker')}
                        />
                    ))}
                </AdminSection>
            </ScrollView>

            <AddItemModal
                visible={modalVisible}
                onClose={() => {
                    setModalVisible(false);
                    setEditingItem(null);
                }}
                onSubmit={handleSubmitItem}
                itemType={modalType}
                editingItem={editingItem}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.background,
        padding: 20,
    },
    loadingText: {
        marginTop: 10,
        color: colors.textSecondary,
    },
    header: {
        paddingTop: 40,
        paddingBottom: 20,
        paddingHorizontal: 20,
        backgroundColor: colors.primaryDark,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: colors.textOnDark,
        marginBottom: 4,
    },
    headerSubtitle: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.8)',
    },
    content: {
        flex: 1,
        padding: 15,
    },
    section: {
        backgroundColor: colors.surface,
        borderRadius: 12,
        marginBottom: 15,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: colors.border,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        backgroundColor: colors.primaryMuted,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.primaryDark,
    },
    expandIcon: {
        fontSize: 14,
        color: colors.primary,
    },
    sectionContent: {
        padding: 16,
    },
    infoText: {
        fontSize: 12,
        color: colors.textMuted,
        fontStyle: 'italic',
        marginBottom: 12,
    },
    addButton: {
        backgroundColor: colors.primary,
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        marginBottom: 12,
        alignItems: 'center',
    },
    addButtonText: {
        color: colors.textOnPrimary,
        fontSize: 16,
        fontWeight: '600',
    },
    itemCard: {
        backgroundColor: colors.backgroundDark,
        borderRadius: 8,
        padding: 12,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: colors.border,
    },
    itemCardContent: {
        marginBottom: 10,
    },
    itemCardText: {
        fontSize: 14,
        color: colors.text,
        fontWeight: '500',
    },
    itemCardActions: {
        flexDirection: 'row',
        gap: 8,
        alignItems: 'center',
    },
    actionButton: {
        flex: 1,
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 6,
        alignItems: 'center',
    },
    editButton: {
        backgroundColor: colors.info,
    },
    deleteButton: {
        backgroundColor: colors.error,
    },
    actionButtonText: {
        color: colors.textOnPrimary,
        fontSize: 12,
        fontWeight: '600',
    },
    readOnlyText: {
        fontSize: 11,
        color: colors.textMuted,
        fontStyle: 'italic',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: colors.overlay,
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: colors.surface,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        maxHeight: '90%',
        padding: 20,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        paddingBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.text,
    },
    closeButton: {
        fontSize: 24,
        color: colors.textSecondary,
    },
    modalBody: {
        maxHeight: 400,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.text,
        marginBottom: 6,
        marginTop: 12,
    },
    input: {
        backgroundColor: colors.inputBackground,
        borderWidth: 1,
        borderColor: colors.inputBorder,
        borderRadius: 8,
        padding: 12,
        fontSize: 14,
        color: colors.text,
    },
    textArea: {
        minHeight: 80,
        textAlignVertical: 'top',
    },
    modalFooter: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 20,
        paddingTop: 15,
        borderTopWidth: 1,
        borderTopColor: colors.border,
    },
    modalButton: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: colors.textMuted,
    },
    submitButton: {
        backgroundColor: colors.primary,
    },
    modalButtonText: {
        color: colors.textOnPrimary,
        fontSize: 16,
        fontWeight: '600',
    },
});

