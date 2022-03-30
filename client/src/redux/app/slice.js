export default function AppReducer(app = null, action) {
    if (action.type == "app/receiveProfile") {
        app = action.payload.app;
    } else if (action.type == "app/updateImage") {
        app = { ...app, image: action.payload.image };
    } else if (action.type == "app/updateRole") {
        app = { ...app, ngoRegistration: action.payload.ngoCheck };
    } else if (action.type == "app/toggleUploader") {
        app = { ...app, uploaderVisible: action.payload.uploaderVisibility };
    }
    return app;
}

export function receiveProfile() {
    return async (dispatch) => {
        const app = await fetch("/user/roles.json").then((response) =>
            response.json()
        );
        console.log("app :>> ", app);
        dispatch({ type: "app/receiveProfile", payload: { app } });
    };
}

export function updateImage(image) {
    return {
        type: "app/updateImage",
        payload: { image },
    };
}

export function updateBio(bio) {
    return {
        type: "app/updateBio",
        payload: { bio },
    };
}

export function updateRole(newRole) {
    return {
        type: "app/updateRole",
        payload: { newRole },
    };
}

export function toggleUploader(uploaderVisibility) {
    return {
        type: "app/toggleUploader",
        payload: { uploaderVisibility },
    };
}
