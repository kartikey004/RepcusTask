import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  StatusBar,
  ScrollView,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import { useTaskViewModel } from "./TaskViewModel";
import { styles } from "./styles";

export default function App() {
  const {
    inputValue,
    setInputValue,
    parsedData,
    isSubmitting,
    successMsg,
    handleSubmit,
    suggestions,
    activeTrigger,
    applySuggestion,
    getTypeIcon,
  } = useTaskViewModel();

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
        <StatusBar barStyle="dark-content" />

        <View style={styles.header}>
          <View style={styles.headerRow}>
            <Ionicons name="terminal" size={20} color="#10B981" />
            <Text
              style={[
                styles.headerTitle,
                { letterSpacing: 1.5, marginLeft: 10 },
              ]}
            >
              #FIX JIRA
            </Text>
          </View>
          <Text style={styles.headerSubtitle}>
            Type <Text style={styles.bold}>#type !priority @name</Text>
          </Text>
        </View>

        <View style={styles.previewContainer}>
          <Text style={styles.label}>LIVE PREVIEW</Text>
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={[styles.iconBox, { backgroundColor: "#F3F4F6" }]}>
                <Ionicons
                  name={getTypeIcon(parsedData.type)}
                  size={22}
                  color="#0F172A"
                />
              </View>
              <Text
                style={[
                  styles.cardTitle,
                  !parsedData.title && styles.placeholderText,
                ]}
              >
                {parsedData.title || "Start typing..."}
              </Text>
            </View>

            <View style={styles.chipsRow}>
              <View
                style={[
                  styles.chip,
                  { backgroundColor: parsedData.priorityColor },
                ]}
              >
                <Text style={styles.chipText}>{parsedData.priority}</Text>
              </View>
              <View style={[styles.chip, { backgroundColor: "#E5E7EB" }]}>
                <Text style={styles.chipTextDark}>{parsedData.type}</Text>
              </View>
            </View>
          </View>
          {successMsg && (
            <View style={styles.toast}>
              <Ionicons name="cloud-upload-outline" size={20} color="#059669" />
              <Text style={styles.toastText} numberOfLines={1}>
                {successMsg}
              </Text>
            </View>
          )}
        </View>

        {suggestions.length > 0 && (
          <View style={styles.suggestionBar}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              keyboardShouldPersistTaps="always"
            >
              {suggestions.map((item) => (
                <TouchableOpacity
                  key={item.label}
                  style={styles.suggestionItem}
                  onPress={() => applySuggestion(item.label)}
                >
                  <Text style={[styles.suggestionText, { color: item.color }]}>
                    {activeTrigger}
                    {item.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Fix login #bug !high"
              value={inputValue}
              onChangeText={setInputValue}
              placeholderTextColor="#9CA3AF"
            />
            <TouchableOpacity onPress={handleSubmit} style={styles.sendBtn}>
              {isSubmitting ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Ionicons name="arrow-up" size={24} color="#fff" />
              )}
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
