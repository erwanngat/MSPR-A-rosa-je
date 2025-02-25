import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, FlatList, Image, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import CommentService from "../../services/commentService";
import { IComment } from "@/types/comment";
import { useUserStore } from '@/stores/userStore';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from 'expo-router';
import plantesService from '@/services/plantesService';
import UserService from '@/services/userService';

export default function ModalScreen() {
    const user = useUserStore((state) => state.user);
    const token = user?.token;
    const { id } = useLocalSearchParams();  // Déplacer cela en premier
    const [comments, setComments] = useState<IComment[]>([]);
    const [newComment, setNewComment] = useState("");
    const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
    const [editedComment, setEditedComment] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const userRole = user?.role;
    const router = useRouter();
    const [planteData, setPlanteData] = useState(null);  // Ajout de l'état pour planteData

    // Récupérer les informations de la plante à l'initialisation
    useEffect(() => {
        const fetchPlanteData = async () => {
            if (id && token) {
                const service = plantesService(token);
                try {
                    const data = await service.getPlantesById(Number(id));
                    setPlanteData(data);  // Stocker les données de la plante
                } catch (error) {
                    console.error("Erreur lors de la récupération des données de la plante", error);
                }
            }
        };

        fetchPlanteData();
    }, [id, token]);  // Se déclencher si l'id ou le token change

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
            //@ts-ignore
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
    
    const getImageUser = async (idUser: number) => {
        const userSelected = await UserService().getUser(user?.token, idUser);
        return userSelected.image;
    };

    const goToProfile = (idUser: number) => {
        router.push(`/profile/${idUser}`);
    };

    return (
        <ScrollView style={styles.container}>
            {/* Image du profil avec clic pour accéder au profil */}
            <TouchableOpacity onPress={() => goToProfile(planteData.user_id)}>
                <Image
                    source={{ uri: user?.image || "https://via.placeholder.com/100" }} // Image par défaut si aucune image
                    style={styles.profileImage}
                />
            </TouchableOpacity>

            <Text style={styles.title}>{planteData?.name || 'Titre de la Plante'}</Text>
            <Image
                source={{ uri: planteData?.image || "https://via.placeholder.com/600x400" }}
                style={styles.image}
            />
            <Text style={styles.description}>{planteData?.description || 'Ceci est une description détaillée de la plante...'}</Text>

            <View style={styles.commentSection}>
                <Text style={styles.commentTitle}>Commentaires</Text>
                {loading ? (
                    <Text style={styles.loadingText}>Chargement...</Text> // Message de chargement
                ) : (
                    <FlatList
                        data={comments}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => (
                            <View style={styles.commentContainer}>
                                <TouchableOpacity onPress={() => goToProfile(item.user_id)}>
                                <Image
                                    source={{ uri: getImageUser(item.user_id) || "https://via.placeholder.com/40" }} // Utilisez l'URL de l'image de profil de l'utilisateur
                                    style={styles.commentProfileImage}
                                />
                                </TouchableOpacity>
                                {editingCommentId === item.id ? (
                                    <View style={styles.editContainer}>
                                        <TextInput
                                            style={styles.input}
                                            value={editedComment}
                                            onChangeText={setEditedComment}
                                        />
                                        <Button title="Mettre à jour" onPress={handleUpdateComment} color="#A8D08D" />
                                    </View>
                                ) : (
                                    <>
                                        <Text style={styles.commentItem}>{item.comment}</Text>
                                        {item.user_id == user?.id ? (
                                            <TouchableOpacity onPress={() => handleDeleteComment(item.id)}>
                                                <Ionicons name="trash" size={20} color="#D9534F" />
                                            </TouchableOpacity>
                                        ) : null}
                                        {item.user_id == user?.id ? (
                                            <TouchableOpacity onPress={() => handleEditComment(item.id, item.comment)}>
                                                <Ionicons name="pencil" size={20} color="#A8D08D" />
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
                        <Button title="Ajouter" onPress={handleAddComment} color="#A8D08D" />
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
        backgroundColor: "#F3F6F4",
    },
    profileImage: {
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 2,
        borderColor: "#A8D08D",
        marginBottom: 16,
        alignSelf: "center", // Centrer l'image du profil
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 16,
        textAlign: "center",
        color: "#4C9C6F", // Vert forêt
    },
    imageContainer: {
        width: "100%", // Conteneur de l'image s'adapte à la largeur
        aspectRatio: 1, // Pour garder un ratio de 1:1 si l'image a un format carré
        marginBottom: 16, // Espace sous l'image
        borderRadius: 10, // Border radius pour arrondir les coins si besoin
        overflow: "hidden", // S'assurer que l'image ne dépasse pas du conteneur
    },
    image: {
        width: "100%", // L'image prendra toute la largeur du conteneur
        height: "100%", // L'image prendra toute la hauteur du conteneur
        resizeMode: "contain", // Assure que l'image garde son ratio sans être déformée
    }, commentProfileImage: {
        width: 40,  // Taille de l'image de profil
        height: 40,
        borderRadius: 20,  // Pour rendre l'image circulaire
        marginRight: 8,  // Espacement entre l'image et le texte
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
        color: "#4C9C6F",
    },
    commentContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: "#A8D08D",
        marginHorizontal: 8,  // Pour ne pas toucher les bords
    },
    commentItem: {
        fontSize: 14,
        color: "#333",
        flex: 1,
        marginRight: 8,
    },
    input: {
        width: "100%",
        padding: 8,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: "#A8D08D",
        fontSize: 14,
        marginBottom: 8,
        backgroundColor: "#fff",
    },
    editContainer: {
        width: "100%",
        paddingVertical: 8,
    },
    loadingText: {
        textAlign: "center",
        fontSize: 16,
        color: "#A8D08D",
    },
    iconContainer: {
        flexDirection: "row",
        justifyContent: "center", // Centrer les icônes
        alignItems: "center",
    },
});
