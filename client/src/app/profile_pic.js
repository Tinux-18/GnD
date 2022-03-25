import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleUploader } from "../redux/app/slice";

export default function ProfilePic() {
    const dispatch = useDispatch();
    const profile = useSelector((state) => state.app);

    useEffect(() => {
        console.log("Profile Pic mounted");
    }, []);
    return (
        <div id={"profile-pic"} onClick={() => dispatch(toggleUploader(true))}>
            <img
                alt={`${profile.first} ${profile.last}`}
                src={profile.image || "/default_profile_pic.png"}
                className="profile-pic"
            />
        </div>
    );
}
