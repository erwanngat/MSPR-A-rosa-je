import { IComment } from '../types/comment';

const CommentService = () => {
    const baseUrl: string = 'http://localhost:8000/api';

    const addComment = async (comment: IComment, token: string): Promise<boolean> => {
        try {
            const response = await fetch(`${baseUrl}/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({comment: comment.comment, plante_id: comment.plant_id}),
            });

            return response.ok;
        } catch (err) {
            console.error(err);
            return false;
        }
    };

    const getCommentsByPlant = async (plant_id: number, token: string): Promise<IComment[]> => {
        try {
            const response = await fetch(`${baseUrl}/plantes/${plant_id}/comments`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });
            
            if (!response.ok) throw new Error('Failed to fetch comments');
            
            return await response.json();
        } catch (err) {
            console.error(err);
            return [];
        }
    };

    const deleteComment = async (commentId: number, token: string): Promise<boolean> => {
        try {
            const response = await fetch(`${baseUrl}/comments/${commentId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            return response.ok;
        } catch (err) {
            console.error(err);
            return false;
        }
    };

    const updateComment = async (commentId: number, updatedComment: IComment, token: string): Promise<boolean> => {
        try {
            const response = await fetch(`${baseUrl}/comments/${commentId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({comment: updatedComment.comment, plante_id: updatedComment.plant_id}),
            });

            return response.ok;
        } catch (err) {
            console.error(err);
            return false;
        }
    };

    return { addComment, getCommentsByPlant, deleteComment, updateComment };
};

export default CommentService;
