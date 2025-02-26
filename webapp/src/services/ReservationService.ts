import { IReservation } from '../types/reservation';

const ReservationService = () => {
    const baseUrl: string = 'http://localhost:8080/api';

    const addReservation = async (reservation: IReservation, token: string): Promise<boolean> => {
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
    const getAllReservations = async (token: string) => {
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

    const getReservationsByPlant = async (plant_id: number, token: string): Promise<IReservation[]> => {
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

    const deleteReservation = async (reservationId: number, token: string): Promise<boolean> => {
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

    const updateReservation = async (reservationId: number, updatedReservation: IReservation, token: string): Promise<boolean> => {
        try {
            const response = await fetch(`${baseUrl}/reservations/${reservationId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    owner_user_id: updatedReservation.owner_user_id,
                    gardener_user_id: updatedReservation.gardener_user_id,
                    plante_id: updatedReservation.plante_id,
                    start_date: updatedReservation.start_date,
                    end_date: updatedReservation.end_date,
                }),
            });

            return response.ok;
        } catch (err) {
            console.error(err);
            return false;
        }
    };

    return { addReservation, getReservationsByPlant, deleteReservation, updateReservation, getAllReservations };
};

export default ReservationService;
