export interface IAddress {
  id?: number; // Optionnel, car il est généré par le backend lors de la création
  country: string; // <= 100 caractères
  city: string; // <= 100 caractères
  zip_code: string; // <= 100 caractères
  street: string; // <= 100 caractères
  additional_address_details?: string; // Optionnel
}