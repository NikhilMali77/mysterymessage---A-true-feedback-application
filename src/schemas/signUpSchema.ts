import {z} from 'zod';

export const usernameValidation = z
.string()
.min(2, "Username must be at least 2 characters")
.max(20, "Username must be at most 20 characters")
.regex( /^[a-z]/ , "Username must not contain a special character")

export const signUpSchema = z.object({
  username: usernameValidation,
  email: z.string().email({message: 'Invalid email address'}),
  password: z.string().min(6,{message: 'Password must be atleast 6 characters'})
})