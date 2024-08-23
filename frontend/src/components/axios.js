import axios from 'axios';
import { baseUrl } from '../constants/Constants';

const movieInstance = axios.create({
    baseURL : baseUrl
})

export default movieInstance;