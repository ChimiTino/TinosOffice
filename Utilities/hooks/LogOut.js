import pb from "../lib/pocketbase";


function Logout() {
    function logout(){
        pb.authStore.clear();
        location.reload()
    }
    return logout
}

export default Logout