import express from 'express'

// Maak een nieuwe express app
const server = express()

// Stel de public map in
server.use(express.static('public'))

// Stel de view engine in
server.set('view engine', 'ejs')
server.set('views', './views')

// Stel afhandeling van formulieren in
server.use(express.json())
server.use(express.urlencoded({extended: true}))

// Maak een route voor de index
server.get('/', async function (req, res) {

    const baseUrl = "https://api.buurtcampus-oost.fdnd.nl/api/v1"
    const url = ('https://api.buurtcampus-oost.fdnd.nl/api/v1/stekjes')

    // Er wordt een fetch verzoek gestuurd naar de opgegeven url.
    // Zodra er een respons is van de fetch wordt deze in JSON-formaat omgezet door de .json() methode te gebruiken.
    // De resulterende JSON-gegevens worden opgeslagen in de variabele data met behulp van de const keyword.
    // Vervolgens wordt de index pagina gerenderd met behulp van de res.render functie, waarbij de data variabele wordt doorgegeven als een parameter.
    const data = await fetch(url).then((response) => response.json())
    res.render('index', data)
})

// Route voor de stekjes page
server.get('/stekjes', (request, response) => {
    response.render('stekjes')
})

// Route voor evenementen page
server.get('/evenementen', (request, response) => {
    response.render('evenementen')
})

// Route voor de contact page
server.get('/contact', (request, response) => {
    response.render('contact')
})

// De .get()-methode wordt gebruikt om een route pad te definiëren.
server.get('/:id', (request, response) => {
    // Het externe API-eindpunt is opgeslagen in de baseUrl-variabele, terwijl de id-parameter wordt opgehaald uit de URL van de client met behulp van request.params.id.
    const baseUrl = "https://api.buurtcampus-oost.fdnd.nl/api/v1"
    let id = request.params.id
    let stekjeUrl = baseUrl + '/stekjes?id=' + id
    // de fetchJson()-functie opgeroepen, die het verzoek naar het externe API-eindpunt verzendt en wacht op een respons. Zodra de respons binnenkomt, wordt de data doorgegeven aan de response.render()-functie
    fetchJson(stekjeUrl).then((data) => {
        response.render('index', data)
    })
})

// Wanneer een client een verzoek stuurt naar het '/new'-eindpunt, zal de response.render()-functie worden opgeroepen.
server.get('/new', (request, response) => {
    response.render('admin')
})

server.post('/new', (request, response) => {
    // Het samenvoegen van de juiste API-eindpunten in de url-variabele.
    const baseUrl = "https://api.buurtcampus-oost.fdnd.nl/api/v1"
    const url = baseUrl + '/stekjes'
    // request.body.aanmelddatum gedefinieerd als de huidige datum en tijd in een ISO-string-formaat met behulp van toISOString().
    request.body.aanmelddatum = (new Date()).toISOString();
    // postJson()-functie opgeroepen, die een HTTP POST-verzoek verzendt naar de opgegeven API-eindpunt en wacht op een respons. De postJson()-functie stuurt de gegevens uit het POST-verzoek op als JSON-geformatteerde gegevens in de request.body.
    postJson(url, request.body).then((data) => {
        let newStekje = {...request.body}

        // Als het POST-verzoek succesvol was, wordt de client doorverwezen naar het hoofdmenu van de webapplicatie, zoals aangegeven door response.redirect('/').
        if (data.success) {
            response.redirect('/')

            // Als het POST-verzoek niet succesvol was, wordt er een foutbericht gegenereerd met behulp van de inhoud van de respons.
        } else {
            const errormessage = `${data.message}: Mogelijk komt dit door de slug die al bestaat.`
            // De newStekje variabele wordt gedefinieerd om een kopie van de gegevens van het POST-verzoek te bevatten, en deze variabele wordt gebruikt in de response.render()-functie om ervoor te zorgen dat de gebruiker zijn oorspronkelijke invoer kan zien nadat de foutmelding is weergegeven.
            const newdata = {error: errormessage, values: newStekje}
            console.log(data)
            console.log(JSON.stringify(data))
            response.render('admin', newdata)
        }
    })
})

// Stel het poortnummer in
server.set('port', 8000)

// Start met luisteren naar binnenkomende HTTP-verzoeken op een bepaalde poort.
// De server.get('port') functie haalt de waarde van de poort op die eerder is ingesteld met behulp van de server.set('port', value) functie.
server.listen(server.get('port'), () => {
    console.log(`Application started on http://localhost:${server.get('port')}`)
})

/**
 * Wraps the fetch api and returns the response body parsed through json
 * @param {*} url the api endpoint to address
 * @returns the json response from the api endpoint
 */
async function fetchJson(url) {
    return await fetch(url)
        .then((response) => response.json())
        .catch((error) => error)
}

// De fetchJson()-functie gebruikt de fetch()-functie om een HTTP GET-verzoek naar de opgegeven URL te versturen en wacht vervolgens op een respons.
// Het gebruik van de async en await-sleutelwoorden zorgt ervoor dat de functie zal wachten totdat het HTTP-verzoek voltooid is voordat het resultaat geretourneerd wordt.

/**
 * postJson() is a wrapper for the experimental node fetch api. It fetches the url
 * passed as a parameter using the POST method and the value from the body paramater
 * as a payload. It returns the response body parsed through json.
 * @param {*} url the api endpoint to address
 * @param {*} body the payload to send along
 * @returns the json response from the api endpoint
 */
export async function postJson(url, body) {
    return await fetch(url, {
        method: 'post', body: JSON.stringify(body), headers: {'Content-Type': 'application/json'},
    })
        .then((response) => response.json())
        .catch((error) => error)
}

// Deze code definieert een asynchrone JavaScript-functie genaamd postJson. Deze functie verstuurt een HTTP POST-verzoek naar de opgegeven URL met behulp van de fetch()-functie van de browser-API.
// De functie postJson accepteert twee parameters: url (de URL waarnaar het verzoek moet worden verzonden) en body (een JavaScript-object dat de gegevens bevat die moeten worden verzonden).
// De functie wacht op de respons van de server en gebruikt vervolgens de .json() methode om de JSON-geformatteerde gegevens van de respons te extraheren.










