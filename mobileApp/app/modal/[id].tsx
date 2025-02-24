import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, FlatList, Image, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import CommentService from "../../services/commentService";
import { IComment } from "@/types/comment";
import { useUserStore } from '@/stores/userStore';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from "@expo/vector-icons";
import { Link } from 'expo-router';
import { useRouter } from 'expo-router';

export default function ModalScreen() {
    const { id } = useLocalSearchParams();
    const [comments, setComments] = useState<IComment[]>([]);
    const [newComment, setNewComment] = useState("");
    const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
    const [editedComment, setEditedComment] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const user = useUserStore().user;
    const token = user?.token;
    const userRole = user?.role;
    const router = useRouter();

    const goToProfile = () => {
        router.push(`/profile/${id}`);
    }

    useEffect(() => {
        if (id) {
            fetchComments(Number(id));
        }
    }, [id]);

    const fetchComments = async (plantId: number) => {
        setLoading(true);
        try {
            const fetchedComments = await CommentService().getCommentsByPlant(plantId, token);
            setComments(fetchedComments);
        } catch (error) {
            console.error("Erreur lors de la récupération des commentaires", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddComment = async () => {
        if (newComment.trim() === "") return;

        setLoading(true);
        try {
            const success = await CommentService().addComment(
                 //@ts-ignore
                {
                    comment: newComment,
                    plant_id: Number(id),
                },
                token
            );

            if (success) {
                setNewComment("");
                fetchComments(Number(id));
            }
        } catch (error) {
            console.error("Erreur lors de l'ajout du commentaire", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteComment = async (commentId: number) => {
        setLoading(true);
        try {
            const success = await CommentService().deleteComment(commentId, token);
            if (success) {
                fetchComments(Number(id)); // Rafraîchir les commentaires
            }
        } catch (error) {
            console.error("Erreur lors de la suppression du commentaire", error);
        } finally {
            setLoading(false);
        }
    };

    const handleEditComment = (commentId: number, currentComment: string) => {
        setEditingCommentId(commentId);
        setEditedComment(currentComment);
    };

    const handleUpdateComment = async () => {
        if (editedComment.trim() === "") return;

        setLoading(true);
        try {
            const success = await CommentService().updateComment(editingCommentId!, {
                comment: editedComment,
                plant_id: Number(id),
            }, token);

            if (success) {
                setEditingCommentId(null);
                setEditedComment("");
                fetchComments(Number(id));
            }
        } catch (error) {
            console.error("Erreur lors de la mise à jour du commentaire", error);
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <ScrollView style={styles.container}>
            {/* Image du profil avec clic pour accéder au profil */}
            <TouchableOpacity onPress={goToProfile}>
                <Image
                    source={{ uri: user?.avatarUrl || "https://via.placeholder.com/100" }} // Image par défaut si aucune image
                    style={styles.profileImage}
                />
            </TouchableOpacity>

            <Text style={styles.title}>Titre de la Plante</Text>
            <Image
                source={{ uri: "https://via.placeholder.com/600x400" }}
                style={styles.image}
            />
            <Text style={styles.description}>Ceci est une description détaillée de la plante...</Text>

            <View style={styles.commentSection}>
                <Text style={styles.commentTitle}>Commentaires</Text>
                {loading ? (
                    <Text>Chargement...</Text> // Message de chargement
                ) : (
                    <FlatList
                        data={comments}
                        keyExtractor={(item) => item.id.toString()}
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
                                        {userRole == "botaniste" ? (
                                            <TouchableOpacity onPress={() => handleDeleteComment(item.id)}>
                                                <Ionicons name="trash" size={20} color="red" />
                                            </TouchableOpacity>
                                        ) : null}
                                        {item.user_id == user?.id ? (
                                            <TouchableOpacity onPress={() => handleEditComment(item.id, item.comment)}>
                                                <Ionicons name="pencil" size={20} color="#007bff" />
                                            </TouchableOpacity>
                                        ) : null}
                                    </>
                                )}
                            </View>
                        )}
                    />
                )}
                {userRole == "botaniste" ? (
                    <>
                        <TextInput
                            style={styles.input}
                            value={newComment}
                            onChangeText={setNewComment}
                            placeholder="Ajouter un commentaire..."
                        />
                        <Button title="Ajouter" onPress={handleAddComment} color="#007bff" />
                    </>
                ) : null}
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
    profileImageContainer: {
        alignItems: "center",
        marginBottom: 16,
    },
    profileImage: {
        width: 60,
        height: 60,
        borderRadius: 30,
        borderWidth: 2,
        borderColor: "#ddd",
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
    },
});
