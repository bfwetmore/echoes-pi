const express = require('express');
const piData = require('./echoesPI.json');
const {response} = require("express");

const app = express();
app.set('view engine', 'pug');

function regionFilter() {
    let set = new Set();
    piData.forEach((data) => {
        set.add(data.Region);
    });
    console.log([...set].length);
    return [...set].sort();
}

function filterByRichness(richness, region, material) {
    let set = new Set();
    piData.forEach((systemObject) => {
        if (systemObject.Region === region && systemObject.Resource === material) {
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

let materialsArray = getMaterials();
let regionArray = regionFilter();
let selectedRegion = '';
let selectedMaterials;
let selectedResults;

app.use(express.urlencoded());

app.get('/', (req, res) => {
    res.render('index', {regionArray});
});

app.post('/', (req, res) => {
    selectedRegion = req.body.region;
    //if (selectedRegion !== '') {
    res.redirect('/materials');
    // }
});

app.get('/materials', (req, res) => {
    res.locals.region = selectedRegion;
    if (selectedRegion === '') {
        res.redirect('/')
    }
    res.render('materials', {regionArray, materialsArray});
});

app.post('/materials', (req, res) => {
    selectedMaterials = req.body.piMaterial;
    res.redirect('/richness');
});

app.get('/richness', (req, res) => {
    res.locals.region = selectedRegion;
    res.locals.material = selectedMaterials;
    res.render('richness', {regionArray, materialsArray});
});

app.post('/richness', (req, res, next) => {
    let selectedRichness = Object.getOwnPropertyNames(req.body);
    selectedResults = filterByRichness(selectedRichness, selectedRegion, selectedMaterials);
    res.redirect('/results');
});

app.get('/results', (req, res) => {
    res.locals.region = selectedRegion;
    res.locals.material = selectedMaterials;
    res.render('results', {regionArray, materialsArray, selectedResults});
});

app.listen(process.env.PORT || 3000, () => {
    console.log('Server has started on Port 3000');
    console.log(selectedRegion);
});
