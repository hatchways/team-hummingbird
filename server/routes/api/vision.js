const express = require("express");
const visionRouter = express.Router();
const vision = require('@google-cloud/vision')
const fs = require('fs')
const https = require('https')
const auth = require("../../middleware/auth");

const client = new vision.ImageAnnotatorClient();
const testImg = "https://hatchways-hummingbird.s3.amazonaws.com/1590245137718image-2.png"


//Google does not guarantee remote links can be fetched, files must be local or 
//hosted on google cloud to ensure it works, this function downloads photos to /temp
//before sending them to google. 
const saveImage = (url, googleFn) => {
    let image_path = './temp/' + Date.now() + '.jpg';
    console.log('Downloading: ' + url)
    const file = fs.createWriteStream(image_path)
    const request = https.get(url, (response) => {
        response.pipe(file)
    })
    const googleResponse = file.on('finish', () => {
        const path = image_path.replace("./", "")
        googleFn(path)
        //remove the file
        fs.unlinkSync(image_path)
    })
    return googleResponse
}



visionRouter.get('/generalImageProps', auth, async (req, res) => {
    //mostly just returns color & cropping info. Nothing too exciting
    const { imgURL = testImg } = req.query

    const okGoogle = async (downloadedImg) => {
        const [result] = await client.imageProperties(downloadedImg)
        if (result.error) {
            res.status(500).json("something went wrong, please try again later")
        }
        else {
            res.status(200).json(result)
        }
        return result
    }
    saveImage(imgURL, okGoogle)
})

visionRouter.get('/detectLabels', auth, async (req, res) => {
    const { imgURL = testImg } = req.query
    const okGoogle = async (downloadedImg) => {
        const [result] = await client.labelDetection(downloadedImg)
        if (result.error) {
            res.status(500).json("Something went wrong, please try again")
        }
        else {
            const labels = result.labelAnnotations
            console.log('Labels:')
            labels.forEach(label => console.log(label.description))
            res.status(200).json({ labels })
        }
    }
    saveImage(imgURL, okGoogle)
})

visionRouter.get('/detectLogos', auth, async (req, res) => {

    //test image with 10 logos
    const logoTest = "https://hatchways-hummingbird.s3.amazonaws.com/1591743074124-Top-10-Famous-Logos-1.jpg"
    const { imgURL = logoTest } = req.query
    const okGoogle = async (downloadedImg) => {
        const [result] = await client.logoDetection(downloadedImg)
        const logos = result.logoAnnotations
        if (result.error) {
            res.status(500).json("something went wrong, try again later")
        }
        else {
            res.status(200).json(logos)
            console.log('Logos detected:')
            logos.forEach(logo => console.log(logo.description))
        }

    }
    saveImage(imgURL, okGoogle)
})

visionRouter.get('/detectExplicit', auth, async (req, res) => {
    const { imgURL } = req.query
    const okGoogle = async (downloadedImg) => {
        const [result] = await client.safeSearchDetection(downloadedImg)
        console.log(result)
        if (result.error) {
            res.status(500).json("something went wrong, try again later")
        } else {
            const detected = result.safeSearchAnnotation
            res.status(200).json({ detected })
        }
    }
    saveImage(imgURL, okGoogle)
})


module.exports = visionRouter