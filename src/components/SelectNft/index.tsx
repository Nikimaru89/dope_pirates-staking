import React, { useReducer, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { setStartAmount } from '../../store/actions/missionAction';
import './index.css';

function SelectNft(props: any) {
  const { title, trait, amount, src, actionName, index } = props;
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false) 
 
  const handleAmount = async(dispatch:any) => {
    setLoading(true)
    try {
      await setStartAmount(amount,dispatch)
    }
    catch(error){
      console.log('error', error)
    }
    setLoading(false)
  }

  return (
    <div>
      {
        loading ?
        <div id="preloader"> </div> :
        <div id="preloader" style={{display: 'none'}}></div>
      }
      <div className="select_nft">
        <div className='title'>
          {title}
        </div>
        <div className='subtitle'>
          {trait}
        </div>
        <div className="form">
          <img src={src} alt="nft"/>
        </div>
        <div className="action" onClick={() => handleAmount(dispatch)}>
           <Link to={`${index}/nft-fields`}>{actionName}</Link>
        </div>  
      </div>
    </div>
  )
}

export default SelectNft