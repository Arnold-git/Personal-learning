import cv2
import numpy as np 

cap = cv2.VideoCapture('cafe.mp4')

if (cap.isOpened() == False):

	print("Error opening Video stream or file")

fgbg = cv2.createBackgroundSubtractorMOG2(
	history = 10,
	varThreshold=2,
	detectShadows = False

	)

while (cap.isOpened()):
	ret, frame = cap.read()

	if ret == True:

		gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

		edges_foreground = cv2.bilateralFilter(gray, 9, 75, 75)
		foreground = fgbg.apply(edges_foreground)


		kernel = np.ones((50, 50), np.uint8)
		foreground = cv2.morphologyEx(foreground, cv2.MORPH_CLOSE, kernel)


		edges_foreground = cv2.bilateralFilter(gray, 9, 75, 75)
		edges_filtered = cv2.Canny(edges_foreground, 60, 120)

		cropped = (foreground // 255) * edges_filtered

		images = np.hstack((gray, edges_filtered, cropped))


		cv2.imshow('Frame', images)

		if cv2.waitKey(25) & 0xFF == ord('q'):
			break

	else:

		break

cap.release()

cv2.destroyAllWindows()

