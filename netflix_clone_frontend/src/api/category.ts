import axios from '../utils/axios'

export interface Category {
  id: number
  name: string
  description: string
  active: boolean
}

export const categoryApi = {
  getAll: () => axios.get<Category[]>('/categories'),

  getById: (id: number) => axios.get<Category>(`/categories/${id}`),
}
