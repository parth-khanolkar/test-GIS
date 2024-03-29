// True Data
export default function handler(req, res) {
    res.status(200).json({ 
      Data: {
        Date: [  "5/18/2023 12:00:00 AM", "5/19/2023 12:00:00 AM", "5/22/2023 12:00:00 AM", "5/23/2023 12:00:00 AM",   "5/24/2023 12:00:00 AM", "5/25/2023 12:00:00 AM", "5/26/2023 12:00:00 AM", "5/29/2023 12:00:00 AM",   "5/30/2023 12:00:00 AM", "5/31/2023 12:00:00 AM", "6/1/2023 12:00:00 AM", "6/2/2023 12:00:00 AM",   "6/5/2023 12:00:00 AM", "6/6/2023 12:00:00 AM", "6/7/2023 12:00:00 AM", "6/8/2023 12:00:00 AM",   "6/9/2023 12:00:00 AM", "6/12/2023 12:00:00 AM", "6/13/2023 12:00:00 AM", "6/14/2023 12:00:00 AM",   "6/15/2023 12:00:00 AM", "6/16/2023 12:00:00 AM", "6/19/2023 12:00:00 AM", "6/20/2023 12:00:00 AM",   "6/21/2023 12:00:00 AM", "6/22/2023 12:00:00 AM", "6/23/2023 12:00:00 AM", "6/26/2023 12:00:00 AM",   "6/27/2023 12:00:00 AM", "6/28/2023 12:00:00 AM", "6/30/2023 12:00:00 AM", "7/3/2023 12:00:00 AM",   "7/4/2023 12:00:00 AM", "7/5/2023 12:00:00 AM", "7/6/2023 12:00:00 AM", "7/7/2023 12:00:00 AM",   "7/10/2023 12:00:00 AM", "7/11/2023 12:00:00 AM", "7/12/2023 12:00:00 AM", "7/13/2023 12:00:00 AM",   "7/14/2023 12:00:00 AM", "7/17/2023 12:00:00 AM", "7/18/2023 12:00:00 AM", "7/19/2023 12:00:00 AM",   "7/20/2023 12:00:00 AM", "7/21/2023 12:00:00 AM", "7/24/2023 12:00:00 AM", "7/25/2023 12:00:00 AM",   "7/26/2023 12:00:00 AM", "7/27/2023 12:00:00 AM", "7/28/2023 12:00:00 AM", "7/31/2023 12:00:00 AM",   "8/1/2023 12:00:00 AM", "8/2/2023 12:00:00 AM", "8/3/2023 12:00:00 AM", "8/4/2023 12:00:00 AM",   "8/7/2023 12:00:00 AM", "8/8/2023 12:00:00 AM", "8/9/2023 12:00:00 AM", "8/10/2023 12:00:00 AM",   "8/11/2023 12:00:00 AM", "8/14/2023 12:00:00 AM", "8/16/2023 12:00:00 AM", "8/17/2023 12:00:00 AM"],
        TotalVolume: [  1509132, 539230, 510340, 203177, 427610, 656668, 679225, 1529388, 402214, 1034439,  351250, 1408413, 1527532, 1664196, 1159336, 1041030, 685780, 3055993, 1079234, 1464610,  10567133, 1460899, 1235650, 1096926, 1046892, 825284, 728917, 857369, 2829249, 1760344,  3005367, 2479628, 1189306, 892934, 518513, 737668, 422301, 1398189, 1410128, 672948,  486347, 787425, 2445566, 1422291, 1284633, 501875, 954902, 558241, 892255, 1145465,  1481190, 966330, 2472375, 1454770, 509717, 325305, 652467, 644413, 880009, 728670,  1425983, 577093, 2085418, 1275960],
        DeliveryVolume: [  855629, 321561, 300628, 111426, 238202, 394558, 384132, 964586, 237147, 724469,  205858, 896933, 1042163, 1064851, 722422, 570106, 335411, 1775759, 755548, 865738,  5895343, 1007808, 744594, 664522, 595779, 451918, 404681, 595749, 2249856, 1055623,  2436191, 1536893, 671645, 472771, 350284, 440858, 260213, 1005634, 1181623, 379157,  249361, 461747, 1791808, 811249, 700589, 241064, 585860, 376974, 586901, 727442,  1098526, 530542, 2018055, 680179, 307189, 185215, 475840, 437030, 593625, 478938,  915359, 304732, 1041648, 651962]

      },
      Period:[
        {
          label: "1 M",
          value: "1M"
        },
        {
          label: "2 M",
          value: "2M"
        },
        {
          label: "3 M",
          value: "3M"
        },
        {
          label: "6 M",
          value: "6M"
        },
        {
          label: "12 M",
          value: "12M"
        },
        {
          label: "YTD",
          value: "YTD"
        },
        {
          label: "Custom",
          value: "Custom"
        },
        {
          label: "MAX",
          value: "MAX"
        }
      ],
      Selected_Period:{
        label:"3 M",
        value:"3M"
      }
      
    })
  }

// Testing Data
// export default function handler(req, res) {
  // res.status(200).json({ Data: [
  //     {
        
  //       Date: "5/18/2023 12:00:00 AM",
  //       TotalVolume: "1509132",
  //       DeliveryVolume: "855629"
  // },
  //     {
        
  //       Date: "5/19/2023 12:00:00 AM",
  //       TotalVolume: "539230",
  //       DeliveryVolume: "321561"
  // },
  //     {
        
  //       Date: "5/22/2023 12:00:00 AM",
  //       TotalVolume: "510340",
  //       DeliveryVolume: "300628"
  // },
  //     {
        
  //       Date: "5/23/2023 12:00:00 AM",
  //       TotalVolume: "203177",
  //       DeliveryVolume: "111426"
  // },
  //     {
        
  //       Date: "5/24/2023 12:00:00 AM",
  //       TotalVolume: "427610",
  //       DeliveryVolume: "238202"
  // },
  //     {
        
  //       Date: "5/25/2023 12:00:00 AM",
  //       TotalVolume: "656668",
  //       DeliveryVolume: "394558"
  // },
  //     {
        
  //       Date: "5/26/2023 12:00:00 AM",
  //       TotalVolume: "679225",
  //       DeliveryVolume: "384132"
  // },
  //     {
        
  //       Date: "8/17/2023 12:00:00 AM",
  //       TotalVolume: "1275960",
  //       DeliveryVolume: "651962"
  // }
  //   ] })
// }