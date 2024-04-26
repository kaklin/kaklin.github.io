---
title: Distances Between Ports
layout: side
categories: side
tags:
---

An exercise in using regular expressions and making a simple dataset.

TL;DR: Find the repo on [Github](https://github.com/kaklin/sea-routes).

I recently got involved in a project which had me trying to estimate the CO2 emissions for goods shipped worldwide. Since so many goods are moved around on giant container ships, I was looking for a way to estimate the distance between large ports. A quick search later, I came across [_Distances Between Ports (Pub. 151)_](https://msi.nga.mil/api/publications/download?key=16694076/SFH00000/Pub151bk.pdf&type=view).

> ![PUB. 151 Front Cover](/assets/posts/2018-03-11-sea-routes/distances-between-ports-front-cover.jpg)

The document is a long list of all the major ports, with distances to other nearby ports and _Junction Points_. The Junction Points help consolidate routes, making it practical to publish this in print format, coming in at 100-odd pages.

Unfortunately, this PDF format is far from ideal if you want to use a script to calculate anything.

Fortunately, with a quick copy--paste into a text editor, it's possible to get all the text out, more or less ready for some [Regular Expression](https://xkcd.com/208/) parsing.

With a quick python script we can change this:

> ![junction points example](/assets/posts/2018-03-11-sea-routes/ports_example.png)

into this:

```json
"Aaiun, Western Sahara": {
  "destinations": {
    "Arrecife de Lanzarote, Canary Islands": 111.0, 
    "Casablanca, Morocco": 506.0, 
    "Dakar, Senegal": 793.0, 
    "Monrovia, Liberia": 1525.0, 
    "New York, New York, U.S.A.": 3065.0, 
    "Porto Grande, Cape Verde Islands": 887.0
  }, 
  "junctions": {
    "Bishop Rock, England": 1397.0, 
    "Cape of Good Hope, South Africa": 4436.0, 
    "Fastnet Rock, Ireland": 1465.0, 
    "Grand Banks South": 2003.0, 
    "Ile d’Ouessant, France": 1356.0, 
    "Inishtrahull, Ireland": 1753.0, 
    "Panama, Panama": 3894.0, 
    "Pentland Firth, Scotland": 2006.0, 
    "Punta Arenas, Chile": 5684.0, 
    "Strait of Gibraltar": 667.0, 
    "Straits of Florida": 3712.0
  }, 
  "location": "27°05'37\"N., 13°26'55\"W."
```

Making it easy to plot all of the ports on a map

> ![all ports](/assets/posts/2018-03-11-sea-routes/all_ports_map.png)

Likewise, and even easier, we can change this:

> ![junction points example](/assets/posts/2018-03-11-sea-routes/junction_points_old.png)

into this

```json
{
  "Bishop Rock, England": "49°45'00\"N., 6°35'00\"W.",
  "Cape Leeuwin, Australia": "34°32'00\"S., 115°08'00\"E.",
  "Cape Of Good Hope, South Africa": "34°22'00\"S., 18°23'00\"E."
}
```

> ![junction points](/assets/posts/2018-03-11-sea-routes/junction_points_map.png)

The extracted data in JSON format, together with the parser script [is available on Github](https://github.com/kaklin/sea-routes).

## Updates

Excited to see Martyn Verhaegen [implemented an A* pathfinding algorithm](https://medium.com/qwyk-technology/programmatically-finding-distances-between-ports-using-pub-151-and-a-7f2472ac14f3) on the data.
