import { axiosInstance } from "./axiosInstance";


export const userLogin = async (formData: Record<string, unknown>) =>{
    const response = await axiosInstance.post(`/login`,formData);
    return response.data;
}

export const userSignUp = async (formData: Record<string, unknown>) =>{
    const response = await axiosInstance.post('register',formData);
    return response.data;
}

export const getCurrentUser = async() =>{
    const response = await axiosInstance.get('/me');
    return response.data;
}

export const getGenerateContent = async ({topic}:{topic:string}) =>{
    const response = await axiosInstance.post('/content/generate',{ topic });
    return response.data;
}


export const createContent = async ({
    title,
    body,
  }: {
    title: string;
    body: string;
  }) => {
    const response = await axiosInstance.post('/content', { title, body });
    return response.data; 
  };
  
  export const updateContent = async ({
    id,
    title,
    body,
  }: {
    id: number;
    title: string;
    body: string;
  }) => {
    const response = await axiosInstance.put(`/content/${id}`, { title, body });
    return response.data; 
  };
  
  export const getAllContent = async () => {
    const response = await axiosInstance.get('content');
    return response.data; 
  };

  export const getDocumentById = async ({id}: {id: number}) => {
    const response = await axiosInstance.get(`content/${id}`);
    return response.data.content; 
  };

  export const deleteDocumentById = async ({id}: {id: number}) => {
    const response = await axiosInstance.delete(`content/${id}`);
    return response.data; 
  };

  export const deleteContent = async (id: number) => {
    const response = await axiosInstance.delete(`/content/${id}`);
    return response.data;
  };
  
  export const userLogout = async () =>{
    const response = await axiosInstance.get('/logout');
    return response.data;
  }
  