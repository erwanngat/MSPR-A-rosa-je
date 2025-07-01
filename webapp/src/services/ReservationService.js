const ReservationService = () => {
    const baseUrl = 'http://localhost:8081/api';

    const getToken = () => {
        return sessionStorage.getItem('token'); // Assurez-vous que le token est stocké ici après la connexion
      };

    const addReservation = async (reservation, token) => {
        try {
            const response = await fetch(`${baseUrl}/reservations`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    //owner_user_id: reservation.owner_user_id,
                    gardener_user_id: reservation.gardener_user_id,
                    plante_id: reservation.plante_id,
                    start_date: reservation.start_date,
                    end_date: reservation.end_date,
                }),
            });
            return response.ok;
        } catch (err) {
            console.error(err);
            return false;
        }
    };

    const getAllReservations = async (token) => {
        try {
            const response = await fetch(`${baseUrl}/reservations`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) throw new Error('Failed to fetch reservations');

            return await response.json();
        } catch (error) {
            console.error('Erreur lors de la récupération des réservations:', error);
        }
    };

    const getReservationsByPlant = async (plant_id, token) => {
        try {
            const response = await fetch(`${baseUrl}/plantes/${plant_id}/reservations`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) throw new Error('Failed to fetch reservations');

            return await response.json();
        } catch (err) {
            console.error(err);
            return [];
        }
    };

    const deleteReservation = async (reservationId, token) => {
        try {
            const response = await fetch(`${baseUrl}/reservations/${reservationId}`, {
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

    const updateReservation = async (reservationId, updatedReservation) => {
        console.log("Update Reservation");
        console.log(updatedReservation);
        // console.log(updatedReservation.gardener_user_id);
        // console.log(updatedReservation.plante_id);
        // console.log(updatedReservation.start_date);
        // console.log(updatedReservation.end_date);
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
            console.log("aaaaaaa");
            console.log(response);
            console.log("Objet reservation en BDD");
            console.log(updatedReservation.gardener_user_id);
            console.log(updatedReservation.plante_id);
            console.log(updatedReservation.start_date);
            console.log(updatedReservation.end_date);

            return response.ok;
        } catch (err) {
            console.error(err);
            return false;
        }
    };

    return { addReservation, getReservationsByPlant, deleteReservation, updateReservation, getAllReservations };
};

export default ReservationService;