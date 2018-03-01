
from flask import Flask, jsonify, render_template
import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.sql import func 
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, desc, inspect 
import pandas as pd
import operator
import json

def addGeoJson(self):
    with open('states.json') as f:
        data = json.load(f)

    state_coordinates = []
    states = []

    for x in range(len(data['features'])):
        state_coordinates.append(data['features'][x]['geometry'])
        states.append(data['features'][x]['properties']['name'])

    geojson_df = pd.DataFrame({'state':states,'state Coordinates':state_coordinates})
    result_df = geojson_df.merge(self,on="state")
    return result_df

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

@app.route("/leaflet_deaths_miles")
def death_miles():
    deaths_miles = session.query(merged_drivers_data.state,merged_drivers_data.deaths_per_hundred_million_miles_traveled).all()
    
    deaths_df = pd.DataFrame(deaths_miles, columns=('state','deaths_per_hundred_million_miles_traveled'))
    result_deaths = addGeoJson(deaths_df)
    return jsonify(result_deaths.to_dict(orient="records"))

#PH Analysis for Pie Chart: % of Total Fatalities owned by each State
@app.route("/fancy_pie_chart")
def fancy():

        engine = create_engine("sqlite:///Merged_Drivers_Data.sqlite")

        Base = automap_base()
        Base.prepare(engine, reflect=True)
        merged_drivers_data = Base.classes.merged_drivers_data

        session = Session(engine)
        inspector = inspect(engine)
        columns = inspector.get_columns('merged_drivers_data')
        for column in columns:
            print(column["name"], column["type"])

        total_fatalities = session.query(func.sum(merged_drivers_data.fatal_crashes)).all()
        print(total_fatalities)

        query_results = session.query(merged_drivers_data)

        state_list=[]
        percentage_of_fatalities_owned_per_state=[]
        for state in query_results:
            state_list.append(state.state)
            percentage_of_fatalities_owned_per_state.append(round(((state.fatal_crashes/34439)*100),2))
            print(state_list)
            print(percentage_of_fatalities_owned_per_state)

        keys = state_list
        values = percentage_of_fatalities_owned_per_state
        pie_chart_dict = dict(zip(keys, values))
        print(pie_chart_dict)

        sorted_dict = sorted(pie_chart_dict.items(), key=operator.itemgetter(1), reverse=True)
        print(sorted_dict)

        sorted_df = pd.DataFrame(sorted_dict, columns=['state', 'percentages'])

        new_df_with_other = sorted_df.append({'state': 'Other', 'percentages' : 57.58}, ignore_index=True)

        df_pie_groupings = new_df_with_other.sort_values('percentages', ascending=False)

        final_pie_df = df_pie_groupings[df_pie_groupings['percentages'] > 3]

        return jsonify(final_pie_df.to_dict(orient="records"))


if __name__ == '__main__':
    app.run(debug=True)