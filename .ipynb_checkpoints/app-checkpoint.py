
from flask import Flask, jsonify, render_template
import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, desc 
import pandas as pd
import json
from customfunctions import addGeoJson, region

engine = create_engine("sqlite:///Merged_Drivers_Data.sqlite")

Base = automap_base()
Base.prepare(engine, reflect=True)
merged_drivers_data = Base.classes.merged_drivers_data


session = Session(engine)

app = Flask(__name__)

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/deaths_per_population")
def names():
    # Return the speeding result per state
    death_result = session.query(merged_drivers_data.state,merged_drivers_data.deaths_per_hunderd_thousand,merged_drivers_data.population
).all()
    death_df = pd.DataFrame(death_result, columns=['state', 'deaths','popoulation'])
    death_df.sort_values("deaths",axis = 0,ascending=False,inplace=True)
    death_df.drop(death_df[death_df['state'] == "District of Columbia"].index, inplace=True)
    death_df['Region'] = death_df.apply(region,axis=1)
    return jsonify(death_df.to_dict(orient="records"))

@app.route("/leaflet_deaths_miles")
def death_miles():
    deaths_miles = session.query(merged_drivers_data.state,merged_drivers_data.deaths_per_hunderd_thousand).all()
    
    # deaths_df = pd.DataFrame(deaths_miles, columns=('state','deaths_per_hundred_million_miles_traveled'))
    result_deaths = addGeoJson(deaths_miles)
    return jsonify(result_deaths)

@app.route("/map.html")
def map_html():
    return render_template("map.html")

if __name__ == '__main__':
    app.run(debug=True)