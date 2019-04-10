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
    <macrolist>
        <macro id="nlheader">
            <table style="width: 100%; font-size: 10pt;"><tr>
	<td rowspan="3" style="padding: 0;">#print1HTML#${companyInformation.companyName}<br />${companyInformation.addressText}</td>
	<td align="right" style="padding: 0;"><span style="font-size: 28pt;">Quotation</span></td>
	</tr>
	<tr>
	<td align="right" style="padding: 0;"><span style="font-size: 16pt;">#${record.name}</span></td>
	</tr>
	<tr>
	<td align="right" style="padding: 0;">${record.custrecord_issue_date}</td>
	</tr></table>
        </macro>
        <macro id="nlfooter">
            <p>&nbsp;</p>
        </macro>
    </macrolist>
    <style type="text/css">* {
		<#if .locale == "zh_CN">
			font-family: NotoSans, NotoSansCJKsc, sans-serif;
		<#elseif .locale == "zh_TW">
			font-family: NotoSans, NotoSansCJKtc, sans-serif;
		<#elseif .locale == "ja_JP">
			font-family: NotoSans, NotoSansCJKjp, sans-serif;
		<#elseif .locale == "ko_KR">
			font-family: NotoSans, NotoSansCJKkr, sans-serif;z
		<#elseif .locale == "th_TH">
			font-family: NotoSans, NotoSansThai, sans-serif;
		<#else>
			font-family: NotoSans, sans-serif;
		</#if>
		}
		table {
			font-size: 9pt;
			table-layout: fixed;
		}
        th {
            font-weight: bold;
            font-size: 8pt;
            vertical-align: middle;
            padding: 5px 6px 3px;
            background-color: #e3e3e3;
            color: #333333;
        }
        td {
            padding: 4px 6px;
        }
		td p { align:left }
</style>
</head>
<body header="nlheader" header-height="10%" footer="nlfooter" footer-height="20pt" padding="0.5in 0.5in 0.5in 0.5in" size="A4-LANDSCAPE">
    <br /><br />&nbsp;
<table style="width: 100%; margin-top: 10px;"><tr>
	<td colspan="6" style="font-size: 8pt; padding: 6px 0 2px; font-weight: bold; color: #333333;">Attn:</td>
	</tr>
	<tr>
	<td colspan="6" style="padding: 0;">xxx:</td>
	</tr>
	<tr>
	<td colspan="6" style="padding: 0;">Add:</td>
	</tr>
	<tr>
	<td colspan="6" style="padding: 0;">Contact Person:</td>
	</tr>
	<tr>
	<td colspan="6" style="padding: 0;">Phone:</td>
	</tr>
	<tr>
	<td colspan="6" style="padding: 0;">Fax:</td>
	</tr>
	<tr>
	<td colspan="6" style="padding: 0;">Email:</td>
	</tr></table>
&nbsp;

<table style="width: 100%; margin-top: 10px;"><tr>
	<th align="left">Delivery Date:</th>
	<td colspan="3" rowspan="1">${record.custrecord_delivery_date}</td>
	<th align="left"><span style="color: rgb(51, 51, 51); font-size: 10.6667px; font-weight: 700; text-align: -webkit-right; background-color: rgb(227, 227, 227);">Prepared By:</span></th>
	<td colspan="3" rowspan="1"><span style="background-color: rgb(255, 255, 255);">${record.owner}</span></td>
	</tr>
	<tr>
	<th align="left">Payment Terms:</th>
	<td colspan="3" rowspan="1">${record.custrecord_payment_terms}</td>
	<th align="left">Email:</th>
	<td colspan="3" rowspan="1">&nbsp;</td>
	</tr>
	<tr>
	<th align="left">Vailidity:</th>
	<td colspan="3" rowspan="1">${record.custrecord_vailidity}</td>
	<th align="left">Phone/Fax:</th>
	<td colspan="3" rowspan="1">&nbsp;</td>
	</tr>
	<tr>
	<th align="left">Packaging:</th>
	<td colspan="3" rowspan="1">${record.item.custrecord_packaging}</td>
	<th align="left">Page:</th>
	<td colspan="3" rowspan="1">${record.custrecord_page}</td>
	</tr>
	<tr>
	<th align="left">Trade Term:</th>
	<td colspan="3" rowspan="1">${record.item.custrecord_trade_term}</td>
	<th align="left">Approved By:</th>
	<td colspan="3" rowspan="1">${record.custrecord_approved_by}</td>
	</tr></table>
<br />&nbsp;
<table style="width: 100%; margin-top: 10px;">
<thead>
	<tr>
	<th align="center" style="padding: 10px 6px;">Serial No.</th>
	<th align="center" style="padding: 10px 6px;">Product Code</th>
	<th align="center" style="padding: 10px 6px;">Picture</th>
	<th align="center" style="padding: 10px 6px;">Description</th>
	<th align="center" style="padding: 10px 6px;">Specification</th>
	<th align="center" style="padding: 10px 6px;">Unit Price</th>
	<th align="center" style="padding: 10px 6px;">MOQ</th>
	<th align="center" style="padding: 10px 6px;">Remark</th>
	</tr>
</thead><#list record.item as item>
<tr>
	<td align="center">${item.custrecord_serial_no}</td>
	<td align="center">${item.name}</td>
   <td align="center">${item.custrecord_picture}</td>
	<td align="center">${item.custrecord_description}</td>
	<td align="center">${item.custrecord_specification}</td>
	<td align="center">${item.custrecord_unit_price}</td>
	<td align="center">${item.custrecord_moq}</td>
	<td align="center">${item.custrecord_remark}</td>
	</tr></#list>
	<tr>
	<th align="left">Reamrk:</th>
	<td colspan="7" rowspan="1">${record.custrecord_remark_quotation}</td>
	</tr></table>

<hr style="width: 100%; color: #d3d3d3; background-color: #d3d3d3; height: 1px;" />
</body>
</pdf>