import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async  function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse>{
  try {
    const mail = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: email,
      subject: 'Mystery Message | Verification code',
      react: VerificationEmail({username, otp:verifyCode}),
    })
    console.log("mail sent", mail)
    return { success: true, message: 'Verification mail sent successfully'}
  } catch (error) {
    console.log("Error sending email", error)
    return { success: false, message: 'Failed to send verification email'}
  }
}