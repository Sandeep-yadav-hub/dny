import axios from 'axios';
import authHeader from './auth-header';
const API_URL = 'http://localhost:8080/api/chat/';

class ChatService {
    getChatUsers() {
      return axios.get(API_URL+"users",{ headers: authHeader() });
      // return axios.get("http://localhost:8080/api/hr/getUsers?limit=&offset=",{ headers: authHeader() })
    }
    getChatList(parent) {
      return axios.post(API_URL+"chatList",{parent},{ headers: authHeader() });
    }
    getChatBetween(parent,sentTo) {
      return axios.post(API_URL+"chatList",{parent,sentTo},{ headers: authHeader() });
    }
}
export default new ChatService();