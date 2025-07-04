import cv2
import numpy as np
import sys
import math

def compute_motion_angle(img1_path, img2_path):
    img1 = cv2.imread(img1_path, 0)
    img2 = cv2.imread(img2_path, 0)

    # Optical Flow verwenden
    flow = cv2.calcOpticalFlowFarneback(img1, img2, None,
                                         0.5, 3, 15, 3, 5, 1.2, 0)

    # Durchschnittsrichtung berechnen
    dx = np.mean(flow[...,0])
    dy = np.mean(flow[...,1])

    angle = (math.degrees(math.atan2(-dy, dx)) + 360) % 360

    return angle, dx, dy

def direction_label(deg):
    dirs = ['N', 'NO', 'O', 'SO', 'S', 'SW', 'W', 'NW']
    ix = round(deg / 45) % 8
    return dirs[ix]

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: analyze_motion.py diff1.jpg diff2.jpg")
        sys.exit(1)

    angle, dx, dy = compute_motion_angle(sys.argv[1], sys.argv[2])
    label = direction_label(angle)
    print(f"🌥 Wolkenzugrichtung: {angle:.1f}° ({label})")
    print(f"📉 Durchschnittliche Pixelbewegung: dx={dx:.2f}, dy={dy:.2f}")

