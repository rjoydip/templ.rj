import { decrypt, encrypt } from 'salteen'

const salt = 'dcbc3e65506a7e6f15d30a357e884432'

export const encoder = encrypt(salt)
export const decoder = decrypt(salt)
