window.onload = function() {
    let sIn = document.getElementById("signIn");

    let link = document.createElement('a');
    link.href = "./signUp.html";
    link.innerHTML = "<br>Vous avez bien ete inscrit<br>Authentifiez vous";

    sIn.onclick = function() {
        document.body.childNodes[3].childNodes[1].childNodes[1].appendChild(link);
    };
}