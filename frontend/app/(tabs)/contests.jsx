import { View, Text} from 'react-native'
import React from 'react'

export default function Contests() {
    
   return (
     <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Contests/Scholarships</Text>
      </View>

      {/* Toggle Buttons */}
      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[styles.toggleButton, selected === 'Contests' && styles.activeButton]}
          onPress={() => setSelected('Contests')}
        >
          <Text style={[styles.toggleText, selected === 'Contests' && styles.activeText]}>
            Contests
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.toggleButton, selected === 'Scholarships' && styles.activeButton]}
          onPress={() => setSelected('Scholarships')}
        >
          <Text style={[styles.toggleText, selected === 'Scholarships' && styles.activeText]}>
            Scholarships
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content Area */}
      <View style={styles.contentBox}>
        <Text style={styles.sectionTitle}>Contests/Scholarships (Toggle)</Text>
        <Text style={styles.infoLabel}>Information:</Text>
      </View>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <Ionicons name="home-outline" size={26} />
        <FontAwesome5 name="book" size={24} />
        <MaterialIcons name="local-drink" size={26} />
        <Entypo name="map" size={26} />
        <FontAwesome5 name="medal" size={24} />
      </View>
    </View>
   ) 
}