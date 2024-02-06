import useAxiosAuth from "@/lib/hooks/useAxiosAuth";
import { useSession, signIn, signOut } from "next-auth/react";
import styles from "@/styles/Login.module.css";

export default function Component() {
  const { data: session } = useSession();
  const axiosAuth = useAxiosAuth();
  

  const testAuth = async () => {
    try {
      const data = await axiosAuth.get("http://localhost:8000/api/ping");
      if (data.error) {
        alert("error", data);
        return;
      }
      alert("success auth");
      return;
    } catch (e) {
      alert(e);
    }
  };

  return (
    <div className={styles.container}>
      {session ? (
        <>
          <div className={styles.auth}>
            <div>Signed in as {session.user.email}</div>
            <div>RefreshToken: {session.user.refreshToken}</div>
            <div>AccessToken: {session.user.accessToken}</div>
          </div>
          <button onClick={() => signOut()}>Sign out</button>
        </>
      ) : (
        <>
          Not signed in <br />
          <button onClick={() => signIn()}>Sign in</button>
        </>
      )}
      <button onClick={testAuth}>Test auth</button>
    </div>
  );
}
