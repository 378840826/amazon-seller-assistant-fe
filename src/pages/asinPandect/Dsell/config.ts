// connecticu的连接线坐标
const connecticutData = [{
  fromName: 'luoyang',
  // toName: 'linfen',
  coords: [
    [-72.1, 41.8],
    [-68.5, 36.8],
    [-67.2, 36.8],
  ],
}];

// vermont的连接线坐标
const vermontData = [
  {
    fromName: 'luoyang',
    coords: [
      [-73, 44.5],
      [-73, 46.3],
    ],
  },
];

// massachusetts的连接线坐标
const massachusettsData = [{
  fromName: 'luoyang',
  coords: [
    [-71, 42.2],
    [-65, 42.2],
  ],
}];

// New Hampshire的连接线坐标
const newHampshireData = [
  {
    fromName: 'luoyang',
    coords: [
      [-71.2, 44.5],
      [-71.2, 46.3],
    ],
  },
];

// Rhode Island的连接线坐标
const rhodeIslandData = [{
  fromName: 'luoyang',
  coords: [
    [-71.5, 41.6],
    // [-71.5, 39.3],
    [-66.2, 39.3],
    [-65, 39.3],
  ],
}];


// New Jersey的连接线坐标
// const newJerseyData = [{
//   fromName: 'luoyang',
//   coords: [
//     [-74.3, 39.8],
//     [-74.3, 37.6],
//     [-72.7, 37.6],
//   ],
// }];

// West Virginia的连接线坐标
const westVirginiaData = [{
  fromName: 'luoyang',
  coords: [
    [-80.3, 39.2],
    [-80.3, 44.6],
  ],
}];


// Delaware的连接线坐标
const delawareData = [{
  fromName: 'luoyang',
  coords: [
    [-75.6, 38.8],
    [-74.8, 38.8],
    [-71.8, 36.1],
    [-70.5, 36.1],
  ],
}];

// Maryland的连接线坐标
const marylandData = [{
  fromName: 'luoyang',
  coords: [
    [-75.5, 38.2],
    [-75.5, 32.3],
    [-74.1, 32.3],
  ],
}];

// South Carolina的连接线坐标
const southCarlinaData = [{
  fromName: 'luoyang',
  coords: [
    [-80.5, 32.8],
    [-79, 30],
    [-77.6, 30],
  ],
}];


// Washington, D.c.的连接线坐标
const dcData = [{
  fromName: 'luoyang',
  coords: [
    [-75.6, 39.1],
    [-74, 33.9],
    [-72.7, 33.9],
  ],
}];

/**
 * Maryland
 * @param name 州名
 * @param data 坐标数组对象
 */
function returnLineObj(name: string, data: {}) {
  return {
    name,
    type: 'lines',
    polyline: true,
    zlevel: 1,
    effect: {
      show: true,
      period: 6,
      trailLength: 0,
      symbolSize: 2,
    },
    lineStyle: {
      normal: {
        color: '#0083ff',
        width: 1,
        opacity: 0.3,
        curveness: 1.2,
      },
    },
    data,
    tooltip: {
      show: false,
    },
  };
}

// 地图初始化series线坐标配置
// 没有配置数据时，没不显示（根据是否返回州名来判断）
export function lineConfig(data: {state: string}[]) {
  const stateArr: string[] = []; // 州名
  const returnArr: {}[] = []; // 要返回的数组

  data.forEach(item => {
    stateArr.push(item.state);
  });

  if (stateArr.indexOf('Connecticut') !== -1) {
    returnArr.push(returnLineObj('Connecticut', connecticutData));
  }
  if (stateArr.indexOf('Vermont') !== -1) {
    returnArr.push(returnLineObj('Vermont', vermontData));
  }

  if (stateArr.indexOf('Massachusetts') !== -1) {
    returnArr.push(returnLineObj('Massachusetts', massachusettsData));
  }


  if (stateArr.indexOf('New Hampshire') !== -1) {
    returnArr.push(returnLineObj('New Hampshire', newHampshireData));
  }

  if (stateArr.indexOf('Rhode Island') !== -1) {
    returnArr.push(returnLineObj('Rhode Island', rhodeIslandData));
  }

  // if (stateArr.indexOf('New Jersey') !== -1) {
  //   returnArr.push(returnLineObj('New Jersey', newJerseyData));
  // }

  if (stateArr.indexOf('West Virginia') !== -1) {
    returnArr.push(returnLineObj('West Virginia', westVirginiaData));
  }

  if (stateArr.indexOf('Delaware') !== -1) {
    returnArr.push(returnLineObj('Delaware', delawareData));
  }

  if (stateArr.indexOf('Maryland') !== -1) {
    returnArr.push(returnLineObj('Maryland', marylandData));
  }

  if (stateArr.indexOf('South Carolina') !== -1) {
    returnArr.push(returnLineObj('SouthCarolina', southCarlinaData));
  }


  if (stateArr.indexOf('Washington, D.c.') !== -1) {
    returnArr.push(returnLineObj('Washingtondc', dcData));
  }

  return returnArr;
}

// 地图某些州名不显示出来
export const notShowConfig = [
  {
    name: 'Vermont',
    label: {
      show: false,
    },
  },
  {
    name: 'New Hampshire',
    label: {
      show: false,
    },
  },
  {
    name: 'Rhode Island',
    label: {
      show: false,
    },
  },
  {
    name: 'Connecticut',
    label: {
      show: false,
    },
  },
  {
    name: 'Delaware',
    label: {
      show: false,
    },
  },
  {
    name: 'Maryland',
    label: {
      show: false,
    },
  },
  {
    name: 'West Virginia',
    label: {
      show: false,
    },
  },
  // {
  //   name: 'District of Columbia',
  //   label: {
  //     show: false,
  //   },
  // },
];

// 模拟
export const barData = [
  { state: 'Oregon', quantity: '12', sales: '5' },
  { state: 'California', quantity: '33', sales: '94' },
  { state: 'Florida', quantity: '55', sales: '44' },
  { state: 'Maryland', quantity: '1', sales: '6' },
  { state: 'Arizona', quantity: '22', sales: '14' },
  { state: 'Texas', quantity: '134', sales: '47' },
  { state: 'Indiana', quantity: '4', sales: '20' },
  { state: 'Ohio', quantity: '115', sales: '16' },
  { state: 'Washington', quantity: '2', sales: '26' },
  { state: 'North Carolina', quantity: '14', sales: '14' },
  { state: 'Kentucky', quantity: '1', sales: '6' },
  { state: 'Illinois', quantity: '7', sales: '15' },
  { state: 'Michigan', quantity: '5', sales: '10' },
  { state: 'New Jersey', quantity: '4', sales: '8' },
  { state: 'Utah', quantity: '98', sales: '5' },
  { state: 'Wisconsin', quantity: '1', sales: '10' },
  { state: 'Connecticut', quantity: '5', sales: '1' },
  { state: 'Nevada', quantity: '3', sales: '1' },
  { state: 'Montana', quantity: '2', sales: '1' },
  { state: 'Colorado', quantity: null, sales: '10' },
  { state: 'Puerto Rico', quantity: null, sales: '2' },
  { state: 'Pennsylvania', quantity: null, sales: '11' },
  { state: 'Missouri', quantity: null, sales: '10' },
  { state: 'Virginia', quantity: null, sales: '11' },
  { state: 'Kansas', quantity: null, sales: '5' },
  { state: 'New Hampshire', quantity: null, sales: '2' },
  { state: 'Idaho', quantity: '33', sales: '3' },
  { state: 'Tennessee', quantity: null, sales: '5' },
  { state: 'South Carolina', quantity: null, sales: '6' },
  { state: 'New York', quantity: null, sales: '22' },
  { state: 'Minnesota', quantity: null, sales: '6' },
  { state: 'Maine', quantity: null, sales: '1' },
  { state: 'Iowa', quantity: null, sales: '4' },
  { state: 'Alaska', quantity: null, sales: '2' },
  { state: 'West Virginia', quantity: null, sales: '1' },
  { state: 'Massachusetts', quantity: null, sales: '11' },
  { state: 'Georgia', quantity: null, sales: '8' },
  { state: 'Louisiana', quantity: null, sales: '1' },
  { state: 'Vermont', quantity: null, sales: '5' },
  { state: 'New Mexico', quantity: null, sales: '4' },
  { state: 'Alabama', quantity: null, sales: '5' },
  { state: 'Oklahoma', quantity: null, sales: '2' },
  { state: 'North Dakota', quantity: null, sales: '1' },
  { state: 'Wyoming', quantity: null, sales: '1' },
  { state: 'Nebraska', quantity: null, sales: '3' },
  { state: 'Arkansas', quantity: null, sales: '1' },
  { state: 'Hawaii', quantity: 22, sales: '22' },
  { state: 'Mississippi', quantity: 22, sales: '22' },
  { state: 'South Dakota', quantity: 22, sales: '22' },
  { state: 'Delaware', quantity: 22, sales: '22' },
  { state: 'Rhode Island', quantity: 22, sales: '22' },
];
