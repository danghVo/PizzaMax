export const apiStatus = (state) => state.user.api;

export const user = (state) => (state.user.phoneNumber ? state.user : null);
export const isFavorite = (id) => (state) => {
    return state.user.favorites.find((productId) => productId === id);
};
export const userList = (state) => state.user.userListShow;
export const isLogin = (state) => state.user.uuid;
