import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { TrackerMap } from '../../components/Map';
import colors from '../../constants/colors';
import { getMarkerColor } from '../../components/Map/markerColors';

export default function Map() {
  const [selectedTracker, setSelectedTracker] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleTrackerSelect = (tracker) => {
    setSelectedTracker(tracker);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedTracker(null);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Tracker Map</Text>
        <Text style={styles.subtitle}>Tap markers to view details</Text>
      </View>

      {/* Map Container */}
      <View style={styles.mapContainer}>
        <TrackerMap onTrackerSelect={handleTrackerSelect} />
      </View>

      {/* Legend */}
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: getMarkerColor('recycle') }]} />
          <Text style={styles.legendText}>Recycle</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: getMarkerColor('compost') }]} />
          <Text style={styles.legendText}>Compost</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: getMarkerColor('waste') }]} />
          <Text style={styles.legendText}>Waste</Text>
        </View>
      </View>

      {/* Tracker Detail Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedTracker && (
              <>
                <View style={styles.modalHeader}>
                  <View 
                    style={[
                      styles.modalTypeIndicator, 
                      { backgroundColor: getMarkerColor(selectedTracker.type) }
                    ]} 
                  />
                  <Text style={styles.modalTitle}>{selectedTracker.name}</Text>
                </View>
                
                <ScrollView style={styles.modalBody}>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Type</Text>
                    <Text style={[
                      styles.detailValue,
                      { color: getMarkerColor(selectedTracker.type) }
                    ]}>
                      {selectedTracker.type}
                    </Text>
                  </View>
                  
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Coordinates</Text>
                    <Text style={styles.detailValue}>
                      {selectedTracker.latitude.toFixed(6)}, {selectedTracker.longitude.toFixed(6)}
                    </Text>
                  </View>
                </ScrollView>

                <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingTop: 40,
    paddingHorizontal: 20,
    paddingBottom: 15,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.primaryDark,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textMuted,
    marginTop: 4,
  },
  mapContainer: {
    flex: 1,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: 20,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendText: {
    fontSize: 12,
    color: colors.textSecondary,
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
    padding: 20,
    maxHeight: '50%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 12,
  },
  modalTypeIndicator: {
    width: 8,
    height: 40,
    borderRadius: 4,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.text,
    flex: 1,
  },
  modalBody: {
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  detailLabel: {
    fontSize: 14,
    color: colors.textMuted,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    textTransform: 'capitalize',
  },
  closeButton: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  closeButtonText: {
    color: colors.textOnPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
});
