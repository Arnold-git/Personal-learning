from flask import Flask, render_template, request, redirect, url_for

import os
from flask_wtf import FlaskForm
from flask_wtf.file import FileField
from wtforms import SubmitField


app = Flask(__name__)

app.config['MAX_CONTENT_LENGTH'] = 2 * 1024 * 1024
app.config['UPLOAD_EXTENSIONS'] = ['.jpg', '.png', '.jpeg']
app.config['UPLOAD_PATH'] = 'uploads'

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/', methods=['POST', 'GET'])
def upload_file():
    if request.method == 'POST':
        uploaded_file = request.files['file']
        filename = secure_filename(uploaded_file.filename)
        if filename != '':
            file_ext = os.path.splitext(filename)[1]
            if file_ext not in app.config['UPLOAD_EXTENSIONS']:
                abort(400)
            uploaded_file.save(os.path.join(app.config['UPLOAD_PATH'], filename))
        return redirect(url_for('index'))



@app.route('/uploads/<filename>')
def upload(filename):
    return send_from_directory(app.config['UPLOAD_PATH'], filename)

class MyForm(FlaskForm):
    file = FileField('File')
    submit = SubmitField('Submit')


if __name__ == "__main__":
    app.run(debug = True, port = 5000, threaded = True)