import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler'; // Import Swipeable
import { getPriorityStyle } from '../constants/theme';

const TaskItem = ({ item, theme, isDarkMode, onToggle, onEdit, onComment, onDelete }) => {
    const pStyle = getPriorityStyle(item.priority, isDarkMode, theme);

    // This function renders the "Delete" button that stays behind the card
    const renderRightActions = (progress, dragX) => {
        const scale = dragX.interpolate({
            inputRange: [-80, 0],
            outputRange: [1, 0],
            extrapolate: 'clamp',
        });

        return (
            <TouchableOpacity 
                onPress={() => onDelete(item._id?.$oid || item._id)} 
                activeOpacity={0.6}
            >
                <View style={[styles.deleteAction, { backgroundColor: theme.danger }]}>
                    <Animated.View style={{ transform: [{ scale }] }}>
                        <MaterialCommunityIcons name="trash-can-outline" size={28} color="#fff" />
                        <Text style={styles.deleteText}>Delete</Text>
                    </Animated.View>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <Swipeable 
            renderRightActions={renderRightActions}
            friction={2}
            rightThreshold={40}
        >
            <View style={[styles.taskCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
                {/* CHECKBOX */}
                <TouchableOpacity onPress={() => onToggle(item)} style={styles.checkIcon}>
                    <MaterialCommunityIcons
                        name={item.completed ? "checkbox-marked-circle" : "checkbox-blank-circle-outline"}
                        size={28}
                        color={item.completed ? theme.accent : theme.subText}
                    />
                </TouchableOpacity>

                {/* TASK CONTENT */}
                <TouchableOpacity style={{ flex: 1 }} onPress={() => onEdit(item)}>
                    <Text style={[styles.taskTitle, { color: theme.text }, item.completed && styles.doneText]}>
                        {item.title}
                    </Text>
                    <View style={[styles.priorityTag, { backgroundColor: pStyle.bg }]}>
                        <Text style={[styles.priorityTagText, { color: pStyle.color }]}>{item.priority}</Text>
                    </View>
                </TouchableOpacity>

                {/* COMMENT BUTTON (Removed delete from here as it's now a swipe) */}
                <View style={styles.actionRow}>
                    <TouchableOpacity onPress={() => onComment(item)} style={styles.commentBtn}>
                        <MaterialCommunityIcons name="comment-text-outline" size={22} color={theme.subText} />
                    </TouchableOpacity>
                </View>
            </View>
        </Swipeable>
    );
};

const styles = StyleSheet.create({
    taskCard: {   flexDirection: 'row',   alignItems: 'center',    padding: 18,   borderRadius: 22,   marginBottom: 14,   borderWidth: 1,},
    checkIcon: { marginRight: 15 },
    taskTitle: { fontSize: 17, fontWeight: '600', marginBottom: 5 },
    doneText: { textDecorationLine: 'line-through', opacity: 0.4 },
    priorityTag: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 3, borderRadius: 8 },
    priorityTagText: { fontSize: 10, fontWeight: '800', textTransform: 'uppercase' },
    actionRow: { flexDirection: 'row', alignItems: 'center' },
    commentBtn: { padding: 5 },
    
    // SWIPE ACTIONS STYLES
    deleteAction: { justifyContent: 'center', alignItems: 'center', width: 80,  height: '87%', borderRadius: 22, marginBottom: 14,  marginLeft: 10, },
    deleteText: { color: '#fff',   fontSize: 12, fontWeight: '700',  marginTop: 4 }
});

export default TaskItem;