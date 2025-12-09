import { Text, View, StyleSheet } from "react-native";
import React from "react";
import colors from "./../../constants/colors";

export default function QuizReasoning() {
  return (
    <View style={styles.container}>

      {/* Title */}
      <View style={styles.headerContainer}>
        <Text style={styles.title}>School Supplies Game</Text>
        <Text style={styles.subtitle}>___ goes into the ___ bin!</Text>
      </View>

      {/* Reasoning box wrapper */}
      <View style={styles.reasoningWrapper}>
        <View style={styles.reasoningBox}>
          <Text style={styles.reasoningText}>Reasoning</Text>
          <Text style={styles.reasoningText}>Reasoning</Text>
        </View>
      </View>

      {/* Score */}
      <Text style={styles.score}>Score: x/5</Text>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.WHITE,
    paddingHorizontal: "10%",
    justifyContent: "center",
    alignItems: "center",
  },

  headerContainer: {
    marginBottom: 30,
    alignItems: "center",
  },

  title: {
    fontSize: 24,
    color: colors.DARKGREEN,
    fontFamily: "Montserrat-Bold",
    textAlign: "center",
    marginBottom: 10,
  },

  subtitle: {
    fontSize: 16,
    color: colors.DARKGREEN,
    fontFamily: "Montserrat-Regular",
    textAlign: "center",
  },

  reasoningWrapper: {
    width: "100%",
    height: 180,
    backgroundColor: colors.GREY,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 40,
    padding: 20,
  },

  reasoningBox: {
    width: "90%",
    height: 140,
    backgroundColor: colors.LIGHTGREEN,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
  },

  reasoningText: {
    color: colors.WHITE,
    fontFamily: "Montserrat-Bold",
    fontSize: 16,
    marginVertical: 4,
  },

  score: {
    fontFamily: "Montserrat-Bold",
    fontSize: 14,
    color: colors.DARKGREEN,
    marginTop: 10,
  },
});

/* import { Text, View, StyleSheet, Pressable } from "react-native";
import React from "react";
import colors from "./../../constants/colors";
import { useRouter } from "expo-router";

export default function Quiz() {
  const router = useRouter();

  return (
    <View style={styles.container}>

      
      <View style={styles.headerContainer}>
        <Text style={styles.title}>School Supplies Game</Text>
        <Text style={styles.subtitle}>Which bin does ______ go into?</Text>
      </View>

      
      <View style={styles.itemBox} />

      
      <View style={styles.optionsContainer}>
        <Pressable style={styles.optionBox} onPress={() => >
          <Text style={styles.optionLabel}>Waste</Text>
        </Pressable>

        <Pressable style={styles.optionBox} onPress={() => >
          <Text style={styles.optionLabel}>Recycle</Text>
        </Pressable>

        <Pressable style={styles.optionBox} onPress={() => >
          <Text style={styles.optionLabel}>Compost</Text>
        </Pressable>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.WHITE,
    paddingHorizontal: "10%",
    justifyContent: "flex-start",
    paddingTop: 40,
  },

  headerContainer: {
    marginBottom: 40,
  },

  title: {
    fontSize: 24,
    color: colors.DARKGREEN,
    fontFamily: "Montserrat-Bold",
    textAlign: "center",
    marginBottom: 6,
  },

  subtitle: {
    fontSize: 16,
    color: colors.DARKGREEN,
    fontFamily: "Montserrat-Regular",
    textAlign: "center",
  },

  itemBox: {
    width: "100%",
    height: 140,
    backgroundColor: colors.GREY,
    borderRadius: 15,
    marginBottom: 60,
  },

  optionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  optionBox: {
    width: 90,
    height: 120,
    backgroundColor: colors.GREY,
    borderRadius: 15,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: 10,
  },

  optionLabel: {
    fontFamily: "Montserrat-Bold",
    fontSize: 14,
    color: colors.DARKGREEN,
  },
});

*/
