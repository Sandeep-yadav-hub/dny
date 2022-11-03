import axios from 'axios';
import authHeader from './auth-header';

const HR_API_URL = 'http://localhost:8080/api/hr/';


class GeneralService {
    getAttendace({id}){
        return axios.get(HR_API_URL+`attendance?id=${id}`,{ headers: authHeader() })
    }
}

export default new GeneralService();
