export default function NgoReducer(ngoProfile = null, action) {
    if (action.type == "ngo/receiveNgoProfile") {
        ngoProfile = action.payload.ngoProfile;
    } else if (action.type == "ngo/updateNgoProfile") {
        ngoProfile = { ...ngoProfile, ...action.payload.draftNgoProfile };
    }
    return ngoProfile;
}

export function receiveNgoProfile() {
    return async (dispatch) => {
        const ngoProfile = await fetch("/ngo/profile.json").then((response) =>
            response.json()
        );
        dispatch({ type: "ngo/receiveNgoProfile", payload: { ngoProfile } });
    };
}

export function updateNgoProfile(draftNgoProfile) {
    return {
        type: "ngo/updateNgoProfile",
        payload: { draftNgoProfile },
    };
}
