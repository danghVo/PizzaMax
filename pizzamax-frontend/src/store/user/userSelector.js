export const apiStatus = (state) => state.user.api;

export const user = (state) => (state.user.name ? state.user : null);
export const favorites = (state) => state.user.favorites;
