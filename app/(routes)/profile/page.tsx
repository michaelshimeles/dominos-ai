import { userInfo } from "@/app/(server)/data/user/user-info"
import Profile from "./_components/profile"

export default async function ProfilePage() {
  const { result } = await userInfo()
  return (
    <Profile userInfo={result!} />
  )
}
