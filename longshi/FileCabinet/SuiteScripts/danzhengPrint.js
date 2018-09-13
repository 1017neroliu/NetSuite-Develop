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
	<h1><strong><span style="font-family:arial,helvetica,sans-serif;"><span style="font-size:24px;"><span style="text-align: center;">${record.createdfrom.subsidiary}</span></span></span></strong></h1>
	</td>
	</tr></table>

<table align="center" border="0" cellpadding="0" cellspacing="2"><tr>
	<td style="text-align: center;">
	<h1><span style="font-family:arial,helvetica,sans-serif;"><span style="font-size:22px;"><span style="text-align: center;">${companyInformation.companyname?upper_case}</span></span></span></h1>
	</td>
	</tr></table>

<table align="center" border="0" cellpadding="0" cellspacing="2"><tr>
	<td style="text-align: center;"><span style="font-family:arial,helvetica,sans-serif;"><span style="text-align: center;">${companyInformation.mainaddress_text}</span></span></td>
	</tr></table>
&nbsp;

<table align="center" border="0" cellpadding="0" cellspacing="2"><tr>
	<td>
	<h1><span style="font-family:arial,helvetica,sans-serif;"><span style="font-size:22px;"><span style="text-align: center;">PACKING LIST</span></span></span></h1>
	</td>
	</tr></table>
&nbsp;

<div>&nbsp;
<table align="center" border="0" cellpadding="0" cellspacing="2" style="width:700px;"><tr>
	<td><span style="font-size:12px;"><strong>TO:</strong></span></td>
	<td rowspan="4"><span style="font-size:12px;">${record.createdfrom.billaddress}</span></td>
	<td><span style="font-size:12px;"><strong>INVOICE NO.:</strong></span></td>
	<td><span style="font-size:12px;">${record.createdfrom.tranid}</span></td>
	</tr>
	<tr>
	<td>&nbsp;</td>
	<td><span style="font-size:12px;"><strong>DATE:</strong></span></td>
	<td><span style="font-size:12px;">${record.createdfrom.trandate}</span></td>
	</tr>
	<tr>
	<td>&nbsp;</td>
	<td><span style="font-size:12px;"><strong>S/O:</strong></span></td>
	<td><span style="font-size:12px;">&nbsp;</span></td>
	</tr>
	<tr>
	<td>&nbsp;</td>
	<td>&nbsp;</td>
	<td>&nbsp;</td>
	</tr></table>

<table align="center" border="0" cellpadding="0" cellspacing="0" style="width:700px;"><tr>
	<td style="height:20px">&nbsp;</td>
	</tr></table>

<table align="center" border="1" cellpadding="0" cellspacing="0" style="width:700px;"><tr style="margin-top:10px; margin-left:20px;">
	<td><span style="font-size:12px;">C/N</span></td>
	<td><span style="font-size:12px;">DESCRIPTION</span></td>
	<td><span style="font-size:12px;">QTY.</span></td>
	<td><span style="font-size:12px;">GW</span></td>
	<td><span style="font-size:12px;">NW</span></td>
	<td><span style="font-size:12px;">MEAS.</span></td>
	</tr>
	<tr style="margin-left:20px;">
	<td colspan="6" style="height:10px">&nbsp;</td>
	</tr>#printHTML#
	</table>

<div style="text-align: center;">&nbsp;</div>
</div>
</body>
</pdf>
