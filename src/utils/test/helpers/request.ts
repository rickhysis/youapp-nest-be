import * as request from 'supertest';

export const mockUser = {
    "_id": "654d019928fc0bb61fea3276",
    "id": "654d019928fc0bb61fea3276",
    "username": "Karlie.Cormier7",
    "email": "Ken32@yahoo.com",
    "password": "$2b$10$k1obZHiIorSM9ixvcUsuMO16MOeTlIYqtudJNc5zUfGAv0uCMx7aW",
    "hashdRt": "$2b$10$hKT/YWxVT48W4b5p8p/Tqu6.Za5YPF8JpGtGyCqdqxGJJj0uxtTSW",
};

export const authenticatedRequest = (app, token: string) => {
    const agent = request.agent(app);
    return {
        get: (url) => agent.get(url).set('Authorization', `Bearer ${token}`),
        post: (url) => agent.post(url).set('Authorization', `Bearer ${token}`),
        put: (url) => agent.put(url).set('Authorization', `Bearer ${token}`),
        del: (url) => agent.del(url).set('Authorization', `Bearer ${token}`),
    };
};