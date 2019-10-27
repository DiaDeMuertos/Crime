import pickle
import joblib
import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression


if __name__ == "__main__":
    print("Crime")

    df = pd.read_csv('homeprices.csv')

    model = LinearRegression()

    model.fit(df[['area']], df.price)

    coef = model.coef_
    intercept = model.intercept_

    prediction = model.predict([[5000]])

    print(coef, intercept, prediction)

    f = open('model.pickle', 'wb')
    pickle.dump(model, f)
    f.close()

    # ------------------------------------------

    f = open('model.pickle', 'rb')
    model = pickle.load(f)
    f.close()

    prediction = model.predict([[5000]])

    print(prediction)
    # ------------------------------------------
    joblib.dump(model, 'model.joblib')
    model = joblib.load('model.joblib')

    prediction = model.predict([[5000]])

    print(prediction)
