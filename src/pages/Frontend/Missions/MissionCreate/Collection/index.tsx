import React, {  useState, Fragment, useEffect } from 'react';
import InputLabel from '@mui/material/InputLabel';
import { InputBase, TextField } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { styled } from '@mui/system';
import Pirate from '../../../../../components/Pirate';
import { isTemplateMiddle } from 'typescript';
import './index.css';

const StyledForm = styled(FormControl)({
  '& .MuiInputLabel-root': {
    margin: '-5% 43%',
  },
  '& .MuiSelect-select': {
    backgroundColor: '#68FE65',
    borderRadius: '28px !important',
    width: '53%',
    margin: 'auto',
  },
  '& .MuiSvgIcon-root': {
    display: 'none',
  },
  '& .MuiOutlinedInput-notchedOutline': {
    display:'none',
  },
  '& .css-11u53oe-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input.css-11u53oe-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input.css-11u53oe-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input': {
    padding:'5px',
  },
  '& .MuiMenuItem-root': {
    fontFamily:'Priate',
  },
 });

function Collection(props: any) {
  const { 
    collectionData, 
    // collection,
    addNftGroups, 
    index, 
    handleOpen, 
    handleAmount,
    handleTrait,
    handleIsBurnTrue,
    handleIsBurnFalse,
    handleRent,
    handleShare,
    handleChange,
    list,
  } = props;

  const [collectionValue, setCollectionValue] = useState(list.collectionId);
 
   return (
    <div className="collection">
      <StyledForm fullWidth>
        <InputLabel>+</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={collectionValue}
            label="+"
            onChange={(e) => handleChange(e.target.value, index)}
            sx={{fontFamily:'Priate', color:'#2D2727'}}
            >
            {collectionData.map((item:any, idx:number) => 
              <MenuItem key={idx} value={item.id} sx={{ fontFamily:'Priate'}}>{item.collectionName}</MenuItem>
            )}
              <MenuItem sx={{ fontFamily:'Priate'}} onClick={() => handleOpen(index)}>New Collection</MenuItem>
          </Select>
      </StyledForm>
      
        { list.map((li: any, idx:number) => 
         <Fragment>
          <div className="form_group">
            <div className="item">
              <div className="label">
                Amount
              </div>
              <div className="sub_form">
                <input id="number" type="number" onChange={e => handleAmount(e.target.value, index, idx)} required/>
              </div>
            </div>
            <div className="item">
              <div className="label">
                Traits
              </div>
              <select name="cars" id="cars" onChange={e => handleTrait(e.target.value, index, idx)}>
                <option value=""></option>
                <option value="body-monkey">body-monkey</option>
                <option value="body:red">body:red</option>
                <option value="Occupation">Occupation</option>
                <option value="Occupation-Vice Admiral">Occupation-Vice Admiral</option>
              </select>
            </div>
            <div className="item">
              <div className="label">
                Burn
              </div>
              <div className="form burn">
                <div>
                  <span>Yes</span>  
                  <input id="radio" type="radio" name="burn" value="yes" onChange={() => handleIsBurnTrue(index, idx)}/>
                </div>
                <div>
                  <span>No</span>
                  <input id="radio" type="radio" name="burn" value="no" onChange={() => handleIsBurnFalse(index, idx)}/>
                </div>
              </div>
            </div>
            <div className="item">
              <div className="label">
                Rent
              </div>
              <div className='sub_form'>
                <input id="number" type="number" onChange={e => handleRent(e.target.value, index, idx)}/>
              </div>
            </div>
            <div className="item">
              <div className="label">
                Share
              </div>
              <div className='sub_form'>
                <input id="number" type="number" onChange={e => handleShare(e.target.value, index, idx)}/>
              </div>
            </div>
          </div>
          </Fragment>
        )}
        <div className="btn_add" onClick={() => addNftGroups(index)}> 
          +
        </div>
    </div>
  ) 
}

export default Collection;
