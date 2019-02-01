<?xml version="1.0"?><!DOCTYPE pdf PUBLIC "-//big.faceless.org//report" "report-1.1.dtd">
<pdf>
<head>
	<link name="NotoSans" type="font" subtype="truetype" src="${nsfont.NotoSans_Regular}" src-bold="${nsfont.NotoSans_Bold}" src-italic="${nsfont.NotoSans_Italic}" src-bolditalic="${nsfont.NotoSans_BoldItalic}" bytes="2" />
	<#if .locale == "zh_CN">
		<link name="NotoSansCJKsc" type="font" subtype="opentype" src="${nsfont.NotoSansCJKsc_Regular}" src-bold="${nsfont.NotoSansCJKsc_Bold}" bytes="2" />
	<#elseif .locale == "zh_TW">
		<link name="NotoSansCJKtc" type="font" subtype="opentype" src="${nsfont.NotoSansCJKtc_Regular}" src-bold="${nsfont.NotoSansCJKtc_Bold}" bytes="2" />
	<#elseif .locale == "ja_JP">
		<link name="NotoSansCJKjp" type="font" subtype="opentype" src="${nsfont.NotoSansCJKjp_Regular}" src-bold="${nsfont.NotoSansCJKjp_Bold}" bytes="2" />
	<#elseif .locale == "ko_KR">
		<link name="NotoSansCJKkr" type="font" subtype="opentype" src="${nsfont.NotoSansCJKkr_Regular}" src-bold="${nsfont.NotoSansCJKkr_Bold}" bytes="2" />
	<#elseif .locale == "th_TH">
		<link name="NotoSansThai" type="font" subtype="opentype" src="${nsfont.NotoSansThai_Regular}" src-bold="${nsfont.NotoSansThai_Bold}" bytes="2" />
	</#if>
    <style type="text/css">* {
						<#if .locale == "zh_CN">
							font-family: NotoSans, NotoSansCJKsc, sans-serif, stsong;
						<#elseif .locale == "zh_TW">
							font-family: NotoSans, NotoSansCJKtc, sans-serif;
						<#elseif .locale == "ja_JP">
							font-family: NotoSans, NotoSansCJKjp, sans-serif;
						<#elseif .locale == "ko_KR">
							font-family: NotoSans, NotoSansCJKkr, sans-serif;
						<#elseif .locale == "th_TH">
							font-family: NotoSans, NotoSansThai, sans-serif;
						<#else>
							font-family: NotoSans, sans-serif, stsong;
						</#if>
					}
					td p { align:center }
</style>
</head>
<body padding="0.5in 0.2in 0.5in 0.2in" size="A4">
    <br /><br />&nbsp;
<table align="center" border="0" cellpadding="0" cellspacing="2"><tr>
	<td style="text-align: center;">
	<h1><strong><span style="font-family:arial,helvetica,sans-serif;"><span style="font-size:24px;"><span style="text-align: center;">${record.subsidiary}</span></span></span></strong></h1>
	</td>
	</tr></table>
	
	<table border="0" cellpadding="0" cellspacing="2"><tr>
	<td height="10px"></td>
	</tr></table>
	
<table align="center" border="0" cellpadding="0" cellspacing="2"><tr>
	<td style="text-align: center;">
	<h1><span style="font-family:arial,helvetica,sans-serif;"><span style="font-size:18px;"><span style="text-align: center;">#print2HTML#</span></span></span></h1>
	</td>
	</tr></table>
	
	<table border="0" cellpadding="0" cellspacing="2"><tr>
	<td height="10px"></td>
	</tr></table>

<table align="center" border="0" cellpadding="0" cellspacing="2"><tr>
	<td style="text-align: center;"><span style="font-family:arial,helvetica,sans-serif;"><span style="text-align: center;">${record.subsidiary.custrecord_address_print}</span></span></td>
	</tr></table>
&nbsp;

<table align="center" border="0" cellpadding="0" cellspacing="2"><tr>
	<td>
	<h1><span style="font-family:arial,helvetica,sans-serif;"><span style="font-size:22px;"><span style="text-align: center;">PACKING LIST</span></span></span></h1>
	</td>
	</tr></table>
&nbsp;


#print3HTML#

<table align="center" border="0" cellpadding="0" cellspacing="0" style="width:700px;"><tr>
	<td style="height:20px">&nbsp;</td>
	</tr></table>

<table align="center" border="1" cellpadding="3" cellspacing="0" style="width:700px;"><tr style="margin-top:10px; margin-left:20px;">
	<td></td>
	<td colspan="2"><span style="font-size:12px;"><strong>C/N</strong></span></td>
	<td colspan="2"><span style="font-size:12px;"><strong>DESCRIPTION</strong></span></td>
	<td colspan="2"><span style="font-size:12px;"><strong>QTY.</strong></span></td>
	<td colspan="2"><span style="font-size:12px;"><strong>G.W.</strong></span></td>
	<td colspan="2"><span style="font-size:12px;"><strong>N.W.</strong></span></td>
	<td colspan="2"><span style="font-size:12px;"><strong>MEAS.</strong></span></td>
	</tr>
	<tr style="margin-left:20px;">
	<td colspan="13" style="height:10px">&nbsp;</td>
	</tr>#printHTML#
	</table>

<div style="text-align: center;">&nbsp;</div>

</body>
</pdf>
