import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, FlatList, Image, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import CommentService from "../services/commentService";
import { IComment } from "@/types/comment";
import { useUserStore } from '@/stores/userStore';
import { Ionicons } from "@expo/vector-icons";

export default function ModalScreen() {
    const [comments, setComments] = useState<IComment[]>([]);
    const [newComment, setNewComment] = useState("");
    const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
    const [editedComment, setEditedComment] = useState<string>("");
    const token = useUserStore().user?.token;
    const plantId = 1;

    useEffect(() => {
        fetchComments();
    }, []);

    const fetchComments = async () => {
        const fetchedComments = await CommentService().getCommentsByPlant(plantId, token);
        setComments(fetchedComments);
    };

    const handleAddComment = async () => {
        if (newComment.trim() === "") return;

        const success = await CommentService().addComment(
            {
                comment: newComment,
                plant_id: plantId,
            },
            token
        );

        if (success) {
            setNewComment("");
            fetchComments();
        }
    };

    const handleDeleteComment = async (commentId: number) => {
        const success = await CommentService().deleteComment(commentId, token);
        if (success) {
            fetchComments();
        }
    };

    const handleEditComment = (commentId: number, currentComment: string) => {
        setEditingCommentId(commentId);
        setEditedComment(currentComment);
    };

    const handleUpdateComment = async () => {
        if (editedComment.trim() === "") return;

        const success = await CommentService().updateComment(editingCommentId!, { 
            comment: editedComment, 
            plant_id: plantId 
        }, token);

        if (success) {
            setEditingCommentId(null);
            setEditedComment("");
            fetchComments();
        }
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Titre de la Plante</Text>
            <Image 
                source={{ uri: "https://via.placeholder.com/600x400" }}
                style={styles.image} 
            />
            <Text style={styles.description}>Ceci est une description détaillée de la plante...</Text>
            
            <View style={styles.commentSection}>
                <Text style={styles.commentTitle}>Commentaires</Text>
                <FlatList
                    data={comments}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.commentContainer}>
                            {editingCommentId === item.id ? (
                                <View style={styles.editContainer}>
                                    <TextInput
                                        style={styles.input}
                                        value={editedComment}
                                        onChangeText={setEditedComment}
                                    />
                                    <Button title="Mettre à jour" onPress={handleUpdateComment} color="#007bff" />
                                </View>
                            ) : (
                                <>
                                    <Text style={styles.commentItem}>{item.comment}</Text>
                                    <TouchableOpacity onPress={() => handleEditComment(item.id, item.comment)}>
                                        <Ionicons name="pencil" size={20} color="#007bff" />
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => handleDeleteComment(item.id)}>
                                        <Ionicons name="trash" size={20} color="red" />
                                    </TouchableOpacity>
                                </>
                            )}
                        </View>
                    )}
                />
                <TextInput 
                    style={styles.input} 
                    value={newComment} 
                    onChangeText={setNewComment}
                    placeholder="Ajouter un commentaire..."
                />
                <Button title="Ajouter" onPress={handleAddComment} color="#007bff" />
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: "white",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 16,
        textAlign: "center",
    },
    image: {
        width: "100%",
        height: 200,
        borderRadius: 8,
        marginBottom: 16,
    },
    description: {
        fontSize: 16,
        color: "#666",
        textAlign: "center",
        marginBottom: 16,
    },
    commentSection: {
        width: "100%",
        paddingHorizontal: 16,
    },
    commentTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 8,
        textAlign: "center",
    },
    commentContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: "#ddd",
    },
    commentItem: {
        fontSize: 14,
        color: "#333",
        flex: 1,
    },
    input: {
        width: "100%",
        padding: 8,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: "#ddd",
        fontSize: 14,
        marginBottom: 8,
    },
    editContainer: {
        width: "100%",
        paddingVertical: 8,
    }
});
