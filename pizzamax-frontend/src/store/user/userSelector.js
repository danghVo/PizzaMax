export const apiStatus = (state) => state.user.api;

export const user = (state) => !!state.user.name && state.user;
