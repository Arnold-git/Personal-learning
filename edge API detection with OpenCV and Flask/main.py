from flask import Flask, request
import numpy as np
import cv2
import requests
import os
import json
from json import JSONEncoder



app = Flask(__name__)

@app.route('/')
def hello_world():
  return 'Edge detection API!'


class NumpyArrayEncoder(JSONEncoder):
    def default(self, obj):
        if isinstance(obj, np.ndarray):
            return obj.tolist()
        return JSONEncoder.default(self, obj)


def auto_canny(image, sigma=0.33):

    v = np.median(image)

    lower = int(max(0, (1.0 - sigma) * v))
    upper = int(min(255, (1.0 + sigma) *v))
    edged = cv2.Canny(image, lower, upper)


    return edged



@app.route('/detect_edge', methods=['GET', 'POST'])
def process_image():
  if request.json:

    data = request.json

    image_path = data.get("image_path")

    print(image_path)

    r = requests.get(image_path, timeout=60)

    # save the image to disk
    temp_file = 'tmp/temp.jpg'
    f = open(temp_file, "wb")
    f.write(r.content)
    f.close()

    image = cv2.imread(temp_file)
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    blurred = cv2.GaussianBlur(gray, (3, 3), 0)

    wide = cv2.Canny(blurred, 10, 200)
    tight = cv2.Canny(blurred, 225, 250)
    auto = auto_canny(blurred)

    array = np.hstack([wide, tight, auto])

    encodedNumpyData = json.dumps(array, cls=NumpyArrayEncoder)


    return encodedNumpyData



if __name__ == "__main__":
    app.run(debug=True)
