function CS_Print()
{

	var PrintQCURL = nlapiResolveURL('SUITELET','customscript26','customdeploy1',false);
	
	PrintQCURL +='&customerName='+nlapiGetFieldValue('custpage_fr_customer')+'&shippingNumber=' + nlapiGetFieldValue('custpage_shipping');

	newWindow = window.open(PrintQCURL, "_blank");
}

function QCI_Print() {

	var PrintQCURL = nlapiResolveURL('SUITELET', 'customscript24',
			'customdeploy1', false);

	PrintQCURL += '&customerName=' + nlapiGetFieldValue('custpage_fr_customer')
			+ '&shippingNumber=' + nlapiGetFieldValue('custpage_shipping');

	newWindow = window.open(PrintQCURL, "_blank");
}

function BPL_Print()
{

	var PrintQCURL = nlapiResolveURL('SUITELET','customscript28','customdeploy1',false);
	
	PrintQCURL +='&customerName='+nlapiGetFieldValue('custpage_fr_customer')+'&shippingNumber=' + nlapiGetFieldValue('custpage_shipping');

	newWindow = window.open(PrintQCURL, "_blank");
}

function BCI_Print()
{

	var PrintQCURL = nlapiResolveURL('SUITELET','customscript27','customdeploy1',false);
	
	PrintQCURL +='&customerName='+nlapiGetFieldValue('custpage_fr_customer')+'&shippingNumber=' + nlapiGetFieldValue('custpage_shipping');

	newWindow = window.open(PrintQCURL, "_blank");
}