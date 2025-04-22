// Import required modules
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";

// API route handler for verifying user code
export async function POST(request: Request) {
  // Step 1: Connect to the database
  await dbConnect()

  try {
    // Step 2: Extract 'username' and 'code' from the request body
    const { username, code } = await request.json()

    // Step 3: Decode the username to handle special characters in URL
    const decodedUsername = decodeURIComponent(username)

    // Step 4: Find the user in the database using the decoded username
    const user = await UserModel.findOne({ username: decodedUsername })

    // Step 5: If user is not found, return error response
    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found"
        },
        { status: 500 }
      )
    }

    // Step 6: Check if the provided verification code matches the stored code
    const isCodeValid = user.verifyCode == code

    // Step 7: Check if the verification code has not expired
    const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date()

    // Step 8: If both code is valid and not expired, verify the user account
    if (isCodeValid && isCodeNotExpired) {
      user.isVerified = true // Mark user as verified
      await user.save() // Save changes to database

      return Response.json({
        success: true,
        message: "Account verified successfully"
      }, { status: 200 })
    }
    // Step 9: If code has expired, return appropriate error response
    else if (!isCodeNotExpired) {
      return Response.json({
        success: false,
        message: "Verification code expired, please sign up again to get new code"
      }, { status: 400 })
    }
    // Step 10: If code is invalid, return error response
    else {
      return Response.json({
        success: false,
        message: "Incorrect verification code"
      }, { status: 400 })
    }
  } catch (error) {
    // Step 11: Handle unexpected errors and log them
    console.error("Error Verifying User", error)
    return Response.json(
      {
        success: false,
        message: "Error Verifying Code"
      },
      { status: 500 }
    )
  }
}
 