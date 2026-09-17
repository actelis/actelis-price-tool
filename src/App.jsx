import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import React from "react";
import { exportQuotePDF } from "./pdfExport.js";
import AdminUpload from "./AdminUpload.jsx";


// ═══════════════ NODE CONFIGURATOR WIZARD ═══════════════

// ─── WIZARD PRICE DATA (embedded, separate from main quote price list) ────────
const PRICE_LIST = [{"pn":"501RG0016","desc":"ML622","price":1145.0,"cat":"A2. ML600 Family"},{"pn":"501RG0046","desc":"ML624","price":1720.0,"cat":"A2. ML600 Family"},{"pn":"501RG0067","desc":"ML638","price":2306.0,"cat":"A2. ML600 Family"},{"pn":"501RG0076","desc":"ML654S","price":3748.0,"cat":"A2. ML600 Family"},{"pn":"501RG0077","desc":"ML658S","price":4430.0,"cat":"A2. ML600 Family"},{"pn":"501RG0078","desc":"ML650SV","price":3308.0,"cat":"A2. ML600 Family"},{"pn":"501RG0106","desc":"ML684M","price":1950.0,"cat":"A2. ML600 Family"},{"pn":"501RG0111","desc":"ML6916EN","price":6554.0,"cat":"A2. ML600 Family"},{"pn":"501RG0115","desc":"ML6916EL","price":6665.0,"cat":"A2. ML600 Family"},{"pn":"501RG0116","desc":"ML644EL","price":3560.0,"cat":"A2. ML600 Family"},{"pn":"501RG0121","desc":"ML622i with 24/48Vdc","price":800.0,"cat":"A2. ML600 Family"},{"pn":"501RG0122","desc":"ML624i with 24/48Vdc","price":1260.0,"cat":"A2. ML600 Family"},{"pn":"501RG0217","desc":"ML648E","price":3031.0,"cat":"A2. ML600 Family"},{"pn":"501RG0218","desc":"ML6416E","price":4595.0,"cat":"A2. ML600 Family"},{"pn":"501RG0238","desc":"ML6916E (w/o SyncE)","price":6090.0,"cat":"A2. ML600 Family"},{"pn":"501RG0253","desc":"ML698ES","price":5055.0,"cat":"A2. ML600 Family"},{"pn":"501RG0254","desc":"ML6916ES","price":6550.0,"cat":"A2. ML600 Family"},{"pn":"501RG0259","desc":"ML698E","price":3679.0,"cat":"A2. ML600 Family"},{"pn":"501RG3230","desc":"ML684D (New)","price":1950.0,"cat":"A2.1 ML600D Family"},{"pn":"501RG3231","desc":"ML680DF (New)","price":953.0,"cat":"A2.1 ML600D Family"},{"pn":"501RG3240","desc":"ML622D (New)","price":1374.0,"cat":"A2.1 ML600D Family"},{"pn":"501RG0232","desc":"ML684DTP","price":2295.0,"cat":"A2.1 ML600D Family"},{"pn":"501RG3255","desc":"ML684D-M (12/24V)","price":1995.0,"cat":"A2.1 ML600D Family"},{"pn":"501RG3256","desc":"ML684D-M (48/60V)","price":1995.0,"cat":"A2.1 ML600D Family"},{"pn":"501RG3355","desc":"ML684DL-M (12/24V)","price":2795.0,"cat":"A2.1 ML600D Family"},{"pn":"501RG3356","desc":"ML684DL-M (48/60V)","price":2795.0,"cat":"A2.1 ML600D Family"},{"pn":"501RG3358","desc":"ML684DLP-M","price":2989.0,"cat":"A2.1 ML600D Family"},{"pn":"501RG3376","desc":"ML680DL-M (48/60V)","price":2019.0,"cat":"A2.1 ML600D Family"},{"pn":"501RG3378","desc":"ML680DLP-M","price":1410.0,"cat":"A2.1 ML600D Family"},{"pn":"501RG0134","desc":"GL850L-16O","price":4251.0,"cat":"A1.1 GL800 Solutions"},{"pn":"501RG0135","desc":"GL850L-16R","price":3917.0,"cat":"A1.1 GL800 Solutions"},{"pn":"501RG0139","desc":"GL830-16O","price":3748.0,"cat":"A1.1 GL800 Solutions"},{"pn":"501RG0140","desc":"GL830-8O","price":3148.0,"cat":"A1.1 GL800 Solutions"},{"pn":"501RG0143","desc":"GL830-16R","price":3330.0,"cat":"A1.1 GL800 Solutions"},{"pn":"501RG0144","desc":"GL830-8R","price":2921.0,"cat":"A1.1 GL800 Solutions"},{"pn":"501RG0167","desc":"GL904","price":1120.0,"cat":"A1.4 GL900 Headend Solutions"},{"pn":"501RG0168","desc":"GL904-R","price":1410.0,"cat":"A1.4 GL900 Headend Solutions"},{"pn":"501RG0302","desc":"GL916","price":1950.0,"cat":"A1.4 GL900 Headend Solutions"},{"pn":"501RG0300","desc":"GL916-R","price":2230.0,"cat":"A1.4 GL900 Headend Solutions"},{"pn":"501RG0303","desc":"GL908","price":1380.0,"cat":"A1.4 GL900 Headend Solutions"},{"pn":"501RG0301","desc":"GL908-R","price":1680.0,"cat":"A1.4 GL900 Headend Solutions"},{"pn":"506R61334","desc":"GL9110C","price":1800.0,"cat":"A1.2 GL9000 Headend Solutions"},{"pn":"506R61342","desc":"GL9104C","price":1550.0,"cat":"A1.2 GL9000 Headend Solutions"},{"pn":"506R61335","desc":"GL901CS","price":162.0,"cat":"A1.2 GL9000 Headend Solutions"},{"pn":"506R61337","desc":"GL93C","price":110.0,"cat":"A1.3 GL9000 CPEs"},{"pn":"506R61336","desc":"GL93C-W","price":257.0,"cat":"A1.3 GL9000 CPEs"},{"pn":"501S61245E","desc":"GL91 (EU/US)","price":150.0,"cat":"A1.5 GL900 CPEs"},{"pn":"501S61245U","desc":"GL91 (UK)","price":150.0,"cat":"A1.5 GL900 CPEs"},{"pn":"501S61246","desc":"GL91T","price":120.0,"cat":"A1.5 GL900 CPEs"},{"pn":"501S61246E","desc":"GL91T (EU/US)","price":155.0,"cat":"A1.5 GL900 CPEs"},{"pn":"501S61247","desc":"GL91T-RB","price":195.0,"cat":"A1.5 GL900 CPEs"},{"pn":"506R61245","desc":"GL91","price":110.0,"cat":"A1.5 GL900 CPEs"},{"pn":"502R20230","desc":"Chassis 200 Shelf (CHS-200)","price":1127.0,"cat":"A4.1 Shelves"},{"pn":"502R02110","desc":"Chassis 2000B Shelf, 19\" (CHS-2000B)","price":2985.0,"cat":"A4.1 Shelves"},{"pn":"503R60042","desc":"Service Dispatcher Unit (SDU-450)","price":10345.0,"cat":"A4.2 SDU (Service Dispatch Units)"},{"pn":"503R60043","desc":"Service Dispatcher Unit (SDU-450G)","price":11495.0,"cat":"A4.2 SDU (Service Dispatch Units)"},{"pn":"503R20132","desc":"MLU-32DF (32 pairs, front access)","price":6325.0,"cat":"A4.3 MLU (Multiport Line Units)"},{"pn":"503R20164","desc":"MLU-64DF (64 pairs, front access)","price":9195.0,"cat":"A4.3 MLU (Multiport Line Units)"},{"pn":"503R20232","desc":"MLU-32DR (32 pairs, rear access)","price":6325.0,"cat":"A4.3 MLU (Multiport Line Units)"},{"pn":"503R20264","desc":"MLU-64DR (64 pairs, rear access)","price":9195.0,"cat":"A4.3 MLU (Multiport Line Units)"},{"pn":"504R20110","desc":"DSL Quad Cable, 4xRJ-45, 10ft/3m","price":46.0,"cat":"C4.1 DSL Cables"},{"pn":"504R20120","desc":"DSL Octal Cable, 8xRJ-45, 10ft/3m","price":69.0,"cat":"C4.1 DSL Cables"},{"pn":"510K20230","desc":"Accessories Kit for CHS-200","price":115.0,"cat":"A4.4 CHS-200 Related Items"},{"pn":"506R30070","desc":"Fan Control Module for CHS-2000B","price":685.0,"cat":"A4.5 CHS-2000 Related Items"},{"pn":"550A00046","desc":"Flash Card for SDU-450/G","price":173.0,"cat":"A4.5 CHS-2000 Related Items"},{"pn":"506R00006","desc":"AC-DC PSU for ML600/ML740/ML530 (NA)","price":110.0,"cat":"A3.1 Power Supplies for GL800/GL900/ML500/ML600/ML700"},{"pn":"506R00006E","desc":"AC-DC PSU for ML600/ML740/ML530 (EU)","price":110.0,"cat":"A3.1 Power Supplies for GL800/GL900/ML500/ML600/ML700"},{"pn":"506R00008","desc":"AC-DC PSU for GL900 (NA)","price":58.0,"cat":"A3.1 Power Supplies for GL800/GL900/ML500/ML600/ML700"},{"pn":"506R00008U","desc":"AC-DC PSU for GL900 (UK)","price":58.0,"cat":"A3.1 Power Supplies for GL800/GL900/ML500/ML600/ML700"},{"pn":"506R00013","desc":"AC/DC PSU for GL800 (NA)","price":138.0,"cat":"A3.1 Power Supplies for GL800/GL900/ML500/ML600/ML700"},{"pn":"506R00013E","desc":"AC/DC PSU for GL800 (EU)","price":138.0,"cat":"A3.1 Power Supplies for GL800/GL900/ML500/ML600/ML700"},{"pn":"506R61181","desc":"DIN Rail PSU 24VDC for ML600Dx (no PoE)","price":156.0,"cat":"A3.1 Power Supplies for GL800/GL900/ML500/ML600/ML700"},{"pn":"506R61184","desc":"DIN Rail PSU 24VDC + EU Cables","price":184.0,"cat":"A3.1 Power Supplies for GL800/GL900/ML500/ML600/ML700"},{"pn":"506R61185","desc":"DIN Rail PSU 24VDC + US Cables","price":184.0,"cat":"A3.1 Power Supplies for GL800/GL900/ML500/ML600/ML700"},{"pn":"506R61191","desc":"DIN Rail PSU 48VDC with PoE","price":225.0,"cat":"A3.1 Power Supplies for GL800/GL900/ML500/ML600/ML700"},{"pn":"510K00060","desc":"Accessories Kit for ML600/ML700/ML530","price":23.0,"cat":"A3.2 GL800/GL900ML500/ML600/ML700 Related Items"},{"pn":"510R21080","desc":"Wall Mount Kit for ML600/ML700/GL800/GL900","price":52.0,"cat":"A3.2 GL800/GL900ML500/ML600/ML700 Related Items"},{"pn":"510R21070","desc":"Rack Mount Sleeve Kit (2 ML600/700/530)","price":225.0,"cat":"A3.2 GL800/GL900ML500/ML600/ML700 Related Items"},{"pn":"506R00002","desc":"1000Base-LX SMF SFP (10km)","price":68.0,"cat":"C1. SFP Transceivers"},{"pn":"506R00012","desc":"1000Base-SX MMF SFP (500m)","price":68.0,"cat":"C1. SFP Transceivers"},{"pn":"506R00022","desc":"100Base-FX MMF SFP (2km)","price":115.0,"cat":"C1. SFP Transceivers"},{"pn":"506R00032","desc":"100Base-FX SMF SFP (15km)","price":68.0,"cat":"C1. SFP Transceivers"},{"pn":"506R00042","desc":"1000Base-T SFP","price":103.0,"cat":"C1. SFP Transceivers"},{"pn":"506R61154","desc":"2500Base-FX SMF SFP (30km)","price":289.0,"cat":"C1. SFP Transceivers"},{"pn":"506R61155","desc":"2500Base-FX MMF SFP (500m)","price":127.0,"cat":"C1. SFP Transceivers"},{"pn":"506R61213","desc":"100/1000Base-T SFP","price":103.0,"cat":"C1. SFP Transceivers"},{"pn":"506R61235","desc":"10G BASE-LR SFP+ (10km)","price":147.0,"cat":"C1. SFP Transceivers"},
{"pn":"503R60041","desc":"Service Dispatcher Unit (SDU-455G)","price":12645.0,"cat":"A4.2 SDU (Service Dispatch Units)"},
{"pn":"504R60060","desc":"Copper Loop 64-pair DIN, US Color Code, 25ft","price":237.0,"cat":"C4.1 DSL Cables"},
{"pn":"504R60062","desc":"Copper Loop 64-pair DIN, US Color Code, 100ft","price":657.0,"cat":"C4.1 DSL Cables"},
{"pn":"504R60063","desc":"Copper Loop 64-pair DIN, US Color Code, 150ft","price":733.0,"cat":"C4.1 DSL Cables"},
{"pn":"504R60088","desc":"Copper Loop 64-pair FCI, US Color Code, 100ft","price":449.0,"cat":"C4.1 DSL Cables"},
{"pn":"504R20140","desc":"DSL Quad Cable, 4xRJ-45, 100ft/30m","price":173.0,"cat":"C4.1 DSL Cables"},
{"pn":"504R20160","desc":"DSL Octal Cable, 8xRJ-45, 100ft/30m","price":230.0,"cat":"C4.1 DSL Cables"},
{"pn":"504R20180","desc":"DSL Octal Cable, 8xRJ-45, 150ft/50m","price":317.0,"cat":"C4.1 DSL Cables"},
{"pn":"504R20043","desc":"PWR/GND Harness 20ft/6m, 48VDC 18AWG","price":41.0,"cat":"C4.3 Power and Grounding cables"},
{"pn":"504R20047","desc":"PWR/GND Harness 20ft/6m, 48VDC 14AWG","price":41.0,"cat":"C4.3 Power and Grounding cables"},
{"pn":"504R20010","desc":"Craft i/f cable, DB-9 both ends, 12ft/3.6m","price":12.0,"cat":"C4.2 Service, Alarm, Clock and Misc. cables"},
{"pn":"504R20060","desc":"Alarm Cable 50ft/15m, 24AWG, DB-15 one end","price":41.0,"cat":"C4.2 Service, Alarm, Clock and Misc. cables"},
{"pn":"503R20270","desc":"Streaker Card for ML2300 and ML230","price":2300.0,"cat":"A4.5 CHS-2000 Related Items"},
{"pn":"506R30060","desc":"Fan Control Module for CHS-200 (FCM-200)","price":633.0,"cat":"A4.4 CHS-200 Related Items"},
{"pn":"506R61254","desc":"GL5010-10J2F","price":1185.0,"cat":"A5.1 Fiber DIN Rail L2 Switches"},
{"pn":"506R61252","desc":"GL5010-8J2F","price":1010.0,"cat":"A5.1 Fiber DIN Rail L2 Switches"},
{"pn":"506R62107","desc":"GL5010-8J2F-P (PoE)","price":1190.0,"cat":"A5.1 Fiber DIN Rail L2 Switches"},
{"pn":"506R61253","desc":"GL5010-8J4F","price":1222.0,"cat":"A5.1 Fiber DIN Rail L2 Switches"},
{"pn":"506R61255","desc":"GL5020-8J4F-P (PoE)","price":1580.0,"cat":"A5.1 Fiber DIN Rail L2 Switches"},
{"pn":"506R61256","desc":"GL5020X-8J4F-P (PoE)","price":2519.0,"cat":"A5.1 Fiber DIN Rail L2 Switches"},
{"pn":"506R61257","desc":"GL5030X-8J4F","price":1780.0,"cat":"A5.1 Fiber DIN Rail L2 Switches"},
{"pn":"506R61258","desc":"GL5030X-8J4F-P (PoE)","price":1940.0,"cat":"A5.1 Fiber DIN Rail L2 Switches"},
{"pn":"506R61261","desc":"GL5030X-8J4F-P1 (PoE)","price":2359.0,"cat":"A5.1 Fiber DIN Rail L2 Switches"},
{"pn":"506R61262","desc":"GL5030X-8J4F-P2 (PoE)","price":2260.0,"cat":"A5.1 Fiber DIN Rail L2 Switches"},
{"pn":"506R61309","desc":"GL5060-16J4F-P (PoE)","price":2593.0,"cat":"A5.1 Fiber DIN Rail L2 Switches"},
{"pn":"506R61264","desc":"GL5060X-16J4F","price":2296.0,"cat":"A5.1 Fiber DIN Rail L2 Switches"},
{"pn":"506R61265","desc":"GL5060X-16J4F-P (PoE)","price":2750.0,"cat":"A5.1 Fiber DIN Rail L2 Switches"},
{"pn":"506R61263","desc":"GL5070X-8J12F","price":2140.0,"cat":"A5.1 Fiber DIN Rail L2 Switches"},
{"pn":"506R62108","desc":"GL5080X-4J12F","price":4576.0,"cat":"A5.1 Fiber DIN Rail L2 Switches"},
{"pn":"506R62011","desc":"ML5114D","price":1470.0,"cat":"A5.1 Fiber DIN Rail L2 Switches"},
{"pn":"506R62012","desc":"ML5114DP","price":1499.0,"cat":"A5.1 Fiber DIN Rail L2 Switches"},
{"pn":"506R61296","desc":"GL5010R-8J2F","price":1640.0,"cat":"A5.2 Fiber DIN Rail L3 Switches"},
{"pn":"506R62106","desc":"GL5020R-8J4F-P (PoE)","price":2659.0,"cat":"A5.2 Fiber DIN Rail L3 Switches"},
{"pn":"506R61259","desc":"GL5030XR-8J4F","price":2550.0,"cat":"A5.2 Fiber DIN Rail L3 Switches"},
{"pn":"506R61260","desc":"GL5030XR-8J4F-P (PoE)","price":3113.0,"cat":"A5.2 Fiber DIN Rail L3 Switches"},
{"pn":"506R61306","desc":"GL5030XR-8J4F-P1 (PoE)","price":3230.0,"cat":"A5.2 Fiber DIN Rail L3 Switches"},
{"pn":"506R61267","desc":"GL5060XR-16J4F","price":3111.0,"cat":"A5.2 Fiber DIN Rail L3 Switches"},
{"pn":"506R61268","desc":"GL5060XR-16J4F-P (PoE)","price":3520.0,"cat":"A5.2 Fiber DIN Rail L3 Switches"},
{"pn":"506R61295","desc":"GL5070XR-8J12F","price":3150.0,"cat":"A5.2 Fiber DIN Rail L3 Switches"},
{"pn":"506R61270","desc":"GL5080XR-4J12F","price":5050.0,"cat":"A5.2 Fiber DIN Rail L3 Switches"},
{"pn":"506R61286","desc":"GL6010X-24J4F-DC","price":2750.0,"cat":"A5.3 Fiber Rackmount L2 Switches"},
{"pn":"506R61287","desc":"GL6010X-24J4F-AC","price":2950.0,"cat":"A5.3 Fiber Rackmount L2 Switches"},
{"pn":"506R61271","desc":"GL6010X-24J4F-P-DC (PoE)","price":3520.0,"cat":"A5.3 Fiber Rackmount L2 Switches"},
{"pn":"506R61272","desc":"GL6010X-24J4F-P-AC (PoE)","price":3720.0,"cat":"A5.3 Fiber Rackmount L2 Switches"},
{"pn":"506R61277","desc":"GL6020-16J12FC-DC","price":3789.0,"cat":"A5.3 Fiber Rackmount L2 Switches"},
{"pn":"506R61278","desc":"GL6020-16J12FC-AC","price":4009.0,"cat":"A5.3 Fiber Rackmount L2 Switches"},
{"pn":"506R61283","desc":"GL6030-24J4F-P-DC (PoE)","price":3190.0,"cat":"A5.3 Fiber Rackmount L2 Switches"},
{"pn":"506R61284","desc":"GL6030-24J4F-P-AC (PoE)","price":3330.0,"cat":"A5.3 Fiber Rackmount L2 Switches"},
{"pn":"506R61280","desc":"GL6031-16J12FC-DC","price":2630.0,"cat":"A5.3 Fiber Rackmount L2 Switches"},
{"pn":"506R61281","desc":"GL6031-16J12FC-AC","price":2950.0,"cat":"A5.3 Fiber Rackmount L2 Switches"},
{"pn":"506R61289","desc":"GL6040X-8J28F-DC","price":3999.0,"cat":"A5.3 Fiber Rackmount L2 Switches"},
{"pn":"506R61290","desc":"GL6040X-8J28F-AC","price":4320.0,"cat":"A5.3 Fiber Rackmount L2 Switches"},
{"pn":"501RG0530","desc":"ML530","price":920.0,"cat":"A5.3 Fiber Rackmount L2 Switches"},
{"pn":"501RG0252","desc":"ML540E","price":2295.0,"cat":"A5.3 Fiber Rackmount L2 Switches"},
{"pn":"506R62016","desc":"ML540M DC","price":1460.0,"cat":"A5.3 Fiber Rackmount L2 Switches"},
{"pn":"506R62006","desc":"ML540M AC","price":1680.0,"cat":"A5.3 Fiber Rackmount L2 Switches"},
{"pn":"506R61274","desc":"GL6010XR-24J4F-P-DC (PoE)","price":4520.0,"cat":"A5.4 Fiber Rackmount L3 Switches"},
{"pn":"506R61275","desc":"GL6010XR-24J4F-P-AC (PoE)","price":4850.0,"cat":"A5.4 Fiber Rackmount L3 Switches"},
{"pn":"506R61292","desc":"GL6040XR-8J28F-DC","price":4810.0,"cat":"A5.4 Fiber Rackmount L3 Switches"},
{"pn":"506R61293","desc":"GL6040XR-8J28F-AC","price":5130.0,"cat":"A5.4 Fiber Rackmount L3 Switches"},
{"pn":"506R61332","desc":"GL7006-4J2F-P (PoE, In-Pole)","price":2800.0,"cat":"A5.5 Fiber In-Pole L2 Switches"},
{"pn":"506R61329","desc":"GL7010-6J4F-P (PoE, In-Pole)","price":3050.0,"cat":"A5.5 Fiber In-Pole L2 Switches"},
{"pn":"506R61330","desc":"GL7020-6J4F-P (PoE, In-Pole)","price":3328.0,"cat":"A5.5 Fiber In-Pole L2 Switches"},
{"pn":"506R61331","desc":"GL7030-6J4F-P (PoE, In-Pole)","price":3790.0,"cat":"A5.5 Fiber In-Pole L2 Switches"},
{"pn":"501RG0252","desc":"ML540E","price":2295.0,"cat":"A5.3 Fiber Rackmount L2 Switches"}];

const DISCOUNTS = [{"cat":"A1.1 GL800 Solutions","naReseller":0.33,"naEndUser":0.33,"regBonus":0.07,"emeaReseller":0.4,"emeaEndUser":0.3},{"cat":"A1.2 GL9000 Headend Solutions","naReseller":0.33,"naEndUser":0.33,"regBonus":0.07,"emeaReseller":0.15,"emeaEndUser":0.1},{"cat":"A1.3 GL9000 CPEs","naReseller":0.1,"naEndUser":0.05,"regBonus":0.0,"emeaReseller":0.1,"emeaEndUser":0.05},{"cat":"A1.4 GL900 Headend Solutions","naReseller":0.33,"naEndUser":0.33,"regBonus":0.07,"emeaReseller":0.15,"emeaEndUser":0.1},{"cat":"A1.5 GL900 CPEs","naReseller":0.1,"naEndUser":0.05,"regBonus":0.0,"emeaReseller":0.1,"emeaEndUser":0.05},{"cat":"A2. ML600 Family","naReseller":0.33,"naEndUser":0.33,"regBonus":0.07,"emeaReseller":0.4,"emeaEndUser":0.3},{"cat":"A2.1 ML600D Family","naReseller":0.33,"naEndUser":0.33,"regBonus":0.07,"emeaReseller":0.4,"emeaEndUser":0.3},{"cat":"A3.1 Power Supplies for GL800/GL900/ML500/ML600/ML700","naReseller":0.33,"naEndUser":0.33,"regBonus":0.07,"emeaReseller":0.4,"emeaEndUser":0.3},{"cat":"A3.2 GL800/GL900ML500/ML600/ML700 Related Items","naReseller":0.33,"naEndUser":0.33,"regBonus":0.07,"emeaReseller":0.4,"emeaEndUser":0.3},{"cat":"A4.1 Shelves","naReseller":0.33,"naEndUser":0.33,"regBonus":0.07,"emeaReseller":0.4,"emeaEndUser":0.3},{"cat":"A4.2 SDU (Service Dispatch Units)","naReseller":0.33,"naEndUser":0.33,"regBonus":0.07,"emeaReseller":0.4,"emeaEndUser":0.3},{"cat":"A4.3 MLU (Multiport Line Units)","naReseller":0.33,"naEndUser":0.33,"regBonus":0.07,"emeaReseller":0.4,"emeaEndUser":0.3},{"cat":"A4.4 CHS-200 Related Items","naReseller":0.33,"naEndUser":0.33,"regBonus":0.07,"emeaReseller":0.4,"emeaEndUser":0.3},{"cat":"A4.5 CHS-2000 Related Items","naReseller":0.33,"naEndUser":0.33,"regBonus":0.07,"emeaReseller":0.4,"emeaEndUser":0.3},{"cat":"C1. SFP Transceivers","naReseller":0.1,"naEndUser":0.0,"regBonus":0.0,"emeaReseller":0.1,"emeaEndUser":0.0},{"cat":"C4.1 DSL Cables","naReseller":0.1,"naEndUser":0.0,"regBonus":0.0,"emeaReseller":0.1,"emeaEndUser":0.0}];

const EMEA_IDS = [4,2,3];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const P  = pn => PRICE_LIST.find(p => p.pn === pn);
const $  = n  => n == null ? "—" : "$" + Number(n).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const PCT = n => (n * 100).toFixed(0) + "%";

function getDisc(cat, rid, ct, dr) {
  const d = DISCOUNTS.find(r => r.cat === cat);
  if (!d) return 0;
  const emea = EMEA_IDS.includes(rid), eu = ct === "End Customer";
  let v = emea ? (eu ? d.emeaEndUser : d.emeaReseller) : (eu ? d.naEndUser : d.naReseller);
  if (!emea && dr) v = Math.min(v + (d.regBonus || 0), 1);
  return v;
}

function makeLines(bomItems, rid, ct, dr, replacements) {
  const repl = replacements || {};
  return bomItems.map(item => {
    // Apply PN replacement if one exists for this item
    const newPn = repl[item.pn];
    const newItem = newPn
      ? (PRICE_LIST.find(p=>p.pn===newPn) || item)
      : item;
    return {
      ...newItem,
      qty:       item.qty,     // preserve original qty
      listPrice: newItem.price || 0,
      discount:  getDisc(newItem.cat, rid, ct, dr),
    };
  });
}

// ─── SFP options ──────────────────────────────────────────────────────────────
const SFP_OPTIONS = [
  { pn: "506R00002",  desc: "1000Base-LX SMF (10km)" },
  { pn: "506R00012",  desc: "1000Base-SX MMF (500m)" },
  { pn: "506R00022",  desc: "100Base-FX MMF (2km)" },
  { pn: "506R00032",  desc: "100Base-FX SMF (15km)" },
  { pn: "506R00042",  desc: "1000Base-T SFP" },
  { pn: "506R61154",  desc: "2500Base-FX SMF (30km)" },
  { pn: "506R61155",  desc: "2500Base-FX MMF (500m)" },
  { pn: "506R61213",  desc: "100/1000Base-T SFP" },
  { pn: "506R61235",  desc: "10G BASE-LR SFP+ (10km)" },
];

// ─── Deployment type definitions ──────────────────────────────────────────────
const DEPLOY_TYPES = [
  { key: "PTP_ML600",  icon: "⇌", label: "PTP — ML600",        desc: "Point-to-point. Choose any ML600 model and quantity. Can be 1 unit (single end) or paired CO+CPE." },
  { key: "PTMP_GL800", icon: "⚡", label: "PTMP — GL800",       desc: "GL830 or GL850L headend with up to 16 GL800 remote CPE units." },
  { key: "PTMP_GL900", icon: "📡", label: "PTMP — GL900",       desc: "GL904/GL908/GL916 headend with GL91/GL91T/GL92 CPE endpoints." },
  { key: "PTMP_GL9000",icon: "🌐", label: "PTMP — GL9000",      desc: "GL9110C or GL9104C headend with GL93C CPEs. G.hn wave 2 over coax." },
  { key: "PTMP_ML230", icon: "🏗", label: "ML230 / ML2300",     desc: "Chassis platform. Pick chassis, SDU, MLU cards, cables and accessories individually or use a pre-built bundle." },
  { key: "SWITCH_FIBER",icon:"🔀", label: "Fiber Switches",     desc: "GL5000 DIN Rail, GL6000 Rackmount, GL7000 In-Pole, ML5114, ML530/540 — single-unit fiber switch deployment." },
];

// ─── WIZARD COMPONENT ─────────────────────────────────────────────────────────
function NodeWizard({ region, custType, dealReg, replacements, onAddLines, onClose }) {
  const [type, setType]   = useState(null);
  const [step, setStep]   = useState(0);

  // Shared selection state
  const [sel, setSel] = useState({
    siteName:    "",
    // PTP ML600
    ptpMode:     "pair",      // "pair" | "single"
    unitPn:      null,
    coQty:       1,
    cpeQty:      1,
    ptpSfpPn:    null,
    ptpSfpQty:   2,
    ptpCablePn:  null,   // ML600 copper/DSL cable
    ptpCableQty: 1,
    ptpAcc:      {},
    // GL800 / GL900 / GL9000
    headendPn:   null,
    headendQty:  1,
    cpePn:       null,
    remoteCpeQty:1,
    glSfpPn:     null,
    glAcc:       {},
    // ML230 / ML2300
    ml230mode:        "custom",  // "bundle" | "custom"
    bundlePn:         null,
    bundleQty:        1,
    chassisPn:        null,
    sduPn:            null,
    sduQty:           1,
    sduRedundancy:    false,     // adds 2nd SDU
    mluPn:            null,
    mluQty:           1,
    nodeCount:        1,         // multiply entire chassis BOM
    // MLU copper cables
    mluCableInclude:  false,
    mluCableColor:    "US",      // "US" | "EU"
    mluCableDistance: "100ft",   // "25ft" | "100ft" | "150ft"
    // CHS-200 DSL cables (RJ-45)
    chs200CableInclude: false,
    chs200CablePn:    null,
    chs200CableQty:   8,
    // Uplink SFP
    ml230SfpPn:       null,
    ml230SfpQty:      2,
    // Accessories
    dcPowerCable:     false,     // PWR/GND harness
    dcPowerGauge:     "18AWG",   // "18AWG" | "14AWG"
    craftCable:       false,     // 504R20010
    alarmCableLen:    "none",    // "none" | "50ft"
    flashCard:        false,     // 550A00046
    fanModule:        false,     // 506R30070 (CHS-2000B) or 506R30060 (CHS-200)
    chs200AccKit:     false,     // 510K20230
    streaker:         false,     // 503R20270
    gl9000CardQty: 1,     // GL901CS subscriber card quantity
    // Fiber Switches
    swFamily:    null,   // "dinrail_l2"|"dinrail_l3"|"rack_l2"|"rack_l3"|"inpole"
    swPn:        null,
    swQty:       1,
    swSfpPn:     null,
    swSfpQty:    2,
    swPsuInclude:false,
    swPsuPn:     null,
    swRackKit:   false,
    swWallKit:   false,
    swAccKit:    false,
  });

  const set = (k, v) => setSel(prev => ({ ...prev, [k]: v }));
  const setAcc = (key, pn, v) => setSel(prev => ({ ...prev, [key]: { ...prev[key], [pn]: v } }));

  const isNA = !EMEA_IDS.includes(region?.id || 6);
  const rid  = region?.id || 6;

  // ── BOM builder ─────────────────────────────────────────────────────────────
  const bom = useMemo(() => {
    if (!type) return [];
    const items = [];

    if (type === "PTP_ML600") {
      const unit = P(sel.unitPn);
      if (unit) {
        if (sel.ptpMode === "pair") {
          items.push({ ...unit, desc: unit.desc + " — CO end",  qty: sel.coQty });
          items.push({ ...unit, desc: unit.desc + " — CPE end", qty: sel.cpeQty });
        } else {
          items.push({ ...unit, qty: sel.coQty });
        }
      }
      if (sel.ptpSfpPn) {
        const sfp = P(sel.ptpSfpPn);
        if (sfp) items.push({ ...sfp, qty: sel.ptpSfpQty });
      }
      // Copper/DSL cables
      if (sel.ptpCablePn) {
        const cable = P(sel.ptpCablePn);
        if (cable) {
          const ML600_PAIRS={"501RG0218":16,"510KG0065":16,"501RG0238":16,"501RG0115":16,"501RG0111":16,"501RG0254":16};
          const needs2 = ML600_PAIRS[sel.unitPn]===16;
          const cableQty = needs2 ? Math.max(2, sel.ptpCableQty) : sel.ptpCableQty;
          items.push({ ...cable, qty: cableQty });
        }
      }
      // Power supplies
      const psNA = "506R00006", psEU = "506R00006E";
      if (sel.ptpAcc[psNA] || sel.ptpAcc[psEU]) {
        const psPn = isNA ? psNA : psEU;
        const ps = P(psPn);
        const totalUnits = sel.ptpMode === "pair" ? sel.coQty + sel.cpeQty : sel.coQty;
        if (ps) items.push({ ...ps, qty: totalUnits });
      }
      Object.entries(sel.ptpAcc).forEach(([pn, on]) => {
        if (!on || pn === psNA || pn === psEU) return;
        const prod = P(pn);
        if (prod) {
          const totalUnits = sel.ptpMode === "pair" ? sel.coQty + sel.cpeQty : sel.coQty;
          const qty = (pn === "510R21080" || pn === "510K00060") ? totalUnits : 1;
          items.push({ ...prod, qty });
        }
      });
    }

    else if (type === "PTMP_GL800" || type === "PTMP_GL900" || type === "PTMP_GL9000") {
      const hd = P(sel.headendPn);
      if (hd) items.push({ ...hd, qty: sel.headendQty });
      const cpe = P(sel.cpePn);
      if (cpe) items.push({ ...cpe, qty: sel.remoteCpeQty });
      if (sel.glSfpPn) {
        const sfp = P(sel.glSfpPn);
        if (sfp) items.push({ ...sfp, qty: sel.headendQty });
      }
      // Power supplies (GL9000 has built-in PSU — skip)
      if (type !== "PTMP_GL9000") {
        const psuNA = type === "PTMP_GL800" ? "506R00013"  : "506R00008";
        const psuEU = type === "PTMP_GL800" ? "506R00013E" : "506R00008U";
        if (sel.glAcc[psuNA] || sel.glAcc[psuEU]) {
          const psPn = isNA ? psuNA : psuEU;
          const ps = P(psPn);
          if (ps) items.push({ ...ps, qty: sel.headendQty + sel.remoteCpeQty });
        }
      }
      // GL9000 subscriber line cards
      if (type === "PTMP_GL9000" && sel.glAcc["506R61335"]) {
        const card = P("506R61335");
        if (card) items.push({ ...card, qty: sel.gl9000CardQty || 1 });
      }
      // Remaining accessories
      const skipPsu = new Set(["506R00013","506R00013E","506R00008","506R00008U","506R61335"]);
      Object.entries(sel.glAcc).forEach(([pn, on]) => {
        if (!on || skipPsu.has(pn)) return;
        const prod = P(pn);
        if (prod) {
          const qty = pn === "510R21080" ? sel.headendQty + sel.remoteCpeQty : 1;
          items.push({ ...prod, qty });
        }
      });
    }

    else if (type === "PTMP_ML230") {
      const n = sel.nodeCount || 1;
      const isCHS2000 = sel.chassisPn === "502R02110";

      if (sel.ml230mode === "bundle") {
        const b = P(sel.bundlePn);
        if (b) items.push({ ...b, qty: sel.bundleQty });
      } else {
        // Chassis
        const chassis = P(sel.chassisPn);
        if (chassis) items.push({ ...chassis, qty: n });

        // SDU (qty-controlled: 1 for ML230/CHS-200, 1-2 for ML2300/CHS-2000B)
        const sdu = P(sel.sduPn);
        if (sdu) {
          items.push({ ...sdu, qty: (sel.sduQty ?? 1) * n });
        }

        // MLU
        const mlu = P(sel.mluPn);
        if (mlu) items.push({ ...mlu, qty: sel.mluQty * n });

        // MLU Copper Cables — CHS-2000B uses 64-pair DIN cables
        if (isCHS2000 && sel.mluCableInclude) {
          // Map color+distance to SKU
          const cableMap = {
            "US-25ft":  "504R60060",
            "US-100ft": "504R60062",
            "US-150ft": "504R60063",
            "EU-100ft": "504R60088", // FCI connector, US code (closest EU equiv)
            "EU-25ft":  "504R60060", // fallback
            "EU-150ft": "504R60063", // fallback
          };
          const cableKey = `${sel.mluCableColor}-${sel.mluCableDistance}`;
          const cablePn = cableMap[cableKey] || "504R60062";
          const cableProd = P(cablePn);
          if (cableProd) items.push({ ...cableProd, qty: sel.mluQty * n });
        }

        // CHS-200 DSL cables (RJ-45 based)
        if (!isCHS2000 && sel.chs200CableInclude && sel.chs200CablePn) {
          const cableProd = P(sel.chs200CablePn);
          if (cableProd) items.push({ ...cableProd, qty: sel.chs200CableQty * n });
        }

        // Uplink SFP
        if (sel.ml230SfpPn) {
          const sfp = P(sel.ml230SfpPn);
          if (sfp) items.push({ ...sfp, qty: sel.ml230SfpQty * n });
        }

        // DC Power Cable
        if (sel.dcPowerCable) {
          const dcPn = sel.dcPowerGauge === "14AWG" ? "504R20047" : "504R20043";
          const dc = P(dcPn);
          if (dc) items.push({ ...dc, qty: n });
        }

        // Craft cable
        if (sel.craftCable) {
          const cc = P("504R20010");
          if (cc) items.push({ ...cc, qty: n });
        }

        // Alarm cable
        if (sel.alarmCableLen === "50ft") {
          const al = P("504R20060");
          if (al) items.push({ ...al, qty: n });
        }

        // Flash card
        if (sel.flashCard) {
          const fc = P("550A00046");
          if (fc) items.push({ ...fc, qty: n });
        }

        // Fan module
        if (sel.fanModule) {
          const fanPn = isCHS2000 ? "506R30070" : "506R30060";
          const fan = P(fanPn);
          if (fan) items.push({ ...fan, qty: n });
        }

        // CHS-200 accessories kit
        if (!isCHS2000 && sel.chs200AccKit) {
          const ak = P("510K20230");
          if (ak) items.push({ ...ak, qty: n });
        }

        // Streaker card
        if (sel.streaker) {
          const str = P("503R20270");
          if (str) items.push({ ...str, qty: n });
        }
      }
    }

    else if (type === "SWITCH_FIBER") {
      const sw = P(sel.swPn);
      if (sw) items.push({ ...sw, qty: sel.swQty });
      if (sel.swSfpPn) {
        const sfp = P(sel.swSfpPn);
        if (sfp) items.push({ ...sfp, qty: sel.swSfpQty * sel.swQty });
      }
      if (sel.swPsuInclude && sel.swPsuPn) {
        const psu = P(sel.swPsuPn);
        if (psu) items.push({ ...psu, qty: sel.swQty });
      }
      if (sel.swRackKit) {
        const rk = P("510R21070");
        if (rk) items.push({ ...rk, qty: Math.ceil(sel.swQty / 2) });
      }
      if (sel.swWallKit) {
        const wk = P("510R21080");
        if (wk) items.push({ ...wk, qty: sel.swQty });
      }
      if (sel.swAccKit) {
        const ak = P("510K00060");
        if (ak) items.push({ ...ak, qty: sel.swQty });
      }
    }

    return items;
  }, [sel, type, isNA]);

  const bomLines  = useMemo(() => makeLines(bom, rid, custType, dealReg, replacements), [bom, rid, custType, dealReg, replacements]);
  const bomTotal  = bomLines.reduce((s, l) => s + l.price * l.qty * (1 - l.discount), 0);
  const bomList   = bomLines.reduce((s, l) => s + l.price * l.qty, 0);

  const N = "#0B1D3A", A = "#D97706";

  // ── Step counts per type ─────────────────────────────────────────────────────
  const STEP_LABELS = {
    PTP_ML600:   ["Type","Unit","Qty & Mode","SFPs","Cables","Accessories","Review"],
    PTMP_GL800:  ["Type","Headend","CPEs","SFPs","Accessories","Review"],
    PTMP_GL900:  ["Type","Headend","CPEs","SFPs","Accessories","Review"],
    PTMP_GL9000: ["Type","Headend","CPEs","SFPs","Accessories","Review"],
    PTMP_ML230:    ["Type","Mode","Components","Cables & SFPs","Accessories","Review"],
    SWITCH_FIBER:  ["Type","Family & Model","SFPs","Power & Accessories","Review"],
  };
  const steps = type ? (STEP_LABELS[type] || []) : ["Type"];

  const canNext = () => {
    if (step === 0) return !!type;
    if (type === "PTP_ML600") {
      if (step === 1) return !!sel.unitPn;
    }
    if (type === "PTMP_GL800" || type === "PTMP_GL900" || type === "PTMP_GL9000") {
      if (step === 1) return !!sel.headendPn;
      if (step === 2) return !!sel.cpePn;
    }
    if (type === "PTMP_ML230") {
      if (step === 2) {
        if (sel.ml230mode === "bundle") return !!sel.bundlePn;
        return !!sel.chassisPn && !!sel.sduPn && !!sel.mluPn;
      }
    }
    if (type === "SWITCH_FIBER") {
      if (step === 1) return !!sel.swPn;
    }
    return true;
  };

  const handleAdd = () => {
    const lines = bomLines.map(l => ({
      pn: l.pn, desc: l.desc, cat: l.cat, qty: l.qty,
      listPrice: l.price, discount: l.discount, site: sel.siteName,
    }));
    onAddLines(lines);
    onClose();
  };

  const goNext = () => setStep(s => s + 1);
  const goBack = () => { if (step <= 1) { setType(null); setStep(0); } else setStep(s => s - 1); };

  // ── Sub-components ──────────────────────────────────────────────────────────
  const ML600_STD  = ["501RG0016","501RG0046","501RG0067","501RG0076","501RG0077","501RG0078","501RG0106","501RG0111","501RG0115","501RG0116","501RG0121","501RG0122","501RG0217","501RG0218","501RG0238","501RG0253","501RG0254","501RG0259"];
  const ML600D     = ["501RG3230","501RG3231","501RG3240","501RG0232","501RG3255","501RG3256","501RG3355","501RG3356","501RG3358","501RG3376","501RG3378"];
  // GL800: -O suffix = CO/Aggregation headend (SFP uplink), -R suffix = Remote CPE (RJ-45 uplink)
  // CPEs are matched by port count of the selected headend
  const GL800_HDS  = [
    { label:"GL830-8O  · 8-port CO",    pn:"501RG0140", ports:8  },
    { label:"GL830-16O · 16-port CO",   pn:"501RG0139", ports:16 },
    { label:"GL850L-16O · 16-port CO",  pn:"501RG0134", ports:16 },
  ];
  const GL800_CPES_BY_PORTS = {
    8:  ["501RG0144"],               // GL830-8R
    16: ["501RG0143","501RG0135"],   // GL830-16R, GL850L-16R
  };
  const gl800Ports = GL800_HDS.find(h=>h.pn===sel.headendPn)?.ports ?? 16;
  const GL800_CPES = GL800_CPES_BY_PORTS[gl800Ports] ?? ["501RG0143","501RG0135"];
  const GL900_HDS  = ["501RG0167","501RG0168","501RG0303","501RG0301","501RG0302","501RG0300"];
  const GL900_CPES = ["506R61245","501S61245E","501S61245U","501S61246","501S61246E","501S61247"];
  const GL9000_HDS = ["506R61334","506R61342"];  // GL9110C, GL9104C only — GL901CS is a subscriber card add-on
  const GL9000_CPES= ["506R61337","506R61336"];

  const ML230_BUNDLES = [
    // ML230 (CHS-200)
    { pn:"501S20442", label:"ML230: CHS-200 + SDU-450  + MLU-32DF" },
    { pn:"501S20443", label:"ML230: CHS-200 + SDU-450  + MLU-32DR" },
    { pn:"501S20441", label:"ML230: CHS-200 + SDU-450  + MLU-64DF" },
    { pn:"501S20436", label:"ML230: CHS-200 + SDU-450  + MLU-64DR" },
    { pn:"501S20445", label:"ML230: CHS-200 + SDU-450G + MLU-32DF" },
    { pn:"501S20446", label:"ML230: CHS-200 + SDU-450G + MLU-32DR" },
    { pn:"501S20444", label:"ML230: CHS-200 + SDU-450G + MLU-64DF" },
    { pn:"501S20456", label:"ML230: CHS-200 + SDU-450G + MLU-64DR" },
    // ML2300 (CHS-2000B)
    { pn:"501S20448", label:"ML2300: CHS-2000B + SDU-450  + MLU-32DF" },
    { pn:"501S20449", label:"ML2300: CHS-2000B + SDU-450  + MLU-32DR" },
    { pn:"501S20447", label:"ML2300: CHS-2000B + SDU-450  + MLU-64DF" },
    { pn:"501S20435", label:"ML2300: CHS-2000B + SDU-450  + MLU-64DR" },
    { pn:"501S20451", label:"ML2300: CHS-2000B + SDU-450G + MLU-32DF" },
    { pn:"501S20452", label:"ML2300: CHS-2000B + SDU-450G + MLU-32DR" },
    { pn:"501S20450", label:"ML2300: CHS-2000B + SDU-450G + MLU-64DF" },
    { pn:"501S20455", label:"ML2300: CHS-2000B + SDU-450G + MLU-64DR" },
  ];

  return (
    <div style={{ position:"fixed", inset:0, zIndex:1000, background:"rgba(11,29,58,0.7)", display:"flex", alignItems:"center", justifyContent:"center", backdropFilter:"blur(3px)" }}>
      <div style={{ background:"white", borderRadius:14, width:"min(740px,95vw)", maxHeight:"90vh", overflow:"hidden", display:"flex", flexDirection:"column", boxShadow:"0 24px 80px rgba(0,0,0,0.35)" }}>

        {/* Header */}
        <div style={{ background:N, padding:"16px 20px", display:"flex", alignItems:"center", justifyContent:"space-between", flexShrink:0 }}>
          <div>
            <div style={{ color:A, fontWeight:800, fontSize:13, letterSpacing:"0.06em" }}>⚡ NODE CONFIGURATOR</div>
            {type && <div style={{ color:"#94A3B8", fontSize:11, marginTop:2 }}>{DEPLOY_TYPES.find(d=>d.key===type)?.label}</div>}
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            {/* Step progress */}
            {type && steps.map((s,i) => (
              <div key={s} style={{ display:"flex", alignItems:"center", gap:4 }}>
                <div style={{ width:20, height:20, borderRadius:"50%", background: i < step ? "#10B981" : i === step ? A : "#1E3A5F", display:"flex", alignItems:"center", justifyContent:"center", fontSize:9, fontWeight:700, color:"white" }}>{i < step ? "✓" : i+1}</div>
                {i < steps.length - 1 && <div style={{ width:12, height:1, background:"#1E3A5F" }} />}
              </div>
            ))}
            <button onClick={onClose} style={{ background:"none", border:"none", color:"#64748B", fontSize:22, cursor:"pointer", marginLeft:8 }}>×</button>
          </div>
        </div>

        {/* Site name bar */}
        <div style={{ background:"#F8FAFC", borderBottom:"1px solid #E2E8F0", padding:"8px 20px", display:"flex", alignItems:"center", gap:10 }}>
          <span style={{ fontSize:12, color:"#64748B", fontWeight:600 }}>Site Label (optional):</span>
          <input value={sel.siteName} onChange={e=>set("siteName",e.target.value)}
            placeholder="e.g. Site A, Tower 3..."
            style={{ padding:"4px 8px", border:"1px solid #E2E8F0", borderRadius:5, fontSize:12, color:"#1A2035", outline:"none", width:180 }} />
        </div>

        {/* Content */}
        <div style={{ flex:1, overflowY:"auto", padding:20 }}>

          {/* ── STEP 0: Choose deployment type ── */}
          {step === 0 && (
            <div>
              <div style={{ fontWeight:700, fontSize:15, color:"#1A2035", marginBottom:4 }}>Select Deployment Type</div>
              <div style={{ fontSize:12, color:"#64748B", marginBottom:16 }}>Choose the network topology to configure.</div>
              <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                {DEPLOY_TYPES.map(d => (
                  <button key={d.key} onClick={()=>{ setType(d.key); setStep(1); setSel(prev=>({...prev, siteName:prev.siteName})); }}
                    style={{ textAlign:"left", padding:"12px 14px", borderRadius:8, border:`2px solid ${type===d.key?A:"#E2E8F0"}`, background:type===d.key?"#FFFBEB":"white", cursor:"pointer", display:"flex", alignItems:"center", gap:12 }}>
                    <span style={{ fontSize:20 }}>{d.icon}</span>
                    <div>
                      <div style={{ fontWeight:700, fontSize:13, color:"#1A2035" }}>{d.label}</div>
                      <div style={{ fontSize:11, color:"#64748B", marginTop:2 }}>{d.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── PTP ML600: Step 1 — Unit selection ── */}
          {step === 1 && type === "PTP_ML600" && (
            <div>
              <StepHeader title="Select ML600 Unit" sub="Choose the product model. Applies to both CO and CPE ends for PTP." />
              {[["ML600 Standard", ML600_STD], ["ML600D Series", ML600D]].map(([grp, pns]) => (
                <div key={grp} style={{ marginBottom:12 }}>
                  <div style={{ fontSize:11, fontWeight:700, color:"#64748B", textTransform:"uppercase", marginBottom:6 }}>{grp}</div>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:6 }}>
                    {pns.map(pn => <ProdBtn key={pn} pn={pn} selected={sel.unitPn} onSelect={pn=>set("unitPn",pn)} region={region} custType={custType} dealReg={dealReg} />)}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── PTP ML600: Step 2 — Qty & Mode ── */}
          {step === 2 && type === "PTP_ML600" && (
            <div>
              <StepHeader title="Quantity & Configuration Mode" sub="Choose how many units and whether to quote as a matched CO+CPE pair or individual units." />
              <div style={{ marginBottom:16 }}>
                <Label>Quoting Mode</Label>
                <div style={{ display:"flex", gap:8 }}>
                  {[["pair","PTP Pair (CO + CPE)","Quote matched CO and CPE ends. Same unit model for both."],["single","Single Unit","Quote units individually — useful for replacement parts or one-sided quotes."]].map(([v,l,d])=>(
                    <button key={v} onClick={()=>set("ptpMode",v)}
                      style={{ flex:1, padding:"10px 12px", borderRadius:8, border:`2px solid ${sel.ptpMode===v?A:"#E2E8F0"}`, background:sel.ptpMode===v?"#FFFBEB":"white", cursor:"pointer", textAlign:"left" }}>
                      <div style={{ fontWeight:700, fontSize:13, color:"#1A2035" }}>{l}</div>
                      <div style={{ fontSize:11, color:"#64748B", marginTop:2 }}>{d}</div>
                    </button>
                  ))}
                </div>
              </div>
              {sel.ptpMode === "pair" ? (
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                  <div>
                    <Label>CO End — Qty (sites)</Label>
                    <Counter v={sel.coQty} min={1} max={9999} set={v=>set("coQty",v)} />
                  </div>
                  <div>
                    <Label>CPE End — Qty (sites)</Label>
                    <Counter v={sel.cpeQty} min={1} max={9999} set={v=>set("cpeQty",v)} />
                  </div>
                </div>
              ) : (
                <div>
                  <Label>Quantity</Label>
                  <Counter v={sel.coQty} min={1} max={9999} set={v=>set("coQty",v)} />
                </div>
              )}
              {sel.unitPn && (
                <div style={{ marginTop:16, padding:"10px 14px", background:"#F8FAFC", borderRadius:8, fontSize:12, color:"#1A2035" }}>
                  <b>Selected:</b> {P(sel.unitPn)?.desc} ({sel.unitPn})
                  {sel.ptpMode === "pair"
                    ? <> — {sel.coQty} CO + {sel.cpeQty} CPE = <b>{sel.coQty + sel.cpeQty} units total</b></>
                    : <> — <b>{sel.coQty} units</b></>}
                </div>
              )}
            </div>
          )}

          {/* ── PTP ML600: Step 3 — SFPs ── */}
          {step === 3 && type === "PTP_ML600" && (
            <div>
              <StepHeader title="SFP Transceivers" sub="Optional. Select one SFP model and set the quantity needed." />
              <div style={{ marginBottom:12 }}>
                <button onClick={()=>set("ptpSfpPn",null)}
                  style={{ padding:"8px 14px", borderRadius:7, border:`2px solid ${!sel.ptpSfpPn?"#D97706":"#E2E8F0"}`, background:!sel.ptpSfpPn?"#FFFBEB":"white", cursor:"pointer", fontSize:13, fontWeight:600, color:"#1A2035" }}>
                  No SFP required
                </button>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:6, marginBottom:12 }}>
                {SFP_OPTIONS.map(s => (
                  <button key={s.pn} onClick={()=>set("ptpSfpPn",s.pn)}
                    style={{ textAlign:"left", padding:"8px 12px", borderRadius:7, border:`2px solid ${sel.ptpSfpPn===s.pn?A:"#E2E8F0"}`, background:sel.ptpSfpPn===s.pn?"#FFFBEB":"white", cursor:"pointer" }}>
                    <div style={{ fontSize:12, fontWeight:600, color:"#1A2035" }}>{s.desc}</div>
                    <div style={{ display:"flex", justifyContent:"space-between", marginTop:2 }}>
                      <code style={{ fontSize:10, color:"#94A3B8" }}>{s.pn}</code>
                      <span style={{ fontSize:11, fontWeight:700, color:N }}>{$(P(s.pn)?.price)}</span>
                    </div>
                  </button>
                ))}
              </div>
              {sel.ptpSfpPn && (
                <div style={{ marginTop:8 }}>
                  <Label>SFP Quantity</Label>
                  <Counter v={sel.ptpSfpQty} min={1} max={9999} set={v=>set("ptpSfpQty",v)} />
                  <div style={{ fontSize:11, color:"#64748B", marginTop:4 }}>Tip: 2 SFPs per PTP link (one each end)</div>
                </div>
              )}
            </div>
          )}

          {/* ── PTP ML600: Step 4 — Cables ── */}
          {step === 4 && type === "PTP_ML600" && (()=>{
            // ── Cable compatibility map derived from Access AutoRepeaterInfo NumPairs field ──
            // ML600 naming: ML6{pairs}{suffix}, e.g. ML622=2p, ML638=8p, ML6916=16p
            // Access SQL rule: NumPairs < 8  → Quad cables only
            //                  NumPairs >= 8 → Octal cables (NumPairs <> 4)
            //                  ML650SV       → fiber switch, no copper pairs
            const ML600_PAIRS = {
              // 2-pair units
              "501RG0016":2,"501RG0240":2,"501RG3240":2,"501RG0121":2,
              // 4-pair units
              "501RG0046":4,"510KG6241":4,"501RG0122":4,
              "501RG0216":4,"501RG0116":4,"501RG0076":4,
              "501RG0220":4,"501RG3230":4,"501RG3255":4,
              "501RG3355":4,"501RG3358":4,"501RG0232":4,"501RG0106":4,
              // 8-pair units
              "501RG0067":8,"510KG6381":8,"501S20394":8,
              "501RG0217":8,"510KG0064":8,
              "501RG0077":8,"501RG0477":8,
              "501RG3275":8,"501RG0221":8,"501RG3231":8,"501RG0236":8,
              "501RG3375":8,"501RG3378":8,
              "501RG0259":8,"501RG0253":8,
              // 16-pair units (need 2× octal cables)
              "501RG0218":16,"510KG0065":16,
              "501RG0238":16,"501RG0115":16,"501RG0111":16,"501RG0254":16,
              // fiber/special — no copper pairs
              "501RG0078":0,
            };

            const ALL_CABLES = {
              quad: [
                { pn:"504R20110", label:"Quad DSL · 4×RJ-45 · 10ft / 3m",   hint:"covers 4 pairs" },
                { pn:"504R20140", label:"Quad DSL · 4×RJ-45 · 100ft / 30m", hint:"covers 4 pairs" },
              ],
              octal: [
                { pn:"504R20120", label:"Octal DSL · 8×RJ-45 · 10ft / 3m",   hint:"covers 8 pairs" },
                { pn:"504R20160", label:"Octal DSL · 8×RJ-45 · 100ft / 30m", hint:"covers 8 pairs" },
                { pn:"504R20180", label:"Octal DSL · 8×RJ-45 · 150ft / 50m", hint:"covers 8 pairs" },
              ],
            };

            const numPairs  = ML600_PAIRS[sel.unitPn] ?? null;
            const isFiber   = numPairs === 0;
            const isSmall   = numPairs !== null && numPairs < 8;   // 2 or 4 pair → quad only
            const isLarge   = numPairs !== null && numPairs >= 8;  // 8 or 16 pair → octal
            const needsTwo  = numPairs === 16;                     // 16p → 2 octal cables

            const availCables = isFiber ? [] : isSmall ? ALL_CABLES.quad : isLarge ? ALL_CABLES.octal : [...ALL_CABLES.quad, ...ALL_CABLES.octal];

            // Auto-clear invalid selection when unit changes
            const cableValid = !sel.ptpCablePn || availCables.some(c=>c.pn===sel.ptpCablePn);

            return(
              <div>
                <StepHeader
                  title="Copper / DSL Cables"
                  sub={
                    isFiber   ? "ML650SV is a fiber-only unit — no copper cables apply." :
                    numPairs  ? `${sel.unitPn ? P(sel.unitPn)?.desc : ""} has ${numPairs} copper pairs — showing compatible cables only.` :
                    "Select cables for the copper interface. Choose unit first to filter compatible options."
                  }
                />

                {isFiber ? (
                  <div style={{padding:"14px",background:"#F0F9FF",borderRadius:8,border:"1px solid #BAE6FD",color:"#0369A1",fontSize:12}}>
                    ℹ️ ML650SV is a fiber switch — it connects via SFP only. No copper cables needed.
                  </div>
                ) : (
                  <>
                    {numPairs && (
                      <div style={{marginBottom:10,padding:"8px 12px",background:isSmall?"#FFF7ED":"#F0FDF4",borderRadius:6,border:`1px solid ${isSmall?"#FED7AA":"#BBF7D0"}`,fontSize:11,color:isSmall?"#92400E":"#166534",fontWeight:600}}>
                        {isSmall
                          ? `⚠ ${numPairs}-pair unit — Quad cables only (4×RJ-45 connector)`
                          : needsTwo
                          ? `ℹ 16-pair unit — requires 2× Octal cables (one per 8 pairs)`
                          : `✓ 8-pair unit — Octal cables (8×RJ-45 connector)`}
                      </div>
                    )}

                    <div style={{marginBottom:10}}>
                      <button onClick={()=>set("ptpCablePn",null)}
                        style={{padding:"7px 14px",borderRadius:7,border:`2px solid ${!sel.ptpCablePn?"#E8600A":"#E2E8F0"}`,background:!sel.ptpCablePn?"#FFF7F5":"white",cursor:"pointer",fontSize:12,fontWeight:600,color:"#1A2035"}}>
                        No cable required
                      </button>
                    </div>

                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6,marginBottom:12}}>
                      {availCables.map(opt=>(
                        <button key={opt.pn} onClick={()=>set("ptpCablePn",opt.pn)}
                          style={{textAlign:"left",padding:"9px 11px",borderRadius:7,border:`2px solid ${sel.ptpCablePn===opt.pn?A:"#E2E8F0"}`,background:sel.ptpCablePn===opt.pn?"#FFF7F5":"white",cursor:"pointer"}}>
                          <div style={{fontSize:12,fontWeight:600,color:"#1A2035"}}>{opt.label}</div>
                          <div style={{display:"flex",justifyContent:"space-between",marginTop:3,alignItems:"center"}}>
                            <code style={{fontSize:10,color:"#94A3B8"}}>{opt.pn}</code>
                            <div style={{textAlign:"right"}}>
                              <span style={{fontSize:11,fontWeight:700,color:N}}>{$(P(opt.pn)?.price)}</span>
                              <span style={{fontSize:9,color:"#94A3B8",marginLeft:4}}>{opt.hint}</span>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>

                    {sel.ptpCablePn && cableValid && (
                      <div>
                        <Label>{needsTwo?"Cable Quantity (min 2 for 16-pair unit)":"Cable Quantity"}</Label>
                        <Counter v={sel.ptpCableQty} min={needsTwo?2:1} max={9999} set={v=>set("ptpCableQty",v)} />
                        {needsTwo && sel.ptpCableQty < 2 &&
                          <div style={{fontSize:11,color:"#EF4444",marginTop:4}}>⚠ 16-pair unit needs at least 2 octal cables (1 per 8 pairs)</div>
                        }
                      </div>
                    )}
                    {sel.ptpCablePn && !cableValid && (
                      <div style={{padding:"8px 12px",background:"#FEF2F2",borderRadius:6,border:"1px solid #FECACA",fontSize:11,color:"#B91C1C"}}>
                        ⚠ Previously selected cable is not compatible with this unit. Please choose again.
                      </div>
                    )}
                  </>
                )}
              </div>
            );
          })()}

          {/* ── PTP ML600: Step 5 — Accessories ── */}
          {step === 5 && type === "PTP_ML600" && (
            <div>
              <StepHeader title="Accessories" sub="Optional add-ons. Power supplies qty is automatically set per unit count." />
              {[
                { pn: isNA?"506R00006":"506R00006E", label:`AC-DC Power Supply (${isNA?"NA":"EU"})`, hint:"1 per unit" },
                { pn: "510K00060", label:"Accessories Kit for ML600/ML530", hint:"1 per unit" },
                { pn: "510R21080", label:"Wall Mount Kit", hint:"1 per unit" },
                { pn: "510R21070", label:"Rack Mount Sleeve Kit (2 units)", hint:"1 per 2 units" },
              ].map(acc => (
                <AccRow key={acc.pn} pn={acc.pn} label={acc.label} hint={acc.hint}
                  checked={!!sel.ptpAcc[acc.pn]} onChange={v=>setAcc("ptpAcc",acc.pn,v)} />
              ))}
            </div>
          )}

          {/* ── GL800: Step 1 — Headend (CO unit) ── */}
          {step === 1 && type === "PTMP_GL800" && (
            <div>
              <StepHeader title="Select GL800 CO / Headend"
                sub="Select the CO aggregation unit (-O suffix = SFP uplink). The matching Remote CPE (-R) will be shown next." />
              <div style={{ display:"grid", gridTemplateColumns:"1fr", gap:6, marginBottom:12 }}>
                {GL800_HDS.map(h => (
                  <button key={h.pn} onClick={()=>{set("headendPn",h.pn); set("cpePn",null);}}
                    style={{ textAlign:"left", padding:"10px 14px", borderRadius:8,
                      border:`2px solid ${sel.headendPn===h.pn?"#E8600A":"#E2E8F0"}`,
                      background:sel.headendPn===h.pn?"#FFF7F5":"white", cursor:"pointer" }}>
                    <div style={{ fontWeight:700, color:"#0B2343", fontSize:13 }}>{P(h.pn)?.desc ?? h.pn}</div>
                    <div style={{ fontSize:11, color:"#64748B", marginTop:2 }}>{h.label} · max {h.ports} remote CPEs</div>
                    <div style={{ display:"flex", justifyContent:"space-between", marginTop:4 }}>
                      <code style={{ fontSize:10, color:"#94A3B8" }}>{h.pn}</code>
                      <span style={{ fontSize:12, fontWeight:700, color:"#0B2343" }}>{$(P(h.pn)?.price)}</span>
                    </div>
                  </button>
                ))}
              </div>
              {sel.headendPn && (
                <div style={{ marginTop:8 }}>
                  <Label>Headend Quantity</Label>
                  <Counter v={sel.headendQty} min={1} max={9999} set={v=>set("headendQty",v)} />
                  <div style={{ fontSize:11, color:"#64748B", marginTop:4 }}>
                    Each {P(sel.headendPn)?.desc} supports up to {gl800Ports} remote CPE units.
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── GL900: Step 1 — Headend ── */}
          {step === 1 && type === "PTMP_GL900" && (
            <div>
              <StepHeader title="Select GL900 Headend" sub="GL904/GL908/GL916 headend aggregation unit." />
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:6, marginBottom:12 }}>
                {GL900_HDS.map(pn => <ProdBtn key={pn} pn={pn} selected={sel.headendPn} onSelect={pn=>set("headendPn",pn)} region={region} custType={custType} dealReg={dealReg} />)}
              </div>
              {sel.headendPn && (
                <div style={{ marginTop:8 }}>
                  <Label>Headend Quantity</Label>
                  <Counter v={sel.headendQty} min={1} max={9999} set={v=>set("headendQty",v)} />
                </div>
              )}
            </div>
          )}

          {/* ── GL9000: Step 1 — Headend ── */}
          {step === 1 && type === "PTMP_GL9000" && (
            <div>
              <StepHeader title="Select GL9000 Headend" sub="GL9110C or GL9104C — G.hn Wave 2 headend unit." />
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:6, marginBottom:12 }}>
                {GL9000_HDS.map(pn => <ProdBtn key={pn} pn={pn} selected={sel.headendPn} onSelect={pn=>set("headendPn",pn)} region={region} custType={custType} dealReg={dealReg} />)}
              </div>
              {sel.headendPn && (
                <div>
                  <Label>Headend Quantity</Label>
                  <Counter v={sel.headendQty} min={1} max={9999} set={v=>set("headendQty",v)} />
                </div>
              )}
            </div>
          )}

          {/* ── GL800/900/9000: Step 2 — CPEs ── */}
          {step === 2 && (type === "PTMP_GL800" || type === "PTMP_GL900" || type === "PTMP_GL9000") && (
            <div>
              <StepHeader title="Select CPE Unit"
                sub={type==="PTMP_GL800"
                  ? `GL800 remote CPE units (-R suffix). Matched to the ${P(sel.headendPn)?.desc ?? "selected headend"} — max ${gl800Ports} units per headend.`
                  : type==="PTMP_GL9000"
                  ? "GL93C or GL93C-W remote G.hn CPE units."
                  : "Remote endpoint unit deployed at customer premises."} />
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:6, marginBottom:12 }}>
                {(type === "PTMP_GL800" ? GL800_CPES : type === "PTMP_GL9000" ? GL9000_CPES : GL900_CPES).map(pn =>
                  <ProdBtn key={pn} pn={pn} selected={sel.cpePn} onSelect={pn=>set("cpePn",pn)} region={region} custType={custType} dealReg={dealReg} />
                )}
              </div>
              {sel.cpePn && (
                <div>
                  <Label>CPE Quantity{type==="PTMP_GL800"?` (max ${gl800Ports * sel.headendQty} for ${sel.headendQty} headend${sel.headendQty>1?"s":""})`:""}</Label>
                  <Counter v={sel.remoteCpeQty} min={1}
                    max={type==="PTMP_GL800" ? gl800Ports * sel.headendQty : 9999}
                    set={v=>set("remoteCpeQty",v)} />
                  {type==="PTMP_GL800" && sel.remoteCpeQty > gl800Ports * sel.headendQty && (
                    <div style={{fontSize:11,color:"#EF4444",marginTop:4}}>
                      ⚠ Exceeds port capacity. Add more headend units or reduce CPE count.
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ── GL800/900/9000: Step 3 — SFPs ── */}
          {step === 3 && (type === "PTMP_GL800" || type === "PTMP_GL900" || type === "PTMP_GL9000") && (
            <div>
              <StepHeader title="Uplink SFP Transceivers" sub="Optional. SFP for the headend uplink port. Qty will match headend count." />
              <div style={{ marginBottom:12 }}>
                <button onClick={()=>set("glSfpPn",null)}
                  style={{ padding:"8px 14px", borderRadius:7, border:`2px solid ${!sel.glSfpPn?A:"#E2E8F0"}`, background:!sel.glSfpPn?"#FFFBEB":"white", cursor:"pointer", fontSize:13, fontWeight:600, color:"#1A2035" }}>
                  No SFP required
                </button>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:6 }}>
                {SFP_OPTIONS.map(s => (
                  <button key={s.pn} onClick={()=>set("glSfpPn",s.pn)}
                    style={{ textAlign:"left", padding:"8px 12px", borderRadius:7, border:`2px solid ${sel.glSfpPn===s.pn?A:"#E2E8F0"}`, background:sel.glSfpPn===s.pn?"#FFFBEB":"white", cursor:"pointer" }}>
                    <div style={{ fontSize:12, fontWeight:600, color:"#1A2035" }}>{s.desc}</div>
                    <div style={{ display:"flex", justifyContent:"space-between", marginTop:2 }}>
                      <code style={{ fontSize:10, color:"#94A3B8" }}>{s.pn}</code>
                      <span style={{ fontSize:11, fontWeight:700, color:N }}>{$(P(s.pn)?.price)}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── GL800/900/9000: Step 4 — Accessories ── */}
          {step === 4 && (type === "PTMP_GL800" || type === "PTMP_GL900" || type === "PTMP_GL9000") && (
            <div>
              <StepHeader title="Accessories" sub="Power supplies are applied per total unit count (headend + CPEs)." />

              {/* GL800 accessories */}
              {type === "PTMP_GL800" && [
                { pn: isNA?"506R00013":"506R00013E", label:`GL800 Power Supply (${isNA?"NA":"EU"})`, hint:"1 per unit" },
                { pn: "510R21080", label:"Wall Mount Kit", hint:"1 per unit" },
              ].map(acc => <AccRow key={acc.pn} pn={acc.pn} label={acc.label} hint={acc.hint} checked={!!sel.glAcc[acc.pn]} onChange={v=>setAcc("glAcc",acc.pn,v)} />)}

              {/* GL900 accessories */}
              {type === "PTMP_GL900" && (()=>{
                // UK is EMEA region — UK-specific PSU variant
                const isUK = region?.name==="EMEA" && false; // UK not a separate region in current config
                const psuPn = isNA ? "506R00008" : "506R00008U"; // U suffix = UK/EU variant
                return [
                  { pn: psuPn, label:`GL900 Power Supply (${isNA?"NA":"EU/UK"})`, hint:"1 per unit" },
                  { pn: "510R21080", label:"Wall Mount Kit", hint:"1 per unit" },
                ].map(acc => <AccRow key={acc.pn} pn={acc.pn} label={acc.label} hint={acc.hint} checked={!!sel.glAcc[acc.pn]} onChange={v=>setAcc("glAcc",acc.pn,v)} />);
              })()}

              {/* GL9000 accessories — headend is 48VDC built-in, no external PSU needed */}
              {type === "PTMP_GL9000" && (
                <>
                  <div style={{padding:"10px 12px",background:"#F0FDF4",borderRadius:7,border:"1px solid #BBF7D0",marginBottom:10,fontSize:12,color:"#15803D",fontWeight:600}}>
                    ✓ GL9110C / GL9104C have built-in 48VDC power — no external PSU required.
                  </div>
                  <AccRow pn="506R61335" label="GL901CS Subscriber Line Card" hint="Add-on card — 1 per subscriber connection"
                    checked={!!sel.glAcc["506R61335"]} onChange={v=>setAcc("glAcc","506R61335",v)} />
                  {sel.glAcc["506R61335"] && (
                    <div style={{marginLeft:12,marginTop:6}}>
                      <Label>GL901CS Quantity</Label>
                      <Counter v={sel.gl9000CardQty||1} min={1} max={32} set={v=>setSel(prev=>({...prev,gl9000CardQty:v}))} />
                    </div>
                  )}
                  <AccRow pn="510R21080" label="Wall Mount Kit" hint="1 per unit"
                    checked={!!sel.glAcc["510R21080"]} onChange={v=>setAcc("glAcc","510R21080",v)} />
                </>
              )}
            </div>
          )}

          {/* ── ML230: Step 1 — Mode (bundle vs custom) ── */}
          {step === 1 && type === "PTMP_ML230" && (
            <div>
              <StepHeader title="Configuration Mode" sub="Use a pre-built bundle SKU or configure components individually." />
              <div style={{ display:"flex", gap:8, marginBottom:16 }}>
                {[["bundle","Pre-built Bundle","Select a single bundle SKU (CHS + SDU + MLU). Fastest option."],["custom","Custom Build","Choose chassis, SDU, MLU, cables and accessories individually."]].map(([v,l,d])=>(
                  <button key={v} onClick={()=>set("ml230mode",v)}
                    style={{ flex:1, padding:"12px 14px", borderRadius:8, border:`2px solid ${sel.ml230mode===v?A:"#E2E8F0"}`, background:sel.ml230mode===v?"#FFFBEB":"white", cursor:"pointer", textAlign:"left" }}>
                    <div style={{ fontWeight:700, fontSize:13, color:"#1A2035" }}>{l}</div>
                    <div style={{ fontSize:11, color:"#64748B", marginTop:2 }}>{d}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── ML230: Step 2 — Components ── */}
          {step === 2 && type === "PTMP_ML230" && sel.ml230mode === "bundle" && (
            <div>
              <StepHeader title="Select Bundle" sub="Pre-configured ML230 or ML2300 bundle. Includes chassis, SDU and MLU." />
              <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                {ML230_BUNDLES.map(b => {
                  const prod = P(b.pn);
                  return (
                    <button key={b.pn} onClick={()=>set("bundlePn",b.pn)}
                      style={{ textAlign:"left", padding:"10px 14px", borderRadius:8, border:`2px solid ${sel.bundlePn===b.pn?A:"#E2E8F0"}`, background:sel.bundlePn===b.pn?"#FFFBEB":"white", cursor:"pointer", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                      <div>
                        <div style={{ fontWeight:600, fontSize:13, color:"#1A2035" }}>{b.label}</div>
                        <code style={{ fontSize:10, color:"#94A3B8" }}>{b.pn}</code>
                      </div>
                      <div style={{ fontWeight:700, color:N, fontSize:13 }}>{$(prod?.price)}</div>
                    </button>
                  );
                })}
              </div>
              {sel.bundlePn && (
                <div style={{ marginTop:12 }}>
                  <Label>Quantity</Label>
                  <Counter v={sel.bundleQty} min={1} max={9999} set={v=>set("bundleQty",v)} />
                </div>
              )}
            </div>
          )}

          {step === 2 && type === "PTMP_ML230" && sel.ml230mode === "custom" && (
            <div>
              <StepHeader title="Select Components" sub="Choose chassis, SDU and MLU individually." />

              {/* Chassis */}
              <div style={{ marginBottom:14 }}>
                <Label>Chassis</Label>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:6 }}>
                  {["502R20230","502R02110"].map(pn => <ProdBtn key={pn} pn={pn} selected={sel.chassisPn} onSelect={pn=>set("chassisPn",pn)} region={region} custType={custType} dealReg={dealReg} />)}
                </div>
              </div>

              {/* SDU */}
              <div style={{ marginBottom:14 }}>
                <Label>SDU (Service Dispatcher Unit)</Label>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:6, marginBottom:8 }}>
                  {["503R60042","503R60043","503R60041"].map(pn => <ProdBtn key={pn} pn={pn} selected={sel.sduPn} onSelect={pn=>set("sduPn",pn)} region={region} custType={custType} dealReg={dealReg} />)}
                </div>
                {sel.sduPn && (()=>{
                  const isCHS2000B = sel.chassisPn === "502R02110";
                  // ML230 = 1 SDU slot; ML2300B = 2 SDU slots (Source: Table 10, ML230/ML2300 Manual 520R69659E)
                  const maxSDU = isCHS2000B ? 2 : 1;
                  return (
                    <div>
                      <Label>{isCHS2000B ? "SDU Quantity (ML2300B has 2 SDU slots — 1 active + 1 redundant)" : "SDU Quantity (ML230 has 1 SDU slot)"}</Label>
                      <Counter v={sel.sduQty ?? 1} min={1} max={maxSDU} set={v=>set("sduQty",v)} />
                    </div>
                  );
                })()}
              </div>

              {/* MLU */}
              <div style={{ marginBottom:8 }}>
                <Label>MLU (Multiport Line Unit)</Label>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:6, marginBottom:8 }}>
                  {["503R20132","503R20164","503R20232","503R20264"].map(pn => <ProdBtn key={pn} pn={pn} selected={sel.mluPn} onSelect={pn=>{set("mluPn",pn); set("mluQty",1);}} region={region} custType={custType} dealReg={dealReg} />)}
                </div>
                {sel.mluPn && (()=>{
                  const isCHS2000B = sel.chassisPn === "502R02110";
                  // ML230 = 2 MLU slots; ML2300B = 4 MLU slots (Source: Table 10, ML230/ML2300 Manual 520R69659E)
                  const maxMLU = isCHS2000B ? 4 : 2;
                  const mluDesc = P(sel.mluPn)?.desc ?? "";
                  const is64pair = mluDesc.includes("64");
                  const isFront = sel.mluPn === "503R20164" || sel.mluPn === "503R20132"; // DF = front-access FCI
                  return (
                    <div>
                      <Label>MLU Quantity ({isCHS2000B ? "ML2300B: max 4 slots" : "ML230: max 2 slots"})</Label>
                      <Counter v={sel.mluQty} min={1} max={maxMLU} set={v=>set("mluQty",v)} />
                      {/* Conditional SDU warning for 64-pair MLUs on CHS-2000B */}
                      {isCHS2000B && is64pair && (
                        <div style={{marginTop:6,padding:"7px 10px",background:"#FFFBEB",borderRadius:6,border:"1px solid #FCD34D",fontSize:11,color:"#92400E",fontWeight:600}}>
                          ⚠ MLU-64 cards on ML2300B require SDU-450, SDU-450G, or SDU-455G (not SDU-440/440G).
                        </div>
                      )}
                      {/* Front-access (DF) cable note */}
                      {isFront && (
                        <div style={{marginTop:6,padding:"7px 10px",background:"#F0F9FF",borderRadius:6,border:"1px solid #BAE6FD",fontSize:11,color:"#0369A1"}}>
                          ℹ Front-access (DF) MLUs use a 144-pin FCI connector. No cable P/N is established in the Actelis Parts List — cables must be sourced separately.
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>

              {/* Node Count */}
              <div style={{ marginTop:16, padding:"12px 14px", background:"#EFF6FF", borderRadius:8, border:"1px solid #BFDBFE" }}>
                <Label>Number of Identical Nodes</Label>
                <div style={{ fontSize:12, color:"#3B82F6", marginBottom:8 }}>Multiplies all components by this count (for deploying multiple identical chassis).</div>
                <Counter v={sel.nodeCount} min={1} max={9999} set={v=>set("nodeCount",v)} />
              </div>
            </div>
          )}

          {/* ── ML230: Step 3 — Cables & SFPs ── */}
          {step === 3 && type === "PTMP_ML230" && (
            <div>
              <StepHeader
                title="Cables & SFPs"
                sub={sel.chassisPn === "502R02110"
                  ? "CHS-2000B uses 64-pair DIN connector cables to connect MLUs to the MDF."
                  : "CHS-200 uses standard RJ-45 octal/quad cables."} />

              {sel.ml230mode === "custom" && (
                <>
                  {/* ── CHS-2000B: MLU Copper Cables ── */}
                  {sel.chassisPn === "502R02110" && (
                    <div style={{ marginBottom:16 }}>
                      {(()=>{
                        // Source: Actelis ML230/ML2300 Manual 520R69659E, Appendix B Table 145
                        // DF (front-access) MLUs use 144-pin FCI connector — no cable P/N in Parts List
                        // DR (rear-access) MLUs use 128-pin DIN connector — cables 504R60060/62/63/87/88
                        const isFrontDF = sel.mluPn === "503R20132" || sel.mluPn === "503R20164";
                        const mluDesc = P(sel.mluPn)?.desc ?? "";

                        if (isFrontDF) {
                          return (
                            <div style={{padding:"12px 14px",background:"#F0F9FF",borderRadius:8,border:"1px solid #BAE6FD"}}>
                              <div style={{fontSize:12,fontWeight:700,color:"#0369A1",marginBottom:4}}>ℹ Front-Access (DF) MLU — 144-pin FCI Connector</div>
                              <div style={{fontSize:11,color:"#0C4A6E",lineHeight:1.5}}>
                                Front-access DF MLUs ({mluDesc}) use a <strong>144-pin FCI connector</strong>.
                                No matching cable P/N is established in the Actelis Parts List (Appendix B, Table 145).
                                Cables for front-access MLUs must be sourced separately — do not use the 128-pin DIN cables.
                              </div>
                            </div>
                          );
                        }

                        // Rear-access (DR / ER) MLUs — 128-pin DIN cables
                        const autoCableQty = sel.mluQty;
                        return (
                          <>
                            <div style={{padding:"8px 12px",background:"#F0FDF4",borderRadius:7,border:"1px solid #BBF7D0",marginBottom:10,fontSize:11,color:"#166534",fontWeight:600}}>
                              ✓ Rear-access ({mluDesc}) uses 128-pin DIN connector → {autoCableQty} × 64-pair DIN cable{autoCableQty>1?"s":""}
                            </div>
                            <AccRow pn="504R60062" label="Include MLU Copper Cables?" hint={`128-pin DIN — 1 cable per MLU card`}
                              checked={sel.mluCableInclude} onChange={v=>set("mluCableInclude",v)} />
                          </>
                        );
                      })()}
                      {sel.mluCableInclude && !["503R20132","503R20164"].includes(sel.mluPn) && (
                        <div style={{ marginLeft:12, padding:"12px 14px", background:"#F8FAFC", borderRadius:8, border:"1px solid #E2E8F0", marginTop:6 }}>
                          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:12 }}>
                            <div>
                              <Label>Cable Coloring Scheme</Label>
                              <div style={{ display:"flex", gap:6 }}>
                                {["US","EU"].map(c => (
                                  <button key={c} onClick={()=>set("mluCableColor",c)}
                                    style={{ flex:1, padding:"7px", borderRadius:6, border:`2px solid ${sel.mluCableColor===c?A:"#E2E8F0"}`, background:sel.mluCableColor===c?"#FFF7F5":"white", cursor:"pointer", fontWeight:700, fontSize:13, color:"#1A2035" }}>
                                    {c} Color Code
                                  </button>
                                ))}
                              </div>
                            </div>
                            <div>
                              <Label>Max Distance to MDF</Label>
                              <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                                {["25ft","100ft","150ft"].map(d => (
                                  <button key={d} onClick={()=>set("mluCableDistance",d)}
                                    style={{ flex:1, padding:"7px", borderRadius:6, border:`2px solid ${sel.mluCableDistance===d?A:"#E2E8F0"}`, background:sel.mluCableDistance===d?"#FFF7F5":"white", cursor:"pointer", fontWeight:700, fontSize:13, color:"#1A2035" }}>
                                    {d}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                          {/* Preview selected cable SKU */}
                          {(() => {
                            const cableMap = {"US-25ft":"504R60060","US-100ft":"504R60062","US-150ft":"504R60063","EU-100ft":"504R60088","EU-25ft":"504R60060","EU-150ft":"504R60063"};
                            const pn = cableMap[`${sel.mluCableColor}-${sel.mluCableDistance}`] || "504R60062";
                            const prod = P(pn);
                            const qty = sel.mluQty * (sel.nodeCount||1);
                            return prod ? (
                              <div style={{ padding:"8px 10px", background:"white", borderRadius:6, border:"1px solid #E2E8F0", fontSize:12 }}>
                                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                                  <span style={{ color:"#1A2035", fontWeight:600 }}>{prod.desc}</span>
                                  <span style={{ fontWeight:700, color:"#0B1D3A" }}>{$(prod.price)} × {qty}</span>
                                </div>
                                <code style={{ fontSize:10, color:"#94A3B8" }}>{pn}</code>
                              </div>
                            ) : null;
                          })()}
                        </div>
                      )}
                    </div>
                  )}

                  {/* ── CHS-200: MLU DSL Cables ── */}
                  {sel.chassisPn === "502R20230" && (
                    <div style={{ marginBottom:16 }}>
                      {(()=>{
                        // Source: Actelis ML230/ML2300 Manual 520R69659E, Appendix B Table 145
                        // DF (front-access) MLUs: 144-pin FCI — no cable P/N in Parts List
                        // DR (rear-access) MLUs: 128-pin DIN — same cable set as CHS-2000B
                        const isFrontDF = sel.mluPn === "503R20132" || sel.mluPn === "503R20164";
                        const mluDesc = P(sel.mluPn)?.desc ?? "";

                        if (isFrontDF) {
                          return (
                            <div style={{padding:"12px 14px",background:"#F0F9FF",borderRadius:8,border:"1px solid #BAE6FD"}}>
                              <div style={{fontSize:12,fontWeight:700,color:"#0369A1",marginBottom:4}}>ℹ Front-Access (DF) MLU — 144-pin FCI Connector</div>
                              <div style={{fontSize:11,color:"#0C4A6E",lineHeight:1.5}}>
                                Front-access DF MLUs ({mluDesc}) use a <strong>144-pin FCI connector</strong>.
                                No cable P/N is established in the Actelis Parts List for this connector type.
                                Cables must be sourced separately — do not use the RJ-45 or 128-pin DIN cables.
                              </div>
                            </div>
                          );
                        }
                        // DR rear-access: 128-pin DIN cables
                        return (
                          <div style={{padding:"8px 12px",background:"#F0FDF4",borderRadius:7,border:"1px solid #BBF7D0",fontSize:11,color:"#166534",fontWeight:600}}>
                            ✓ Rear-access ({mluDesc}) uses 128-pin DIN connector — same cable set as ML2300B
                          </div>
                        );
                      })()}
                      {!["503R20132","503R20164"].includes(sel.mluPn) && (
                        <>
                          <div style={{marginTop:8}}>
                            <AccRow pn="504R20120" label="Include MLU DSL Cables?" hint="128-pin DIN cables — qty auto-calculated"
                              checked={sel.chs200CableInclude} onChange={v=>set("chs200CableInclude",v)} />
                          </div>
                          {sel.chs200CableInclude && (
                            <div style={{ marginLeft:12, padding:"12px 14px", background:"#F8FAFC", borderRadius:8, border:"1px solid #E2E8F0", marginTop:6 }}>
                              <Label>Cable Type &amp; Distance (128-pin DIN)</Label>
                              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:6, marginBottom:10 }}>
                                {[
                                  { pn:"504R60060", label:"128-pin DIN  25ft / 7.6m" },
                                  { pn:"504R60062", label:"128-pin DIN  100ft / 30m" },
                                  { pn:"504R60063", label:"128-pin DIN  150ft / 45m" },
                                  { pn:"504R60088", label:"128-pin FCI  100ft / 30m (EU)" },
                                ].map(opt => {
                                  const autoQty = sel.mluQty;
                                  return (
                                    <button key={opt.pn} onClick={()=>{ set("chs200CablePn",opt.pn); set("chs200CableQty", autoQty); }}
                                      style={{ textAlign:"left", padding:"9px 11px", borderRadius:7, border:`2px solid ${sel.chs200CablePn===opt.pn?A:"#E2E8F0"}`, background:sel.chs200CablePn===opt.pn?"#FFF7F5":"white", cursor:"pointer" }}>
                                      <div style={{ fontSize:12, fontWeight:600, color:"#1A2035" }}>{opt.label}</div>
                                      <div style={{ display:"flex", justifyContent:"space-between", marginTop:3 }}>
                                        <code style={{ fontSize:10, color:"#94A3B8" }}>{opt.pn}</code>
                                        <span style={{ fontSize:11, fontWeight:700, color:"#0B1D3A" }}>{$(P(opt.pn)?.price)}</span>
                                      </div>
                                    </button>
                                  );
                                })}
                              </div>
                              <Label>Cable Quantity (1 per MLU card)</Label>
                              <Counter v={sel.chs200CableQty} min={1} max={9999} set={v=>set("chs200CableQty",v)} />
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  )}
                </>
              )}

              {/* ── Uplink SFP ── */}
              <div style={{ marginBottom:0 }}>
                <Label>Uplink SFP (optional)</Label>
                <div style={{ marginBottom:8 }}>
                  <button onClick={()=>set("ml230SfpPn",null)}
                    style={{ padding:"6px 12px", borderRadius:6, border:`2px solid ${!sel.ml230SfpPn?A:"#E2E8F0"}`, background:!sel.ml230SfpPn?"#FFFBEB":"white", cursor:"pointer", fontSize:12, fontWeight:600, color:"#1A2035" }}>
                    No SFP
                  </button>
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:6, marginBottom:8 }}>
                  {SFP_OPTIONS.map(s => (
                    <button key={s.pn} onClick={()=>set("ml230SfpPn",s.pn)}
                      style={{ textAlign:"left", padding:"7px 10px", borderRadius:7, border:`2px solid ${sel.ml230SfpPn===s.pn?A:"#E2E8F0"}`, background:sel.ml230SfpPn===s.pn?"#FFFBEB":"white", cursor:"pointer" }}>
                      <div style={{ fontSize:12, fontWeight:600, color:"#1A2035" }}>{s.desc}</div>
                      <div style={{ display:"flex", justifyContent:"space-between", marginTop:2 }}>
                        <code style={{ fontSize:10, color:"#94A3B8" }}>{s.pn}</code>
                        <span style={{ fontSize:11, fontWeight:700, color:N }}>{$(P(s.pn)?.price)}</span>
                      </div>
                    </button>
                  ))}
                </div>
                {sel.ml230SfpPn && (
                  <div>
                    <Label>SFP Quantity</Label>
                    <Counter v={sel.ml230SfpQty} min={1} max={9999} set={v=>set("ml230SfpQty",v)} />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── ML230: Step 4 — Accessories ── */}
          {step === 4 && type === "PTMP_ML230" && (
            <div>
              <StepHeader title="Additional Accessories" sub="Optional cables, modules and add-ons for the chassis." />

              {/* DC Power Cable */}
              <div style={{ marginBottom:8 }}>
                <AccRow pn="504R20043" label="Include DC Power Cable (PWR/GND Harness)" hint="48VDC open-ended, 20ft/6m"
                  checked={sel.dcPowerCable} onChange={v=>set("dcPowerCable",v)} />
                {sel.dcPowerCable && (
                  <div style={{ marginLeft:12, display:"flex", gap:6, marginBottom:8 }}>
                    {[["18AWG","504R20043","18AWG — lighter duty"],["14AWG","504R20047","14AWG — heavier duty"]].map(([gauge,pn,hint])=>(
                      <button key={gauge} onClick={()=>set("dcPowerGauge",gauge)}
                        style={{ flex:1, padding:"7px 10px", borderRadius:6, border:`2px solid ${sel.dcPowerGauge===gauge?"#D97706":"#E2E8F0"}`, background:sel.dcPowerGauge===gauge?"#FFFBEB":"white", cursor:"pointer", textAlign:"left" }}>
                        <div style={{ fontWeight:700, fontSize:12, color:"#1A2035" }}>{gauge}</div>
                        <div style={{ display:"flex", justifyContent:"space-between" }}>
                          <span style={{ fontSize:10, color:"#64748B" }}>{hint}</span>
                          <span style={{ fontSize:11, fontWeight:700, color:"#0B1D3A" }}>{$(P(pn)?.price)}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Craft cable */}
              <AccRow pn="504R20010" label="Include Craft Cable" hint="DB-9 both ends, 12ft/3.6m — 1 per node"
                checked={sel.craftCable} onChange={v=>set("craftCable",v)} />

              {/* Alarm cable */}
              <div style={{ marginBottom:8 }}>
                <div style={{ fontSize:12, fontWeight:600, color:"#1A2035", marginBottom:4 }}>Alarm Cable</div>
                <div style={{ display:"flex", gap:6 }}>
                  {[["none","None","No alarm cable"],["50ft","50ft / 15m","504R20060 — DB-15 one end"]].map(([v,l,h])=>(
                    <button key={v} onClick={()=>set("alarmCableLen",v)}
                      style={{ flex:1, padding:"8px 10px", borderRadius:6, border:`2px solid ${sel.alarmCableLen===v?"#D97706":"#E2E8F0"}`, background:sel.alarmCableLen===v?"#FFFBEB":"white", cursor:"pointer", textAlign:"left" }}>
                      <div style={{ fontWeight:700, fontSize:12, color:"#1A2035" }}>{l}</div>
                      <div style={{ fontSize:10, color:"#64748B" }}>{h}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Flash card */}
              <AccRow pn="550A00046" label="Flash Card for SDU-450/G" hint="1 per node"
                checked={sel.flashCard} onChange={v=>set("flashCard",v)} />

              {/* Fan module */}
              {sel.chassisPn === "502R02110" && (
                <AccRow pn="506R30070" label="Fan Control Module for CHS-2000B" hint="1 per chassis"
                  checked={sel.fanModule} onChange={v=>set("fanModule",v)} />
              )}
              {sel.chassisPn === "502R20230" && (
                <AccRow pn="506R30060" label="Fan Control Module for CHS-200 (FCM-200)" hint="1 per chassis"
                  checked={sel.fanModule} onChange={v=>set("fanModule",v)} />
              )}

              {/* CHS-200 accessories kit */}
              {sel.chassisPn === "502R20230" && (
                <AccRow pn="510K20230" label="Accessories Kit for CHS-200" hint="1 per chassis"
                  checked={sel.chs200AccKit} onChange={v=>set("chs200AccKit",v)} />
              )}

              {/* Streaker card */}
              <AccRow pn="503R20270" label="Streaker Card (ML2300/ML230)" hint="Signal splitter/probe — 1 per chassis"
                checked={sel.streaker} onChange={v=>set("streaker",v)} />
            </div>
          )}

          {/* ── SWITCH_FIBER: Step 1 — Family & Model ── */}
          {step === 1 && type === "SWITCH_FIBER" && (() => {
            const SW_FAMILIES = [
              { key:"dinrail_l2", label:"DIN Rail L2",    desc:"GL5010/5020/5030/5060/5070/5080, ML5114 — industrial DIN rail mounting" },
              { key:"dinrail_l3", label:"DIN Rail L3",    desc:"GL5010R/5020R/5030XR/5060XR/5070XR/5080XR — Layer 3 routing" },
              { key:"rack_l2",    label:"Rackmount L2",   desc:"GL6010X/6020/6030/6031/6040X, ML530/540 — 19\" rack switch" },
              { key:"rack_l3",    label:"Rackmount L3",   desc:"GL6010XR/6040XR — Layer 3 rackmount" },
              { key:"inpole",     label:"In-Pole",        desc:"GL7006/7010/7020/7030 — outdoor sealed IP enclosure" },
            ];
            const SW_MODELS = {
              dinrail_l2: [
                ["GL5010 Series",["506R61252","506R61254","506R62107","506R61253"]],
                ["GL5020 Series",["506R61255","506R61256"]],
                ["GL5030X Series",["506R61257","506R61258","506R61261","506R61262"]],
                ["GL5060 Series",["506R61309","506R61264","506R61265"]],
                ["GL5070/5080",["506R61263","506R62108"]],
                ["ML5114",["506R62011","506R62012"]],
              ],
              dinrail_l3: [
                ["GL5010R/5020R",["506R61296","506R62106"]],
                ["GL5030XR Series",["506R61259","506R61260","506R61306"]],
                ["GL5060XR/5070XR/5080XR",["506R61267","506R61268","506R61295","506R61270"]],
              ],
              rack_l2: [
                ["GL6010X Series",["506R61286","506R61287","506R61271","506R61272"]],
                ["GL6020/6030/6031",["506R61277","506R61278","506R61283","506R61284","506R61280","506R61281"]],
                ["GL6040X Series",["506R61289","506R61290"]],
                ["ML530 / ML540",["501RG0530","501RG0252","506R62016","506R62006"]],
              ],
              rack_l3: [
                ["GL6010XR Series",["506R61274","506R61275"]],
                ["GL6040XR Series",["506R61292","506R61293"]],
              ],
              inpole: [
                ["GL7000 In-Pole",["506R61332","506R61329","506R61330","506R61331"]],
              ],
            };
            return (
              <div>
                <StepHeader title="Select Switch Family & Model" sub="Choose the product family, then the specific model." />
                {/* Family selector */}
                <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:16 }}>
                  {SW_FAMILIES.map(f => (
                    <button key={f.key} onClick={()=>{ set("swFamily",f.key); set("swPn",null); }}
                      style={{ padding:"8px 12px", borderRadius:7, border:`2px solid ${sel.swFamily===f.key?"#D97706":"#E2E8F0"}`, background:sel.swFamily===f.key?"#FFFBEB":"white", cursor:"pointer", textAlign:"left" }}>
                      <div style={{ fontWeight:700, fontSize:12, color:"#1A2035" }}>{f.label}</div>
                      <div style={{ fontSize:10, color:"#64748B", maxWidth:160 }}>{f.desc}</div>
                    </button>
                  ))}
                </div>
                {/* Model selector */}
                {sel.swFamily && (SW_MODELS[sel.swFamily]||[]).map(([grp, pns]) => (
                  <div key={grp} style={{ marginBottom:10 }}>
                    <div style={{ fontSize:11, fontWeight:700, color:"#64748B", textTransform:"uppercase", marginBottom:5 }}>{grp}</div>
                    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:5 }}>
                      {pns.map(pn => <ProdBtn key={pn} pn={pn} selected={sel.swPn} onSelect={pn=>set("swPn",pn)} region={region} custType={custType} dealReg={dealReg} />)}
                    </div>
                  </div>
                ))}
                {sel.swPn && (
                  <div style={{ marginTop:12 }}>
                    <Label>Quantity</Label>
                    <Counter v={sel.swQty} min={1} max={9999} set={v=>set("swQty",v)} />
                  </div>
                )}
              </div>
            );
          })()}

          {/* ── SWITCH_FIBER: Step 2 — SFPs ── */}
          {step === 2 && type === "SWITCH_FIBER" && (
            <div>
              <StepHeader title="SFP Transceivers" sub="Optional. Select fiber SFP module for uplink/fiber ports. Qty is per switch × unit count." />
              <div style={{ marginBottom:10 }}>
                <button onClick={()=>set("swSfpPn",null)}
                  style={{ padding:"7px 14px", borderRadius:6, border:`2px solid ${!sel.swSfpPn?"#D97706":"#E2E8F0"}`, background:!sel.swSfpPn?"#FFFBEB":"white", cursor:"pointer", fontSize:13, fontWeight:600, color:"#1A2035" }}>
                  No SFP required
                </button>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:6, marginBottom:10 }}>
                {SFP_OPTIONS.map(s => (
                  <button key={s.pn} onClick={()=>set("swSfpPn",s.pn)}
                    style={{ textAlign:"left", padding:"8px 10px", borderRadius:7, border:`2px solid ${sel.swSfpPn===s.pn?"#D97706":"#E2E8F0"}`, background:sel.swSfpPn===s.pn?"#FFFBEB":"white", cursor:"pointer" }}>
                    <div style={{ fontSize:12, fontWeight:600, color:"#1A2035" }}>{s.desc}</div>
                    <div style={{ display:"flex", justifyContent:"space-between", marginTop:2 }}>
                      <code style={{ fontSize:10, color:"#94A3B8" }}>{s.pn}</code>
                      <span style={{ fontSize:11, fontWeight:700, color:"#0B1D3A" }}>{$(P(s.pn)?.price)}</span>
                    </div>
                  </button>
                ))}
              </div>
              {sel.swSfpPn && (
                <div>
                  <Label>SFP Quantity (per switch × {sel.swQty} unit{sel.swQty>1?"s":""})</Label>
                  <Counter v={sel.swSfpQty} min={1} max={9999} set={v=>set("swSfpQty",v)} />
                  <div style={{ fontSize:11, color:"#64748B", marginTop:4 }}>Total SFPs added: <b>{sel.swSfpQty * sel.swQty}</b></div>
                </div>
              )}
            </div>
          )}

          {/* ── SWITCH_FIBER: Step 3 — Power & Accessories ── */}
          {step === 3 && type === "SWITCH_FIBER" && (() => {
            const isDIN    = sel.swFamily === "dinrail_l2" || sel.swFamily === "dinrail_l3";
            const isRack   = sel.swFamily === "rack_l2" || sel.swFamily === "rack_l3";
            const isML530  = sel.swPn === "501RG0530" || sel.swPn === "501RG0252" || sel.swPn === "506R62016" || sel.swPn === "506R62006";
            const selDesc  = P(sel.swPn)?.desc || "";
            const hasPoE   = selDesc.includes("-P") && !selDesc.includes("-P/");
            const isAC     = /\b(AC|AC-DC)\b/.test(selDesc) || selDesc.toLowerCase().includes(" ac ");

            // PSU options for DIN Rail
            const dinPsuOptions = [
              { pn: isNA?"506R61185":"506R61184", label: `DIN Rail 24VDC PSU${isNA?" + US":" + EU"} Cables`, note:"Standard (no PoE)" },
              { pn: "506R61181", label: "DIN Rail 24VDC PSU (no cables)", note:"Use with existing cable" },
              { pn: "506R61191", label: "DIN Rail 48VDC PSU with PoE", note:"Required for -P models" },
            ];
            // PSU for ML530 / ML540
            const mlPsuOptions = [
              { pn: isNA?"506R00006":"506R00006E", label: `AC-DC PSU for ML530/ML540 (${isNA?"NA":"EU"})`, note:"1 per unit" },
            ];

            return (
              <div>
                <StepHeader title="Power Supply & Accessories" sub="Select external PSU if needed and optional mounting kits." />

                {/* DIN Rail PSU */}
                {isDIN && (
                  <div style={{ marginBottom:14 }}>
                    <AccRow pn={isNA?"506R61185":"506R61184"} label="Include External DIN Rail PSU?" hint={hasPoE ? "Recommend 48VDC PoE PSU for -P models" : "24VDC PSU for standard models"}
                      checked={sel.swPsuInclude} onChange={v=>set("swPsuInclude",v)} />
                    {sel.swPsuInclude && (
                      <div style={{ marginLeft:12, display:"flex", flexDirection:"column", gap:5, marginTop:5 }}>
                        {dinPsuOptions.map(opt => (
                          <button key={opt.pn} onClick={()=>set("swPsuPn",opt.pn)}
                            style={{ textAlign:"left", padding:"8px 12px", borderRadius:7, border:`2px solid ${sel.swPsuPn===opt.pn?"#D97706":"#E2E8F0"}`, background:sel.swPsuPn===opt.pn?"#FFFBEB":"white", cursor:"pointer" }}>
                            <div style={{ display:"flex", justifyContent:"space-between" }}>
                              <span style={{ fontWeight:600, fontSize:12, color:"#1A2035" }}>{opt.label}</span>
                              <span style={{ fontSize:12, fontWeight:700, color:"#0B1D3A" }}>{$(P(opt.pn)?.price)}</span>
                            </div>
                            <div style={{ fontSize:10, color:"#64748B" }}>{opt.note} · <code style={{fontSize:10}}>{opt.pn}</code></div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* ML530/ML540 PSU */}
                {isML530 && (
                  <div style={{ marginBottom:14 }}>
                    <AccRow pn={isNA?"506R00006":"506R00006E"} label={`Include AC-DC Power Supply (${isNA?"NA":"EU"})?`} hint="1 per unit"
                      checked={sel.swPsuInclude} onChange={v=>{ set("swPsuInclude",v); set("swPsuPn", isNA?"506R00006":"506R00006E"); }} />
                  </div>
                )}

                {/* DC Rackmount — AC models have built-in PSU, note for DC */}
                {isRack && !isML530 && (
                  <div style={{ marginBottom:14, padding:"10px 12px", background: isAC?"#F0FDF4":"#FFF7ED", borderRadius:8, border:`1px solid ${isAC?"#BBF7D0":"#FED7AA"}` }}>
                    <div style={{ fontSize:12, fontWeight:700, color: isAC?"#15803D":"#B45309" }}>
                      {isAC ? "✓ AC Model — Built-in Power Supply" : "⚠ DC Model — Requires external 48VDC power source"}
                    </div>
                    <div style={{ fontSize:11, color:"#64748B", marginTop:2 }}>
                      {isAC ? "No external PSU required." : "Connect to site DC power bus or external supply."}
                    </div>
                  </div>
                )}

                {/* Mounting kits */}
                {isML530 && (
                  <>
                    <AccRow pn="510R21070" label="Rack Mount Sleeve Kit (holds 2 units)" hint="Mounts 2 ML530 side-by-side in 19 inch rack"
                      checked={sel.swRackKit} onChange={v=>set("swRackKit",v)} />
                    <AccRow pn="510R21080" label="Wall Mount Kit" hint="1 per unit"
                      checked={sel.swWallKit} onChange={v=>set("swWallKit",v)} />
                    <AccRow pn="510K00060" label="Accessories Kit for ML530/ML600" hint="1 per unit"
                      checked={sel.swAccKit} onChange={v=>set("swAccKit",v)} />
                  </>
                )}
              </div>
            );
          })()}

          {/* ── REVIEW: last step for all types ── */}
          {step === steps.length - 1 && type && (
            <div>
              <StepHeader title="Review BOM" sub="Confirm the bill of materials before adding to quote." />

              {/* Site name */}
              <div style={{ marginBottom:12 }}>
                <Label>Site Label</Label>
                <input value={sel.siteName} onChange={e=>set("siteName",e.target.value)}
                  placeholder="Optional site name for grouping in quote"
                  style={{ width:"100%", padding:"8px 10px", border:"1px solid #E2E8F0", borderRadius:6, fontSize:13, color:"#1A2035", outline:"none" }} />
              </div>

              {/* BOM table */}
              <div style={{ border:"1px solid #E2E8F0", borderRadius:8, overflow:"hidden", marginBottom:12 }}>
                <div style={{ display:"grid", gridTemplateColumns:"80px 1fr 50px 90px 60px 100px", padding:"7px 10px", background:"#0B1D3A", fontSize:10, fontWeight:700, color:"white", textTransform:"uppercase", letterSpacing:"0.04em" }}>
                  <span>Part #</span><span>Description</span><span style={{textAlign:"center"}}>Qty</span><span style={{textAlign:"right"}}>List</span><span style={{textAlign:"center"}}>Disc</span><span style={{textAlign:"right"}}>Customer $</span>
                </div>
                {bomLines.length === 0 && (
                  <div style={{ padding:"20px", textAlign:"center", color:"#94A3B8", fontSize:13 }}>No items selected yet</div>
                )}
                {bomLines.map((l, i) => (
                  <div key={i} style={{ display:"grid", gridTemplateColumns:"80px 1fr 50px 90px 60px 100px", padding:"8px 10px", borderTop:"1px solid #F1F5F9", alignItems:"center", background: i%2===0?"white":"#FAFBFF" }}>
                    <code style={{ fontSize:10, color:"#0B1D3A", fontWeight:700 }}>{l.pn}</code>
                    <span style={{ fontSize:12, color:"#1A2035" }}>{l.desc}</span>
                    <span style={{ textAlign:"center", fontSize:13, fontWeight:700 }}>{l.qty}</span>
                    <span style={{ textAlign:"right", fontSize:12, color:"#64748B" }}>{$(l.price)}</span>
                    <span style={{ textAlign:"center", fontSize:12, color:"#10B981", fontWeight:600 }}>{l.discount>0?`-${PCT(l.discount)}`:"—"}</span>
                    <span style={{ textAlign:"right", fontSize:13, fontWeight:700, color:"#0B1D3A" }}>{$(l.price * l.qty * (1 - l.discount))}</span>
                  </div>
                ))}
              </div>

              {/* Totals */}
              {bomLines.length > 0 && (
                <div style={{ display:"flex", justifyContent:"flex-end", gap:20, padding:"8px 10px" }}>
                  {bomList !== bomTotal && (
                    <div style={{ textAlign:"right" }}>
                      <div style={{ fontSize:11, color:"#64748B" }}>List Total</div>
                      <div style={{ fontSize:13, color:"#64748B" }}>{$(bomList)}</div>
                    </div>
                  )}
                  <div style={{ textAlign:"right" }}>
                    <div style={{ fontSize:11, color:"#64748B" }}>Customer Total</div>
                    <div style={{ fontSize:16, fontWeight:800, color:A }}>{$(bomTotal)}</div>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Footer */}
        <div style={{ padding:"12px 20px", borderTop:"1px solid #E2E8F0", display:"flex", justifyContent:"space-between", alignItems:"center", background:"white", flexShrink:0 }}>
          <button onClick={goBack}
            style={{ padding:"8px 18px", borderRadius:6, border:"1px solid #E2E8F0", background:"white", fontSize:13, cursor:"pointer", color:"#64748B" }}>
            {step === 0 ? "Cancel" : "← Back"}
          </button>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            {bomLines.length > 0 && (
              <span style={{ fontSize:12, color:"#64748B" }}>{bomLines.length} line{bomLines.length>1?"s":""} · {$(bomTotal)}</span>
            )}
            {step < steps.length - 1 ? (
              <button onClick={goNext} disabled={!canNext()}
                style={{ padding:"8px 22px", borderRadius:6, border:"none", fontSize:13, fontWeight:700,
                  background: canNext() ? "#D97706" : "#E2E8F0",
                  color: canNext() ? "white" : "#94A3B8",
                  cursor: canNext() ? "pointer" : "default" }}>
                Next →
              </button>
            ) : (
              <button onClick={handleAdd} disabled={bomLines.length === 0}
                style={{ padding:"8px 22px", borderRadius:6, border:"none", fontSize:13, fontWeight:700,
                  background: bomLines.length > 0 ? "#059669" : "#E2E8F0",
                  color: bomLines.length > 0 ? "white" : "#94A3B8",
                  cursor: bomLines.length > 0 ? "pointer" : "default" }}>
                ✓ Add {bomLines.length} line{bomLines.length!==1?"s":""} to Quote
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Reusable sub-components ──────────────────────────────────────────────────
function ProdBtn({ pn, selected, onSelect, region, custType, dealReg }) {
  const prod = P(pn);
  if (!prod) return null;
  const rid  = region?.id || 6;
  const disc = getDisc(prod.cat, rid, custType, dealReg);
  const custPrice = prod.price * (1 - disc);
  const active = selected === pn;
  return (
    <button onClick={() => onSelect(pn)}
      style={{ textAlign:"left", padding:"9px 11px", borderRadius:7, border:`2px solid ${active?"#D97706":"#E2E8F0"}`, background:active?"#FFFBEB":"white", cursor:"pointer" }}
      onMouseEnter={e=>{ if(!active){e.currentTarget.style.borderColor="#CBD5E1"; e.currentTarget.style.background="#FAFBFF";}}}
      onMouseLeave={e=>{ if(!active){e.currentTarget.style.borderColor="#E2E8F0"; e.currentTarget.style.background="white";}}}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:6 }}>
        <div>
          <div style={{ fontSize:12, fontWeight:active?700:500, color:"#0B1D3A" }}>{prod.desc}</div>
          <code style={{ fontSize:9, color:"#94A3B8" }}>{pn}</code>
        </div>
        <div style={{ textAlign:"right", flexShrink:0 }}>
          <div style={{ fontSize:12, fontWeight:700, color:"#0B1D3A" }}>{$(custPrice)}</div>
          {disc > 0 && <div style={{ fontSize:9, color:"#10B981" }}>-{PCT(disc)} off</div>}
        </div>
      </div>
    </button>
  );
}

function AccRow({ pn, label, hint, checked, onChange }) {
  const prod = P(pn);
  if (!prod) return null;
  return (
    <div onClick={() => onChange(!checked)}
      style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 12px", borderRadius:7, border:`1px solid ${checked?"#D97706":"#E2E8F0"}`, background:checked?"#FFFBEB":"white", cursor:"pointer", marginBottom:6 }}>
      <Tog v={checked} />
      <div style={{ flex:1 }}>
        <div style={{ fontSize:13, fontWeight:600, color:"#1A2035" }}>{label}</div>
        {hint && <div style={{ fontSize:11, color:"#94A3B8" }}>{hint}</div>}
      </div>
      <div style={{ textAlign:"right" }}>
        <code style={{ fontSize:10, color:"#94A3B8", display:"block" }}>{pn}</code>
        <span style={{ fontSize:12, fontWeight:700, color:"#0B1D3A" }}>{$(prod.price)}</span>
      </div>
    </div>
  );
}

function StepHeader({ title, sub }) {
  return (
    <div style={{ marginBottom:16 }}>
      <div style={{ fontWeight:700, fontSize:15, color:"#1A2035" }}>{title}</div>
      {sub && <div style={{ fontSize:12, color:"#64748B", marginTop:3 }}>{sub}</div>}
    </div>
  );
}

function Label({ children }) {
  return <div style={{ fontSize:11, fontWeight:700, color:"#64748B", textTransform:"uppercase", letterSpacing:"0.05em", marginBottom:5 }}>{children}</div>;
}

function Counter({ v, min, max, set }) {
  const cap = max ?? 9999;
  return (
    <div style={{ display:"flex", alignItems:"center", gap:0, border:"1px solid #E2E8F0", borderRadius:6, overflow:"hidden", width:"fit-content" }}>
      <button onClick={() => set(Math.max(min, v - 1))}
        style={{ width:32, height:32, background:"#F8FAFC", border:"none", cursor:"pointer", fontSize:18, color:"#374151", fontWeight:600, lineHeight:1 }}>−</button>
      <input
        type="number" value={v} min={min} max={cap}
        onChange={e => {
          const n = parseInt(e.target.value, 10);
          if (!isNaN(n)) set(Math.min(cap, Math.max(min, n)));
        }}
        onBlur={e => { if (e.target.value === "" || isNaN(parseInt(e.target.value))) set(min); }}
        style={{ width:56, height:32, textAlign:"center", fontSize:14, fontWeight:700, color:"#1A2035",
          border:"none", borderLeft:"1px solid #E2E8F0", borderRight:"1px solid #E2E8F0",
          outline:"none", padding:0, background:"white",
          MozAppearance:"textfield" }}
      />
      <button onClick={() => set(Math.min(cap, v + 1))}
        style={{ width:32, height:32, background:"#F8FAFC", border:"none", cursor:"pointer", fontSize:18, color:"#374151", fontWeight:600, lineHeight:1 }}>+</button>
    </div>
  );
}

function Tog({ v }) {
  return (
    <div style={{ width:32, height:18, borderRadius:9, background:v?"#D97706":"#CBD5E1", position:"relative", flexShrink:0, transition:"background 0.15s" }}>
      <div style={{ width:14, height:14, borderRadius:"50%", background:"white", position:"absolute", top:2, left:v?16:2, transition:"left 0.15s", boxShadow:"0 1px 3px rgba(0,0,0,0.2)" }}/>
    </div>
  );
}



// ═══════════════ QUOTE BUILDER (main app) ═══════════════

// ─── PRICE DATA — loaded from /prices.json, fallback to embedded ─────────────
const PRICE_LIST_FALLBACK = [{"pn":"199A10040","desc":"AC Power cord, Australian type (2.5m)","price":6.0,"cat":"C4.3 Power and Grounding cables"},{"pn":"501RG0016","desc":"ML622","price":1145.0,"cat":"A2. ML600 Family"},{"pn":"501RG0046","desc":"ML624","price":1720.0,"cat":"A2. ML600 Family"},{"pn":"501RG0067","desc":"ML638","price":2306.0,"cat":"A2. ML600 Family"},{"pn":"501RG0076","desc":"ML654S","price":3748.0,"cat":"A2. ML600 Family"},{"pn":"501RG0077","desc":"ML658S","price":4430.0,"cat":"A2. ML600 Family"},{"pn":"501RG0078","desc":"ML650SV","price":3308.0,"cat":"A2. ML600 Family"},{"pn":"501RG0106","desc":"ML684M","price":1950.0,"cat":"A2. ML600 Family"},{"pn":"501RG0111","desc":"ML6916EN","price":6554.0,"cat":"A2. ML600 Family"},{"pn":"501RG0115","desc":"ML6916EL","price":6665.0,"cat":"A2. ML600 Family"},{"pn":"501RG0116","desc":"ML644EL","price":3560.0,"cat":"A2. ML600 Family"},{"pn":"501RG0121","desc":"ML622i with 24/48Vdc","price":800.0,"cat":"A2. ML600 Family"},{"pn":"501RG0122","desc":"ML624i with 24/48Vdc","price":1260.0,"cat":"A2. ML600 Family"},{"pn":"501RG0134","desc":"GL850L-16O","price":4251.0,"cat":"A1.1 GL800 Solutions"},{"pn":"501RG0135","desc":"GL850L-16R","price":3917.0,"cat":"A1.1 GL800 Solutions"},{"pn":"501RG0139","desc":"GL830-16O","price":3748.0,"cat":"A1.1 GL800 Solutions"},{"pn":"501RG0140","desc":"GL830-8O","price":3148.0,"cat":"A1.1 GL800 Solutions"},{"pn":"501RG0143","desc":"GL830-16R","price":3330.0,"cat":"A1.1 GL800 Solutions"},{"pn":"501RG0144","desc":"GL830-8R","price":2921.0,"cat":"A1.1 GL800 Solutions"},{"pn":"501RG0167","desc":"GL904","price":1120.0,"cat":"A1.4 GL900 Headend Solutions"},{"pn":"501RG0168","desc":"GL904-R","price":1410.0,"cat":"A1.4 GL900 Headend Solutions"},{"pn":"501RG0217","desc":"ML648E","price":3031.0,"cat":"A2. ML600 Family"},{"pn":"501RG0218","desc":"ML6416E","price":4595.0,"cat":"A2. ML600 Family"},{"pn":"501RG0232","desc":"ML684DTP","price":2295.0,"cat":"A2.1 ML600D Family"},{"pn":"501RG0238","desc":"ML6916E (w/o SyncE)","price":6090.0,"cat":"A2. ML600 Family"},{"pn":"501RG0253","desc":"ML698ES","price":5055.0,"cat":"A2. ML600 Family"},{"pn":"501RG0254","desc":"ML6916ES","price":6550.0,"cat":"A2. ML600 Family"},{"pn":"501RG0259","desc":"ML698E","price":3679.0,"cat":"A2. ML600 Family"},{"pn":"501RG0300","desc":"GL916-R","price":2230.0,"cat":"A1.4 GL900 Headend Solutions"},{"pn":"501RG0301","desc":"GL908-R","price":1680.0,"cat":"A1.4 GL900 Headend Solutions"},{"pn":"501RG0302","desc":"GL916","price":1950.0,"cat":"A1.4 GL900 Headend Solutions"},{"pn":"501RG0303","desc":"GL908","price":1380.0,"cat":"A1.4 GL900 Headend Solutions"},{"pn":"501RG0530","desc":"ML530","price":920.0,"cat":"A5.3 Fiber Rackmount L2 Switches"},{"pn":"501RG2097","desc":"XR239SE Repeater - No Rewiring","price":1260.0,"cat":"A6. Repeater Related Products"},{"pn":"501RG3230","desc":"ML684D (New)","price":1950.0,"cat":"A2.1 ML600D Family"},{"pn":"501RG3231","desc":"ML680DF (New)","price":953.0,"cat":"A2.1 ML600D Family"},{"pn":"501RG3240","desc":"ML622D (New)","price":1374.0,"cat":"A2.1 ML600D Family"},{"pn":"501RG3255","desc":"ML684D-M (12/24V)","price":1995.0,"cat":"A2.1 ML600D Family"},{"pn":"501RG3256","desc":"ML684D-M (48/60V)","price":1995.0,"cat":"A2.1 ML600D Family"},{"pn":"501RG3355","desc":"ML684DL-M (12/24V)","price":2795.0,"cat":"A2.1 ML600D Family"},{"pn":"501RG3356","desc":"ML684DL-M (48/60V)","price":2795.0,"cat":"A2.1 ML600D Family"},{"pn":"501RG3358","desc":"ML684DLP-M","price":2989.0,"cat":"A2.1 ML600D Family"},{"pn":"501RG3376","desc":"ML680DL-M (48/60V)","price":2019.0,"cat":"A2.1 ML600D Family"},{"pn":"501RG3378","desc":"ML680DLP-M","price":1410.0,"cat":"A2.1 ML600D Family"},{"pn":"501S20435","desc":"ML2300 Bundle: CHS-2000B + SDU-450 + MLU-64DR","price":22523.0,"cat":"A4.7 ML2300 Configuration Examples"},{"pn":"501S20436","desc":"ML230 Bundle: CHS-200 + SDU-450 + MLU-64DR","price":20666.0,"cat":"A4.6 ML230 Configuration Examples"},{"pn":"501S20441","desc":"ML230 Bundle: CHS-200 + SDU-450 + MLU-64DF","price":20666.0,"cat":"A4.6 ML230 Configuration Examples"},{"pn":"501S20442","desc":"ML230 Bundle: CHS-200 + SDU-450 + MLU-32DF","price":17797.0,"cat":"A4.6 ML230 Configuration Examples"},{"pn":"501S20443","desc":"ML230 Bundle: CHS-200 + SDU-450 + MLU-32DR","price":17797.0,"cat":"A4.6 ML230 Configuration Examples"},{"pn":"501S61245E","desc":"GL91 (EU/US)","price":150.0,"cat":"A1.5 GL900 CPEs"},{"pn":"501S61246","desc":"GL91T","price":120.0,"cat":"A1.5 GL900 CPEs"},{"pn":"501S61247","desc":"GL91T-RB","price":195.0,"cat":"A1.5 GL900 CPEs"},{"pn":"502R02110","desc":"Chassis 2000B Shelf (CHS-2000B/19)","price":2985.0,"cat":"A4.1 Shelves"},{"pn":"502R20230","desc":"Chassis 200 Shelf","price":1127.0,"cat":"A4.1 Shelves"},{"pn":"503R20132","desc":"MLU-32DF (32 copper pairs, front access)","price":6325.0,"cat":"A4.3 MLU (Multiport Line Units)"},{"pn":"503R20164","desc":"MLU-64DF (64 copper pairs, front access)","price":9195.0,"cat":"A4.3 MLU (Multiport Line Units)"},{"pn":"503R20232","desc":"MLU-32DR (32 copper pairs, rear access)","price":6325.0,"cat":"A4.3 MLU (Multiport Line Units)"},{"pn":"503R20264","desc":"MLU-64DR (64 copper pairs, rear access)","price":9195.0,"cat":"A4.3 MLU (Multiport Line Units)"},{"pn":"503R60042","desc":"Service Dispatcher Unit (SDU-450)","price":10345.0,"cat":"A4.2 SDU (Service Dispatch Units)"},{"pn":"503R60043","desc":"Service Dispatcher Unit (SDU-450G)","price":11495.0,"cat":"A4.2 SDU (Service Dispatch Units)"},{"pn":"503RG3088","desc":"ABA LP ER 2.0","price":863.0,"cat":"A8.1 BBA Cards"},{"pn":"503RG3104","desc":"VBA 3.0","price":920.0,"cat":"A8.1 BBA Cards"},{"pn":"503RG3107","desc":"VBA 3.0E","price":966.0,"cat":"A8.1 BBA Cards"},{"pn":"503RG3110","desc":"ABA 3.0","price":805.0,"cat":"A8.1 BBA Cards"},{"pn":"503RG3111","desc":"ABA 3.0E","price":851.0,"cat":"A8.1 BBA Cards"},{"pn":"504R20110","desc":"DSL Quad Cable, 4xRJ-45, 10ft/3m","price":46.0,"cat":"C4.1 DSL Cables"},{"pn":"504R20120","desc":"DSL Octal Cable, 8xRJ-45, 10ft/3m","price":69.0,"cat":"C4.1 DSL Cables"},{"pn":"506R00002","desc":"1000Base-LX SMF SFP module (10km)","price":68.0,"cat":"C1. SFP Transceivers"},{"pn":"506R00006","desc":"AC-DC power supply for ML600/ML740/ML530 (NA)","price":110.0,"cat":"A3.1 Power Supplies for GL800/GL900/ML500/ML600/ML700"},{"pn":"506R00006E","desc":"AC-DC power supply for ML600/ML740/ML530 (EU)","price":110.0,"cat":"A3.1 Power Supplies for GL800/GL900/ML500/ML600/ML700"},{"pn":"506R00008","desc":"AC-DC power supply for GL900 (NA)","price":58.0,"cat":"A3.1 Power Supplies for GL800/GL900/ML500/ML600/ML700"},{"pn":"506R00008U","desc":"AC-DC power supply for GL900 (UK)","price":58.0,"cat":"A3.1 Power Supplies for GL800/GL900/ML500/ML600/ML700"},{"pn":"506R00012","desc":"1000Base-SX MMF SFP module (500m)","price":68.0,"cat":"C1. SFP Transceivers"},{"pn":"506R00013","desc":"AC/DC power supply for GL800 (NA)","price":138.0,"cat":"A3.1 Power Supplies for GL800/GL900/ML500/ML600/ML700"},{"pn":"506R00013E","desc":"AC/DC power supply for GL800 (EU)","price":138.0,"cat":"A3.1 Power Supplies for GL800/GL900/ML500/ML600/ML700"},{"pn":"506R00022","desc":"100Base-FX MMF SFP module (2km)","price":115.0,"cat":"C1. SFP Transceivers"},{"pn":"506R00032","desc":"100Base-FX SMF SFP module (15km)","price":68.0,"cat":"C1. SFP Transceivers"},{"pn":"506R00042","desc":"1000Base-T SFP module","price":103.0,"cat":"C1. SFP Transceivers"},{"pn":"506R0116R","desc":"ML632R","price":1299.0,"cat":"A9. L3 CPEs"},{"pn":"506R0146R","desc":"ML634R","price":2297.0,"cat":"A9. L3 CPEs"},{"pn":"506R30070","desc":"Fan Control Module for CHS-2000B/19","price":685.0,"cat":"A4.5 CHS-2000 Related Items"},{"pn":"506R61154","desc":"2500Base-FX SMF SFP (30Km)","price":289.0,"cat":"C1. SFP Transceivers"},{"pn":"506R61155","desc":"2500Base-FX MMF SFP (500m)","price":127.0,"cat":"C1. SFP Transceivers"},{"pn":"506R61181","desc":"DIN Rail PSU 24VDC for ML600Dx","price":156.0,"cat":"A3.1 Power Supplies for GL800/GL900/ML500/ML600/ML700"},{"pn":"506R61184","desc":"DIN Rail PSU 24VDC + EU Cables","price":184.0,"cat":"A3.1 Power Supplies for GL800/GL900/ML500/ML600/ML700"},{"pn":"506R61185","desc":"DIN Rail PSU 24VDC + US Cables","price":184.0,"cat":"A3.1 Power Supplies for GL800/GL900/ML500/ML600/ML700"},{"pn":"506R61191","desc":"DIN Rail PSU 48VDC with PoE","price":225.0,"cat":"A3.1 Power Supplies for GL800/GL900/ML500/ML600/ML700"},{"pn":"506R61213","desc":"100/1000Base-T SFP","price":103.0,"cat":"C1. SFP Transceivers"},{"pn":"506R61235","desc":"10G BASE-LR SFP+ Module (10Km)","price":147.0,"cat":"C1. SFP Transceivers"},{"pn":"506R61245","desc":"GL91","price":110.0,"cat":"A1.5 GL900 CPEs"},{"pn":"506R61334","desc":"GL9110C","price":1800.0,"cat":"A1.2 GL9000 Headend Solutions"},{"pn":"506R61335","desc":"GL901CS","price":162.0,"cat":"A1.2 GL9000 Headend Solutions"},{"pn":"506R61336","desc":"GL93C-W","price":257.0,"cat":"A1.3 GL9000 CPEs"},{"pn":"506R61337","desc":"GL93C","price":110.0,"cat":"A1.3 GL9000 CPEs"},{"pn":"506R61342","desc":"GL9104C","price":1550.0,"cat":"A1.2 GL9000 Headend Solutions"},{"pn":"506R62006","desc":"ML540M AC","price":1680.0,"cat":"A5.3 Fiber Rackmount L2 Switches"},{"pn":"506R62016","desc":"ML540M DC","price":1460.0,"cat":"A5.3 Fiber Rackmount L2 Switches"},{"pn":"510K00060","desc":"Accessories Kit for ML600/ML700/ML530","price":23.0,"cat":"A3.2 GL800/GL900ML500/ML600/ML700 Related Items"},{"pn":"510K20230","desc":"Accessories Kit for CHS-200","price":115.0,"cat":"A4.4 CHS-200 Related Items"},{"pn":"510R21080","desc":"Wall Mount Kit for ML600/ML700/GL800/GL900","price":52.0,"cat":"A3.2 GL800/GL900ML500/ML600/ML700 Related Items"},{"pn":"550A00046","desc":"Flash Card for SDU-450/G","price":173.0,"cat":"A4.5 CHS-2000 Related Items"},{"pn":"EMSL00109","desc":"EMS perpetual SNMP NB Interface License","price":25000.0,"cat":"B2.3 MetaASSIST EMS Feature Licenses"},{"pn":"EMSL00113","desc":"EMS Annual SNMP NE Licenses - up to 10 Devices","price":200.0,"cat":"B2.2 MetaASSIST EMS NE License Keys"},{"pn":"EMSL00114","desc":"EMS Annual SNMP NE Licenses - up to 50 Devices","price":1000.0,"cat":"B2.2 MetaASSIST EMS NE License Keys"},{"pn":"EMSL00115","desc":"EMS Annual SNMP NE Licenses - up to 100 Devices","price":1800.0,"cat":"B2.2 MetaASSIST EMS NE License Keys"},{"pn":"EMSL40001","desc":"MetaASSIST EMS perpetual Site license up to 100 devices","price":10000.0,"cat":"B2.1 MetaASSIST EMS Site Licenses"},{"pn":"EMSL40100","desc":"EMS annual Node license ML600/ML500/ML700 bundle of 10","price":750.0,"cat":"B2.2 MetaASSIST EMS NE License Keys"},{"pn":"EMSL40107","desc":"EMS annual Node license ML2300/ML230 bundle of 5","price":950.0,"cat":"B2.2 MetaASSIST EMS NE License Keys"}];
const DISCOUNTS_FALLBACK = [{"cat":"A1.1 GL800 Solutions","naReseller":0.33,"naEndUser":0.33,"regBonus":0.07,"emeaReseller":0.4,"emeaEndUser":0.3},{"cat":"A1.2 GL9000 Headend Solutions","naReseller":0.33,"naEndUser":0.33,"regBonus":0.07,"emeaReseller":0.15,"emeaEndUser":0.1},{"cat":"A1.3 GL9000 CPEs","naReseller":0.1,"naEndUser":0.05,"regBonus":0.0,"emeaReseller":0.1,"emeaEndUser":0.05},{"cat":"A1.4 GL900 Headend Solutions","naReseller":0.33,"naEndUser":0.33,"regBonus":0.07,"emeaReseller":0.15,"emeaEndUser":0.1},{"cat":"A1.5 GL900 CPEs","naReseller":0.1,"naEndUser":0.05,"regBonus":0.0,"emeaReseller":0.1,"emeaEndUser":0.05},{"cat":"A2. ML600 Family","naReseller":0.33,"naEndUser":0.33,"regBonus":0.07,"emeaReseller":0.4,"emeaEndUser":0.3},{"cat":"A2.1 ML600D Family","naReseller":0.33,"naEndUser":0.33,"regBonus":0.07,"emeaReseller":0.4,"emeaEndUser":0.3},{"cat":"A3.1 Power Supplies for GL800/GL900/ML500/ML600/ML700","naReseller":0.33,"naEndUser":0.33,"regBonus":0.07,"emeaReseller":0.4,"emeaEndUser":0.3},{"cat":"A3.2 GL800/GL900ML500/ML600/ML700 Related Items","naReseller":0.33,"naEndUser":0.33,"regBonus":0.07,"emeaReseller":0.4,"emeaEndUser":0.3},{"cat":"A4.1 Shelves","naReseller":0.33,"naEndUser":0.33,"regBonus":0.07,"emeaReseller":0.4,"emeaEndUser":0.3},{"cat":"A4.2 SDU (Service Dispatch Units)","naReseller":0.33,"naEndUser":0.33,"regBonus":0.07,"emeaReseller":0.4,"emeaEndUser":0.3},{"cat":"A4.3 MLU (Multiport Line Units)","naReseller":0.33,"naEndUser":0.33,"regBonus":0.07,"emeaReseller":0.4,"emeaEndUser":0.3},{"cat":"A4.4 CHS-200 Related Items","naReseller":0.33,"naEndUser":0.33,"regBonus":0.07,"emeaReseller":0.4,"emeaEndUser":0.3},{"cat":"A4.5 CHS-2000 Related Items","naReseller":0.33,"naEndUser":0.33,"regBonus":0.07,"emeaReseller":0.4,"emeaEndUser":0.3},{"cat":"A4.6 ML230 Configuration Examples","naReseller":0.33,"naEndUser":0.33,"regBonus":0.07,"emeaReseller":0.4,"emeaEndUser":0.3},{"cat":"A4.7 ML2300 Configuration Examples","naReseller":0.33,"naEndUser":0.33,"regBonus":0.07,"emeaReseller":0.4,"emeaEndUser":0.3},{"cat":"A8.1 BBA Cards","naReseller":0.33,"naEndUser":0.33,"regBonus":0.07,"emeaReseller":0.4,"emeaEndUser":0.3},{"cat":"B2.1 MetaASSIST EMS Site Licenses","naReseller":0.33,"naEndUser":0.33,"regBonus":0.07,"emeaReseller":0.3,"emeaEndUser":0.2},{"cat":"B2.2 MetaASSIST EMS NE License Keys","naReseller":0.33,"naEndUser":0.33,"regBonus":0.07,"emeaReseller":0.3,"emeaEndUser":0.2},{"cat":"B2.3 MetaASSIST EMS Feature Licenses","naReseller":0.33,"naEndUser":0.33,"regBonus":0.07,"emeaReseller":0.3,"emeaEndUser":0.2},{"cat":"C1. SFP Transceivers","naReseller":0.1,"naEndUser":0.0,"regBonus":0.0,"emeaReseller":0.1,"emeaEndUser":0.0},{"cat":"C4.1 DSL Cables","naReseller":0.1,"naEndUser":0.0,"regBonus":0.0,"emeaReseller":0.1,"emeaEndUser":0.0},{"cat":"C4.3 Power and Grounding cables","naReseller":0.1,"naEndUser":0.0,"regBonus":0.0,"emeaReseller":0.1,"emeaEndUser":0.0}];
const SVC_FALLBACK = [{"pn":"SVC-ADVREP","desc":"Advanced HW Replacement Service","lpString":"5% of Purchase Price / yr","listPrice":0.05,"cat":"D2.1 Extended Warranty"},{"pn":"SVC-BRONZE","desc":"Bronze Support","lpString":"4% of Purchase Price / yr","listPrice":0.04,"cat":"D2.2 Support Programs"},{"pn":"SVC-GOLD","desc":"Gold Support","lpString":"6% of Purchase Price / yr","listPrice":0.06,"cat":"D2.2 Support Programs"},{"pn":"SVC-GOLD+","desc":"Gold Plus Support","lpString":"9% of Purchase Price / yr","listPrice":0.09,"cat":"D2.2 Support Programs"},{"pn":"SVC-PLAT","desc":"Platinum Support","lpString":"8% of Purchase Price / yr","listPrice":0.08,"cat":"D2.2 Support Programs"},{"pn":"SVC-REM1YR","desc":"Telephone Assistance, per year","lpString":"1.5% of Purchase Price / yr","listPrice":0.015,"cat":"D2.1 Extended Warranty"},{"pn":"SVC-EXTHW1","desc":"Extended FR&R HW Warranty","lpString":"2% of Purchase Price / yr","listPrice":0.02,"cat":"D2.1 Extended Warranty"},{"pn":"SVC-NETANA","desc":"Network Analysis","lpString":"$350/hr + expenses","listPrice2":350,"cat":"D2.5 Prof. Services"},{"pn":"SVC-ONSINS","desc":"Onsite Installation Assistance","lpString":"$2,500/day + T&E","listPrice2":2500,"cat":"D2.5 Prof. Services"}];


const REGIONS_MAIN = [{id:4,name:"EMEA"},{id:6,name:"NA"},{id:5,name:"Enterprise"},{id:2,name:"APAC"},{id:3,name:"CALA"}];
const EMEA_IDS_MAIN = [4,2,3];
const PAYMENTS = ["Net 30 days","Net 45 days","Net 60 days","Net 90 days","Net 120 days","Net 150 days","Pre-Paid"];
const SHIPPINGS = ["ExWorks","FOB","FOB Destination","DDU","DDP","FCA IL, Rosh Haayin"];
const STATUSES = ["New","In Progress","Ready","Approved","Submitted"];
const SC = {New:"#3B82F6","In Progress":"#F59E0B",Ready:"#10B981",Approved:"#059669",Submitted:"#8B5CF6"};

function getDiscMain(cat,rid,ct,dr,discArr){
  const d=(discArr||[]).find(r=>r.cat===cat);
  if(!d)return 0;
  const e=EMEA_IDS_MAIN.includes(rid),eu=ct==="End Customer";
  let v=e?(eu?d.emeaEndUser:d.emeaReseller):(eu?d.naEndUser:d.naReseller);
  if(!e&&dr)v=Math.min(v+d.regBonus,1);
  return v;
}

const $M=n=>new Intl.NumberFormat("en-US",{style:"currency",currency:"USD"}).format(n||0);
const PM=n=>(n*100).toFixed(1)+"%";
const TDM=()=>new Date().toISOString().split("T")[0];
const ADM=(d,n)=>{const x=new Date(d);x.setDate(x.getDate()+n);return x.toISOString().split("T")[0];};
let _quid=1000;

// ─── IMPORT PDF MODAL ────────────────────────────────────────────────────────
function ImportPdfModal({ priceList, discounts, onImport, onClose }) {
  const [status, setStatus] = useState("idle"); // idle | parsing | done | error
  const [msg,    setMsg]    = useState("");
  const [preview, setPreview] = useState(null);
  const fileRef = useRef();

  const parseDateStr = s => {
    if (!s) return "";
    // Try M/D/YYYY → YYYY-MM-DD
    const m = s.trim().match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    if (m) return `${m[3]}-${m[1].padStart(2,"0")}-${m[2].padStart(2,"0")}`;
    return s;
  };

  const handleFile = async (file) => {
    if (!file || !file.name.endsWith(".pdf")) { setMsg("Please select a PDF file."); return; }
    setStatus("parsing"); setMsg("Reading PDF…");
    try {
      // Load pdf.js from CDN
      if (!window.pdfjsLib) {
        await new Promise((res, rej) => {
          const s = document.createElement("script");
          s.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.min.js";
          s.onload = res; s.onerror = rej;
          document.head.appendChild(s);
        });
        window.pdfjsLib.GlobalWorkerOptions.workerSrc =
          "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js";
      }
      const ab  = await file.arrayBuffer();
      const pdf = await window.pdfjsLib.getDocument({ data: ab }).promise;
      let fullText = "";
      for (let p = 1; p <= pdf.numPages; p++) {
        const page  = await pdf.getPage(p);
        const tc    = await page.getTextContent();
        fullText   += tc.items.map(i => i.str).join(" ") + "\n";
      }

      // ── Smarter field extraction ───────────────────────────────────────
      // pdf.js merges the two-column header into one stream.
      // Strategy: find each labelled value by stopping before the NEXT known label.
      const STOP = "Customer\\s*Contact|Customer\\s*Name|Quotation|Address:|Phone(?:/Fax)?:|Email:|Date:|Quote\\s*Valid|Payment\\s*Terms|Shipping\\s*Terms|Quoted\\s*By|Site\\s*Name|Part\\s*Number";
      const grab = (pattern) => { const m = fullText.match(pattern); return m ? m[1].trim() : ""; };
      const cleanVal = (s, max=60) => s.replace(/\b(?:Customer Contact|Address|Phone(?:\/Fax)?|Email|Date|Quote Valid Until|Payment Terms|Shipping Terms|Quoted By)\b.*$/si,"").replace(/\s+/g," ").trim().substring(0,max);

      // Quotation # — grab everything up to first space-separated word after label, stop at known labels
      const qnRaw = grab(/Quotation\s*#[:\s]+(.+?)(?=Customer\s*Name|Customer\s*Contact|Date:|$)/si);
      const qn    = cleanVal(qnRaw, 60);

      // Customer Name — stop before any other label
      const custRaw = grab(/Customer\s*Name[:\s]+(.+?)(?=Customer\s*Contact|Quotation|Address:|Phone|Date:|$)/si);
      const cust    = cleanVal(custRaw, 60);

      // Contact — value directly after label, stop before next label
      const contRaw = grab(/Customer\s*Contact[:\s]+(.+?)(?=Address:|Phone|Email:|Date:|Quotation|$)/si);
      // If the value looks like just a label word, it's blank in source PDF
      const cont = /^(Address|Phone|Email|Date|Quote)/.test(contRaw.trim()) ? "" : cleanVal(contRaw, 60);

      const addrRaw = grab(/Address[:\s]+(.+?)(?=Phone(?:\/Fax)?:|Email:|Date:|Quote|$)/si);
      const addr = /^(Phone|Email|Date|Quote)/.test(addrRaw.trim()) ? "" : cleanVal(addrRaw, 80);

      const phoneRaw = grab(/Phone(?:\/Fax)?[:\s]+(.+?)(?=Email:|Date:|Quote|$)/si);
      const phone = /^(Email|Date|Quote)/.test(phoneRaw.trim()) ? "" : cleanVal(phoneRaw, 40);

      const emailRaw = grab(/Email[:\s]+(.+?)(?=Date:|Quote\s*Valid|Payment|$)/si);
      const email = /^(Date|Quote|Payment)/.test(emailRaw.trim()) ? "" : cleanVal(emailRaw, 60);

      const qby  = cleanVal(grab(/Quoted\s*By[:\s]+(.+?)(?=Site|Part\s*Number|$)/si), 40);

      const dtRaw  = grab(/(?<!\/)Date[:\s]+(\d{1,2}\/\d{1,2}\/\d{4})/i);
      const expRaw = grab(/Quote\s*Valid\s*Until[:\s]+(\d{1,2}\/\d{1,2}\/\d{4})/i);

      const payRaw = grab(/Payment\s*Terms[:\s]+(.+?)(?=Shipping|Quoted|$)/si);
      const pay    = cleanVal(payRaw, 40) || "Net 30 days";

      const shipRaw = grab(/Shipping\s*Terms[:\s]+(.+?)(?=Quoted|Part\s*Number|$)/si);
      const ship    = cleanVal(shipRaw, 40) || "FOB";

      // ── Extract line items ─────────────────────────────────────────────
      // Actelis HW PNs: 3 digits + uppercase letter + more alphanumeric (e.g. 506R61254, 501RG0106)
      // Service PNs: SVC- prefix
      // Explicitly EXCLUDE pure-digit strings (like "092324" from quote number)
      const PN_RE = /(?:^|\s)((?:\d{3}[A-Z][A-Z0-9]{2,}|SVC-[A-Z0-9]+))\s+(.+?)\s+\$([\d,]+\.?\d*)\s+(\d+)\s+\$([\d,]+\.?\d*)/g;
      const parsedLines = [];
      let m;
      while ((m = PN_RE.exec(fullText)) !== null) {
        const pn      = m[1];
        const descRaw = m[2].trim();
        const unitP   = parseFloat(m[3].replace(/,/g,""));
        const qty     = parseInt(m[4]);

        // Skip totals rows
        if (/^(Total|Grand)/i.test(pn)) continue;
        if (/^total/i.test(descRaw)) continue;

        // Look up in catalog for canonical desc + list price
        const cat    = priceList.find(p => p.pn === pn);
        const lp     = cat?.price || unitP;
        const disc   = lp > 0 ? Math.max(0, Math.min(0.99, Math.round((1 - unitP/lp)*1000)/1000)) : 0;
        const desc   = cat?.desc || descRaw.replace(/\$([\d,]+\.?\d*)/g,"").replace(/\s+/g," ").trim().substring(0,120);

        parsedLines.push({
          pn, desc, cat: cat?.cat || "A. Custom",
          qty, listPrice: lp, discount: disc, site: "",
        });
      }

      if (parsedLines.length === 0) {
        setStatus("error");
        setMsg("Could not extract line items. Make sure this is an Actelis quote PDF.");
        return;
      }

      const result = {
        qn, cust, cont, addr, phone, email, qby,
        dt: parseDateStr(dtRaw), exp: parseDateStr(expRaw),
        pay, ship, lines: parsedLines,
      };
      setPreview(result);
      setStatus("done");
      setMsg(`Found ${parsedLines.length} line item(s).`);
    } catch(e) {
      setStatus("error");
      setMsg("Parse error: " + e.message);
    }
  };

  const OV = { position:"fixed",inset:0,zIndex:1000,background:"rgba(11,29,58,0.7)",display:"flex",alignItems:"center",justifyContent:"center",backdropFilter:"blur(3px)" };
  const BOX = { background:"white",borderRadius:12,width:"min(640px,94vw)",maxHeight:"85vh",overflow:"hidden",display:"flex",flexDirection:"column",boxShadow:"0 20px 60px rgba(0,0,0,0.3)" };

  return (
    <div style={OV} onClick={e=>{if(e.target===e.currentTarget)onClose();}}>
      <div style={BOX}>
        <div style={{background:"#0B1D3A",padding:"14px 18px",display:"flex",justifyContent:"space-between",alignItems:"center",flexShrink:0}}>
          <div style={{color:"#D97706",fontWeight:800,fontSize:14,letterSpacing:"0.06em"}}>📥 IMPORT ACTELIS QUOTE PDF</div>
          <button onClick={onClose} style={{background:"none",border:"none",color:"#64748B",fontSize:22,cursor:"pointer"}}>×</button>
        </div>
        <div style={{padding:20,overflowY:"auto",flex:1}}>
          {status !== "done" && (
            <>
              <p style={{fontSize:13,color:"#475569",marginBottom:14}}>
                Drop in an existing Actelis quote PDF. The tool will extract customer details, dates, and line items automatically.
              </p>
              <div
                onClick={()=>fileRef.current.click()}
                onDrop={e=>{e.preventDefault();handleFile(e.dataTransfer.files[0]);}}
                onDragOver={e=>e.preventDefault()}
                style={{border:"2px dashed #CBD5E1",borderRadius:10,padding:"30px 20px",textAlign:"center",cursor:"pointer",background:"#F8FAFC"}}>
                <div style={{fontSize:32,marginBottom:8}}>📄</div>
                <div style={{fontWeight:700,color:"#1A2035",fontSize:14}}>Click to browse or drag & drop PDF here</div>
                <div style={{fontSize:12,color:"#94A3B8",marginTop:4}}>Actelis quote PDFs (V3.x format)</div>
                <input ref={fileRef} type="file" accept=".pdf" style={{display:"none"}}
                  onChange={e=>handleFile(e.target.files[0])} />
              </div>
              {msg && (
                <div style={{marginTop:12,padding:"10px 14px",borderRadius:8,background:status==="error"?"#FEF2F2":"#EFF6FF",color:status==="error"?"#B91C1C":"#1D4ED8",fontSize:13,fontWeight:500}}>
                  {status==="parsing"?"⏳ ":status==="error"?"❌ ":""}{msg}
                </div>
              )}
            </>
          )}

          {status === "done" && preview && (
            <>
              <div style={{marginBottom:12,padding:"10px 14px",borderRadius:8,background:"#F0FDF4",color:"#166534",fontSize:13,fontWeight:600}}>
                ✅ {msg} Review below and click Import to load into the tool.
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"4px 16px",marginBottom:14,fontSize:12}}>
                {[
                  ["Quotation #", preview.qn],
                  ["Customer",    preview.cust],
                  ["Contact",     preview.cont],
                  ["Date",        preview.dt],
                  ["Expiry",      preview.exp],
                  ["Quoted By",   preview.qby],
                  ["Payment",     preview.pay],
                  ["Shipping",    preview.ship],
                ].map(([k,v])=>v?(
                  <div key={k} style={{display:"flex",gap:6,padding:"3px 0",borderBottom:"1px solid #F1F5F9"}}>
                    <span style={{color:"#94A3B8",minWidth:72,fontWeight:600}}>{k}</span>
                    <span style={{color:"#1A2035"}}>{v}</span>
                  </div>
                ):null)}
              </div>
              <div style={{fontWeight:700,fontSize:12,color:"#475569",marginBottom:6,textTransform:"uppercase"}}>Line Items ({preview.lines.length})</div>
              <div style={{border:"1px solid #E2E8F0",borderRadius:7,overflow:"hidden",marginBottom:14}}>
                {preview.lines.map((l,i)=>(
                  <div key={i} style={{display:"grid",gridTemplateColumns:"90px 1fr 40px 70px",padding:"6px 10px",borderBottom:"1px solid #F8FAFC",fontSize:11,alignItems:"center",background:i%2?"white":"#FAFBFF"}}>
                    <code style={{color:"#0B1D3A",fontWeight:700}}>{l.pn}</code>
                    <span style={{color:"#1A2035"}}>{l.desc.substring(0,60)}</span>
                    <span style={{textAlign:"center",color:"#475569"}}>{l.qty}</span>
                    <span style={{textAlign:"right",fontWeight:700,color:"#0B1D3A"}}>${(l.listPrice*(1-l.discount)*l.qty).toLocaleString("en-US",{minimumFractionDigits:2})}</span>
                  </div>
                ))}
              </div>
              <div style={{display:"flex",gap:8}}>
                <button onClick={()=>{setStatus("idle");setMsg("");setPreview(null);}}
                  style={{flex:1,padding:"9px",border:"1px solid #E2E8F0",borderRadius:7,background:"white",fontSize:13,fontWeight:600,cursor:"pointer",color:"#475569"}}>
                  ← Try Another
                </button>
                <button onClick={()=>onImport(preview)}
                  style={{flex:2,padding:"9px",background:"#0B1D3A",border:"none",borderRadius:7,color:"white",fontSize:14,fontWeight:700,cursor:"pointer"}}>
                  ✅ Import into Quote
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── CUSTOM LINE ITEM MODAL ───────────────────────────────────────────────────
function CustomLineModal({ onAdd, onClose }) {
  const CATS = ["A1. GL Solutions","A2. ML600 Family","A2.1 ML600D Family","A3. Accessories","A4. ML230/ML2300","A5. Fiber Switches","A. Custom Item","B. Software","C. SFP / Cables","D. Services"];
  const [pn,   setPn]   = useState("");
  const [desc, setDesc] = useState("");
  const [cat,  setCat]  = useState("A. Custom Item");
  const [lp,   setLp]   = useState("");
  const [disc, setDisc] = useState("0");
  const [qty,  setQty]  = useState(1);
  const [site, setSite] = useState("");

  const listP  = parseFloat(lp)  || 0;
  const discP  = parseFloat(disc)/100 || 0;
  const unitP  = listP * (1 - discP);
  const totalP = unitP * qty;
  const inp    = {width:"100%",padding:"7px 9px",border:"1px solid #E2E8F0",borderRadius:6,fontSize:13,outline:"none",boxSizing:"border-box"};

  const canAdd = pn.trim() && desc.trim() && listP > 0;

  const OV  = { position:"fixed",inset:0,zIndex:1001,background:"rgba(11,29,58,0.7)",display:"flex",alignItems:"center",justifyContent:"center",backdropFilter:"blur(3px)" };
  const BOX = { background:"white",borderRadius:12,width:"min(520px,94vw)",boxShadow:"0 20px 60px rgba(0,0,0,0.3)" };

  return (
    <div style={OV} onClick={e=>{if(e.target===e.currentTarget)onClose();}}>
      <div style={BOX}>
        <div style={{background:"#0B1D3A",padding:"14px 18px",display:"flex",justifyContent:"space-between",alignItems:"center",borderRadius:"12px 12px 0 0"}}>
          <div style={{color:"#D97706",fontWeight:800,fontSize:14,letterSpacing:"0.06em"}}>✏️ CUSTOM / NON-CATALOG LINE ITEM</div>
          <button onClick={onClose} style={{background:"none",border:"none",color:"#64748B",fontSize:22,cursor:"pointer"}}>×</button>
        </div>
        <div style={{padding:20}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
            <div>
              <div style={{fontSize:11,fontWeight:700,color:"#64748B",marginBottom:3,textTransform:"uppercase"}}>Part Number *</div>
              <input style={inp} value={pn} onChange={e=>setPn(e.target.value)} placeholder="e.g. CUST-001 or NPI-2024" />
            </div>
            <div>
              <div style={{fontSize:11,fontWeight:700,color:"#64748B",marginBottom:3,textTransform:"uppercase"}}>Category</div>
              <select style={inp} value={cat} onChange={e=>setCat(e.target.value)}>
                {CATS.map(c=><option key={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div style={{marginBottom:10}}>
            <div style={{fontSize:11,fontWeight:700,color:"#64748B",marginBottom:3,textTransform:"uppercase"}}>Description *</div>
            <input style={inp} value={desc} onChange={e=>setDesc(e.target.value)} placeholder="Full product description" />
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:10,marginBottom:10}}>
            <div>
              <div style={{fontSize:11,fontWeight:700,color:"#64748B",marginBottom:3,textTransform:"uppercase"}}>List Price *</div>
              <input style={inp} type="number" min="0" step="0.01" value={lp} onChange={e=>setLp(e.target.value)} placeholder="0.00" />
            </div>
            <div>
              <div style={{fontSize:11,fontWeight:700,color:"#64748B",marginBottom:3,textTransform:"uppercase"}}>Discount %</div>
              <input style={inp} type="number" min="0" max="100" step="0.5" value={disc} onChange={e=>setDisc(e.target.value)} placeholder="0" />
            </div>
            <div>
              <div style={{fontSize:11,fontWeight:700,color:"#64748B",marginBottom:3,textTransform:"uppercase"}}>Qty</div>
              <input style={inp} type="number" min="1" value={qty} onChange={e=>setQty(Math.max(1,parseInt(e.target.value)||1))} />
            </div>
            <div>
              <div style={{fontSize:11,fontWeight:700,color:"#64748B",marginBottom:3,textTransform:"uppercase"}}>Site Label</div>
              <input style={inp} value={site} onChange={e=>setSite(e.target.value)} placeholder="Optional" />
            </div>
          </div>

          {listP > 0 && (
            <div style={{padding:"10px 14px",background:"#F8FAFC",borderRadius:8,border:"1px solid #E2E8F0",marginBottom:14,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <span style={{fontSize:12,color:"#64748B"}}>Unit: <b>${unitP.toLocaleString("en-US",{minimumFractionDigits:2})}</b>  × {qty}</span>
              <span style={{fontWeight:800,fontSize:15,color:"#0B1D3A"}}>Total: ${totalP.toLocaleString("en-US",{minimumFractionDigits:2})}</span>
            </div>
          )}

          <div style={{display:"flex",gap:8}}>
            <button onClick={onClose} style={{flex:1,padding:"9px",border:"1px solid #E2E8F0",borderRadius:7,background:"white",fontSize:13,fontWeight:600,cursor:"pointer",color:"#475569"}}>
              Cancel
            </button>
            <button disabled={!canAdd} onClick={()=>onAdd({pn:pn.trim(),desc:desc.trim(),cat,listPrice:listP,discount:discP,qty,site})}
              style={{flex:2,padding:"9px",background:canAdd?"#0B1D3A":"#CBD5E1",border:"none",borderRadius:7,color:"white",fontSize:14,fontWeight:700,cursor:canAdd?"pointer":"not-allowed"}}>
              ✅ Add to Quote
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── PN REPLACEMENTS MANAGER ─────────────────────────────────────────────────
function ReplaceModal({ priceList, services, replacements, onSave, onClose }) {
  const allItems = [...(priceList||[]), ...(services||[])];
  const findP = pn => allItems.find(x=>x.pn===pn);
  const [pairs, setPairs] = useState(
    Object.entries(replacements||{}).map(([oldPn,newPn])=>({oldPn,newPn,id:Math.random()}))
  );
  const [oldQ,  setOldQ]  = useState("");
  const [newQ,  setNewQ]  = useState("");
  const [oldRes,setOldRes]= useState([]);
  const [newRes,setNewRes]= useState([]);
  const [pOld,  setPOld]  = useState(null);
  const [pNew,  setPNew]  = useState(null);

  const search = q => !q.trim() ? [] :
    allItems.filter(p=>p.pn.toLowerCase().includes(q.toLowerCase())||p.desc.toLowerCase().includes(q.toLowerCase())).slice(0,8);

  const inp = {width:"100%",padding:"7px 9px",border:"1px solid #E2E8F0",borderRadius:6,fontSize:12,outline:"none",boxSizing:"border-box",background:"white"};
  const OV  = {position:"fixed",inset:0,zIndex:1002,background:"rgba(11,29,58,0.78)",display:"flex",alignItems:"center",justifyContent:"center",backdropFilter:"blur(3px)"};
  const BOX = {background:"white",borderRadius:12,width:"min(660px,96vw)",maxHeight:"90vh",overflow:"hidden",display:"flex",flexDirection:"column",boxShadow:"0 24px 80px rgba(0,0,0,0.35)"};

  const addPair = () => {
    if (!pOld || !pNew || pOld.pn===pNew.pn) return;
    setPairs(prev=>[...prev.filter(p=>p.oldPn!==pOld.pn), {oldPn:pOld.pn, newPn:pNew.pn, id:Math.random()}]);
    setPOld(null); setPNew(null); setOldQ(""); setNewQ(""); setOldRes([]); setNewRes([]);
  };

  const save = () => {
    const obj={};
    pairs.forEach(({oldPn,newPn})=>{ obj[oldPn]=newPn; });
    onSave(obj);
  };

  const PickBox = ({q,setQ,res,setRes,picked,setPicked,label,color}) => (
    <div style={{position:"relative",flex:1}}>
      <div style={{fontSize:10,fontWeight:700,color:"#64748B",marginBottom:3,textTransform:"uppercase",letterSpacing:"0.05em"}}>{label}</div>
      {picked ? (
        <div style={{padding:"7px 9px",background:color==="amber"?"#FFF7ED":"#F0FDF4",border:`1px solid ${color==="amber"?"#D97706":"#10B981"}`,borderRadius:6,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div>
            <code style={{fontSize:12,fontWeight:700,color:color==="amber"?"#92400E":"#065F46"}}>{picked.pn}</code>
            <div style={{fontSize:11,color:color==="amber"?"#78350F":"#047857"}}>{picked.desc?.substring(0,42)}</div>
            <div style={{fontSize:10,color:"#94A3B8"}}>{picked.price?`$${picked.price?.toFixed(2)}`:"svc"} · {picked.cat?.substring(0,30)}</div>
          </div>
          <button onClick={()=>{setPicked(null);setQ("");}} style={{background:"none",border:"none",cursor:"pointer",fontSize:18,color:"#94A3B8",padding:"0 4px"}}>×</button>
        </div>
      ) : (
        <>
          <input style={inp} value={q} placeholder={`Search ${label.toLowerCase()}...`}
            onChange={e=>{setQ(e.target.value);setRes(search(e.target.value));}} />
          {res.length>0&&<div style={{position:"absolute",zIndex:20,top:"100%",left:0,right:0,background:"white",border:"1px solid #E2E8F0",borderRadius:7,boxShadow:"0 4px 16px rgba(0,0,0,0.12)",maxHeight:170,overflowY:"auto",marginTop:2}}>
            {res.map(p=>(
              <div key={p.pn} onClick={()=>{setPicked(p);setRes([]);setQ("");}} style={{padding:"6px 10px",cursor:"pointer",borderBottom:"1px solid #F8FAFC",fontSize:12}}
                onMouseEnter={e=>e.currentTarget.style.background="#F8FAFC"} onMouseLeave={e=>e.currentTarget.style.background="white"}>
                <code style={{fontWeight:700,color:"#0B1D3A"}}>{p.pn}</code>
                <span style={{color:"#64748B",marginLeft:8,fontSize:11}}>{p.desc?.substring(0,44)}</span>
                {p.price&&<span style={{color:"#10B981",marginLeft:8,fontWeight:600}}>${p.price?.toFixed(2)}</span>}
              </div>
            ))}
          </div>}
        </>
      )}
    </div>
  );

  return (
    <div style={OV} onClick={e=>{if(e.target===e.currentTarget)onClose();}}>
      <div style={BOX}>
        {/* Header */}
        <div style={{background:"#0B1D3A",padding:"14px 18px",display:"flex",justifyContent:"space-between",alignItems:"center",flexShrink:0}}>
          <div>
            <div style={{color:"#D97706",fontWeight:800,fontSize:14,letterSpacing:"0.06em"}}>🔄 PART NUMBER REPLACEMENTS</div>
            <div style={{color:"#64748B",fontSize:11,marginTop:2}}>When an old PN appears in a quote or wizard, the new PN replaces it automatically.</div>
          </div>
          <button onClick={onClose} style={{background:"none",border:"none",color:"#64748B",fontSize:22,cursor:"pointer"}}>×</button>
        </div>

        <div style={{padding:16,overflowY:"auto",flex:1}}>
          {/* Add rule */}
          <div style={{padding:14,background:"#F8FAFC",borderRadius:8,border:"1px solid #E2E8F0",marginBottom:16}}>
            <div style={{fontWeight:700,fontSize:11,color:"#475569",marginBottom:10,textTransform:"uppercase",letterSpacing:"0.06em"}}>Add New Replacement Rule</div>
            <div style={{display:"flex",gap:10,alignItems:"flex-start",marginBottom:10}}>
              <PickBox q={oldQ} setQ={setOldQ} res={oldRes} setRes={setOldRes}
                picked={pOld} setPicked={setPOld} label="Old / phased-out part" color="amber"/>
              <div style={{paddingTop:22,fontSize:20,color:"#D97706",fontWeight:700,flexShrink:0}}>→</div>
              <PickBox q={newQ} setQ={setNewQ} res={newRes} setRes={setNewRes}
                picked={pNew} setPicked={setPNew} label="New / replacement part" color="green"/>
            </div>
            <button disabled={!pOld||!pNew||pOld?.pn===pNew?.pn} onClick={addPair}
              style={{width:"100%",padding:"9px",background:(!pOld||!pNew)?"#CBD5E1":"#0B1D3A",color:"white",
                border:"none",borderRadius:7,fontSize:13,fontWeight:700,
                cursor:(!pOld||!pNew)?"not-allowed":"pointer",transition:"background 0.15s"}}>
              + Add Rule
            </button>
          </div>

          {/* Existing rules */}
          <div style={{fontWeight:700,fontSize:11,color:"#475569",marginBottom:8,textTransform:"uppercase",letterSpacing:"0.06em"}}>
            Active Rules ({pairs.length})
          </div>
          {pairs.length===0 ? (
            <div style={{textAlign:"center",padding:"24px",color:"#94A3B8",fontSize:13,background:"#F8FAFC",borderRadius:8,border:"1px dashed #E2E8F0"}}>
              No rules yet — add one above.
            </div>
          ) : pairs.map(({oldPn,newPn,id})=>{
            const op=findP(oldPn), np=findP(newPn);
            return(
              <div key={id} style={{display:"grid",gridTemplateColumns:"1fr 28px 1fr 32px",gap:8,
                padding:"10px 12px",marginBottom:6,background:"white",border:"1px solid #E2E8F0",
                borderRadius:8,alignItems:"center"}}>
                <div>
                  <code style={{fontSize:12,fontWeight:700,color:"#92400E",textDecoration:"line-through"}}>{oldPn}</code>
                  <div style={{fontSize:11,color:"#78350F",marginTop:1}}>{op?.desc?.substring(0,46)||<span style={{color:"#94A3B8",fontStyle:"italic"}}>not in current catalog</span>}</div>
                  {op?.price&&<div style={{fontSize:10,color:"#94A3B8"}}>${op.price?.toFixed(2)}</div>}
                </div>
                <div style={{textAlign:"center",color:"#D97706",fontWeight:800,fontSize:16}}>→</div>
                <div>
                  <code style={{fontSize:12,fontWeight:700,color:"#065F46"}}>{newPn}</code>
                  <div style={{fontSize:11,color:"#047857",marginTop:1}}>{np?.desc?.substring(0,46)||<span style={{color:"#EF4444",fontStyle:"italic"}}>⚠ not found in catalog</span>}</div>
                  {np?.price&&<div style={{fontSize:10,color:"#94A3B8"}}>${np.price?.toFixed(2)} · {np.cat?.substring(0,28)}</div>}
                </div>
                <button onClick={()=>setPairs(prev=>prev.filter(p=>p.id!==id))}
                  style={{width:28,height:28,background:"#FEF2F2",color:"#EF4444",border:"1px solid #FECACA",
                    borderRadius:5,cursor:"pointer",fontWeight:700,fontSize:13,display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div style={{padding:"12px 16px",borderTop:"1px solid #E2E8F0",display:"flex",gap:8,flexShrink:0,background:"#FAFBFF"}}>
          <div style={{flex:1,fontSize:11,color:"#64748B",alignSelf:"center"}}>
            Rules apply immediately to new quotes and the Node Wizard. They are session-only — to persist them, export prices.json from Admin.
          </div>
          <button onClick={onClose} style={{padding:"8px 16px",border:"1px solid #E2E8F0",borderRadius:7,background:"white",fontSize:13,fontWeight:600,cursor:"pointer",color:"#475569"}}>Cancel</button>
          <button onClick={save} style={{padding:"8px 20px",background:"#0B1D3A",border:"none",borderRadius:7,color:"white",fontSize:14,fontWeight:700,cursor:"pointer"}}>
            ✅ Save ({pairs.length})
          </button>
        </div>
      </div>
    </div>
  );
}

export default function QuoteApp(){
  const[qn,setQn]=useState("");const[cust,setCust]=useState("");const[cont,setCont]=useState("");
  const[addr,setAddr]=useState("");const[phone,setPhone]=useState("");const[email,setEmail]=useState("");
  const[qby,setQby]=useState("");const[dt,setDt]=useState(TDM());const[exp,setExp]=useState(ADM(TDM(),30));
  const[reg,setReg]=useState(REGIONS_MAIN[0]);const[ct,setCt]=useState("Reseller");const[dr,setDr]=useState(false);
  const[pay,setPay]=useState("Net 30 days");const[ship,setShip]=useState("ExWorks");const[stat,setStat]=useState("New");
  const[cmts,setCmts]=useState("");const[lines,setLines]=useState([]);const[srch,setSrch]=useState("");
  const[drop,setDrop]=useState(false);const[tab,setTab]=useState("hw");
  const[aShip,setAShip]=useState(false);const[aCC,setACC]=useState(false);
  const[aTax,setATax]=useState(false);const[tax,setTax]=useState(6);
  const[showWizard,setShowWizard]=useState(false);
  const[showAdmin,setShowAdmin]=useState(false);
  const[showImport,setShowImport]=useState(false);
  const[showCustom,setShowCustom]=useState(false);
  const[showReplace,setShowReplace]=useState(false);

  // Dynamic price data — loads from public/prices.json, falls back to embedded
  const[priceList,setPriceList]=useState(PRICE_LIST_FALLBACK);
  const[discounts,setDiscounts]=useState(DISCOUNTS_FALLBACK);
  const[services,setServices]=useState(SVC_FALLBACK);
  const[replacements,setReplacements]=useState({});
  const[pricesMeta,setPricesMeta]=useState({version:"3.21",updated:"(embedded)"});

  useEffect(()=>{
    fetch("prices.json")
      .then(r=>r.ok?r.json():null)
      .then(d=>{
        if(d?.priceList?.length){
          setPriceList(d.priceList);
          if(d.discounts?.length)  setDiscounts(d.discounts);
          if(d.services?.length)   setServices(d.services);
          if(d.replacements)       setReplacements(d.replacements);
          setPricesMeta({version:d.version||"",updated:d.updated||""});
        }
      })
      .catch(()=>{});
  },[]);

  const [exporting, setExporting] = useState(false);

  const exportPdf = useCallback(async () => {
    setExporting(true);
    try {
      const hwLns  = lines.filter(l => !l.cat?.startsWith("D"));
      const svcLns = lines.filter(l =>  l.cat?.startsWith("D"));
      const hwBase = hwLns.reduce((s,l)=>s+l.listPrice*l.qty*(1-l.discount),0);
      await exportQuotePDF({
        quote_num: qn || "DRAFT", status: stat, quoted_by: qby,
        date: dt, expiry: exp,
        customer: cust, contact: cont, address: addr, phone, email,
        customer_type: ct, region: reg.name, payment: pay,
        shipping: ship, deal_reg: dr, comments: cmts,
        lines: hwLns.map(l => ({
          pn: l.pn, desc: l.desc, cat: l.cat, qty: l.qty,
          list_price: l.listPrice, discount: l.discount, site: l.site || "",
        })),
        svc_lines: svcLns.map(l => ({
          pn: l.pn, desc: l.desc, cat: l.cat, qty: l.qty,
          list_price: l.listPrice,
          pct: l.listPrice < 1 && l.listPrice > 0 ? l.listPrice : 0,
          hw_base: hwBase,
        })),
        add_ship: aShip, add_cc: aCC, add_tax: aTax, tax_rate: tax,
      });
    } catch(err) {
      alert("PDF export failed: " + err.message);
    } finally {
      setExporting(false);
    }
  }, [qn, stat, qby, dt, exp, cust, cont, addr, phone, email, ct, reg, pay, ship, dr, cmts, lines, aShip, aCC, aTax, tax]);

  // ── Excel export ──────────────────────────────────────────────────────────
  const exportExcel = useCallback(async () => {
    try {
      // Lazy-load SheetJS from CDN
      if (!window.XLSX) {
        await new Promise((res, rej) => {
          const s = document.createElement("script");
          s.src = "https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js";
          s.onload = res; s.onerror = rej;
          document.head.appendChild(s);
        });
      }
      const XL = window.XLSX;
      const wb = XL.utils.book_new();

      // ── Sheet 1: Quote Header ───────────────────────────────────────────
      const headerRows = [
        ["Actelis Networks, Inc.", "", "", ""],
        ["710 Lakeway Drive, Ste 200, Sunnyvale, CA 94085"],
        [],
        ["Quotation #:",      qn || "DRAFT",  "Date:",           dt],
        ["Customer Name:",    cust,            "Quote Valid Until:", exp],
        ["Customer Contact:", cont,            "Payment Terms:",  pay],
        ["Address:",          addr,            "Shipping Terms:", ship],
        ["Phone/Fax:",        phone,           "Quoted By:",      qby],
        ["Email:",            email],
        [],
      ];
      const wsHeader = XL.utils.aoa_to_sheet(headerRows);
      XL.utils.book_append_sheet(wb, wsHeader, "Quote Info");

      // ── Sheet 2: Line Items ─────────────────────────────────────────────
      const hwLns  = lines.filter(l => !l.cat?.startsWith("D"));
      const svcLns = lines.filter(l =>  l.cat?.startsWith("D"));
      const hwBase = hwLns.reduce((s,l)=>s+l.listPrice*l.qty*(1-l.discount),0);

      const lineRows = [
        ["Part Number", "Description", "Category", "Site", "List Price", "Discount %", "Unit Price", "Qty", "Total Price"],
      ];
      let hwTotal = 0;
      for (const l of hwLns) {
        const unitP = l.listPrice * (1 - l.discount);
        const totP  = unitP * l.qty;
        hwTotal += totP;
        lineRows.push([
          l.pn, l.desc, l.cat, l.site || "",
          l.listPrice,
          +(l.discount * 100).toFixed(1),
          +unitP.toFixed(2),
          l.qty,
          +totP.toFixed(2),
        ]);
      }
      lineRows.push([]);
      lineRows.push(["", "", "", "HARDWARE TOTAL", "", "", "", "", +hwTotal.toFixed(2)]);
      lineRows.push([]);

      if (svcLns.length > 0) {
        lineRows.push(["Part Number", "Description", "% of LP", "Qty", "Unit Price", "Total Price"]);
        let svcTotal = 0;
        for (const sv of svcLns) {
          const pct     = sv.listPrice < 1 && sv.listPrice > 0 ? sv.listPrice : 0;
          const unitAmt = pct > 0 ? hwBase * pct : sv.listPrice;
          const totAmt  = unitAmt * sv.qty;
          svcTotal += totAmt;
          lineRows.push([
            sv.pn, sv.desc,
            pct > 0 ? `${(pct*100).toFixed(1)}%` : "",
            sv.qty,
            +unitAmt.toFixed(2),
            +totAmt.toFixed(2),
          ]);
        }
        lineRows.push(["", "SERVICE TOTAL", "", "", "", +svcTotal.toFixed(2)]);
        lineRows.push([]);
        lineRows.push(["", "GRAND TOTAL (HW + Services)", "", "", "", +(hwTotal+svcTotal).toFixed(2)]);
      }

      if (cmts) lineRows.push([], ["Comments:", cmts]);

      const wsLines = XL.utils.aoa_to_sheet(lineRows);
      // Column widths
      wsLines["!cols"] = [
        {wch:18},{wch:55},{wch:30},{wch:16},
        {wch:12},{wch:11},{wch:12},{wch:6},{wch:14},
      ];
      XL.utils.book_append_sheet(wb, wsLines, "Line Items");

      const safe = (qn||"DRAFT").replace(/[/\\:*?"<>|]/g,"_").replace(/\s+/g,"_");
      XL.writeFile(wb, `Actelis_Quote_${safe}.xlsx`);
    } catch(err) {
      alert("Excel export failed: " + err.message);
    }
  }, [qn, dt, exp, cust, cont, addr, phone, email, pay, ship, qby, cmts, lines]);



  const isNA=!EMEA_IDS_MAIN.includes(reg.id);

  const res=useMemo(()=>{
    if(!srch.trim())return[];
    const q=srch.toLowerCase();
    return(tab==="hw"?priceList:services).filter(p=>p.pn.toLowerCase().includes(q)||p.desc.toLowerCase().includes(q)||(p.cat||"").toLowerCase().includes(q)).slice(0,22);
  },[srch,tab]);

  const addItem=useCallback(p=>{
    const disc=getDiscMain(p.cat,reg.id,ct,dr,discounts);
    setLines(prev=>[...prev,{id:_quid++,pn:p.pn,desc:p.desc,cat:p.cat,qty:1,listPrice:p.price||0,discount:disc,site:"",lpStr:p.lpString||""}]);
    setSrch("");setDrop(false);
  },[reg,ct,dr]);

  const addWizardLines=useCallback(newLines=>{
    setLines(prev=>[...prev,...newLines.map(l=>({...l,id:_quid++}))]);
  },[]);

  const upd=(id,f,v)=>setLines(p=>p.map(l=>l.id===id?{...l,[f]:v}:l));
  const rm=id=>setLines(p=>p.filter(l=>l.id!==id));

  const hwT=useMemo(()=>lines.reduce((s,l)=>s+l.listPrice*l.qty*(1-l.discount),0),[lines]);
  const lstT=lines.reduce((s,l)=>s+l.listPrice*l.qty,0);
  const shpA=aShip?hwT*0.02:0,ccA=aCC?hwT*0.03:0,txA=aTax&&isNA?hwT*(tax/100):0;
  const grand=hwT+shpA+ccA+txA;
  const cg=useMemo(()=>{const g={};lines.forEach(l=>{const k=l.cat.split(" ")[0];(g[k]=g[k]||[]).push(l);});return g;},[lines]);

  const N="#0B2343",A="#E8600A",B="#E2E8F0",T="#1A2035",M="#64748B";
  const inp={width:"100%",padding:"9px 11px",border:`1px solid ${B}`,borderRadius:5,fontSize:14,color:T,background:"white",outline:"none",boxSizing:"border-box",fontFamily:"inherit"};

  return(
    <div style={{fontFamily:"'DM Sans','Segoe UI',sans-serif",background:"#F0F4F8",minHeight:"100vh",color:T,fontSize:13}}>

      {showAdmin && (
        <AdminUpload
          onClose={()=>setShowAdmin(false)}
          currentPrices={priceList}
          currentDiscounts={discounts}
          currentServices={services}
        />
      )}

      {showWizard && (
        <NodeWizard
          region={reg} custType={ct} dealReg={dr}
          replacements={replacements}
          onAddLines={addWizardLines}
          onClose={()=>setShowWizard(false)}
        />
      )}

      {/* ── IMPORT PDF MODAL ───────────────────────────────────────────── */}
      {showImport && <ImportPdfModal
        priceList={priceList} discounts={discounts}
        onImport={(data) => {
          if (data.qn)    setQn(data.qn);
          if (data.cust)  setCust(data.cust);
          if (data.cont)  setCont(data.cont);
          if (data.addr)  setAddr(data.addr);
          if (data.phone) setPhone(data.phone);
          if (data.email) setEmail(data.email);
          if (data.qby)   setQby(data.qby);
          if (data.dt)    setDt(data.dt);
          if (data.exp)   setExp(data.exp);
          if (data.pay)   setPay(data.pay);
          if (data.ship)  setShip(data.ship);
          if (data.cmts)  setCmts(data.cmts);
          if (data.lines?.length) {
            setLines(data.lines.map(l => ({...l, id:_quid++})));
          }
          setShowImport(false);
        }}
        onClose={()=>setShowImport(false)}
      />}

      {/* ── CUSTOM LINE ITEM MODAL ─────────────────────────────────────── */}
      {showCustom && <CustomLineModal
        onAdd={(line) => { setLines(prev=>[...prev,{...line,id:_quid++}]); setShowCustom(false); }}
        onClose={()=>setShowCustom(false)}
      />}

      {showReplace && <ReplaceModal
        priceList={priceList} services={services}
        replacements={replacements}
        onSave={(r)=>{ setReplacements(r); setShowReplace(false); }}
        onClose={()=>setShowReplace(false)}
      />}

      {/* NAV */}
      <div style={{background:"white",height:68,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 24px",boxShadow:"0 2px 12px rgba(11,35,67,0.12)",borderBottom:"3px solid #E8600A"}}>
        <div style={{display:"flex",alignItems:"center",gap:16}}>
          <img src="https://actelis.com/wp-content/uploads/2021/10/a_logo-1.gif"
            alt="Actelis" style={{height:40,objectFit:"contain",display:"block"}} />
          <div style={{borderLeft:"2px solid #E8600A",paddingLeft:16}}>
            <div style={{color:"#0B2343",fontWeight:800,fontSize:16,lineHeight:1.2,letterSpacing:"-0.01em"}}>Price Quote Tool</div>
            <div style={{color:"#94A3B8",fontSize:10,marginTop:1}}>Price list v{pricesMeta.version} · {pricesMeta.updated}</div>
            <div style={{marginTop:4}}>
              <button onClick={()=>{
                if(lines.length===0&&!qn&&!cust||(window.confirm("Start a new quote? All current data will be cleared."))){
                  setQn("");setCust("");setCont("");setAddr("");setPhone("");setEmail("");
                  setQby("");setDt(TDM());setExp(ADM(TDM(),30));
                  setReg(REGIONS_MAIN[0]);setCt("Reseller");setDr(false);
                  setPay("Net 30 days");setShip("ExWorks");setStat("New");
                  setCmts("");setLines([]);setSrch("");
                  setAShip(false);setACC(false);setATax(false);setTax(6);
                }
              }} style={{padding:"3px 11px",borderRadius:4,background:"#F1F5F9",color:"#0B2343",border:"1px solid #CBD5E1",fontSize:12,fontWeight:600,cursor:"pointer",whiteSpace:"nowrap"}}
                onMouseEnter={e=>{e.currentTarget.style.background="#E8600A";e.currentTarget.style.color="white";e.currentTarget.style.borderColor="#E8600A";}}
                onMouseLeave={e=>{e.currentTarget.style.background="#F1F5F9";e.currentTarget.style.color="#0B2343";e.currentTarget.style.borderColor="#CBD5E1";}}>
                🗒 New Quote
              </button>
            </div>
          </div>
        </div>
        <div style={{display:"flex",gap:8,alignItems:"center"}}>
          {/* ── User-facing actions ── */}
          <button onClick={()=>setShowImport(true)}
            style={{padding:"7px 16px",borderRadius:6,fontSize:13,fontWeight:700,cursor:"pointer",
              background:"#059669",color:"white",border:"none",
              boxShadow:"0 2px 8px rgba(5,150,105,0.3)"}}>
            📥 Import PDF
          </button>

          {/* ── Admin tools group ── */}
          <div style={{display:"flex",alignItems:"center",gap:0,background:"#F8FAFC",borderRadius:6,border:"1px solid #E2E8F0",overflow:"hidden",boxShadow:"0 1px 4px rgba(0,0,0,0.06)"}}>
            <div style={{padding:"4px 10px",fontSize:10,fontWeight:800,color:"#94A3B8",borderRight:"1px solid #E2E8F0",textTransform:"uppercase",letterSpacing:"0.08em",whiteSpace:"nowrap",background:"#F1F5F9"}}>
              ⚙ Admin
            </div>
            <button style={{padding:"7px 12px",fontSize:12,fontWeight:600,cursor:"pointer",background:"transparent",color:"#475569",border:"none",borderRight:"1px solid #E2E8F0"}}
              onMouseEnter={e=>e.currentTarget.style.background="#F1F5F9"}
              onMouseLeave={e=>e.currentTarget.style.background="transparent"}
              title="HubSpot integration (coming soon)">
              🔗 HubSpot
            </button>
            <button onClick={()=>setShowReplace(true)}
              style={{padding:"7px 12px",fontSize:12,fontWeight:600,cursor:"pointer",background:"transparent",color:Object.keys(replacements).length>0?"#E8600A":"#475569",border:"none",borderRight:"1px solid #E2E8F0"}}
              onMouseEnter={e=>e.currentTarget.style.background="#F1F5F9"}
              onMouseLeave={e=>e.currentTarget.style.background="transparent"}
              title="Manage part number replacements">
              🔄 Replacements{Object.keys(replacements).length>0?` (${Object.keys(replacements).length})`:""}
            </button>
            <button onClick={()=>setShowAdmin(true)}
              style={{padding:"7px 12px",fontSize:12,fontWeight:600,cursor:"pointer",background:"transparent",color:"#475569",border:"none"}}
              onMouseEnter={e=>e.currentTarget.style.background="#F1F5F9"}
              onMouseLeave={e=>e.currentTarget.style.background="transparent"}
              title="Upload price list / manage data">
              📋 Prices
            </button>
          </div>
        </div>
      </div>

      <div style={{maxWidth:1260,margin:"0 auto",padding:"16px 14px",display:"grid",gridTemplateColumns:"1fr 285px",gap:14}}>
        <div style={{display:"flex",flexDirection:"column",gap:12}}>

          {/* QUOTE DETAILS */}
          <Panel title="Quote Details" icon="📋">
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"8px 12px"}}>
              {[
                ["Quotation #",<input style={{...inp,fontFamily:"monospace"}} value={qn} onChange={e=>setQn(e.target.value)} placeholder="e.g. ACT-2024-001"/>,"*"],
                ["Status",<select style={inp} value={stat} onChange={e=>setStat(e.target.value)}>{STATUSES.map(s=><option key={s}>{s}</option>)}</select>,""],
                ["Quoted By",<input style={inp} value={qby} onChange={e=>setQby(e.target.value)} placeholder="Your name"/>,""],
                ["Customer Name",<input style={inp} value={cust} onChange={e=>setCust(e.target.value)} placeholder="Company name"/>,"*"],
                ["Contact",<input style={inp} value={cont} onChange={e=>setCont(e.target.value)} placeholder="Contact name"/>,""],
                ["Customer Type",<select style={inp} value={ct} onChange={e=>setCt(e.target.value)}><option>Reseller</option><option>End Customer</option></select>,""],
                ["Address",<input style={inp} value={addr} onChange={e=>setAddr(e.target.value)} placeholder="Customer address"/>,""],
                ["Phone/Fax",<input style={inp} value={phone} onChange={e=>setPhone(e.target.value)} placeholder="Phone number"/>,""],
                ["Email",<input style={inp} value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email address"/>,""],
                ["Quote Date",<input type="date" style={inp} value={dt} onChange={e=>{setDt(e.target.value);setExp(ADM(e.target.value,30));}}/>,""],
                ["Expiry Date",<input type="date" style={inp} value={exp} onChange={e=>setExp(e.target.value)}/>,""],
                ["Region",<select style={inp} value={reg.name} onChange={e=>setReg(REGIONS_MAIN.find(r=>r.name===e.target.value))}>{REGIONS_MAIN.map(r=><option key={r.name}>{r.name}</option>)}</select>,""],
                ["Payment Terms",<select style={inp} value={pay} onChange={e=>setPay(e.target.value)}>{PAYMENTS.map(t=><option key={t}>{t}</option>)}</select>,""],
                ["Shipping Terms",<select style={inp} value={ship} onChange={e=>setShip(e.target.value)}>{SHIPPINGS.map(t=><option key={t}>{t}</option>)}</select>,""],
                ["",(
                  <div style={{display:"flex",alignItems:"center",gap:7,marginTop:16}}>
                    <TogM v={dr} set={setDr}/>
                    <span style={{fontSize:15,color:dr?A:M,fontWeight:dr?600:400}}>
                      Deal Registration {dr&&isNA&&<span style={{color:"#059669",fontSize:10}}>+7% active</span>}
                    </span>
                  </div>
                ),""]
              ].map(([lb,el,rq],i)=>(
                <div key={i}>
                  {lb&&<div style={{fontSize:15,fontWeight:700,color:M,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:4}}>{lb}{rq&&<span style={{color:"#EF4444",marginLeft:2}}>*</span>}</div>}
                  {el}
                </div>
              ))}
            </div>
            <div style={{marginTop:8}}>
              <div style={{fontSize:15,fontWeight:700,color:M,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:4}}>Comments</div>
              <textarea value={cmts} onChange={e=>setCmts(e.target.value)} placeholder="Comments for the quote output..."
                style={{...inp,minHeight:44,resize:"vertical"}}/>
            </div>
          </Panel>

          {/* LINE ITEMS */}
          <Panel title="Line Items" icon="📦" actions={
            <div style={{display:"flex",gap:5}}>
              {[["hw","Hardware (A/B/C)"],["svc","Services (D)"]].map(([k,l])=>(
                <button key={k} onClick={()=>{setTab(k);setSrch("");}} style={{padding:"2px 9px",borderRadius:4,border:"none",cursor:"pointer",fontSize:14,fontWeight:700,background:tab===k?N:"transparent",color:tab===k?"white":M}}>{l}</button>
              ))}
            </div>
          }>
            <div style={{position:"relative",marginBottom:8}}>
              <span style={{position:"absolute",left:9,top:"50%",transform:"translateY(-50%)",color:"#94A3B8",fontSize:13}}>🔍</span>
              <input value={srch} onChange={e=>{setSrch(e.target.value);setDrop(true);}} onFocus={()=>setDrop(true)}
                placeholder="Search part #, description or category..." style={{...inp,paddingLeft:28,border:"1.5px solid #CBD5E1"}}/>
              {drop&&res.length>0&&(
                <div style={{position:"absolute",zIndex:200,top:"100%",left:0,right:0,background:"white",border:`1px solid ${B}`,borderRadius:7,boxShadow:"0 8px 24px rgba(0,0,0,0.12)",maxHeight:300,overflowY:"auto",marginTop:2}}>
                  {res.map(p=>{
                    const d=getDiscMain(p.cat||"",reg.id,ct,dr,discounts);
                    const newPn   = replacements[p.pn];
                    const newProd = newPn ? [...priceList,...services].find(x=>x.pn===newPn) : null;
                    const actual  = newProd || p; // what actually gets added
                    return(
                      <div key={p.pn} onClick={()=>addItem(actual)}
                        style={{padding:"8px 12px",cursor:"pointer",borderBottom:`1px solid #F8FAFC`,
                          display:"grid",gridTemplateColumns:"108px 1fr auto",gap:8,alignItems:"center",
                          background:newPn?"#FFF7ED":"white"}}
                        onMouseEnter={e=>e.currentTarget.style.background=newPn?"#FEF3C7":"#F8FAFC"}
                        onMouseLeave={e=>e.currentTarget.style.background=newPn?"#FFF7ED":"white"}>
                        <div>
                          <code style={{fontSize:14,color:newPn?"#92400E":N,fontWeight:700,
                            textDecoration:newPn?"line-through":"none"}}>{p.pn}</code>
                          {newPn&&<div style={{fontSize:10,color:"#D97706",fontWeight:700}}>→ {newPn}</div>}
                        </div>
                        <div>
                          {newPn&&<div style={{fontSize:10,padding:"1px 5px",background:"#FEF3C7",
                            color:"#92400E",borderRadius:3,fontWeight:700,display:"inline-block",marginBottom:2}}>
                            ⚠ REPLACED — adds new PN
                          </div>}
                          <div style={{fontSize:15,color:T}}>{actual.desc}</div>
                          <div style={{fontSize:15,color:"#94A3B8",marginTop:1}}>{actual.cat}</div>
                        </div>
                        <div style={{textAlign:"right",whiteSpace:"nowrap"}}>
                          <div style={{fontSize:15,fontWeight:700,color:N}}>{actual.price?$M(actual.price):actual.lpString?.substring(0,18)||"—"}</div>
                          {d>0&&p.price>0&&<div style={{fontSize:15,color:"#10B981"}}>-{PM(d)}</div>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              {drop&&srch&&res.length===0&&(
                <div style={{position:"absolute",zIndex:200,top:"100%",left:0,right:0,background:"white",border:`1px solid ${B}`,borderRadius:7,padding:12,textAlign:"center",color:"#94A3B8",fontSize:15,marginTop:2}}>
                  No results for "{srch}"
                </div>
              )}
            </div>

            {lines.length===0?(
              <div style={{margin:"8px 0 4px"}}>
                {/* Two prominent CTA cards side by side */}
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:8}}>
                  {/* Manual search CTA */}
                  <div style={{padding:"16px",background:"#F8FAFC",border:"2px dashed #CBD5E1",borderRadius:10,textAlign:"center"}}>
                    <div style={{fontSize:28,marginBottom:6}}>🔍</div>
                    <div style={{fontSize:13,fontWeight:700,color:"#334155",marginBottom:4}}>Search the Catalog</div>
                    <div style={{fontSize:11,color:"#94A3B8",lineHeight:1.4}}>Type a part number or product name in the search bar above to add individual items</div>
                  </div>
                  {/* Wizard CTA — bold highlighted */}
                  <div onClick={()=>setShowWizard(true)} style={{padding:"16px",background:"linear-gradient(135deg,#0B1D3A,#1E3A5F)",border:"2px solid #D97706",borderRadius:10,textAlign:"center",cursor:"pointer",transition:"transform 0.1s,box-shadow 0.1s",boxShadow:"0 4px 16px rgba(217,119,6,0.25)"}}
                    onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow="0 8px 24px rgba(217,119,6,0.4)";}}
                    onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="0 4px 16px rgba(217,119,6,0.25)";}}>
                    <div style={{fontSize:28,marginBottom:6}}>⚡</div>
                    <div style={{fontSize:13,fontWeight:800,color:"#FDE68A",marginBottom:4}}>Node Configurator Wizard</div>
                    <div style={{fontSize:11,color:"#94A3B8",lineHeight:1.4,marginBottom:10}}>Auto-build a complete BOM for PTP · GL800 · GL900 · GL9000 · ML2300 · Switches</div>
                    <div style={{display:"inline-block",background:"#D97706",color:"white",padding:"5px 18px",borderRadius:20,fontSize:12,fontWeight:700}}>Launch →</div>
                  </div>
                </div>
                {/* Custom item strip */}
                <div onClick={()=>setShowCustom(true)} style={{padding:"9px 14px",background:"#F8FAFC",border:"1px dashed #CBD5E1",borderRadius:7,display:"flex",alignItems:"center",justifyContent:"space-between",cursor:"pointer"}}
                  onMouseEnter={e=>e.currentTarget.style.background="#F1F5F9"}
                  onMouseLeave={e=>e.currentTarget.style.background="#F8FAFC"}>
                  <div style={{fontSize:12,color:"#64748B"}}>✏️ <strong>Add a custom / non-catalog item</strong> — enter part #, description and price manually</div>
                  <span style={{fontSize:12,color:"#94A3B8",fontWeight:600,flexShrink:0,marginLeft:8}}>+ Add</span>
                </div>
              </div>
            ):(
              <div>
                <div style={{display:"grid",gridTemplateColumns:"108px 1fr 62px 86px 80px 94px 22px",gap:5,padding:"4px 5px",background:"#F1F5F9",borderRadius:4,fontSize:15,fontWeight:700,color:M,textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:3}}>
                  <span>Part #</span><span>Description</span><span>Qty</span><span>List</span><span>Disc%</span><span style={{textAlign:"right"}}>Customer $</span><span/>
                </div>
                {lines.map(l=>{
                  const def=getDiscMain(l.cat,reg.id,ct,dr,discounts),ov=Math.abs(l.discount-def)>0.001;
                  const cp=l.listPrice*l.qty*(1-l.discount);
                  const newPn   = replacements[l.pn];
                  const newProd = newPn ? [...priceList,...services].find(x=>x.pn===newPn) : null;
                  return(
                    <div key={l.id} style={{display:"grid",gridTemplateColumns:"108px 1fr 62px 86px 80px 94px 22px",gap:5,padding:"6px 5px",borderBottom:`1px solid #F8FAFC`,alignItems:"center",background:newPn?"#FFFBEB":"transparent"}}
                      onMouseEnter={e=>e.currentTarget.style.background=newPn?"#FEF3C7":"#FAFBFF"}
                      onMouseLeave={e=>e.currentTarget.style.background=newPn?"#FFFBEB":"transparent"}>
                      <code style={{fontSize:15,color:newPn?"#92400E":N,fontWeight:700,
                        textDecoration:newPn?"line-through":"none"}}>{l.pn}</code>
                      <div>
                        <div style={{fontSize:14,color:T,lineHeight:1.3}}>{l.desc}</div>
                        <div style={{fontSize:14,color:"#94A3B8",marginTop:1}}>{l.site?<span style={{color:"#3B82F6",fontWeight:600}}>📍{l.site} · </span>:""}{l.cat}</div>
                        {newPn&&(
                          <div style={{display:"flex",alignItems:"center",gap:6,marginTop:3}}>
                            <span style={{fontSize:10,padding:"1px 6px",background:"#FEF3C7",color:"#92400E",borderRadius:3,fontWeight:700}}>
                              ⚠ Replaced by {newPn}
                            </span>
                            <button onClick={()=>{
                              if(newProd){
                                const disc=getDiscMain(newProd.cat,reg.id,ct,dr,discounts);
                                upd(l.id,"pn",newProd.pn); upd(l.id,"desc",newProd.desc);
                                upd(l.id,"cat",newProd.cat); upd(l.id,"listPrice",newProd.price||0);
                                upd(l.id,"discount",disc);
                              }
                            }} style={{fontSize:10,padding:"2px 8px",background:"#D97706",color:"white",
                              border:"none",borderRadius:3,cursor:newProd?"pointer":"not-allowed",
                              fontWeight:700,opacity:newProd?1:0.5}}>
                              Apply → {newPn}
                            </button>
                          </div>
                        )}
                      </div>
                      <input type="number" value={l.qty} min={1} onChange={e=>upd(l.id,"qty",Math.max(1,parseInt(e.target.value)||1))}
                        style={{width:"100%",padding:"2px 4px",border:`1px solid ${B}`,borderRadius:3,fontSize:14,textAlign:"center"}}/>
                      <span style={{fontSize:14,color:M,textAlign:"right"}}>{$M(l.listPrice)}</span>
                      <div style={{display:"flex",alignItems:"center",gap:2}}>
                        <input type="number" value={(l.discount*100).toFixed(1)} min={0} max={100} step={0.5}
                          onChange={e=>upd(l.id,"discount",Math.min(1,Math.max(0,(parseFloat(e.target.value)||0)/100)))}
                          style={{width:40,padding:"2px 3px",border:`1px solid ${ov?"#D97706":B}`,borderRadius:3,fontSize:14,textAlign:"center",background:ov?"#FFFBEB":"white"}}/>
                        <span style={{fontSize:15,color:M}}>%</span>
                        {ov&&<span style={{fontSize:15,color:A}} title="Overridden">✎</span>}
                      </div>
                      <span style={{fontSize:15,fontWeight:700,color:N,textAlign:"right"}}>{$M(cp)}</span>
                      <button onClick={()=>rm(l.id)} title="Remove line" style={{background:"#FEF2F2",border:"1px solid #FECACA",borderRadius:4,cursor:"pointer",color:"#EF4444",fontSize:14,padding:"2px 5px",fontWeight:700,lineHeight:1}}
                        onMouseEnter={e=>{e.currentTarget.style.background="#EF4444";e.currentTarget.style.color="white";}} onMouseLeave={e=>{e.currentTarget.style.background="#FEF2F2";e.currentTarget.style.color="#EF4444";}}>✕</button>
                    </div>
                  );
                })}
                {Object.keys(cg).length>1&&(
                  <div style={{marginTop:6,borderTop:"1px dashed #E2E8F0",paddingTop:5}}>
                    {Object.entries(cg).map(([c,ls])=>{
                      const s=ls.reduce((x,l)=>x+l.listPrice*l.qty*(1-l.discount),0);
                      return<div key={c} style={{display:"flex",justifyContent:"space-between",padding:"1px 5px",fontSize:14,color:M}}>
                        <span>Type {c} subtotal</span><span style={{fontWeight:700}}>{$M(s)}</span>
                      </div>;
                    })}
                  </div>
                )}
              </div>
            )}

            {/* ADD MORE — compact strip shown only when lines already exist */}
            {lines.length>0&&(
              <div style={{display:"flex",gap:8,marginTop:10}}>
                <div onClick={()=>setShowWizard(true)} style={{flex:1,padding:"8px 12px",background:"linear-gradient(135deg,#FFFBEB,#FEF3C7)",border:"1.5px solid #D97706",borderRadius:7,display:"flex",alignItems:"center",justifyContent:"space-between",cursor:"pointer"}}
                  onMouseEnter={e=>e.currentTarget.style.background="linear-gradient(135deg,#FEF3C7,#FDE68A)"}
                  onMouseLeave={e=>e.currentTarget.style.background="linear-gradient(135deg,#FFFBEB,#FEF3C7)"}>
                  <span style={{fontSize:12,fontWeight:700,color:"#92400E"}}>⚡ Node Configurator</span>
                  <span style={{fontSize:11,color:"#B45309",fontWeight:600}}>+ Add BOM</span>
                </div>
                <div onClick={()=>setShowCustom(true)} style={{flex:1,padding:"8px 12px",background:"#F8FAFC",border:"1.5px dashed #CBD5E1",borderRadius:7,display:"flex",alignItems:"center",justifyContent:"space-between",cursor:"pointer"}}
                  onMouseEnter={e=>e.currentTarget.style.background="#F1F5F9"}
                  onMouseLeave={e=>e.currentTarget.style.background="#F8FAFC"}>
                  <span style={{fontSize:12,fontWeight:700,color:"#475569"}}>✏️ Custom Item</span>
                  <span style={{fontSize:11,color:"#94A3B8",fontWeight:600}}>+ Add</span>
                </div>
              </div>
            )}
          </Panel>

          {/* FINANCIAL OPTIONS */}
          <Panel title="Financial Options" icon="⚙️">
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
              <FlgM label="Add Shipping Cost" sub="~2% of hardware total" v={aShip} set={setAShip} amt={aShip?$M(shpA):null}/>
              <FlgM label="Add Credit Card Fee" sub="3% surcharge" v={aCC} set={setACC} amt={aCC?$M(ccA):null}/>
              {isNA&&<FlgM label="Sales Tax (NA only)" sub={
                <span style={{display:"flex",alignItems:"center",gap:3}}>
                  {aTax&&<><input type="number" value={tax} onChange={e=>setTax(parseFloat(e.target.value)||0)}
                    style={{width:34,padding:"1px 3px",border:`1px solid ${B}`,borderRadius:3,fontSize:10}}/><span style={{fontSize:10}}>%</span></>}
                  {!aTax&&"NA region only"}
                </span>} v={aTax} set={setATax} amt={aTax?$M(txA):null}/>}
              <FlgM label="Extended Warranty" sub="Included in quote output" v={false} set={()=>{}}/>
            </div>
          </Panel>
        </div>

        {/* SUMMARY PANEL */}
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          <div style={{background:"white",borderRadius:9,border:"1px solid #E2E8F0",overflow:"hidden",position:"sticky",top:14,boxShadow:"0 2px 12px rgba(11,35,67,0.08)"}}>
            {/* Header bar */}
            <div style={{background:"#0B2343",padding:"12px 16px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <div style={{fontSize:11,fontWeight:800,letterSpacing:"0.12em",color:"rgba(255,255,255,0.5)",textTransform:"uppercase"}}>Quote Summary</div>
              <div style={{fontSize:12,color:"rgba(255,255,255,0.7)",fontWeight:500}}>{reg.name} · {ct}</div>
            </div>
            <div style={{padding:"14px 16px"}}>
              <div style={{fontSize:13,color:M,marginBottom:10,fontWeight:500}}>{cust||<span style={{color:"#CBD5E1",fontStyle:"italic"}}>No customer yet</span>}</div>
              {dr&&isNA&&<div style={{fontSize:11,background:"#F0FDF4",color:"#166534",padding:"3px 8px",borderRadius:4,display:"inline-block",marginBottom:8,border:"1px solid #BBF7D0",fontWeight:600}}>✓ Deal Registration Active</div>}

              {/* Stats rows */}
              <div style={{borderTop:"1px solid #F1F5F9",paddingTop:10}}>
                <SRM l="Line items" v={lines.length} plain/>
                <SRM l="List total" v={$M(lstT)} muted/>
                {lstT>0&&<SRM l="Discount" v={`-${$M(lstT-hwT)} (${PM((lstT-hwT)/lstT)})`} green/>}
                <SRM l="Hardware subtotal" v={$M(hwT)}/>
                {aShip&&<SRM l="Shipping" v={$M(shpA)} muted/>}
                {aCC&&<SRM l="CC Fee" v={$M(ccA)} muted/>}
                {aTax&&isNA&&<SRM l={`Tax (${tax}%)`} v={$M(txA)} muted/>}
              </div>

              {/* Grand total */}
              <div style={{borderTop:"2px solid #E8600A",marginTop:10,paddingTop:10,display:"flex",justifyContent:"space-between",alignItems:"baseline",background:"#FFF8F5",margin:"10px -16px -14px",padding:"10px 16px 14px"}}>
                <span style={{fontSize:13,color:"#0B2343",fontWeight:700}}>Grand Total</span>
                <span style={{fontSize:24,fontWeight:800,color:"#E8600A"}}>{$M(grand)}</span>
              </div>
            </div>

            {/* Category breakdown */}
            {lines.length>0&&(
              <div style={{padding:"12px 16px",borderTop:"1px solid #F1F5F9",background:"#F8FAFC"}}>
                <div style={{fontSize:10,fontWeight:800,color:"#94A3B8",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:8}}>By Category</div>
                {Object.entries(cg).map(([c,ls])=>{
                  const s=ls.reduce((x,l)=>x+l.listPrice*l.qty*(1-l.discount),0),p=grand>0?s/grand:0;
                  return<div key={c} style={{marginBottom:6}}>
                    <div style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:3}}>
                      <span style={{color:M}}>Type {c}</span>
                      <span style={{color:"#0B2343",fontWeight:600}}>{$M(s)}</span>
                    </div>
                    <div style={{height:3,background:"#E2E8F0",borderRadius:2}}>
                      <div style={{height:3,background:"#E8600A",borderRadius:2,width:`${p*100}%`,transition:"width 0.3s"}}/>
                    </div>
                  </div>;
                })}
              </div>
            )}

            {/* Export buttons */}
            <div style={{padding:"12px 16px",borderTop:"1px solid #F1F5F9",display:"flex",flexDirection:"column",gap:6}}>
              <button onClick={exportPdf} disabled={exporting} style={{width:"100%",padding:"9px",background:"#E8600A",color:"white",border:"none",borderRadius:6,fontSize:13,fontWeight:700,cursor:exporting?"wait":"pointer",opacity:exporting?0.7:1,boxShadow:"0 2px 8px rgba(232,96,10,0.3)"}}>{exporting?"⏳ Generating...":"⬇ Export PDF"}</button>
              <button onClick={exportExcel} style={{width:"100%",padding:"9px",background:"white",color:"#0B2343",border:"1px solid #CBD5E1",borderRadius:6,fontSize:13,fontWeight:600,cursor:"pointer"}}
                onMouseEnter={e=>{e.currentTarget.style.background="#F1F5F9";}}
                onMouseLeave={e=>{e.currentTarget.style.background="white";}}>⬇ Export Excel</button>
            </div>
          </div>
          <div style={{background:"white",borderRadius:7,padding:12,border:`1px solid ${B}`,fontSize:10,boxShadow:"0 1px 4px rgba(0,0,0,0.04)"}}>
            <div style={{fontWeight:700,color:"#0B2343",marginBottom:7,fontSize:12}}>Quote Info</div>
            {[["Date",dt],["Expires",exp],["Payment",pay],["Shipping",ship]].map(([k,v])=>(
              <div key={k} style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                <span style={{color:"#94A3B8"}}>{k}</span>
                <span style={{color:T,fontWeight:500}}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      {drop&&<div style={{position:"fixed",inset:0,zIndex:100}} onClick={()=>setDrop(false)}/>}
    </div>
  );
}

function Panel({title,icon,children,actions}){
  return(
    <div style={{background:"white",borderRadius:8,border:"1px solid #E2E8F0",overflow:"hidden",boxShadow:"0 1px 4px rgba(11,35,67,0.06)"}}>
      <div style={{padding:"10px 14px",borderBottom:"1px solid #F1F5F9",display:"flex",alignItems:"center",justifyContent:"space-between",background:"#FAFBFF"}}>
        <div style={{display:"flex",alignItems:"center",gap:6}}><span>{icon}</span><span style={{fontWeight:700,fontSize:14,color:"#0B2343"}}>{title}</span></div>
        {actions}
      </div>
      <div style={{padding:12}}>{children}</div>
    </div>
  );
}
function TogM({v,set}){
  return<div onClick={()=>set(!v)} style={{width:32,height:17,borderRadius:8,background:v?"#E8600A":"#CBD5E1",cursor:"pointer",position:"relative",transition:"background 0.2s",flexShrink:0}}>
    <div style={{width:13,height:13,borderRadius:"50%",background:"white",position:"absolute",top:2,left:v?17:2,transition:"left 0.2s",boxShadow:"0 1px 3px rgba(0,0,0,0.2)"}}/>
  </div>;
}
function FlgM({label,sub,v,set,amt}){
  return<div style={{display:"flex",alignItems:"center",gap:7,padding:"8px 10px",background:v?"#F0FDF4":"#F8FAFC",borderRadius:6,border:`1px solid ${v?"#86EFAC":"#E2E8F0"}`}}>
    <TogM v={v} set={set}/>
    <div style={{flex:1}}>
      <div style={{fontSize:15,fontWeight:v?600:400,color:v?"#166534":"#374151"}}>{label}</div>
      <div style={{fontSize:15,color:"#94A3B8"}}>{sub}</div>
    </div>
    {amt&&<span style={{fontSize:15,fontWeight:700,color:"#059669"}}>{amt}</span>}
  </div>;
}
function SRM({l,v,muted,green,plain}){
  return<div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
    <span style={{fontSize:13,color:"#94A3B8"}}>{l}</span>
    <span style={{fontSize:13,fontWeight:plain?400:600,color:green?"#059669":muted?"#64748B":"#0B2343"}}>{v}</span>
  </div>;
}
