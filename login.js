    //authentification


    /*if(localStorage.getItem('content') !== "") {
        document.body.innerHTML = content
    }*/

    let content = document.body.innerHTML

    chrome.storage.sync.set({
        "state": content
    })


    let form = document.getElementById('formulaire')

    form.addEventListener('submit', (e) => {
        let data = {
            login: form.elements.login.value,
            password: form.elements.password.value
        }
        e.preventDefault()

        const Promise = fetch('http://localhost:3000/auth', {
            method: 'POST',
            mode: 'cors',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        })

        Promise.then(res => {
            console.log(res); // log response object
            return res.json();

        })

        Promise.then((object) => {
                if (object.status == 200) {
                    alert("Bienvenue!")
                    window.location.replace('./choice.html')
                } else if (object.status == 404) {
                    alert("Erreur! Veuillez reesayer!")
                }

            })
            .catch(error => console.error('Error:', error))

    })

    chrome.runtime.connect({
        name: "popup"
    })