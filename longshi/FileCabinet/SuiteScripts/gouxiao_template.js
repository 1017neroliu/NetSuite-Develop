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
<body padding="0.5in 0.5in 0.5in 0.5in" size="A4">
    <br /><br />&nbsp;
<table align="center" border="0" cellpadding="0" cellspacing="0"><tr>
	<td style="text-align: center;">
	<h1><span style="font-size:20px;"><strong><span style="font-family:arial,helvetica,sans-serif;"><span style="text-align: center;">${record.subsidiary}</span></span></strong></span></h1>
	</td>
	</tr></table>
&nbsp;

<table align="center" border="0" cellpadding="0" cellspacing="0"><tr>
	<td>
	<h1><span style="font-family:arial,helvetica,sans-serif;"><span style="font-size:22px;"><span style="text-align: center;">购&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;销&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;合&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;同</span></span></span></h1>
	</td>
	</tr></table>
&nbsp;

<table align="left" border="1" cellpadding="6px" cellspacing="1" style="width:100%;"><tr>
	<td style="align: left" colspan="2"><span style="font-size:12px;">需方：</span></td>
	<td style="align: left" colspan="8" rowspan="1"><span style="font-size:12px;">${record.subsidiary}</span></td>
	<td style="align: right" colspan="1"><span style="font-size:12px;">合同编号：</span></td>
	<td style="align: left" colspan="1"><span style="font-size:12px;">${record.custbody6}</span></td>
	</tr>
	<tr style="border-bottom:solid">
	<td style="align: left;" colspan="2"><span style="font-size:12px;">供方：</span></td>
	<td colspan="8" rowspan="1"><span style="font-size:12px;">#print1HTML#</span></td>
	<td style="align: right;" colspan="1"><span style="font-size:12px;">签约日期：</span></td>
	<td style="align: left;" colspan="1"><span style="font-size:12px;">${record.trandate}</span></td>
	</tr>
	<tr>
	<td colspan="2" style="align: left;"><span style="font-size:12px;">产品名称</span></td>
	<td colspan="2" style="align: left;"><span style="font-size:12px;">计量单位</span></td>
	<td colspan="1"  style="align: left;"><span style="font-size:12px;">数量</span></td>
	<td colspan="1"  style="align: left;"><span style="font-size:12px;">单价</span></td>
	<td colspan="2" style="align: left;"><span style="font-size:12px;">金额</span></td>
	<td width="100" colspan="4" style="align: center;"><span style="font-size:12px;">备注</span></td>
	</tr>
//	<#assign sum=0>
	<#if record.item?has_content><#list record.item as item><#assign value=item.rate+item.rate*item.taxrate1>
	<tr>
	<td colspan="2"  style="align: left;"><span style="font-size:12px;">${item.custcol8}</span></td>
	<td colspan="2"  style="align: left;"><span style="font-size:12px;">${item.units}</span></td>
	<td colspan="1"  style="align: left;"><span style="font-size:12px;">${item.quantity}</span></td>
	<td colspan="1"  style="align: left;"><span style="font-size:12px;">${value?string["0.00"]}</span></td>
	<td colspan="2"  style="align: center;"><span style="font-size:12px;">${item.grossamt}</span></td>
	<td width="150" colspan="4" style="align: center; word-break:break-all"><span style="font-size:12px;">${item.custcol_memo}</span></td>
	</tr>
//	<#assign sum=sum+item.quantity>
	</#list></#if>
//	<tr>
//	<td colspan="2" style="text-align: center;"><span style="font-size:12px;">合计数量：</span></td>
//	<td colspan="10" rowspan="1"><span style="font-size:12px;">${sum}&nbsp;&nbsp;&nbsp;#print0HTML#</span></td>
//	</tr>
	<tr style="border-bottom:solid">
	<td colspan="2" style="text-align: center;"><span style="font-size:12px;">合计金额：</span></td>
	<td colspan="10" rowspan="1"><span style="font-size:12px;">${record.subtotal}</span></td>
	</tr>
	<tr>
	<td style="align: left" colspan="2"><span style="font-size:12px;">1.质量标准：</span></td>
	<td style="align: left" colspan="10" rowspan="1"><span style="font-size:12px;">${record.custbody_quality}</span></td>
	</tr>
	<tr>
	<td style="align: left" colspan="2"><span style="font-size:12px;">2.包装要求：</span></td>
	<td style="align: left" colspan="10" rowspan="1"><span style="font-size:12px;">${record.custbody_pack}</span></td>
	</tr>
	<tr>
	<td style="align: left" colspan="2"><span style="font-size:12px;">3.交货地点：</span></td>
	<td style="align: left" colspan="10" rowspan="1"><span style="font-size:12px;">${record.custbody_location}</span></td>
	</tr>
	<tr>
	<td style="align: left" colspan="2"><span style="font-size:12px;">4.验收方法：</span></td>
	<td style="align: left" colspan="10" rowspan="1"><span style="font-size:12px;">${record.custbody_check_method}</span></td>
	</tr>
	<tr>
	<td style="align: left" colspan="2"><span style="font-size:12px;">5.交货时间：</span></td>
	<td style="align: left" colspan="10" rowspan="1"><span style="font-size:12px;">${record.custbody_receive_date}</span></td>
	</tr>
	<tr>
	<td style="align: left;" colspan="2"><span style="font-size:12px;">6.结算方式：</span></td>
	<td style="align: left;" colspan="10" rowspan="1"><span style="font-size:12px;">${record.custbody3}</span></td>
	</tr>
	<tr style="border-bottom:solid">
	<td style="align: left" colspan="2"><span style="font-size:12px;">7.其他约定：</span></td>
	<td style="align: left" colspan="10" rowspan="1"><span style="font-size:12px;">${record.custbody5}</span></td>
	</tr>#print2HTML#</table>

<h1>&nbsp;</h1>
</body>
</pdf>