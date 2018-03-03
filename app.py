
from flask import Flask, jsonify, render_template
import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, desc 
import pandas as pd
import json
from customfunctions import addGeoJson, region
from sqlalchemy.sql import func
import operator

engine = create_engine("sqlite:///Merged_Drivers_Data.sqlite")

Base = automap_base()
Base.prepare(engine, reflect=True)
merged_drivers_data = Base.classes.merged_drivers_data


session = Session(engine)

app = Flask(__name__)

accidents_df = pd.read_csv("./cleaned_accidents_data.csv")

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
    return jsonify(death_df.to_dict(orient="records"))

@app.route("/death_per_population_region")
def death_per_region():
    death_result = session.query(merged_drivers_data.state,merged_drivers_data.deaths_per_hunderd_thousand,merged_drivers_data.population
).all()
    death_df = pd.DataFrame(death_result, columns=['state', 'deaths','popoulation'])
    death_df.sort_values("deaths",axis = 0,ascending=False,inplace=True)
    death_df.drop(death_df[death_df['state'] == "District of Columbia"].index, inplace=True)
    death_df['Region'] = death_df.apply(region,axis=1)
    death_df = death_df.groupby('Region').sum()
    return jsonify(death_df)


@app.route("/leaflet_deaths_miles")
def death_miles():
    deaths_miles = session.query(merged_drivers_data.state,merged_drivers_data.deaths_per_hunderd_thousand).all()
    
    # deaths_df = pd.DataFrame(deaths_miles, columns=('state','deaths_per_hundred_million_miles_traveled'))
    result_deaths = addGeoJson(deaths_miles)
    return jsonify(result_deaths)

@app.route("/deaths_ranking")
def death_rankings():
   # Return the speeding result per state
   death_result = session.query(merged_drivers_data.state,merged_drivers_data.deaths_per_hunderd_thousand,merged_drivers_data.population
).all()
   death_df = pd.DataFrame(death_result, columns=['state', 'deaths','popoulation'])
   death_df.sort_values("deaths",axis = 0,ascending=False,inplace=True)
   death_df.drop(death_df[death_df['state'] == "District of Columbia"].index, inplace=True)
   death_df = death_df.iloc[:5,:2]
   death_df["ranking"] = [1,2,3,4,5]
   death_df = death_df[['ranking','state','deaths']]
   return jsonify(death_df.to_dict(orient="records"))

@app.route("/map.html")
def map_html():
    return render_template("map.html")

@app.route("/accidents_map")
def accidents_map():
    return jsonify(accidents_df.to_dict(orient = "records"))

@app.route("/new_map.html")
def new_map():
    return render_template("new_map.html")

#PH Analysis for Pie Chart: % of Total Fatalities owned by each State
@app.route("/fancy_pie_chart")
def fancy():

     

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
