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

<table align="center" border="1" cellpadding="1" cellspacing="1" style="width:700px;"><tr style="margin-top:10px;">
	<td style="text-align:center"><span style="font-size:12px;">需方：</span></td>
	<td colspan="3" rowspan="1"><span style="font-size:12px;">${record.subsidiary}</span></td>
	<td style="text-align: center;"><span style="font-size:12px;">合同编号：</span></td>
	<td style="text-align: center;"><span style="font-size:12px;">${record.custbody4}</span></td>
	</tr>
	<tr>
	<td style="text-align: center;"><span style="font-size:12px;">供方：</span></td>
	<td colspan="3" rowspan="1"><span style="font-size:12px;">${record.entity.companyname}</span></td>
	<td style="text-align: center;"><span style="font-size:12px;">签约日期：</span></td>
	<td style="text-align: center;"><span style="font-size:12px;">${record.trandate}</span></td>
	</tr>
	<tr>
	<td style="text-align: center;"><span style="font-size:12px;">产品名称</span></td>
	<td style="text-align: center;"><span style="font-size:12px;">计量单位</span></td>
	<td style="text-align: center;"><span style="font-size:12px;">数量</span></td>
	<td style="text-align: center;"><span style="font-size:12px;">单价</span></td>
	<td style="text-align: center;"><span style="font-size:12px;">金额</span></td>
	<td style="text-align: center;"><span style="font-size:12px;">备注</span></td>
	</tr>
	<#if record.item?has_content><#list record.item as item>
	<tr>
	<td style="text-align: center;"><span style="font-size:12px;">${item.custcol8}</span></td>
	<td style="text-align: center;"><span style="font-size:12px;">${item.units}</span></td>
	<td style="text-align: center;"><span style="font-size:12px;">${item.quantity}</span></td>
	<td style="text-align: center;"><span style="font-size:12px;">${item.rate}</span></td>
	<td style="text-align: center;"><span style="font-size:12px;">${item.amount}</span></td>
	<td style="text-align: center;"><span style="font-size:12px;">${item.custcol_memo}</span></td>
	</tr>
	</#list></#if>
	<tr>
	<td style="text-align: center;"><span style="font-size:12px;">合计金额：</span></td>
	<td colspan="5" rowspan="1" align="right"><span style="font-size:12px;">${record.subtotal}</span></td>
	</tr>
	<tr>
	<td style="text-align: center;"><span style="font-size:12px;">1.质量标准：</span></td>
	<td colspan="3" rowspan="1"><span style="font-size:12px;">${record.custbody_quality}</span></td>
	<td colspan="2" rowspan="1" style="text-align: center;"><span style="font-size:12px;">其他约定:</span></td>
	</tr>
	<tr>
	<td style="text-align: center;"><span style="font-size:12px;">2.包装要求：</span></td>
	<td colspan="3" rowspan="1"><span style="font-size:12px;">${record.custbody_pack}</span></td>
	<td colspan="2" rowspan="5" style="text-align: center;"><span style="font-size:12px;">${record.custbody5}</span></td>
	</tr>
	<tr>
	<td style="text-align: center;"><span style="font-size:12px;">3.交货地点：</span></td>
	<td colspan="3" rowspan="1"><span style="font-size:12px;">${record.custbody_location}</span></td>
	</tr>
	<tr>
	<td style="text-align: center;"><span style="font-size:12px;">4.验收方法：</span></td>
	<td colspan="3" rowspan="1"><span style="font-size:12px;">${record.custbody_check_method}</span></td>
	</tr>
	<tr>
	<td style="text-align: center;"><span style="font-size:12px;">5.交货时间：</span></td>
	<td colspan="3" rowspan="1"><span style="font-size:12px;">${record.custbody_receive_date}</span></td>
	</tr>
	<tr>
	<td style="text-align: center;"><span style="font-size:12px;">6.结算方式：</span></td>
	<td colspan="3" rowspan="1"><span style="font-size:12px;">${record.custbody3}</span></td>
	</tr>
	<tr>
	<td style="text-align: center;"><span style="font-size:12px;">需方：</span></td>
	<td colspan="2" rowspan="1"><span style="font-size:12px;">${record.subsidiary}</span></td>
	<td style="text-align: center;"><span style="font-size:12px;">供方：</span></td>
	<td colspan="2" rowspan="1"><span style="font-size:12px;">${record.createdfrom.altname}</span></td>
	</tr>
	<tr>
	<td style="text-align: center;"><span style="font-size:12px;">法人代表：</span></td>
	<td colspan="2" rowspan="1"><span style="font-size:12px;">${record.entity.custentity2}</span></td>
	<td style="text-align: center;"><span style="font-size:12px;">法人代表：</span></td>
	<td colspan="2" rowspan="1">&nbsp;</td>
	</tr>
	<tr>
	<td style="text-align: center;"><span style="font-size:12px;">经办人员：</span></td>
	<td colspan="2" rowspan="1"><span style="font-size:12px;">${record.entity.custentity3}</span></td>
	<td style="text-align: center;"><span style="font-size:12px;">经办人员：</span></td>
	<td colspan="2" rowspan="1">&nbsp;</td>
	</tr>
	<tr>
	<td style="text-align: center;"><span style="font-size:12px;">地址：</span></td>
	<td colspan="2" rowspan="1"><span style="font-size:12px;">${record.entity.address.address}</span></td>
	<td style="text-align: center;"><span style="font-size:12px;">地址：</span></td>
	<td colspan="2" rowspan="1">&nbsp;</td>
	</tr>
	<tr>
	<td style="text-align: center;"><span style="font-size:12px;">电话：</span></td>
	<td colspan="2" rowspan="1"><span style="font-size:12px;">${record.entity.phone}</span></td>
	<td style="text-align: center;"><span style="font-size:12px;">电话：</span></td>
	<td colspan="2" rowspan="1">&nbsp;</td>
	</tr>
	<tr>
	<td style="text-align: center;"><span style="font-size:12px;">传真：</span></td>
	<td colspan="2" rowspan="1"><span style="font-size:12px;">${record.entity.fax}</span></td>
	<td style="text-align: center;"><span style="font-size:12px;">传真：</span></td>
	<td colspan="2" rowspan="1">&nbsp;</td>
	</tr>
	<tr>
	<td style="text-align: center;"><span style="font-size:12px;">开户银行：</span></td>
	<td colspan="2" rowspan="1"><span style="font-size:12px;">${record.entity.custentity4}</span></td>
	<td style="text-align: center;"><span style="font-size:12px;">开户银行：</span></td>
	<td colspan="2" rowspan="1">&nbsp;</td>
	</tr>
	<tr style="margin-bottom:10px">
	<td style="text-align: center;"><span style="font-size:12px;">账号：</span></td>
	<td colspan="2" rowspan="1"><span style="font-size:12px;">${record.entity.custentity5}</span></td>
	<td style="text-align: center;"><span style="font-size:12px;">账号：</span></td>
	<td colspan="2" rowspan="1">&nbsp;</td>
	</tr></table>
&nbsp;

<h1>&nbsp;</h1>
</body>
</pdf>