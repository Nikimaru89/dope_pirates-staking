export enum CreateActionKind {
	MISSION = 'SET_CREATE_MISSION',
	DELETE_MISSION = 'SET_DELETE_MISSION',
	ADD_COLLECTION_NAME = 'SET_ADD_COLLECTION_NAME',
	BOOST_MISSION = 'SET_BOOST_MISSION',
	START_AMOUNT = 'SET_START_AMOUNT',
	INIT_COLLECTION_NAME = 'SET_INIT_COLLECTION_NAME',
	INIT_CREATE_MISSION = 'INIT_CREATE_MISSION',
	SET_MISSION = 'FILL_MISSION_DATA',
	INIT_FILL_MISSION = 'INIT_FILL_MISSION',
	RENT = 'SET_FILL_RENT',
	INIT_RENT_NFT = 'INIT_RENT_NFT',
	USER_SELECT_NFT = 'USER_SELECT_NFT',
	USER_BOOST_NFT = 'USER_BOOST_NFTS',
	INIT_USER_BOOST = 'INIT_USER_BOOST',
	USER_START_MISSIOIN = 'USER_START_MISSION',
	ADMIN_START_MISSION = 'ADMIN_START_MISSION',
	SET_WALLET_NFT = 'SET_WALLET_NFT',
	INIT_WALLET_NFT = 'INIT_WALLET_NFT',
}

interface Action {
	type: CreateActionKind;
	payload:any;
}

interface stateType {
	missionData: any[],
	collectionData:any[],
	boostData:any[],
	startAmount:any,
	fillMission:any[],
	rentedNft: any[],
	selectedNft:any[],
	userBoostNft:any[],
	userStartMission:any[],
	adminStartMission:any[],
	walletNft:any[],
}

export const initialState: stateType = {
	missionData: [],
	collectionData: [],
	boostData: [],
	startAmount: {},
	fillMission:[],
	rentedNft: [],
	selectedNft:[],
	userBoostNft:[],
	userStartMission:[],
	adminStartMission:[],
	walletNft:[],
};

export default function missionReducer(state = initialState, action:Action ) {
	const {type, payload} = action;

		switch (action.type) {
			case 'SET_CREATE_MISSION': 
				return {
					...state,
					missionData: [...action.payload]
				}
			case 'SET_DELETE_MISSION': 
				let newMissionData = state.missionData;
				state.missionData.forEach((item:any, index:number) => {
					if(action.payload.includes(item._id))
					newMissionData = newMissionData.filter(e => e._id !== item._id )
				} )
				return {
					...state,
					missionData: newMissionData
				};
			case 'SET_ADD_COLLECTION_NAME':
				return {
					...state,
					collectionData: [...action.payload]
				};
			case 'SET_BOOST_MISSION':
				return {
					...state,
					boostData: [...state.boostData, action.payload]
				};
			case 'SET_START_AMOUNT':
				return {
					...state,
					startAmount: action.payload,
				};
			case 'SET_INIT_COLLECTION_NAME':
				return {
					...state,
					collectionData: []
				};
			case  'INIT_CREATE_MISSION':
				return {
					...state,
					missionData: []
				};
			case 'FILL_MISSION_DATA':
				return {
					...state,
					fillMission:[...action.payload]
				} 
			case 'INIT_FILL_MISSION':
				return {
					...state,
					fillMission:[]
				};
			case 'SET_FILL_RENT':
				return {
					...state,
					rentedNft: [...state.rentedNft, action.payload],
				};
			case 'INIT_RENT_NFT':
				return {
					...state,
					rentedNft: [],
				};
			case 'USER_SELECT_NFT':
				return {
					...state,
					selectedNft: [...state.selectedNft, action.payload]
				};
			case 'USER_BOOST_NFTS':
				return {
					...state,
					userBoostNft: [...action.payload]
				};
			case 'INIT_USER_BOOST':
				return {
					...state,
					userBoostNft: [],
				};
			case 'USER_START_MISSION':
				return {
					...state,
					userStartMission: [...state.userStartMission, action.payload]
				};
			case 'ADMIN_START_MISSION':
				return {
					...state,
					adminStartMission: [...state.adminStartMission, action.payload]
				};
			case 'SET_WALLET_NFT':
				return {
					...state,
					walletNft:[...state.walletNft, action.payload]
				}
			case 'INIT_WALLET_NFT':
				return {
					...state,
					walletNft: []
				}
			default: 
					return {...state};
		};
}