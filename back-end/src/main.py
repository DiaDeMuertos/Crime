from flask import Flask, request, jsonify
from flask_cors import CORS
import psycopg2
from os import path, environ, chdir
from toolz import itertoolz
import json
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier


FLASK_PORT = environ.get('FLASK_PORT')
FLASK_ENV = environ.get('FLASK_ENV')

app = Flask(__name__)
cors = CORS(app)


def close_conection(cursor, connection):
    if(connection):
        cursor.close()
        connection.close()


def build_crimes_by(row):
    return {
        "id": int(row[0]),
        "geojson": json.loads(row[1])
    }


def build_grid(row):
    return {
        "id": int(row[0]),
        "geojson": json.loads(row[1])
    }


@app.route('/api/grid', methods=['GET'])
def grid():
    if request.method == 'GET':
        try:
            connection = psycopg2.connect(
                user="postgres",
                password="123",
                host="db",
                port="5432",
                database="crimes",
            )

            cursor = connection.cursor()

            cursor.execute("""
                SELECT
                    id,
                    ST_ASGEOJSON(geom) AS geojson
                FROM grid;
            """)

            matches = True if cursor.rowcount else False

            payload = [build_grid(r) for r in cursor]
            success = True
            code = 200
        except:
            payload = None
            success = False
            code = 400
        finally:
            close_conection(cursor, connection)
            return jsonify({"payload": payload, "success": success, "matches": matches}), code


@app.route('/api/crimes/by/<group_id>/<hour>/<day_of_week>/<month>/<tract_id>/<grid_id>', methods=['GET'])
def crimes_by(group_id, hour, day_of_week, month, tract_id, grid_id):
    if request.method == 'GET':
        try:
            connection = psycopg2.connect(
                user="postgres",
                password="123",
                host="db",
                port="5432",
                database="crimes",
            )

            cursor = connection.cursor()

            cursor.execute("""
                SELECT 
                    id,
                    ST_ASGEOJSON(geom) AS geojson
                FROM crimes
                WHERE 
                    group_id = %s AND 
                    hour= %s AND 
                    day_of_wee = %s AND 
                    month = %s AND 
                    tract_id = %s AND 
                    grid_id = %s;
            """ % (group_id, hour, day_of_week, month, tract_id, grid_id))

            matches = True if cursor.rowcount != 0 else False

            if matches == False:
                cursor.execute("""
                    SELECT 
                        id,
                        ST_ASGEOJSON(geom) AS geojson
                    FROM crimes
                    WHERE 
                        group_id = %s AND grid_id = %s;
                """ % (group_id, grid_id))

            payload = [build_crimes_by(r) for r in cursor]
            success = True
            code = 200
        except(Exception, psycopg2.Error) as error:
            print(error)

            payload = None
            success = False
            code = 400
        finally:
            close_conection(cursor, connection)
            return jsonify({"payload": payload, "success": success, "matches": matches}), code


@app.route('/api/crimes/predict/<hour>/<day_of_week>/<month>/<tract_id>/<grid_id>', methods=['GET'])
def crimes_predict(hour, day_of_week, month, tract_id, grid_id):
    if request.method == 'GET':
        try:
            prediction = int(model.predict(
                [[hour, day_of_week, month, tract_id, grid_id]])[0])
            payload = {"group_id": prediction}
            success = True
            code = 200
        except:
            payload = None
            success = False
            code = 400
        finally:
            return jsonify({"payload": payload, "success": success}), code


if __name__ == '__main__':

    base_path = path.dirname(path.abspath(__file__))
    path_one_step_back = itertoolz.first(path.split(base_path))
    path_two_step_back = itertoolz.first(path.split(path_one_step_back))

    crimes_dir_exists = path.exists(path.join(path_one_step_back, 'csv-files'))

    if crimes_dir_exists:
        df = pd.read_csv(path.join(path_one_step_back,
                                   'csv-files', 'crimes.csv'))
    else:
        df = pd.read_csv(path.join(path_two_step_back,
                                   'csv-files', 'crimes.csv'))

    group_ids = [57, 20, 41, 34, 36, 19, 42]
    columns_to_drop = ['id', 'offense_code',
                       'offense_group', 'longitude', 'latitude', 'year']

    df = df[df['group_id'].isin(group_ids)].copy()
    df.drop(columns_to_drop, axis=1, inplace=True)

    X = df[['hour', 'day_of_week', 'month', 'tract_id', 'grid_id']]
    y = df['group_id']

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=9)

    model = RandomForestClassifier(n_estimators=10)
    model.fit(X_train, y_train)

    app.run(host='0.0.0.0', port=FLASK_PORT)
