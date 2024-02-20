# Importing necessary libraries
import cv2
import numpy as np
import json

# Importing Dlib for deep learning and face landmark detection
import dlib
from imutils import face_utils

# Initializing the camera for taking the instance
cap = cv2.VideoCapture(0)

# Initializing the face detector and landmark detector
detector = dlib.get_frontal_face_detector()
predictor = dlib.shape_predictor("./shape_predictor_68_face_landmarks.dat")


def compute(pointA, pointB):
    distance = np.linalg.norm(pointA - pointB)
    return distance

def blink_detection(a, b, c, d, e, f):
    up = compute(b, d) + compute(c, e)
    down = compute(a, f)
    ratio = up / (2.0 * down)

    # Checking if it is blinked
    if (ratio > 0.25):
        return 2
    elif (ratio > 0.21 and ratio <= 0.25):
        return 1
    else:
        return 0

def the_main():
    # status marking for current state
    sleep = 0
    drowsy = 0
    active = 0
    status = ""
    color = (0, 0, 0)

    while True:
        with open('./websocket_server/logs.json', 'r') as logs:
            data = json.load(logs)

            _, frame = cap.read()
            gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

            faces = detector(gray)
            # detected face in faces array
            for face in faces:
                x1 = face.left()
                y1 = face.top()
                x2 = face.right()
                y2 = face.bottom()

                face_frame = frame.copy()
                cv2.rectangle(face_frame, (x1, y1), (x2, y2), (0, 255, 0), 2)

                landmarks = predictor(gray, face)
                landmarks = face_utils.shape_to_np(landmarks)

                # Set eye's landmarks
                left_blink = blink_detection(landmarks[36], landmarks[37],
                                            landmarks[38], landmarks[41], landmarks[40], landmarks[39])
                right_blink = blink_detection(landmarks[42], landmarks[43],
                                            landmarks[44], landmarks[47], landmarks[46], landmarks[45])

                # Detect based on eye blink activity
                if (left_blink == 0 or right_blink == 0):
                    sleep += 1
                    drowsy = 0
                    active = 0
                    if (sleep > 6 and sleep < 15):
                        status = "ALERT: SLEEPING"
                        data["message"] = "SLEEPING"
                        color = (0, 0, 255)

                    elif (sleep > 35):
                        status = "Test: ************************"

                elif (left_blink == 1 or right_blink == 1):
                    sleep = 0
                    active = 0
                    drowsy += 1
                    if (drowsy > 6):
                        status = "Caution: Drowsy"
                        data["message"] = "Drowsy"
                        color = (255, 255, 0)

                else:
                    drowsy = 0
                    sleep = 0
                    active += 1
                    if (active > 6):
                        status = "Active (SAFE)"
                        data["message"] = "Active (SAFE)"
                        color = (0, 255, 0)
                
                print("data : ", data)
                with open('./websocket_server/logs.json', 'w') as logs:
                    json.dump(data, logs, indent=4)

                cv2.putText(frame, status, (100, 100), cv2.FONT_HERSHEY_DUPLEX, 3, color, 2)

                for n in range(0, 68):
                    (x, y) = landmarks[n]
                    cv2.circle(face_frame, (x, y), 1, (255, 255, 255), -1)

            cv2.imshow("Output Frame", frame)
            cv2.imshow("Detector result", face_frame)
            key = cv2.waitKey(1)
            if key == 11:
                break


if __name__ == "__main__":
    the_main()