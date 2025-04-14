export interface IUser {
    username: string;
    email: string;
    _id: string;
    id: string;
    roles: string[];
    avatar?: {
        public_id: string,
        url: string,
    },
}