//prototypes

String.format = function() {
    // The string containing the format items (e.g. "{0}")
    // will and always has to be the first argument.
    var theString = arguments[0];
    
    // start with the second argument (i = 1)
    for (var i = 1; i < arguments.length; i++) 
	{
        // "gm" = RegEx options for Global search (more than one instance)
        // and for Multiline search
        var regEx = new RegExp("\\{" + (i - 1) + "\\}", "gm");
        theString = theString.replace(regEx, arguments[i]);
    }//end of for loop
    
    return theString;
};//end of String.format()

//Device functions

//alert dialog dismissed
function alertDismissed()
{
}//end of alertDismissed()

//JavaScript Document

//Adds text to any part of the body of a HTML
function addNode(tagParent,strText,boolAddToBack, boolRemoveNode)
{
	try {
		var strNode = document.createTextNode(strText);//holds the test which will be added
		 
		//gets the properties of the node
		tagParent = getDocID(tagParent);

		//checks if the user whats to replace the node in order to start with a clean slate
		//it also checks if there is a chode node to replace
		if (boolRemoveNode === true && tagParent.childNodes.length > 0)
			//replaces the current node with what the user wants
			tagParent.replaceChild(strNode,tagParent.childNodes[0]);
		else
		{
			//checks if the user whats to added to the back of the id or the front
			if(boolAddToBack === true)
				tagParent.appendChild(strNode);
			else
				//This is a built-in function of Javascript will add text to the beginning of the child
				insertBefore(strNode,tagParent.firstChild);
		}//end of if else
	}// end of try
	catch(ex) {
		// displays the message to the user and turns off the Status Lightbox
        endMessage(tagMessage, null, true, "Error: " + ex.message);

		return null;
	}// end of catch

	//returns the divParent in order for the user to use it for more uses
	return tagParent;
}//end of addNode()

//changes the image of a checkbox from
function changeCheckbox(tagImageCheckbox, strImageFile)
{
	//sets the values for the fields
	tagImageCheckbox = getDocID(tagImageCheckbox);

	//checks if the there is a text field and clear button
	if (tagImageCheckbox !== null)
	{
		//checks which value of the checkbox is false if so then set it to true
		//and sets image of tagImageCheckbox
		if(tagImageCheckbox.alt === "0")
		{
			tagImageCheckbox.alt = "1";	
			tagImageCheckbox.src = "img/Checkmark@2x.png";
		}//end of if
		else
		{
			tagImageCheckbox.alt = "0";
			tagImageCheckbox.src = "img/CheckmarkBox@2x.png";
		}//end of else
	}//end of if
}//end of changeCheckbox()

/**
 * Displays a given checkout section to the user
 * @param  {String} strDisplayWhichSection Holds section to to display to the user
 */
function changeCheckoutSections(strDisplayWhichSection)
{
	//turns on the section in the checkout area
	classToggleLayer(getDocID("sectionCheckout"), getDocID("section" + strDisplayWhichSection), 'divJustHidden sectionBody', 'section');
}//end of changeCheckoutSections()

/**
 * Add or removes strActiveClass from the element tagNonActive
 * @param  {String} strActive      
 * @param  {String} strActiveClass 
 */
function changeClass (strActive, strActiveClass) {
	tagActive = $("#" + strActive);//holds the active Layer

	// checks if there is an active layer
	if (tagActive !== "") {
		// checks if this class is activate is then 
		if(tagActive.hasClass(strActiveClass) === true)
			// deactivated it since the user wants the non active version
			tagActive.removeClass(strActiveClass);
		else
			// make the class activate
			tagActive.addClass(strActiveClass);
	}// end of if
}// end of changeClass()

//Changes the display to either off or on
function changeDisplay(tagLayer,strDisplay)
{
	tagLayer = getDocID(tagLayer);//holds the active Layer
	
	//Checks if there is an active layer
	if (tagLayer !== "")
		tagLayer.style.display = strDisplay;
}//end of changeDisplay()

//changes the image of tagImage to what is in strImageSrc
function changeImage(tagImage,strImageSrc)
{
    //gets the properties of tagImage
    tagImage = getDocID(tagImage);
    
    //checks if there is a properties
    if(tagImage !== null)
        tagImage.src = strImageSrc;
}//end of changeImage()

/**
 * CHanges the shipping date for setShippingDate()
 * @param  {date}	dateUserSelected	User Selected Date
 * @param  {string} strShipToDate		Link that holds the shipping date
 * @param  {string} strResetDate		Link that holds the reset the shipping date
 */
function changeShippingDate(dateUserSelected, strShipToDate, strResetDate)
{
	var arrShippingDateParts = String(dateUserSelected).split(" ");//holds the parts of dateUserSelected

	//sets the shipping date to what the user has selected
	$("#" + strShipToDate).text(setMonth(arrShippingDateParts[1]) + " " + arrShippingDateParts[2] + ", " + arrShippingDateParts[3]);

	//turns on the reset link to reset the date if the user wants to do this
	$("#" + strResetDate).removeClass('divJustHidden');
}//end of changeShippingDate()

/**
 * Changes the text for Billing Ship To to the selected Additional Ship To
 * @param  {Object} tagAdditionalShipTo
 * @param  {Object} tagBillingShipTo
 */
function changeShipToAddress(tagAdditionalShipTo, tagBillingShipTo) {
	// changes the text for Billing Ship To to the selected Additional Ship To
	tagBillingShipTo.innerHTML = getSelectOption(tagAdditionalShipTo)[0];
}//end of changeShipToAddress()

//clears the text and removes the clear button
function clearText(tagTextField, tagClearButton, tagErrorIcon, boolClearField)
{
	//sets the values for the fields
	tagTextField = getDocID(tagTextField);
	tagClearButton = getDocID(tagClearButton);
	tagErrorIcon = getDocID(tagErrorIcon);

	//checks if the there is a text field and clear button
	if (tagTextField !== null && tagClearButton !== null && tagErrorIcon !== null)
	{
		//checks if the tagTextField needs to be clear
		if(boolClearField === true)
			tagTextField.value = '';
		
		//checks if the text in the field if so then display the the clear button
		//else remove it
		if(tagTextField.value !== '')
			tagClearButton.style.display = 'block';
		else
			tagClearButton.style.display = '';
			
		//removes the error icon as it is not needed
		tagErrorIcon.style.display = '';
	}//end of if
}//end of clearText()

//removes from view all tags in tagContainer with the expection of tagActive
//It assumes the tagActive and tagContiner already have the properties
function classToggleLayer(tagContainer,tagActive,strClassName,strTAGName)
{
	var arrTAG = tagContainer.getElementsByTagName(strTAGName);//holds all strTAGName in tagContainer

	//goes around the for each tag that getElementsByTagName found in tagContainter
	for(var intIndex = arrTAG.length - 1; intIndex > -1; intIndex--) 
	{
		//checks if the class name is the same as strClassName and it is not active if it is active then change the dispaly to block
		if(arrTAG[intIndex].className === strClassName && arrTAG[intIndex].id !== tagActive.id)
			arrTAG[intIndex].style.display = arrTAG[intIndex].style.display? "":"";
		else if(arrTAG[intIndex].id === tagActive.id && tagActive.style.display === "")
			arrTAG[intIndex].style.display = arrTAG[intIndex].style.display? "":"block";
	}//end of for loop
}//end of classToggleLayer()

//Changes the tagActive Class to have the an Select only class so that the tagActive will look different from the rest
//It assumes the tagActive and tagContiner already have the properties
function classToggleLayerChangeClass(tagContainer,tagActive,strClassName,strActiveClassName,strTAGName)
{
    //checking if anything else clicked than aFabrics than empty container with fabric categories list
    if (tagActive !== getDocID('aFabric'))
        getDocID('divSubMenuBody').innerHTML = '';

    var arrTAG = tagContainer.getElementsByTagName(strTAGName);//holds all strTAGName in tagContainer
	
	//goes around the for each tag that getElementsByTagName found in tagContainter
	for(var intIndex = arrTAG.length - 1; intIndex > -1; intIndex--) 
	{
		//checks if the class name is the same as strClassName and it is not active if it is active then adds an strActiveClassName
		if(arrTAG[intIndex].id !== tagActive.id)
			arrTAG[intIndex].className = strClassName;
		else if(arrTAG[intIndex].id === tagActive.id)
			arrTAG[intIndex].className = strActiveClassName;
	}//end of for loop
}//end of classToggleLayerChangeClass()

//counts from view all tags in tagContainer
//It assumes the tagContiner already have the properties
function classToggleLayerCounting(tagContainer,strClassName,strTAGName)
{
	var arrTAG = tagContainer.getElementsByTagName(strTAGName);//holds all strTAGName in tagContainer
	var intTag = 0;//holds the number of tags that is using the same class name in the tagContainer
	
	//console.log("ToggleLayerCounting\nContainer: " + arrTAG.length + "\nTag Name: " + strTAGName + "\nNumber of Items: " + arrTAG.length);
	
	//goes around the for each tag that getElementsByTagName found in tagContainter
	for(var intIndex = arrTAG.length - 1; intIndex > -1; intIndex--) 
	{
		//console.log("Tag Class Name: " + arrTAG[intIndex].className + "\nSelected: " + strClassName + "\nNumber of Tags: " + intTag + "\n\n");
		
		//checks if the class name is the same as strClassName and if so then count it to the number of tags with the same class name
		if(arrTAG[intIndex].className === strClassName)
			intTag++;
	}//end of for loop
	
	return intTag;
}//end of classToggleLayerCounting()

/**
 * Creates QTY Selector to allow the user to selected the amount of Fabric/Swatch
 * @param  {Int}	intBaseUnit			Base unit of where the amount of fabric will start from
 * @param  {Int}	intUnqiueIndex		ID that will make the selector unqiue on the page
 * @param  {Int}	intCartIndex		ID that will make the selector unqiue on the page
 * @param  {Int}	intSelectValue		The value to selected
 * @param  {Int}	strOnChangeEvent	Adds an on change event if the user wants to use one
 * @return {String}						Returns the actully selector as a string
 */
function createFabricQTYSelector(intBaseUnit, intUnqiueIndex, intCartIndex, intSelectValue, strOnChangeEvent, intStartQty)
{
    // console.log("intBaseUnit " + intBaseUnit + " intUnqiueIndex " + intUnqiueIndex + " intCartIndex " + intCartIndex + " intSelectValue " + intSelectValue + " strOnChangeEvent " + strOnChangeEvent + "intStartQty " + intStartQty);
	var strQTYSelctor = "<select id='ddlFabricQTY" + intCartIndex + intUnqiueIndex + "' class='selectFabricQTY'" + strOnChangeEvent +"'>";//holds the QTY selector 

	// checks if the select value is even in the base unit value and is greater then one becasue the qutierty should be different in the combo box
	if(intSelectValue > 1 && intSelectValue < 9 && intBaseUnit != intSelectValue) {
		// makes the first options the selected Vlaue because this is a half QTY and only one can be used
		strQTYSelctor += "<option value='" + intSelectValue + "' selected>" + intSelectValue + "</option>";

		// adds one to move up
		intStartQty = intStartQty++;
	}// end of if

	//goes around for each adding the QTY of the Fabric into a dropdown
	for (var intItemQty = intStartQty; intItemQty <= 10; intItemQty++)
	{
		// checks if the selected value is zero because patterens in a discount
		// need to start on zero because this is what the client wants
		//if(intSelectValue === 0 && intItemQty === 1 && intBaseUnit === 3)
			// create a new option before the first item in order to be selected
			//strQTYSelctor += "<option value='0'>0</option>";

		var intCurrentValueToBeEntertedIntoOptions = (intItemQty * intBaseUnit);

		//adds the QTY of fablics that the user can pay for
		strQTYSelctor += "<option value='" + intCurrentValueToBeEntertedIntoOptions + "'";

		// checks if there a Selected value and if intCurrentValueToBeEntertedIntoOptions is the selected value
		if(intSelectValue > 0 && intCurrentValueToBeEntertedIntoOptions === intSelectValue)
			// selects this value
			strQTYSelctor += " selected";

		strQTYSelctor += ">" + intCurrentValueToBeEntertedIntoOptions + "</option>";
	}//end of for loop

	//closes the select displays the units
	strQTYSelctor += "</select>";

	return strQTYSelctor;
}//end of createFabricQTYSelector()

/**
 * Displays if the collection is available or not
 * @param  {String} strDateAdd The actully date that is going to be formated
 * @return {String}            That will displays either it is Avaliable or the date that it will be available
 */
function displayCollectionIsAvaliable(strDateAdd)
{
	var dateTodaysDate = new Date();//holds today's date
	var arrDateParts = strDateAdd.substring(0, strDateAdd.indexOf(" ")).split("/");//holds the parts of the date
    var dateAddedDate = new Date(setMonth(arrDateParts[1]) + " " + arrDateParts[0] + ", " + arrDateParts[2]);//holds the formated febric date

    // console.log("Febric Added Date: " + strDateAdd + " Count " + arrDateParts.length + " - " + setMonth(arrDateParts[1]) + " " + arrDateParts[0] + ", " + arrDateParts[2]);
    // console.log("Today Added Date: " + dateTodaysDate.getDate() + " " + dateAddedDate.getDate());

	//checks if the the item on sale today or coming soon
	if (dateAddedDate <= dateTodaysDate)
		return "Available Now";
	else
		return "Coming to stores in " + setMonth(arrDateParts[1]) + ", " + arrDateParts[2];	
}//end of displayCollectionIsAvaliable()

//does the display the a message in a on the page weather then an alert
function displayMessage(tagMessage,strMessText,boolAddToBack, boolRemoveNode)
{
	//gets the message properties and sets the text furthermore it does the display
	tagMessage = addNode(tagMessage,strMessText,boolAddToBack, boolRemoveNode);
	tagMessage.style.display = "block";	
	
	return tagMessage;
}//end of displayMessage()
	
//this is for the duel layers that sometimes is need
function duelToggleLayer(strActiveID, strNonActiveID)
{
	var tagActive = "";//holds the active Layer	
	var tagNonActive = "";//holds the non active layer 

	// this is the way the standards work
	if (strActiveID !== ''){tagActive = $("#" + strActiveID);}
	if (strNonActiveID !== ''){tagNonActive = $("#" + strNonActiveID);}

	//Checks if there is an active layer
	if (tagActive !== "")
	{
		//checks if the tagActive is already active and if so then skips code
		//since the layer cannot be turn off and leave a hole in the review layer
		if(tagActive.hasClass('divJustHidden') === true)
		{
			// adds the class to hide the tagNonActive and remove it from the active one
			tagActive.removeClass("divJustHidden");
			tagNonActive.addClass("divJustHidden");
		}//end of if
	}//end of if
}//end of duelToggleLayer()

/**
 * Refomats the text to caplitlize all of the words in strWordToFormat
 * @param  {String} strWordToFormat The text that will be be formated
 * @return {String}                 Formated Text from strWordToFormat
 */
function formatTextCapliizeAllWords(strWordToFormat) {
	// checks if there is text to format
	if(strWordToFormat !== null)
		return "<span class='spanHeaderCustomerNumberCasing'>" + strWordToFormat.replace(/ /g, '</span> <span class="spanHeaderCustomerNumberCasing">').replace(/'/g, '</span>\'<span class="spanHeaderCustomerNumberCasing">') + "</span>";
	else
		return "";
}//end of formatTextCapliizeAllWords()

//gets the document properties in order to use them as there are many types of browers with different versions
function getDocID(tagLayer)
{
	var tagProp = "";//holds the proerties of tagLayer
	
	//gets the whichLayer Properties depending of the differnt bowers the user is using
	if (document.getElementById)//this is the way the standards work
		tagProp = document.getElementById(tagLayer);
	else if (document.all)//this is the way old msie versions work
		tagProp = document.all[tagLayer];
	else if (document.layers)//this is the way nn4 works
		tagProp = document.layers[tagLayer];

	return tagProp;			
}//end of getDocID()

/**
 * get all of the cart items
 * @param  {Object} tagBillingNumber 
 * @param  {Object} tagBillingBy     
 * @param  {Object} tagBillingDate   
 * @param  {Object} tagBillingTo     
 * @return {Boolean}                  
 */
function getOrderDetails(tagBillingNumber, tagBillingBy, tagBillingDate, tagBillingTo) {
    try 
    {
        console.log("Setting Order Details");

        var dateTodaysDate = new Date();
        var arrDatePart = String(dateTodaysDate).split(" ");
		// updates the Billing Section
		tagBillingNumber.innerHTML = window.localStorage.getItem("strCustomerIdKey") + "-" + window.localStorage.getItem("strOrderID");
		tagBillingBy.innerHTML = formatTextCapliizeAllWords(window.localStorage.getItem("strUserFirstName") + " " + window.localStorage.getItem("strUserLastName"));
		tagBillingDate.innerHTML = arrDatePart[2] + " " + arrDatePart[1] + ", " + arrDatePart[3];
		tagBillingTo.innerHTML = formatTextCapliizeAllWords(window.localStorage.getItem("strCustomerName")) + "<br/>" +
			formatTextCapliizeAllWords(window.localStorage.getItem("strCustomerMailStreet")) + "<br/>" +
			formatTextCapliizeAllWords(window.localStorage.getItem("strCustomerMailCity")) + ", " + formatTextCapliizeAllWords(window.localStorage.getItem("strCustomerMailProvinceName")) + "<br/>" +
			window.localStorage.getItem("strCustomerMailPostalCode") + "<br/>" +
			"Tel:" + window.localStorage.getItem("strCustomerPhone") + "<br/>" +
			"Fax:" + window.localStorage.getItem("strCustomerFax") + "<br/>" +
			"Email:" + formatTextCapliizeAllWords(window.localStorage.getItem("strCustomerEmail"));
    }//end of try
    catch(ex)
    {
        console.log("Get Order Details Error: " + ex.message);
		
        return false;
    }//end of catch
console.log(tagBillingTo.innerHTML + " " + tagBillingBy.innerHTML);
    return true;
}//end of getOrderDetails()

//gets the information of the selected customer 
function getSelectedCustomer(tagMessage, tagSelectRegion, tagSelectCustomer, arrIndexField, arrIndexFabricDetailsHeader)
{
    try 
    {
		var arrSelectCustomer = getSelectOption(tagSelectCustomer);//holds the selected value for customer

        //if user do not select any customer selected
        if (arrSelectCustomer[0] === '0') 
        {
            displayMessage(tagMessage, 'You must select a customer', true, true);
            return false;
        }//end of if

		//gets the Customter details for future use in the app
		getCustomerDetails(window.localStorage.getItem("strDomainName") + "/ASP/AppGetCustomerDetails.aspx", tagMessage, arrSelectCustomer[0], arrIndexField, arrIndexFabricDetailsHeader);
    }//end of try
    catch (ex) 
    {
        //displays the message to the user and turns off the Status Lightbox
        endMessage(tagMessage, null, true, "Error: " + ex.message);

        return false;
    }//end of catch

    return true;
}//end of getSelectedCustomer()

//gets the select option from tagSelect
function getSelectOption(tagSelect)
{
	var arrSelectOption = new Array(2);//holds the select option the user has choosen
	
	//goes around finding the current seleted value from tagSelection
	for (var intIndex = 0;intIndex < tagSelect.options.length; intIndex++)
	{
		if (tagSelect.options[intIndex].selected === true)
		{
			arrSelectOption[0] = tagSelect.options[intIndex].value;
			arrSelectOption[1] = tagSelect.options[intIndex].text;
		}//end of if
	}//end of for loop
	
	return arrSelectOption;
}//end of getSelectOption()

//logs out the user
function logOutUser(arrIndexField)
{
	navigator.notification.confirm(
		"Are you sure you want to logout?", 
		function(intButtonIndex) { 
			// checks if the change button was choosen
			if(intButtonIndex === 1) {
				console.log("Logging Out " + window.localStorage.getItem("strUserFullName"));

				//clears all of the users data and send them to the login page
				window.localStorage.clear();
				
				//re-starts the app to go back to the login
				startUp(arrIndexField);
			}//end of if
		}, 
		"Logout:", 
		["Logout","Cancel"]
	);
}//end of logOutUser()

/**
 * Displays a notification on if the user wants to remove a itme from the cart
 * @param  {String} tagMessage  Message of the Results
 * @param  {String} strItemName Name of the Item Being Removed
 * @param  {Int}	intItemID   ID of the Item Being Removed
 */
function removeCartItem(tagMessage, strItemName, intItemID)
{
	navigator.notification.confirm(
		"Are you sure you want to remove '" + strItemName + "' from the cart?", 
		function(intButtonIndex) { 
			//checks if the resets button was choosen
			if(intButtonIndex === 1) 
			{
				//removes the id from intItemID from the cart
				sendCartItemsDelete(window.localStorage.getItem("strDomainName") + "/ASP/AppCartDeleteItem.aspx", tagMessage, intItemID);
			}//end of if
		}, 
		"Remove From Cart", 
		["Yes","No"]
	);
}//end of removeCartItem()

//resets what the log in user has selected as a customer 
function resetCustomerSelection()
{
	navigator.notification.confirm(
		"Are you sure you want to change customer?", 
		function(intButtonIndex) { 
			// checks if the change button was choosen
			if(intButtonIndex === 1) {
				// removes the customer local starge to reset it
				window.localStorage.removeItem("strCustomerIdKey");
				window.localStorage.removeItem("strCustomerName");
				window.localStorage.removeItem("strCustomerCountry");
				window.localStorage.removeItem("strCartItemIds");

				// reloads the page in order to reset the drop down in the customer area
				window.location = "index.html";
			}//end of if
		}, 
		"Change Customer:", 
		["Change","Cancel"]
	);
}//end of resetCustomerSelection()

//removes all items starting from intStopIndex from tagSelect
function resetSelectOption(tagSelect, intStopIndex)
{
	//goes around remvoes all items in the tagSelect
	for (var intIndex = tagSelect.length; intIndex > intStopIndex; intIndex--)
	{
		//remvoes the option from drop back
		tagSelect.remove(intIndex);
	}//end of for loop
}//end of resetSelectOption()

/**
 * Does the Switch for Special Instruction In cart when the use is in the store from either Textbox to Label or Label to Textbox
 * @param  {Object}		tagSIContainer
 * @param  {String}		strSILabelClass
 * @param  {String}		strSITextClass 
 * @param  {Boolean}	boolSwitchToLabel
 * @return {Boolean}              
 */
function switchSpecialInstructionsToEitherTextboxOrLabel(tagSIContainer, strSILabelClass, strSITextClass, boolSwitchToLabel) {
	var arrSILabelClass = tagSIContainer.getElementsByClassName(strSILabelClass);//holds all strSILabelClass in tagSIContainer
	var arrSITextClass = tagSIContainer.getElementsByClassName(strSITextClass);//holds all strSITextClass in tagSIContainer

	// goes around for each SI label since there should be a SI textbox for each SI label
	// and moves the text from it to textbox or the other way around
	for(var intIndex = 0; intIndex < arrSILabelClass.length; intIndex++) {
		// checks if this is a switch to label 
		if(boolSwitchToLabel === true) {
			// switch from Textbox To Label
			arrSILabelClass[intIndex].innerHTML = arrSITextClass[intIndex].value;

			// turns off the textbox and turns on label
			arrSITextClass[intIndex].className += " divJustHidden";
			arrSILabelClass[intIndex].className = arrSILabelClass[intIndex].className.replace(" divJustHidden", "");
		}//end of if
		else {
			// switch from Label To Textbox
			arrSITextClass[intIndex].value = arrSILabelClass[intIndex].innerHTML;

			// turns off the label and turns on textbox
			arrSILabelClass[intIndex].className += " divJustHidden";
			arrSITextClass[intIndex].className = arrSITextClass[intIndex].className.replace(" divJustHidden", "");
		}//end of else
	}//end of for loop
}//end of switchSpecialInstructionsToEitherTextboxOrLabel()

/**
 * Goes to The Cart Section
 * @param  {Object} tagBodyApp          
 * @param  {Object} tagSectionCheckout      
 * @param  {Object} tagCartItemsDetails 
 * @param  {Object} tagCartItemGrandTotalContainer 
 * @param  {Object} tagGrandTotal 
 * @param  {Array}  arrIndexCheckoutObjects 
 */
function goToCheckoutSection (tagBodyApp, tagSectionCheckout, tagCartItemsDetails, tagCartItemGrandTotalContainer, tagGrandTotal) {
	//gets list of items that user has added in the cart
    if(getCartItemsList(window.localStorage.getItem("strDomainName") + "/ASP/AppGetMyCartItemsList.aspx", "divMessageCart", tagCartItemsDetails, tagCartItemGrandTotalContainer, tagGrandTotal) === false) {
		console.log("Unable To Go To Cart");

		return false;
    }//end of if

    // goes to the checkout section from either menu or Fabric details section
    classToggleLayer(tagBodyApp, tagSectionCheckout, 'divJustHidden sectionBody', 'section');

    // checks if the error message has 
    if($("#divMessageCart").hasClass("sectionStartingPostionForSectionsInCart") === false)
		// adds back the hugh whitepasce since the floating totals take up some space
		$("#divMessageCart").addClass("sectionStartingPostionForSectionsInCart");

	// reset the floating totals to the orginal set
    $("#aCheckout").removeClass('divJustHidden');
    $("#aCheckoutComplete").addClass('divJustHidden');

	$("#divCartActionHeader").removeClass('divJustHidden');
	$(".cartAction").removeClass('divJustHidden');
	$(".selectFabricQTY").removeClass('divJustHidden');
	$(".lblFabricQTY").addClass('divJustHidden');
	$("#sectionShipping").addClass('divJustHidden');
	$("#aRemoveAllFromCart").removeClass('divJustHidden');
	$("#aRemoveSelectedFromCart").removeClass('divJustHidden');
}//end of goToCheckoutSection()

/**
 * Goes to Shipping Seciton in checkout
 * @param  {String} strMessageID            
 * @param  {Array} arrIndexCheckoutObjects 
 */
function processCheckout(strMessageID, arrIndexCheckoutObjects) {
	/*
		Legend of arrIndexCheckoutObjects

		0 = Checkout Link
		1 = Complete Order
		2 = Order Number
		3 = Order By
		4 = Order Date
		5 = Order Bill To
		6 = Order Ship To
		7 = Section Cart
		8 = Section Billing / Shipping
		9 = Class for All Special Instructions Labels
		10 = Class for All Special Instructions Text
		11 = Checkout Section ID
		12 = Additional Ship To Selection
		13 = Additional Ship To Container
		14 = Body of the Cart
	*/
	console.log("Starting Checkout");

	var strSIText = "";//holds all of the Special Instrautions Text
	var strShipToDate = "";//holds all of the Shipping TO Date
	var strItemsQTY = "";//holds all of the QTY and Item IDs
	var arrAllInputElementsInBodyCart = arrIndexCheckoutObjects[14].getElementsByTagName("input");
	var arrAllLinkElementsInBodyCart = arrIndexCheckoutObjects[14].getElementsByTagName("a");
	var arrAllSelectElementsInBodyCart = arrIndexCheckoutObjects[14].getElementsByTagName("select");

	//goes around the for each tag that getElementsByTagName found in the body of the cart 
	//for when the Special Instrautions
	for(var intAllInputIndex = 0; intAllInputIndex < arrAllInputElementsInBodyCart.length; intAllInputIndex++) 
	{
		//checks if this is a Special Instratuions
		if(arrAllInputElementsInBodyCart[intAllInputIndex].className === "txtOrderSpecial")
			// adds to the shipping data array that will be used to update the items
			strSIText += arrAllInputElementsInBodyCart[intAllInputIndex].value + "*!*";
	}//end of for loop

	//goes around the for each tag that getElementsByTagName found in the body of the cart 
	//for when the Shipping Dates
	for(var intAllLinkIndex = 0; intAllLinkIndex < arrAllLinkElementsInBodyCart.length; intAllLinkIndex++) 
	{
		//checks if this is a Special Instratuions
		if(arrAllLinkElementsInBodyCart[intAllLinkIndex].className === "aCartShippingDate")
			// adds to the shipping data array that will be used to update the items
			strShipToDate += new Date(arrAllLinkElementsInBodyCart[intAllLinkIndex].innerHTML).toISOString().slice(0, 19).replace('T', ' ').toString() + "!";
	}//end of for loop

	//goes around the for each tag that getElementsByTagName found in the body of the cart 
	//for when the QTY
	for(var intAllSelectIndex = 0; intAllSelectIndex < arrAllSelectElementsInBodyCart.length; intAllSelectIndex++) 
	{
		//checks if this is a QTY
		if(arrAllSelectElementsInBodyCart[intAllSelectIndex].className === "selectFabricQTY")
			// adds to the shipping data array that will be used to update the items
			strItemsQTY += arrAllSelectElementsInBodyCart[intAllSelectIndex]  + "!";
	}//end of for loop

	// removes the last char from strSIText, strItemsQTY, strShipToDate to not have an empty char
	strShipToDate = strShipToDate.substring(0, strShipToDate.length - 1);
	strSIText = strSIText.substring(0, strSIText.length - 3);
	strItemsQTY = strItemsQTY.substring(0, strItemsQTY.length - 1);

	// updates each of the headers in each of the groups in the cart
    if(sendCartItemsUpdate(window.localStorage.getItem("strDomainName") + "/ASP/AppUpdateCart.aspx", strMessageID, strSIText, strItemsQTY, strShipToDate) === false) {
		console.log("Unable To Update Cart");

		return false;
    }//end of if

	/// switch the Checkout With Complate Order in the floating totals
    $("#" + arrIndexCheckoutObjects[0]).addClass('divJustHidden');
    $("#" + arrIndexCheckoutObjects[1]).removeClass('divJustHidden');

    // turns on the section in the checkout area
    $("#sectionShipping").removeClass('divJustHidden');
    $("#divCartActionHeader").addClass('divJustHidden');
    $(".cartAction").addClass('divJustHidden');
    $(".selectFabricQTY").addClass('divJustHidden');
    $(".lblFabricQTY").removeClass('divJustHidden');
    $("#aRemoveAllFromCart").addClass('divJustHidden');
    $("#aRemoveSelectedFromCart").addClass('divJustHidden');

    // switch special instructions from Text to Label
    switchSpecialInstructionsToEitherTextboxOrLabel(getDocID(arrIndexCheckoutObjects[11]), arrIndexCheckoutObjects[9], arrIndexCheckoutObjects[10], true);

    // gets Order details
    getOrderDetails(arrIndexCheckoutObjects[2], arrIndexCheckoutObjects[3], arrIndexCheckoutObjects[4], arrIndexCheckoutObjects[5]);

    // gets list of shiping address
    if(getShipToList(window.localStorage.getItem("strDomainName") + "/ASP/AppGetShipToList.aspx", strMessageID, arrIndexCheckoutObjects[6], arrIndexCheckoutObjects[12], arrIndexCheckoutObjects[13]) === false) {
		console.log("Unable To Get Shipping To");

		return false;
    }//end of if
}//end of processCheckout()

/**
 * Turns on and off the date picker for the shipping date
 * @param  {date}	dateShip			Date being ship
 * @param  {string} strShipToDate		Link that holds the date
 * @param  {string} strResetDate		Link that holds the reset the shipping date
 * @param  {string} strErrorMessageID	ID of the error message
 * @param  {bool}	boolIsStatic		IsstrShipToDate in one poistion or is it always moving down
 */
function selectedShippingDate(dateShip, strShipToDate, strResetDate, strErrorMessageID, boolIsStatic, strDateAdded) {
	try {
		var intShippingDatePickerLocationXOffset = 912;
		var intShippingDatePickerLocationYOffset = 190;

		// checks if strShipToDate is not static as it changes the postion as the user scrolls the section
		if(boolIsStatic === false) {
			intShippingDatePickerLocationXOffset = 80;
			intShippingDatePickerLocationYOffset = $(window).height();
		}// end of if
		//console.log("strDateAdded " + strDateAdded);
		//sets the date picker for the shipping date
		datePicker.show({
			mode: "date",
			date: new Date(String(dateShip)), 
			minDate: new Date(String(strDateAdded)),
			allowOldDates: true,
			x: ($("#" + strShipToDate).position().left - intShippingDatePickerLocationXOffset),
			y: ((intShippingDatePickerLocationYOffset / $("#" + strShipToDate).position().top))
			}, function(dateUserSelected){
				// changes the date to the suer has selected
				changeShippingDate(dateUserSelected, strShipToDate, strResetDate);

				// checks if strShipDate is not static as since it more likly in the cart this will update all items for that group
				if(boolIsStatic === false)
					sendCartItemsUpdateShipToDate(window.localStorage.getItem("strDomainName") + "/ASP/AppUpdateCartShipDate.aspx", strErrorMessageID, dateShip.toISOString().slice(0, 19).replace('T', ' ').toString(), dateUserSelected.toISOString().slice(0, 19).replace('T', ' ').toString());
			}
		);
	}// end of try
	catch(ex) {
		console.log("Set Shipping Date: " + ex);
	}// end of catch
}// end of selectedShippingDate()

/**
 * Resets the shipping date to the orinal date that was oaded
 * @param  {date}	dateShip     Date Being Ship
 * @param  {string} strShipToDate  Link that holds the shipping date
 * @param  {string} strResetDate Link that holds the reset the shipping date
 */
function selectedShippingResetDate(dateShip, strShipToDate, strResetDate) {
	try {
		navigator.notification.confirm(
			"Are you sure you want to reset shipping date?", 
			function(intButtonIndex) { 
				//checks if the resets button was choosen
				if(intButtonIndex === 1) {
					//resets the shippong date to the most eaiers date that it can ship on
					changeShippingDate(dateShip, strShipToDate, strResetDate); 

					//rehides the reset buttons
					$("#" + strResetDate).addClass("divJustHidden");
				}//end of if
			}, 
			"Reset Shipping Date:", 
			["Reset","Cancel"]
		);
	}// end of try
	catch(ex) {
		console.log("Set Shipping Reset Date: " + ex);
	}// end of catch
}// end of selectedShippingResetDate()

//gets the name of the month base on a number
function setMonth(strMonth)
{
	//checks which month number and sets the name instead of a number
    switch(strMonth)
    {
		case "Jan":
		case "1":
		case "01":
			strMonth = "January";
		break;
		case "Feb":
		case "2": 
		case "02":
			strMonth = "Februry";
		break;
		case "Mar":
		case "3": 
		case "03":
			strMonth = "March";
		break;
		case "Apr":
		case "4":
		case "04":
			strMonth = "April";
		break;
		case "May":
		case "5":
		case "05":
			strMonth = "May";
		break;
		case "Jun":
		case "6":
		case "06":
			strMonth = "June";
		break;
		case "Jul":
		case "7":
		case "07":
			strMonth = "July";
		break;
		case "Aug":
		case "8":
		case "08":
			strMonth = "August";
		break;
		case "Sep":
		case "9":
		case "09":
			strMonth = "September";
		break;
		case "Oct":
		case "10":
			strMonth = "October";
		break;
		case "Nov":
		case "11":
			strMonth = "November";
		break;
		case "Dec":
		case "12":
			strMonth = "December";
		break;
    }//end of switch

    return strMonth;
}//end of setMonth()

/**
 * Sets the Items that the user has selected in the Fabric/Swatch Details
 * @param {String}	strItemID					ID of the Item, in the Database
 * @param {String}	strAddSelectedItemsToCart   Selected Items To Cart Button
 */
function setSelectedItemsInDetails (strItemID, strAddSelectedItemsToCart)
{
	var tagSelectItem = $("#" + strItemID);//holds the jquery object of the selected Item tag
	var tagAddSelectedItemsToCart = $("#" + strAddSelectedItemsToCart);//holds the jquery object of the adding selected Item to cart
	var strUserSelectedFabricControls = strItemID + "!";//holds the items that will be used to be added/remove

	//checks if setSelectedItemsInDetails is a selected item
	if(tagSelectItem.hasClass('divSelectedItemInDetails') === true)
	{
		//remove the selected item css class to tagSelectedItem
		tagSelectItem.removeClass('divSelectedItemInDetails');

		//remove the Item to the local storage strUserSelectedFabricControls
		window.localStorage.setItem("strUserSelectedFabricControls", window.localStorage.getItem("strUserSelectedFabricControls").replace(strUserSelectedFabricControls, ""));

		//checks if there is any items in the selected items local storage
		if(window.localStorage.getItem("strUserSelectedFabricControls") === "")
			//removes tagAddSelectedItemsToCart from the displays
			tagAddSelectedItemsToCart.addClass('divJustHidden');
	}//end of if
	else
	{
		//adds the selected item css class to tagSelectedItem
		tagSelectItem.addClass('divSelectedItemInDetails');

		//adds the Item to the local storage strUserSelectedFabricControls
		window.localStorage.setItem("strUserSelectedFabricControls", window.localStorage.getItem("strUserSelectedFabricControls") + strUserSelectedFabricControls);

		//checks if tagAddSelectedItemsToCart is visible for the display
		if(tagAddSelectedItemsToCart.hasClass('divJustHidden') === true)
			//displas an option to add the selected items to the cart
			tagAddSelectedItemsToCart.removeClass('divJustHidden');
	}//end of if

	console.log("Current Selected Items: " + window.localStorage.getItem("strUserSelectedFabricControls"));
}//end of setSelectedItemsInDetails()

//gets the select option from tagSelect
function setSelectOption(tagSelect, strValue)
{
	var strSelectOption = "";//holds the select option the user has choosen
	
	//goes around finding the current seleted value from tagSelection
	for (var intIndex = 0;intIndex < tagSelect.options.length; intIndex++)
	{
		//checks if this is the value that the use wants to selected
		if (tagSelect.options[intIndex].value === strValue)
			strSelectOption = tagSelect.options[intIndex].selected = true;
	}//end of for loop
	
	return strSelectOption;
}//end of setSelectOption()

/**
 * Displays the Shipping Date and Selector
 * @param {date}	dateShip		Start date of the selector when the function is loaded
 * @param {Object}	tagShipDate		Link to change the shipping date
 * @param {Object}	tagResetDate	Resets the Date
 */
function setShippingDate(dateShip, tagShipDate, tagResetDate) {
	try {
		// adds an on click to the Ship Date link
		tagShipDate.onclick = function() {
			//sets the date picker for the shipping date
		    selectedShippingDate(dateShip, tagShipDate.id, tagResetDate.id, "", true, dateShip);
		};

		// adds an on click to the reset link
		tagResetDate.onclick = function() {
			selectedShippingResetDate(dateShip, tagShipDate.id, tagResetDate.id);
		};
		
		return setMonth(String(dateShip.getMonth() + 1)) + " " + dateShip.getDate() + ", " + dateShip.getFullYear();
	}// end of try
	catch(ex) {
		console.log("Set Shipping Error: " + ex);

		return "";
	}// end of catch
}// end of setShippingDate()

//does the basic start when the app loads up
/**
 * does the basic start when the app loads up
 * @param  {Array of Fields} arrIndexField					All Field objects that will be change by this function, it is in an array as they will be times that not all fields will be used.
 * @param  {Array of Fields} arrIndexFabricDetailsHeader	All Field object For Extra that needs to go to a function
 * @return {Boolean}										For Check if there is a connection
 */
function startUp(arrIndexField, arrIndexFabricDetailsHeader)
{
	/*
		Legend of arrIndexField

		0 = Welcome Message
		1 = Navigation
		2 = Body ID
		3 = Select Region
		4 = Customer selected Message
		5 = Collections Details
		6 = Sub Menu Details
		7 = Cart Details
		8 = Swatch Details
		9 = Cart Item Grand Total Container
		10 = Grand Total
	*/

	var strWhichSection = "Login";//holds which section the user will go to when they first loaded the up

	console.log("Start Up is Running\nNumber of Fields Using for Start Up: " + arrIndexField.length);

	//sets the welcome message
	arrIndexField[0].innerHTML = "<label>Welcome, " + window.localStorage.getItem("strUserFullName") + " (</label>" + 
	"<a class='NavivagtionNonActive' href='javascript:void(0);' onclick='logOutUser([getDocID(&quot;" + arrIndexField[0].id + "&quot;), getDocID(&quot;" + arrIndexField[1].id + "&quot;), getDocID(&quot;" + arrIndexField[2].id + "&quot;), null, getDocID(&quot;" + arrIndexField[4].id + "&quot;)]);'>Logout</a>" + 
	"<label>)</label>" ;

	//checks if there is already the domain where the server side is located
	if(window.localStorage.getItem("strDomainName") === null)
		window.localStorage.setItem("strDomainName", "http://ipad.northcott.com");

	//checks if there the user is logged in
	if(window.localStorage.getItem("strUserRepKey") !== null)
	{
		var strCustomerInforWelcomeMessage = "";//holds the customer information for the welcome message

		//sends the user to the Customer section
		strWhichSection = "Customer";

		//checks if there is a selection for the region as this needs to be populator
		if(arrIndexField.length >= 4 && arrIndexField[3] !== null)
			//loads the region list 
			getRegionList(window.localStorage.getItem("strDomainName") + "/ASP/AppGetRegionList.aspx", "divMessageRegion", arrIndexField[3]);

		//checks if the does have a customer selected
		if(window.localStorage.getItem("strCustomerIdKey") !== null)
		{
			var strCustomerCountry = "Canada";
			
			if (window.localStorage.getItem("strCustomerCountry") === "U")
				strCustomerCountry = "US";

			//sends the user to the Fabric section
			strWhichSection = "Fabric";

			//checks if this is the first item being loaded as there is no selected Region
			if(arrIndexField[3] !== null) {
				//sets the customer informaiton of which customer they have selected
				arrIndexField[4].innerHTML = "<label>Customer Selected:" + 
					"<br/>" + 
					"<a class='NavivagtionNonActive' id='aRetailerInfo' href='javascript:void(0);' onclick='classToggleLayer(getDocID(&quot;bodyApp&quot;), getDocID(&quot;sectionCustomerDetails&quot;), &quot;divJustHidden sectionBody&quot;, &quot;section&quot;);'>" + 
					formatTextCapliizeAllWords(window.localStorage.getItem("strCustomerName")) + "</a> <br/> " + 
					formatTextCapliizeAllWords(window.localStorage.getItem("strCustomerMailCity")) + ", " + 
					formatTextCapliizeAllWords(window.localStorage.getItem("strCustomerProv")) + " " + 
					strCustomerCountry + "</label>";

				// show collection list for the first time when page loads
				getCollectionList(window.localStorage.getItem("strDomainName") + "/ASP/AppGetCollectionList.aspx", "divMessageCollection", null, arrIndexField[5], arrIndexField[6], 0, arrIndexField[0], arrIndexField[1], arrIndexField[2], arrIndexField[4].id, getDocID("sectionCheckout"), arrIndexField[7], arrIndexField[8], arrIndexField[9], arrIndexField[10], arrIndexFabricDetailsHeader);

				// sets the customer details if the user goes to their details
				
				if(window.localStorage.getItem("strCustomerLowercaseFirstName") !== null && window.localStorage.getItem("strCustomerLowercaseFirstName") !== "")
					getDocID("lblCustomerInfoBasicFirstName").innerHTML = formatTextCapliizeAllWords(window.localStorage.getItem("strCustomerLowercaseFirstName"));
				else
					$("#divCustomerInfoBasicFirstName").addClass("divJustHidden");
				
				if(window.localStorage.getItem("strCustomerLowercaseLastName") !== null && window.localStorage.getItem("strCustomerLowercaseLastName") !== "")
					getDocID("lblCustomerInfoBasicLastName").innerHTML = formatTextCapliizeAllWords(window.localStorage.getItem("strCustomerLowercaseLastName"));
				else
					$("#divCustomerInfoBasicLastName").addClass("divJustHidden");
				
				if(window.localStorage.getItem("strCustomerLowercaseEmail") !== null && window.localStorage.getItem("strCustomerLowercaseEmail") !== "")
					getDocID("lblCustomerInfoBasicEmail").innerHTML = formatTextCapliizeAllWords(window.localStorage.getItem("strCustomerLowercaseEmail"));
				else
					$("#divCustomerInfoBasicEmail").addClass("divJustHidden");
				
				if(window.localStorage.getItem("strCustomerCompanyName") !== null && window.localStorage.getItem("strCustomerCompanyName") !== "")
					getDocID("lblCustomerInfoBillingCompany").innerHTML = formatTextCapliizeAllWords(window.localStorage.getItem("strCustomerCompanyName"));
				else
					$("#divCustomerInfoBillingCompany").addClass("divJustHidden");
				
				if(window.localStorage.getItem("strCustomerIdKey") !== null && window.localStorage.getItem("strCustomerIdKey") !== "")
					getDocID("lblCustomerInfoBillingCustomerNumber").innerHTML = window.localStorage.getItem("strCustomerIdKey");
				else
					$("#divCustomerInfoBillingCustomerNumber").addClass("divJustHidden");
				
				if(window.localStorage.getItem("strCustomerMailAddress1") !== null && window.localStorage.getItem("strCustomerMailAddress1") !== "")
					getDocID("lblCustomerInfoBillingAddress1").innerHTML = formatTextCapliizeAllWords(window.localStorage.getItem("strCustomerMailAddress1"));
				else
					$("#divCustomerInfoBillingAddress1").addClass("divJustHidden");
				
				if(window.localStorage.getItem("strCustomerMailAddress2") !== null && window.localStorage.getItem("strCustomerMailAddress2") !== "")
					getDocID("lblCustomerInfoBillingAddress2").innerHTML = formatTextCapliizeAllWords(window.localStorage.getItem("strCustomerMailAddress2"));
				else
					$("#divCustomerInfoBillingAddress2").addClass("divJustHidden");
				
				if(window.localStorage.getItem("strCustomerMailCity") !== null && window.localStorage.getItem("strCustomerMailCity") !== "")
					getDocID("lblCustomerInfoBillingCity").innerHTML = formatTextCapliizeAllWords(window.localStorage.getItem("strCustomerMailCity"));
				else
					$("#divCustomerInfoBillingCity").addClass("divJustHidden");

				if(window.localStorage.getItem("strCustomerMailState") !== null && window.localStorage.getItem("strCustomerMailState") !== "")
					getDocID("lblCustomerInfoBillingProv").innerHTML = formatTextCapliizeAllWords(window.localStorage.getItem("strCustomerMailState"));
				else
					$("#divCustomerInfoBillingProv").addClass("divJustHidden");
				
				if(window.localStorage.getItem("strCustomerMailPostalCode") !== null && window.localStorage.getItem("strCustomerMailPostalCode") !== "")
					getDocID("lblCustomerInfoBillingPostalCode").innerHTML = window.localStorage.getItem("strCustomerMailPostalCode");
				else
					$("#divCustomerInfoBillingPostalCode").addClass("divJustHidden");
				
				if(window.localStorage.getItem("strCustomerPhone") !== null && window.localStorage.getItem("strCustomerPhone") !== "")
					getDocID("lblCustomerInfoBillingPhone").innerHTML = formatTextCapliizeAllWords(window.localStorage.getItem("strCustomerPhone"));
				else
					$("#divCustomerInfoBillingPhone").addClass("divJustHidden");
				
				if(window.localStorage.getItem("strCustomerFax") !== null && window.localStorage.getItem("strCustomerFax") !== "")
					getDocID("lblCustomerInfoBillingFax").innerHTML = formatTextCapliizeAllWords(window.localStorage.getItem("strCustomerFax"));
				else
					$("#divCustomerInfoBillingFax").addClass("divJustHidden");
				
				if(window.localStorage.getItem("strCustomerEmail") !== null && window.localStorage.getItem("strCustomerEmail") !== "")
					getDocID("lblCustomerInfoBillingEmail").innerHTML = formatTextCapliizeAllWords(window.localStorage.getItem("strCustomerEmail"));
				else
					$("#divCustomerInfoBillingEmail").addClass("divJustHidden");
				
				if(window.localStorage.getItem("strCustomerWebsite")!== null && window.localStorage.getItem("strCustomerWebsite")!== "")
					getDocID("lblCustomerInfoBillingWebsite").innerHTML = formatTextCapliizeAllWords(window.localStorage.getItem("strCustomerWebsite"));
				else
					$("#divCustomerInfoBillingWebsite").addClass("divJustHidden");
				
				if(window.localStorage.getItem("strCustomerContact") !== null && window.localStorage.getItem("strCustomerContact") !== "")
					getDocID("lblCustomerInfoBillingContact").innerHTML = formatTextCapliizeAllWords(window.localStorage.getItem("strCustomerContact"));
				else
					$("#divCustomerInfoBillingContact").addClass("divJustHidden");
			}//end of if
			
			//turns on the nav and customer selected as it is in the main area now
			$("#" + arrIndexField[1].id).removeClass('divJustHidden');
			$("#" + arrIndexField[4].id).removeClass('divJustHidden');
		}//end of if
		else
			//turns off the nav as the user neesd selected a customer 
			$("#" + arrIndexField[1].id).addClass('divJustHidden');

		//removes the divJustHidden class if there is on and sets the welcome message at the top right couner 
		$("#" + arrIndexField[0].id).removeClass('divJustHidden');

		// console.log("Welcome Message: " + arrIndexField[0].innerHTML);
	}//end of if
	else
	{
		//sets the welcome message and nav to nothing as they have not logged in yet
		$("#" + arrIndexField[0].id).addClass('divJustHidden');
		$("#" + arrIndexField[1].id).addClass('divJustHidden');
		$("#" + arrIndexField[4].id).addClass('divJustHidden');
	}//end of else

	//checks if there is a connection
	if(checkConnection() === false)
		//starts the function
		return false;

	console.log("Going To Section: " + strWhichSection);

	//turns on the section when the user first loads up the app
	classToggleLayer(arrIndexField[2], getDocID("section" + strWhichSection), 'divJustHidden sectionBody', 'section');

	return true;
}//end of startUp()

//shoes and hides a <div> using display:block/none from the CSS
function toggleLayer(tagLayer, tagGrayOut)
{
	//gets the tagLayer and tagGrayOut Properties
	tagLayer = getDocID(tagLayer);//holds the style of tagLayer
	tagGrayOut = getDocID(tagGrayOut);
	
	//checks if there is a main
	if (tagLayer !== null)
	{
		//checks state the layer is in block or none
		if(tagLayer.style.display === "")
		{
			//displays the layer with animation
			$("#" + tagLayer).fadeIn(800, function() {
				//displays the layer but also tells which state the layer is in
				this.style.display = "block";
			});
		}//end of if
		else
		{
			//removes the layer with animation
			$("#" + tagLayer).fadeOut(400, function() {
				//removes the layer but also tells which state the layer is in
				this.style.display = "";
			});
		}//end of if
	}//end of if
	
	//checks if there is a Gray Out Area
	if (tagGrayOut !== null)
		//removes the old on click in order to have a new one
		$("#" + tagGrayOut.id).off("click");
}//end of toggleLayer()