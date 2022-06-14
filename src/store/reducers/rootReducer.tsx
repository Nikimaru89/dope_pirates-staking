import { combineReducers } from 'redux';
//eslint-disable-next-line
import missionReducer from './missionReducer';

const appReducer = combineReducers({
	missions: missionReducer,
	//eslint-disable-next-line
});

export type RootState = ReturnType<typeof appReducer>
export default appReducer;