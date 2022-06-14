import React, { useState, useEffect, useReducer } from 'react';
import { useAnchorWallet, useConnection } from '@solana/wallet-adapter-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useDispatch, useSelector } from 'react-redux';
import 'swiper/swiper.min.css'
import SelectNft from '../../../../../components/SelectNft';
import MissionImg from '../../../../../assets/frontend/mission.png';
import { getMissionAPI, getCollectionAPI } from '../../../../../utils/api';
import { RootState } from '../../../../../store/reducers/rootReducer';
import SelectNftImage from '../../../../../assets/frontend/select_nft.png';
import { useToasts } from 'react-toast-notifications';
import './index.css';
import { initFillMission, setFillMission } from '../../../../../store/actions/missionAction';


function AddNfts() {
  const navigate = useNavigate();
  const dispatch =useDispatch();
  const {addToast} = useToasts();
  const location = useLocation();
  const wallet = useAnchorWallet();
  const state = useSelector((st:RootState) => st);
  const [startCollection, setStartCollection] = useState([]);
  const [field, setField] = useState();
  const [loading, setLoading] = useState(false)
  const str = location.pathname.split('/')
  const url = str[2];

  useEffect(() => {
    (async () => {
      try{
        if(wallet) {
          setLoading(true)
          let k:any = [];
          const res:any = await getMissionAPI();
          const response:any = await getCollectionAPI();
          initFillMission(dispatch)
          res.data.map((item:any) => {
            if(item._id === url) {
              item.nftGroups.forEach((it:any) =>{
                let name = response.data.find((e:any) => e._id === it.collectionId)
                if(name === null) { 
                  setLoading(false)
                  addToast('No collections!', {
                    appearance: 'warning',
                    autoDismiss: true
                  })
                }
                k.push({collectionName:name?.collectionName, trait:it.trait, amount:it.amount})
              })
            }
          })
          setFillMission(k, dispatch)
          setLoading(false)
        }
      }
      catch(error){
        console.log('error',error)
      }
    }) ()
  },[wallet])

  return (
    <div className='add_nfts'>
      {
        loading ?
        <div id="preloader"> </div> :
        <div id="preloader" style={{display: 'none'}}></div>
      }
      <div className='collections'>
            <div className='collection_container'>
              <div className='form-group'>
              <Swiper
                spaceBetween={50}
                slidesPerView={4}
              >
                {
                  state.missions.fillMission.map((item: any, index:number) => 
                  <SwiperSlide key={index}>
                    <SelectNft  title={item.collectionName} trait={item.trait} src={SelectNftImage} actionName={'Borrow'} index={index}/>
                  </SwiperSlide>
                  )
                } 
              </Swiper>
              </div>
            </div>
            <div className='button back' onClick={() => navigate(-1)}>
              Back
            </div>
      </div>
    </div>
  )
}

export default AddNfts;