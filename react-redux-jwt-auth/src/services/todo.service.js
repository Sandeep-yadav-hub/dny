import axios from 'axios';
import authHeader from './auth-header';
const API_URL = 'http://localhost:8080/api/todo/';
class TodoService {
  getAllTasks() {
    return axios.get(API_URL + 'all');
  }
  getAllUsersTasks() {
    return axios.get(API_URL , { headers: authHeader() });
  }
  createTodoTask(task,status,dueDate) {
    return axios.post(API_URL + 'create',{task,status,dueDate}, { headers: authHeader() });
  }
  updateTodoTask(id,status,dueDate) {
    return axios.post(API_URL + 'update',{id,status,dueDate}, { headers: authHeader() });
  }
}
export default new TodoService();
