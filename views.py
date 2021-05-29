from flask import Flask, render_template,  session, request
import pymysql

app = Flask(__name__)



conn = pymysql.connect(host='localhost', port=3306, user='root', passwd='', db='mydb')
cur = conn.cursor()

SESSION_TYPE = 'redis'
app.config.from_object(__name__)

app = Flask(__name__)
@app.route('/',methods=["GET","POST"])
def login():
    if request.method == 'POST':
            username = request.form['username']
            password = request.form['password']

            req = cur.execute("SELECT * FROM enseignant WHERE email=%s AND motdepasse=%s",(username, password))
            user = cur.fetchone()

            result = cur.execute(
                "SELECT classe.codeclasse , classe.nomclasse FROM enseignant , classe , matiere , UE where enseignant.email = %s AND "
                "enseignant.matricule = matiere.Enseignant_matricule AND"
                " matiere.codematiere = UE.matiere_codematiere AND"
                " UE.codeUE = classe.UE_codeue ", (username))
            classes = cur.fetchall()

            if user is None:
                error = "Email ou mot de passe Incorrect"
                return render_template('login.html', error=error)

            print(len(user))

            if len(user) > 0:
                session['username'] = username
                session
                return render_template('home.html', classes=classes)
            else:
                return render_template("login.html")

    else:
        return render_template("login.html")

@app.route('/seances/<id>' , methods=["GET","POST"])
def seances(id):
    res = cur.execute('Select seance.datedebut , seance.dateFin , seance.NomSeance , seance.idSeance , seance.NoteSeance '
                      'from seance , classe where seance.classe_codeclasse = %s',(id))
    seances = cur.fetchall()
    return render_template('seance.html', seances=seances)

@app.route('/listepresence/<id>',methods=["GET","POST"])
def infoseance(id):
    res = cur.execute('select etudiant.prenom , etudiant.nom , etudiant.email '
                      'from etudiant , seance , participerseance where  participerseance.idSeance = %s '
                      'AND participerseance.idEtudiant = etudiant.idEtudiant',(id))

    liste =  cur.fetchall()
    return render_template('liste.html', liste=liste)

@app.route("/logout")
def logout():
    session.pop('username', None)
    return render_template('login.html')

@app.route('/about')
def about():
    return render_template('about.html')

if __name__ == "__main__":
    app.secret_key = b'\x0csB\xf1.\xe0:w@\x0e\xef\xd4\xdf\xd9\x92.\xa4\x12\x8e\xf7\x9d\xf6@)'
    app.run(debug=True)