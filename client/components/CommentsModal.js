import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import {
    Keyboard,
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from 'react-native';

const CommentsModal = ({ visible, onClose, task, commentText, setCommentText, onAdd, onDelete, theme, isDarkMode }) => {
  
  // Helper to handle add and dismiss keyboard
  const handleAdd = () => {
    onAdd();
    Keyboard.dismiss();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true} statusBarTranslucent>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <KeyboardAvoidingView 
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
              style={styles.keyboardView}
            >
              <View style={[styles.content, { backgroundColor: isDarkMode ? '#1A1A1A' : '#FFFFFF' }]}>
                
                {/* GRAB HANDLE - Visual cue for bottom sheets */}
                <View style={styles.handleContainer}>
                  <View style={[styles.handle, { backgroundColor: isDarkMode ? '#333' : '#DDD' }]} />
                </View>

                {/* HEADER */}
                <View style={styles.header}>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.title, { color: theme.text }]}>Comments</Text>
                    <Text style={[styles.subtitle, { color: theme.subText }]} numberOfLines={1}>
                      {task?.title || 'Task Discussion'}
                    </Text>
                  </View>
                  <TouchableOpacity 
                    onPress={onClose} 
                    style={[styles.closeBtn, { backgroundColor: isDarkMode ? '#252525' : '#F5F5F5' }]}
                  >
                    <MaterialCommunityIcons name="close" size={20} color={theme.text} />
                  </TouchableOpacity>
                </View>

                {/* COMMENTS LIST */}
                <ScrollView 
                  style={styles.commentList} 
                  contentContainerStyle={styles.scrollContent}
                  showsVerticalScrollIndicator={false}
                >
                  {task?.comments && task.comments.length > 0 ? (
                    task.comments.map((c) => (
                      <View key={c._id} style={[styles.bubble, { backgroundColor: isDarkMode ? '#252525' : '#F8FAFC' }]}>
                        <View style={styles.commentContent}>
                           <Text style={[styles.commentText, { color: theme.text }]}>{c.text}</Text>
                        </View>
                        <TouchableOpacity 
                          onPress={() => onDelete(c._id)}
                          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                        >
                          <MaterialCommunityIcons name="delete-outline" size={20} color={theme.danger} style={styles.deleteIcon} />
                        </TouchableOpacity>
                      </View>
                    ))
                  ) : (
                    <View style={styles.emptyState}>
                      <MaterialCommunityIcons name="message-outline" size={48} color={isDarkMode ? '#333' : '#EEE'} />
                      <Text style={[styles.emptyText, { color: theme.subText }]}>No comments yet</Text>
                    </View>
                  )}
                </ScrollView>

                {/* INPUT AREA */}
                <View style={[styles.inputRow, { borderTopColor: isDarkMode ? '#222' : '#EEE' }]}>
                  <TextInput
                    style={[
                      styles.input, 
                      { 
                        backgroundColor: isDarkMode ? '#0A0A0A' : '#F1F5F9', 
                        color: theme.text,
                        borderColor: isDarkMode ? '#333' : '#E2E8F0'
                      }
                    ]}
                    placeholder="Write a message..."
                    value={commentText}
                    onChangeText={setCommentText}
                    placeholderTextColor={isDarkMode ? '#555' : '#94A3B8'}
                    multiline
                  />
                  <TouchableOpacity 
                    style={[styles.sendBtn, { opacity: commentText.trim() ? 1 : 0.6 }]} 
                    onPress={handleAdd}
                    disabled={!commentText.trim()}
                  >
                    <MaterialCommunityIcons name="send" size={22} color="#fff" />
                  </TouchableOpacity>
                </View>
              </View>
            </KeyboardAvoidingView>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
 overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'flex-end' },
keyboardView: { width: '100%' },
content: { borderTopLeftRadius: 32, borderTopRightRadius: 32, height: '80%', paddingBottom: Platform.OS === 'ios' ? 40 : 20 },
handleContainer: { alignItems: 'center', paddingVertical: 12 },
handle: { width: 40, height: 5, borderRadius: 2.5 },
header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 28, marginBottom: 15 },
title: { fontSize: 24, fontWeight: '800', letterSpacing: -0.5 },
subtitle: { fontSize: 13, marginTop: 2, fontWeight: '500' },
closeBtn: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
commentList: { flex: 1 },
scrollContent: { paddingHorizontal: 28, paddingTop: 10, paddingBottom: 20 },
bubble: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 20, marginBottom: 12, borderWidth: 1, borderColor: 'transparent' },
commentContent: { flex: 1 },
commentText: { fontSize: 15, lineHeight: 22 },
deleteIcon: { marginLeft: 12, opacity: 0.8 },
emptyState: { alignItems: 'center', justifyContent: 'center', marginTop: 60 },
emptyText: { marginTop: 10, fontSize: 16, fontWeight: '500' },
inputRow: { flexDirection: 'row', alignItems: 'flex-end', paddingHorizontal: 20, paddingTop: 15, borderTopWidth: 1 },
input: { flex: 1, borderRadius: 20, paddingHorizontal: 18, paddingTop: 12, paddingBottom: 12, marginRight: 12, fontSize: 15, maxHeight: 100, borderWidth: 1 },
sendBtn: { backgroundColor: '#2a9d7a', width: 52, height: 52, borderRadius: 26, justifyContent: 'center', alignItems: 'center', shadowColor: '#2a9d7a', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 5, elevation: 5 }
});

export default CommentsModal;