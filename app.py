
from flask import Flask, jsonify, render_template
import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, desc 
import pandas as pd

engine = create_engine("sqlite:///Merged_Drivers_Data.sqlite")

Base = automap_base()
Base.prepare(engine, reflect=True)
merged_drivers_data = Base.classes.merged_drivers_data


session = Session(engine)

app = Flask(__name__)

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/speeding_data")
def names():
    # Return the speeding result per state
    speeding_result = session.query(merged_drivers_data.state,merged_drivers_data.speeding).all()
    speeding_df = pd.DataFrame(speeding_result, columns=['state', 'speeding'])
    speeding_df.sort_values("speeding",axis = 0,ascending=False,inplace=True)
    return jsonify(speeding_df.to_dict(orient="records"))

if __name__ == '__main__':
    app.run(debug=True)