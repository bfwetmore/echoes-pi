const express = require('express');
const piData = require('./echoesPI.json');
const {response} = require("express");

const app = express();
app.set('view engine', 'pug');

let constellationArray;
let materialsArray = getMaterials();
let regionArray = regionFilter();
let selectedRegion = '';
let selectedConstellation;
let selectedMaterials;
let selectedResults;

function regionFilter() {
    let set = new Set();
    piData.forEach((data) => {
        set.add(data.Region);
    });
    return [...set].sort();
}

function constellationFilter() {
    let set = new Set();
    piData.forEach((data) => {
        if (data.Region === selectedRegion) {
            set.add(data.Constellation);
        }
    });
    return [...set].sort();
}

function filterByRichness(richness, region, material, constellation) {
    let set = new Set();
    piData.forEach((systemObject) => {
        if (systemObject.Region === region && systemObject.Resource === material && systemObject.Constellation === constellation) {
            for (let i = 0; i < richness.length; i++) {
                if (systemObject.Richness === richness[i]) {
                    set.add(systemObject);
                }
            }
        }
    });
    return [...set];
}

function getMaterials() {
    let set = new Set();
    piData.forEach((systemObject) => {
        set.add(systemObject.Resource);
    });
    return [...set].sort();
}



app.use(express.urlencoded());

app.get('/', (req, res) => {
    res.render('index', {regionArray});
});

app.post('/', (req, res) => {
    selectedRegion = req.body.region;
    res.redirect('/constellation');
});

app.get('/constellation', (req, res)=>{
    res.locals.region = selectedRegion
    constellationArray = constellationFilter()
    res.render('constellation', {constellationArray, regionArray})
})

app.post('/constellation', (req, res)=>{
    selectedConstellation = req.body.constellation
    res.redirect('materials')
})

app.get('/materials', (req, res) => {
    res.locals.region = selectedRegion;
    res.locals.constellation = selectedConstellation
    if (selectedRegion === '') {
        res.redirect('/')
    }
    res.render('materials', {regionArray, materialsArray, constellationArray});
});

app.post('/materials', (req, res) => {
    selectedMaterials = req.body.piMaterial;
    res.redirect('/richness');
});

app.get('/richness', (req, res) => {
    res.locals.region = selectedRegion;
    res.locals.constellation = selectedConstellation
    res.locals.material = selectedMaterials;
    res.render('richness', {regionArray, materialsArray, constellationArray});
});

app.post('/richness', (req, res, next) => {
    let selectedRichness = Object.getOwnPropertyNames(req.body);
    selectedResults = filterByRichness(selectedRichness, selectedRegion, selectedMaterials, selectedConstellation);
    res.redirect('/results');
});

app.get('/results', (req, res) => {
    res.locals.region = selectedRegion;
    res.locals.constellation = selectedConstellation
    res.locals.material = selectedMaterials;
    res.render('results', {regionArray, materialsArray, selectedResults, constellationArray});
});

app.listen(process.env.PORT || 3000, () => {
    console.log('Server has started on Port 3000');
    console.log(selectedRegion);
});
