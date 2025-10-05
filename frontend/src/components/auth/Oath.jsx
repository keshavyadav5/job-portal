// src/components/Oath.jsx
import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";
import { app } from "@/lib/firebase";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useGoogleLoginMutation } from "@/utils/api/userApiSlice";
import { setUser } from "@/redux/authSlice";
import { Loader2 } from "lucide-react";

const Oath = () => {
  const auth = getAuth(app);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [googleLogin, { isLoading: loading }] = useGoogleLoginMutation()

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });

    try {
      const resultsFromGoogle = await signInWithPopup(auth, provider);
      const data = {
        fullname: resultsFromGoogle?.user?.displayName,
        email: resultsFromGoogle?.user?.email,
        profilePhoto: resultsFromGoogle?.user?.photoURL
      }
      const res = await googleLogin(data).unwrap();
      if (res.success) {
        dispatch(setUser(res.user))
        toast.success(res.message);
        navigate("/");
      }
    } catch (error) {
      console.log("Google Login Error:", error);
    }
  };

  return (
    <div>
      <button
        onClick={handleGoogleLogin}
        className="shadow-md cursor-pointer w-full items-center py-2 rounded-lg flex justify-center gap-2"
      >

        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <img
          className="w-6"
          src="https://imagepng.org/wp-content/uploads/2019/08/google-icon.png"
          alt="google icon"
        />}Continue with Google
      </button>
    </div>
  );
};

export default Oath;
