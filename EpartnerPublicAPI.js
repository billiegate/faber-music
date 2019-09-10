class PublicAPI {


    constructor(epartnerName, epartnerSecret) {
        super()
        this.apiURL = "http://www.epartnershub.com/api/"
        this.epartnerName = epartnerName
        this.epartnerSecret = epartnerSecret
        this.queryParameters = {}
    }

    Respond_or_DetectServerFailure(response, asXML = true) {
		// detect a typical ASP webserver error page (could be something wrong on Faber's side).
        if ( response.indexOf('<html>') !== -1 && response.indexOf('</html>') !== -1 && response.indexOf('<body>') !== -1 && response.indexOf('</body>') !== -1) {
            return this.OutputError("Undefined error. Public API server encountered an un-defined error. Please try again.", asXML)
        }
        // no generic errors, so forward the output (note: still could be an xml error message)
		if ( asXML == true ) {
            // return the result as a raw XML string
			return response
        } else {
			try {
				// now parse the resulting XML into a keyed array
				domObj = new xmlToArrayParser(response) 
				return domObj.array()
            } catch {
                return this.OutputError("Undefined error. Public API server encountered an un-defined error. Please try again.", asXML)
            }
        }
    }


    async PerformQuery(apiCall, signed = false, asXML = false, getSet = "GET") {
        // start with blank query string
        let qps = "", url
        // add epartner parameter if not already present
		let epartnerAdded = false
		for ( let i in this.queryParameters ) {
            if( i == "epartner" ) {
                epartnerAdded = true
            }
        }
			

		if( !epartnerAdded) {
            this.queryParameters["epartner"] = this.epartnerName
        }

        if( !this.queryParameters ) {
            _queryParameters = Object.keys(this.queryParameters).sort()
            let x = []
            for( let k in _queryParameters ) {
                x.push(k + "=" + _queryParameters[k])
            }
            qps = encodeURI(x.join("&"))
        }

        if( signed == true ) {
			sqps = "key=" + this.epartnerSecret + "&" + qps
			_hash = hashlib.md5(sqps.encode()).hexdigest()
            qps = qps + "&hash=" + _hash
        }

        // if $apiCall is "Download", return URL and skip cURL connection
		if( apiCall === "download" ) {
            url = this.apiURL + apiCall + ".aspx?" + qps
            return url
        }
            
        
        url = ( getSet == "GET" ) ? this.apiURL + apiCall + ".aspx?" + qps : this.apiURL + apiCall + ".aspx"

        let r = await $.ajax({
            url: url,
            type: getSet,
            success: function(r){

            }
        })
        
        return this.Respond_or_DetectServerFailure(r.content, asXML)
    }
    

    ClearQueryParameters() {
        this.queryParameters = {}
    }

    OutputError(message, asXML){
        xml = '<Response status="failed" ><Error><Code></Code><Description>' + message + '</Description></Error></Response>'
        if (asXML == true) {
            return xml
        } else {
            domObj = new xmlToArrayParser(xml)
            return domObj.array()
        }
    }

    CheckStatus() {
        this.ClearQueryParameters()
        let response = null
        try {
            response = this.PerformQuery("check-status", false)
        } catch {
            response = false
        }

        return !response ? false : true
    }

    RecordSaleWithType(country, currency, customerName, itemID, itemPrice, orderTotal, packageID, packagePrice, quantity, orderReference, itemType, asXML = false) {
		// first check that the API is live
		if (!this.CheckStatus()) {
            return this.OutputError("The API server appears to be down.", asXML)
        }

        this.queryParameters = {
            "country": country,
            "currency": currency,
            "customer-name": customerName,
            "item": itemID,
            "item-price": itemPrice,
            "order-total": orderTotal,
            "package": packageID,
            "package-price": packagePrice,
            "quantity": quantity,
            "reference": orderReference,
            "type": itemType
        }

        return this.PerformQuery("request-delivery", true, asXML)
    }

    GetUrl(saleID, asXML = false) {
        // first check that the API is live
		if ( !this.CheckStatus() ) {
            return this.OutputError("The API server appears to be down.", asXML)
        }
		// all is well so let's perform the query
		this.ClearQueryParameters()
        this.queryParameters = {"sale": saleID}
        return this.PerformQuery("get-url", true, asXML)
    }

    getFulfillmentStatus(orderReference, asXML = false){
		// first check that the API is live
		if(!this.CheckStatus()) {
            return this.OutputError("The API server appears to be down.", asXML)
        }
		// all is well so let's perform the query
		this.ClearQueryParameters()
		this.queryParameters = {"reference": orderReference}
        return this.PerformQuery("get-fulfillment-status", true, asXML)
    }

    GetUrl_FlashFree(saleID, asXML = False) {
		// first check that the API is live
		if (!this.CheckStatus()) {
            return this.OutputError("The API server appears to be down.", asXML)
        }
		//all is well so let's perform the query
		this.ClearQueryParameters()
        this.queryParameters = {"sale": saleID}
        return this.PerformQuery("get-url-flash-free", true, asXML)
    }

    Download(saleID, asXML = False) {
        // first check that the API is live
		if (!this.CheckStatus()) {
            return this.OutputError("The API server appears to be down.", asXML)
        }
        //all is well so let's perform the query
		this.ClearQueryParameters()
		this.queryParameters = {"sale": saleID}
		return this.PerformQuery("download", true, asXML)
    }


    RequestDelivery(customerName, deliveryFirstName, deliveryLastName, deliveryOrganisation, deliveryAddressLine1, deliveryAddressLine2, deliveryCity, deliveryState, deliveryPostCode, deliveryCountryCode, orderReference, asXML = false)
    {
        // first check that the API is live
		if(!this.CheckStatus()) {
            return this.OutputError("The API server appears to be down.", asXML)
        }
        // all is well so let's perform the query
		this.ClearQueryParameters()
        this.queryParameters = {
            "customer-name": customerName,
            "delivery-firstname": deliveryFirstName,
            "delivery-lastname": deliveryLastName,
            "delivery-organisation": deliveryOrganisation,
            "delivery-line1": deliveryAddressLine1,
            "delivery-line2": deliveryAddressLine2,
            "delivery-city": deliveryCity,
            "delivery-state": deliveryState,
            "delivery-postcode": deliveryPostCode,
            "delivery-countrycode": deliveryCountryCode,
            "reference": orderReference
        }
		return this.PerformQuery("request-delivery", true, asXML)
    }


    getFulfillmentStatus(orderReference, asXML = false) {
        // first check that the API is live 
		if(!this.CheckStatus()){
            return this.OutputError("The API server appears to be down.", asXML)
        }
        // all is well so let's perform the query"""
		this.ClearQueryParameters()
		this.queryParameters = {"reference": orderReference}
		return this.PerformQuery("get-fulfillment-status", true, asXML)
    }
    
}

class xmlToArrayParser {
    constructor(xml) {
        super()
        this._array = xml
    }

    array() {
        let x = $.parseXML(this._array)
        let obj = {}
        $(x).find('*').each( function() {
            obj[this.nodeName] = $(this).text
        })
        return obj
    }
    
}