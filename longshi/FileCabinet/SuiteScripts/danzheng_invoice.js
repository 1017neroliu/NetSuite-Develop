<?xml version="1.0" encoding="utf-8"?><!DOCTYPE pdf PUBLIC "-//big.faceless.org//report" "report-1.1.dtd">
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
					td p { align:left }
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
	<h1><span style="font-family:arial,helvetica,sans-serif;"><span style="font-size:18px;"><span style="text-align: center;">${record.subsidiary.custrecord_subsidiary_en}</span></span></span></h1>
	</td>
	</tr></table>

	<table border="0" cellpadding="0" cellspacing="2"><tr>
	<td height="10px"></td>
	</tr></table>
	
<table align="center" border="0" cellpadding="0" cellspacing="2"><tr>
	<td style="text-align: center;"><span style="text-align: center;">${companyInformation.mainaddress_text}</span></td>
	</tr></table>
&nbsp;

<table align="center" border="0" cellpadding="0" cellspacing="2"><tr>
	<td>
	<h1><span style="font-family:arial,helvetica,sans-serif;"><span style="font-size:22px;"><span style="text-align: center;">COMMERCIAL INVOICE</span></span></span></h1>
	</td>
	</tr></table>
&nbsp;

<div>&nbsp;
<table border="0" cellpadding="3" cellspacing="0" style="width:700px;"><tr>
	<td style="width:100px"></td>
	<th><span style="align: right; font-size:12px;"><strong>TO:</strong></span></th>
	<td><span style="align: left; font-size:12px;">${record.entity.companyname}</span></td>
	<td style="width:50px"></td>
	<th><span style="align: right; font-size:12px;"><strong>INVOICE NO.:</strong></span></th>
	<td><span style="align: left; font-size:12px;">${record.custbody6}</span></td>
	<td style="width:100px"></td>
	</tr>
	<tr>
	<td>&nbsp;</td>
	<td>&nbsp;</td>
	<td colspan="1" rowspan="4"><span style="align: left; font-size:12px;">${record.billaddress}</span></td>
	<td>&nbsp;</td>
	<th><span style="align: right; font-size:12px;"><strong>DATE:</strong></span></th>
	<td><span style="align: left; font-size:12px;">${record.trandate}</span></td>
	<td>&nbsp;</td>
	</tr>
	<tr>
	<td>&nbsp;</td>
	<td></td>
	<td></td>
	<td>&nbsp;</td>
	<td></td>
	<td>&nbsp;</td>
	</tr>
	<tr>
	<td>&nbsp;</td>
	<td>&nbsp;</td>
	<td>&nbsp;</td>
	<td>&nbsp;</td>
	<td>&nbsp;</td>
	<td>&nbsp;</td>
	</tr>
	<tr>
	<td>&nbsp;</td>
	<td>&nbsp;</td>
	<td>&nbsp;</td>
	<td>&nbsp;</td>
	<td>&nbsp;</td>
	<td>&nbsp;</td>
	</tr>
	<tr>
	<td>&nbsp;</td>
	<td>&nbsp;</td>
	<td><span style="align: left; font-size: 12px;">${record.entity.phone}</span></td>
	<td>&nbsp;</td>
	<td>&nbsp;</td>
	<td>&nbsp;</td>
	<td>&nbsp;</td>
	</tr>
	<tr>
	<td>&nbsp;</td>
	<td>&nbsp;</td>
	<td><span style="align: left; font-size: 12px;">${record.entity.vatregnumber}</span></td>
	<td>&nbsp;</td>
	<td>&nbsp;</td>
	<td>&nbsp;</td>
	<td>&nbsp;</td>
	</tr></table>

<table align="center" border="0" cellpadding="0" cellspacing="0" style="width:700px;"><tr>
	<td style="height:20px">&nbsp;</td>
	</tr></table>

<table align="center" border="1" cellpadding="3" cellspacing="2" style="width:700px;"><tr style="margin-top:10px">
	<th colspan="2" style="align: left;"><span style="font-size:12px;"><strong>FROM:${record.custbody_departure?upper_case}</strong></span></th>
	<th colspan="2" style="align: center;"><span style="font-size:12px;"><strong>TO:${record.custbody_destination?upper_case}</strong></span></th>
	<th colspan="2" style="align: center;"><span style="font-size:12px;"><strong>${record.custbody_term}</strong></span></th>
	</tr>
	<tr>
	<th style="align: left;"><span style="font-size:12px;"><strong>MARKS &amp; NOS.</strong></span></th>
	<th style="align: center;"><span style="font-size:12px;"><strong>P.O.</strong></span></th>
	<th colspan="2" style="align: center;"><span style="font-size:12px;"><strong>QUANTITIES AND DESCRIPTIONS</strong></span></th>
	<th style="align: center;"><span style="font-size:12px;"><strong>UNIT PRICE</strong></span></th>
	<th style="align: center;"><span style="font-size:12px;"><strong>TTL AMOUNT</strong></span></th>
	</tr>
	<tr>
	<td colspan="6">&nbsp;</td>
	</tr>
	<tr>
	<th style="align: left;"><span style="font-size:12px;"><strong>N/M</strong></span></th>
	<td colspan="5">&nbsp;</td>
	</tr>
	<tr>
	<td colspan="6">&nbsp;</td>
	</tr>
	#printHTML#
	</table>

<div style="align: center;">&nbsp;</div>
</div>
</body>
</pdf>