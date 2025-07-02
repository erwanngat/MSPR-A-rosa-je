const ReservationService = () => {
    const baseUrl = 'http://localhost:8080/api';

    const getToken = () => {
        return sessionStorage.getItem('token'); // Assurez-vous que le token est stocké ici après la connexion
      };

    const addReservation = async (reservation) => {
            const token = getToken();
            const response = await fetch(`${baseUrl}/reservations`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    gardener_user_id: reservation.gardener_user_id,
                    plante_id: reservation.plante_id,
                    start_date: reservation.start_date,
                    end_date: reservation.end_date,
                }),
            });
            return response.ok;

    };

    const getAllReservations = async () => {
            const token = getToken();
            const response = await fetch(`${baseUrl}/reservations`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });



            return await response.json();

    };

    const getReservationsByPlant = async (plant_id) => {
            const token = getToken();
            const response = await fetch(`${baseUrl}/plantes/${plant_id}/reservations`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });


            return await response.json();

    };

    const deleteReservation = async (reservationId) => {
        try {
            const token = getToken();
            const response = await fetch(`${baseUrl}/reservations/${reservationId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            return response.ok;
        } catch (err) {
            return false;
        }
    };

    const updateReservation = async (reservationId, updatedReservation) => {
        try {
            const token = getToken();
            const response = await fetch(`${baseUrl}/reservations/${reservationId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    //owner_user_id: updatedReservation.owner_user_id,
                    gardener_user_id: updatedReservation.gardener_user_id,
                    plante_id: updatedReservation.plante_id,
                    start_date: updatedReservation.start_date,
                    end_date: updatedReservation.end_date,
                }),
            });

            return response.ok;
        } catch (err) {
            return false;
        }
    };

    return { addReservation, getReservationsByPlant, deleteReservation, updateReservation, getAllReservations };
};

export default ReservationService;