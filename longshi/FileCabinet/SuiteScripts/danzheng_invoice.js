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

<table align="center" border="0" cellpadding="0" cellspacing="2"><tr>
	<td style="text-align: center;">
	<h1><span style="font-family:arial,helvetica,sans-serif;"><span style="font-size:22px;"><span style="text-align: center;">${companyInformation.companyname}</span></span></span></h1>
	</td>
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
<table align="center" border="0" cellpadding="0" cellspacing="2" style="width:700px;"><tr>
	<th><span style="font-size:12px;">TO:</span></th>
	<td><span style="font-size:12px;">${record.entity}</span></td>
	<th><span style="font-size:12px;">INVOICE NO.:</span></th>
	<td><span style="font-size:12px;">${record.tranid}</span></td>
	</tr>
	<tr>
	<td>&nbsp;</td>
	<td colspan="1" rowspan="4"><span style="font-size:12px;">${record.billaddress}</span></td>
	<th><span style="font-size:12px;">DATE:</span></th>
	<td><span style="font-size:12px;">${record.trandate}</span></td>
	</tr>
	<tr>
	<td>&nbsp;</td>
	<th><span style="font-size:12px;">S/O:</span></th>
	<td><span style="font-size:12px;">${record.otherrefnum}</span></td>
	</tr>
	<tr>
	<td>&nbsp;</td>
	<td>&nbsp;</td>
	<td>&nbsp;</td>
	</tr>
	<tr>
	<td>&nbsp;</td>
	<td>&nbsp;</td>
	<td>&nbsp;</td>
	</tr>
	<tr>
	<td>&nbsp;</td>
	<td><span style="font-size: 12px;">${record.entity.phone}</span></td>
	<td>&nbsp;</td>
	<td>&nbsp;</td>
	</tr>
	<tr>
	<td>&nbsp;</td>
	<td><span style="font-size: 12px;">${record.entity.vatregnumber}</span></td>
	<td>&nbsp;</td>
	<td>&nbsp;</td>
	</tr></table>

<table align="center" border="0" cellpadding="0" cellspacing="0" style="width:700px;"><tr>
	<td style="height:20px">&nbsp;</td>
	</tr></table>

<table align="center" border="1" cellpadding="0" cellspacing="2" style="width:700px;"><tr style="margin-top:10px">
	<th colspan="2" rowspan="1" style="text-align: center;"><span style="font-size:12px;">FROM:${record.custbody_departure?upper_case}</span></th>
	<th colspan="2" rowspan="1" style="text-align: center;"><span style="font-size:12px;">TO:${record.custbody_destination?upper_case}</span></th>
	<th colspan="2" rowspan="1" style="text-align: center;"><span style="font-size:12px;">${record.terms}</span></th>
	</tr>
	<tr>
	<th rowspan="1" style="text-align: center;"><span style="font-size:12px;">MARKS &amp; NOS.</span></th>
	<th rowspan="1" style="text-align: center;"><span style="font-size:12px;">P.O.</span></th>
	<th colspan="2" rowspan="1" style="text-align: center;"><span style="font-size:12px;">QUANTITIES AND DESCRIPTIONS</span></th>
	<th style="text-align: center;"><span style="font-size:12px;">UNIT PRICE</span></th>
	<th style="text-align: center;"><span style="font-size:12px;">TTL AMOUNT</span></th>
	</tr>
	<tr>
	<td colspan="6">&nbsp;</td>
	</tr>
	<tr>
	<th style="text-align: left;"><span style="font-size:12px;">N/M</span></th>
	<td colspan="5">&nbsp;</td>
	</tr>
	<tr>
	<td colspan="6">&nbsp;</td>
	</tr>
	#printHTML#
	</table>

<div style="text-align: center;">&nbsp;</div>
</div>
</body>
</pdf>