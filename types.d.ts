export type Theme = {
    mainColor: string;
};

export type UserData = {
    coins: number;
};

export type UserCache = {
    userId: string;
    data: UserData | null;
    lastCommandCall: number;
};
