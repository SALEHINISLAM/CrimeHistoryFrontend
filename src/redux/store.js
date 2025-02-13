import { configureStore } from "@reduxjs/toolkit";
import storage from 'redux-persist/lib/storage';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist'
import { baseApi } from "./api/baseApi";
import authReducer from './features/auth/AuthSlice';

const persistConfig={
    key:"auth",
    storage
}

const persistedAuthReducer=persistReducer(persistConfig,authReducer);

export const store=configureStore({
    reducer: {
        // Define your reducers here
        [baseApi.reducerPath]:baseApi.reducer,
        auth:persistedAuthReducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck:{
            ignoredActions:[FLUSH,REHYDRATE, PAUSE,PERSIST,PURGE,REGISTER]
        }
    }).concat(baseApi.middleware),
})


export const persistor=persistStore(store)