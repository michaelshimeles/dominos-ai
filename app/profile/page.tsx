import { userInfo } from "../(server)/data/user/user-info"
import Profile from "./profile"

export default async function ProfilePage() {
  const { result } = await userInfo()
  return (
    <Profile userInfo={result!} />
  )
}
