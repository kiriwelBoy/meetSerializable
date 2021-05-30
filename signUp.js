window.onload = function() {
    let sUp = document.getElementById("signUp");
    var mail = '',
        pwd = '',
        classe = '',
        matiere = '';

    sUp.onclick = function() {
        let Email = document.getElementById("mailAdress");
        let psswd = document.getElementById("password");
        let Class = document.getElementById("classe");
        let cours = document.getElementById("matiere");

        chrome.storage.sync.set({ 'mail': Email, 'pswd': psswd, 'Class': Class, 'cours': cours });
        chrome.storage.sync.get('mail', 'pswd', 'Class', 'cours', function(data) {
            mail = data.mail;
            pwd = data.pswd;
            classe = data.Class;
            matiere = data.cours;
        });
    };
}