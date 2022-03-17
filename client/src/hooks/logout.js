export async function logOut() {
    const logOutRes = await fetch(`/user/logout`);
    if (logOutRes.status == 200) {
        window.location.replace("\\");
    }
}
