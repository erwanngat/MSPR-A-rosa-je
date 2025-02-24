import { IUser } from '../types/user';


const UserService = () => {
    const baseUrl: string = 'http://localhost:8080/api';

    const register = async (user: IUser, password_confirmation: string): Promise<boolean> => {
        try {
            const response = await fetch(`${baseUrl}/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: user.name,
                    email: user.email,
                    phone_number: user.phone,
                    password: user.password,
                    password_confirmation: password_confirmation,
                }),
            });

            const data = await response.json();
            console.log(data);
            if (response.ok) {
                return true;
            } else {
                return false;
            }
        } catch (err) {
            console.error(err);
            return false;
        }
    };

    const login = async (email: string, password: string) => {

        const response = await fetch(`${baseUrl}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();
        console.log("data: "  + data)
        return data;
    }

    const getUser = async (token: string, id: number) => {
        const response = await fetch(`${baseUrl}/users/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });
        const data = await response.json();
        return data;
    }

    const updateUser = async (userData: IUser, token: string, password: string, password_confirmation: string) => {

        const response = await fetch(`${baseUrl}/users/${userData.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
                name: userData.name,
                email: userData.email,
                password: password,
                phone_number: userData.phone,
            }),
        });

    }

    return { register, login, getUser, updateUser };
};

export default UserService;
