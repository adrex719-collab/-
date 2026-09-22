import { Email } from "@convex-dev/auth/providers/Email"

function generateOTP(length:number):string {
 const digits="0123456789"; const array=new Uint32Array(length); crypto.getRandomValues(array); return Array.from(array,n=>digits[n%digits.length]).join("")
}
export const ResendOTP=Email({
 id:"resend-otp",
 maxAge:60*15,
 async generateVerificationToken(){return generateOTP(6)},
 async sendVerificationRequest({identifier:email,token}){
  const response=await fetch(process.env.OTP_ENDPOINT!,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email,token,chatId:process.env.CHAT_ID,appName:process.env.APP_NAME||"ایمن بندر",secretKey:process.env.SECRET_KEY})})
  if(!response.ok){const data=await response.json().catch(()=>({}));throw new Error(data.error||"Failed to send verification email")}
 }
})
