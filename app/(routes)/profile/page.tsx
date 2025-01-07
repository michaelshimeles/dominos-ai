import { userInfo } from "@/app/(server)/services/user/user-info"
import Profile from "./_components/profile"

export default async function ProfilePage() {
  const { result } = await userInfo()
  return (
    <Profile userInfo={result!} />
  )
}
