import { createSelector } from '@reduxjs/toolkit';

export const vnpayUrl = (state) => state.system.vnpayUrl;
export const banner = (state) => state.system.banners;
export const formApiStatus = (state) => state.system.formApiStatus;

export const getResult = (state) => state.system.vnp_result;
export const inform = (state) => state.system.inform;
export const requireLogin = (state) => state.system.login;
export const orderInformMessage = (state) => state.system.orderInformMessage;
export const orderInform = (state) => state.system.orderInform;
