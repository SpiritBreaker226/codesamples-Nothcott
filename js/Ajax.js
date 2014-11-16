//holds the RSA keys for Encrypt
var radRSAKey = {
	RSAPubKey_N: "b3f80a6b220fdaa6c08dc4dbccf1c76fdb0acfd3e5fee420797838c1c8a76849e69acdb0ebb55318f488a968335dbe0e0730f8e927ff0212c8715a5aef5bffa722b17902100e12c40b2cf65e15ea603063630887acccb9ba841fb4809b6bfbb5f61a001b7307b7fc528c51bd111e7be4082999e61fef165c4ad1503ece7d566b",
	RSAPubKey_E: "10001"
};

//checks if there is a connection
function checkConnection()
{
	// console.log("Connection Type: " + navigator.connection.type);
	
	//checks if the app is online
	if(navigator.connection.type === Connection.NONE)
	{
		//turns on the 404 section when there is no 
		classToggleLayer(getDocID("bodyApp"), getDocID("section404"), 'divJustHidden sectionBody', 'section');

		//Set timer to try again automiclly.
		setTimeout(function()
		{
			//reloads the page again
            window.location = 'index.html';
		}, 5000);

		return false;
	}//end of if

	return true;
}//end of checkConnection()

//decodes str to be a normal string in order to read it
function decodeURL(strDecode)
{
     return unescape(strDecode.replace(/\+/g, " "));
}//end of decodeURL()

//encodes str to a URL so it can be sent over the URL address
function encodeURL(strEncode)
{
	var strResult = "";
	
	for (var intIndex = 0; intIndex < strEncode.length; intIndex++)
	{
		if (strEncode.charAt(intIndex) === " ") 
			strResult += "+";
		else 
			strResult += strEncode.charAt(intIndex);
	}//end of for loop
	
	return escape(strResult);
}//end of encodeURL()

//gives the user the message has been sent or not and changes the pop area
function endMessage(tagMessage, tagBody, boolDisplayErrorMessage, strErrorMessage)
{
	//checks if there is a message if so then reset it
	if(tagMessage !== "")
		//resets the message
		displayMessage(tagMessage, "", true, true);
		
	//checks if there is a body if so then display it again
	if(tagBody !== null)
		//turn back on the body
		tagBody.style.display = '';
	
	//checks if the error message should be display	
	if(boolDisplayErrorMessage === true)
	{		
		//checks if there is a message
		if(tagMessage !== "")
			displayMessage(tagMessage, strErrorMessage, true, true);
		else
			navigator.notification.alert('Error has occur.',alertDismissed);
			
		console.log("Error Message: " + strErrorMessage);
	}//end of if
	
	//checks if there is divLoadingGrayBG is one if so then turn it off
	if(getDocID('divLoadingGrayBG').style.display === "block")
		//turns off the Loading screen and tells the user that what want wrong
		toggleLayer('divLoadingScreen', 'divLoadingGrayBG');
}//end of endMessage()

//calling coldfusion file from external site
function generateOrderFile(strFileName, tagMessage, strCartItemGrandTotalContainer, strCheckoutThankyou, tagBillingToShipToPOBox) {
    try {
        var htmlJavaServerObject = new XMLHttpRequest(); //holds the object of the server

        //Abort any currently active request.
        htmlJavaServerObject.abort();

        console.log("Generatening Order File");

        //checks if there a connection also it sets the page for send to the Server
        if (preSend(tagMessage, "Generatening Order File") === false)
           return false;

        // Makes a request
        htmlJavaServerObject.open("Post", strFileName, true);
        htmlJavaServerObject.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

        htmlJavaServerObject.onreadystatechange = function () {
            console.log("Current Ready State: " + htmlJavaServerObject.readyState + " Status " + htmlJavaServerObject.status);

            //in case there is a error with connection
            if (htmlJavaServerObject.readyState === 0 && htmlJavaServerObject.status === 200)
                //displays the message to the user and turns off the Status Lightbox
                endMessage(tagMessage, null, true, "Connection to the server is currently down");
            else if (htmlJavaServerObject.readyState === 4 && htmlJavaServerObject.status === 200) {
                try {
                    var strFromServerMassage = htmlJavaServerObject.responseText;//holds the message from the server

                    if (strFromServerMassage.indexOf("Error: ") === -1)
					{
						console.log("Message from coldfusion : " + strFromServerMassage);

						// turns off the floating totals and turns on the Thank You Message
						getDocID(strCheckoutThankyou).style.display = "block";
						$("#" + strCartItemGrandTotalContainer).addClass("divJustHidden");
						$("#sectionShipping").addClass('divJustHidden');
						$("#sectionCart").addClass('divJustHidden');

						// remove the pading when te message is because there is a hugh white space for the thank you message
						$("#" + tagMessage).removeClass("sectionStartingPostionForSectionsInCart");
					}//end of if
                    else
                        //tells the user that there is an error with the Server
                        endMessage(tagMessage, null, true, strFromServerMassage);
                }//end of try
                catch (ex) {
                    //displays the message to the user and turns off the Status Lightbox
                    endMessage(tagMessage, null, true, "Error Generatening cold fusion file: " + ex.message);
                    return false;
                }//end of catch
            }//end of if
            else if (htmlJavaServerObject.readyState === 2 && htmlJavaServerObject.status === 500) {
                //tells the user that there is an error with the Server
                endMessage(tagMessage, null, true, "Unable to connect to server");
            } //end of else if
        };//end of function()
        console.log("tagBillingToShipToPOBox.value:" + tagBillingToShipToPOBox.value);
        htmlJavaServerObject.send("customernumber=" + window.localStorage.getItem("strCustomerIdKey") + "&tagBillingToShipToPOBox=" + tagBillingToShipToPOBox.value);
    }//end of try
    catch (ex) {
        //displays the message to the user and turns off the Status Lightbox
        endMessage(tagMessage, null, true, "Error: " + ex.message);
        console.log("Error 4");
        return false;
    }//end of catch

    return true;
}//end of generateOrderFile()

//get all of the cart items
function getCartItemsList(strFileName, tagMessage, tagCartItemsDetails, tagCartItemGrandTotalContainer, tagGrandTotal) 
{
    try 
    {
        var htmlJavaServerObject = new XMLHttpRequest(); //holds the object of the server

        //Abort any currently active request.
        htmlJavaServerObject.abort();

        //reset previously selected item ids from local storage
        window.localStorage.removeItem("strCartItemIds");

        console.log("Getting Cart Items");

        //checks if there a connection also it sets the page for send to the Server
		if(preSend(tagMessage, "Getting Cart Items") === false)
			return false;

		//resets the cart body
		tagCartItemsDetails.innerHTML = "";

        // Makes a request
        htmlJavaServerObject.open("Post", strFileName, true);
        htmlJavaServerObject.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

        htmlJavaServerObject.onreadystatechange = function () {
            console.log("Current Ready State: " + htmlJavaServerObject.readyState + " Status " + htmlJavaServerObject.status);

            //in case there is a error with connection
            if (htmlJavaServerObject.readyState === 0 && htmlJavaServerObject.status === 200)
                //displays the message to the user and turns off the Status Lightbox
                endMessage(tagMessage, null, true, "Connection to the server is currently down");
            else if (htmlJavaServerObject.readyState === 4 && htmlJavaServerObject.status === 200) 
            {
                try 
                {
                    var strFromServerMassage = htmlJavaServerObject.responseText;//holds the message from the server

                    // console.log("From Server Cart Items: " + strFromServerMassage);

                    //checks if there is a message from the server
                    if (strFromServerMassage.indexOf("Error: ") === -1) 
                    {
                        //spilits each item 
                        var arrCartItemsDetails = strFromServerMassage.trim().split("!");//holds the user details

                        // console.log("Number of Cart Items List: " + arrCartItemsDetails.length);

                        //checks if there are items in the cart
                        if (arrCartItemsDetails.length > 0) 
                        {
							var strCurrShipDate = "";//holds the current shipping date
							var strShipDateID = "";//holds the combine of the numbers for month, day year to make a unqiue id for this group since there is only time this day will happen
							var strCartTotalsTemplate = "<div class='customContainer divCartItemTotalsContainer'>" + 
								"<div class='customLeft divCartItemTotalsLeft'>" + 
									"<label>{0}</label>" + 
								"</div>" + 
								"<div class='customLeft divCartItemTotalsRight'>" +
									"<label id='{1}'>${2}</label>" + 
								"</div>" + 
								"<div class='customFooter divCartItemTotalsFooter'></div>" + 
							"</div>";//holds the template for all totals that are going to be display
							var fltGrandTotal = 0.00;//holds the group totals for the cart
							var fltItemGroupSubTotal = 0.00;//holds the sub totals for this item group

                            for (var intCartItemIndex = 0; intCartItemIndex < arrCartItemsDetails.length; intCartItemIndex++) 
                            {
                                var arrCartItemDetails = arrCartItemsDetails[intCartItemIndex].split("@");
                                
                                /*
									Legend of Cart Items

									0 = swatch number
									1 = collection name
									2 = price
									3 = quantity
									4 = discount
									5 = net total
									6 = ship to date
									7 = item id
									8 = Pricing CDN
									9 = Pricing USA
									10 = Unit CDN
									11 = Unit USA
									12 = Multiplier CDN
									13 = Multiplier USA
									14 = Discount CDN
									15 = Discount USA
									16 = Sold Out CDN
									17 = Sold Out USA
									18 = Thumbnail Image
									19 = Promo Code
									20 = Order Number
									21 = ID of the Item
                                    22 = dateAdded
                                */

                                if (arrCartItemDetails.length > 0)
                                {
									var arrDateParts = arrCartItemDetails[6].substring(0, arrCartItemDetails[6].indexOf(" ")).split("/");//holds the parts of the date
                                    var strShipDate = setMonth(arrDateParts[1]) + " " + arrDateParts[0] + ", " + arrDateParts[2];//holds the shipping date from the for this item
                                    var strDiscountDisplaysInTheCart = "n/a";
                                    var intAddToCountry = 0;//holds will be add to in order to jumper to the current array index

                                    //console.log("dateAdded: " + arrCartItemDetails[22]);
                                    var arrDateAddedParts = arrCartItemDetails[22].substring(0, arrCartItemDetails[22].indexOf(" ")).split("/");//holds the parts of the date
                                    //console.log("arrDateAddedParts: " + arrDateAddedParts);
                                    var strDateAdded = setMonth(arrDateAddedParts[1]) + " " + arrDateAddedParts[0] + ", " + arrDateAddedParts[2];//holds the date added from the for this item

                                    var dateAdded = new Date(strDateAdded);
                                    var currentDate = new Date();

                                    if (dateAdded < currentDate)
                                        strDateAdded = currentDate;

									if (window.localStorage.getItem("strCustomerCountry") == "U")
										intAddToCountry++;

									// checks if there is a discount for this cart item
									if(arrCartItemDetails[3] !== 0.00)
										// refomats the discount display to a precent
										strDiscountDisplaysInTheCart = Number(arrCartItemDetails[4]).toFixed(0) + "%";
                                    
                                    //display ship date once only of it is a different date
                                    if (strCurrShipDate !== strShipDate)
                                    {
										// updates the ship Date ID
										strShipDateID = arrDateParts[0] + arrDateParts[1] + arrDateParts[0];

										// checks if there was a current date alrady meaning this is not the actully start of loading in the subtotals
										if(strCurrShipDate !== "")
										{
											// display the sub total for the group
											tagCartItemsDetails.innerHTML += String.format(strCartTotalsTemplate, "Subtotal:", "lblSubtotal" + strShipDateID, parseFloat(fltItemGroupSubTotal).toFixed(2));

											// updates the grand total with the sub total for this item group
											fltGrandTotal += fltItemGroupSubTotal;

											// resets the sub total for the next group
											fltItemGroupSubTotal = 0.00;
										}// end of if

										// sets the header for this group of items for this date
                                        tagCartItemsDetails.innerHTML += "<div class='customContainer divCartItemShippingDateContainer'>\n" + 
											"<div class='customLeft divCartItemShippingDateLeft'>\n" + 
												"<div class='customContainer divFabricDetailsHeaderDateContainer'>\n" + 
													"<div class='customLeft divFabricDetailsHeaderDateLeft'>\n" + 
														"<label>Ship Date:</label>\n" + 
													"</div>\n" + 
													"<div class='customLeft divFabricDetailsHeaderDateRight'>\n" + 
														"<a href='javascript:void(0);' id='aCartShippingDate" + strShipDateID + "' onClick='selectedShippingDate(new Date(&quot;" + strShipDate + "&quot;), &quot;aCartShippingDate" + strShipDateID + "&quot;, &quot;aResetCartShippingDate" + strShipDateID + "&quot;, &quot;" + tagMessage + "&quot;, false, new Date(&quot;" + strDateAdded + "&quot;));' class='aCartShippingDate'>{0}</a>\n" +
														"<a href='javascript:void(0);' id='aResetCartShippingDate" + strShipDateID + "' onClick='selectedShippingResetDate(new Date(&quot;" + strShipDate + "&quot;), &quot;aCartShippingDate" + strShipDateID + "&quot;, &quot;aResetCartShippingDate" + strShipDateID + "&quot;);' class='aOrangeLink divJustHidden'>Reset</a>\n" + 
													"</div>\n" + 
													"<div class='customFooter divFabricDetailsHeaderDateFooter'></div>\n" + 
												"</div>\n" + 
											"</div>\n" + 
											"<div class='customLeft divCartItemShippingDateRight'>\n" + 
												"<label>Special Instructions: </label>\n" + 
												"<input type='text' maxlength='40' class='txtOrderSpecial' id='txtSpecial1" + strShipDateID + "'>\n" + 
												"<label class='lblOrderSpecial divJustHidden' id='lblSpecial1" + strShipDateID + "'></label>\n" + 
												"<input type='text' maxlength='40' class='txtOrderSpecial' id='txtSpecial2" + strShipDateID + "'>\n" + 
												"<label class='lblOrderSpecial divJustHidden' id='lblSpecial2" + strShipDateID + "'></label>\n" + 
											"</div>\n" + 
											"<div class='customFooter divCartItemShippingDateFooter'></div>\n" + 
										"</div>\n\n";

										// checks if this is the first item in order to get the shipping date
										if(intCartItemIndex === 0) {
											// sets the first date the shimppment will go out
											window.localStorage.setItem("strOrderStartDate", strShipDate);

											// sets the order number for this order
											window.localStorage.setItem("strOrderID", arrCartItemDetails[20]);
										}// end of if

										// sets the shipping date picker since here because the cart group items header needs to be created on run time
										tagCartItemsDetails.innerHTML = String.format(tagCartItemsDetails.innerHTML, setShippingDate(new Date(strShipDate), getDocID("aCartShippingDate" + strShipDateID), getDocID("aResetCartShippingDate" + strShipDateID)));

                                        // updates the current shipping date
                                        strCurrShipDate = strShipDate;
                                    }// end of if

                                    // display rest of the details of item
                                    tagCartItemsDetails.innerHTML += String.format("<div class='divCartItemBodyContainer'>" + 
											"<div class='customLeft divCartItemBodyLeft'>" + 
												"<img src='http://northcott.com/swatchimages/{0}.jpg' alt='{1}' width='190' />" + 
											"</div>" + 
											"<div class='customMiddle divCartItemBodyMiddle'>" + 
												"<label>{0}</label>" + 
											"</div>" +
											"<div class='customMiddle divCartItemBodyMiddle'>" + 
												"<label>{1}</label>" +  
											"</div>" +
											"<div class='customMiddle divCartItemBodyMiddle'>" + 
												"<label>${2}</label>" +  
											"</div>" +
											"<div class='customMiddle divCartItemBodyMiddle'>" + 
												"{8}" + 
											"<label id='lblQTY{11}{9}' class='divJustHidden lblFabricQTY'>{3}</label>" +
												"<label> {7}(s)</label>" + 
											"</div>" +
											"<div class='customMiddle divCartItemBodyMiddle'>" + 
												"<label>{4}</label>" +  
											"</div>" +
											"<div class='customMiddle divCartItemBodyMiddle'>" + 
												"<label>${5}</label>" +  
											"</div>" +
											"<div class='customLeft divCartItemBodyRight cartAction'>" +
												"<a href='javascript:void(0);' onclick='removeCartItem(&quot;{10}&quot;, &quot;{1}&quot;, {6});' class='aOrangeLink'>Remove</a>" +
                                                "<input type='checkbox'  id='chkRemove{6}' onchange='SetItemIdForRemoveFromCart({6});'>" +
											"</div>" +
											"<div class='customFooter divCartItemBodyFooter'></div>" +
										"</div>", arrCartItemDetails[0], arrCartItemDetails[1], arrCartItemDetails[2], parseInt(arrCartItemDetails[3]), strDiscountDisplaysInTheCart, arrCartItemDetails[5], arrCartItemDetails[7], arrCartItemDetails[10 + intAddToCountry], createFabricQTYSelector(parseInt(arrCartItemDetails[12 + intAddToCountry]), strShipDateID, intCartItemIndex, parseInt(arrCartItemDetails[3]), "onChange='javascript:updateFabricQTY(window.localStorage.getItem(&quot;strDomainName&quot;) + &quot;/ASP/AppUpdateQTYCartItem.aspx&quot;, &quot;" + tagMessage +"&quot;, " + arrCartItemDetails[21] + ", getDocID(&quot;ddlFabricQTY" + intCartItemIndex + strShipDateID + "&quot;));", parseInt("0")), strShipDateID, tagMessage, intCartItemIndex);

                                    // adds to the sub total for this group
                                    fltItemGroupSubTotal += parseFloat(arrCartItemDetails[5]);
                                }//end of if
                            }//end of for loop

                            // display the sub total for the group
							tagCartItemsDetails.innerHTML += String.format(strCartTotalsTemplate, "Subtotal:", "lblSubtotal" + strShipDateID, parseFloat(fltItemGroupSubTotal).toFixed(2));

							// updates the grand total with the sub total for the last item group
							fltGrandTotal += fltItemGroupSubTotal;

							// displays the total of the cart
							tagGrandTotal.innerHTML = "$" + parseFloat(fltGrandTotal).toFixed(2);

							//turns on the grand total container scrolling
							$("#" + tagCartItemGrandTotalContainer.id).removeClass('divJustHidden');

                            // displays the sectionCart
                            changeCheckoutSections("Cart");
                        }//end of if
                    }//end for if
                    else {
                    	// checks if there is the basic error of not items in cart if so then add in a link to contiune shopping instead
						if(strFromServerMassage === "Error: You have no items in your cart")
							getDocID(tagMessage).innerHTML = "You have no items in your cart<br><br><a href='index.html'>Continue Shopping</a>";
						else
                        	//tells the user that there is an error with the Server
                        	endMessage(tagMessage, null, true, strFromServerMassage);
                    }// end of else
                }//end of try
                catch (ex) 
                {
                    //displays the message to the user and turns off the Status Lightbox
                    endMessage(tagMessage, null, true, "Error Cart Items From Server: " + ex.message);

                    return false;
                }//end of catch
            }//end of if
            else if (htmlJavaServerObject.readyState === 2 && htmlJavaServerObject.status === 500)
                //tells the user that there is an error with the Server
                endMessage(tagMessage, null, true, "Unable to connect to server");
        };//end of function()

        htmlJavaServerObject.send("selectedCustomer=" + window.localStorage.getItem("strCustomerIdKey"));
    }//end of try
    catch (ex)
	{
        //displays the message to the user and turns off the Status Lightbox
        endMessage(tagMessage, null, true, "Error: " + ex.message);

        return false;
    }//end of catch

    return true;
}//end of getCartItemsList()

/**
 * Gets the customer details from the database
 * @param  {Stirng}				strFileName					FileName of the Location
 * @param  {String}				tagMessage					Message of What Happen
 * @param  {Int}				strCustomerNumber			Unqiue Number Used By Northcott for its customers
 * @param  {Array of Fields}	arrIndexField				All Field objects that will be change by this function, it is in an array as they will be times that not all fields will be used.
 * @param  {Array of Fields}	arrIndexFabricDetailsHeader	All Field object For Extra that needs to go to a function
 * @return {Bool}
 */
function getCustomerDetails(strFileName, tagMessage, strCustomerNumber, arrIndexField, arrIndexFabricDetailsHeader)
{
	try 
    {
        var htmlJavaServerObject = new XMLHttpRequest(); //holds the object of the server

        //Abort any currently active request.
        htmlJavaServerObject.abort();

        console.log("Getting Customer");

        //checks if there a connection also it sets the page for send to the Server
        if(preSend(tagMessage, "Getting Customer") === false)
			return false;

        // Makes a request
        htmlJavaServerObject.open("Post", strFileName, true);
        htmlJavaServerObject.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

        htmlJavaServerObject.onreadystatechange = function () {
            console.log("Current Ready State: " + htmlJavaServerObject.readyState + " Status " + htmlJavaServerObject.status);

            //in case there is a error with connection
            if (htmlJavaServerObject.readyState === 0 && htmlJavaServerObject.status === 200)
                //displays the message to the user and turns off the Status Lightbox
                endMessage(tagMessage, null, true, "Connection to the server is currently down");
            else if (htmlJavaServerObject.readyState === 4 && htmlJavaServerObject.status === 200) 
            {
                try 
                {
                    var strFromServerMassage = htmlJavaServerObject.responseText;//holds the message from the server

                    console.log("From Customer Server Region: " + strFromServerMassage);

                    //checks if there is a message from the server
                    if (strFromServerMassage.indexOf("Error: ") === -1) 
                    {
                        var arrSelectCustomer = strFromServerMassage.trim().split("!");//holds the user details
                        
                        /*
                        
						Customer Detail Leagend

							0 = Customer Number
							1 = Company
							2 = Country (currently not being used)
							3 = First Name (Uppercase)
							4 = Last Name (Uppercase)
							5 = Main Phone
							6 = Alt Phone
							7 = Fax
							8 = Email (Uppercase)
							9 = Mail Address 1
							10 = Mail Address 2
							11 = Mail City
							12 = Mail State
							13 = Mail Zip
							14 = Ship Address 1
							15 = Ship Address 2
							16 = Ship City
							17 = Ship State
							18 = Ship Zip
							19 = Is Active
							20 = Customer Name
							21 = Mail Unit
							22 = Mail Street
							23 = Mail Postal Code
							24 = Mail Province Short Code
							25 = Mail Province Name
							26 = Customer Contact
							27 = Language
							28 = Phone
							29 = Website
							30 = Email (lowercase)
							31 = First Name (lowercase)
							32 = Last Name (lowercase)
                        */

						//checks if the user customer exist
						if (arrSelectCustomer.length > 0) 
						{
							window.localStorage.setItem("strCustomerIdKey", arrSelectCustomer[0]);
							window.localStorage.setItem("strCustomerCompanyName", arrSelectCustomer[1]);
							window.localStorage.setItem("strCustomerCountry", arrSelectCustomer[0].substring(0, 1));
							window.localStorage.setItem("strCustomerFirstName", arrSelectCustomer[3]);
							window.localStorage.setItem("strCustomerLastName", arrSelectCustomer[4]);
							window.localStorage.setItem("strCustomerMainPhone", arrSelectCustomer[5]);
							window.localStorage.setItem("strCustomerAltPhone", arrSelectCustomer[6]);
							window.localStorage.setItem("strCustomerFax", arrSelectCustomer[7]);
							window.localStorage.setItem("strCustomerEmail", arrSelectCustomer[8]);
							window.localStorage.setItem("strCustomerMailAddress1", arrSelectCustomer[9]);
							window.localStorage.setItem("strCustomerMailAddress2", arrSelectCustomer[10]);
							window.localStorage.setItem("strCustomerMailCity", arrSelectCustomer[11]);
							window.localStorage.setItem("strCustomerMailState", arrSelectCustomer[12]);
							window.localStorage.setItem("strCustomerMailZip", arrSelectCustomer[13]);
							window.localStorage.setItem("strCustomerShipAddress1", arrSelectCustomer[14]);
							window.localStorage.setItem("strCustomerShipAddress2", arrSelectCustomer[15]);
							window.localStorage.setItem("strCustomerShipCity", arrSelectCustomer[16]);
							window.localStorage.setItem("strCustomerShipState", arrSelectCustomer[17]);
							window.localStorage.setItem("strCustomerShipZip", arrSelectCustomer[18]);
							window.localStorage.setItem("strCustomerIsActive", arrSelectCustomer[19]);
							window.localStorage.setItem("strCustomerName", arrSelectCustomer[20]);
							window.localStorage.setItem("strCustomerMailUnit", arrSelectCustomer[21]);
							window.localStorage.setItem("strCustomerMailStreet", arrSelectCustomer[22]);
							window.localStorage.setItem("strCustomerMailPostalCode", arrSelectCustomer[23]);
							window.localStorage.setItem("strCustomerMailProvinceCode", arrSelectCustomer[24]);
							window.localStorage.setItem("strCustomerMailProvinceName", arrSelectCustomer[25]);
							window.localStorage.setItem("strCustomerContact", arrSelectCustomer[26]);
							window.localStorage.setItem("strCustomerLang", arrSelectCustomer[27]);
							window.localStorage.setItem("strCustomerPhone", arrSelectCustomer[28]);
							window.localStorage.setItem("strCustomerWebsite", arrSelectCustomer[29]);
							window.localStorage.setItem("strCustomerLowercaseEmail", arrSelectCustomer[30]);
							window.localStorage.setItem("strCustomerLowercaseFirstName", arrSelectCustomer[31]);
							window.localStorage.setItem("strCustomerLowercaseLastName", arrSelectCustomer[32]);

							var strCustomerCountry = "CDN";//holds will be add to in order to jumper to the current array index

							//checks if the country is not CDN
							if(window.localStorage.getItem("strCustomerCountry") === "U")
								//adds to strCustomerCountry in order to for the array to use another countries details 
								strCustomerCountry = "USA";

							window.localStorage.setItem("strCustomerFullCountry", strCustomerCountry);

							// checks if there is a customer name
							if(window.localStorage.getItem("strCustomerName") === null)
							{

								// checks if there is a Loesercase First and Last Name to use instead
								if(window.localStorage.getItem("strCustomerLowercaseFirstName") !== null && window.localStorage.getItem("strCustomerLowercaseLastName") !== null)
									window.localStorage.setItem("strCustomerCustomerName", window.localStorage.getItem("strCustomerLowercaseFirstName") + " " + window.localStorage.getItem("strCustomerLowercaseLastName"));
								else
									// use the Uppercase as there will always be a name there
									window.localStorage.setItem("strCustomerCustomerName", window.localStorage.getItem("strCustomerFirstName") + " " + window.localStorage.getItem("strCustomerLastName"));
							}//end of if

							console.log("Select Customer: " + window.localStorage.getItem("strCustomerIdKey") + " Name: " + window.localStorage.getItem("strCustomerName") + " Country: "  + window.localStorage.getItem("strCustomerCountry") + " Prov: " + window.localStorage.getItem("strCustomerMailProvinceName"));

							//loads in the customer message and sends the user to the fabric section
							startUp(arrIndexField, arrIndexFabricDetailsHeader);
						}//end of if
                    }//end for if
                    else
						//tells the user that there is an error with the Server
                        endMessage(tagMessage, null, true, strFromServerMassage);
                }//end of try
                catch (ex) 
                {
                    //displays the message to the user and turns off the Status Lightbox
                    endMessage(tagMessage, null, true, "Error Customer From Server: " + ex.message);

                    return false;
                }//end of catch
            }//end of if
            else if (htmlJavaServerObject.readyState === 2 && htmlJavaServerObject.status === 500) {
                //tells the user that there is an error with the Server
                endMessage(tagMessage, null, true, "Unable to connect to server");

                return false;
            } //end of else if
        };//end of function()

        htmlJavaServerObject.send("strCustomerNumber=" + strCustomerNumber);
    }//end of try
    catch (ex) 
    { 
        //displays the message to the user and turns off the Status Lightbox
        endMessage(tagMessage, null, true, "Error: " + ex.message);

        return false;
    }//end of catch

    return true;
}//end of getCustomerDetails()

//send strRegion to get users Customer List based on that region
function getCustomerList(strFileName, tagMessage, arrSelectRegion, tagSelectCustomer, tagCustomerBody) 
{
    try 
    {
        var htmlJavaServerObject = new XMLHttpRequest(); //holds the object of the server

        //Abort any currently active request.
        htmlJavaServerObject.abort();

        //if user do not select any province then it will ask them to do so
        if (arrSelectRegion[0] === '0') 
        {
            displayMessage(tagMessage, 'You must select a region', true, true);
            return false;
        }//end of if

        console.log("Getting Customer List");

        //checks if there a connection also it sets the page for send to the Server
        if(preSend(tagMessage, "Getting Customer List") === false)
			return false;

        tagSelectCustomer.options.length = 0;
        //sets the selected customer the region the user has selected
        tagSelectCustomer.innerHTML = "<option value='0'>Select a Customer</option>";
        
        // Makes a request
        htmlJavaServerObject.open("Post", strFileName, true);
        htmlJavaServerObject.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

        htmlJavaServerObject.onreadystatechange = function () {
            console.log("Current Ready State: " + htmlJavaServerObject.readyState + " Status " + htmlJavaServerObject.status);

            //in case there is a error with connection
            if (htmlJavaServerObject.readyState === 0 && htmlJavaServerObject.status === 200)
                //displays the message to the user and turns off the Status Lightbox
                endMessage(tagMessage, null, true, "Connection to the server is currently down");
            else if (htmlJavaServerObject.readyState === 4 && htmlJavaServerObject.status === 200) 
            {
                try 
                {
                    var strFromServerMassage = htmlJavaServerObject.responseText;//holds the message from the server

                    // console.log("From Server Region: " + strFromServerMassage);

                    //checks if there is a message from the server
                    if (strFromServerMassage.indexOf("Error: ") === -1) 
                    {
                        var arrCustomerList = strFromServerMassage.trim().split("!");//holds the user details

                        // console.log("Number of Customers: " + arrCustomerList.length);

						//checks if the user customer exist
						if (arrCustomerList.length > 0) 
						{
							//turns on the Select Customer body as to force the user do a selection of the customer now
							$("#" + tagCustomerBody.id).removeClass('divJustHidden');

							//gets the User details for future use and send the user to the home screen
							window.localStorage.setItem("strCustomerProv", arrSelectRegion[1]);

							//goes around for each item found from the server
							for (var intUserCustomerIndex = 0; intUserCustomerIndex < arrCustomerList.length; intUserCustomerIndex++) 
							{
								var arrUserCustomerListSelection = arrCustomerList[intUserCustomerIndex].trim().split("*");

								if (arrUserCustomerListSelection.length > 1) 
								{
									var tagNewCustomer = document.createElement("option");//holds the option that will

									//sets the propites of the option
									tagNewCustomer.value = arrUserCustomerListSelection[0];
									tagNewCustomer.text = arrUserCustomerListSelection[1];

									//adds tagNewCustomer to the end of tagSelectCustomer				
									tagSelectCustomer.add(tagNewCustomer, null);
								}//end of if
							}//end of for loop
						}//end of if
						else
							//turns off the Select Customer body
							$("#" + tagCustomerBody.id).addClass('divJustHidden');
                    }//end for if
                    else
                    {
						//turns off the Select Customer body
						$("#" + tagCustomerBody.id).addClass('divJustHidden');

						//tells the user that there is an error with the Server
                        endMessage(tagMessage, null, true, strFromServerMassage);
                    }//end of else
                }//end of try
                catch (ex) 
                {
                    //displays the message to the user and turns off the Status Lightbox
                    endMessage(tagMessage, null, true, "Error Customer List From Server: " + ex.message);

                    //turns off the Select Customer body
                    $("#" + tagCustomerBody.id).addClass('divJustHidden');

                    return false;
                }//end of catch
            }//end of if
            else if (htmlJavaServerObject.readyState === 2 && htmlJavaServerObject.status === 500) {
                //tells the user that there is an error with the Server
                endMessage(tagMessage, null, true, "Unable to connect to server");

                //turns off the Select Customer body
				$("#" + tagCustomerBody.id).addClass('divJustHidden');
            } //end of else if
        };//end of function()
        console.log("intRepNumber=" + window.localStorage.getItem("strUserRepKey"));
        htmlJavaServerObject.send("strTerritory=" + window.localStorage.getItem("strUserTerritory") + "&intRepNumber=" + window.localStorage.getItem("strUserRepKey") + "&selectedRegion=" + arrSelectRegion[0]);
    }//end of try
    catch (ex) 
    { 
        //displays the message to the user and turns off the Status Lightbox
        endMessage(tagMessage, null, true, "Error: " + ex.message);

        //turns off the Select Customer body
		$("#" + tagCustomerBody.id).addClass('divJustHidden');
        return false;
    }//end of catch

    return true;
}//end of getCustomerList()

//get Collection List
function getCollectionList(strFileName, tagMessage, tagMenuMessage, tagCollectionsDetails, tagSubMenu, intSelectedFabricCategoryID, tagWelcomeMessage, tagNavigation, tagBodyApp, tagHeaderCustomerInfor, tagSectionCheckout, tagDivCartDetails, strSwatchDetailsID, strCartItemGrandTotalContainer, strGrandTotal, arrIndexFabricDetailsHeader)
{
    try 
    {
        var htmlJavaServerObject = new XMLHttpRequest(); //holds the object of the server

		//resets the body to load the collection list
        displayMessage(tagMessage, '', true, true);

        //Abort any currently active request.
        htmlJavaServerObject.abort();

        console.log("Getting Collection List");

        //checks if there a connection also it sets the page for send to the Server
		if(preSend(tagMessage, "Getting Collection List") === false)
			return false;

        // Makes a request
        htmlJavaServerObject.open("Post", strFileName, true);
        htmlJavaServerObject.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

        htmlJavaServerObject.onreadystatechange = function () {
            console.log("Current Ready State: " + htmlJavaServerObject.readyState + " Status " + htmlJavaServerObject.status);

            //in case there is a error with connection
            if (htmlJavaServerObject.readyState === 0 && htmlJavaServerObject.status === 200)
                //displays the message to the user and turns off the Status Lightbox
                endMessage(tagMessage, null, true, "Connection to the server is currently down");
            else if (htmlJavaServerObject.readyState === 4 && htmlJavaServerObject.status === 200) 
            {
                try 
                {
                    var strFromServerMassage = htmlJavaServerObject.responseText;//holds the message from the server

                    // console.log("From Server For Collection: " + strFromServerMassage);

                    //checks if there is a message from the server
                    if (strFromServerMassage.indexOf("Error: ") === -1) 
                    {
                        var arrCollections = strFromServerMassage.trim().split("!");//holds the collections from the server

                        // console.log("Number of Collection List: " + arrCollections.length);

                        //checks if the user customer exist
                        if (arrCollections.length > 0) 
                        {
							var intNumberItemsPerLine = 0;//holds the number of items per line before reseting

							//gets the User details for future use and send the user to the home screen
							//window.localStorage.setItem("intFabricCategoryID", arrRegionList[0].trim());

							//goes around for each item found from the server							
							for (var intCollectionsIndex = 0; intCollectionsIndex < arrCollections.length; intCollectionsIndex++) 
							{
								/*
									Collection Leagend

									0 = Collection Image
									1 = Collection Name
									2 = Designer Name
									3 = Date Added
									4 = Fab Cat Name
									5 = Collection ID
									6 = Colorway ID
									7 = Fabric Cat ID
								*/

								// console.log("For Collections Details: " + arrCollections[intCollectionsIndex]);
                                
                                var arrCollectionDetails = arrCollections[intCollectionsIndex].split("@");

                                if (arrCollectionDetails.length > 0)
                                {
									var strIsAvaliable = displayCollectionIsAvaliable(arrCollectionDetails[3]);//holds the the text if the collection is avaliable

									strCollectionsTemplate = "<div class='divCollectionDetails customLeft'>" +
                                        "<div class='divCollectionImage'>" + 
											"<a href='javascript:void(0);' onclick='getFablicDetails(" + 
												"&quot;" + window.localStorage.getItem("strDomainName") + "/ASP/AppGetFabricList.aspx&quot;, " + 
												"&quot;" + tagMessage + "&quot;, " + 
												"getDocID(&quot;{11}&quot;), " + 
												"{4}, " + 
												"{5}, " + 
												"{6}, " + 
												"&quot;{7}&quot;, " + 
												"getDocID(&quot;{8}&quot;), " + 
												"getDocID(&quot;{9}&quot;), " + 
												"getDocID(&quot;{10}&quot;), " + 
												"getDocID(&quot;{12}&quot;), " + 
												"getDocID(&quot;{13}&quot;), " + 
												"[&quot;{14}&quot;]" + 
												");'>" + 
												"<img src='http://northcott.com/swatchimages/{0}.jpg' alt='{0}' />" + 
											"</a>" + 
                                        "</div>" +
                                        "<div class='divIndiCollectionDetails'>" +
                                            "<div class='divCollectionName'>" + 
												"<label>{1}</label>" + 
                                            "</div>" +
                                            "<div class='CollectionDesigner'>" + 
												"<label>{2}</label>" + 
                                            "</div>" +
                                            "<div class='CollectionAddedDate'>" + 
												"<label>{3}</label>" + 
											"</div>" +
                                        "</div>" +
                                    "</div>";//holds the template of the collection details

                                    //checks if this is the first of the collections
                                    if (intCollectionsIndex === 0)
										// displays the category name
                                        tagCollectionsDetails.innerHTML = "<div><div class='customLeft'><h2>" + arrCollectionDetails[4] + "</h2></div><div class='customRight'><a href='javascript:void(0);' onclick='javascript:ShowRapidOrderSection();' title='Rapid Order Placement' class='aOrangeLink'>Rapid Order Placement</a></div><div class='customFooter'></div>";
 
                                    //sets the collection details 
                                    tagCollectionsDetails.innerHTML += String.format(strCollectionsTemplate, arrCollectionDetails[0], arrCollectionDetails[1], arrCollectionDetails[2], strIsAvaliable, arrCollectionDetails[5], arrCollectionDetails[6], arrCollectionDetails[7], "aAddSelectedItemsCart", tagBodyApp.id, tagSectionCheckout.id, tagDivCartDetails.id, strSwatchDetailsID, strCartItemGrandTotalContainer, strGrandTotal, arrIndexFabricDetailsHeader.toString().replace(/,/g,"&quot;,&quot;"));

                                    //checks if the number of lines per has been reach
									if(intNumberItemsPerLine > 2)
									{
										//adds in the footer to clear this cline for the next one
										tagCollectionsDetails.innerHTML += "<div class='customFooter'></div>";

										//resets the intNumberItemsPerLine
										intNumberItemsPerLine = 0;
									}//end of if
									else
										intNumberItemsPerLine++;
								}//end of if
							}//end of for loop

							//checks if there are remaining items that need to be clear
							if(intNumberItemsPerLine !== 3)
								tagCollectionsDetails.innerHTML += "<div class='customFooter'></div>";

							// console.log(tagCollectionsDetails.innerHTML);

							//resets the sub menu to as the user has selected some thing
							getFabricMenuItems("", '', ['', tagSubMenu], null);

							//checks if this is the first item being loaded as there is no selecion
							if(intSelectedFabricCategoryID !== 0)
								//loads in the customer message and sends the user to the fabric section
								startUp([tagWelcomeMessage, tagNavigation, tagBodyApp, null, tagHeaderCustomerInfor, tagCollectionsDetails, tagSubMenu, tagDivCartDetails]);
                        }//end of if
                    }//end for if
                    else
                    {
						//checks if the menu is being used as there is times where the message needs to display in the menu 
						//as the menu can be on any section also when the user clicks on a menu, the app calls this function to go to the next section
						if(tagMenuMessage !== null)
							//tells the user that there is an error with the Server
							endMessage(tagMenuMessage, null, true, strFromServerMassage);
                        else
							//tells the user that there is an error with the Server
							endMessage(tagMessage, null, true, strFromServerMassage);
                    }//end of else
                }//end of try
                catch (ex) 
                {
                    //displays the message to the user and turns off the Status Lightbox
                    endMessage(tagMessage, null, true, "Error Get Customer List From Server: " + ex.message);

                    return false;
                }//end of catch
            }//end of if
            else if (htmlJavaServerObject.readyState === 2 && htmlJavaServerObject.status === 500) {
                //tells the user that there is an error with the Server
                endMessage(tagMessage, null, true, "Unable to connect to server");
            }//end of else if
        };//end of function()
        console.log("strTerritory=" + window.localStorage.getItem("strUserTerritory") + "&intRepNumber=" + window.localStorage.getItem("strUserRepKey") + "&strSelectedFabricCategoryID=" + intSelectedFabricCategoryID + "&strCustomerCountry=" + window.localStorage.getItem("strCustomerFullCountry"));
        htmlJavaServerObject.send("strTerritory=" + window.localStorage.getItem("strUserTerritory") + "&intRepNumber=" + window.localStorage.getItem("strUserRepKey") + "&strSelectedFabricCategoryID=" + intSelectedFabricCategoryID + "&strCustomerCountry=" + window.localStorage.getItem("strCustomerFullCountry"));
    }//end of try
    catch (ex) 
    {
        //displays the message to the user and turns off the Status Lightbox
        endMessage(tagMessage, null, true, "Error: " + ex.message);

        return false;
    }//end of catch

    return true;
}//end of getCollectionList()

/**
 * gets the fabric colourways
 * @param  {String} strFileName
 * @param  {String} tagMessage
 * @param  {Int}	intCollectionID
 * @param  {Int}	intSelectedFabricCategoryID
 * @param  {Object} tagSelectColourway
 * @param  {Array}	arrIndexFieldFablicDetails
 * @return {Boolean}           
 */
function getFabricColorways(strFileName, tagMessage, intCollectionID, intSelectedFabricCategoryID, tagSelectColourway, arrIndexFieldFablicDetails)
{
    try 
    {
        var htmlJavaServerObject = new XMLHttpRequest(); //holds the object of the server

        //Abort any currently active request.
        htmlJavaServerObject.abort();

        console.log("Getting Colorways List");

        //resets the selected colourway for the next itmes
        tagSelectColourway.innerHTML = "";

        //checks if there a connection also it sets the page for send to the Server
		if(preSend(tagMessage, "Getting Colorway List") === false)
			return false;

        // Makes a request
        htmlJavaServerObject.open("Post", strFileName, true);
        htmlJavaServerObject.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
     
        htmlJavaServerObject.onreadystatechange = function () {
            console.log("Current Ready State: " + htmlJavaServerObject.readyState + " Status " + htmlJavaServerObject.status);

            //in case there is a error with connection
            if (htmlJavaServerObject.readyState === 0 && htmlJavaServerObject.status === 200)
                //displays the message to the user and turns off the Status Lightbox
                endMessage(tagMessage, null, true, "Connection to the server is currently down");
            else if (htmlJavaServerObject.readyState === 4 && htmlJavaServerObject.status === 200) 
            {
                try
                {
                    var strFromServerMassage = htmlJavaServerObject.responseText;//holds the message from the server

                    // console.log("From Server Colourway: " + strFromServerMassage);

                    //checks if there is a message from the server
                    if (strFromServerMassage.indexOf("Error: ") === -1) 
                    {
                        var arrColourwayList = strFromServerMassage.trim().split("!@");//holds the Colourway name
                        var tagFabricDetailsAllColorwaysCart = $("#" + arrIndexFieldFablicDetails[8][6]);
                        var tagFabricDetailsAllHalfColorwaysCart = $("#" + arrIndexFieldFablicDetails[8][12]);

                        // console.log("Number of Colourways: " + arrColourwayList.length);

                        //checks if the user Colourway exist
                        if (arrColourwayList.length > 0)
                        {
							var tagSelectColourwayContainer = $("#" + arrIndexFieldFablicDetails[8][10]);//holds the jquery object of the selected Colourway Container tag
							var tagSelectColourwayHalfContainer = $("#" + arrIndexFieldFablicDetails[8][11]);//holds the jquery object of the Colourway Half Container tag

							//goes around for each Colourway found and addes them to tagSelectColourway
                            for (var intColourwayIndex = 0; intColourwayIndex < arrColourwayList.length; intColourwayIndex++) 
                            {
                                var arrColourwayListSelection = arrColourwayList[intColourwayIndex].trim().split("|*");//holds the list of colourways for this fabric

                                // console.log("From Server Colourway: " + arrColourwayList[intColourwayIndex].trim().split("*"));

                                //checks if there is an value and name
                                if (arrColourwayListSelection.length > 1) 
                                {
                                    var tagNewColourway = document.createElement("option");//holds the option that will

                                    //sets the propites of the option
                                    tagNewColourway.value = arrColourwayListSelection[0];
                                    tagNewColourway.text = arrColourwayListSelection[1];

                                    //adds tagNewNH to the end of tagSelectLocation				
                                    tagSelectColourway.add(tagNewColourway, null);
                                }//end of if
                            }//end of for loop

							// console.log("Number of Items In Colorways: " + tagSelectColourway.length);

							// checks if the customer is in Canada as they are the only onces that have the half peice options
							if (window.localStorage.getItem("strCustomerCountry") === "U") 
								tagSelectColourwayHalfContainer.addClass('divJustHidden');
							else
								tagSelectColourwayHalfContainer.removeClass('divJustHidden');

							//checks if there is more then 1 as there is no need to display a select option
							if(tagSelectColourway.length <= 1 && tagSelectColourwayContainer.hasClass('divJustHidden') === false) {
								//add the CSS Class to hide the element
								tagSelectColourwayContainer.addClass('divJustHidden');

								// hides the all colourway and This colourway Half buttons since colourways for this Fabric Details is only one
								tagFabricDetailsAllColorwaysCart.addClass('divJustHidden');
								tagFabricDetailsAllHalfColorwaysCart.addClass('divJustHidden');
							}//end of if
							else if(tagSelectColourway.length > 1)
							{
								/*
									Fabric Details Header - Colourway Function Leagend

									0 = File Name
									1 = Swatch Details
									2 = Add Selected Items To Cart
									3 = Body App
									4 = Section Cart
									5 = Cart Details
									6 = Cart Item Grand Total Container
									7 = Cart Item Grand Total
									8 = arrIndexFabricDetailsHeader
										0 = Fabric Title
										1 = Fabric Designer
										3 = Shipping Date
										4 = Reset Shipping Date
										5 = Add Selected Items Cart
										6 = All Colourway Cart
										7 = This Colourway Cart
										8 = Select Colourway
										9 = Fabric Description
										10 = Select Colourway Container
										11 = All Colourway To Half Cart Link Container
										12 = All Colourway Cart Half
-										13 = This Colourway Cart Half
								*/

								//sets what will happen when the 
								tagSelectColourway.onchange = function() {
									getFablicDetails(
										arrIndexFieldFablicDetails[0], tagMessage, arrIndexFieldFablicDetails[1], intCollectionID, parseInt(getSelectOption(tagSelectColourway)[0]), intSelectedFabricCategoryID, arrIndexFieldFablicDetails[2], arrIndexFieldFablicDetails[3], arrIndexFieldFablicDetails[4], arrIndexFieldFablicDetails[5], arrIndexFieldFablicDetails[6], arrIndexFieldFablicDetails[7], arrIndexFieldFablicDetails[8]);
								};

								//remove the CSS Class to hide the element
								tagSelectColourwayContainer.removeClass('divJustHidden');
								tagFabricDetailsAllColorwaysCart.removeClass('divJustHidden');
								tagFabricDetailsAllHalfColorwaysCart.removeClass('divJustHidden');
							}//end of else
                        }//end of if
                    }//end for if
                    else
                        //tells the user that there is an error with the Server
                        endMessage(tagMessage, null, true, strFromServerMassage);
                }//end of try
                catch (ex) 
                {
                    //displays the message to the user and turns off the Status Lightbox
                    endMessage(tagMessage, null, true, "Error Colorway List From Server: " + ex.message);

                    return false;
                }//end of catch
            }//end of if
            else if (htmlJavaServerObject.readyState === 2 && htmlJavaServerObject.status === 500) {
                //tells the user that there is an error with the Server
                endMessage(tagMessage, null, true, "Unable to connect to server");
            } //end of else if
		};//end of function()

        htmlJavaServerObject.send("strCollectionID=" + intCollectionID + "&strSelectedFabricCategoryID=" + intSelectedFabricCategoryID);
    }//end of try
    catch (ex) 
    {
        //displays the message to the user and turns off the Status Lightbox
        endMessage(tagMessage, null, true, "Error: " + ex.message);

        return false;
    }//end of catch

    return true;
}//end of getFabricColorways()

/**
 * Gets and diplays the details of swatch the selected fablic collection list
 * @param  {String} strFileName
 * @param  {String} tagMessage
 * @param  {Object} tagSwatchDetails
 * @param  {Int}	intCollectionID
 * @param  {Int}	intColorwayID
 * @param  {Int}	intSelectedFabricCategoryID
 * @param  {String} strAddSelectedItemsToCart
 * @param  {Object} tagBodyApp
 * @param  {Object} tagSectionCheckout
 * @param  {Object} tagDivCartDetails
 * @param  {Object} tagCartItemGrandTotalContainer
 * @param  {Object} tagGrandTotal
 * @param  {Array of Fields} arrIndexFabricDetailsHeader All Field object that are from the Fabric Details Header
 * @return {Boolean}
 */
function getFablicDetails(strFileName, tagMessage, tagSwatchDetails, intCollectionID, intColorwayID, intSelectedFabricCategoryID, strAddSelectedItemsToCart, tagBodyApp, tagSectionCheckout, tagDivCartDetails, tagCartItemGrandTotalContainer, tagGrandTotal, arrIndexFabricDetailsHeader) {
    try  {
        var htmlJavaServerObject = new XMLHttpRequest(); //holds the object of the server

        //Abort any currently active request.
        htmlJavaServerObject.abort();

        console.log("Getting Fabric Details");

        //checks if there is a local storage for see which items is selected
        if(window.localStorage.getItem("strUserSelectedItems") !== null)
			//removes the local store for see which items is selected
			window.localStorage.removeItem("strUserSelectedItems");

        //checks if there a connection also it sets the page for send to the Server
		if(preSend(tagMessage, "Getting Fabric Details") === false)
			return false;

        // Makes a request
        htmlJavaServerObject.open("Post", strFileName, true);
        htmlJavaServerObject.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

        htmlJavaServerObject.onreadystatechange = function () {
            console.log("Current Ready State: " + htmlJavaServerObject.readyState + " Status " + htmlJavaServerObject.status);

            //in case there is a error with connection
            if (htmlJavaServerObject.readyState === 0 && htmlJavaServerObject.status === 200)
                //displays the message to the user and turns off the Status Lightbox
                endMessage(tagMessage, null, true, "Connection to the server is currently down");
            else if (htmlJavaServerObject.readyState === 4 && htmlJavaServerObject.status === 200) 
            {
                try 
                {
                    var strFromServerMassage = htmlJavaServerObject.responseText;//holds the message from the server

                    // console.log("From Fabric Details Server: " + strFromServerMassage);

                    if (tagSwatchDetails !== null) 
                    {
						//resets tagSwatchDetails for a new bunch of swatch
                        tagSwatchDetails.innerHTML = '';

                        //checks if there is a message from the server
                        if (strFromServerMassage.indexOf("Error: ") === -1) 
                        {
							/*
								JSON Format for the Fabric Details Legend:
							*/

							var jsonDataFromServer = $.parseJSON(strFromServerMassage);//hold the json data from the server

							/*
								Fabric Details Header Leagend

								0 = Fabric Title
								1 = Fabric Designer
								3 = Shipping Date
								4 = Reset Shipping Date
								5 = Add Selected Items Cart
								6 = All Colourway Cart
								7 = This Colourway Cart
								8 = Select Colourway
								9 = Fabric Description
								10 = Select Colourway Container
								11 = All Colourway To Cart Link Container
								12 = All Colourway Cart Half
								13 = This Colourway Cart Half
							*/

							var intNumberItemsPerLine = 0;//holds the number of items per line before reseting
							var tagSelectColourway = getDocID(arrIndexFabricDetailsHeader[8]);//holds the select colourway ID
							var tagAddSelectedItemsToCart = $("#" + strAddSelectedItemsToCart);//holds the jquery object of the adding selected Item to cart
							var dateEarlyShippingDate = new Date();//holds the earlies shipping date
							var strIsAvaliable = displayCollectionIsAvaliable(jsonDataFromServer[0].dateAdded);//holds the the text if the collection is avaliable
							var tagShipDate = getDocID(arrIndexFabricDetailsHeader[3]);//holds the ship date link
							var strDiscount = "10";
							
							//checks if tagAddSelectedItemsToCart is visible
							if(tagAddSelectedItemsToCart.hasClass('divJustHidden') === false)
								//remove add the selected items to the cart
								tagAddSelectedItemsToCart.addClass('divJustHidden');

							//sets the all colourways and Half
							getDocID(arrIndexFabricDetailsHeader[5]).onclick = function() {
								var arrFabricSelectedItemList = window.localStorage.getItem("strUserSelectedFabricControls").split("!");//holds the all of the selected Items

								//goes around for each selected item in this fabric details
								for (var intFabricSelectedItemsIndex = 0; intFabricSelectedItemsIndex < (arrFabricSelectedItemList.length - 1); intFabricSelectedItemsIndex++) {
									//adds the Item to the local storage strUserSelectedItems
									window.localStorage.setItem("strUserSelectedItems", window.localStorage.getItem("strUserSelectedItems") + arrFabricSelectedItemList[intFabricSelectedItemsIndex] + "*" + getSelectOption(getDocID("ddlFabricQTY0" + arrFabricSelectedItemList[intFabricSelectedItemsIndex]))[0] + "*" + getDocID("hfColorway" + arrFabricSelectedItemList[intFabricSelectedItemsIndex]).value + "*" + getDocID("hfPrice" + arrFabricSelectedItemList[intFabricSelectedItemsIndex]).value + "!");
								}//end of for loop

								console.log("Current Selected Items Details: " + window.localStorage.getItem("strUserSelectedItems"));

								//sends the items to the cart for the Selected Item
								sendCartItem(window.localStorage.getItem("strDomainName") + '/ASP/AppCartItem.aspx', tagMessage, '0.00', '', new Date($('#' + arrIndexFabricDetailsHeader[3]).text()), '', tagBodyApp, tagSectionCheckout, tagDivCartDetails, tagCartItemGrandTotalContainer, tagGrandTotal, 0, intColorwayID, intSelectedFabricCategoryID, false, false);
							};
							getDocID(arrIndexFabricDetailsHeader[6]).onclick = function () {
								//sends the items to the cart for the Selected All Colourways
							    sendCartItem(window.localStorage.getItem("strDomainName") + '/ASP/AppCartItem.aspx', tagMessage, strDiscount, '', new Date($('#' + arrIndexFabricDetailsHeader[3]).text()), '', tagBodyApp, tagSectionCheckout, tagDivCartDetails, tagCartItemGrandTotalContainer, tagGrandTotal, intCollectionID, intColorwayID, intSelectedFabricCategoryID, true, false);
							};
							getDocID(arrIndexFabricDetailsHeader[7]).onclick = function () {
								if (window.localStorage.getItem("strCustomerCountry") == "U")
									strDiscount = "5";

								//sends the items to the cart for the Selected This Colourways
								sendCartItem(window.localStorage.getItem("strDomainName") + '/ASP/AppCartItem.aspx', tagMessage, strDiscount, '', new Date($('#' + arrIndexFabricDetailsHeader[3]).text()), '', tagBodyApp, tagSectionCheckout, tagDivCartDetails, tagCartItemGrandTotalContainer, tagGrandTotal, intCollectionID, intColorwayID, intSelectedFabricCategoryID, false, false);
							};
							getDocID(arrIndexFabricDetailsHeader[12]).onclick = function () {
								//sends the items to the cart for the Selected All Colourways
							    sendCartItem(window.localStorage.getItem("strDomainName") + '/ASP/AppCartItem.aspx', tagMessage, strDiscount, '', new Date($('#' + arrIndexFabricDetailsHeader[3]).text()), '', tagBodyApp, tagSectionCheckout, tagDivCartDetails, tagCartItemGrandTotalContainer, tagGrandTotal, intCollectionID, intColorwayID, intSelectedFabricCategoryID, true, true);
							};
							getDocID(arrIndexFabricDetailsHeader[13]).onclick = function () {
								if (window.localStorage.getItem("strCustomerCountry") == "U")
									strDiscount = "5";

								//sends the items to the cart for the Selected This Colourways
								sendCartItem(window.localStorage.getItem("strDomainName") + '/ASP/AppCartItem.aspx', tagMessage, strDiscount, '', new Date($('#' + arrIndexFabricDetailsHeader[3]).text()), '', tagBodyApp, tagSectionCheckout, tagDivCartDetails, tagCartItemGrandTotalContainer, tagGrandTotal, intCollectionID, intColorwayID, intSelectedFabricCategoryID, false, true);
							};

							//gets the all of the colourways for this collection
							getFabricColorways(window.localStorage.getItem("strDomainName") + "/ASP/GetFabricColourways.aspx", tagMessage, intCollectionID, intSelectedFabricCategoryID, tagSelectColourway, [strFileName, tagSwatchDetails, strAddSelectedItemsToCart, tagBodyApp, tagSectionCheckout, tagDivCartDetails, tagCartItemGrandTotalContainer, tagGrandTotal, arrIndexFabricDetailsHeader]);

							//sets what the user a selected in the items
							window.localStorage.setItem("strUserSelectedItems", "");
							window.localStorage.setItem("strUserSelectedFabricControls", "");

							//sets the name of the Fable/Swatch Details
							getDocID(arrIndexFabricDetailsHeader[0]).innerHTML = decodeURL(jsonDataFromServer[0].collectionName);

							//checks if there is a designer for this colleciion
							if(jsonDataFromServer[0].designerName !== "")
								//gets the designer's name
								getDocID(arrIndexFabricDetailsHeader[1]).innerHTML = "By " + decodeURL(jsonDataFromServer[0].designerName);

							//checks if there is a summery for this collection
							if(jsonDataFromServer[0].collectionSummary !== "")
								//gets the summery of the collection
								getDocID(arrIndexFabricDetailsHeader[9]).innerHTML = decodeURL(jsonDataFromServer[0].collectionSummary);

							//checks if the collection is avaliable or not
							if(strIsAvaliable.indexOf('Available Now') === -1) {
								var arrDateParts = jsonDataFromServer[0].dateAdded.substring(0, jsonDataFromServer[0].dateAdded.indexOf(" ")).split("/");//holds the parts of the date

								//sets dateEarlyShippingDate to the date of when the item will be avliable
								dateEarlyShippingDate = new Date(arrDateParts[2], (arrDateParts[1] - 1), arrDateParts[0]);
							}//end of if

							//updates the displays of when the fabric/swatch will be avaliable
							getDocID(arrIndexFabricDetailsHeader[2]).innerHTML = strIsAvaliable;

							//sets the shipping date onclick and display
							tagShipDate.innerHTML = setShippingDate(dateEarlyShippingDate, tagShipDate, getDocID(arrIndexFabricDetailsHeader[4]));

							// goes around for each item in the json
							$.each(jsonDataFromServer, function(JSONDataKey, JSONDataValue) {
								var strSoldOut = "";//holds if the swatch is sold out
								var strTemplateFabricDetails = "<div class='divCollectionDetails divFabricDetails customLeft' id='{0}'>\n" +
									"<div class='divCollectionImage divFabricImage'>\n" +
										"<a href='javascript:void(0);' onclick='setSelectedItemsInDetails(\n" + 
											"&quot;{0}&quot;, \n" + 
											"&quot;{4}&quot;\n" + 
											");'>\n" + 
											"<img src='http://northcott.com/swatchimages/{0}.jpg' alt='{0}' />\n" + 
										"</a>\n" +
										"<input type='hidden' id='hfColorway{0}' value='{1}'>\n" + 
										"<input type='hidden' id='hfPrice{0}' value='{2}'>\n" + 
									"</div>\n" +
									"<div class='divCollectionName divFabricSwatchNumber'>\n" +
										"<label>{0}</label>\n" + 
										"{3}\n" + 
									"</div>\n" + 
								"</div>\n\n";

								//checks if the item is sold out or not
								if(JSONDataValue[window.localStorage.getItem("strCustomerFullCountry") + "SoldOut"] === "False")
								{
									//displays the pricing and units
									strSoldOut += "<div class='divFabricPricing'>\n" + 
									"<label class='lblFabricPricing'>$" + JSONDataValue[window.localStorage.getItem("strCustomerFullCountry") + "Price"] + "</label><br/>\n";

									//add in the dropdown with all of the sizes need to but the amount
									//and sets the defulat of the seleciotn
									strSoldOut += createFabricQTYSelector(parseInt(JSONDataValue[window.localStorage.getItem("strCustomerFullCountry") + "Multiplier"]), JSONDataValue.swatchNumber, 0, 0, "",parseInt("1"));
									
									//closes the select displays the units
									strSoldOut += "<br/>" + 
										"<label class='lblFabricPricing'>" + JSONDataValue[window.localStorage.getItem("strCustomerFullCountry") + "Unit"] + "</label>\n" +
									"</div>\n";
								}//end of if
								else
									strSoldOut += "<br/><label class='lblSwarchDetailsSoldOut'>Sold Out</label>\n";

								//sets the display of the swatch 
								tagSwatchDetails.innerHTML += String.format(strTemplateFabricDetails, JSONDataValue.swatchNumber, intColorwayID, JSONDataValue[window.localStorage.getItem("strCustomerFullCountry") + "Price"], strSoldOut, strAddSelectedItemsToCart);

								//checks if the number of lines per has been reach
								if(intNumberItemsPerLine > 2)
								{
									//adds in the footer to clear this cline for the next one
									tagSwatchDetails.innerHTML += "<div class='customFooter'></div>\n\n";

									//resets the intNumberItemsPerLine
									intNumberItemsPerLine = 0;
								}//end of if
								else
									intNumberItemsPerLine++;
							});

							//checks if there are remaining items that need to be clear
							if(intNumberItemsPerLine !== 3)
								tagSwatchDetails.innerHTML += "<div class='customFooter'></div>";

							// console.log(tagSwatchDetails.innerHTML);

							//turns on the fabric details
							classToggleLayer(getDocID('bodyApp'), getDocID('sectionSwatch'), 'divJustHidden sectionBody', 'section');
						}//end for if
						else
							//tells the user that there is an error with the Server
							endMessage(tagMessage, null, true, strFromServerMassage);
                    }//end of if
                }//end of try
                catch (ex) 
                {
                    //displays the message to the user and turns off the Status Lightbox
                    endMessage(tagMessage, null, true, "Error Send Region And Customer From Server: " + ex.message);

                    return false;
                }//end of catch
            }//end of if
            else if (htmlJavaServerObject.readyState === 2 && htmlJavaServerObject.status === 500) {
                //tells the user that there is an error with the Server
                endMessage(tagMessage, null, true, "Unable to connect to server");
            } //end of else if
        };//end of function()

        htmlJavaServerObject.send("strCollectionID=" + intCollectionID + "&strColorwayID=" + intColorwayID + "&strSelectedFabricCategoryID=" + intSelectedFabricCategoryID);
    }//end of try
    catch (ex) 
    {
        //displays the message to the user and turns off the Status Lightbox
        endMessage(tagMessage, null, true, "Error: " + ex.message);

        return false;
    }//end of catch

    return true;
}//end of getFablicDetails()

/**
 * get Fabric Menu Tiems for Navigation bar 
 * @param  {String}				strFileName
 * @param  {String}				strErrorMessage   
 * @param  {Array of Fields}	arrMenuItemsIndexField
 * @param  {Array of Fields}	arrIndexFabricDetailsHeader
 * @return {boolean}  
 */
function getFabricMenuItems(strFileName, strErrorMessage, arrMenuItemsIndexField, arrIndexFabricDetailsHeader)
{
    try 
    {
		/*
			Leagend for Menu Items Index Field

			0 = Collections Details
			1 = Sub Menu Body
			2 = Welcome Message
			3 = Navigation
			4 = Body ID
			5 = Section Cart
			6 = Cart Details
			7 = Shipping Dat
			8 = Message for Menu Items
			9 = Server File
			10 = Swatch Details
			11 = Cart Item Grand Total Container
			12 = Grand Total
			13 = Customer selected Message
		*/

        var htmlJavaServerObject = new XMLHttpRequest(); //holds the object of the server

        //Abort any currently active request.
        htmlJavaServerObject.abort();

        // changes the link to non active
        changeClass('aFabric', 'NavivagtionActive');

        //checks if there the sub menu is being used
        if(arrMenuItemsIndexField[1].innerHTML !== "")
        {
			//removes the sub menu since the user may not need to display it
			arrMenuItemsIndexField[1].innerHTML = "";

			// hides the sub menu body from the user in order to not have whitespace on the bottom of the search area
			changeClass(arrMenuItemsIndexField[1].id,'divJustHidden');

			return false;
		}//end of if

        //if user have not selected region
        console.log("Getting Fabric Menu Items");

        //checks if there a connection also it sets the page for send to the Server
		if(preSend(strErrorMessage, "Getting Fabric Menu Items") === false)
			return false;

        // Makes a request
        htmlJavaServerObject.open("Post", strFileName, true);
        htmlJavaServerObject.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

        htmlJavaServerObject.onreadystatechange = function () {
            console.log("Current Ready State: " + htmlJavaServerObject.readyState + " Status " + htmlJavaServerObject.status);

            //in case there is a error with connection
            if (htmlJavaServerObject.readyState === 0 && htmlJavaServerObject.status === 200)
                //displays the message to the user and turns off the Status Lightbox
                endMessage(strErrorMessage, null, true, "Connection to the server is currently down");
            else if (htmlJavaServerObject.readyState === 4 && htmlJavaServerObject.status === 200) 
            {
                try 
                {
					var strFromServerMassage = htmlJavaServerObject.responseText;//holds the message from the server

					// console.log("From Server Fabric Details: " + strFromServerMassage);

					//checks if there is a message from the server
					if (strFromServerMassage.indexOf("Error: ") === -1) 
					{
						var arrFabricCategoryList = strFromServerMassage.trim().split("!");//holds the region name

						// console.log("Number of Fabric Category: " + arrFabricCategoryList.length);

						//checks if the category list exist
						if (arrFabricCategoryList.length > 0) 
						{
							var intNumberItemsPerLine = 0;//holds the number of items per line before reseting
							
							//displays the message div if there is an error with one of the menu items
							arrMenuItemsIndexField[1].innerHTML = "<div class='divBasicMessage' id='divMessageMenuItems'></div>";

							//goes around for each item found from the server
							for (var intFabricCategoryIndex = 0; intFabricCategoryIndex < arrFabricCategoryList.length; intFabricCategoryIndex++) 
							{
								var arrFabricCategoryListSelection = arrFabricCategoryList[intFabricCategoryIndex].trim().split("*");

								// console.log("Fabric Category List Details: " + arrFabricCategoryList[intFabricCategoryIndex].trim().split("*"));

								//checks if there is some data to from this items
								if (arrFabricCategoryListSelection.length > 1)
									arrMenuItemsIndexField[1].innerHTML += "<div class='divFabricCategoriesList customLeft'>" +
										"<a href='javascript:void(0);' onclick='javascript:getCollectionList(" +
											"&quot;" + arrMenuItemsIndexField[9] + "&quot;, " +
											"&quot;" + strErrorMessage + "&quot;, " +
											"&quot;" + arrMenuItemsIndexField[8] + "&quot;, " +
											"getDocID(&quot;" + arrMenuItemsIndexField[0] + "&quot;), " +
											"getDocID(&quot;" + arrMenuItemsIndexField[1].id + "&quot;), " +
											arrFabricCategoryListSelection[0] + ", " +
											"getDocID(&quot;" + arrMenuItemsIndexField[2] + "&quot;), " +
											"getDocID(&quot;" + arrMenuItemsIndexField[3] + "&quot;), " + 
											"getDocID(&quot;" + arrMenuItemsIndexField[4] + "&quot;), " + 
											"getDocID(&quot;" + arrMenuItemsIndexField[13] + "&quot;), " + 
											"getDocID(&quot;" + arrMenuItemsIndexField[5] + "&quot;), " + 
											"getDocID(&quot;" + arrMenuItemsIndexField[6] + "&quot;), " + 
											"&quot;" + arrMenuItemsIndexField[10] + "&quot;," + 
											"&quot;" + arrMenuItemsIndexField[11] + "&quot;," + 
											"&quot;" + arrMenuItemsIndexField[12] + "&quot;," + 
											"[&quot;" + arrIndexFabricDetailsHeader.toString().replace(/,/g,"&quot;,&quot;") + "&quot;]" + 
											");'>" + 
											arrFabricCategoryListSelection[1] + 
										"</a>" +
									"</div>";

								//checks if the number of lines per has been reach
								if(intNumberItemsPerLine > 2)
								{
									//adds in the footer to clear this cline for the next one
									arrMenuItemsIndexField[1].innerHTML += "<div class='customFooter'></div>";

									//resets the intNumberItemsPerLine
									intNumberItemsPerLine = 0;
								}//end of if
								else
									intNumberItemsPerLine++;
							}//end of for loop

							//checks if there are remaining items that need to be clear
							if(intNumberItemsPerLine !== 3)
								arrMenuItemsIndexField[1].innerHTML += "<div class='customFooter'></div>";

							// displays the sub menu body in order to display the categories found
							changeClass(arrMenuItemsIndexField[1].id,'divJustHidden');

							// console.log(arrMenuItemsIndexField[1].innerHTML);
						}//end of if
					}//end for if
					else
						//tells the user that there is an error with the Server
						endMessage(strErrorMessage, null, true, strFromServerMassage);
                }//end of if
                catch (ex)
                {
                    //displays the message to the user and turns off the Status Lightbox
                    endMessage(strErrorMessage, null, true, "Error Fabric Menu Items From Server: " + ex.message);

                    return false;
                }//end of catch
            }//end of if
            else if (htmlJavaServerObject.readyState === 2 && htmlJavaServerObject.status === 500) {
                //tells the user that there is an error with the Server
                endMessage(strErrorMessage, null, true, "Unable to connect to server");
            } //end of else if
        };//end of function()

        htmlJavaServerObject.send("strTerritory=" + window.localStorage.getItem("strUserTerritory") + "&intRepNumber=" + window.localStorage.getItem("strUserRepKey"));
    }//end of try
    catch (ex) {
        //displays the message to the user and turns off the Status Lightbox
        endMessage(strErrorMessage, null, true, "Error: " + ex.message);
        return false;
    }//end of catch

    return true;
}//end of getFabricMenuItems()

/**
 * Gets the Users Search Reuslt and displays it
 * @param  {String}				strFileName         
 * @param  {String}				strErrorMessage     
 * @param  {Object}				tagSearch           
 * @param  {Object}				tagSearchClear      
 * @param  {Object}				tagSearchError      
 * @param  {Object}				tagSearchResultBody
 * @param  {String}				strSearchResultMessage
 * @param  {Array of Fields}	arrIndexField
 * @param  {Array of Fields}	arrIndexFabricDetailsHeader
 * @return {Boolean}
 */
function getSearch(strFileName, strErrorMessage, tagSearch, tagSearchClear, tagSearchError, tagSearchResultBody, strSearchResultMessage, arrIndexField, arrIndexFabricDetailsHeader)
{
	try
	{
		var htmlJavaServerObject = new XMLHttpRequest();//holds the object of the server

		//Abort any currently active request.
		htmlJavaServerObject.abort();

        console.log("Getting Search Results");

        //checks if there a connection also it sets the page for send to the Server
		if(preSend(strErrorMessage, "Getting Search Results") === false)
			return false;
		
		//checks if there some text search
		if (tagSearch.value === "")
		{
			//displays the error and removes the clear button as it is in the same area	
			tagSearchClear.style.display = '';
			tagSearchError.style.display = 'block';

			return false;
		}//end of if

		// resets the Search Result body for next searchr results
		tagSearchResultBody.innerHTML = "";

		//Makes a request - Gets function is need get the data from remote site
		htmlJavaServerObject.open("Post", strFileName, true);
		htmlJavaServerObject.setRequestHeader("Content-Type","application/x-www-form-urlencoded");

		htmlJavaServerObject.onreadystatechange = function(){
			console.log("Current Ready State: " + htmlJavaServerObject.readyState + " Status " + htmlJavaServerObject.status);
			
			//in case there is a error with connection
			if(htmlJavaServerObject.readyState === 4 && htmlJavaServerObject.status === 400 || htmlJavaServerObject.readyState === 4 && htmlJavaServerObject.status === 0)
				//displays the message to the user and turns off the Status Lightbox
				endMessage(strErrorMessage, null, true, "Server is currently down, please try again later or check if you are connected on either Wifi or Cell connection");
			else if(htmlJavaServerObject.readyState === 4 && htmlJavaServerObject.status === 200)
			{
				try {
					var strFromServerMassage = htmlJavaServerObject.responseText;//holds the message from the server

					// console.log("Search From Server: " + htmlJavaServerObject.responseText);
					
					//checks if there is a message from the server
					if(strFromServerMassage.indexOf("Error: ") === -1) {
						/*
							JSON Format for the Search Results Legend:
						*/
					
					    console.log("strFromServerMassage" + strFromServerMassage);
						var jsonDataFromServer = $.parseJSON(strFromServerMassage);//hold the json data from the server
						
						// goes around for each item in the json
						$.each(jsonDataFromServer, function(JSONDataKey, JSONDataValue) {
							// checks if there is any items in this section
							if(JSONDataValue.length > 0) {
								var intNumberItemsPerLine = 0;//holds the number of items per line before reseting
						
								//sets the display of the swatch 
								tagSearchResultBody.innerHTML += "<h3>" + JSONDataKey + "</h3>";

								// goes around for each item in this search section
								$.each(JSONDataValue, function(JSONInnerDataKey, JSONInnerDataValue) {
									/*
										Legend of arrIndexField

										0 = Welcome Message
										1 = Navigation
										2 = Body ID
										3 = Select Region
										4 = Customer elected Message
										5 = Collections Details
										6 = Sub Menu Details
										7 = Cart Details
										8 = Swatch Details
										9 = Cart Item Grand Total Container
										10 = Grand Total
									*/

									var strInformationPerSections = "";
									var strLinkToDetails = "";// holds the link that will go to the details section per which secition the user is in

									// checks if a section needs to have extrx informaiton inside it in order to look like
									switch(JSONDataKey) {
										case "Collection":
										case "Fabric":
											// sets this sections details for the template
											strInformationPerSections = "<div class='divIndiCollectionDetails'>" +
												"<div class='divCollectionName'>" + 
													"<label>" + JSONInnerDataValue.name + "</label>" + 
												"</div>" +
												"<div class='CollectionDesigner'>" + 
													"<label>" + JSONInnerDataValue.designerName +  "</label>" + 
												"</div>" +
												"<div class='CollectionAddedDate'>" + 
													"<label>" + displayCollectionIsAvaliable(JSONInnerDataValue.collectionDate) +  "</label>" + 
												"</div>" +
											"</div>";
											strLinkToDetails = String.format("getFablicDetails(" + 
												"&quot;" + window.localStorage.getItem("strDomainName") + "/ASP/AppGetFabricList.aspx&quot;, \n" + 
												"&quot;{0}&quot;, \n" + 
												"getDocID(&quot;{1}&quot;), \n" + 
												"{2}, \n" + 
												"{3}, \n" + 
												"{4}, \n" + 
												"&quot;{5}&quot;, \n" + 
												"getDocID(&quot;{6}&quot;), \n" + 
												"getDocID(&quot;{7}&quot;), \n" + 
												"getDocID(&quot;{8}&quot;), \n" + 
												"getDocID(&quot;{9}&quot;), \n" + 
												"getDocID(&quot;{10}&quot;), \n" + 
												"[&quot;{11}&quot;]\n" + 
												");", strSearchResultMessage, arrIndexField[8], JSONInnerDataValue.ID, JSONInnerDataValue.colorwayID, JSONInnerDataValue.cateID, "aAddSelectedItemsCart", arrIndexField[2], "sectionCheckout", arrIndexField[7], arrIndexField[9], arrIndexField[10], arrIndexFabricDetailsHeader.toString().replace(/,/g,"&quot;,&quot;"));
										break;
									}// end of switch

									// sets the display of the swatch 
									tagSearchResultBody.innerHTML += String.format("<div class='divCollectionDetails divFabricDetails customLeft' id='{0}'>\n" +
										"<div class='divCollectionImage divFabricImage'>\n" +
											"<a href='javascript:void(0);' onClick='{3}'>" + 
												"<img src='http://northcott.com{1}' alt='{0}' />\n" + 
											"</a>" + 
										"</div>\n" +
										"<div class='divCollectionName divFabricSwatchNumber'>\n" +
											"{2}\n" + 
										"</div>\n" + 
									"</div>\n\n", JSONInnerDataValue.name, JSONInnerDataValue.imageFull, strInformationPerSections, strLinkToDetails);

									// checks if the number of lines per has been reach
									if(intNumberItemsPerLine > 2)
									{
										// adds in the footer to clear this cline for the next one
										tagSearchResultBody.innerHTML += "<div class='customFooter'></div>\n\n";

										// resets the intNumberItemsPerLine
										intNumberItemsPerLine = 0;
									}// end of if
									else
										intNumberItemsPerLine++;
								});

								// checks if there are remaining items that need to be clear
								if(intNumberItemsPerLine !== 3)
									tagSearchResultBody.innerHTML += "<div class='customFooter'></div>";
							}// end of if
						});

						// checks there is any items found
						if(tagSearchResultBody.innerHTML === "")
							// display no items found message
							tagSearchResultBody.innerHTML = "<label id='lblSearchResultNoResults'>No Results Found</label>";

						// console.log(tagSearchResultBody.innerHTML);

						//turns on the search results
						classToggleLayer(getDocID('bodyApp'), getDocID('sectionSearchResults'), 'divJustHidden sectionBody', 'section');
					}//end for if
					else
						//tells the user that there is an error with the Server
						endMessage(strErrorMessage, null, true, strFromServerMassage);
				}//end of try
				catch(ex) {
					//displays the message to the user and turns off the Status Lightbox
					endMessage(strErrorMessage, null, true, "Search From Server Error: " + ex.message);
					
					return false;
				}//end of catch
			}//end of if
			else if(htmlJavaServerObject.readyState === 2 && htmlJavaServerObject.status === 500) {
				//displays the message to the user and turns off the Status Lightbox
				endMessage(strErrorMessage, null, true, "Unable to connect to server");
			}//end of else if
		};//end of function()

		htmlJavaServerObject.send("strSearch=" + encodeURL(encryptRSA(tagSearch.value)));
	}//end of try
	catch(ex) {
		//displays the message to the user and turns off the Status Lightbox
		endMessage(strErrorMessage, null, true, "Search Error: " + ex.message);
		
		return false;
	}//end of catch
	
	return true;
}//end of getSearch()

//send strUserTerritory to get users RegionList
function getRegionList(strFileName, tagMessage, tagSelectRegion) 
{
    try 
    {
        var htmlJavaServerObject = new XMLHttpRequest(); //holds the object of the server

        //Abort any currently active request.
        htmlJavaServerObject.abort();

        console.log("Getting Region List");

        //checks if there a connection also it sets the page for send to the Server
		if(preSend(tagMessage, "Getting Region List") === false)
			return false;

        // Makes a request
        htmlJavaServerObject.open("Post", strFileName, true);
        htmlJavaServerObject.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
     
        htmlJavaServerObject.onreadystatechange = function () {
            console.log("Current Ready State: " + htmlJavaServerObject.readyState + " Status " + htmlJavaServerObject.status);

            //in case there is a error with connection
            if (htmlJavaServerObject.readyState === 0 && htmlJavaServerObject.status === 200)
                //displays the message to the user and turns off the Status Lightbox
                endMessage(tagMessage, null, true, "Connection to the server is currently down");
            else if (htmlJavaServerObject.readyState === 4 && htmlJavaServerObject.status === 200) 
            {
                try 
                {
                    var strFromServerMassage = htmlJavaServerObject.responseText;//holds the message from the server

                    // console.log("From Server Region: " + strFromServerMassage);

                    //checks if there is a message from the server
                    if (strFromServerMassage.indexOf("Error: ") === -1) 
                    {
                        var arrRegionList = strFromServerMassage.trim().split("!");//holds the region name

                        // console.log("Number of Regions: " + arrRegionList.length);

                        //Resetting region list and adding default
                        tagSelectRegion.options.length = 0;
                        var tagNewRegion = document.createElement("option");
                        tagNewRegion.text = "Select a Region";
                        tagSelectRegion.add(tagNewRegion, null);

                        //checks if the user region exist
                        if (arrRegionList.length > 0) 
                        {
							//goes around for each region found and addes them to tagSelectRegion
                            for (var intUserRegionIndex = 0; intUserRegionIndex < arrRegionList.length; intUserRegionIndex++) 
                            {
                                var arrUserRegionListSelection = arrRegionList[intUserRegionIndex].trim().split("*");

                                // console.log("From Server Region: " + arrRegionList[intUserRegionIndex].trim().split("*"));

                                if (arrUserRegionListSelection.length > 1) 
                                {
                                    var tagNewRegion = document.createElement("option");//holds the option that will

                                    //sets the propites of the option
                                    tagNewRegion.value = arrUserRegionListSelection[0];
                                    tagNewRegion.text = arrUserRegionListSelection[1];

                                    //adds tagNewNH to the end of tagSelectLocation				
                                    tagSelectRegion.add(tagNewRegion, null);
                                }//end of if
                            }//end of for loop
                        }//end of if
                    }//end for if
                    else
                        //tells the user that there is an error with the Server
                        endMessage(tagMessage, null, true, strFromServerMassage);
                }//end of try
                catch (ex) 
                {
                    //displays the message to the user and turns off the Status Lightbox
                    endMessage(tagMessage, null, true, "Error Region List From Server: " + ex.message);

                    return false;
                }//end of catch
            }//end of if
            else if (htmlJavaServerObject.readyState === 2 && htmlJavaServerObject.status === 500) {
                //tells the user that there is an error with the Server
                endMessage(tagMessage, null, true, "Unable to connect to server");
            } //end of else if
        };//end of function()

        htmlJavaServerObject.send("strTerritory=" + window.localStorage.getItem("strUserTerritory") + "&intRepNumber=" + window.localStorage.getItem("strUserRepKey"));
    }//end of try
    catch (ex) 
    {
        //displays the message to the user and turns off the Status Lightbox
        endMessage(tagMessage, null, true, "Error: " + ex.message);

        return false;
    }//end of catch

    return true;
}//end of getRegionList()

/**
 * get ship to list for a customer
 * @param  {String} strFileName						File Name of the Server Side code
 * @param  {String} tagMessage						ID of the message of the result of AJAX
 * @param  {Object} tagShipTo						The element that will display the ship to date
 * @param  {Object} tagAddistionalShipTo			The element that will display any addistoinal ship to date
 * @param  {Object} tagAdditionalShipToContainer	The element that will display any addistoinal ship to date
 * @return {Boolean}								Returns the results of the AJAX
 */
function getShipToList(strFileName, tagMessage, tagShipTo, tagAddistionalShipTo, tagAdditionalShipToContainer) {
    try {
        var htmlJavaServerObject = new XMLHttpRequest(); //holds the object of the server

        //Abort any currently active request.
        htmlJavaServerObject.abort();

        console.log("Getting Ship To List");

        //checks if there a connection also it sets the page for send to the Server
        if (preSend(tagMessage, "Getting ShipTo List") === false)
           return false;

        // resets Addistoional Ship To for the new customer
		tagAdditionalShipToContainer.className += " divJustHidden";
		resetSelectOption(tagAddistionalShipTo, tagAddistionalShipTo.length);

        // Makes a request
        htmlJavaServerObject.open("Post", strFileName, true);
        htmlJavaServerObject.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

        htmlJavaServerObject.onreadystatechange = function () {
            console.log("Current Ready State: " + htmlJavaServerObject.readyState + " Status " + htmlJavaServerObject.status);

            //in case there is a error with connection
            if (htmlJavaServerObject.readyState === 0 && htmlJavaServerObject.status === 200)
                //displays the message to the user and turns off the Status Lightbox
                endMessage(tagMessage, null, true, "Connection to the server is currently down");
            else if (htmlJavaServerObject.readyState === 4 && htmlJavaServerObject.status === 200) {
                try {
                    var strFromServerMassage = htmlJavaServerObject.responseText;//holds the message from the server

                    // resets the Ship To in case the user selct another customer
                    tagShipTo.innerHTML = "";

                    // console.log("From Server For Ship To: " + strFromServerMassage);

                    //checks if there is a message from the server
                    if (strFromServerMassage.indexOf("Error: ") === -1) {
                        var arrShiptoList = strFromServerMassage.trim().split("!");//holds the region name
                        var strTemplateForDisplayingShipToAddress = "{0} <br/>{1}<br/>{2} {3}<br/>{4}";

                        // console.log("Number of ship to : " + arrShiptoList.length);

                        //checks if the user region exist
                        if (arrShiptoList.length > 1) {
                            //goes around for each region found and addes them to tagSelectRegion
                            for (var intShipToIndex = 0; intShipToIndex < arrShiptoList.length; intShipToIndex++) {
                                var arrShiptoItem = arrShiptoList[intShipToIndex].trim().split("@");//holds the address for this 

                                /*
									Legend for Ship To

									0 = ShipTo ID
									1 = ShipTo Number
									2 = ShipTo Name
									3 = ShipTo Mail Address 1
									4 = ShipTo Mail Address 2
									5 = ShipTo Mail Address 3
									6 = ShipTo Mail Postal Code
									7 = ShipTo Mail Attention
									8 = ShipTo US City
									9 = ShipTo US State
									10 = ShipTo US ZipCode
                                 */
		
								//checks if there is a Name and ID to use
								if (arrShiptoItem.length > 1)
								{
									var tagNewShiptoList = document.createElement("option");//holds the option that will

									//sets the propites of the option
									tagNewShiptoList.value = String.format(strTemplateForDisplayingShipToAddress, formatTextCapliizeAllWords(arrShiptoItem[2]), formatTextCapliizeAllWords(arrShiptoItem[3]), formatTextCapliizeAllWords(arrShiptoItem[8]), formatTextCapliizeAllWords(arrShiptoItem[9]), arrShiptoItem[10]);
									tagNewShiptoList.text = arrShiptoItem[3] + " " + arrShiptoItem[4] + " " + arrShiptoItem[5]; 

									//adds tagNewShiptoList to the end of tagAddistionalShipTo
									tagAddistionalShipTo.add(tagNewShiptoList, null);
								}//end of if
                            }//end of for loop

                            // adds the first item to the ship to section as well as display the addistional ship to
                            changeShipToAddress(tagAddistionalShipTo, tagShipTo);
							tagAdditionalShipToContainer.className = tagAdditionalShipToContainer.className.replace(" divJustHidden", "");
                        }//end of if
                        else
							tagShipTo.innerHTML = String.format(strTemplateForDisplayingShipToAddress, formatTextCapliizeAllWords(window.localStorage.getItem("strCustomerName")), formatTextCapliizeAllWords(window.localStorage.getItem("strCustomerMailStreet")), formatTextCapliizeAllWords(window.localStorage.getItem("strCustomerMailCity")), formatTextCapliizeAllWords(window.localStorage.getItem("strCustomerMailProvinceName")), window.localStorage.getItem("strCustomerMailPostalCode"));
                    }//end for if
                    else
						//tells the user that there is an error with the Server
						endMessage(tagMessage, null, true, strFromServerMassage);
                }//end of try
                catch (ex) {
                    //displays the message to the user and turns off the Status Lightbox
                    endMessage(tagMessage, null, true, "Error Ship List From Server: " + ex.message);

                    return false;
                }//end of catch
            }//end of if
            else if (htmlJavaServerObject.readyState === 2 && htmlJavaServerObject.status === 500) {
                //tells the user that there is an error with the Server
                endMessage(tagMessage, null, true, "Unable to connect to server");
            } //end of else if
        };//end of function()

        htmlJavaServerObject.send("strCustomerNumber=" + window.localStorage.getItem("strCustomerIdKey"));
    }//end of try
    catch (ex) {
        //displays the message to the user and turns off the Status Lightbox
        endMessage(tagMessage, null, true, "Error: " + ex.message);

        return false;
    }//end of catch

    return true;
}//end of getShipToList()

//set up the form to not be used while sending the message
function preSend(tagMessage, strLoadingScreenText)
{
	try {
		// checks if there is a connection
		if(checkConnection() === false)
			//starts the function
			return false;

		// checks if there is a message if so then reset it
		if(tagMessage !== "")
			// resets the message
			displayMessage(tagMessage,"",true,true);
		
		//checks if there is strLoadingScreenText 
		/*if(strLoadingScreenText !== "")
		{
			//displays a message to the user
			getDocID('divLoadingScreenText').innerHTML = strLoadingScreenText;
		
			//checks if the Loading Screen is already on
			if(getDocID('divLoadingGrayBG').style.display !== "block")
				//turns on the Loading Screen
				toggleLayer('divLoadingScreen', 'divLoadingGrayBG');
		}//end of if*/
	}// end of try
	catch(ex) {
		console.log("Error: " + ex.message);

		return false;
	}// end of catch
		
	return true;
}// end of preSend()

/**
 * Deletes the Item from the cart
 * @param  {String} strFileName     File Name Of Where it is going
 * @param  {String} tagMessage      Message of the Results
 * @param  {Int}	intItemToDelete Item that will be deleted
 * @return {Bool}
 */
function sendCartItemsDelete(strFileName, tagMessage, intItemToDelete)
{
    try 
    {
        var htmlJavaServerObject = new XMLHttpRequest(); //holds the object of the server

        //Abort any currently active request.
        htmlJavaServerObject.abort();

        //checks if there a connection also it sets the page for send to the Server
		if(preSend(tagMessage, "Deleting Cart Item") === false)
			return false;

        console.log("Deleting Cart Item");

        // Makes a request
        htmlJavaServerObject.open("Post", strFileName, true);
        htmlJavaServerObject.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

        htmlJavaServerObject.onreadystatechange = function () {
            console.log("Current Ready State: " + htmlJavaServerObject.readyState + " Status " + htmlJavaServerObject.status);

            //in case there is a error with connection
            if (htmlJavaServerObject.readyState === 0 && htmlJavaServerObject.status === 200)
                //displays the message to the user and turns off the Status Lightbox
                endMessage(tagMessage, null, true, "Connection to the server is currently down");
            else if (htmlJavaServerObject.readyState === 4 && htmlJavaServerObject.status === 200) 
            {
                try 
				{
					var strFromServerMassage = htmlJavaServerObject.responseText;//holds the message from the server

					// console.log("From Server Going To Cart: " + strFromServerMassage);

					//checks if there is a message from the server
					if (strFromServerMassage.indexOf("Error: ") === -1) {
					    $("#divCartItemGrandTotalContainer").addClass('divJustHidden');
					    //goes to the cart section
					    goToCheckoutSection(getDocID('bodyApp'), getDocID('sectionCheckout'), getDocID('divCartDetails'), getDocID('divCartItemGrandTotalContainer'), getDocID('lblGrandTotal'));
					}
					else
					    //tells the user that there is an error with the Server
					    endMessage(tagMessage, null, true, strFromServerMassage);
				}//end of try
				catch (ex)
				{
					//displays the message to the user and turns off the Status Lightbox
					endMessage(tagMessage, null, true, "Error Cart Item From Server: " + ex.message);

					return false;
				}//end of catch
            }//end of if
            else if (htmlJavaServerObject.readyState === 2 && htmlJavaServerObject.status === 500) {
                //tells the user that there is an error with the Server
                endMessage(tagMessage, null, true, "Unable to connect to server");
            } //end of else if
        };//end of function()

        htmlJavaServerObject.send("intItemToDelete=" + intItemToDelete);
    }//end of try
    catch (ex) {
        //displays the message to the user and turns off the Status Lightbox
        endMessage(tagMessage, null, true, "Error: " + ex.message);

        return false;
    }//end of catch

    return true;
}//end of sendCartItemsDelete()

/**
 * Updates each of the groups in the cart base on the shipping date
 * @param  {String} strFileName     
 * @param  {String} strErrorMessage 
 * @param  {String} strSIText
 * @param  {String} strItemsQTY
 * @param  {String} strShipToDate
 * @return {Boolean}                 
 */
function sendCartItemsUpdate(strFileName, strErrorMessage, strSIText, strItemsQTY, strShipToDate) {
	try 
    {
        var htmlJavaServerObject = new XMLHttpRequest(); //holds the object of the server

        //Abort any currently active request.
        htmlJavaServerObject.abort();

        //checks if there a connection also it sets the page for send to the Server
		if(preSend(strErrorMessage, "Updateing Cart Items") === false)
			return false;

        console.log("Updating Cart Items");

        // Makes a request
        htmlJavaServerObject.open("Post", strFileName, true);
        htmlJavaServerObject.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

        htmlJavaServerObject.onreadystatechange = function () {
            console.log("Current Ready State: " + htmlJavaServerObject.readyState + " Status " + htmlJavaServerObject.status);

            //in case there is a error with connection
            if (htmlJavaServerObject.readyState === 0 && htmlJavaServerObject.status === 200)
                //displays the message to the user and turns off the Status Lightbox
                endMessage(strErrorMessage, null, true, "Connection to the server is currently down");
            else if (htmlJavaServerObject.readyState === 4 && htmlJavaServerObject.status === 200) 
            {
                try 
				{
					var strFromServerMassage = htmlJavaServerObject.responseText;//holds the message from the server

					console.log("From Server Updated Cart: " + strFromServerMassage);

					//checks if there is a message from the server
					if (strFromServerMassage.indexOf("Error: ") === -1) 
						console.log("Updated Cart");
					else
						//tells the user that there is an error with the Server
						endMessage(strErrorMessage, null, true, strFromServerMassage);
				}//end of try
				catch (ex)
				{
					//displays the message to the user and turns off the Status Lightbox
					endMessage(strErrorMessage, null, true, "Error Cart Item From Server: " + ex.message);

					return false;
				}//end of catch
            }//end of if
            else if (htmlJavaServerObject.readyState === 2 && htmlJavaServerObject.status === 500) {
                //tells the user that there is an error with the Server
                endMessage(strErrorMessage, null, true, "Unable to connect to server");
            } //end of else if
        };//end of function()

		htmlJavaServerObject.send("strItemsQTY=" + encodeURL(strItemsQTY) + "&strSIText=" + encodeURL(strSIText) + "&strShipToDate=" + encodeURL(strShipToDate) + "&strCustomerIdKey=" + window.localStorage.getItem("strCustomerIdKey"));
    }//end of try
    catch (ex) {
        //displays the message to the user and turns off the Status Lightbox
        endMessage(strErrorMessage, null, true, "Error: " + ex.message);

        return false;
    }//end of catch

    return true;
}//end of sendCartItemsUpdate()

/**
 * Updates a date groups shipping date
 * @param  {String} strFileName     
 * @param  {String} strErrorMessage 
 * @param  {String} strOriginalShipToDate
 * @param  {String} strShipToDate
 * @return {Boolean}                 
 */
function sendCartItemsUpdateShipToDate(strFileName, strErrorMessage, strOriginalShipToDate, strShipToDate) {
	try 
    {
        var htmlJavaServerObject = new XMLHttpRequest(); //holds the object of the server

        //Abort any currently active request.
        htmlJavaServerObject.abort();

        //checks if there a connection also it sets the page for send to the Server
		if(preSend(strErrorMessage, "Updateing Cart Items Ship To Date") === false)
			return false;

        console.log("Updating Cart Items Ship To Date");

        // Makes a request
        htmlJavaServerObject.open("Post", strFileName, true);
        htmlJavaServerObject.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

        htmlJavaServerObject.onreadystatechange = function () {
            console.log("Current Ready State: " + htmlJavaServerObject.readyState + " Status " + htmlJavaServerObject.status);

            //in case there is a error with connection
            if (htmlJavaServerObject.readyState === 0 && htmlJavaServerObject.status === 200)
                //displays the message to the user and turns off the Status Lightbox
                endMessage(strErrorMessage, null, true, "Connection to the server is currently down");
            else if (htmlJavaServerObject.readyState === 4 && htmlJavaServerObject.status === 200) 
            {
                try 
				{
					var strFromServerMassage = htmlJavaServerObject.responseText;//holds the message from the server

					console.log("From Server Updated Cart Ship To Date: " + strFromServerMassage);

					//checks if there is a message from the server
					if (strFromServerMassage.indexOf("Error: ") === -1) 
						//reloads the cart
                        goToCheckoutSection(getDocID("bodyApp"), getDocID("sectionCheckout"), getDocID("divCartDetails"), getDocID("divCartItemGrandTotalContainer"), getDocID("lblGrandTotal"));
					else
						//tells the user that there is an error with the Server
						endMessage(strErrorMessage, null, true, strFromServerMassage);
				}//end of try
				catch (ex)
				{
					//displays the message to the user and turns off the Status Lightbox
					endMessage(strErrorMessage, null, true, "Error Cart Item Ship To Date From Server: " + ex.message);

					return false;
				}//end of catch
            }//end of if
            else if (htmlJavaServerObject.readyState === 2 && htmlJavaServerObject.status === 500) {
                //tells the user that there is an error with the Server
                endMessage(strErrorMessage, null, true, "Unable to connect to server");
            } //end of else if
        };//end of function()

		htmlJavaServerObject.send("strOriginalShipToDate=" + encodeURL(strOriginalShipToDate) + "&strShipToDate=" + encodeURL(strShipToDate) + "&strCustomerIdKey=" + window.localStorage.getItem("strCustomerIdKey"));
    }//end of try
    catch (ex) {
        //displays the message to the user and turns off the Status Lightbox
        endMessage(strErrorMessage, null, true, "Error: " + ex.message);

        return false;
    }//end of catch

    return true;
}//end of sendCartItemsUpdateShipToDate()

/**
 * sends an cart item to the server to be added to the Cart Items in the database
 * @param  {String} strFileName						Location of the server side coe
 * @param  {String} tagMessage						ID of the message that will be display to the user
 * @param  {String} strDiscount						Discount from on the cart
 * @param  {Object} tagComment						Any comments on the items
 * @param  {Date}   dateShipToDate					When the items will be ship
 * @param  {Object} tagPromoCode					Any promo codes for the cart
 * @param  {Object} tagBodyApp						Pass thought in order to send the user to the cart if items have been added to the cart
 * @param  {Object} tagSectionCheckout				Pass thought in order to send the user to the cart if items have been added to the cart
 * @param  {Object} tagCartItemsDetails				Pass thought in order to send the user to the cart if items have been added to the cart
 * @param  {Object} tagCartItemGrandTotalContainer	Pass thought in order to send the user to the cart if items have been added to the cart
 * @param  {Object} tagGrandTotal					Pass thought in order to send the user to the cart if items have been added to the cart
 * @param  {Int}    intCollectionID					Collection ID when the user wants to use add all items to cart
 * @param  {Int}    intColourWayID					Colourway ID when the user wants to use add all items to cart
 * @param  {Int}	intSelectedFabricCategoryID		Fabric Category ID when the user wants to use add all items to cart
 * @param  {Boolean}boolUseCollection				If only the Collection is being used
 * @param  {Boolean}boolHalfPiece					If there is a Collection or Colourway ID Is this Half of the Pieces
 * @return {Boolean}								Results of the function
 */
function sendCartItem(strFileName, tagMessage, strDiscount, tagComment, dateShipToDate, tagPromoCode, tagBodyApp, tagSectionCheckout, tagCartItemsDetails, tagCartItemGrandTotalContainer, tagGrandTotal, intCollectionID, intColourWayID, intSelectedFabricCategoryID, boolUseCollection, boolHalfPiece)
{
    try
    {
		var htmlJavaServerObject = new XMLHttpRequest(); //holds the object of the server
	
		//Abort any currently active request.
		htmlJavaServerObject.abort();
		
		console.log("Adding Item to Cart");

		//checks if there is a collection of a Colourway ID as this means that all of the items will be added to the cart
		if(intCollectionID > 0)
			//reset strUserSelectedItems to use the colourway because all of the items either way will be going into the cart
			window.localStorage.setItem("strUserSelectedItems", intCollectionID + "*" + intColourWayID + "*" + intSelectedFabricCategoryID + "*" + boolUseCollection + "*" + boolHalfPiece + "*" + window.localStorage.getItem("strCustomerCountry") + "!");

        //sets the page for send to the Server
		preSend(tagMessage, "Adding Item to Cart");
	
		// Makes a request
		htmlJavaServerObject.open("Post", strFileName, true);
		htmlJavaServerObject.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	
		htmlJavaServerObject.onreadystatechange = function () 
		{
			console.log("Current Ready State: " + htmlJavaServerObject.readyState + " Status " + htmlJavaServerObject.status);

			//in case there is a error with connection
			if(htmlJavaServerObject.readyState === 0 && htmlJavaServerObject.status === 200)
				//displays the message to the user and turns off the Status Lightbox
				endMessage(tagMessage, null, true, "Connection to the server is currently down");
			else if (htmlJavaServerObject.readyState === 4 && htmlJavaServerObject.status === 200) 
			{
				try 
				{
					var strFromServerMassage = htmlJavaServerObject.responseText;//holds the message from the server

					// console.log("From Server Going To Cart: " + strFromServerMassage);

					//checks if there is a message from the server
					if (strFromServerMassage.indexOf("Error: ") === -1) 
						//goes to the cart section
						goToCheckoutSection(tagBodyApp, tagSectionCheckout, tagCartItemsDetails, tagCartItemGrandTotalContainer, tagGrandTotal);
					else
						//tells the user that there is an error with the Server
						endMessage(tagMessage, null, true, strFromServerMassage);
				}//end of try
				catch (ex)
				{
					//displays the message to the user and turns off the Status Lightbox
					endMessage(tagMessage, null, true, "Error Cart Item From Server: " + ex.message);

					return false;
				}//end of catch
			}//end of if
			else if (htmlJavaServerObject.readyState === 2 && htmlJavaServerObject.status === 500) 
			{
				//tells the user that there is an error with the Server
				endMessage(tagMessage, null, true, "Unable to connect to server");
			} //end of else if
		};//end of function()

		console.log("strSelectedItems: " + window.localStorage.getItem("strUserSelectedItems"));

		htmlJavaServerObject.send("strSelectedItems=" + encodeURL(window.localStorage.getItem("strUserSelectedItems")) + "&txtDiscount=" + encodeURL(strDiscount) + "&txtComment=" + encodeURL(tagComment) + "&txtShipToDate=" + encodeURL(new Date(dateShipToDate).toISOString().slice(0, 19).replace('T', ' ').toString()) + "&txtPromoCode=" + encodeURL(tagPromoCode) + "&strCustomerIdKey=" + window.localStorage.getItem("strCustomerIdKey"));
    }//end of try
    catch (ex) 
    {
        //displays the message to the user and turns off the Status Lightbox
        endMessage(tagMessage, null, true, "Error: " + ex.message);

        return false;
    }//end of catch

    return true;
}//end of sendCartItem()

//sends an username and password for login page to a server
function sendLogin(strFileName, tagMessage, tagEmail, tagPassword, arrIndexField)
{
    try
    {
		var htmlJavaServerObject = new XMLHttpRequest(); //holds the object of the serv

		//Abort any currently active request.
		htmlJavaServerObject.abort();
		
		//if username and password text box is empty
		if (tagEmail.value === "" || tagPassword.value === "") 
		{
			displayMessage(tagMessage, 'You must enter username and password', true, true);

			return false;
		}//end of if

		console.log("Login Starting");
	
        //checks if there a connection also it sets the page for send to the Server
		if(preSend(tagMessage, "Logging in...") === false)
			return false;

		// Makes a request
		htmlJavaServerObject.open("Post", strFileName, true);
		htmlJavaServerObject.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	
		htmlJavaServerObject.onreadystatechange = function ()  {
			console.log("Current Ready State: " + htmlJavaServerObject.readyState + " Status " + htmlJavaServerObject.status);

			//in case there is a error with connection
			if(htmlJavaServerObject.readyState === 0 && htmlJavaServerObject.status === 200)
				//displays the message to the user and turns off the Status Lightbox
				endMessage(tagMessage, null, true, "Connection to the server is currently down");
			else if (htmlJavaServerObject.readyState === 4 && htmlJavaServerObject.status === 200) 
			{
				try 
				{
					var strFromServerMassage = htmlJavaServerObject.responseText;//holds the message from the server

					// console.log("From Server Login: " + strFromServerMassage);

					//checks if there is a message from the server
					if (strFromServerMassage.indexOf("Error: ") === -1) 
					{
						var arrUserDetails = strFromServerMassage.trim().split("*");//holds the user details

						//check to see if user's details exists then redirect them to home page
						if (arrUserDetails.length > 0) 
						{
							//gets the User details for future use and send the user to the home screen
							window.localStorage.setItem("strUserRepKey", arrUserDetails[0].trim());
							window.localStorage.setItem("strUserFullName", arrUserDetails[1].trim() + " " + arrUserDetails[2].trim());
							window.localStorage.setItem("strUserFirstName", arrUserDetails[1].trim());
							window.localStorage.setItem("strUserLastName", arrUserDetails[2].trim());
							window.localStorage.setItem("strUserEmail", arrUserDetails[3].trim());
							window.localStorage.setItem("strUserTerritory", arrUserDetails[4].trim());

							//loads in the welcome message and sends the user to the customer sectionnd of if
							startUp(arrIndexField);
						}//end of if
					}//end for if
					else 
						//tells the user that there is an error with the Server
						endMessage(tagMessage, null, true, strFromServerMassage);
				}//end of try
				catch (ex)
				{
					//displays the message to the user and turns off the Status Lightbox
					endMessage(tagMessage, null, true, "Error Login Credentials From Server: " + ex.message);

					return false;
				}//end of catch
			}//end of if
			else if (htmlJavaServerObject.readyState === 2 && htmlJavaServerObject.status === 500) 
			{
				//tells the user that there is an error with the Server
				endMessage(tagMessage, null, true, "Unable to connect to server");
			} //end of else if
		};//end of function()
		
		htmlJavaServerObject.send("txtEmail=" + encodeURL(encryptRSA(tagEmail.value)) + "&txtPassword=" + encodeURL(encryptRSA(tagPassword.value)));
    }//end of try
    catch (ex) 
    {
        //displays the message to the user and turns off the Status Lightbox
        endMessage(tagMessage, null, true, "Error: " + ex.message);

        return false;
    }//end of catch

    return true;
}//end of sendLogin()

/**
 * submit promo code
 * @param  {String} strFileName     File Name Of Where it is going
 * @param  {String} tagMessage      Message of the Results
 * @return {Bool}
 */
function submitPromoCode(strFileName, tagMessage, tagPromoCode) {
    try {
        var htmlJavaServerObject = new XMLHttpRequest(); //holds the object of the server

        //Abort any currently active request.
        htmlJavaServerObject.abort();

        console.log("Submiting promo code");

        //checks if there a connection also it sets the page for send to the Server
		if(preSend(tagMessage, "Submiting promo code") === false)
			return false;

        //resetting message div
        getDocID(tagMessage).style.display = "none";

        //if promo code is blank
        if (tagPromoCode.value === "") {
            displayMessage(tagMessage, "Please enter promo code.", true, true);
            return false;
        }

        // Makes a request
        htmlJavaServerObject.open("Post", strFileName, true);
        htmlJavaServerObject.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

        htmlJavaServerObject.onreadystatechange = function () {
            console.log("Current Ready State: " + htmlJavaServerObject.readyState + " Status " + htmlJavaServerObject.status);

            //in case there is a error with connection
            if (htmlJavaServerObject.readyState === 0 && htmlJavaServerObject.status === 200)
                //displays the message to the user and turns off the Status Lightbox
                endMessage(tagMessage, null, true, "Connection to the server is currently down");
            else if (htmlJavaServerObject.readyState === 4 && htmlJavaServerObject.status === 200) {
                try {
                    var strFromServerMassage = htmlJavaServerObject.responseText;//holds the message from the server

                    //console.log("From Server Going To promocode: " + strFromServerMassage);

                    //checks if there is a message from the server
                    if (strFromServerMassage.indexOf("Error: ") === -1)
                        //shows success message
                        displayMessage(tagMessage, "Promo code has been saved.", true, true);
                    else
                        //tells the user that there is an error with the Server
                        endMessage(tagMessage, null, true, strFromServerMassage);
                }//end of try
                catch (ex) {
                    //displays the message to the user and turns off the Status Lightbox
                    endMessage(tagMessage, null, true, "Error  From Server: " + ex.message);

                    return false;
                }//end of catch
            }//end of if
            else if (htmlJavaServerObject.readyState === 2 && htmlJavaServerObject.status === 500) {
                //tells the user that there is an error with the Server
                endMessage(tagMessage, null, true, "Unable to connect to server");
            } //end of else if
        };//end of function()

        console.log("strCustomerNumber: " + window.localStorage.getItem("strCustomerIdKey"));
        console.log("tagPromoCode.value: " + tagPromoCode.value);

        htmlJavaServerObject.send("strCustomerNumber=" + window.localStorage.getItem("strCustomerIdKey") + "&txtPromoCode=" + encodeURL(encryptRSA(tagPromoCode.value)));
    }//end of try
    catch (ex) {
        //displays the message to the user and turns off the Status Lightbox
        endMessage(tagMessage, null, true, "Error: " + ex.message);

        return false;
    }//end of catch

    return true;
}//end of submitPromoCode()

/**
 * updates the Fabric QTY on the server
 * @param  {String} strFileName     File Name Of Where it is going
 * @param  {String} tagMessage      Message of the Results
 * @param  {Int}	intFabricQTYID	ID of the fabric row
 * @param  {Object} tagSelFabricQTY New Selected Fabric QTY
 * @return {Bool}
 */
function updateFabricQTY(strFileName, tagMessage, intFabricQTYID, tagSelFabricQTY) {
	try {
        var htmlJavaServerObject = new XMLHttpRequest(); //holds the object of the server

        //Abort any currently active request.
        htmlJavaServerObject.abort();

        console.log("Update Fabric QTY");

        //checks if there a connection also it sets the page for send to the Server
		if(preSend(tagMessage, "Update Fabric QTY") === false)
			return false;

        // Makes a request
        htmlJavaServerObject.open("Post", strFileName, true);
        htmlJavaServerObject.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

        htmlJavaServerObject.onreadystatechange = function () {
            console.log("Current Ready State: " + htmlJavaServerObject.readyState + " Status " + htmlJavaServerObject.status);

            //in case there is a error with connection
            if (htmlJavaServerObject.readyState === 0 && htmlJavaServerObject.status === 200)
                //displays the message to the user and turns off the Status Lightbox
                endMessage(tagMessage, null, true, "Connection to the server is currently down");
            else if (htmlJavaServerObject.readyState === 4 && htmlJavaServerObject.status === 200) {
                try {
                    var strFromServerMassage = htmlJavaServerObject.responseText;//holds the message from the server

                    //console.log("From Server Update Fabric QTY: " + strFromServerMassage);

                    //checks if there is a message from the server
                    if (strFromServerMassage.indexOf("Error: ") === -1)
                        //reloads the cart
                        goToCheckoutSection(getDocID("bodyApp"), getDocID("sectionCheckout"), getDocID("divCartDetails"), getDocID("divCartItemGrandTotalContainer"), getDocID("lblGrandTotal"));
                    else
                        //tells the user that there is an error with the Server
                        endMessage(tagMessage, null, true, strFromServerMassage);
                }//end of try
                catch (ex) {
                    //displays the message to the user and turns off the Status Lightbox
                    endMessage(tagMessage, null, true, "Error Update Fabric QTY From Server: " + ex.message);

                    return false;
                }//end of catch
            }//end of if
            else if (htmlJavaServerObject.readyState === 2 && htmlJavaServerObject.status === 500) {
                //tells the user that there is an error with the Server
                endMessage(tagMessage, null, true, "Unable to connect to server");
            } //end of else if
        };//end of function()

        htmlJavaServerObject.send("strCustomerNumber=" + window.localStorage.getItem("strCustomerIdKey") + "&strItemsQTY=" + encodeURL(encryptRSA(intFabricQTYID + "*" + getSelectOption(tagSelFabricQTY)[0])));
    }//end of try
    catch (ex) {
        //displays the message to the user and turns off the Status Lightbox
        endMessage(tagMessage, null, true, "Error: " + ex.message);

        return false;
    }//end of catch

    return true;
}//edn of updateFabricQTY()

//get all of the Order List
function getOrderInfoList(strFileName, tagMessage, tagOrderListDetails, tagOrderDetails) {
    try {
        var htmlJavaServerObject = new XMLHttpRequest(); //holds the object of the server

        //Abort any currently active request.
        htmlJavaServerObject.abort();

        console.log("Getting Order List");

        //checks if there a connection also it sets the page for send to the Server
        if (preSend(tagMessage, "Getting Order List") === false)
           return false;

        //resets the Order list body
        tagOrderListDetails.innerHTML = "";
        
        $("#divOrderList").removeClass('divJustHidden');

        //resets the Order details body
        tagOrderDetails.innerHTML = "";

        // Makes a request
        htmlJavaServerObject.open("Post", strFileName, true);
        htmlJavaServerObject.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

        htmlJavaServerObject.onreadystatechange = function () {
            console.log("Current Ready State: " + htmlJavaServerObject.readyState + " Status " + htmlJavaServerObject.status);

            //in case there is a error with connection
            if (htmlJavaServerObject.readyState === 0 && htmlJavaServerObject.status === 200)
                //displays the message to the user and turns off the Status Lightbox
                endMessage(tagMessage, null, true, "Connection to the server is currently down");
            else if (htmlJavaServerObject.readyState === 4 && htmlJavaServerObject.status === 200) {
                try {
                    var strFromServerMassage = htmlJavaServerObject.responseText;//holds the message from the server

                    //console.log("From Server Order List: " + strFromServerMassage);

                    //checks if there is a message from the server
                    if (strFromServerMassage.indexOf("Error: ") === -1) {
                        //spilits each item 
                        var arrOrderListDetails = strFromServerMassage.trim().split("!");//holds the order details

                        //console.log("Number of order: " + arrCartItemsDetails.length);
                        
                        //checks if there are items in the cart
                        if (arrOrderListDetails.length > 0) {

                            tagOrderListDetails.innerHTML += "<div class='customContainer divOrderListHeaderContainer'>" +
                                "<div class='customLeft divOrderListHeaderMiddle divOrderListHeaderLeft'>" +
                                    "<label>Order Date</label>" +
                                "</div>" +
                                "<div class='customMiddle divOrderListHeaderMiddle'>" +
                                    "<label>Shipping Date</label>" +
                                "</div>" +
                                "<div class='customMiddle divOrderListHeaderMiddle'>" +
                                    "<label>Order Number</label>" +
                                "</div>" +
                                "<div class='customMiddle divOrderListHeaderMiddle'>" +
                                    "<label>P.O Number</label>" +
                                "</div>" +
                                "<div class='customMiddle divOrderListHeaderMiddle'>" +
                                    "<label>Total</label>" +
                                "</div>" +
                                "<div class='customMiddle divOrderListHeaderMiddle'>" +
                                    "<label>Shipping Status</label>" +
                                "</div>" +
                                "<div class='customMiddle divOrderListHeaderMiddle'>" +
                                    "<label>Details</label>" +
                                "</div>" +
                                "<div class='customFooter divOrderListHeaderFooter'></div>" +
                            "</div>";

                            for (var intOrderItemIndex = 0; intOrderItemIndex < arrOrderListDetails.length; intOrderItemIndex++) {
                                var arrOrderItemDetails = arrOrderListDetails[intOrderItemIndex].split("@");

                                /*
									Legend of order list
                                */

                                //display order list grid
                                tagOrderListDetails.innerHTML += String.format("<div class='customContainer divOrderListBodyContainer'>\n" +
                                    "<div class='customMiddle divOrderListBodyMiddle divOrderListBodyLeft'>\n" +
                                        "<label>&nbsp;{0}</label>\n" +
                                    "</div>\n" +
                                    "<div class='customMiddle divOrderListBodyMiddle'>\n" +
                                        "<label>&nbsp;{1}</label>\n" +
                                    "</div>\n" +
                                    "<div class='customMiddle divOrderListBodyMiddle'>\n" +
                                        "<label>&nbsp;{2}</label>\n" +
                                    "</div>\n" +
                                    "<div class='customMiddle divOrderListBodyMiddle'>\n" +
                                        "<label>&nbsp;{3}</label>\n" +
                                    "</div>\n" +
                                    "<div class='customMiddle divOrderListBodyMiddle'>\n" +
                                        "<label>${4}</label>\n" +
                                    "</div>\n" +
                                    "<div class='customMiddle divOrderListBodyMiddle'>\n" +
                                        "<label>&nbsp;{5}</label>\n" +
                                    "</div>\n" +
                                    "<div class='customLeft divOrderListBodyMiddle divOrderListBodyRight'>\n" +
                                        "<a href='javascript:void(0);' onclick='ShowOrderDetail(&quot;" + tagMessage + "&quot;, &quot;{6}&quot;,&quot;{7}&quot;,&quot;{8}&quot;);' class='aOrangeLink'>Details</a>\n" +
                                    "</div>\n" +
                                    "<div class='customFooter divOrderListBodyFooter'></div>\n" +
                                "</div>\n\n", arrOrderItemDetails[1], arrOrderItemDetails[2], arrOrderItemDetails[3], arrOrderItemDetails[4], arrOrderItemDetails[5], arrOrderItemDetails[6], arrOrderItemDetails[0], tagOrderListDetails.id, tagOrderDetails.id);
                            }//end of for loop

                            classToggleLayer(getDocID('bodyApp'), getDocID('sectionOrderList'), 'divJustHidden sectionBody', 'section');
                        }//end of if  
                        else {
                            //Shows no data in page
                            endMessage(tagMessage, null, true, "There is no order for this customer.");
                        }
                    }//end of if
                    else
                        //tells the user that there is an error with the Server
                        endMessage(tagMessage, null, true, strFromServerMassage);
                }//end of try
                catch (ex) {
                    //displays the message to the user and turns off the Status Lightbox
                    endMessage(tagMessage, null, true, "Error order list From Server: " + ex.message);

                    return false;
                }//end of catch
            }//end of if
            else if (htmlJavaServerObject.readyState === 2 && htmlJavaServerObject.status === 500)
                //tells the user that there is an error with the Server
                endMessage(tagMessage, null, true, "Unable to connect to server");
        };//end of function()

        htmlJavaServerObject.send("selectedCustomer=" + window.localStorage.getItem("strCustomerIdKey"));
    }//end of try
    catch (ex) {
        //displays the message to the user and turns off the Status Lightbox
        endMessage(tagMessage, null, true, "Error: " + ex.message);

        return false;
    }//end of catch

    return true;
}//end of getOrderInfoList()

//get all of the Order details by order id
function showOrderDetails(strFileName, tagMessage, intOrderID, tagOrderDetails) {
    try {
        var htmlJavaServerObject = new XMLHttpRequest(); //holds the object of the server

        //Abort any currently active request.
        htmlJavaServerObject.abort();

        // console.log("Getting Order Details for order id " + intOrderID);

		//checks if there a connection also it sets the page for send to the Server
		if (preSend(tagMessage, "Getting Order Details") === false)
			return false;

        //resets the Order details body
        tagOrderDetails.innerHTML = "";

        // Makes a request
        htmlJavaServerObject.open("Post", strFileName, true);
        htmlJavaServerObject.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

        htmlJavaServerObject.onreadystatechange = function () {
            console.log("Current Ready State: " + htmlJavaServerObject.readyState + " Status " + htmlJavaServerObject.status);

            //in case there is a error with connection
            if (htmlJavaServerObject.readyState === 0 && htmlJavaServerObject.status === 200)
                //displays the message to the user and turns off the Status Lightbox
                endMessage(tagMessage, null, true, "Connection to the server is currently down");
            else if (htmlJavaServerObject.readyState === 4 && htmlJavaServerObject.status === 200) {
                try {
                    var strFromServerMassage = htmlJavaServerObject.responseText;//holds the message from the server

                    //console.log("From Server Order Details: " + strFromServerMassage);

                    //checks if there is a message from the server
                    if (strFromServerMassage.indexOf("Error: ") === -1) {
                        //spilits each item 
                        var arrOrderItemsDetails = strFromServerMassage.trim().split("!");//holds the order details

                        console.log("Number of order: " + arrOrderItemsDetails.length);

                        //checks if there are items in the cart
                        if (arrOrderItemsDetails.length > 0) {

                            //console.log("First item: " + arrOrderItemsDetails[0]);

                            var arrOrderDetails = arrOrderItemsDetails[0].split("@");

                            tagOrderDetails.innerHTML += "<div class='customContainer divCartItemBodyContainer'>" +
                                    "<div class='customLeft'>" +
                                        "<h1>My Order Details</h1>" +
                                    "</div>" +
                                    "<div class='customRight divOrderDetailBackToList'>" +
                                        "<a href='javascript:void(0);' onclick='ShowOrderList();' class='aOrangeLink'> < Back To List</a>" +
                                    "</div>" +
                                    "<div class='customFooter'></div>" +
                                "</div>" +
                                "<div class='customContainer divCartOrderDetailsBillingShippingContainer'>" +
                                    "<div class='customLeft divOrderDetailsBillingShippingLeft'>" +
                                        "<h1>Order Information</h1>" +

                                        "<div class='customContainer divOrderDetailsBillingShippingItemsContainer'>" +
                                            "<div class='customLeft divOrderDetailsBillingShippingItemsLeft'>" +
                                                "<label>Order Number:</label>" +
                                            "</div>" +
                                            "<div class='customLeft divOrderDetailsBillingShippingItemsRight'>" +
                                                "<label id='Label1'>" + arrOrderDetails[0] + "</label>" +
                                            "</div>" +
                                            "<div class='customFooter divCartOrderDetailsBillingShippingItemsFooter'></div>" +
                                        "</div>" +

                                        "<div class='customContainer divCartOrderDetailsBillingShippingItemsContainer'>" +
                                            "<div class='customLeft divOrderDetailsBillingShippingItemsLeft'>" +
                                                "<label>Order Date:</label>" +
                                            "</div>" +
                                            "<div class='customLeft divOrderDetailsBillingShippingItemsRight'>" +
                                                "<label id='Label2'>" + arrOrderDetails[1] + "</label>" +
                                            "</div>" +
                                            "<div class='customFooter divCartOrderDetailsBillingShippingItemsFooter'></div>" +
                                        "</div>" +

                                        "<div class='customContainer divCartOrderDetailsBillingShippingItemsContainer'>" +
                                            "<div class='customLeft divOrderDetailsBillingShippingItemsLeft'>" +
                                                "<label>Bill to:</label>" +
                                            "</div>" +
                                            "<div class='customLeft divOrderDetailsBillingShippingItemsRight'>" +
                                                "<label id='Label4'>" +
                                                    window.localStorage.getItem('strCustomerName') + "<br/>" +
                                                    window.localStorage.getItem("strCustomerMailStreet") + "<br/>" +
                                                    window.localStorage.getItem("strCustomerMailCity") + ", " + window.localStorage.getItem('strCustomerProv') + "<br/>" +
                                                    window.localStorage.getItem('strCustomerMailPostalCode') + "<br/>" +
                                                    "Tel:" + window.localStorage.getItem("strCustomerPhone") + "<br/>" +
                                                    "Fax:" + window.localStorage.getItem("strCustomerFax") + "<br/>" +
                                                "</label>" +
                                            "</div>" +
                                        "<div class='customFooter divCartOrderDetailsBillingShippingItemsFooter'></div>" +
                                    "</div>" +

                                    "<div class='customContainer divCartOrderDetailsBillingShippingItemsContainer'>" +
                                        "<div class='customLeft divOrderDetailsBillingShippingItemsLeft'>" +
                                            "<label>Instructions:</label>" +
                                        "</div>" +
                                        "<div class='customLeft divOrderDetailsBillingShippingItemsRight'>" +
                                            "<label id='Label3'>" + arrOrderDetails[2] + "</label>" +
                                        "</div>" +
                                        "<div class='customFooter divCartOrderDetailsBillingShippingItemsFooter'></div>" +
                                    "</div>" +
                                "</div>" +
                                "<div class='customLeft divCartOrderDetailsBillingShippingRight'>" +
                                    "<h1>Shipping Information</h1>" +

                                    "<div class='customContainer divCartOrderDetailsBillingShippingItemsContainer'>" +
                                        "<div class='customLeft divOrderDetailsBillingShippingItemsLeft'>" +
                                            "<label>Order Status:</label>" +
                                        "</div>" +
                                        "<div class='customLeft divOrderDetailsBillingShippingItemsRight'>" +
                                            "<label id='Label5'>" + arrOrderDetails[3] + "</label>" +
                                        "</div>" +
                                        "<div class='customFooter divCartOrderDetailsBillingShippingItemsFooter'></div>" +
                                    "</div>" +

                                    "<div class='customContainer divCartOrderDetailsBillingShippingItemsContainer'>" +
                                        "<div class='customLeft divOrderDetailsBillingShippingItemsLeft'>" +
                                            "<label>Ship Date:</label>" +
                                        "</div>" +
                                        "<div class='customLeft divOrderDetailsBillingShippingItemsRight'>" +
                                            "<label id='Label6'>" + arrOrderDetails[4] + "</label>" +
                                        "</div>" +
                                        "<div class='customFooter divCartOrderDetailsBillingShippingItemsFooter'></div>" +
                                    "</div>" +

                                    "<div class='customContainer divCartOrderDetailsBillingShippingItemsContainer'>" +
                                        "<div class='customLeft divOrderDetailsBillingShippingItemsLeft'>" +
                                            "<label>Web OrderID:</label>" +
                                        "</div>" +
                                        "<div class='customLeft divOrderDetailsBillingShippingItemsRight'>" +
                                            "<label id='Label7'>" + arrOrderDetails[5] + "</label>" +
                                        "</div>" +
                                        "<div class='customFooter divCartOrderDetailsBillingShippingItemsFooter'></div>" +
                                    "</div>" +

                                    "<div class='customContainer divCartOrderDetailsBillingShippingItemsContainer'>" +
                                        "<div class='customLeft divOrderDetailsBillingShippingItemsLeft'>" +
                                            "<label>PRO Order Number:</label>" +
                                        "</div>" +
                                        "<div class='customLeft divOrderDetailsBillingShippingItemsRight'>" +
                                            "<label id='Label8'>" + arrOrderDetails[6] + "</label>" +
                                        "</div>" +
                                        "<div class='customFooter divCartOrderDetailsBillingShippingItemsFooter'></div>" +
                                    "</div>" +

                                    "<div class='customContainer divCartOrderDetailsBillingShippingItemsContainer'>" +
                                        "<div class='customLeft divOrderDetailsBillingShippingItemsLeft'>" +
                                            "<label>Last Shipped Date:</label>" +
                                        "</div>" +
                                        "<div class='customLeft divOrderDetailsBillingShippingItemsRight'>" +
                                            "<label id='Label9'>" + arrOrderDetails[7] + "</label>" +
                                        "</div>" +
                                        "<div class='customFooter divCartOrderDetailsBillingShippingItemsFooter'></div>" +
                                    "</div>" +

                                    "<div class='customContainer divCartOrderDetailsBillingShippingItemsContainer'>" +
                                        "<div class='customLeft divOrderDetailsBillingShippingItemsLeft'>" +
                                            "<label>Last Involice Number:</label>" +
                                        "</div>" +
                                        "<div class='customLeft divOrderDetailsBillingShippingItemsRight'>" +
                                            "<label id='Label10'>" + arrOrderDetails[8] + "</label>" +
                                        "</div>" +
                                        "<div class='customFooter divCartOrderDetailsBillingShippingItemsFooter'></div>" +
                                    "</div>" +

                                    "<div class='customContainer divCartOrderDetailsBillingShippingItemsContainer'>" +
                                        "<div class='customLeft divOrderDetailsBillingShippingItemsLeft'>" +
                                            "<label>Total Units Ordered:</label>" +
                                        "</div>" +
                                        "<div class='customLeft divOrderDetailsBillingShippingItemsRight'>" +
                                            "<label id='Label11'>" + arrOrderDetails[9] + "</label>" +
                                        "</div>" +
                                        "<div class='customFooter divCartOrderDetailsBillingShippingItemsFooter'></div>" +
                                    "</div>" +

                                    "<div class='customContainer divCartOrderDetailsBillingShippingItemsContainer'>" +
                                        "<div class='customLeft divOrderDetailsBillingShippingItemsLeft'>" +
                                            "<label>Cumulative Units Shipped:</label>" +
                                        "</div>" +
                                        "<div class='customLeft divOrderDetailsBillingShippingItemsRight'>" +
                                            "<label id='Label12'>" + arrOrderDetails[10] + "</label>" +
                                        "</div>" +
                                        "<div class='customFooter divCartOrderDetailsBillingShippingItemsFooter'></div>" +
                                    "</div>" +

                                    "<div class='customContainer divCartOrderDetailsBillingShippingItemsContainer'>" +
                                        "<div class='customLeft divOrderDetailsBillingShippingItemsLeft'>" +
                                            "<label>Percentage Shipped:</label>" +
                                        "</div>" +
                                        "<div class='customLeft divOrderDetailsBillingShippingItemsRight'>" +
                                            "<label id='Label13'>" + arrOrderDetails[11] + "</label>" +
                                        "</div>" +
                                        "<div class='customFooter divCartOrderDetailsBillingShippingItemsFooter'></div>" +
                                    "</div>" +
                                "</div>" +
                                "<div class='customFooter divCartOrderDetailsBillingShippingFooter'></div>" +
                            "</div>" +

                            "<div class='customContainer divOrderItemHeaderContainer'>" +
                                "<div class='customLeft divOrderItemHeaderLeft'>" +
                                    "<label>Preview</label>" +
                                "</div>" +
                                "<div class='customMiddle divOrderItemHeaderMiddle'>" +
                                    "<label>SKU</label>" +
                                "</div>" +
                                "<div class='customMiddle divOrderItemHeaderCollectionName divOrderItemHeaderMiddle'>" +
                                    "<label>Collection Name</label>" +
                                "</div>" +
                                "<div class='customMiddle divOrderItemHeaderMiddle'>" +
                                    "<label>Price</label>" +
                                "</div>" +
                                "<div class='customMiddle divOrderItemHeaderMiddle'>" +
                                    "<label>Qty</label>" +
                                "</div>" +
                                "<div class='customMiddle divOrderItemHeaderMiddle'>" +
                                    "<label>Discount</label>" +
                                "</div>" +
                                "<div class='customMiddle divOrderItemHeaderMiddle'>" +
                                    "<label>Sub Total</label>" +
                                "</div>" +
                                "<div class='customFooter divCartItemHeaderFooter'></div>" +
                            "</div>";


                            var fltItemGroupSubTotal = 0.00;//holds the sub totals for this item group
                            for (var intOrderItemIndex = 1; intOrderItemIndex < arrOrderItemsDetails.length; intOrderItemIndex++) {
                                var arrOrderItem = arrOrderItemsDetails[intOrderItemIndex].split("@");

                                tagOrderDetails.innerHTML += "<div class='customContainer divOrderItemBodyContainer'>" +
                                    "<div class='customLeft divOrderItemBodyLeft'>" +
                                        "<img src='http://northcott.com/swatchimages/" + arrOrderItem[0] + ".jpg' alt='" + arrOrderItem[1] + "' width='190' />" +
                                    "</div>" +
                                    "<div class='customMiddle divOrderItemBodyMiddle'>" +
                                        "<label>" + arrOrderItem[0] + "</label>" +
                                    "</div>" +
                                    "<div class='customMiddle divOrderItemBodyCollectionName divOrderItemBodyMiddle'>" +
                                        "<label>" + arrOrderItem[1] + "</label>" +
                                    "</div>" +
                                    "<div class='customMiddle divOrderItemBodyMiddle'>" +
                                        "<label>" + arrOrderItem[2] + "</label>" +
                                    "</div>" +
                                    "<div class='customMiddle divOrderItemBodyMiddle'>" +
                                        "<label>" + arrOrderItem[3] + "</label>" +
                                    "</div>" +
                                    "<div class='customMiddle divOrderItemBodyMiddle'>" +
                                        "<label>$" + arrOrderItem[4] + "</label>" +
                                    "</div>" +
                                    "<div class='customMiddle divOrderItemBodyMiddle'>" +
                                        "<label>$" + arrOrderItem[5] + "</label>" +
                                    "</div>" +
                                    "<div class='customFooter divCartItemBodyFooter'></div>" +
                                "</div>";

                                // adds to the sub total for this group
                                fltItemGroupSubTotal += parseFloat(arrOrderItem[5]);
                                //console.log("ItemGroupSubTotal: " + fltItemGroupSubTotal);
                            }

                            tagOrderDetails.innerHTML += "<div class='customContainer divOrderItemTotalsContainer'>" +
                                "<div class='customLeft divOrderItemTotalsLeft'>" +
                                    "<label>Total: </label>" +
                                "</div>" +
                                "<div class='customLeft divOrderItemTotalsRight'>" +
                                    "<label id='Label14'>" + fltItemGroupSubTotal + "</label>" +
                                "</div>" +
                                "<div class='customFooter divCartItemTotalsFooter'></div>" +
                            "</div>";                            
                        }//end of if  
                        else {
                            //Shows no data in page
                            endMessage(tagMessage, null, true, "There is no order for this customer.");
                        }
                    }//end of if
                    else
                        //tells the user that there is an error with the Server
                        endMessage(tagMessage, null, true, strFromServerMassage);
                }//end of try
                catch (ex) {
                    //displays the message to the user and turns off the Status Lightbox
                    endMessage(tagMessage, null, true, "Error order list From Server: " + ex.message);

                    return false;
                }//end of catch
            }//end of if
            else if (htmlJavaServerObject.readyState === 2 && htmlJavaServerObject.status === 500)
                //tells the user that there is an error with the Server
                endMessage(tagMessage, null, true, "Unable to connect to server");
        };//end of function()

        htmlJavaServerObject.send("intOrderID=" + intOrderID);
    }//end of try
    catch (ex) {
        //displays the message to the user and turns off the Status Lightbox
        endMessage(tagMessage, null, true, "Error: " + ex.message);

        return false;
    }//end of catch

    return true;
}//end of showOrderDetails()

//add order by SKU in cart
function addToOrder(strFileName, tagMessage, tagSKU1, tagSKU2, tagSKU3, tagSKU4, tagSKU5, tagSKU6, tagSKU7, tagSKU8, tagSKU9, tagSKU10) {
    try {
        var htmlJavaServerObject = new XMLHttpRequest(); //holds the object of the server

        //Abort any currently active request.
        htmlJavaServerObject.abort();

        //checks if there a connection also it sets the page for send to the Server
        if (preSend(tagMessage, "Adding order to the cart") === false)
            return false;

        // Makes a request
        htmlJavaServerObject.open("Post", strFileName, true);
        htmlJavaServerObject.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

        htmlJavaServerObject.onreadystatechange = function () {
            console.log("Current Ready State: " + htmlJavaServerObject.readyState + " Status " + htmlJavaServerObject.status);

            //in case there is a error with connection
            if (htmlJavaServerObject.readyState === 0 && htmlJavaServerObject.status === 200)
                //displays the message to the user and turns off the Status Lightbox
                endMessage(tagMessage, null, true, "Connection to the server is currently down");
            else if (htmlJavaServerObject.readyState === 4 && htmlJavaServerObject.status === 200) {
                try {
                    var strFromServerMassage = htmlJavaServerObject.responseText;//holds the message from the server

                    console.log("From Server Order Details: " + strFromServerMassage);

                    //checks if there is a message from the server
                    if (strFromServerMassage.indexOf("Error: ") === -1) {
                        tagSKU1.value = tagSKU2.value = tagSKU3.value = tagSKU4.value = tagSKU5.value = tagSKU6.value = tagSKU7.value = tagSKU8.value = tagSKU9.value = tagSKU10.value = '';
                        goToCheckoutSection(getDocID('bodyApp'), getDocID('sectionCheckout'), getDocID('divCartDetails'), getDocID('divCartItemGrandTotalContainer'), getDocID('lblGrandTotal'));
                    }//end of if
                    else
                        //tells the user that there is an error with the Server
                        endMessage(tagMessage, null, true, strFromServerMassage);
                }//end of try
                catch (ex) {
                    //displays the message to the user and turns off the Status Lightbox
                    endMessage(tagMessage, null, true, ex.message);

                    return false;
                }//end of catch
            }//end of if
            else if (htmlJavaServerObject.readyState === 2 && htmlJavaServerObject.status === 500)
                //tells the user that there is an error with the Server
                endMessage(tagMessage, null, true, "Unable to connect to server");
        };//end of function()

        htmlJavaServerObject.send("strCustomerCountry=" + window.localStorage.getItem("strCustomerCountry") + "&selectedCustomer=" + window.localStorage.getItem("strCustomerIdKey") + "&tagSKU1=" + encodeURL(encryptRSA(tagSKU1.value)) + "&tagSKU2=" + encodeURL(encryptRSA(tagSKU2.value)) + "&tagSKU3=" + encodeURL(encryptRSA(tagSKU3.value)) + "&tagSKU4=" + encodeURL(encryptRSA(tagSKU4.value)) + "&tagSKU5=" + encodeURL(encryptRSA(tagSKU5.value)) + "&tagSKU6=" + encodeURL(encryptRSA(tagSKU6.value)) + "&tagSKU7=" + encodeURL(encryptRSA(tagSKU7.value)) + "&tagSKU8=" + encodeURL(encryptRSA(tagSKU8.value)) + "&tagSKU9=" + encodeURL(encryptRSA(tagSKU9.value)) + "&tagSKU10=" + encodeURL(encryptRSA(tagSKU10.value)));
    }//end of try
    catch (ex) {
        //displays the message to the user and turns off the Status Lightbox
        endMessage(tagMessage, null, true, "Error: " + ex.message);

        return false;
    }//end of catch

    return true;
}//end of addToOrder()


//remove all items from user cart
function removeAllItemFromCart(strFileName, tagMessage, removeoption) {
    try {
        var htmlJavaServerObject = new XMLHttpRequest(); //holds the object of the server

        //Abort any currently active request.
        htmlJavaServerObject.abort();

        //checks if there a connection also it sets the page for send to the Server
        if (preSend(tagMessage, "Deleting Cart all Items") === false)
            return false;

        console.log("Deleting Cart all Items");

        // Makes a request
        htmlJavaServerObject.open("Post", strFileName, true);
        htmlJavaServerObject.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

        htmlJavaServerObject.onreadystatechange = function () {
            console.log("Current Ready State: " + htmlJavaServerObject.readyState + " Status " + htmlJavaServerObject.status);

            //in case there is a error with connection
            if (htmlJavaServerObject.readyState === 0 && htmlJavaServerObject.status === 200)
                //displays the message to the user and turns off the Status Lightbox
                endMessage(tagMessage, null, true, "Connection to the server is currently down");
            else if (htmlJavaServerObject.readyState === 4 && htmlJavaServerObject.status === 200) {
                try {
                    var strFromServerMassage = htmlJavaServerObject.responseText;//holds the message from the server

                    //console.log("From Server Going To delete Cart items: " + strFromServerMassage);

                    //checks if there is a message from the server
                    if (strFromServerMassage.indexOf("Error: ") === -1) {
                        //goes to the cart section
                        $("#divCartItemGrandTotalContainer").addClass('divJustHidden');
                        goToCheckoutSection(getDocID('bodyApp'), getDocID('sectionCheckout'), getDocID('divCartDetails'), getDocID('divCartItemGrandTotalContainer'), getDocID('lblGrandTotal'));
                    }
                    else
                        //tells the user that there is an error with the Server
                        endMessage(tagMessage, null, true, strFromServerMassage);
                }//end of try
                catch (ex) {
                    //displays the message to the user and turns off the Status Lightbox
                    endMessage(tagMessage, null, true, "Error Deleting Cart Items From Server: " + ex.message);

                    return false;
                }//end of catch
            }//end of if
            else if (htmlJavaServerObject.readyState === 2 && htmlJavaServerObject.status === 500) {
                //tells the user that there is an error with the Server
                endMessage(tagMessage, null, true, "Unable to connect to server");
            } //end of else if
        };//end of function()

        htmlJavaServerObject.send("customernumber=" + window.localStorage.getItem("strCustomerIdKey") + "&CartItemIds=" + window.localStorage.getItem("strCartItemIds") + "&removeoption=" + removeoption);
    }//end of try
    catch (ex) {
        //displays the message to the user and turns off the Status Lightbox
        endMessage(tagMessage, null, true, "Error: " + ex.message);

        return false;
    }//end of catch

    return true;
}//end of sendCartItemsDelete()