
export const setCreateMission = async (payload:any, dispatch:any) => {
    await dispatch({ type: 'SET_CREATE_MISSION', payload });
};

export const initCreateMission = async (dispatch:any) => {
    await dispatch({type: 'INIT_CREATE_MISSION'});
};

export const deleteMission = async (payload:any, dispatch:any) => {
    await dispatch({type:'SET_DELETE_MISSION', payload});
};

export const boostMission = async (payload:object, dispatch:any) => {
   await dispatch({type: 'SET_BOOST_MISSION', payload});
};

export const initCollectionName = async (dispatch:any) => {
    await  dispatch({type:'SET_INIT_COLLECTION_NAME'});
};

export const setCollectionName = async (payload:any, dispatch:any) => {
    await dispatch({type:'SET_ADD_COLLECTION_NAME', payload});
};

export const initFillMission = async (dispatch:any) => {
    await  dispatch({type: 'INIT_FILL_MISSION'});
};

export const setFillMission = async (payload:any, dispatch:any) => {
    await dispatch({type :'FILL_MISSION_DATA', payload})
}

export const initUserBoost = async (dispatch:any) => {
    await dispatch({type:'INIT_USER_BOOST'});
};

export const setUserBoost = async (payload:any, dispatch:any) => {
    await dispatch({type:'USER_BOOST_NFTS', payload});
};

export const userSelectNft = async (payload:any, dispatch:any) => {
    await dispatch({type: 'USER_SELECT_NFT', payload})
}

export const initWalletNft = async (dispatch:any) => {
    await dispatch({type: 'INIT_WALLET_NFT'});
};

export const setWalletNft = async (payload:any, dispatch:any) => {
    await dispatch({type:'SET_WALLET_NFT', payload});
};

export const adminStartMission = async (payload:any, dispatch:any) => {
    await dispatch({type: 'ADMIN_START_MISSION', payload});
};

export const setStartAmount = async (payload:any, dispatch:any) => {
    await dispatch({type: 'SET_START_AMOUNT',payload});
};