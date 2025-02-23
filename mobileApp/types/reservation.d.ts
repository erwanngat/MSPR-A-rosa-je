export type IReservation = {
    id: number;
    owner_user_id: number;
    gardener_user_id: number;
    plante_id: number;
    start_date: Date;
    end_date?: Date;
  };
  