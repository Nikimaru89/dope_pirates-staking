
import { useAnchorWallet } from '@solana/wallet-adapter-react';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { useToasts } from 'react-toast-notifications';
import  { RootState }   from '../../store/reducers/rootReducer';
import { adminStartAPI, getMissionAPI } from '../../utils/api';
import CONFIG from '../../../src/config';
import { adminStartMission } from '../../store/actions/missionAction';
import './index.css';

const { ADMIN } = CONFIG;

function Mission(props: any) {
  const { mission: {missionImage, _id, missionName, status }, index, maskId, handleImageMask } = props;
  const dispatch = useDispatch();
  const wallet = useAnchorWallet();
  const {addToast} = useToasts();
  const state = useSelector((st:RootState) => st);
  let check = maskId.includes(index);
  const [missionStatus , setMissionStatus] = useState('');
  const [loading, setLoading] = useState(false)
  const wallets = wallet?.publicKey.toString();

  useEffect(() => {
    ( async () => {
      state.missions.missionData.map((item:any) => {
        if(item._id === _id) setMissionStatus(item.status)
      })
    }) ()
  }, [wallet])

  const handleStartMission = async(dispatch:any) => {
    setLoading(true)
    try {
      if(missionStatus === "created") {
        const res:any = await adminStartAPI(_id);
        if(res.data) {
      await adminStartMission(res.data, dispatch)
        }
        addToast('Admin starting mission success!', {
          appearance: 'success',
          autoDismiss: true
        })
      }
    }
    catch(error) {
      addToast('Admin starting mission failed!', {
        appearance: 'error',
        autoDismiss: true
      })
    }
    setLoading(false)
  }

  return (
    <div className="mission">
      {
        loading ?
        <div id="preloader"> </div> :
        <div id="preloader" style={{display: 'none'}}></div>
      }
      <div className='title'>{missionName}</div>
      <div className="bg-image" onClick={() => handleImageMask(index)}>
        <img src={missionImage} alt="nft" className='w-100'/>
        <div className={check ? 'overlay' : 'over'}>
          <div className='text'>Selected</div>
        </div>
      </div>
      <div className="form_group">
        <div className='btn_fill'>
          {missionStatus === "started" ?
          <Link to={`${_id}/borrow-nfts`}>Fill</Link>
          : <div className="btn_deactive">Fill</div>}
        </div>
        <div className='btn_revive'>
          {missionStatus === "started" ?
          <Link to={`${_id}/borrow-nfts`}>Revive</Link>
          : <div className="btn_deactive">Revive</div>}
        </div>
        <div className='btn_start' style={{width:'100%'}} onClick={() =>handleStartMission(dispatch)}>
        {(ADMIN === wallets && missionStatus === "started") || (ADMIN === wallets && missionStatus === "created") || (ADMIN !== wallets &&  missionStatus === "started") ?
          <Link to={`${_id}/add-nfts`}>Start</Link>     
        : <div className="btn_deactive">Start</div>}    
        </div>
      </div>
    </div>
  )
}

export default Mission