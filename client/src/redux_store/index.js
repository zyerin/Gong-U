import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userReducer from './userSlice';
import storage from 'redux-persist/lib/storage';
import{ FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE, persistReducer, persistStore } from 'redux-persist';

const rootReducer = combineReducers({
    user: userReducer,
    // post: postReducer
})
const persistConfig = {
    key: 'root',
    storage
}

// configureStore 함수는 Redux Toolkit에서 제공하는 함수이며 Redux store를 생성하기 위해 사용된다. 
// Redux 애플리케이션의 store는 state를 보유하고 state의 변화를 관리하는 저장소
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: getDefaultMiddleware => getDefaultMiddleware(
        {
            serializableCheck:{
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
            }
        }
    )
})

export const persistor = persistStore(store);
