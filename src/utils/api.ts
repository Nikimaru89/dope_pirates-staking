import axios from 'axios';
import { func } from 'prop-types';

export function getMissionAPI () {
	const res = axios.get(`http://192.168.104.17:7000/api/mission`)
	return res;
}

export function deleteMissionAPI (payload:any) { 
	const res = axios.post(`http://192.168.104.17:7000/api/mission/delete`, 
		{
			missions: payload
		}
	)	
	return res;
}

export function createMissionAPI (payload:object) {
	const res = axios.post(`http://192.168.104.17:7000/api/mission`, 
			payload
	)
	return res;
}

export function createCollectionAPI (payload:object) {
	const res = axios.post(`http://192.168.104.17:7000/api/collection`, 
			payload
	)
	return res;
}

export function getCollectionAPI () {
	const res = axios.get(`http://192.168.104.17:7000/api/collection`)
	return res;
}

export function deleteCollectionAPI (id:string) {
	const res = axios.delete(`http://192.168.104.17:7000/api/collection/${id}`)
	return res;
}

export function boostMissionAPI (id:string, payload:object) {
	const res = axios.put(`http://192.168.104.17:7000/api/mission/${id}/boost`,
		payload
	)
	return res;
}

export function addRentMissionAPI (id:string, payload:object) {
	const res = axios.post(`http://192.168.104.17:7000/api/mission/${id}/rent`,
		payload
	)
	return res;
}

export function getRentMissionAPI (id:string) {
	const res = axios.get(`http://192.168.104.17:7000/api/mission/${id}/rent`)
	return res;
}

export function userSelectAPI (id:string, payload:object) {
	const res = axios.post(`http://192.168.104.17:7000/api/mission/${id}/user-select`,
		payload
	)
	return res;
}

export function adminStartAPI (id:string) {
	const res = axios.put(`http://192.168.104.17:7000/api/mission/${id}/start`)
	return res;
}

export function userStartAPI (id:string, payload:object) {
	const res = axios.put(`http://192.168.104.17:7000/api/mission/${id}/user-start`,
		payload
	)
	return res;
}

export function userBoostAPI (id:string, payload:object) {
	const res = axios.post(`http://192.168.104.17:7000/api/mission/${id}/user-boost`,
		payload
	)
	return res;
}

export function  rentTransactionAPI (id:string, payload:object) {
	const res = axios.post(`http://192.168.104.17:7000/api/mission/${id}/rent-tx`,
		payload
	)
	return res;
}