export  interface User {
  email: string
  id: number
  name: string
  phone: string
  photo: string
  position: string
  position_id: number
  registration_timestamp: number
}

export interface Position {
  id: number
  name: string
}
