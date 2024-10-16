const express = require('express');

// its a middleware, to upload the files to a server
const multer = require('multer');

const fs = require('fs');
const path = require('path');

//to scrap the web applications
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const port = 5000;

const app = express();

//where to upload the files,pass the folder name
const upload = multer({ dest: 'uploads/' });

// app.use(express.json());
// app.use(express.static('public'));

const getText = (element) => {
    var text = "";
    element.childNodes.forEach((node) => {
        if (node.nodeType === 3) {
            text += node.nodeValue.trim();
        }
    })
    return text;
}

const parentNodes = () => {
    const parent = Array.from(allElements).filter((element) => element.children.length > 0);
    return parent;
}

app.post('/api/upload', upload.array('files'), async (req, res) => {
    try {
        const files = req.files;
        for (let file of files) {
            if (path.extname(file.originalname) === '.html' || path.extname(file.originalname) === '.aspx') {
                const htmlContent = fs.readFileSync(file.path, 'utf-8');
                const dom = new JSDOM(htmlContent);

                const allElements = Array.from(dom.window.document.querySelectorAll('form *'));
                const parentElements = parentNodes();

                const elements = allElements.map((element) => (
                    {
                        tag: element.tagName.toLowerCase(),
                        text: getText(element),
                        attributes: Array.from(element.attributes).reduce((attrs, attr) => {
                            attrs[attr.name] = attr.value;
                            return attrs;
                        }, {})
                    }))
                console.log(elements);
                const jsonFilePath = path.join('json_output', path.basename(file.originalname, 'html') + 'json');
                fs.writeFileSync(jsonFilePath, JSON.stringify(elements, null, 2));

            }//clean up the uploaded files
            fs.unlinkSync(file.path);
        } res.send('Files processed successfully!')
    } catch (error) {
        console.error("error while reading the files:", error)
        res.status(500).send("error while reading the files")
    }
})

// http://localhost:5000

app.listen(port, () => { console.log(`server is running on http://localhost:${port}`) });