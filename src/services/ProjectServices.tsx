import axios, { AxiosResponse } from 'axios';
import { Project, ProjectRequest } from "../interfaces/Project";
import { User } from '../interfaces/User';

const BASE_URL = 'https://back-deployp1.onrender.com/api/project'

export class ProjectServices {

  static async getAllUsersByProjectId(id: number): Promise<User[]> {
    try {
      const response: AxiosResponse<User[]> = await axios.get(`${BASE_URL}/users?project_id=${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }

  static async getAllProjectsByUserId(id: number): Promise<Project[]> {
    try {
      const response: AxiosResponse<Project[]> = await axios.get(`${BASE_URL}/projects?user_id=${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }

  static async getProjectById(id: number): Promise<Project> {
    try {
      const response: AxiosResponse<Project> = await axios.get(`${BASE_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching project by id:', error);
      throw error;
    }

  }

  static async fetchProjectFile(id: number): Promise<any> {
    const response = await fetch(`${BASE_URL}/load?project_id=${id}`);
    if (!response.ok) {
      throw new Error("No se pudo obtener el archivo desde el backend.");
    }
    return await response.json();
  };

  static async addUserToProject(projectId: number, userId: number): Promise<any> {
    try {
      const response: AxiosResponse<User[]> = await axios.patch(`${BASE_URL}/add?user_id=${userId}&project_id=${projectId}`);
      return response.data;
    } catch (error) {
      console.error('Error adding to user:', error);
      throw error;
    }
  }

  static async removeUserToProject(projectId: number, userId: number): Promise<any> {
    try {
      const response: AxiosResponse<any> = await axios.patch(`${BASE_URL}/remove?user_id=${userId}&project_id=${projectId}`);
      return response.data;
    } catch (error) {
      console.error('Error removing to user:', error);
      throw error;
    }
  }

  static async generateAngularProject(projectConfig: any): Promise<Blob> {
    try {
      const response = await axios.post(`${BASE_URL}/generate`, projectConfig, {
        responseType: 'blob', // To handle the zip file response
      });
      return response.data;
    } catch (error) {
      console.error('Error generating Angular project:', error);
      throw error;
    }
  }

  static async createProject(
    userId: number,
    project: ProjectRequest,
    file: File
  ): Promise<any> {
    const formData = new FormData();
    formData.append("file", file);
    Object.entries(project).forEach(([key, value]) => {
      formData.append(key, value);
    });
    const response = await fetch(`${BASE_URL}/${userId}`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || "Error creando el proyecto");
    }

    return await response.json();
  }

  static async updateProject(
    projectId: number,
    project: ProjectRequest,
    file: File
  ): Promise<any> {
    const formData = new FormData();
    formData.append("file", file);

    // Agrega los campos del proyecto al formData
    Object.entries(project).forEach(([key, value]) => {
      formData.append(key, value);
    });

    const response = await fetch(`${BASE_URL}/${projectId}`, {
      method: "PUT",
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || "Error creando el proyecto");
    }

    return await response.json();
  }

}