from flask import Flask, request, jsonify
from flask_cors import CORS
import psycopg2
from os import path, environ, chdir
from toolz import itertoolz
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier


FLASK_PORT = environ.get('FLASK_PORT')
FLASK_ENV = environ.get('FLASK_ENV')

app = Flask(__name__)
cors = CORS(app)


@app.route('/api/crime/<hour>/<day_of_week>/<month>/<tract_id>/<grid_id>', methods=['GET'])
def predict(hour, day_of_week, month, tract_id, grid_id):
    if request.method == 'GET':
        try:
            prediction = int(model.predict([[hour, day_of_week, month, tract_id, grid_id]])[0])
            payload = { "group_id" : prediction }
            return jsonify({"payload": payload, "success": True}), 200
        except:
            return jsonify({"payload": None, "success": False}), 400


if __name__ == '__main__':

    base_path = path.dirname(path.abspath(__file__))
    path_one_step_back = itertoolz.first(path.split(base_path))
    path_two_step_back = itertoolz.first(path.split(path_one_step_back))

    crimes_dir_exists = path.exists(path.join(path_one_step_back, 'csv-files'))

    if crimes_dir_exists:
        df = pd.read_csv(path.join(path_one_step_back, 'csv-files','crimes.csv'))
    else:
        df = pd.read_csv(path.join(path_two_step_back, 'csv-files','crimes.csv'))

    group_ids = [57, 20, 41, 34, 36, 19, 42]
    columns_to_drop = ['id', 'offense_code', 'offense_group', 'longitude', 'latitude', 'year']

    df = df[df['group_id'].isin(group_ids)].copy()
    df.drop(columns_to_drop, axis=1, inplace=True)

    X = df[['hour', 'day_of_week', 'month', 'tract_id', 'grid_id']]
    y = df['group_id']

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=9)

    model = RandomForestClassifier(n_estimators=10)
    model.fit(X_train, y_train)

    app.run(host='0.0.0.0', port=FLASK_PORT)
