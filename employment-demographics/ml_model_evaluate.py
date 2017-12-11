## compute_input.py

import sys, json, numpy as np
import matplotlib.pyplot as plt
from sklearn import datasets, linear_model
from sklearn.metrics import mean_squared_error, r2_score


coefficients = [ -0.21035503, 0.21035503 ,24.38244048,  -3.74255952 ,-5.90922619, -6.23422619,  12.95744048  ,-1.57589286 ,-2.75089286,   3.60744048, -1.92589286 , -5.32589286  ,-5.43422619,  -0.14255952   ,1.27410714, -3.89255952 ,-3.40089286 ,-5.43422619  -5.42589286 , -4.34255952, -0.05922619, 10.91577381 , 2.61577381 ,2.61577381 ,-1.87589286, 6.17410714 , -6.55922619  ,6.87410714 , -5.36755952 ,-2.01755952 , 0.000000 ]

def read_in():
    lines = sys.stdin.readlines()
    #Since our input would only be having one line, parse our JSON data from that
    return json.loads(lines[0])

def get_feature_vector(gender, profession):
    gender_vec = [0, 0]
    gender_vec[gender] = 1    
    profession_vec = [0] * 28
    profession_vec[profession-1] = 1    
    return gender_vec + profession_vec

def main():
    #get our data as an array from read_in()
    lines = read_in()
    intercept = 7.3175595238095212

    #create a numpy array
    line = np.array(lines)

    gender = int(line[0])
    #print(gender)
     
    profession = int(line[1])
    #print(profession)
    feature_vector = get_feature_vector(gender, profession)
    score = intercept
    #print(coefficients[0])
    #return
    for i, f in enumerate(feature_vector):
        #print(coefficients[1])
        #return
        score += f * coefficients[i]
    print(score)

#start process
if __name__ == '__main__':
    main()
