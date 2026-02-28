import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState } from 'react'; // Added useState
import {
    Alert,
    Keyboard,
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

const CommentsModal = ({ 
    visible, 
    onClose, 
    task, 
    commentText, 
    setCommentText, 
    onAdd, 
    onDelete, 
    onEdit, 
    theme, 
    isDarkMode 
}) => {
  // New state to track if we are editing an existing comment
  const [editingId, setEditingId] = useState(null);

  const handlePressSend = () => {
    if (editingId) {
      // If we have an ID, we are updating
      onEdit(editingId, commentText);
      setEditingId(null); // Reset after edit
    } else {
      // If no ID, we are adding new
      onAdd();
    }
    setCommentText('');
    Keyboard.dismiss();
  };

  const handleEditPress = (commentId, currentText) => {
    const cleanText = currentText.includes(': ') 
      ? currentText.split(': ').slice(1).join(': ') 
      : currentText;

    if (Platform.OS === 'ios') {
      Alert.prompt(
        "Edit Comment",
        "Update your message:",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Save", onPress: (newText) => onEdit(commentId, newText) }
        ],
        "plain-text",
        cleanText
      );
    } else {
      // Android: Set the text AND the ID we want to edit
      setCommentText(cleanText);
      setEditingId(commentId); 
    }
  };

  const handleCloseInternal = () => {
    setEditingId(null);
    setCommentText('');
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true} statusBarTranslucent>
      <View style={styles.overlay}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
          style={styles.keyboardView}
        >
          <View style={[styles.content, { backgroundColor: isDarkMode ? '#1A1A1A' : '#FFFFFF' }]}>
            
            <View style={styles.handleContainer}>
              <View style={[styles.handle, { backgroundColor: isDarkMode ? '#333' : '#DDD' }]} />
            </View>

            <View style={styles.header}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.title, { color: theme.text }]}>Comments</Text>
                <Text style={[styles.subtitle, { color: theme.subText }]} numberOfLines={1}>
                  {task?.title || 'Task Discussion'}
                </Text>
              </View>
              <TouchableOpacity 
                onPress={handleCloseInternal} 
                style={[styles.closeBtn, { backgroundColor: isDarkMode ? '#252525' : '#F5F5F5' }]}
              >
                <MaterialCommunityIcons name="close" size={20} color={theme.text} />
              </TouchableOpacity>
            </View>

            {/* SCROLLABLE SECTION */}
            <ScrollView 
              style={styles.commentList} 
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={true} // Enabled scroll indicator
              keyboardShouldPersistTaps="handled"
            >
              {task?.comments && task.comments.length > 0 ? (
                task.comments.map((c) => {
                  const cId = c._id?.$oid || c._id;
                  const isBeingEdited = editingId === cId;
                  
                  return (
                    <View key={cId} style={[
                      styles.bubble, 
                      { backgroundColor: isDarkMode ? '#252525' : '#F8FAFC' },
                      isBeingEdited && { borderColor: '#2a9d7a', borderWidth: 1 } // Visual cue for editing
                    ]}>
                      <View style={styles.commentContent}>
                         <Text style={[styles.commentText, { color: theme.text }]}>{c.text}</Text>
                      </View>
                      
                      <View style={styles.actionRow}>
                        <TouchableOpacity onPress={() => handleEditPress(cId, c.text)} style={styles.iconBtn}>
                          <MaterialCommunityIcons name="pencil-outline" size={18} color={isBeingEdited ? '#2a9d7a' : theme.subText} />
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => onDelete(cId)} style={styles.iconBtn}>
                          <MaterialCommunityIcons name="delete-outline" size={18} color={theme.danger} />
                        </TouchableOpacity>
                      </View>
                    </View>
                  );
                })
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
                    borderColor: editingId ? '#2a9d7a' : (isDarkMode ? '#333' : '#E2E8F0')
                  }
                ]}
                placeholder={editingId ? "Edit your message..." : "Write a message..."}
                value={commentText}
                onChangeText={setCommentText}
                placeholderTextColor={isDarkMode ? '#555' : '#94A3B8'}
                multiline
              />
              <TouchableOpacity 
                style={[styles.sendBtn, { backgroundColor: editingId ? '#2196F3' : '#2a9d7a' }]} 
                onPress={handlePressSend}
                disabled={!commentText.trim()}
              >
                <MaterialCommunityIcons 
                  name={editingId ? "check" : "send"} 
                  size={22} 
                  color="#fff" 
                />
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'flex-end' },
  keyboardView: { width: '100%', height: '100%', justifyContent: 'flex-end' },
  content: { borderTopLeftRadius: 32, borderTopRightRadius: 32, height: '85%', paddingBottom: Platform.OS === 'ios' ? 40 : 10 },
  handleContainer: { alignItems: 'center', paddingVertical: 12 },
  handle: { width: 40, height: 5, borderRadius: 2.5 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 28, marginBottom: 15 },
  title: { fontSize: 24, fontWeight: '800' },
  subtitle: { fontSize: 13, marginTop: 2 },
  closeBtn: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  commentList: { flex: 1 }, // This allows the list to grow and scroll
  scrollContent: { paddingHorizontal: 28, paddingTop: 10, paddingBottom: 100 }, // Extra padding for the bottom
  bubble: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 20, marginBottom: 12 },
  commentContent: { flex: 1 },
  commentText: { fontSize: 15, lineHeight: 22 },
  actionRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  iconBtn: { padding: 4 },
  emptyState: { alignItems: 'center', justifyContent: 'center', marginTop: 60 },
  emptyText: { marginTop: 10, fontSize: 16 },
  inputRow: { flexDirection: 'row', alignItems: 'flex-end', paddingHorizontal: 20, paddingVertical: 15, borderTopWidth: 1 },
  input: { flex: 1, borderRadius: 20, paddingHorizontal: 18, paddingTop: 12, paddingBottom: 12, marginRight: 12, fontSize: 15, maxHeight: 100, borderWidth: 1 },
  sendBtn: { width: 52, height: 52, borderRadius: 26, justifyContent: 'center', alignItems: 'center', elevation: 5 }
});

export default CommentsModal;