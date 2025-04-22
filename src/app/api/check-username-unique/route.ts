// Importing required modules and schemas
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { z } from 'zod'
import { usernameValidation } from "@/schemas/signUpSchema";

// Define the schema for query validation using Zod
const UsernameQuerySchema = z.object({
  username: usernameValidation // Validate the username from query params
});

// API route handler for checking if username is available
export async function GET(request: Request) {
  // Step 1: Connect to the database
  await dbConnect()

  try {
    // Step 2: Extract 'username' from query parameters
    const { searchParams } = new URL(request.url)
    const queryParam = {
      username: searchParams.get('username')
    }

    // Step 3: Validate the extracted username using Zod schema
    const result = UsernameQuerySchema.safeParse(queryParam)
    console.log(result) // Debugging: log validation result

    // Step 4: If validation fails, return a 400 response with error message
    if (!result.success) {
      const usernameErrors = result.error.format().username?._errors || []
      return Response.json({
        success: false,
        message: usernameErrors
      }, { status: 400 })
    }

    // Step 5: Extract the validated username
    const { username } = result.data

    // Step 6: Check in the database if a verified user already exists with this username
    const existingVerifiedUser = await UserModel.findOne({ username, isVerified: true })

    // Step 7: If user exists and is verified, respond with error message
    if (existingVerifiedUser) {
      return Response.json({
        success: false,
        message: "Username is already taken"
      }, { status: 400 })
    }

    // Step 8: If username is available, return success response
    return Response.json({
      success: true,
      message: "Username is available"
    }, { status: 200 })

  } catch (error) {
    // Step 9: Handle unexpected errors and return 500 response
    console.error("Error Checking Username", error)
    return Response.json(
      {
        success: false,
        message: "Error Checking Username"
      }, { status: 500 }
    )
  }
}
