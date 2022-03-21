import { rateCharacter } from "../redux/characters/slice.js";

export async function handleButtonClick(action, dispatch) {
    const res = await fetch(`/${action}/${userId}`, { method: "POST" });
    const data = await res.json();
    if (data.success) {
        dispatch(rateCharacter(userId, action));
    }
}
