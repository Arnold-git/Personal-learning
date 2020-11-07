import cv2
import numpy as np
import glob
import streamlit as st 
st.set_option('deprecation.showfileUploaderEncoding', False)

@st.cache(hash_funcs={cv2.dnn_Net: hash})

@st.cache(allow_output_mutation=True)



def auto_canny(image, sigma=0.33):

	v = np.median(image)

	lower = int(max(0, (1.0 - sigma) * v))
	upper = int(min(255, (1.0 + sigma) *v))
	edged = cv2.Canny(image, lower, upper)


	return edged

def detect_edge(image):

	image = cv2.imdecode(np.fromstring(image.read(), np.uint8), 1)  #read the image from tempoary memory
	gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
	blurred = cv2.GaussianBlur(gray, (3, 3), 0)


	wide = cv2.Canny(blurred, 10, 200)
	tight = cv2.Canny(blurred, 255, 250)
	auto = auto_canny(blurred)


	cv2.imshow("Original", image)
	return cv2.imshow("Edge", np.hstack((wide, tight, auto)))
   


def main():

    st.title("Edge Detector App ") # create App title
    st.write("**Using the Python and OpenCV**") # streamlit function to display text
    


    activities = ['Image Detection']
    choice = st.sidebar.radio("Hey, What do want to do", activities) # streammlit function to display radio
    # image, label = detect_mask(image=image)

    if choice == "Image Detection": # If user chooses Home page
        # st.write("Go to the about Page to learn more about this Project") # display this
        image_file = st.file_uploader("Upload image", type=['jpeg', 'jpg', 'png']) # streamlit function to upload file
        

        if image_file is not None:  #confirm that the image is not a 0 byte file


            st.sidebar.image(image_file, width=240) # then display a sidebar of the uploaded image
            
            if st.button("Detect Edge"): # process button
            
                edge = detect_edge(image_file) # call mask detection model
                st.image(edge, width=420) # display the uploaded image
                # st.success('### ' +  edge) # display label


if __name__ == "__main__": 
    main()
