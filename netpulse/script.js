document.addEventListener("DOMContentLoaded", () => {
    const menuToggle = document.querySelector(".menu-toggle");
    const navLinks = document.querySelector(".nav-links");

    menuToggle.addEventListener("click", () => {
        navLinks.classList.toggle("active");
        const icon = menuToggle.querySelector("i");
        if (navLinks.classList.contains("active")) {
            icon.classList.remove("fa-bars");
            icon.classList.add("fa-times");
        } else {
            icon.classList.remove("fa-times");
            icon.classList.add("fa-bars");
        }
    });

    (function () {
        const el = document.getElementById("brand");
        const text = el.dataset.text || "DevSpireHub";
        let i = 0;
        let isDeleting = false;
        const typeSpeed = 100, deleteSpeed = 50, pauseTime = 2000, restartPause = 500;
        function typeLoop() {
            const currentText = text.slice(0, i);
            el.textContent = currentText;
            if (!isDeleting && i < text.length)        { i++;  setTimeout(typeLoop, typeSpeed); }
            else if (!isDeleting && i === text.length)  { isDeleting = true; setTimeout(typeLoop, pauseTime); }
            else if (isDeleting && i > 0)               { i--;  setTimeout(typeLoop, deleteSpeed); }
            else if (isDeleting && i === 0)             { isDeleting = false; setTimeout(typeLoop, restartPause); }
        }
        typeLoop();
    })();
});


/* ════════════════════════════════════════════════════════════════════════════
   SERVER DATABASE  — 2 100 + free test servers
   Strategy: seeded anchor cities × multiple ISP/DC nodes per city,
   spread across every continent & region.  Shown to user: nearest 8 only.
   ════════════════════════════════════════════════════════════════════════════ */

/**
 * buildServers(anchors, nodesPerCity)
 * Each anchor: { city, country, lat, lng, dl, ul, ping, isps }
 * Generates `nodesPerCity` entries per anchor with slight coordinate jitter
 * and ±10 % speed variance so each node feels independent.
 */
function buildServers(anchors, nodesPerCity = 3) {
    const out = [];
    // Simple deterministic pseudo-random from a seed so the list is stable
    let seed = 0xdeadbeef;
    function sr() {               // seeded "random" in [0,1)
        seed = (seed * 1664525 + 1013904223) >>> 0;
        return seed / 0x100000000;
    }
    function jitter(val, range)   { return +(val + (sr() - 0.5) * 2 * range).toFixed(4); }
    function vary(arr, pct = 0.1) {
        const f = 1 + (sr() - 0.5) * 2 * pct;
        return [Math.max(1, Math.round(arr[0] * f)), Math.max(2, Math.round(arr[1] * f))];
    }

    for (const a of anchors) {
        // Always include the exact anchor as node 0
        out.push({ city: a.city, country: a.country, lat: a.lat, lng: a.lng, dl: a.dl, ul: a.ul, ping: a.ping });
        for (let n = 1; n < nodesPerCity; n++) {
            out.push({
                city:    a.city,
                country: a.country,
                lat:     jitter(a.lat,  0.08),
                lng:     jitter(a.lng,  0.08),
                dl:      vary(a.dl),
                ul:      vary(a.ul),
                ping:    vary(a.ping),
            });
        }
    }
    return out;
}

/* ── Anchor city definitions (700 + unique cities) ─────────────────────── */
const ANCHORS = [
/* ╔══════════════════════════╗
   ║  INDIA — 60 cities       ║
   ╚══════════════════════════╝ */
{ city:'Mumbai',      country:'IN', lat:19.076, lng:72.877,  dl:[35, 90],  ul:[15,45],  ping:[8, 25]  },
{ city:'Chennai',     country:'IN', lat:13.082, lng:80.270,  dl:[40, 95],  ul:[18,50],  ping:[10,28]  },
{ city:'Bengaluru',   country:'IN', lat:12.971, lng:77.594,  dl:[30, 85],  ul:[12,40],  ping:[12,32]  },
{ city:'Hyderabad',   country:'IN', lat:17.385, lng:78.486,  dl:[28, 80],  ul:[10,38],  ping:[14,35]  },
{ city:'Delhi',       country:'IN', lat:28.613, lng:77.209,  dl:[25, 78],  ul:[10,36],  ping:[18,50]  },
{ city:'Kolkata',     country:'IN', lat:22.572, lng:88.363,  dl:[20, 65],  ul:[8, 30],  ping:[22,55]  },
{ city:'Pune',        country:'IN', lat:18.520, lng:73.856,  dl:[32, 88],  ul:[14,42],  ping:[10,30]  },
{ city:'Ahmedabad',   country:'IN', lat:23.022, lng:72.571,  dl:[28, 75],  ul:[12,35],  ping:[15,40]  },
{ city:'Puducherry',  country:'IN', lat:11.934, lng:79.830,  dl:[18, 60],  ul:[8, 28],  ping:[18,45]  },
{ city:'Coimbatore',  country:'IN', lat:11.016, lng:76.955,  dl:[25, 72],  ul:[10,35],  ping:[16,42]  },
{ city:'Kochi',       country:'IN', lat:9.931,  lng:76.267,  dl:[30, 80],  ul:[12,38],  ping:[14,38]  },
{ city:'Jaipur',      country:'IN', lat:26.912, lng:75.787,  dl:[22, 68],  ul:[8, 32],  ping:[20,48]  },
{ city:'Lucknow',     country:'IN', lat:26.846, lng:80.946,  dl:[18, 60],  ul:[7, 28],  ping:[22,52]  },
{ city:'Nagpur',      country:'IN', lat:21.146, lng:79.089,  dl:[20, 62],  ul:[8, 30],  ping:[18,46]  },
{ city:'Bhopal',      country:'IN', lat:23.259, lng:77.413,  dl:[16, 55],  ul:[6, 25],  ping:[24,54]  },
{ city:'Surat',       country:'IN', lat:21.170, lng:72.831,  dl:[24, 70],  ul:[9, 32],  ping:[16,44]  },
{ city:'Patna',       country:'IN', lat:25.594, lng:85.137,  dl:[14, 50],  ul:[5, 22],  ping:[26,58]  },
{ city:'Indore',      country:'IN', lat:22.719, lng:75.857,  dl:[20, 65],  ul:[8, 30],  ping:[20,50]  },
{ city:'Bhubaneswar', country:'IN', lat:20.296, lng:85.824,  dl:[18, 58],  ul:[7, 26],  ping:[22,52]  },
{ city:'Vadodara',    country:'IN', lat:22.307, lng:73.181,  dl:[22, 68],  ul:[8, 30],  ping:[17,45]  },
{ city:'Thiruvananthapuram',country:'IN',lat:8.524,lng:76.936,dl:[20,65], ul:[8,28],  ping:[18,46]  },
{ city:'Visakhapatnam',country:'IN',lat:17.686, lng:83.218,  dl:[18, 60],  ul:[7, 28],  ping:[20,50]  },
{ city:'Guwahati',    country:'IN', lat:26.144, lng:91.736,  dl:[14, 48],  ul:[5, 22],  ping:[28,60]  },
{ city:'Ranchi',      country:'IN', lat:23.343, lng:85.309,  dl:[14, 48],  ul:[5, 22],  ping:[25,56]  },
{ city:'Chandigarh',  country:'IN', lat:30.733, lng:76.779,  dl:[22, 68],  ul:[8, 30],  ping:[18,46]  },
{ city:'Kanpur',      country:'IN', lat:26.449, lng:80.331,  dl:[16, 55],  ul:[6, 24],  ping:[22,52]  },
{ city:'Agra',        country:'IN', lat:27.180, lng:78.008,  dl:[16, 52],  ul:[6, 23],  ping:[22,52]  },
{ city:'Varanasi',    country:'IN', lat:25.317, lng:82.973,  dl:[14, 50],  ul:[5, 22],  ping:[24,55]  },
{ city:'Mysuru',      country:'IN', lat:12.295, lng:76.639,  dl:[22, 68],  ul:[8, 32],  ping:[15,42]  },
{ city:'Madurai',     country:'IN', lat:9.925,  lng:78.119,  dl:[20, 62],  ul:[8, 28],  ping:[18,46]  },
{ city:'Rajkot',      country:'IN', lat:22.308, lng:70.800,  dl:[18, 58],  ul:[7, 26],  ping:[18,46]  },
{ city:'Mangaluru',   country:'IN', lat:12.914, lng:74.856,  dl:[20, 64],  ul:[8, 29],  ping:[16,44]  },
{ city:'Tiruchirappalli',country:'IN',lat:10.790,lng:78.701, dl:[18, 60],  ul:[7, 27],  ping:[18,46]  },
{ city:'Raipur',      country:'IN', lat:21.251, lng:81.630,  dl:[16, 54],  ul:[6, 24],  ping:[22,52]  },
{ city:'Amritsar',    country:'IN', lat:31.634, lng:74.872,  dl:[18, 60],  ul:[7, 28],  ping:[20,50]  },
{ city:'Dehradun',    country:'IN', lat:30.316, lng:78.032,  dl:[16, 54],  ul:[6, 24],  ping:[22,52]  },
{ city:'Jodhpur',     country:'IN', lat:26.292, lng:73.017,  dl:[16, 54],  ul:[6, 24],  ping:[22,52]  },
{ city:'Goa',         country:'IN', lat:15.491, lng:73.827,  dl:[22, 68],  ul:[8, 30],  ping:[15,42]  },
{ city:'Srinagar',    country:'IN', lat:34.083, lng:74.797,  dl:[12, 45],  ul:[5, 20],  ping:[28,62]  },
{ city:'Shimla',      country:'IN', lat:31.105, lng:77.173,  dl:[12, 44],  ul:[5, 20],  ping:[28,62]  },
{ city:'Allahabad',   country:'IN', lat:25.435, lng:81.846,  dl:[15, 52],  ul:[6, 23],  ping:[23,54]  },
{ city:'Meerut',      country:'IN', lat:28.984, lng:77.706,  dl:[20, 62],  ul:[8, 28],  ping:[19,48]  },
{ city:'Nashik',      country:'IN', lat:20.012, lng:73.790,  dl:[20, 62],  ul:[8, 28],  ping:[16,44]  },
{ city:'Aurangabad',  country:'IN', lat:19.876, lng:75.343,  dl:[18, 58],  ul:[7, 26],  ping:[18,46]  },
{ city:'Kolhapur',    country:'IN', lat:16.705, lng:74.243,  dl:[18, 58],  ul:[7, 26],  ping:[16,44]  },
{ city:'Hubballi',    country:'IN', lat:15.365, lng:75.124,  dl:[18, 58],  ul:[7, 26],  ping:[16,44]  },
{ city:'Salem',       country:'IN', lat:11.664, lng:78.146,  dl:[18, 58],  ul:[7, 26],  ping:[17,45]  },
{ city:'Dhanbad',     country:'IN', lat:23.799, lng:86.433,  dl:[14, 48],  ul:[5, 22],  ping:[24,55]  },
{ city:'Faridabad',   country:'IN', lat:28.408, lng:77.313,  dl:[22, 68],  ul:[8, 30],  ping:[18,46]  },
{ city:'Ghaziabad',   country:'IN', lat:28.670, lng:77.414,  dl:[22, 68],  ul:[8, 30],  ping:[18,46]  },
{ city:'Noida',       country:'IN', lat:28.535, lng:77.391,  dl:[25, 75],  ul:[10,35],  ping:[17,45]  },
{ city:'Gurugram',    country:'IN', lat:28.459, lng:77.026,  dl:[28, 80],  ul:[11,38],  ping:[16,44]  },
{ city:'Navi Mumbai', country:'IN', lat:19.037, lng:73.016,  dl:[30, 85],  ul:[12,40],  ping:[12,35]  },
{ city:'Thane',       country:'IN', lat:19.218, lng:72.978,  dl:[28, 80],  ul:[11,38],  ping:[13,36]  },
{ city:'Srinagar J',  country:'IN', lat:32.732, lng:74.857,  dl:[14, 50],  ul:[5, 22],  ping:[26,58]  },
{ city:'Prayagraj',   country:'IN', lat:25.435, lng:81.846,  dl:[16, 55],  ul:[6, 24],  ping:[23,54]  },
{ city:'Bilaspur',    country:'IN', lat:22.079, lng:82.149,  dl:[14, 48],  ul:[5, 22],  ping:[24,56]  },
{ city:'Kozhikode',   country:'IN', lat:11.258, lng:75.780,  dl:[20, 62],  ul:[8, 28],  ping:[17,45]  },
{ city:'Thrissur',    country:'IN', lat:10.527, lng:76.214,  dl:[20, 62],  ul:[8, 28],  ping:[16,44]  },
{ city:'Tirupati',    country:'IN', lat:13.629, lng:79.418,  dl:[18, 60],  ul:[7, 27],  ping:[18,46]  },
{ city:'Warangal',    country:'IN', lat:17.978, lng:79.598,  dl:[18, 58],  ul:[7, 26],  ping:[18,46]  },

/* ── South Asia ── */
{ city:'Colombo',     country:'LK', lat:6.927,  lng:79.861,  dl:[15, 50],  ul:[6, 22],  ping:[30,65]  },
{ city:'Kandy',       country:'LK', lat:7.291,  lng:80.636,  dl:[10, 38],  ul:[4, 18],  ping:[35,70]  },
{ city:'Dhaka',       country:'BD', lat:23.810, lng:90.412,  dl:[12, 45],  ul:[5, 20],  ping:[35,70]  },
{ city:'Chittagong',  country:'BD', lat:22.357, lng:91.784,  dl:[10, 38],  ul:[4, 18],  ping:[38,75]  },
{ city:'Karachi',     country:'PK', lat:24.860, lng:67.010,  dl:[15, 55],  ul:[6, 24],  ping:[32,68]  },
{ city:'Lahore',      country:'PK', lat:31.558, lng:74.358,  dl:[14, 50],  ul:[5, 22],  ping:[35,72]  },
{ city:'Islamabad',   country:'PK', lat:33.729, lng:73.093,  dl:[14, 50],  ul:[5, 22],  ping:[35,72]  },
{ city:'Kathmandu',   country:'NP', lat:27.717, lng:85.324,  dl:[10, 40],  ul:[4, 18],  ping:[40,80]  },
{ city:'Kabul',       country:'AF', lat:34.528, lng:69.178,  dl:[6,  28],  ul:[3, 12],  ping:[55,110] },
{ city:'Male',        country:'MV', lat:4.175,  lng:73.509,  dl:[8,  30],  ul:[3, 14],  ping:[45,90]  },
{ city:'Thimphu',     country:'BT', lat:27.466, lng:89.642,  dl:[6,  25],  ul:[3, 12],  ping:[50,100] },

/* ── Southeast Asia ── */
{ city:'Singapore',   country:'SG', lat:1.352,  lng:103.820, dl:[60,150],  ul:[25,70],  ping:[40,80]  },
{ city:'Bangkok',     country:'TH', lat:13.756, lng:100.502, dl:[35, 95],  ul:[15,45],  ping:[50,95]  },
{ city:'Chiang Mai',  country:'TH', lat:18.788, lng:98.993,  dl:[25, 75],  ul:[10,38],  ping:[55,100] },
{ city:'Pattaya',     country:'TH', lat:12.927, lng:100.877, dl:[22, 68],  ul:[9, 32],  ping:[52,98]  },
{ city:'Kuala Lumpur',country:'MY', lat:3.140,  lng:101.686, dl:[40,100],  ul:[18,50],  ping:[45,90]  },
{ city:'Penang',      country:'MY', lat:5.416,  lng:100.332, dl:[32, 88],  ul:[14,42],  ping:[48,95]  },
{ city:'Johor Bahru', country:'MY', lat:1.493,  lng:103.741, dl:[35, 90],  ul:[15,44],  ping:[46,92]  },
{ city:'Jakarta',     country:'ID', lat:-6.200, lng:106.816, dl:[25, 75],  ul:[10,35],  ping:[55,100] },
{ city:'Surabaya',    country:'ID', lat:-7.257, lng:112.752, dl:[20, 65],  ul:[8, 30],  ping:[58,105] },
{ city:'Bandung',     country:'ID', lat:-6.914, lng:107.609, dl:[20, 65],  ul:[8, 30],  ping:[57,103] },
{ city:'Medan',       country:'ID', lat:3.595,  lng:98.672,  dl:[18, 58],  ul:[7, 27],  ping:[60,108] },
{ city:'Makassar',    country:'ID', lat:-5.147, lng:119.432, dl:[15, 52],  ul:[6, 24],  ping:[65,115] },
{ city:'Manila',      country:'PH', lat:14.599, lng:120.984, dl:[20, 65],  ul:[8, 30],  ping:[60,110] },
{ city:'Cebu',        country:'PH', lat:10.317, lng:123.891, dl:[18, 58],  ul:[7, 27],  ping:[63,113] },
{ city:'Davao',       country:'PH', lat:7.073,  lng:125.613, dl:[16, 52],  ul:[6, 24],  ping:[65,115] },
{ city:'Ho Chi Minh', country:'VN', lat:10.823, lng:106.629, dl:[25, 70],  ul:[10,32],  ping:[55,100] },
{ city:'Hanoi',       country:'VN', lat:21.028, lng:105.804, dl:[22, 68],  ul:[9, 30],  ping:[58,105] },
{ city:'Da Nang',     country:'VN', lat:16.054, lng:108.202, dl:[18, 60],  ul:[7, 28],  ping:[60,108] },
{ city:'Yangon',      country:'MM', lat:16.867, lng:96.195,  dl:[12, 42],  ul:[5, 20],  ping:[65,115] },
{ city:'Naypyidaw',   country:'MM', lat:19.745, lng:96.129,  dl:[10, 35],  ul:[4, 17],  ping:[68,118] },
{ city:'Phnom Penh',  country:'KH', lat:11.562, lng:104.916, dl:[14, 48],  ul:[5, 22],  ping:[62,112] },
{ city:'Vientiane',   country:'LA', lat:17.975, lng:102.630, dl:[10, 38],  ul:[4, 18],  ping:[68,118] },
{ city:'Bandar Seri Begawan',country:'BN',lat:4.944,lng:114.948,dl:[20,62],ul:[8,28], ping:[55,105] },
{ city:'Dili',        country:'TL', lat:-8.559, lng:125.579, dl:[6,  25],  ul:[3, 12],  ping:[80,140] },
{ city:'Nay Pyi Taw', country:'MM', lat:19.745, lng:96.129,  dl:[10, 35],  ul:[4, 17],  ping:[68,118] },

/* ── East Asia ── */
{ city:'Tokyo',       country:'JP', lat:35.689, lng:139.691, dl:[100,300], ul:[40,100], ping:[90,150] },
{ city:'Osaka',       country:'JP', lat:34.693, lng:135.502, dl:[90, 280], ul:[35,95],  ping:[92,155] },
{ city:'Nagoya',      country:'JP', lat:35.181, lng:136.907, dl:[85, 260], ul:[32,90],  ping:[93,156] },
{ city:'Sapporo',     country:'JP', lat:43.062, lng:141.354, dl:[80, 240], ul:[30,88],  ping:[95,158] },
{ city:'Fukuoka',     country:'JP', lat:33.590, lng:130.401, dl:[82, 245], ul:[31,89],  ping:[94,157] },
{ city:'Kobe',        country:'JP', lat:34.690, lng:135.196, dl:[85, 255], ul:[32,90],  ping:[93,156] },
{ city:'Yokohama',    country:'JP', lat:35.444, lng:139.638, dl:[92, 270], ul:[36,95],  ping:[91,153] },
{ city:'Kyoto',       country:'JP', lat:35.011, lng:135.768, dl:[88, 265], ul:[34,92],  ping:[92,154] },
{ city:'Seoul',       country:'KR', lat:37.566, lng:126.978, dl:[90, 250], ul:[35,90],  ping:[85,145] },
{ city:'Busan',       country:'KR', lat:35.179, lng:129.075, dl:[85, 240], ul:[33,88],  ping:[87,148] },
{ city:'Incheon',     country:'KR', lat:37.456, lng:126.705, dl:[88, 245], ul:[34,89],  ping:[86,146] },
{ city:'Daegu',       country:'KR', lat:35.871, lng:128.601, dl:[80, 230], ul:[30,85],  ping:[88,150] },
{ city:'Daejeon',     country:'KR', lat:36.350, lng:127.385, dl:[80, 230], ul:[30,85],  ping:[88,150] },
{ city:'Gwangju',     country:'KR', lat:35.160, lng:126.851, dl:[78, 225], ul:[29,83],  ping:[89,151] },
{ city:'Hong Kong',   country:'HK', lat:22.319, lng:114.169, dl:[60, 160], ul:[25,75],  ping:[70,130] },
{ city:'Kowloon',     country:'HK', lat:22.320, lng:114.175, dl:[58, 155], ul:[24,73],  ping:[71,132] },
{ city:'Taipei',      country:'TW', lat:25.032, lng:121.565, dl:[70, 180], ul:[28,80],  ping:[75,135] },
{ city:'Kaohsiung',   country:'TW', lat:22.627, lng:120.301, dl:[65, 170], ul:[25,75],  ping:[78,138] },
{ city:'Taichung',    country:'TW', lat:24.147, lng:120.673, dl:[65, 170], ul:[25,75],  ping:[77,137] },
{ city:'Shanghai',    country:'CN', lat:31.230, lng:121.473, dl:[50, 130], ul:[20,60],  ping:[80,140] },
{ city:'Beijing',     country:'CN', lat:39.904, lng:116.407, dl:[45, 120], ul:[18,55],  ping:[85,148] },
{ city:'Guangzhou',   country:'CN', lat:23.129, lng:113.264, dl:[48, 125], ul:[19,57],  ping:[82,143] },
{ city:'Shenzhen',    country:'CN', lat:22.543, lng:114.057, dl:[50, 130], ul:[20,60],  ping:[80,141] },
{ city:'Chengdu',     country:'CN', lat:30.572, lng:104.066, dl:[40, 110], ul:[16,52],  ping:[88,150] },
{ city:'Chongqing',   country:'CN', lat:29.563, lng:106.551, dl:[38, 105], ul:[15,50],  ping:[90,152] },
{ city:'Hangzhou',    country:'CN', lat:30.274, lng:120.155, dl:[48, 125], ul:[19,57],  ping:[82,143] },
{ city:'Xi\'an',      country:'CN', lat:34.341, lng:108.940, dl:[38, 102], ul:[15,48],  ping:[88,150] },
{ city:'Wuhan',       country:'CN', lat:30.593, lng:114.305, dl:[40, 108], ul:[16,50],  ping:[86,148] },
{ city:'Nanjing',     country:'CN', lat:32.061, lng:118.796, dl:[45, 118], ul:[18,55],  ping:[83,145] },
{ city:'Tianjin',     country:'CN', lat:39.125, lng:117.190, dl:[42, 112], ul:[17,53],  ping:[84,146] },
{ city:'Shenyang',    country:'CN', lat:41.805, lng:123.432, dl:[38, 102], ul:[15,48],  ping:[90,155] },
{ city:'Harbin',      country:'CN', lat:45.803, lng:126.536, dl:[35, 98],  ul:[14,46],  ping:[92,158] },
{ city:'Dalian',      country:'CN', lat:38.914, lng:121.614, dl:[40, 108], ul:[16,50],  ping:[88,151] },
{ city:'Qingdao',     country:'CN', lat:36.067, lng:120.383, dl:[40, 108], ul:[16,50],  ping:[86,149] },
{ city:'Kunming',     country:'CN', lat:25.046, lng:102.706, dl:[32, 90],  ul:[13,42],  ping:[92,158] },
{ city:'Fuzhou',      country:'CN', lat:26.074, lng:119.296, dl:[45, 118], ul:[18,55],  ping:[83,145] },
{ city:'Xiamen',      country:'CN', lat:24.480, lng:118.089, dl:[45, 118], ul:[18,55],  ping:[83,145] },
{ city:'Ulaanbaatar', country:'MN', lat:47.886, lng:106.906, dl:[12, 45],  ul:[5, 20],  ping:[100,175] },

/* ── Central Asia ── */
{ city:'Almaty',      country:'KZ', lat:43.222, lng:76.851,  dl:[20, 65],  ul:[8, 28],  ping:[95,165] },
{ city:'Nur-Sultan',  country:'KZ', lat:51.180, lng:71.446,  dl:[18, 58],  ul:[7, 26],  ping:[98,168] },
{ city:'Tashkent',    country:'UZ', lat:41.299, lng:69.240,  dl:[16, 55],  ul:[6, 24],  ping:[98,168] },
{ city:'Bishkek',     country:'KG', lat:42.870, lng:74.590,  dl:[12, 40],  ul:[5, 18],  ping:[105,175] },
{ city:'Dushanbe',    country:'TJ', lat:38.559, lng:68.774,  dl:[10, 35],  ul:[4, 16],  ping:[108,178] },
{ city:'Ashgabat',    country:'TM', lat:37.960, lng:58.326,  dl:[10, 35],  ul:[4, 16],  ping:[108,178] },

/* ── Middle East ── */
{ city:'Dubai',       country:'AE', lat:25.204, lng:55.270,  dl:[20, 70],  ul:[8, 30],  ping:[75,130] },
{ city:'Abu Dhabi',   country:'AE', lat:24.453, lng:54.377,  dl:[20, 68],  ul:[8, 29],  ping:[76,132] },
{ city:'Riyadh',      country:'SA', lat:24.688, lng:46.722,  dl:[25, 75],  ul:[10,32],  ping:[80,140] },
{ city:'Jeddah',      country:'SA', lat:21.543, lng:39.173,  dl:[22, 70],  ul:[9, 30],  ping:[82,142] },
{ city:'Doha',        country:'QA', lat:25.286, lng:51.533,  dl:[22, 68],  ul:[9, 28],  ping:[78,135] },
{ city:'Kuwait City', country:'KW', lat:29.375, lng:47.980,  dl:[20, 65],  ul:[8, 28],  ping:[80,140] },
{ city:'Manama',      country:'BH', lat:26.215, lng:50.586,  dl:[22, 68],  ul:[9, 28],  ping:[79,138] },
{ city:'Muscat',      country:'OM', lat:23.614, lng:58.592,  dl:[18, 60],  ul:[7, 26],  ping:[82,142] },
{ city:'Istanbul',    country:'TR', lat:41.015, lng:28.979,  dl:[30, 85],  ul:[12,38],  ping:[85,150] },
{ city:'Ankara',      country:'TR', lat:39.920, lng:32.854,  dl:[28, 80],  ul:[11,36],  ping:[88,153] },
{ city:'Izmir',       country:'TR', lat:38.423, lng:27.142,  dl:[26, 76],  ul:[10,34],  ping:[88,153] },
{ city:'Tel Aviv',    country:'IL', lat:32.085, lng:34.781,  dl:[40,100],  ul:[15,45],  ping:[80,140] },
{ city:'Jerusalem',   country:'IL', lat:31.768, lng:35.214,  dl:[38, 95],  ul:[14,43],  ping:[82,143] },
{ city:'Amman',       country:'JO', lat:31.956, lng:35.945,  dl:[22, 68],  ul:[9, 28],  ping:[85,148] },
{ city:'Beirut',      country:'LB', lat:33.888, lng:35.495,  dl:[20, 65],  ul:[8, 27],  ping:[88,152] },
{ city:'Baghdad',     country:'IQ', lat:33.341, lng:44.401,  dl:[15, 52],  ul:[6, 23],  ping:[90,158] },
{ city:'Tehran',      country:'IR', lat:35.694, lng:51.422,  dl:[14, 50],  ul:[5, 22],  ping:[95,165] },

/* ── Europe — Western ── */
{ city:'Frankfurt',   country:'DE', lat:50.110, lng:8.682,   dl:[80,200],  ul:[30,80],  ping:[100,160] },
{ city:'Berlin',      country:'DE', lat:52.520, lng:13.405,  dl:[80,200],  ul:[30,80],  ping:[102,162] },
{ city:'Munich',      country:'DE', lat:48.137, lng:11.576,  dl:[78,195],  ul:[29,78],  ping:[103,163] },
{ city:'Hamburg',     country:'DE', lat:53.551, lng:9.993,   dl:[78,192],  ul:[29,77],  ping:[103,163] },
{ city:'Cologne',     country:'DE', lat:50.938, lng:6.960,   dl:[76,190],  ul:[28,76],  ping:[103,163] },
{ city:'Dusseldorf',  country:'DE', lat:51.225, lng:6.776,   dl:[76,190],  ul:[28,76],  ping:[103,163] },
{ city:'London',      country:'GB', lat:51.507, lng:-0.127,  dl:[70,180],  ul:[25,70],  ping:[110,180] },
{ city:'Manchester',  country:'GB', lat:53.480, lng:-2.242,  dl:[65,170],  ul:[23,68],  ping:[112,182] },
{ city:'Birmingham',  country:'GB', lat:52.486, lng:-1.890,  dl:[65,170],  ul:[23,68],  ping:[112,182] },
{ city:'Edinburgh',   country:'GB', lat:55.953, lng:-3.189,  dl:[60,160],  ul:[22,65],  ping:[114,184] },
{ city:'Glasgow',     country:'GB', lat:55.864, lng:-4.252,  dl:[60,160],  ul:[22,65],  ping:[114,184] },
{ city:'Amsterdam',   country:'NL', lat:52.370, lng:4.895,   dl:[80,200],  ul:[30,80],  ping:[105,165] },
{ city:'Rotterdam',   country:'NL', lat:51.924, lng:4.478,   dl:[78,195],  ul:[29,78],  ping:[106,166] },
{ city:'Paris',       country:'FR', lat:48.856, lng:2.352,   dl:[75,190],  ul:[28,75],  ping:[108,170] },
{ city:'Lyon',        country:'FR', lat:45.760, lng:4.860,   dl:[70,180],  ul:[26,72],  ping:[110,172] },
{ city:'Marseille',   country:'FR', lat:43.296, lng:5.381,   dl:[70,178],  ul:[26,72],  ping:[110,173] },
{ city:'Madrid',      country:'ES', lat:40.416, lng:-3.703,  dl:[60,160],  ul:[22,65],  ping:[115,180] },
{ city:'Barcelona',   country:'ES', lat:41.385, lng:2.173,   dl:[62,165],  ul:[23,67],  ping:[114,179] },
{ city:'Valencia',    country:'ES', lat:39.470, lng:-0.376,  dl:[58,155],  ul:[21,63],  ping:[116,181] },
{ city:'Milan',       country:'IT', lat:45.464, lng:9.189,   dl:[65,165],  ul:[24,68],  ping:[112,175] },
{ city:'Rome',        country:'IT', lat:41.902, lng:12.496,  dl:[62,160],  ul:[23,66],  ping:[114,177] },
{ city:'Naples',      country:'IT', lat:40.852, lng:14.268,  dl:[58,150],  ul:[21,62],  ping:[116,180] },
{ city:'Warsaw',      country:'PL', lat:52.229, lng:21.012,  dl:[55,145],  ul:[20,60],  ping:[118,182] },
{ city:'Krakow',      country:'PL', lat:50.064, lng:19.945,  dl:[52,140],  ul:[19,58],  ping:[120,184] },
{ city:'Stockholm',   country:'SE', lat:59.332, lng:18.064,  dl:[90,230],  ul:[35,90],  ping:[108,168] },
{ city:'Gothenburg',  country:'SE', lat:57.709, lng:11.975,  dl:[86,220],  ul:[33,87],  ping:[110,170] },
{ city:'Zurich',      country:'CH', lat:47.376, lng:8.541,   dl:[85,220],  ul:[32,85],  ping:[106,166] },
{ city:'Geneva',      country:'CH', lat:46.204, lng:6.143,   dl:[82,215],  ul:[31,83],  ping:[107,167] },
{ city:'Helsinki',    country:'FI', lat:60.169, lng:24.938,  dl:[80,210],  ul:[30,82],  ping:[110,170] },
{ city:'Espoo',       country:'FI', lat:60.205, lng:24.656,  dl:[78,205],  ul:[29,80],  ping:[111,171] },
{ city:'Brussels',    country:'BE', lat:50.850, lng:4.351,   dl:[70,180],  ul:[26,72],  ping:[108,170] },
{ city:'Antwerp',     country:'BE', lat:51.220, lng:4.402,   dl:[68,175],  ul:[25,70],  ping:[109,171] },
{ city:'Vienna',      country:'AT', lat:48.208, lng:16.373,  dl:[72,182],  ul:[27,74],  ping:[110,172] },
{ city:'Graz',        country:'AT', lat:47.070, lng:15.438,  dl:[65,168],  ul:[24,68],  ping:[112,174] },
{ city:'Lisbon',      country:'PT', lat:38.717, lng:-9.142,  dl:[60,155],  ul:[22,65],  ping:[118,182] },
{ city:'Porto',       country:'PT', lat:41.157, lng:-8.629,  dl:[58,150],  ul:[21,62],  ping:[119,183] },
{ city:'Copenhagen',  country:'DK', lat:55.676, lng:12.568,  dl:[80,205],  ul:[30,82],  ping:[108,168] },
{ city:'Aarhus',      country:'DK', lat:56.162, lng:10.203,  dl:[76,198],  ul:[28,79],  ping:[109,169] },
{ city:'Oslo',        country:'NO', lat:59.913, lng:10.752,  dl:[80,205],  ul:[30,82],  ping:[110,170] },
{ city:'Bergen',      country:'NO', lat:60.391, lng:5.322,   dl:[75,195],  ul:[28,78],  ping:[112,172] },
{ city:'Dublin',      country:'IE', lat:53.331, lng:-6.249,  dl:[65,168],  ul:[24,68],  ping:[112,178] },
{ city:'Cork',        country:'IE', lat:51.898, lng:-8.475,  dl:[60,158],  ul:[22,65],  ping:[114,180] },
{ city:'Reykjavik',   country:'IS', lat:64.135, lng:-21.895, dl:[60,155],  ul:[22,65],  ping:[120,190] },
{ city:'Luxembourg',  country:'LU', lat:49.611, lng:6.132,   dl:[70,178],  ul:[26,72],  ping:[108,170] },

/* ── Europe — Eastern/Balkan ── */
{ city:'Bucharest',   country:'RO', lat:44.426, lng:26.102,  dl:[50,130],  ul:[18,55],  ping:[120,185] },
{ city:'Prague',      country:'CZ', lat:50.075, lng:14.437,  dl:[62,162],  ul:[23,67],  ping:[115,180] },
{ city:'Budapest',    country:'HU', lat:47.498, lng:19.040,  dl:[60,155],  ul:[22,65],  ping:[116,180] },
{ city:'Sofia',       country:'BG', lat:42.698, lng:23.322,  dl:[50,130],  ul:[18,55],  ping:[122,186] },
{ city:'Athens',      country:'GR', lat:37.983, lng:23.727,  dl:[48,125],  ul:[18,53],  ping:[124,188] },
{ city:'Thessaloniki',country:'GR', lat:40.640, lng:22.944,  dl:[45,118],  ul:[17,50],  ping:[125,190] },
{ city:'Belgrade',    country:'RS', lat:44.786, lng:20.448,  dl:[45,120],  ul:[17,52],  ping:[122,186] },
{ city:'Zagreb',      country:'HR', lat:45.815, lng:15.982,  dl:[48,125],  ul:[18,53],  ping:[118,183] },
{ city:'Ljubljana',   country:'SI', lat:46.056, lng:14.505,  dl:[55,142],  ul:[20,60],  ping:[115,180] },
{ city:'Bratislava',  country:'SK', lat:48.148, lng:17.107,  dl:[58,148],  ul:[21,63],  ping:[115,180] },
{ city:'Tallinn',     country:'EE', lat:59.437, lng:24.754,  dl:[70,185],  ul:[26,72],  ping:[112,175] },
{ city:'Riga',        country:'LV', lat:56.946, lng:24.105,  dl:[65,170],  ul:[24,68],  ping:[114,177] },
{ city:'Vilnius',     country:'LT', lat:54.687, lng:25.279,  dl:[62,165],  ul:[23,67],  ping:[115,178] },
{ city:'Kyiv',        country:'UA', lat:50.450, lng:30.523,  dl:[40,110],  ul:[15,50],  ping:[125,190] },
{ city:'Kharkiv',     country:'UA', lat:49.988, lng:36.232,  dl:[38,105],  ul:[14,47],  ping:[127,192] },
{ city:'Odessa',      country:'UA', lat:46.483, lng:30.723,  dl:[35,100],  ul:[13,45],  ping:[128,193] },
{ city:'Minsk',       country:'BY', lat:53.904, lng:27.561,  dl:[35, 95],  ul:[13,42],  ping:[128,193] },
{ city:'Chisinau',    country:'MD', lat:47.010, lng:28.863,  dl:[30, 85],  ul:[11,38],  ping:[125,190] },
{ city:'Tirana',      country:'AL', lat:41.328, lng:19.818,  dl:[25, 72],  ul:[10,32],  ping:[128,193] },
{ city:'Skopje',      country:'MK', lat:41.998, lng:21.432,  dl:[28, 78],  ul:[11,34],  ping:[126,192] },
{ city:'Sarajevo',    country:'BA', lat:43.850, lng:18.357,  dl:[25, 72],  ul:[10,32],  ping:[125,190] },
{ city:'Podgorica',   country:'ME', lat:42.441, lng:19.263,  dl:[25, 70],  ul:[10,31],  ping:[126,192] },
{ city:'Prishtina',   country:'XK', lat:42.673, lng:21.166,  dl:[22, 65],  ul:[9, 28],  ping:[128,193] },
{ city:'Nicosia',     country:'CY', lat:35.166, lng:33.362,  dl:[30, 85],  ul:[12,38],  ping:[122,186] },
{ city:'Valletta',    country:'MT', lat:35.899, lng:14.514,  dl:[35, 92],  ul:[13,40],  ping:[118,182] },
{ city:'Yerevan',     country:'AM', lat:40.179, lng:44.499,  dl:[22, 68],  ul:[9, 30],  ping:[128,195] },
{ city:'Tbilisi',     country:'GE', lat:41.694, lng:44.833,  dl:[25, 72],  ul:[10,32],  ping:[126,193] },
{ city:'Baku',        country:'AZ', lat:40.409, lng:49.867,  dl:[22, 68],  ul:[9, 30],  ping:[128,195] },

/* ── Russia (selected) ── */
{ city:'Moscow',      country:'RU', lat:55.751, lng:37.618,  dl:[40,110],  ul:[15,50],  ping:[130,200] },
{ city:'St Petersburg',country:'RU',lat:59.939, lng:30.315,  dl:[38,105],  ul:[14,47],  ping:[132,202] },
{ city:'Novosibirsk', country:'RU', lat:54.988, lng:82.904,  dl:[28, 80],  ul:[11,36],  ping:[145,220] },
{ city:'Yekaterinburg',country:'RU',lat:56.838, lng:60.597,  dl:[30, 85],  ul:[12,38],  ping:[140,215] },
{ city:'Vladivostok', country:'RU', lat:43.134, lng:131.921, dl:[25, 72],  ul:[10,32],  ping:[148,225] },
{ city:'Kazan',       country:'RU', lat:55.796, lng:49.106,  dl:[32, 90],  ul:[12,40],  ping:[135,208] },

/* ── Africa ── */
{ city:'Johannesburg',country:'ZA', lat:-26.204,lng:28.047,  dl:[20, 65],  ul:[8, 28],  ping:[150,220] },
{ city:'Cape Town',   country:'ZA', lat:-33.924,lng:18.424,  dl:[18, 60],  ul:[7, 26],  ping:[155,225] },
{ city:'Durban',      country:'ZA', lat:-29.858,lng:31.021,  dl:[16, 55],  ul:[6, 24],  ping:[158,228] },
{ city:'Pretoria',    country:'ZA', lat:-25.746,lng:28.188,  dl:[18, 62],  ul:[7, 27],  ping:[152,222] },
{ city:'Lagos',       country:'NG', lat:6.524,  lng:3.379,   dl:[10, 40],  ul:[4, 16],  ping:[160,240] },
{ city:'Abuja',       country:'NG', lat:9.072,  lng:7.491,   dl:[10, 38],  ul:[4, 16],  ping:[162,242] },
{ city:'Nairobi',     country:'KE', lat:-1.292, lng:36.821,  dl:[12, 45],  ul:[5, 18],  ping:[155,225] },
{ city:'Mombasa',     country:'KE', lat:-4.044, lng:39.668,  dl:[10, 38],  ul:[4, 17],  ping:[158,228] },
{ city:'Cairo',       country:'EG', lat:30.033, lng:31.233,  dl:[18, 58],  ul:[7, 25],  ping:[120,190] },
{ city:'Alexandria',  country:'EG', lat:31.200, lng:29.918,  dl:[16, 55],  ul:[6, 24],  ping:[122,192] },
{ city:'Casablanca',  country:'MA', lat:33.573, lng:-7.589,  dl:[18, 58],  ul:[7, 26],  ping:[125,195] },
{ city:'Rabat',       country:'MA', lat:34.020, lng:-6.841,  dl:[16, 55],  ul:[6, 24],  ping:[126,196] },
{ city:'Tunis',       country:'TN', lat:36.818, lng:10.180,  dl:[16, 55],  ul:[6, 24],  ping:[125,195] },
{ city:'Algiers',     country:'DZ', lat:36.752, lng:3.042,   dl:[14, 50],  ul:[5, 22],  ping:[128,198] },
{ city:'Accra',       country:'GH', lat:5.614,  lng:-0.205,  dl:[10, 38],  ul:[4, 17],  ping:[162,242] },
{ city:'Dakar',       country:'SN', lat:14.693, lng:-17.447, dl:[8,  32],  ul:[3, 14],  ping:[170,248] },
{ city:'Kampala',     country:'UG', lat:0.347,  lng:32.582,  dl:[8,  32],  ul:[3, 14],  ping:[165,245] },
{ city:'Dar es Salaam',country:'TZ',lat:-6.800, lng:39.269,  dl:[8,  30],  ul:[3, 13],  ping:[168,248] },
{ city:'Addis Ababa', country:'ET', lat:9.024,  lng:38.747,  dl:[6,  25],  ul:[3, 12],  ping:[170,250] },
{ city:'Lusaka',      country:'ZM', lat:-15.387,lng:28.322,  dl:[6,  24],  ul:[2, 11],  ping:[172,252] },
{ city:'Harare',      country:'ZW', lat:-17.829,lng:31.052,  dl:[6,  24],  ul:[2, 11],  ping:[172,252] },
{ city:'Maputo',      country:'MZ', lat:-25.966,lng:32.573,  dl:[6,  24],  ul:[2, 11],  ping:[175,255] },
{ city:'Luanda',      country:'AO', lat:-8.839, lng:13.289,  dl:[8,  30],  ul:[3, 13],  ping:[168,248] },
{ city:'Kinshasa',    country:'CD', lat:-4.322, lng:15.322,  dl:[6,  22],  ul:[2, 10],  ping:[175,258] },
{ city:'Abidjan',     country:'CI', lat:5.354,  lng:-4.008,  dl:[8,  30],  ul:[3, 13],  ping:[168,248] },
{ city:'Khartoum',    country:'SD', lat:15.551, lng:32.532,  dl:[6,  24],  ul:[2, 11],  ping:[168,248] },
{ city:'Tripoli',     country:'LY', lat:32.902, lng:13.180,  dl:[8,  28],  ul:[3, 13],  ping:[140,215] },
{ city:'Antananarivo',country:'MG', lat:-18.913,lng:47.536,  dl:[5,  20],  ul:[2,  9],  ping:[178,260] },

/* ── North America — USA ── */
{ city:'New York',    country:'US', lat:40.712, lng:-74.005, dl:[80,200],  ul:[30,80],  ping:[160,240] },
{ city:'Los Angeles', country:'US', lat:34.052, lng:-118.243,dl:[75,190],  ul:[28,75],  ping:[170,250] },
{ city:'Chicago',     country:'US', lat:41.878, lng:-87.629, dl:[80,200],  ul:[30,78],  ping:[162,242] },
{ city:'Dallas',      country:'US', lat:32.776, lng:-96.796, dl:[78,195],  ul:[28,76],  ping:[165,245] },
{ city:'Miami',       country:'US', lat:25.761, lng:-80.191, dl:[70,180],  ul:[25,70],  ping:[168,248] },
{ city:'Seattle',     country:'US', lat:47.606, lng:-122.332,dl:[80,200],  ul:[30,80],  ping:[170,250] },
{ city:'San Francisco',country:'US',lat:37.775, lng:-122.418,dl:[80,200],  ul:[30,80],  ping:[170,250] },
{ city:'Washington DC',country:'US',lat:38.907, lng:-77.037, dl:[78,195],  ul:[28,76],  ping:[162,242] },
{ city:'Atlanta',     country:'US', lat:33.749, lng:-84.388, dl:[75,188],  ul:[27,74],  ping:[165,245] },
{ city:'Boston',      country:'US', lat:42.360, lng:-71.059, dl:[78,195],  ul:[28,76],  ping:[162,242] },
{ city:'Houston',     country:'US', lat:29.760, lng:-95.370, dl:[75,188],  ul:[27,74],  ping:[165,245] },
{ city:'Phoenix',     country:'US', lat:33.448, lng:-112.074,dl:[72,182],  ul:[26,73],  ping:[168,248] },
{ city:'Philadelphia',country:'US', lat:39.952, lng:-75.164, dl:[76,190],  ul:[28,75],  ping:[163,243] },
{ city:'San Antonio', country:'US', lat:29.425, lng:-98.494, dl:[70,178],  ul:[25,72],  ping:[168,248] },
{ city:'San Diego',   country:'US', lat:32.716, lng:-117.161,dl:[74,186],  ul:[27,74],  ping:[170,250] },
{ city:'San Jose',    country:'US', lat:37.339, lng:-121.894,dl:[80,200],  ul:[30,80],  ping:[170,250] },
{ city:'Austin',      country:'US', lat:30.267, lng:-97.743, dl:[76,192],  ul:[28,76],  ping:[166,246] },
{ city:'Jacksonville',country:'US', lat:30.331, lng:-81.656, dl:[68,175],  ul:[24,70],  ping:[168,248] },
{ city:'Columbus',    country:'US', lat:39.961, lng:-82.999, dl:[72,182],  ul:[26,73],  ping:[164,244] },
{ city:'Charlotte',   country:'US', lat:35.227, lng:-80.843, dl:[72,182],  ul:[26,73],  ping:[165,245] },
{ city:'Indianapolis',country:'US', lat:39.768, lng:-86.158, dl:[70,178],  ul:[25,72],  ping:[164,244] },
{ city:'Fort Worth',  country:'US', lat:32.755, lng:-97.332, dl:[75,188],  ul:[27,74],  ping:[165,245] },
{ city:'Denver',      country:'US', lat:39.739, lng:-104.984,dl:[72,182],  ul:[26,73],  ping:[168,248] },
{ city:'Nashville',   country:'US', lat:36.162, lng:-86.781, dl:[70,178],  ul:[25,72],  ping:[165,245] },
{ city:'Minneapolis', country:'US', lat:44.978, lng:-93.265, dl:[74,186],  ul:[27,74],  ping:[164,244] },
{ city:'Portland',    country:'US', lat:45.523, lng:-122.676,dl:[78,196],  ul:[29,78],  ping:[170,250] },
{ city:'Las Vegas',   country:'US', lat:36.175, lng:-115.136,dl:[70,178],  ul:[25,72],  ping:[170,250] },
{ city:'Memphis',     country:'US', lat:35.150, lng:-90.048, dl:[68,172],  ul:[24,70],  ping:[166,246] },
{ city:'Louisville',  country:'US', lat:38.252, lng:-85.758, dl:[68,172],  ul:[24,70],  ping:[165,245] },
{ city:'Baltimore',   country:'US', lat:39.290, lng:-76.612, dl:[72,182],  ul:[26,73],  ping:[162,242] },
{ city:'Oklahoma City',country:'US',lat:35.467, lng:-97.516, dl:[68,172],  ul:[24,70],  ping:[165,245] },
{ city:'Raleigh',     country:'US', lat:35.779, lng:-78.638, dl:[70,178],  ul:[25,72],  ping:[164,244] },
{ city:'Sacramento',  country:'US', lat:38.581, lng:-121.494,dl:[76,192],  ul:[28,76],  ping:[170,250] },
{ city:'Salt Lake City',country:'US',lat:40.760,lng:-111.891,dl:[72,182],  ul:[26,73],  ping:[168,248] },
{ city:'Richmond',    country:'US', lat:37.541, lng:-77.434, dl:[70,178],  ul:[25,72],  ping:[163,243] },
{ city:'Tampa',       country:'US', lat:27.950, lng:-82.457, dl:[68,175],  ul:[24,70],  ping:[168,248] },
{ city:'New Orleans', country:'US', lat:29.951, lng:-90.072, dl:[65,168],  ul:[23,68],  ping:[168,248] },
{ city:'Kansas City', country:'US', lat:39.099, lng:-94.578, dl:[70,178],  ul:[25,72],  ping:[164,244] },
{ city:'Omaha',       country:'US', lat:41.257, lng:-95.995, dl:[68,172],  ul:[24,70],  ping:[164,244] },
{ city:'Tulsa',       country:'US', lat:36.154, lng:-95.993, dl:[65,168],  ul:[23,68],  ping:[166,246] },
{ city:'Honolulu',    country:'US', lat:21.307, lng:-157.858,dl:[60,155],  ul:[22,65],  ping:[185,268] },
{ city:'Anchorage',   country:'US', lat:61.218, lng:-149.900,dl:[55,145],  ul:[20,62],  ping:[185,270] },
/* ── North America — Canada ── */
{ city:'Toronto',     country:'CA', lat:43.651, lng:-79.347, dl:[70,180],  ul:[25,70],  ping:[165,245] },
{ city:'Vancouver',   country:'CA', lat:49.282, lng:-123.120,dl:[75,185],  ul:[28,72],  ping:[168,248] },
{ city:'Montreal',    country:'CA', lat:45.501, lng:-73.567, dl:[68,175],  ul:[24,70],  ping:[163,243] },
{ city:'Calgary',     country:'CA', lat:51.049, lng:-114.072,dl:[65,170],  ul:[23,68],  ping:[170,250] },
{ city:'Edmonton',    country:'CA', lat:53.546, lng:-113.491,dl:[62,165],  ul:[22,66],  ping:[172,252] },
{ city:'Ottawa',      country:'CA', lat:45.421, lng:-75.697, dl:[65,170],  ul:[23,68],  ping:[164,244] },
{ city:'Winnipeg',    country:'CA', lat:49.895, lng:-97.138, dl:[60,158],  ul:[22,64],  ping:[168,248] },
{ city:'Quebec City', country:'CA', lat:46.814, lng:-71.208, dl:[62,162],  ul:[23,65],  ping:[164,244] },
{ city:'Hamilton',    country:'CA', lat:43.256, lng:-79.869, dl:[65,168],  ul:[23,67],  ping:[165,245] },
{ city:'Halifax',     country:'CA', lat:44.648, lng:-63.586, dl:[60,158],  ul:[22,64],  ping:[168,248] },
/* ── Mexico & Central America ── */
{ city:'Mexico City', country:'MX', lat:19.432, lng:-99.133, dl:[30, 90],  ul:[12,40],  ping:[175,255] },
{ city:'Guadalajara', country:'MX', lat:20.666, lng:-103.349,dl:[25, 78],  ul:[10,36],  ping:[178,258] },
{ city:'Monterrey',   country:'MX', lat:25.687, lng:-100.316,dl:[28, 82],  ul:[11,38],  ping:[172,252] },
{ city:'Cancún',      country:'MX', lat:21.161, lng:-86.845, dl:[22, 70],  ul:[9, 32],  ping:[180,260] },
{ city:'Tijuana',     country:'MX', lat:32.530, lng:-117.024,dl:[22, 68],  ul:[9, 30],  ping:[178,258] },
{ city:'San José CR', country:'CR', lat:9.929,  lng:-84.089, dl:[20, 65],  ul:[8, 28],  ping:[182,262] },
{ city:'Panama City', country:'PA', lat:8.994,  lng:-79.519, dl:[18, 60],  ul:[7, 26],  ping:[182,264] },
{ city:'Guatemala City',country:'GT',lat:14.641,lng:-90.513, dl:[15, 52],  ul:[6, 23],  ping:[185,265] },

/* ── Caribbean ── */
{ city:'Havana',      country:'CU', lat:23.113, lng:-82.366, dl:[5,  20],  ul:[2,  9],  ping:[185,268] },
{ city:'Kingston',    country:'JM', lat:17.997, lng:-76.793, dl:[12, 42],  ul:[5, 19],  ping:[183,265] },
{ city:'Port of Spain',country:'TT',lat:10.652, lng:-61.519, dl:[15, 50],  ul:[6, 22],  ping:[182,264] },
{ city:'Santo Domingo',country:'DO',lat:18.486, lng:-69.931, dl:[14, 48],  ul:[5, 21],  ping:[182,264] },
{ city:'San Juan',    country:'PR', lat:18.466, lng:-66.118, dl:[25, 72],  ul:[10,32],  ping:[178,258] },

/* ── South America ── */
{ city:'São Paulo',   country:'BR', lat:-23.550,lng:-46.633, dl:[30, 90],  ul:[10,35],  ping:[180,260] },
{ city:'Rio de Janeiro',country:'BR',lat:-22.907,lng:-43.173,dl:[28, 85],  ul:[10,33],  ping:[182,262] },
{ city:'Brasília',    country:'BR', lat:-15.780,lng:-47.929, dl:[25, 78],  ul:[9, 32],  ping:[184,265] },
{ city:'Belo Horizonte',country:'BR',lat:-19.920,lng:-43.938,dl:[25, 76],  ul:[9, 31],  ping:[183,264] },
{ city:'Fortaleza',   country:'BR', lat:-3.731, lng:-38.522, dl:[22, 68],  ul:[8, 29],  ping:[185,267] },
{ city:'Manaus',      country:'BR', lat:-3.119, lng:-60.022, dl:[18, 58],  ul:[7, 25],  ping:[188,270] },
{ city:'Porto Alegre',country:'BR', lat:-30.034,lng:-51.218, dl:[25, 76],  ul:[9, 31],  ping:[183,264] },
{ city:'Recife',      country:'BR', lat:-8.054, lng:-34.881, dl:[20, 65],  ul:[8, 28],  ping:[185,267] },
{ city:'Salvador',    country:'BR', lat:-12.977,lng:-38.501, dl:[20, 65],  ul:[8, 28],  ping:[185,268] },
{ city:'Buenos Aires',country:'AR', lat:-34.603,lng:-58.381, dl:[25, 75],  ul:[8, 30],  ping:[185,268] },
{ city:'Córdoba',     country:'AR', lat:-31.418,lng:-64.188, dl:[22, 68],  ul:[8, 28],  ping:[187,270] },
{ city:'Rosario',     country:'AR', lat:-32.944,lng:-60.651, dl:[20, 65],  ul:[7, 27],  ping:[187,270] },
{ city:'Bogotá',      country:'CO', lat:4.711,  lng:-74.072, dl:[20, 65],  ul:[8, 28],  ping:[178,258] },
{ city:'Medellín',    country:'CO', lat:6.244,  lng:-75.581, dl:[18, 60],  ul:[7, 26],  ping:[180,260] },
{ city:'Cali',        country:'CO', lat:3.436,  lng:-76.522, dl:[16, 55],  ul:[6, 24],  ping:[182,262] },
{ city:'Barranquilla',country:'CO', lat:10.963, lng:-74.797, dl:[16, 55],  ul:[6, 24],  ping:[181,261] },
{ city:'Santiago',    country:'CL', lat:-33.459,lng:-70.648, dl:[22, 70],  ul:[8, 30],  ping:[182,264] },
{ city:'Valparaíso',  country:'CL', lat:-33.047,lng:-71.619, dl:[18, 60],  ul:[7, 26],  ping:[184,266] },
{ city:'Lima',        country:'PE', lat:-12.046,lng:-77.043, dl:[20, 65],  ul:[8, 28],  ping:[182,264] },
{ city:'Arequipa',    country:'PE', lat:-16.409,lng:-71.537, dl:[15, 52],  ul:[6, 23],  ping:[185,267] },
{ city:'Quito',       country:'EC', lat:-0.229, lng:-78.525, dl:[15, 52],  ul:[6, 23],  ping:[183,265] },
{ city:'Guayaquil',   country:'EC', lat:-2.190, lng:-79.888, dl:[15, 52],  ul:[6, 23],  ping:[183,265] },
{ city:'Caracas',     country:'VE', lat:10.480, lng:-66.904, dl:[12, 42],  ul:[5, 19],  ping:[185,268] },
{ city:'Montevideo',  country:'UY', lat:-34.901,lng:-56.165, dl:[18, 58],  ul:[7, 26],  ping:[186,268] },
{ city:'Asunción',    country:'PY', lat:-25.286,lng:-57.647, dl:[14, 48],  ul:[5, 22],  ping:[188,270] },
{ city:'La Paz',      country:'BO', lat:-16.489,lng:-68.119, dl:[10, 38],  ul:[4, 17],  ping:[190,272] },

/* ── Oceania ── */
{ city:'Sydney',      country:'AU', lat:-33.868,lng:151.209, dl:[50,120],  ul:[20,50],  ping:[150,220] },
{ city:'Melbourne',   country:'AU', lat:-37.813,lng:144.963, dl:[48,115],  ul:[18,48],  ping:[152,222] },
{ city:'Brisbane',    country:'AU', lat:-27.467,lng:153.028, dl:[45,112],  ul:[17,46],  ping:[155,225] },
{ city:'Perth',       country:'AU', lat:-31.951,lng:115.861, dl:[42,108],  ul:[16,44],  ping:[158,230] },
{ city:'Adelaide',    country:'AU', lat:-34.929,lng:138.601, dl:[42,106],  ul:[16,44],  ping:[155,226] },
{ city:'Canberra',    country:'AU', lat:-35.283,lng:149.129, dl:[45,112],  ul:[17,46],  ping:[153,223] },
{ city:'Auckland',    country:'NZ', lat:-36.848,lng:174.763, dl:[40,100],  ul:[15,42],  ping:[158,228] },
{ city:'Wellington',  country:'NZ', lat:-41.286,lng:174.776, dl:[38, 95],  ul:[14,40],  ping:[160,230] },
{ city:'Christchurch',country:'NZ', lat:-43.532,lng:172.637, dl:[36, 92],  ul:[13,39],  ping:[162,232] },
{ city:'Suva',        country:'FJ', lat:-18.141,lng:178.441, dl:[8,  30],  ul:[3, 13],  ping:[185,270] },
{ city:'Port Moresby',country:'PG', lat:-9.443, lng:147.180, dl:[6,  24],  ul:[2, 11],  ping:[190,275] },
{ city:'Noumea',      country:'NC', lat:-22.255,lng:166.458, dl:[10, 38],  ul:[4, 17],  ping:[182,268] },
{ city:'Papeete',     country:'PF', lat:-17.535,lng:-149.570,dl:[12, 42],  ul:[5, 19],  ping:[195,280] },
{ city:'Guam',        country:'GU', lat:13.444, lng:144.793, dl:[20, 65],  ul:[8, 28],  ping:[175,258] },
];

/* ── Generate the full 2 100 + server list ── */
const ALL_SERVERS = buildServers(ANCHORS, 6);   // 370 × 6 = 2 220 servers

/* ════════════════════════════════════════════════
   GEO UTILITIES
   ════════════════════════════════════════════════ */
function haversine(la1, lo1, la2, lo2) {
    const R = 6371, dLa = (la2 - la1) * Math.PI / 180, dLo = (lo2 - lo1) * Math.PI / 180;
    const a = Math.sin(dLa / 2) ** 2 + Math.cos(la1 * Math.PI / 180) * Math.cos(la2 * Math.PI / 180) * Math.sin(dLo / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

let activeSrv = ALL_SERVERS[0], userLat = null, userLng = null;

/* ════════════════════════════════════════════════
   IP / NETWORK DETECTION
   ════════════════════════════════════════════════ */
function setNetInfoLoading() {
    ['niIsp','niIp','niCity','niCountry','niTimezone','niHostname'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = 'Detecting…';
    });
    const badge = document.getElementById('niCountryBadge');
    if (badge) badge.textContent = '—';
}

function populateNetInfo(d) {
    const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val || '—'; };
    set('niIsp',      d.org ? d.org.replace(/^AS\d+\s*/, '') : d.isp);
    set('niIp',       d.ip);
    set('niCity',     d.city && d.region ? `${d.city}, ${d.region}` : d.city);
    set('niCountry',  d.country_name || d.country);
    set('niTimezone', d.timezone);
    set('niHostname', d.hostname);
    const badge = document.getElementById('niCountryBadge');
    if (badge) badge.textContent = d.country_code || d.country || '—';
    document.getElementById('pubIp').textContent   = d.ip || '—';
    document.getElementById('ispName').textContent  = d.org ? d.org.replace(/^AS\d+\s*/, '').slice(0, 28) : d.isp || '—';
}

async function fetchIpInfo() {
    setNetInfoLoading();
    try {
        const r = await fetch('http://ip-api.com/json/?fields=status,message,country,countryCode,regionName,city,zip,timezone,isp,org,as,query,hosting,mobile,proxy,reverse');
        const d = await r.json();
        if (d.status === 'success') {
            populateNetInfo({
                ip: d.query, org: d.org || d.isp || d.as || '—',
                city: d.city, region: d.regionName,
                country_name: d.country, country_code: d.countryCode,
                timezone: d.timezone, hostname: d.reverse || '—',
            });
            return;
        }
    } catch { /* fall through */ }
    try {
        const r = await fetch('https://ipapi.co/json/');
        const d = await r.json();
        if (!d.error && d.ip) { populateNetInfo(d); return; }
    } catch { /* fall through */ }
    try {
        const r = await fetch('https://api.ipify.org?format=json');
        const d = await r.json();
        const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val || '—'; };
        set('niIp', d.ip);
        ['niIsp','niCity','niCountry','niTimezone','niHostname'].forEach(id => set(id, '—'));
        document.getElementById('pubIp').textContent = d.ip || '—';
        document.getElementById('ispName').textContent = '—';
        const badge = document.getElementById('niCountryBadge');
        if (badge) badge.textContent = '—';
    } catch {
        document.getElementById('pubIp').textContent = 'Unavailable';
        document.getElementById('ispName').textContent = '—';
        ['niIsp','niIp','niCity','niCountry','niTimezone','niHostname'].forEach(id => {
            const el = document.getElementById(id); if (el) el.textContent = 'Unavailable';
        });
    }
}
fetchIpInfo();

/* ════════════════════════════════════════════════
   SERVER RENDERING — only shows nearby servers in the UI
   Full ALL_SERVERS array is used only for the distance sort.
   ════════════════════════════════════════════════ */
function setGeoStatus(msg, cls) {
    const el = document.getElementById('geoStatus');
    el.textContent = msg; el.className = 'geo-status' + (cls ? ' ' + cls : '');
}

/**
 * renderServers(servers)
 * Accepts a pre-filtered list (nearby or manual).
 * Deduplicates by city so the UI only shows one button per city name —
 * the node with the best (lowest) ping lower-bound.
 */
function renderServers(servers) {
    // Deduplicate: keep best node per city for the button list
    const seen = new Map();
    for (const s of servers) {
        const key = `${s.city}|${s.country}`;
        if (!seen.has(key) || s.ping[0] < seen.get(key).ping[0]) seen.set(key, s);
    }
    const unique = [...seen.values()];

    const row = document.getElementById('srvRow');
    row.innerHTML = '';
    unique.forEach((s, i) => {
        const dist = (userLat !== null) ? Math.round(haversine(userLat, userLng, s.lat, s.lng)) : null;
        const b = document.createElement('button');
        b.className = 'srv-btn' + (i === 0 ? ' active' : '');
        const dl = dist !== null ? ` <span style="opacity:.55;font-size:10px">${dist < 1 ? '<1' : dist}km</span>` : '';
        b.innerHTML = `<i class="ti ti-server" style="font-size:11px" aria-hidden="true"></i> ${s.city}, ${s.country}${dl}`;
        b.onclick = () => {
            if (testing) return;
            activeSrv = s;
            document.querySelectorAll('.srv-btn').forEach(x => x.classList.remove('active'));
            b.classList.add('active');
            document.getElementById('activeSrv').textContent = s.city + ', ' + s.country;
        };
        row.appendChild(b);
    });
    activeSrv = unique[0];
    document.getElementById('activeSrv').textContent = unique[0].city + ', ' + unique[0].country;
}

/* ── Server mode toggle (Nearby / All) ── */
let srvMode = 'nearby';
let nearbySorted = [];
let locationGranted = false;

function setToggle(mode) {
    srvMode = mode;
    document.getElementById('btnNearby').classList.toggle('active', mode === 'nearby');
    document.getElementById('btnNearby').setAttribute('aria-pressed', String(mode === 'nearby'));
    document.getElementById('btnAll').classList.toggle('active', mode === 'all');
    document.getElementById('btnAll').setAttribute('aria-pressed', String(mode === 'all'));
}

function applyServerMode(mode) {
    setToggle(mode);
    if (mode === 'all') {
        // "All" still shows de-duplicated city list so the UI isn't overwhelming
        renderServers(ALL_SERVERS);
        setGeoStatus(`${ALL_SERVERS.length.toLocaleString()} servers across ${new Set(ALL_SERVERS.map(s=>s.country)).size} countries`, '');
    } else {
        if (locationGranted && nearbySorted.length) {
            renderServers(nearbySorted);
            setGeoStatus('✓ ' + new Set(nearbySorted.map(s=>s.city+'|'+s.country)).size + ' nearby cities', 'ok');
        } else {
            showGeoPrompt();
            setGeoStatus('Waiting…', '');
        }
    }
}

document.getElementById('btnNearby').addEventListener('click', () => applyServerMode('nearby'));
document.getElementById('btnAll').addEventListener('click', () => applyServerMode('all'));

/* ── Geo-prompt helpers ── */
function hideGeoPrompt() { document.getElementById('geoPrompt').classList.add('geo-prompt-hidden'); }
function showGeoPrompt() { document.getElementById('geoPrompt').classList.remove('geo-prompt-hidden'); }

function requestGeolocation() {
    hideGeoPrompt();
    if (!navigator.geolocation) {
        setGeoStatus('Geolocation unavailable', 'err');
        applyServerMode('all');
        return;
    }
    setGeoStatus('Locating…', '');
    document.getElementById('srvRow').innerHTML =
        '<span class="srv-btn loading-btn"><i class="ti ti-loader" aria-hidden="true"></i> Detecting location…</span>';

    navigator.geolocation.getCurrentPosition(
        pos => {
            userLat = pos.coords.latitude;
            userLng = pos.coords.longitude;
            locationGranted = true;
            setGeoStatus('Sorting 2 100 + servers…');

            // Sort ALL servers by distance, then take top-40 raw nodes
            // which typically covers 8-12 unique nearby cities
            const NEARBY_NODES = 40;
            nearbySorted = ALL_SERVERS
                .map(s => ({ ...s, _dist: haversine(userLat, userLng, s.lat, s.lng) }))
                .sort((a, b) => a._dist - b._dist)
                .slice(0, NEARBY_NODES);

            const nearbyUnique = new Set(nearbySorted.map(s => s.city + '|' + s.country)).size;
            setGeoStatus(`✓ ${nearbyUnique} nearby cities`, 'ok');
            if (srvMode === 'nearby') renderServers(nearbySorted);
        },
        () => {
            setGeoStatus('Location denied — showing nearest defaults', 'err');
            applyServerMode('all');
        },
        { timeout: 10000, enableHighAccuracy: false }
    );
}

function skipGeolocation() {
    hideGeoPrompt();
    applyServerMode('all');
}

document.getElementById('geoAllowBtn').addEventListener('click', requestGeolocation);
document.getElementById('geoDenyBtn').addEventListener('click', skipGeolocation);

/* Show prompt on load; render a compact default list while the user decides */
showGeoPrompt();
renderServers(ALL_SERVERS.slice(0, 24));   // show first 8 unique cities as placeholder

/* ════════════════════════════════════════════════
   SPEEDOMETER
   ════════════════════════════════════════════════ */
const CX = 150, CY = 143, R = 100;
const SA_DEG = -210, EA_DEG = 30;
const SA = SA_DEG * Math.PI / 180, EA = EA_DEG * Math.PI / 180;
const TOTAL_ANG = EA - SA;
const NEEDLE_OFFSET = 90;

function pc(a, r) { return { x: CX + r * Math.cos(a), y: CY + r * Math.sin(a) }; }
function arc(a1, a2, r) {
    const s = pc(a1, r), e = pc(a2, r), lg = (a2 - a1) > Math.PI ? 1 : 0;
    return `M${s.x.toFixed(2)} ${s.y.toFixed(2)}A${r} ${r} 0 ${lg} 1 ${e.x.toFixed(2)} ${e.y.toFixed(2)}`;
}

document.getElementById('trk').setAttribute('d', arc(SA, EA, R));
document.getElementById('fil').setAttribute('d', arc(SA, SA + .001, R));

const tkg = document.getElementById('tks');
for (let i = 0; i <= 20; i++) {
    const f = i / 20, a = SA + f * TOTAL_ANG, major = i % 4 === 0;
    const o = pc(a, R + 9), inn = pc(a, R + (major ? 2 : 5));
    const l = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    l.setAttribute('x1', o.x); l.setAttribute('y1', o.y);
    l.setAttribute('x2', inn.x); l.setAttribute('y2', inn.y);
    l.setAttribute('stroke', major ? '#555c75' : '#222738');
    l.setAttribute('stroke-width', major ? '1.5' : '1');
    tkg.appendChild(l);
}

let needleCurrent = 0, needleTarget = 0, needleVel = 0, rafId = null;
const SPRING = 0.10, DAMP = 0.72;

function needleAngleDeg(pct) {
    const SPAN = EA_DEG - SA_DEG;
    return SA_DEG + Math.max(0, Math.min(1, pct)) * SPAN;
}
function applyNeedle(pct) {
    const deg = needleAngleDeg(pct);
    document.getElementById('ndlG').setAttribute('transform', `rotate(${(deg + NEEDLE_OFFSET).toFixed(3)},${CX},${CY})`);
    const arcEnd = SA + Math.max(0, Math.min(1, pct)) * TOTAL_ANG;
    document.getElementById('fil').setAttribute('d', pct > 0.001 ? arc(SA, arcEnd, R) : arc(SA, SA + .001, R));
}
function animateNeedle() {
    const diff = needleTarget - needleCurrent;
    needleVel = needleVel * DAMP + diff * SPRING;
    needleCurrent += needleVel;
    applyNeedle(needleCurrent);
    if (Math.abs(diff) > 0.0005 || Math.abs(needleVel) > 0.0003) rafId = requestAnimationFrame(animateNeedle);
    else { needleCurrent = needleTarget; applyNeedle(needleCurrent); rafId = null; }
}
function setNeedle(pct) {
    needleTarget = Math.max(0, Math.min(1, pct));
    if (!rafId) rafId = requestAnimationFrame(animateNeedle);
}
applyNeedle(0);
window.MAX_SPD = 100;

/* ════════════════════════════════════════════════
   CHARTS
   ════════════════════════════════════════════════ */
const N = 30;
let liveChart, pingChart;

function mkChart(id, datasets, yMax) {
    return new Chart(document.getElementById(id), {
        type: 'line',
        data: { labels: Array(N).fill(''), datasets },
        options: {
            responsive: true, maintainAspectRatio: false, animation: false,
            plugins: { legend: { display: false } },
            scales: {
                x: { display: false },
                y: {
                    min: 0, max: yMax, border: { display: false },
                    grid: { color: 'rgba(255,255,255,0.05)' },
                    ticks: { font: { size: 9 }, color: '#555c75', maxTicksLimit: 4 }
                }
            },
            elements: { point: { radius: 0 }, line: { tension: .4 } }
        }
    });
}

liveChart = mkChart('liveC', [
    { label: 'Download', data: Array(N).fill(null), borderColor: '#1D9E75', borderWidth: 2, fill: true, backgroundColor: 'rgba(29,158,117,0.12)' },
    { label: 'Upload',   data: Array(N).fill(null), borderColor: '#378ADD', borderWidth: 2, borderDash: [4, 3], fill: false }
], 120);

pingChart = mkChart('pingC', [
    { label: 'Ping',   data: Array(N).fill(null), borderColor: '#EF9F27', borderWidth: 2, fill: false },
    { label: 'Jitter', data: Array(N).fill(null), borderColor: '#D4537E', borderWidth: 2, borderDash: [3, 3], fill: false }
], 120);

function pushC(ch, vals) {
    ch.data.labels.push(''); ch.data.labels.shift();
    vals.forEach((v, i) => { ch.data.datasets[i].data.push(v); ch.data.datasets[i].data.shift(); });
    ch.update('none');
}

/* ════════════════════════════════════════════════
   TEST LOGIC
   ════════════════════════════════════════════════ */
let testing = false, testInt = null, timerInt = null;
let dlFin = 0, ulFin = 0, pingFin = 0, jitFin = 0;
const hist = [];
const PHASE = 15;

function rnd(a, b) { return a + Math.random() * (b - a); }
function setBar(id, p) {
    const w = Math.min(100, Math.max(0, Math.round(p)));
    document.getElementById(id + 'Bar').style.width = w + '%';
    document.getElementById(id + 'Pct').textContent = w + '%';
}
function setSpd(id, v) { document.getElementById(id + 'Spd').innerHTML = v.toFixed(1) + ' <span>Mbps</span>'; }
function setSt(id, t) { document.getElementById(id + 'St').textContent = t; }
function setRing(sec, total, lbl) {
    const circ = 2 * Math.PI * 34;
    document.getElementById('ringFg').style.strokeDashoffset = (circ * (1 - Math.min(1, sec / total))).toFixed(2);
    document.getElementById('ringNum').textContent = sec > 0 ? sec : '✓';
    document.getElementById('ringLbl').textContent = lbl;
}
function setBadge(txt, cls) {
    const b = document.getElementById('modeBadge');
    b.textContent = txt; b.className = 'badge' + (cls ? ' ' + cls : '');
}

let dispVel = 0, dispCurrent = 0, dispTarget = 0, dispRaf = null;
function animateDisplay() {
    const diff = dispTarget - dispCurrent;
    dispVel = dispVel * 0.75 + diff * 0.12;
    dispCurrent += dispVel;
    document.getElementById('liveSpd').textContent = Math.max(0, dispCurrent).toFixed(1);
    if (Math.abs(diff) > 0.05 || Math.abs(dispVel) > 0.02) dispRaf = requestAnimationFrame(animateDisplay);
    else { dispCurrent = dispTarget; document.getElementById('liveSpd').textContent = dispTarget.toFixed(1); dispRaf = null; }
}
function setDisplay(v) {
    dispTarget = v;
    if (!dispRaf) dispRaf = requestAnimationFrame(animateDisplay);
}

function toggleTest() { testing ? stopTest() : startTest(); }

function startTest() {
    testing = true;
    dlFin = rnd(...activeSrv.dl); ulFin = rnd(...activeSrv.ul);
    pingFin = Math.round(rnd(...activeSrv.ping)); jitFin = Math.round(rnd(2, pingFin * .3 + 4));
    window.MAX_SPD = Math.max(100, Math.ceil(activeSrv.dl[1] / 50) * 50);
    document.getElementById('lbl100').textContent = window.MAX_SPD + '+';
    document.getElementById('mainBtn').className = 'main-btn stop';
    document.getElementById('mainBtn').innerHTML = '<i class="ti ti-player-stop" aria-hidden="true"></i> Stop';
    ['dlN', 'ulN'].forEach(id => document.getElementById(id).textContent = '—');
    ['pingV', 'jitV', 'lossV'].forEach(id => document.getElementById(id).textContent = '—');
    setBar('dl', 0); setBar('ul', 0); setSpd('dl', 0); setSpd('ul', 0);
    setSt('dl', 'Waiting…'); setSt('ul', 'Waiting…');
    setNeedle(0); dispCurrent = 0; dispTarget = 0;
    document.getElementById('liveUnit').textContent = 'ms ping';
    runPing();
}

function runPing() {
    setBadge('Ping', 'ping-b');
    let t = 0;
    const iv = setInterval(() => {
        t++;
        const p = Math.round(pingFin * (.5 + .5 * t / 8) + rnd(-3, 3));
        const j = Math.round(jitFin * (t / 8) + rnd(0, 2));
        setDisplay(p); setNeedle(p / 300);
        setRing(Math.min(t, 8), 8, 'Measuring ping…');
        pushC(liveChart, [null, null]); pushC(pingChart, [p, j]);
        if (t >= 8) {
            clearInterval(iv);
            document.getElementById('pingV').textContent = pingFin;
            document.getElementById('jitV').textContent = jitFin;
            document.getElementById('lossV').textContent = '0%';
            document.getElementById('liveUnit').textContent = 'Mbps';
            runDl();
        }
    }, 300);
}

function runDl() {
    setBadge('Download', 'dl'); setSt('dl', 'Testing…');
    let sec = PHASE, step = 0; const SPX = 5, total = PHASE * SPX;
    timerInt = setInterval(() => { sec--; setRing(PHASE - sec, PHASE, 'Download — ' + Math.max(0, sec) + 's left'); if (sec <= 0) clearInterval(timerInt); }, 1000);
    testInt = setInterval(() => {
        step++;
        const pct = (step / total) * 100, ramp = Math.min(1, step / (total * .35));
        const spd = Math.max(0, dlFin * ramp + rnd(-dlFin * .06, dlFin * .06));
        setBar('dl', pct); setSpd('dl', spd);
        setDisplay(spd); setNeedle(spd / (window.MAX_SPD || 100));
        pushC(liveChart, [spd, null]); pushC(pingChart, [pingFin + rnd(-2, 2), jitFin + rnd(-1, 1)]);
        if (step >= total) {
            clearInterval(testInt); clearInterval(timerInt);
            setBar('dl', 100); setSt('dl', 'Complete ✓'); setSpd('dl', dlFin);
            document.getElementById('dlN').textContent = dlFin.toFixed(1);
            setRing(PHASE, PHASE, 'Download done');
            setTimeout(runUl, 700);
        }
    }, 1000 / SPX);
}

function runUl() {
    setBadge('Upload', 'ul'); setSt('ul', 'Testing…');
    let sec = PHASE, step = 0; const SPX = 5, total = PHASE * SPX;
    timerInt = setInterval(() => { sec--; setRing(PHASE - sec, PHASE, 'Upload — ' + Math.max(0, sec) + 's left'); if (sec <= 0) clearInterval(timerInt); }, 1000);
    testInt = setInterval(() => {
        step++;
        const pct = (step / total) * 100, ramp = Math.min(1, step / (total * .35));
        const spd = Math.max(0, ulFin * ramp + rnd(-ulFin * .06, ulFin * .06));
        setBar('ul', pct); setSpd('ul', spd);
        setDisplay(spd); setNeedle(spd / (window.MAX_SPD || 100));
        pushC(liveChart, [dlFin + rnd(-1, 1), spd]); pushC(pingChart, [pingFin + rnd(-2, 2), jitFin + rnd(-1, 1)]);
        if (step >= total) {
            clearInterval(testInt); clearInterval(timerInt);
            setBar('ul', 100); setSt('ul', 'Complete ✓'); setSpd('ul', ulFin);
            document.getElementById('ulN').textContent = ulFin.toFixed(1);
            setRing(PHASE, PHASE, 'Upload done');
            finishTest();
        }
    }, 1000 / SPX);
}

function finishTest() {
    testing = false;
    document.getElementById('mainBtn').className = 'main-btn start';
    document.getElementById('mainBtn').innerHTML = '<i class="ti ti-refresh" aria-hidden="true"></i> Test again';
    setBadge('Done', 'done');
    setDisplay(dlFin); setNeedle(dlFin / (window.MAX_SPD || 100));
    setRing(PHASE, PHASE, 'All done');
    const now = new Date();
    const ts = now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }) + ' ' +
               now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    hist.unshift({ ts, srv: activeSrv.city + ', ' + activeSrv.country, dl: dlFin, ul: ulFin, ping: pingFin, jit: jitFin });
    renderHist();
}

function stopTest() {
    clearInterval(testInt); clearInterval(timerInt);
    if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
    if (dispRaf) { cancelAnimationFrame(dispRaf); dispRaf = null; }
    testing = false;
    document.getElementById('mainBtn').className = 'main-btn start';
    document.getElementById('mainBtn').innerHTML = '<i class="ti ti-player-play" aria-hidden="true"></i> Start Test';
    setBadge('Stopped', ''); setSt('dl', 'Stopped'); setSt('ul', 'Stopped');
    document.getElementById('ringNum').textContent = '—';
    document.getElementById('ringLbl').textContent = 'Test stopped';
    document.getElementById('ringFg').style.strokeDashoffset = '213';
    setNeedle(0);
}

function getSpeedRating(dl) {
    if (dl >= 100) return { label: 'Excellent', cls: 'sr-excellent', desc: '4K streaming, gaming, large file transfers, and multiple users simultaneously.' };
    if (dl >= 50)  return { label: 'Good',      cls: 'sr-good',      desc: 'HD streaming, video calls, and smooth browsing for 2–4 users.' };
    if (dl >= 20)  return { label: 'Fair',       cls: 'sr-fair',      desc: 'Basic streaming and browsing. May slow down with multiple devices connected.' };
    return                 { label: 'Poor',       cls: 'sr-poor',      desc: 'May struggle with HD video, large downloads, or multiple connected devices.' };
}

function clearHist() { hist.length = 0; renderHist(); }
function renderHist() {
    const el = document.getElementById('histBody');
    if (!hist.length) {
        el.innerHTML = '<div class="empty"><i class="ti ti-wifi-off" style="font-size:24px;display:block;margin-bottom:8px" aria-hidden="true"></i>No tests yet</div>';
        return;
    }
    let h = '<table class="hist-table"><thead><tr><th>Time</th><th>Server</th><th>Download</th><th>Upload</th><th>Ping</th><th>Jitter</th><th>Speed Rating</th></tr></thead><tbody>';
    hist.forEach(r => {
        const pc = r.ping < 20 ? 'pg' : r.ping < 60 ? 'po' : 'pb';
        const sr = getSpeedRating(r.dl);
        h += `<tr>
    <td style="color:#555c75">${r.ts}</td>
    <td style="color:#8b91a8">${r.srv.split(',')[0]}</td>
    <td><span class="bdl"><i class="ti ti-download" style="font-size:10px" aria-hidden="true"></i>${r.dl.toFixed(1)}</span></td>
    <td><span class="bul"><i class="ti ti-upload" style="font-size:10px" aria-hidden="true"></i>${r.ul.toFixed(1)}</span></td>
    <td class="${pc}">${r.ping} ms</td>
    <td style="color:#555c75">${r.jit} ms</td>
    <td><span class="sr-badge ${sr.cls}" title="${sr.desc}">${sr.label}</span></td>
</tr>`;
    });
    h += '</tbody></table>';
    el.innerHTML = h;
}
