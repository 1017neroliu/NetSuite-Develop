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
			font-family: NotoSans, NotoSansCJKsc, sans-serif,stsong;
		<#elseif .locale == "zh_TW">
			font-family: NotoSans, NotoSansCJKtc, sans-serif;
		<#elseif .locale == "ja_JP">
			font-family: NotoSans, NotoSansCJKjp, sans-serif;
		<#elseif .locale == "ko_KR">
			font-family: NotoSans, NotoSansCJKkr, sans-serif;
		<#elseif .locale == "th_TH">
			font-family: NotoSans, NotoSansThai, sans-serif;
		<#else>
			font-family: NotoSans, sans-serif,stsong;
		</#if>
		}
		table {
			font-size: 8pt;
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
         	 border-left: 1px solid;
        }
		td p { align:left }
</style>
</head>
<body padding="0.5in 0.5in 0.5in 0.5in" size="Letter">
    <#if record.line?has_content>
<table align="center" border="0" cellpadding="0" cellspacing="0" style="width:500px;"><tr>
	<td style="align: center; border-left: 0px solid;"><span style="font-size:16px;"><strong>中华人民共和国海关出口货物报关单</strong></span></td>
	</tr></table>
&nbsp;

<table align="center" style="width:100%;"><tr style="border-bottom: 1px solid;">
	<td colspan="6" rowspan="1" style="border-left: 0px solid;"><strong>预录入编号：</strong></td>
	<td colspan="4" rowspan="1" style="border-left: 0px solid;"><strong>海关编号：</strong></td>
	<td colspan="4" rowspan="1" style="border-left: 0px solid;"><strong>（xx海关）</strong></td>
	<td colspan="6" rowspan="1" style="border-left: 0px solid;">&nbsp;</td>
	</tr>
	<tr style="border-bottom: 1px solid">
	<td colspan="6" rowspan="1"><strong>境内发货人&nbsp;</strong>${record.custbody_law_name}</td>
	<td colspan="4" rowspan="1"><strong>出境关别&nbsp;</strong><br />&nbsp;</td>
	<td colspan="4" rowspan="1"><strong>出口日期<br />&nbsp;</strong>${record.trandate}</td>
	<td colspan="3" rowspan="1"><strong>申报日期<br />&nbsp;</strong>${record.trandate}</td>
	<td colspan="3" rowspan="1" style="border-right: 1px solid;"><strong>备案号</strong><br />&nbsp;</td>
	</tr>
	<tr style="border-bottom: 1px solid">
	<td colspan="6" rowspan="1"><b>境外收货人&nbsp;</b>${record.custbody_field_in_col_receiver}</td>
	<td colspan="4" rowspan="1"><strong>运输方式<br />&nbsp;</strong>${record.custbody_field_in_col_transport_type}</td>
	<td colspan="4" rowspan="1"><b>运输工具名称及航次号&nbsp;</b><br />&nbsp;</td>
	<td colspan="6" rowspan="1" style="border-right: 1px solid;"><strong>提运单号</strong><br />&nbsp;</td>
	</tr>
	<tr style="border-bottom: 1px solid">
	<td colspan="6" rowspan="1"><strong>生产销售单位<br />&nbsp;</strong>${record.custbody_law_name}</td>
	<td colspan="4" rowspan="1"><strong>监管方式<br />&nbsp;</strong>${record.custbody_field_in_col_bus_type}</td>
	<td colspan="4" rowspan="1"><strong>征免性质&nbsp;</strong><br />&nbsp;</td>
	<td colspan="6" rowspan="1" style="border-right: 1px solid;"><strong>许可证号</strong><br />&nbsp;</td>
	</tr>
	<tr style="border-bottom: 1px solid">
	<td colspan="6" rowspan="1"><strong>合同协议号<br />&nbsp;</strong>${record.custbody_field_in_col_so}</td>
	<td colspan="4" rowspan="1"><strong>贸易国（地区）&nbsp;</strong><br />${record.custbody_field_in_col_bus_country}</td>
	<td colspan="4" rowspan="1"><strong>运抵国（地区）</strong><br />${record.custbody_declear_ydg}</td>
	<td colspan="3" rowspan="1"><strong>指运港<br />&nbsp;</strong>${record.custbody_field_in_col_terminal}</td>
	<td colspan="3" rowspan="1" style="width: 24px; border-right: 1px solid;"><strong>离境口岸<br />&nbsp;</strong>${record.custbody_field_in_col_export}</td>
	</tr>
	<tr style="border-bottom: 1px solid">
	<td colspan="6" rowspan="1"><strong>包装种类<br />&nbsp;</strong>${record.custbody_field_packing_type}</td>
	<td colspan="2" rowspan="1" style="width: 63px;"><strong>件数<br />&nbsp;</strong>${record.custbody_field_packing_quan}</td>
	<td colspan="2" rowspan="1" style="width: 67px;"><strong>毛重（千克）&nbsp;</strong>${record.custbody_field_gross_weight}</td>
	<td colspan="2" rowspan="1"><strong>净重（千克）&nbsp;</strong>${record.custbody_field_net_weight}</td>
	<td colspan="2" rowspan="1"><strong>成交方式&nbsp;</strong><br />&nbsp;</td>
	<td colspan="2" rowspan="1"><strong>运费<br />&nbsp;</strong>${record.custbody_field_freight_fee}</td>
	<td colspan="2" rowspan="1"><strong>保费<br />&nbsp;</strong>${record.custbody_field_surance_fee}</td>
	<td colspan="2" rowspan="1" style="width: 26px; border-right: 1px solid;"><strong>杂费<br />&nbsp;</strong>${record.custbody_field_other_fee}</td>
	</tr>
	<tr style="border-bottom: 1px solid">
	<td colspan="20" style="border-right: 1px solid;"><strong>随附单证及编号<br />&nbsp;</strong>${record.custbody_follow_doc}</td>
	</tr>
	<tr style="border-bottom: 1px solid">
	<td colspan="20" style="border-right: 1px solid;"><strong>标记唛码及备注<br />&nbsp;</strong>${record.custbody_field_in_col_mark}</td>
	</tr>
	<tr style="border-bottom: 1px solid">
	<td style="width: 23px;"><strong>项号</strong></td>
	<td colspan="2" rowspan="1" style="width: 25px; border-left: 0px solid;"><strong>商品编号</strong></td>
	<td colspan="4" rowspan="1" style="border-left: 0px solid;"><strong>商品名称及规格型号</strong></td>
	<td colspan="2" rowspan="1" style="width: 25px; border-left: 0px solid;"><strong>数量及单位</strong></td>
	<td colspan="3" rowspan="1" style="width: 28px; border-left: 0px solid;"><strong>单价/总价/币制</strong></td>
	<td colspan="2" rowspan="1" style="border-left: 0px solid;"><strong>原产国（地区）</strong></td>
	<td colspan="2" rowspan="1" style="border-left: 0px solid;"><strong>最终目的国（地区）</strong></td>
	<td colspan="2" rowspan="1" style="border-left: 0px solid;"><strong>境内货源地</strong></td>
	<td colspan="2" rowspan="1" style="width: 26px; border-right: 1px solid; border-left: 0px solid;"><strong>征免</strong></td>
	</tr>
	<#if record.item?has_content><#list record.item as item>
	<tr style="border-bottom: 1px dashed">
	<td style="width: 23px;">${record.tranid}</td>
	<td colspan="2" style="width: 25px; border-left: 0px solid;">${record.custcol_po_custom_num}</td>
	<td colspan="4" style="border-left: 0px solid;">${record.custcol_line_in_col_item_display}</td>
	<td colspan="2" style="width: 25px; border-left: 0px solid;">${record.custcol_lcapp_field_quantity} ${record.custcol_units}</td>
	<td colspan="3" style="width: 28px; border-left: 0px solid;">${record.custcol_lcapp_line_field_rate}/${record.custcol_lcapp_line_field_amt}/${record.custcol_ebp_currency}</td>
	<td colspan="2" style="border-left: 0px solid;">${record.custcol_oringial_country_display}</td>
	<td colspan="2" style="border-left: 0px solid;">${record.custcol_destination_country_display}</td>
	<td colspan="2" style="border-left: 0px solid;">${record.custcol2}</td>
	<td colspan="2" style="width: 26px; border-right: 1px solid; border-left: 0px solid;">&nbsp;</td>
	</tr>
	</#list></#if>
	<tr style="border-bottom: 1px solid">
	<td colspan="3" rowspan="1" style="width: 23px;"><strong>特殊关系确认：</strong>${record.custbody_declear_tsgxqr}</td>
	<td colspan="3" rowspan="1" style="border-left: 0px solid;"><strong>价格影响确认：</strong>${record.custbody_declear_jgyxqr}</td>
	<td colspan="6" rowspan="1" style="width: 23px; border-left: 0px solid;"><strong>支付特许权使用费确认：</strong>${record.custbody_declare_zctxqsyfqr}</td>
	<td colspan="8" rowspan="1" style="width: 16px; border-left: 0px solid; border-right: 1px solid;"><strong>自报自缴：</strong>${record.custbody_declear_zbzj}</td>
	</tr>
	<tr style="border-bottom: 0px solid">
	<td colspan="2" rowspan="1" style="width: 23px;"><strong>报关人员</strong></td>
	<td colspan="4" rowspan="1" style="width: 49.5px; border-left: 0px solid;"><strong>报关人员证号</strong></td>
	<td colspan="3" rowspan="1" style="width: 23px; border-left: 0px solid;"><strong>电话</strong></td>
	<td colspan="7" rowspan="1" style="width: 28px; border-left: 0px solid;"><strong>兹申明对以上内容承担如实申报、依法纳税之法律责任</strong></td>
	<td colspan="4" rowspan="1" style="border-right: 1px solid; border-left: 1px solid;"><strong>海关批注及签章</strong></td>
	</tr>
	<tr>
	<td colspan="2" style="width: 23px;">&nbsp;</td>
	<td colspan="4" style="width: 49.5px; border-left: 0px solid;">&nbsp;</td>
	<td colspan="3" style="width: 23px; border-left: 0px solid;">&nbsp;</td>
	<td colspan="7" style="width: 28px; border-left: 0px solid;">&nbsp;</td>
	<td colspan="4" style="border-right: 1px solid; border-left: 1px solid;">&nbsp;</td>
	</tr>
	<tr style="border-bottom: 1px solid">
	<td colspan="2" style="width: 23px;"><strong>申报单位</strong></td>
	<td colspan="4" style="width: 49.5px; border-left: 0px solid;">&nbsp;</td>
	<td colspan="3" style="width: 23px; border-left: 0px solid;">&nbsp;</td>
	<td colspan="7" style="width: 28px; align: right; border-left: 0px solid;"><strong>申报单位（签章）</strong></td>
	<td colspan="4" style="border-right: 1px solid; border-left: 1px solid;">&nbsp;</td>
	</tr>
	<tr style="border-bottom: 1px solid">
	<td style="width: 23px;">&nbsp;</td>
	<td style="width: 25px;">&nbsp;</td>
	<td style="width: 49.5px;">&nbsp;</td>
	<td>&nbsp;</td>
	<td>&nbsp;</td>
	<td>&nbsp;</td>
	<td style="width: 23px;">&nbsp;</td>
	<td style="width: 23px;">&nbsp;</td>
	<td style="width: 26px;">&nbsp;</td>
	<td style="width: 28px;">&nbsp;</td>
	<td style="width: 27px;">&nbsp;</td>
	<td style="width: 23px;">&nbsp;</td>
	<td style="width: 16px;">&nbsp;</td>
	<td style="width: 34px;">&nbsp;</td>
	<td>&nbsp;</td>
	<td>&nbsp;</td>
	<td>&nbsp;</td>
	<td style="width: 24px;">&nbsp;</td>
	<td style="width: 26px;">&nbsp;</td>
	<td style="border-right: 1px solid;">&nbsp;</td>
	</tr></table>

<div style="text-align: center;"></#if></div>
</body>
</pdf>